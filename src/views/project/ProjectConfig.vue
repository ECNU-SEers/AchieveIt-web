<template>
  <div>
    <el-row
      v-if="
        this.projectId !== undefined &&
          this.permissions.indexOf('管理项目配置信息') <= -1
      "
      style="height: 800px"
    >
      <el-col
        style="height: 800px"
        v-loading="loading"
        element-loading-text="您暂无权限查看此页面"
        element-loading-spinner="el-icon-loading"
      ></el-col>
    </el-row>
    <div v-if="this.permissions.indexOf('管理项目配置信息') > -1">
      <PageHeader title="项目配置信息" style="height:40px;"></PageHeader>
      <el-card
        v-loading="infoLoading"
        class="box-card"
        v-if="this.projectId !== undefined"
      >
        <div slot="header" class="clearfix">
          <span>当前项目ID: {{ this.outerId }}</span>
          <el-button
            style="float: right; padding: 3px 0"
            type="text"
            :disabled="this.projectStateTrigger == true ? false : true"
            v-if="
              this.permissions.indexOf('管理项目配置信息') > -1 &&
                this.projectState !== '申请归档' &&
                this.projectState !== '已归档' &&
                this.projectState !== '申请立项' &&
                this.projectState !== '立项驳回'
            "
            @click="
              editFormVisible = true;
              edit();
            "
            >编辑</el-button
          >
          <!--仅配置管理员可见-->
          <el-dialog title="项目配置信息" :visible.sync="editFormVisible">
            <el-form
              :model="editForm"
              ref="editForm"
              label-width="120px"
              class="editForm"
            >
              <!-- 输入框 -->
              <el-form-item label="Git仓库地址" prop="GitAddress">
                <el-input
                  v-model="editForm.GitAddress"
                  clearable
                  :maxlength="maxNameLength"
                  show-word-limit
                ></el-input>
              </el-form-item>

              <!-- 输入框 -->
              <el-form-item label="虚拟机空间" prop="virtualSpace">
                <el-input v-model="editForm.virtualSpace" clearable oninput = "value=value.replace(/[^\d]/g,'')" :maxlength="4" show-word-limit>
                  <i slot="suffix">GB</i>
                </el-input>
              </el-form-item>

              <!-- 布尔开关 仅第一次可修改 -->
              <el-form-item label="文件服务器目录" prop="fileCatalog">
                <el-tooltip
                  :content="'当前情况: ' + this.editForm.fileAddValue"
                  placement="top"
                >
                  <el-switch
                    ref="file"
                    v-model="editForm.fileAddValue"
                    :active-value="true"
                    :inactive-value="false"
                    :disabled="this.fileTrigger == false ? false : true"
                  ></el-switch>
                </el-tooltip>
              </el-form-item>

              <!-- 布尔开关 仅第一次可修改 -->
              <el-form-item label="邮件" prop="email">
                <el-tooltip
                  :content="'当前情况: ' + this.editForm.emailValue"
                  placement="top"
                >
                  <el-switch
                    ref="file"
                    v-model="editForm.emailValue"
                    :active-value="true"
                    :inactive-value="false"
                    :disabled="this.emailTrigger == false ? false : true"
                  ></el-switch>
                </el-tooltip>
              </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button @click="editFormVisible = false">取消</el-button>
              <el-button type="primary" @click="editSubmit()" style="margin-right:8%;">提交</el-button>
            </div>
          </el-dialog>
        </div>

        <el-table
          :data="tableData"
          :show-header="hiddenTableHeader"
          v-if="this.permissions.indexOf('查询项目配置信息') > -1"
        >
          <el-table-column
            prop="name"
            label="名称"
            width="140"
          ></el-table-column>
          <el-table-column prop="detail" label="详细信息"></el-table-column>
        </el-table>
      </el-card>
    </div>
  </div>
</template>

<script>
import ProjectLW from "@/sys/models/project_lw";
import PageHeader from "@/components/common/PageHeader";
import ProjectSYJ from "@/sys/models/project_syj";
import { mapGetters } from "vuex";

