<template>
  <div>
    <el-row
      v-if="this.projectId !== undefined && this.getPermission !== true"
      style="height: 800px"
    >
      <el-col
        style="height: 800px"
        v-loading="loading"
        element-loading-text="您暂无权限查看此页面"
        element-loading-spinner="el-icon-loading"
      ></el-col>
    </el-row>
    <div v-if="this.getPermission === true">
      <PageHeader title="项目缺陷信息">
        <Search
          v-if="this.projectId !== undefined"
          placeholder="请输入缺陷名称"
          :query-search="querySearch"
          @search="searchDefect"
          @select-suggestion="selectSearch"
        ></Search>
        <el-button
          v-if="
          this.projectState !== '结束' &&
            this.projectState !== '已归档' &&
            this.projectState !== '申请立项' &&
            this.projectState !== '立项驳回' &&
            this.addPermission === true
        "
          type="primary"
          class="add-btn"
          @click="handleAdd"
        >新增</el-button>
      </PageHeader>

      <!-- <el-row v-if="this.projectId === undefined">
      <el-col :span="24">
        <el-tag type="success" effect="dark">请选择项目</el-tag>
      </el-col>
      </el-row>-->
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
          v-loading="infoLoading"
          :data="defects"
          highlight-current-row
          border
          stripe
          style="width: 100%"
        >
          <el-table-column type="index" label="序号" width="70px"></el-table-column>
          <el-table-column label="缺陷ID" prop="id"></el-table-column>
          <el-table-column label="缺陷名称" prop="name"></el-table-column>
          <el-table-column label="缺陷描述" prop="description"></el-table-column>
          <el-table-column label="缺陷状态" prop="stateName"></el-table-column>
          <el-table-column label="缺陷类型" prop="typeName"></el-table-column>
          <el-table-column label="缺陷级别" prop="levelName"></el-table-column>
          <el-table-column label="提交人" prop="creatorName"></el-table-column>
          <el-table-column label="处理人" prop="handlerName"></el-table-column>
          <el-table-column label="创建日期" prop="createdAt"></el-table-column>
          <el-table-column label="预定日期" prop="dueDate"></el-table-column>
          <el-table-column label="更新日期" prop="updatedAt"></el-table-column>
          <el-table-column
            fixed="right"
            label="操作"
            width="140px"
            v-if="
            this.projectState !== '结束' &&
              this.projectState !== '已归档' &&
              this.projectState !== '申请立项' &&
              this.projectState !== '立项驳回' &&
              (this.editPermission === true || this.handlePermission === true)
          "
          >
            <template slot-scope="scope">
              <el-button-group>
                <el-button
                  size="medium"
                  type="primary"
                  @click.stop="handleEdit(scope.$index, scope.row)"
                  icon="el-icon-edit"
                ></el-button>
                <el-button
                  size="medium"
                  type="success"
                  @click.stop="handleChangeState(scope.$index, scope.row)"
                  icon="el-icon-check"
                ></el-button>
              </el-button-group>
            </template>
          </el-table-column>
        </el-table>
      </Pagination>

      <!-- 新建缺陷 -->
      <el-dialog title="新增缺陷" :visible.sync="addFormVisible" :close-on-click-modal="false">
        <el-form
          @submit.native.prevent
          ref="addForm"
          :model="addForm"
          :rules="addFormRules"
          label-width="100px"
          class="demo-ruleForm"
        >
          <el-form-item label="缺陷名称" prop="name">
            <el-input v-model="addForm.name" placeholder="请填写缺陷名称" clearable :maxlength="maxNameLength" show-word-limit></el-input>
          </el-form-item>
          <el-form-item label="缺陷类型" prop="type">
            <el-select v-model="addForm.type" placeholder="请选择缺陷类型">
              <el-option v-for="item in type" :key="item.name" :label="item.name" :value="item.id"></el-option>
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
          <!-- <el-form-item label="提交人" prop="creatorName">
          <el-input v-model="addForm.creatorName" disabled></el-input>
          </el-form-item>-->
          <el-form-item label="预定日期" prop="dueDate">
            <el-date-picker
              v-model="addForm.due"
              placeholder="请选择交付日"
              type="datetime"
              format="yyyy-MM-dd HH:mm:ss"
              value-format="yyyy-MM-dd HH:mm:ss"
              :picker-options="pickerOptions"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="处理人" prop="handlerId">
            <el-select v-model="addForm.handlerId" placeholder="请选择缺陷处理人">
              <el-option
                v-for="item in members"
                :key="item.id"
                :label="item.realName"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="缺陷描述" prop="description">
            <el-input type="textarea" v-model="addForm.description" placeholder clearable :maxlength="maxDesLength" show-word-limit></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click.native="addFormVisible = false">取消</el-button>
          <el-button type="primary" @click.native="addDefectSubmit" :loading="submitLoading">提交</el-button>
        </div>
      </el-dialog>

      <!-- 编辑缺陷 -->
      <el-dialog title="编辑缺陷" :visible.sync="editFormVisible" :close-on-click-modal="false">
        <el-form
          @submit.native.prevent
          ref="editForm"
          :model="editForm"
          :rules="editFormRules"
          label-width="100px"
          class="demo-ruleForm"
        >
          <el-form-item label="缺陷名称" prop="name">
            <el-input v-model="editForm.name" placeholder="请填写缺陷名称" clearable :maxlength="maxNameLength" show-word-limit></el-input>
          </el-form-item>
          <el-form-item label="缺陷类型" prop="type">
            <el-select v-model="editForm.type" placeholder="请选择缺陷类型">
              <el-option v-for="item in type" :key="item.name" :label="item.name" :value="item.id"></el-option>
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
            <el-input type="textarea" v-model="editForm.description" placeholder clearable :maxlength="maxDesLength" show-word-limit></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click.native="editFormVisible = false">取消</el-button>
          <el-button type="primary" @click.native="editDefectSubmit" :loading="submitLoading">提交</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import PageHeader from "../../components/common/PageHeader";
