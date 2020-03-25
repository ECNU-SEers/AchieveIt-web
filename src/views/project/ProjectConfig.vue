<template>
  <div>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>当前项目:007</span>
        <el-button
          style="float: right; padding: 3px 0"
          type="text"
          @click="editFormVisible = true"
          >编辑</el-button
        >
        <!--仅配置管理员可见-->
        <el-dialog title="项目配置信息" :visible.sync="editFormVisible">
          <el-form
            :model="ruleForm"
            :rules="rules"
            ref="ruleForm"
            label-width="120px"
            class="ruleForm"
          >
            <!-- 输入框 -->
            <el-form-item label="Git仓库地址" prop="GitAddress">
              <el-input v-model="ruleForm.GitAddress" clearable></el-input>
            </el-form-item>

            <!-- 输入框 -->
            <el-form-item label="虚拟机空间" prop="virtualSpace">
              <el-input v-model="ruleForm.virtualSpace" clearable></el-input>
            </el-form-item>

            <!-- 输入框 -->
            <el-form-item label="文件服务器目录" prop="fileCatalog">
              <el-input v-model="ruleForm.fileCatalog" clearable></el-input>
            </el-form-item>

            <el-form-item style="padding-left:45%;">
              <!--btn和基本信息中略不同，建议试下放右边-->
              <el-button
                type="primary"
                @click="submitForm('ruleForm')"
                style="margin-right:8%;"
                >确定</el-button
              >
              <el-button @click="changeFormVisible = false">取消</el-button>
            </el-form-item>
          </el-form>
        </el-dialog>
      </div>

      <el-table :data="tableData" :show-header="hiddenTableHeader">
        <el-table-column prop="name" label="名称" width="140">
        </el-table-column>
        <el-table-column prop="detail" label="详细信息"> </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      editFormVisible: false,
      formLabelWidth: "120px",

      tableData: [
        {
          name: "Git仓库地址",
          detail: "暂无数据"
        },
        {
          name: "虚拟机空间",
          detail: "暂无数据"
        },
        {
          name: "文件服务器目录",
          detail: "未生成"
        }
      ],

      ruleForm: {
        GitAddress: "",
        virtualSpace: "",
        fileCatalog: ""
      },

      hiddenTableHeader: false
    };
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          alert("submit!");
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    }
  }
};
</script>

<style scoped>
.text {
  font-size: 14px;
}

.item {
  margin-bottom: 18px;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}
.clearfix:after {
  clear: both;
}

.box-card {
  /* width: 480px; */
  margin: 20px 30px 30px 30px;
}

/*编辑 */
.ruleForm {
}
</style>