export default {
  components: {
    PageHeader
  },

  data() {
    return {
      maxNameLength: 100,
      infoLoading: true,
      loading: true,
      editFormVisible: false,
      formLabelWidth: "120px",
      projectId: "",
      outerId: "",
      projectState: "",

      fileTrigger: "",
      emailTrigger: "",

      fileTrigger: "true",
      emailTrigger: "true",

      fileTrigger: "",
      emailTrigger: "",

      git: "true",
      virtual: "true",
      done: "false",
      projectStateTrigger: "",
      permissions: [],
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
          detail: "暂无数据"
        },
        {
          name: "邮件",
          detail: "暂无数据"
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
  // computed: {
  //   ...mapGetters(["permissions"])
  // },
  mounted() {
    this.projectId = this.$route.query.projectId;
    this.outerId = this.$route.query.outerId;
    this.projectState = this.$route.query.projectState;
    if (this.projectId === undefined) {
      this.$message({
        message: "请先选择项目！",
        type: "warning"
      });
    } else {
      this.getMyPermissions(this.projectId);
      // console.log("getMypermission="+this.permissions);

      if (
        this.projectState != "申请立项" &&
        this.projectState != "立项驳回" &&
        this.projectState != "已归档"
      ) {
        this.projectStateTrigger = true;
      } else {
        this.projectStateTrigger = false;
      }
      console.log("projectStateTrigger=" + this.projectStateTrigger);
      if (this.projectState != "申请立项" && this.projectState != "立项驳回") {
        this.getConfig();
      }
    }
  },
  methods: {
    //获取用户当前项目权限
    async getMyPermissions() {
      const res = await ProjectLW.getMyPermissions(this.projectId);
      var obj = "";
      res.forEach(item => {
        obj = item.name;
        this.permissions.push(obj);
      });

      console.log("getMypermission=" + this.permissions);
    },

    // 信息显示
    async getConfig() {
      var _this = this;
      _this.fileTrigger = true;
      _this.emailTrigger = true;
      _this.git = true;
      _this.virtual = true;
      const res = await ProjectLW.getConfig(this.projectId);
      // console.log("res.sMailConfirmed:"+res.isMailConfirmed);
      if (res.gitRepoAddress == "" || res.gitRepoAddress == null) {
        _this.tableData[0].detail = "暂无数据";
        _this.git = false;
      } else {
        _this.tableData[0].detail = res.gitRepoAddress;
        _this.git = true;
      }
      if (res.virtualMachineSpace == "" || res.virtualMachineSpace == null) {
        _this.tableData[1].detail = "暂无数据";
        _this.virtual = false;
      } else {
        _this.tableData[1].detail = res.virtualMachineSpace;
        _this.virtual = true;
      }
      // console.log(
      //   "res.isFileServerDirConfirmed=" + res.isFileServerDirConfirmed
      // );
      if (res.isFileServerDirConfirmed == false) {
        _this.fileTrigger = false;
        _this.tableData[2].detail = res.fileServerDir + "  ( 配置状态:未完成 )";
      } else {
        _this.tableData[2].detail = res.fileServerDir;
      }
      // console.log("res.isMailConfirmed=" + res.isMailConfirmed);
      if (res.isMailConfirmed == false) {
        _this.emailTrigger = false;
        _this.tableData[3].detail = res.mail + "  ( 配置状态:未完成 )";
      } else {
        _this.tableData[3].detail = res.mail;
      }
      this.infoLoading = false;
    },

    //编辑
    edit() {
      var _this = this;
      var git = "";
      var virtual = "";
      if (_this.tableData[0].detail == "暂无数据") {
        git = "";
      } else {
        git = _this.tableData[0].detail;
      }
      if (_this.tableData[1].detail == "暂无数据") {
        virtual = "";
      } else {
        virtual = _this.tableData[1].detail;
      }
      this.editForm = {
        GitAddress: git,
        virtualSpace: virtual,
        fileAddValue: _this.fileTrigger,
        emailValue: _this.emailTrigger
      };
    },
    //确认编辑
    async editSubmit() {
      console.log(this.editForm);
      const res = await ProjectLW.editConfig(
        this.projectId,
        this.editForm.GitAddress,
        this.editForm.virtualSpace,
        this.editForm.fileAddValue,
        this.editForm.emailValue
      );
      this.editFormVisible = false;
      this.$message.success("修改成功");
      this.$refs["editForm"].resetFields();
      if (
        this.editForm.fileAddValue == true &&
        this.editForm.emailValue == true &&
        (this.editForm.GitAddress != "" || this.editForm.GitAddress != null) &&
        (this.editForm.virtualSpace != "" || this.editForm.virtualSpace != null)
      ) {
        if (this.fileTrigger == false || this.emailTrigger == false) {
          //第1次配置完成，触发
          this.$message.success("配置完成");
          console.log(this.outerId);
          ProjectSYJ.assignConfig(this.outerId);
        }
      }
      this.getConfig();
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
