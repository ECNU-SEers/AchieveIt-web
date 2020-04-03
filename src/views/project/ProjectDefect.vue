<template>
  <div>
    <PageHeader title="项目缺陷信息">
      <Search
        v-if="this.projectId !== undefined"
        placeholder="请输入缺陷名称"
        :query-search="querySearch"
        @search="searchDefect"
        @select-suggestion="selectSearch"
      >
      </Search>
      <el-button
        v-if="
          this.projectState !== '结束' &&
            this.projectState !== '已归档' &&
            this.projectState !== '申请立项' &&
            this.projectState !== '立项驳回'
        "
        type="primary"
        class="add-btn"
        @click="handleAdd"
        >新增</el-button
      >
    </PageHeader>

    <el-row v-if="this.projectId === undefined">
      <el-col :span="24">
        <el-tag type="success" effect="dark">请选择项目</el-tag>
      </el-col>
    </el-row>
    <!-- <p v-permission="{name:'查看系统消息',type:'disabled'}">Hello word</p>
        <p v-permission="'查看日志'">Hello word</p>
    <button v-permission="['修改信息','修改密码']">编辑</button>-->
    <!--工具条：搜索栏-->
    <Pagination
      v-if="this.projectId !== undefined"
      :current-page.sync="page"
      :page-size="pageSize"
      :total="defectsLength"
      @page-change="handlePageChange"
    >
      <el-table
        v-if="this.projectId !== undefined"
        :data="defects"
        highlight-current-row
        border
        style="width: 100%"
      >
        <el-table-column
          type="index"
          label="序号"
          width="70px"
        ></el-table-column>
        <el-table-column label="缺陷ID" prop="id"></el-table-column>
        <el-table-column label="缺陷名称" prop="name"></el-table-column>
        <el-table-column label="缺陷描述" prop="description"></el-table-column>
        <el-table-column label="缺陷状态" prop="state"></el-table-column>
        <el-table-column label="缺陷类型" prop="type"></el-table-column>
        <el-table-column label="缺陷级别" prop="level"></el-table-column>
        <el-table-column label="提交人" prop="creatorName"></el-table-column>
        <el-table-column label="处理人" prop="handlerName"></el-table-column>
        <el-table-column label="创建日期" prop="createdAt"></el-table-column>
        <el-table-column label="预定日期" prop="due"></el-table-column>
        <el-table-column label="更新日期" prop="updatedAt"></el-table-column>
        <el-table-column
          fixed="right"
          label="操作"
          width="100px"
          v-if="
            this.projectState !== '结束' &&
              this.projectState !== '已归档' &&
              this.projectState !== '申请立项' &&
              this.projectState !== '立项驳回'
          "
        >
          <template slot-scope="scope">
            <el-button
              size="medium"
              type="primary"
              @click.stop="handleEdit(scope.$index, scope.row)"
              icon="el-icon-edit"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
    </Pagination>

    <!-- 新建缺陷 -->
    <el-dialog
      title="新增缺陷"
      :visible.sync="addFormVisible"
      :close-on-click-modal="false"
    >
      <el-form
        @submit.native.prevent
        ref="addForm"
        :model="addForm"
        :rules="addFormRules"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="缺陷名称" prop="name">
          <el-input
            v-model="addForm.name"
            placeholder="请填写缺陷名称"
          ></el-input>
        </el-form-item>
        <el-form-item label="缺陷类型" prop="type">
          <el-select v-model="addForm.type" placeholder="请选择缺陷类型">
            <el-option
              v-for="item in type"
              :key="item.name"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="缺陷等级" prop="level">
          <el-select v-model="addForm.level" placeholder="请选择缺陷等级">
            <el-option
              v-for="item in levelDB"
              :key="item.name"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="提交人" prop="creatorName">
          <el-input v-model="addForm.creatorName" disabled></el-input>
        </el-form-item>
        <el-form-item label="预定日期" prop="due">
          <el-date-picker
            v-model="addForm.due"
            placeholder="请选择交付日"
            type="datetime"
            format="yyyy-MM-dd HH:mm:ss"
            value-format="yyyy-MM-dd HH:mm:ss"
            :picker-options="pickerOptions"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="缺陷描述" prop="description">
          <el-input
            type="textarea"
            v-model="addForm.description"
            placeholder
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="addFormVisible = false">取消</el-button>
        <el-button
          type="primary"
          @click.native="addDefectSubmit"
          :loading="submitLoading"
          >提交</el-button
        >
      </div>
    </el-dialog>

    <!-- 编辑缺陷 -->
    <el-dialog
      title="编辑缺陷"
      :visible.sync="editFormVisible"
      :close-on-click-modal="false"
    >
      <el-form
        @submit.native.prevent
        ref="editForm"
        :model="editForm"
        :rules="editFormRules"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="缺陷名称" prop="name">
          <el-input
            v-model="editForm.name"
            placeholder="请填写缺陷名称"
          ></el-input>
        </el-form-item>
        <el-form-item label="缺陷类型" prop="type">
          <el-select v-model="editForm.type" placeholder="请选择缺陷类型">
            <el-option
              v-for="item in type"
              :key="item.name"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="缺陷等级" prop="level">
          <el-select v-model="editForm.level" placeholder="请选择缺陷等级">
            <el-option
              v-for="item in levelDB"
              :key="item.name"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="缺陷描述" prop="description">
          <el-input
            type="textarea"
            v-model="editForm.description"
            placeholder
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="editFormVisible = false">取消</el-button>
        <el-button
          type="primary"
          @click.native="editDefectSubmit"
          :loading="submitLoading"
          >提交</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
