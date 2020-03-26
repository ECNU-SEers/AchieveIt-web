<template>
  <div>
    <PageHeader title="项目缺陷信息">
      <Search />
      <el-button type="primary" class="add-btn" @click="handleAdd">新增</el-button>
    </PageHeader>
    <!-- <p v-permission="{name:'查看系统消息',type:'disabled'}">Hello word</p>
        <p v-permission="'查看日志'">Hello word</p>
    <button v-permission="['修改信息','修改密码']">编辑</button>-->
    <!--工具条：搜索栏-->
    <Pagination>
      <el-table :data="defects" highlight-current-row border style="width: 100%">
        <el-table-column type="index" label="序号" width="70px"></el-table-column>
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
        <el-table-column fixed="right" label="操作" width="100px">
          <template slot-scope>
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
          <el-input v-model="addForm.name" placeholder="请填写缺陷名称"></el-input>
        </el-form-item>
        <el-form-item label="缺陷类型" prop="type">
          <el-select v-model="addForm.type.name" placeholder="请选择缺陷类型">
            <el-option
              v-for="item in type"
              :key="item.name"
              :label="item.name"
              :value="item.name"
            >
              <span style="float: left">{{ item.name }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{item.remark}}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="缺陷等级" prop="level">
          <el-select v-model="addForm.level.name" placeholder="请选择缺陷等级">
            <el-option
              v-for="item in level"
              :key="item.name"
              :label="item.name"
              :value="item.name"
            >
              <span style="float: left">{{ item.name }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{item.remark}}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="提交人" prop="creatorName">
          <el-input v-model="addForm.creatorName" placeholder="请填写缺陷名称" disabled></el-input>
        </el-form-item>
        <el-form-item label="创建日期" prop="createdAt">
          <el-date-picker v-model="addForm.createdAt" placeholder="请填写缺陷名称" type="date" disabled></el-date-picker>
        </el-form-item>
        <el-form-item label="预定日期" prop="due">
          <el-date-picker
            v-model="addForm.due"
            placeholder="请选择交付日"
            type="date"
            :picker-options="pickerOptions"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="缺陷描述" prop="description">
          <el-input type="textarea" v-model="addForm.description" placeholder></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="addFormVisible = false">取消</el-button>
        <el-button type="primary" @click.native="addDefectSubmit" :loading="submitLoading">提交</el-button>
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

export default {
  components: {
    PageHeader,
    Search,
    Pagination
  },
  data() {
    return {
      page: 1,
      pageSize: 10,
      projectId: 1,
      userName: "管理员",
      defects: [],
      type: [],
      level: [
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
            required: true,
            message: "请选择缺陷类型",
            triggle: "blur"
          }
        ],
        level: [
          {
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
            type: 'date',
            required: true,
            message: "请选择预定日期",
            triggle: "blur"
          }
        ]
      },

      addForm: {
        name: '',
        type: {
          name: ''
        },
        level: {
          name: ''
        },
        creatorName: '',
        createdAt: '',
        due: '',
        description: ''
      },
      
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now();
        }
      }
    };
  },
  methods: {
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

    async getAllDefects() {
      const res = await ProjectSYJ.getProjectDefects(
        this.page,
        this.pageSize,
        this.projectId
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
      this.addForm.createdAt = this.getNowFormatDate();
    },

    addDefect() {},

    addDefectSubmit() {
      this.$refs.addForm.validate(valid => {
        if (valid) {
          this.$confirm("确定提交吗？", "提示", {}).then(() => {
            this.submitLoading = true;
            const para = Object.assign({}, this.addForm);
            console.log(para);
            // const res = ProjectSYJ.addProjectDefect();
          });
        }
      });
    },

    handleEdit(index, row) {}
  },
  mounted() {
    this.getAllDefects();
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
  margin-left: 20px;
  border-radius: 3px;
  width: 80px;
}
</style>