import Search from "../../components/common/Search";
import Pagination from "../../components/common/Pagination";
import ProjectSYJ from "@/sys/models/project_syj";
import moment from "moment";
import util from "../../util/dateformat";
import { mapGetters } from "vuex";

export default {
  components: {
    PageHeader,
    Search,
    Pagination
  },
  data() {
    return {
      maxNameLength: 30,
      maxDesLength: 200,
      infoLoading: true,
      loading: true,
      page: 1,
      pageSize: 10,
      projectId: 1,
      username: "",
      userId: 1,
      defects: [],
      defectsLength: 0,
      type: [],
      selectedDefect: "",
      projectState: "",

      defectModal: [],

      // 权限相关
      getPermission: false,
      addPermission: false,
      editPermission: false,
      handlePermission: false,

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
      members: [],
      addFormVisible: false,
      submitLoading: false,

      addFormRules: {
        name: [
          {
            required: true,
            message: "请填写缺陷名称",
            trigger: "blur"
          }
        ],
        type: [
          {
            type: "number",
            required: true,
            message: "请选择缺陷类型",
            trigger: "blur"
          }
        ],
        level: [
          {
            type: "number",
            required: true,
            message: "请选择缺陷等级",
            trigger: "change"
          }
        ],
        handlerId: [
          {
            type: "number",
            required: true,
            message: "请选择缺陷处理人",
            trigger: "blur"
          }
        ],
        description: [
          {
            required: true,
            message: "请填写缺陷描述",
            trigger: "blur"
          }
        ],
        due: [
          {
            required: true,
            message: "请选择预定日期",
            trigger: "blur"
          }
        ]
      },

      addForm: {
        name: "",
        type: "",
        level: "",
        due: "",
        handlerId: "",
        description: ""
      },

      editFormVisible: false,
      editFormRules: {
        name: [
          {
            required: true,
            message: "请填写缺陷名称",
            trigger: "blur"
          }
        ],
        type: [
          {
            type: "number",
            required: true,
            message: "请选择缺陷类型",
            trigger: "blur"
          }
        ],
        level: [
          {
            type: "number",
            required: true,
            message: "请选择缺陷等级",
            trigger: "change"
          }
        ],
        description: [
          {
            required: true,
            message: "请填写缺陷描述",
            trigger: "blur"
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
    async getProjectPermissions() {
      const permissions = await ProjectSYJ.getPermission(this.projectId);
      console.log(permissions);
      permissions.forEach(permission => {
        if (permission.name === "查询项目缺陷信息") {
          this.getPermission = true;
        } else if (permission.name === "新增缺陷") {
          this.addPermission = true;
        } else if (permission.name === "修改缺陷信息") {
          this.editPermission = true;
        } else if (permission.name === "变更缺陷状态") {
          this.handlePermission = true;
        }
      });
    },

    handlePageChange(val) {
      this.page = val;
      this.getAllDefects("");
    },

    async getDefectModals() {
      this.defectModal = await ProjectSYJ.getDefectModal(this.projectId, "");
      this.defectsLength = this.defectModal.length;
    },

    // 项目搜索框
    querySearch(queryString, cb) {
      var defectModal = [];
      this.defectModal.forEach(item => {
        const obj = {};
        obj.id = item.id;
        obj.value = item.name;
        defectModal.push(obj);
      });
      console.log(defectModal);
      console.log(queryString);
      const results = queryString
        ? defectModal.filter(item => item.value.includes(queryString))
        : defectModal;
      cb(results);
    },

    async selectSearch(item) {
      this.selectedMember = item.id;
    },

    async searchDefect(keyword) {
      this.getAllDefects(keyword);
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

    async getAllDefects(keyword) {
      this.getDefectTypeModal();
      const res = await ProjectSYJ.getProjectDefects(
        this.page,
        this.pageSize,
        this.projectId,
        keyword
      );
  
      let i = 0;
      for (i = 0; i < res.items.length; i++) {
        res.items[i].dueDate = moment(res.items[i].due).format("YYYY-MM-DD");
        res.items[i].createdAt = moment(res.items[i].createdAt).format(
          "YYYY-MM-DD"
        );
        res.items[i].updatedAt = moment(res.items[i].updatedAt).format(
          "YYYY-MM-DD"
        );
        res.items[i].levelName = this.matchLevel(res.items[i].level);
        res.items[i].stateName = this.matchState(res.items[i].state);
        res.items[i].typeName = this.matchType(res.items[i].type);
        if (res.items[i].handlerName === null) {
          res.items[i].handlerName = "暂未处理";
        }
      }
      this.defects = res.items;
      this.infoLoading = false;
    },

    // 获取缺陷类型模态框
    async getDefectTypeModal() {
      const res = await ProjectSYJ.getAllDefectTypes();
      this.type = res;
    },

    async handleAdd() {
      this.addFormVisible = true;
      this.getDefectTypeModal();
      this.members = await ProjectSYJ.getDefectHandlers(this.projectId);
    },

    addDefect() {},

    addDefectSubmit() {
      this.$refs.addForm.validate(valid => {
        if (valid) {
          this.$confirm("确定提交吗？", "提示", {}).then(() => {
            this.submitLoading = true;
            const para = Object.assign({}, this.addForm);
            // para.due = util.formatDate.format(new Date(para.due), 'yyyy-MM-dd hh:mm:ss')
            console.log(para);
            ProjectSYJ.addProjectDefect(this.projectId, para).then(res => {
              this.addFormVisible = false;
              this.$message({
                message: "提交成功！",
                type: "success"
              });
              this.submitLoading = false;
              this.$refs["addForm"].resetFields();
              this.getAllDefects("");
            });
          });
        }
      });
    },

    handleEdit(index, row) {
      if (this.editPermission === true) {
        this.defectId = row.id;
        this.editFormVisible = true;
        this.editForm = Object.assign({}, row);
        this.getDefectTypeModal();
      } else {
        this.$message({
          type: "warning",
          message: "无权限编辑"
        });
      }
    },

    handleChangeState(index, row) {
      let changedState = {};
      // changedState.assigneeId = row.handlerId;
      // changedState.assigneeName = row.handlerName;
      // changedState.due = util.formatDate.format(new Date(row.due), 'yyyy-MM-dd hh:mm:ss')
      if (
        this.handlePermission === true &&
        row.stateName === "已修复" &&
        this.username === row.creatorName
      ) {
        changedState.action = "close";
        this.$confirm("确定关闭该缺陷吗", "提示", {}).then(() => {
          ProjectSYJ.changeDefectState(
            this.projectId,
            row.id,
            changedState
          ).then(() => {
            this.$message({
              message: "提交成功！",
              type: "success"
            });
            this.getAllDefects("");
          });
        });
      } else if (
        this.handlePermission === true &&
        row.stateName === "已分派" &&
        this.username === row.handlerName
      ) {
        changedState.action = "fix";
        this.$confirm("确定已修复该缺陷吗", "提示", {}).then(() => {
          ProjectSYJ.changeDefectState(
            this.projectId,
            row.id,
            changedState
          ).then(() => {
            this.$message({
              message: "提交成功！",
              type: "success"
            });
            this.getAllDefects("");
          });
        });
      } else {
        this.$message({
          type: "warning",
          message: "无权限更改状态"
        });
      }
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
              this.$refs["editForm"].resetFields();
              this.getAllDefects("");
            });
          });
        }
      });
    }
  },
  computed: {
    ...mapGetters(["user"])
  },
  mounted() {
    this.username = this.user.username;
    this.userId = this.user.userId;
    this.projectId = this.$route.query.projectId;
    this.projectState = this.$route.query.projectState;
    if (this.projectId === undefined) {
      this.$message({
        message: "请先选择项目！",
        type: "warning"
      });
    } else {
      this.getAllDefects("");
      this.getDefectModals();
    }
    this.getProjectPermissions();
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