import PageHeader from "../../components/common/PageHeader";
import Search from "../../components/common/Search";
import Pagination from "../../components/common/Pagination";
import ProjectSYJ from "@/sys/models/project_syj";
import moment from "moment";
import util from "../../util/dateformat";

export default {
  components: {
    PageHeader,
    Search,
    Pagination
  },
  data() {
    return {
      page: 1,
      pageSize: 5,
      projectId: 1,
      userName: "管理员",
      userId: 1,
      defects: [],
      defectsLength: 0,
      type: [],
      selectedDefect: "",
      projectState: "",

      defectModal: [],

      stateDB: [
        {
          id: 1,
          name: "已开启",
          remark: "Open but not assigned"
        },
        {
          id: 2,
          name: "已分派",
          remark: "Assigned but not fixed"
        },
        {
          id: 3,
          name: "已修复",
          remark: "Fixed but not closed"
        },
        {
          id: 4,
          name: "已关闭",
          remark: "Closed"
        }
      ],
      levelDB: [
        {
          id: 1,
          name: "致命",
          remark: "Fatal defects"
        },
        {
          id: 2,
          name: "严重",
          remark: "Serious defects"
        },
        {
          id: 3,
          name: "一般",
          remark: "General defects"
        },
        {
          id: 4,
          name: "轻微",
          remark: "Minor defect"
        }
      ],

      defectOptions: [
        {
          defectName: "缺陷1",
          defectId: "id1"
        },
        {
          defectName: "缺陷2",
          defectId: "id2"
        },
        {
          defectName: "缺陷3",
          defectId: "id3"
        },
        {
          defectName: "缺陷4",
          defectId: "id4"
        }
      ],
      defectNameSearch: "",
      defectNameLoading: false,

      // 新增缺陷
      addFormVisible: false,
      submitLoading: false,

      addFormRules: {
        name: [
          {
            required: true,
            message: "请填写缺陷名称",
            triggle: "blur"
          }
        ],
        type: [
          {
            type: "number",
            required: true,
            message: "请选择缺陷类型",
            triggle: "blur"
          }
        ],
        level: [
          {
            type: "number",
            required: true,
            message: "请选择缺陷等级",
            triggle: "change"
          }
        ],
        description: [
          {
            required: true,
            message: "请填写缺陷描述",
            triggle: "blur"
          }
        ],
        due: [
          {
            required: true,
            message: "请选择预定日期",
            triggle: "blur"
          }
        ]
      },

      addForm: {
        name: "",
        type: "",
        level: "",
        creatorName: "",
        due: "",
        description: ""
      },

      editFormVisible: false,
      editFormRules: {
        name: [
          {
            required: true,
            message: "请填写缺陷名称",
            triggle: "blur"
          }
        ],
        type: [
          {
            type: "number",
            required: true,
            message: "请选择缺陷类型",
            triggle: "blur"
          }
        ],
        level: [
          {
            type: "number",
            required: true,
            message: "请选择缺陷等级",
            triggle: "change"
          }
        ],
        description: [
          {
            required: true,
            message: "请填写缺陷描述",
            triggle: "blur"
          }
        ]
      },

      editForm: {
        name: "",
        type: "",
        level: "",
        description: ""
      },
      defectId: 0,

      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now();
        }
      }
    };
  },
  methods: {
    handlePageChange(val) {
      this.page = val;
      this.getAllDefects();
    },

    async getDefectModals() {
      this.defectModal = await ProjectSYJ.getDefectModal(this.projectId, "");
      this.defectsLength = this.defectModal.length;
    },

    // 项目搜索框
    querySearch(queryString, cb) {
      console.log(this.defectModal);
      var defectModal = [];
      this.defectModal.forEach(item => {
        const obj = {};
        obj.id = item.outerId;
        obj.value = item.name;
        defectModal.push(obj);
      });
      console.log(defectModal);
      console.log(queryString);
      const results = queryString
        ? defectModal.filter(item => item.value.includes(queryString))
        : defectModal;
      // const results = [{value: '111'}];
      // cb([{ value: "111" }]);
      cb(results);
    },

    async selectSearch(item) {
      console.log("select search item-------");
      console.log(item);
      this.selectedDefect = item.id;
      // this.projects = await ProjectSYJ.searchOneProject(item.id);
      // console.log(this.projects);
    },

    async searchDefect(keyword) {
      this.defects = await ProjectSYJ.getProjectDefects(
        this.page,
        this.pageSize,
        this.projectId,
        keyword
      );
      // if(this.selectedProject !== "") {
      //   console.log("selected search");
      //   const res = await ProjectSYJ.searchOneProject(this.selectedProject);
      //   const tmplist = [];
      //   tmplist.push(res);
      //   this.projects = tmplist;
      // } else {
      //   console.log("keyword search");
      //   this.projects = await ProjectSYJ.getProjectList(this.pageNo, this.pageSize, this.userId, keyword);
      // }
    },

    getNowFormatDate() {
      var date = new Date();
      var seperator1 = "-";
      var year = date.getFullYear();
      var month = date.getMonth() + 1;
      var strDate = date.getDate();
      if (month >= 1 && month <= 9) {
        month = "0" + month;
      }
      if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
      }
      var currentdate = year + seperator1 + month + seperator1 + strDate;
      return currentdate;
    },

    matchLevel(levelId) {
      return this.levelDB[levelId - 1].name;
    },

    matchState(stateId) {
      return this.stateDB[stateId - 1].name;
    },

    matchType(typeId) {
      return this.type[typeId - 1].name;
    },

    async getAllDefects() {
      this.getDefectTypeModal();
      const keyword = "";
      const res = await ProjectSYJ.getProjectDefects(
        this.page,
        this.pageSize,
        this.projectId,
        keyword
      );

      this.defects = res.items;
      let i = 0;
      for (i = 0; i < this.defects.length; i++) {
        this.defects[i].due = moment(this.defects[i].due).format("YYYY-MM-DD");
        this.defects[i].createdAt = moment(this.defects[i].createdAt).format(
          "YYYY-MM-DD"
        );
        this.defects[i].updatedAt = moment(this.defects[i].updatedAt).format(
          "YYYY-MM-DD"
        );
        this.defects[i].level = this.matchLevel(this.defects[i].level);
        this.defects[i].state = this.matchState(this.defects[i].state);
        this.defects[i].type = this.matchType(this.defects[i].type);
      }
    },

    // 获取缺陷类型模态框
    async getDefectTypeModal() {
      const res = await ProjectSYJ.getAllDefectTypes();
      this.type = res;
    },

    handleAdd() {
      this.addFormVisible = true;
      this.getDefectTypeModal();
      this.addForm.creatorName = this.userName;
    },

    addDefect() {},

    addDefectSubmit() {
      this.$refs.addForm.validate(valid => {
        if (valid) {
          this.$confirm("确定提交吗？", "提示", {}).then(() => {
            this.submitLoading = true;
            const para = Object.assign({}, this.addForm);
            delete para.creatorName;
            para.handlerId = this.userId;
            // para.due = util.formatDate.format(new Date(para.due), 'yyyy-MM-dd hh:mm:ss')
            console.log(para);
            ProjectSYJ.addProjectDefect(this.projectId, para).then(res => {
              this.addFormVisible = false;
              this.$message({
                message: "提交成功！",
                type: "success"
              });
              this.getAllDefects();
            });
          });
        }
      });
    },

    handleEdit(index, row) {
      this.defectId = row.id;
      this.editFormVisible = true;
      this.editForm = Object.assign({}, row);
      this.getDefectTypeModal();
    },

    editDefectSubmit() {
      this.$refs.editForm.validate(valid => {
        if (valid) {
          this.$confirm("确认提交吗", "提示", {}).then(() => {
            this.submitLoading = true;
            const para = {};
            para.name = this.editForm.name;
            para.description = this.editForm.description;
            para.type = this.editForm.type;
            para.level = this.editForm.level;
            console.log(para);
            ProjectSYJ.updateProjectDefect(
              this.projectId,
              this.defectId,
              para
            ).then(res => {
              console.log(res);
              this.submitLoading = false;
              this.editFormVisible = false;
              this.$message({
                message: "提交成功！",
                type: "success"
              });
              this.getAllDefects();
            });
          });
        }
      });
    }
  },
  mounted() {
    this.projectId = this.$route.query.projectId;
    this.projectState = this.$route.query.projectState;
    if (this.projectId === undefined) {
      this.$message({
        message: "请先选择项目！",
        type: "warning"
      });
    } else {
      this.getAllDefects();
      this.getDefectModals();
    }
  }
};
</script>

<style scoped>
.el-form--inline .el-form-item {
  display: inline-block;
  margin-right: 10px;
  margin-left: 20px;
  margin-top: 30px;
}
.add-btn {
  height: 32px;
  margin-left: 20px;
  border-radius: 3px;
  width: 80px;
}
</style>
