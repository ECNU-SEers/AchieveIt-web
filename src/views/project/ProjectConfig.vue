<template>
  <div>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>当前项目ID: {{this.projectId}}</span>
        <el-button
          style="float: right; padding: 3px 0"
          type="text"
          @click="editFormVisible = true;edit()"
        >编辑</el-button>
        <!--仅配置管理员可见-->
        <el-dialog title="项目配置信息" :visible.sync="editFormVisible">
          <el-form :model="editForm" ref="editForm" label-width="120px" class="editForm">
            <!-- 输入框 -->
            <el-form-item label="Git仓库地址" prop="GitAddress">
              <el-input v-model="editForm.GitAddress" clearable></el-input>
            </el-form-item>

            <!-- 输入框 -->
            <el-form-item label="虚拟机空间" prop="virtualSpace">
              <el-input v-model="editForm.virtualSpace" clearable></el-input>
            </el-form-item>

            <!-- 布尔开关 仅第一次可修改 -->
            <el-form-item label="文件服务器目录" prop="fileCatalog">
              <el-tooltip :content="'当前情况: ' + editForm.fileAddValue" placement="top">
                <el-switch
                  ref="file"
                  v-model="editForm.fileAddValue"
                  active-value="true"
                  inactive-value="false"
                  :disabled="this.fileTrigger == false ? false:true"
                ></el-switch>
              </el-tooltip>
            </el-form-item>

            <!-- 布尔开关 仅第一次可修改 -->
            <el-form-item label="邮件" prop="email">
              <el-tooltip :content="'当前情况: ' + editForm.emailValue" placement="top">
                <el-switch
                  ref="file"
                  v-model="editForm.emailValue"
                  active-value="true"
                  inactive-value="false"
                  :disabled="this.emailTrigger == false ? false:true"
                ></el-switch>
              </el-tooltip>
            </el-form-item>

            <el-form-item style="padding-left:45%;">
              <!--btn和基本信息中略不同，建议试下放右边-->
              <el-button type="primary" @click="editSubmit()" style="margin-right:8%;">确定</el-button>
              <el-button @click="changeFormVisible = false">取消</el-button>
            </el-form-item>
          </el-form>
        </el-dialog>
      </div>

      <el-table :data="tableData" :show-header="hiddenTableHeader">
        <el-table-column prop="name" label="名称" width="140"></el-table-column>
        <el-table-column prop="detail" label="详细信息"></el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
import ProjectLW from "@/sys/models/project_lw";

export default {
  data() {
    return {
      editFormVisible: false,
      formLabelWidth: "120px",
      projectId: 1,
      fileTrigger: "true",
      emailTrigger: "true",
      git: "true",
      virtual: "true",
      done: "false",
      tableData: [
        {
          name: "Git仓库地址",
          detail: "暂无"
        },
        {
          name: "虚拟机空间",
          detail: "暂无"
        },
        {
          name: "文件服务器目录",
          detail: "暂无"
        },
        {
          name: "邮件",
          detail: "暂无"
        }
      ],

      editForm: {
        GitAddress: "",
        virtualSpace: "",
        fileAddValue: "",
        emailValue: ""
      },

      hiddenTableHeader: false
    };
  },
  mounted() {
    this.projectId = this.$route.query.projectId;
    //console.log(this.projectId);
    this.getConfig();
  },
  methods: {
    // 信息显示
    async getConfig() {
       this.fileTrigger=true;
      this.emailTrigger= true;
      this.git=true;
      this.virtual=true;
      const res = await ProjectLW.getConfig(this.projectId);
     // console.log("res.sMailConfirmed:"+res.isMailConfirmed);
      this.tableData[0].detail = res.gitRepoAddress;
      this.tableData[1].detail = res.virtualMachineSpace;
      if (res.gitRepoAddress == ("" || null)) this.git = false;
      else this.git = true;
      if (res.virtualMachineSpace == ("" || null)) this.virtual = false;
      else this.virtual = true;
     // console.log(
     //   "res.isFileServerDirConfirmed=" + res.isFileServerDirConfirmed
     // );
      if (res.isFileServerDirConfirmed == false) {
        this.fileTrigger = false;
        this.tableData[2].detail = res.fileServerDir + "  ( 配置状态:未完成 )";
      } else {
        this.tableData[2].detail = res.fileServerDir;
      }
     // console.log("res.isMailConfirmed=" + res.isMailConfirmed);
      if (res.isMailConfirmed == false) {
        this.emailTrigger = false;
        this.tableData[3].detail = res.mail + "  ( 配置状态:未完成 )";
      } else {
        this.tableData[3].detail = res.mail;
      }
    },

    //编辑
    edit() {
      this.editForm = {
        GitAddress: this.tableData[0].detail,
        virtualSpace: this.tableData[1].detail,
        fileAddValue: this.fileTrigger,
        emailValue: this.emailTrigger
      };
    },
    //确认编辑
    async editSubmit() {
      const res = await ProjectLW.editConfig(
        this.projectId,
        this.editForm.GitAddress,
        this.editForm.virtualSpace,
        this.editForm.fileAddValue,
        this.editForm.emailValue
      );
      this.editFormVisible = false;
      this.$message.success("修改成功");
      this.getConfig();
      if (
        this.editForm.fileAddValue === true &&
        this.editForm.emailValue === true &&
        this.editForm.GitAddress !== (null || "")&&
         this.editForm.virtualSpace !== (null || "")
      ) {
         if(this.git==false || this.virtual==false ){
          this.done = true;
          this.$message.success("配置完成");
         }
      }
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
</style>
