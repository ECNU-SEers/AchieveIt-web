<template>
  <div>
    <el-row
      v-if="this.projectId !== undefined && this.getInfoPermission !== true"
      style="height: 800px"
    >
      <el-col
        style="height: 800px"
        v-loading="loading"
        element-loading-text="您暂无权限查看此页面"
        element-loading-spinner="el-icon-loading"
      ></el-col>
    </el-row>
    <div v-if="this.getInfoPermission === true">
      <!--工具条：搜索栏-->
      <PageHeader title="项目成员信息">
        <Search
          v-if="this.projectId !== undefined"
          placeholder="请输入成员姓名"
          :query-search="querySearch"
          @search="searchMembers"
          @select-suggestion="selectSearch"
        />
        <!-- <el-input prefix-icon="el-icon-search" v-model="search" style="width: 200px" placeholder="输入关键字搜索"></el-input> -->
        <el-button
          v-if="
            this.state !== '结束' &&
              this.state !== '已归档' &&
              this.state !== '申请立项' &&
              this.state !== '立项驳回' &&
              this.permission === true
          "
          type="primary"
          class="add-btn"
          @click="addMember"
          >新增</el-button
        >
        <el-button
          v-if="
            this.state !== '结束' &&
              this.state !== '已归档' &&
              this.state !== '申请立项' &&
              this.state !== '立项驳回' &&
              this.permission === true
          "
          type="primary"
          class="add-btn"
          @click="addExcelFormVisible = true"
          >导入</el-button
        >
        <el-button
          type="primary"
          class="add-btn"
          v-if="
            this.state !== '结束' &&
              this.state !== '已归档' &&
              this.state !== '申请立项' &&
              this.state !== '立项驳回' &&
              this.permission === true
          "
          @click="exportExcel"
          >模板</el-button
        >
      </PageHeader>

      <!-- 新增项目成员 -->
      <el-dialog title="新增项目成员" :visible.sync="addFormVisible">
        <el-form
          label-width="150px"
          class="demo-ruleForm"
          :model="addForm"
          :rules="rules"
          ref="addForm"
        >
          <!-- 单选 -->
          <el-form-item label="用户姓名" prop="user.realName">
            <el-select
              v-model="addForm.user"
              value-key="userId"
              placeholder="请选择成员"
              filterable
            >
              <el-option
                v-for="item in users"
                :key="item.userId"
                :label="item.realName"
                :value="item"
              >
                <span style="float: left">{{ item.realName }}</span>
                <span style="float: right; color: #8492a6; font-size: 13px">
                  {{ item.username }}
                </span>
              </el-option>
            </el-select>
          </el-form-item>

          <!-- 多选 -->
          <el-form-item label="角色" prop="roles">
            <el-select
              v-model="addForm.roles"
              multiple
              filterable
              placehoder="请选择成员角色"
            >
              <el-option
                v-for="item in roles"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>

          <!-- 单选 -->
          <el-form-item label="项目中的上级">
            <el-select
              v-model="addForm.leader"
              value-key="userId"
              filterable
              placeholder="请选择项目中的上级"
            >
              <el-option
                v-for="item in members"
                :key="item.userId"
                :label="item.realName"
                :value="item"
              >
                <span style="float: left">{{ item.realName }}</span>
                <span style="float: right; color: #8492a6; font-size: 13px">
                  {{ item.username }}
                </span>
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="addFormVisible = false">取消</el-button>
          <el-button
            type="primary"
            @click="submitAddForm('addForm')"
            :loading="submitLoading"
            >提交</el-button
          >
        </div>
      </el-dialog>

      <!-- 导入excel -->
      <el-dialog title="导入项目成员信息" :visible.sync="addExcelFormVisible">
        <el-upload
          action
          :auto-upload="false"
          :limit="1"
          accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
          :on-change="handleChange"
        >
          <el-button type="primary">上传excel文件</el-button>
          <div slot="tip" class="el-upload__tip">
            只能上传excel文件，一次仅支持上传一个且大小不超过10MB
          </div>
        </el-upload>

        <div slot="footer" class="dialog-footer">
          <el-button @click="addExcelFormVisible = false">取消</el-button>
          <el-button
            type="primary"
            @click="submitUpload"
            :loading="submitLoading"
            >提交</el-button
          >
        </div>
      </el-dialog>

      <!--项目成员列表-->
      <Pagination
        :current-page.sync="page"
        :page-size="pageSize"
        :total="membersLength"
        @page-change="handlePageChange"
      >
        <el-table
          :data="
            tableData.filter(
              data =>
                !search ||
                data.userName.toLowerCase().includes(search.toLowerCase())
            )
          "
          v-loading="infoLoading"
          stripe
          border
        >
          <el-table-column
            fixed
            prop="userId"
            label="序号"
            width="70"
            type="index"
          ></el-table-column>
          <el-table-column prop="username" label="员工ID"></el-table-column>
          <el-table-column prop="realName" label="姓名"></el-table-column>
          <el-table-column prop="rolesStr" label="角色"></el-table-column>
          <el-table-column prop="email" label="邮件地址"></el-table-column>
          <el-table-column prop="department" label="所属部门"></el-table-column>
          <el-table-column
            prop="leaderRealName"
            label="项目中的上级"
          ></el-table-column>
          <el-table-column prop="phoneNumber" label="电话"></el-table-column>
          <el-table-column prop="workingHours" label="总工时"></el-table-column>
          <el-table-column
            label="操作"
            width="120px"
            v-if="
              this.state !== '结束' &&
                this.state !== '已归档' &&
                this.state !== '申请立项' &&
                this.state !== '立项驳回' &&
                this.permission === true
            "
          >
            <template slot-scope="scope">
              <el-button-group>
                <el-button
                  size="medium"
                  type="primary"
                  @click="handleEdit(scope.$index, scope.row)"
                  icon="el-icon-edit"
                ></el-button>
                <el-button
                  size="medium"
                  type="danger"
                  icon="el-icon-delete"
                  @click="handleDelete(scope.$index, scope.row)"
                ></el-button>
              </el-button-group>
            </template>
          </el-table-column>
        </el-table>
      </Pagination>

      <!-- 编辑项目成员信息 -->
      <el-dialog title="编辑项目成员信息" :visible.sync="editFormVisible">
        <el-form label-width="150px" class="demo-ruleForm">
          <!-- 不可修改 -->
          <el-form-item label="用户姓名" required>
            <el-input
              v-model="editForm.username"
              :disabled="true"
              placeholder
              style="width:40%"
            ></el-input>
          </el-form-item>

          <!-- 多选 -->
          <el-form-item label="角色" prop="roles">
            <el-select
              v-model="editForm.roles"
              multiple
              filterable
              placehoder="请选择成员角色"
            >
              <el-option
                v-for="item in roles"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>

          <!-- 单选 -->
          <el-form-item label="项目中的上级">
            <el-select
              v-model="editForm.leader"
              value-key="userId"
              placeholder="请选择项目中的上级"
              clearable
            >
              <el-option
                v-for="item in tableData"
                :key="item.userId"
                :label="item.realName"
                :value="item"
              >
                <span style="float: left">{{ item.realName }}</span>
                <span style="float: right; color: #8492a6; font-size: 13px">
                  {{ item.username }}
                </span>
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>

        <div slot="footer" class="dialog-footer">
          <el-button @click="editFormVisible = false">取消</el-button>
          <el-button
            type="primary"
            @click="submitEditForm('editForm')"
            :loading="submitLoading"
            >提交</el-button
          >
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import PageHeader from "../../components/common/PageHeader";
import Search from "../../components/common/Search";
import Pagination from "../../components/common/Pagination";
import Project from "@/sys/models/project_htx";
import { mapGetters } from "vuex";
import XLSX from "xlsx";

export default {
  components: {
    PageHeader,
    Search,
    Pagination
  },
  data() {
    return {
      infoLoading: true,
      rules: {
        ['user.realName']: [{ required: true, message: "请选择用户", trigger: "blur" }]
      },
      loading: true,

      state: "",
      permission: false,
      getInfoPermission: false,
      // 分页
      page: 1,
      pageSize: 10,
      keyword: "",
      projectId: "",
      membersLength: 0,

      selectedMember: "",
      memberSearch: "",
      users: [],
      members: [],
      roles: [],
      submitLoading: false,
      editId: 0,
      search: "",
      addFormVisible: false,
      addExcelFormVisible: false,
      editFormVisible: false,
      fileList: [],
      addForm: {
        user: {},
        roles: [],
        leader: {}
      },
      editForm: {
        userId: "",
        username: "",
        roles: [],
        leader: ""
      },
      tableData: [],

      // 导入excel
      uploadMember: [],
      submitUploadfailed: false

      // 导出excel
    };
  },
  methods: {
    // 获取项目权限
    async getPermission(projectId) {
      var info = await Project.getPermissions(projectId);
      console.log(info);
      for (var i = 0; i < info.length; ++i) {
        if (info[i].name === "管理项目成员") {
          this.permission = true;
          this.getInfoPermission = true;
          break;
        }
        if (info[i].name === "查询项目成员信息") {
          this.getInfoPermission = true;
        }
      }
      // if (this.getInfoPermission === false) {
      //   this.$message({
      //     message: "无权限查看！",
      //     type: "warning"
      //   });
      // }
      console.log("permission: " + this.permission);
    },
    // 上传excel
    submitUpload() {
      if (this.submitUploadfailed === false) {
        this.uploadMember.forEach(member => {
          const roleId = [5];
          Project.importMember(
            this.projectId,
            member["成员工号"],
            member["项目上级工号"],
            roleId
          );
        });
        this.$message({
          message: "提交成功！",
          type: "success"
        });
        this.addExcelFormVisible = false;
        this.getMemberList("");
      } else {
        this.$message.error("上传文件的大小不能超过10M!");
      }
    },

    handleChange(file, fileList) {
      const size = file.size / 1024 / 1024;
      if (size > 10) {
        this.submitUploadfailed = true;
        this.$message.error("上传文件的大小不能超过10M!");
        return;
      }
      const fileReader = new FileReader();
      fileReader.onload = ev => {
        try {
          const data = ev.target.result;
          const workbook = XLSX.read(data, {
            type: "binary"
          });
          // console.log(workbook)
          let sheet = Object.keys(workbook.Sheets)[0];
          const json = XLSX.utils.sheet_to_json(workbook.Sheets[sheet]); //获得以第一列为键名的sheet数组对象
          this.uploadMember = json;
          console.log(json);
        } catch (e) {
          console.log(e);
        }
      };
      fileReader.readAsBinaryString(file.raw);
    },
    handleSuccess() {},
    handleError() {},
    // 新增项目成员
    async addMember() {
      if (
        this.state === "结束" ||
        (this.state === "已归档" &&
          this.state !== "申请立项" &&
          this.state !== "立项驳回")
      ) {
        this.$message({
          message: "项目已结束，不可修改！",
          type: "warning"
        });
      } else {
        this.addFormVisible = true;
        const allUser = await Project.getUsers();
        // this.users = allUser.filter(item => item.);
        const hasUsers = await Project.searchMembers(this.projectId, "");
        const hasUserIds = [];
        this.users = [];
        hasUsers.forEach(user => {
          hasUserIds.push(user.id);
        });
        allUser.forEach(user => {
          console.log(user);
          if (hasUserIds.indexOf(user.userId) === -1) {
            this.users.push(user);
          }
        });
        var info = await Project.getMemberList(
          this.projectId,
          this.page,
          this.pageSize,
          ""
        );
        this.members = info.items;
        this.roles = await Project.getRoles();
      }
    },
    // 提交新增成员
    async submitAddForm(formName) {
      console.log(formName);
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (this.addForm.roles === []) {
            this.addForm.roles = [5];
          }

          Project.addMember(
            this.projectId,
            this.addForm.user.userId,
            this.addForm.user.username,
            this.addForm.leader.userId,
            this.addForm.leader.username,
            this.addForm.roles
          ).then(() => {
            this.$message({
              type: "success",
              message: "已提交!"
            });
            this.addFormVisible = false;
            this.$refs["addForm"].resetFields();
            // location.reload();
            this.getMemberList(this.keyword);
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    // 编辑项目成员信息
    async handleEdit(index, row) {
      if (
        this.state === "结束" ||
        (this.state === "已归档" &&
          this.state !== "申请立项" &&
          this.state !== "立项驳回")
      ) {
        this.$message({
          message: "项目已结束，不可修改！",
          type: "warning"
        });
      } else {
        this.editFormVisible = true;
        // 获取项目成员
        var info = await Project.getMemberList(
          this.projectId,
          this.page,
          this.pageSize,
          ""
        );
        this.members = info.items;
        // 获取所有角色
        this.roles = await Project.getRoles();
        // 表格预设值
        this.editForm.userId = row.userId;
        this.editForm.username = row.username + " " + row.realName;
        // 找到角色id
        this.editForm.roles = [];
        for (var i = 0; i < row.roles.length; ++i) {
          // 遍历所有角色
          for (var j = 0; j < this.roles.length; ++j) {
            if (row.roles[i] === this.roles[j].name) {
              this.editForm.roles.push(this.roles[j].id);
              break;
            }
          }
        }
        if (row.leaderRealName === "暂无数据") {
          this.editForm.leader = "";
        } else {
          this.editForm.leader = row.leaderRealName;
        }
      }
    },
    async submitEditForm(form) {
      console.log("submit editForm:");
      console.log(this.editForm);
      var info = await Project.editMember(
        this.projectId,
        this.editForm.userId,
        this.editForm.leader.userId,
        this.editForm.leader.username,
        this.editForm.roles
      );
      this.$message({
        type: "success",
        message: "已提交!"
      });
      this.editFormVisible = false;
      this.$refs["editForm"].resetFields();
      // location.reload();
      this.getMemberList(this.keyword);
    },
    async handleDelete(index, row) {
      if (
        this.state === "结束" ||
        (this.state === "已归档" &&
          this.state !== "申请立项" &&
          this.state !== "立项驳回")
      ) {
        this.$message({
          message: "项目已结束，不可修改！",
          type: "warning"
        });
      } else {
        console.log(row);
        this.$confirm("是否将该成员移出项目组?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(async () => {
            var info = await Project.deleteMember(this.projectId, row.userId);
            this.$message({
              type: "success",
              message: "已移除!"
            });
            // location.reload();
            this.getMemberList(this.keyword);
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消"
            });
          });
      }
    },
    // 将数组用\n拼接以便展示时换行
    showInfo() {
      for (var i = 0; i < this.tableData.length; ++i) {
        // 角色显示处理
        if (this.tableData[i].roles.length > 0) {
          this.tableData[i].rolesStr = "";
          this.tableData[i].rolesStr = this.tableData[i].roles.join("\n");
        } else {
          this.tableData[i].rolesStr = "暂无数据";
        }
        // 所属部门
        if (this.tableData[i].department === null) {
          this.tableData[i].department = "暂无数据";
        }
        // 邮箱
        if (this.tableData[i].email === null) {
          this.tableData[i].email = "暂无数据";
        }
        // 上级
        if (this.tableData[i].leaderRealName === null) {
          this.tableData[i].leaderRealName = "暂无数据";
        }
        // 电话
        if (this.tableData[i].phoneNumber === null) {
          this.tableData[i].phoneNumber = "暂无数据";
        }
      }
    },
    // 获取成员列表
    async getMemberList(keyword) {
      try {
        // 尝试获取成员列表
        console.log(keyword);
        const info = await Project.getMemberList(
          this.projectId,
          this.page,
          this.pageSize,
          keyword
        );
        this.tableData = info.items;
        this.infoLoading = false;
        this.showInfo();
      } catch (e) {
        console.log(e);
      }
    },

    // 分页
    handlePageChange(val) {
      this.page = val;
      this.getMemberList("");
    },

    async getSearchSuggestion(queryString) {
      this.memberSearch = await Project.searchMembers(
        this.projectId,
        queryString
      );
      this.membersLength = this.memberSearch.length;
      console.log(this.membersLength);
      console.log(this.memberSearch);
    },

    // 搜索
    async querySearch(queryString, cb) {
      console.log(queryString);
      var tmp = [];
      await this.getSearchSuggestion(queryString);
      // 下拉显示的数据
      this.memberSearch.forEach(item => {
        const obj = {};
        obj.id = item.id;
        obj.value = item.realName;
        tmp.push(obj);
      });
      const results = queryString
        ? tmp.filter(item => item.value.includes(queryString))
        : tmp;
      cb(results);
    },
    async selectSearch(item) {
      console.log("select search item-------");
      console.log(item);
      // this.getOne(item);
      // this.projects = await ProjectSYJ.searchOneProject(item.id);
      // console.log(this.projects);
    },
    searchMembers(keyword) {
      console.log("keyword:" + keyword);
      this.getMemberList(keyword);
    },
    async getOne(item) {
      console.log(item);
      try {
        const info = await Project.getOneMember(this.projectId, item.id);
        this.tableData = [];
        this.showInfo();
        this.tableData.push(info);
        console.log(this.tableData);
        console.log(this.tableData[0].userId);
      } catch (e) {
        console.log(e);
      }
    },

    sheet2blob(sheet, sheetName) {
      sheetName = sheetName || "sheet1";
      var workbook = {
        SheetNames: [sheetName],
        Sheets: {}
      };
      workbook.Sheets[sheetName] = sheet;
      // 生成excel的配置项
      var wopts = {
        bookType: "xlsx", // 要生成的文件类型
        bookSST: false, // 是否生成Shared String Table，官方解释是，如果开启生成速度会下降，但在低版本IOS设备上有更好的兼容性
        type: "binary"
      };
      var wbout = XLSX.write(workbook, wopts);
      var blob = new Blob([s2ab(wbout)], { type: "application/octet-stream" });
      // 字符串转ArrayBuffer
      function s2ab(s) {
        var buf = new ArrayBuffer(s.length);
        var view = new Uint8Array(buf);
        for (var i = 0; i != s.length; ++i) view[i] = s.charCodeAt(i) & 0xff;
        return buf;
      }
      return blob;
    },

    openDownloadDialog(url, saveName) {
      if (typeof url == "object" && url instanceof Blob) {
        url = URL.createObjectURL(url); // 创建blob地址
      }
      var aLink = document.createElement("a");
      aLink.href = url;
      aLink.download = saveName || ""; // HTML5新增的属性，指定保存文件名，可以不要后缀，注意，file:///模式下不会生效
      var event;
      if (window.MouseEvent) event = new MouseEvent("click");
      else {
        event = document.createEvent("MouseEvents");
        event.initMouseEvent(
          "click",
          true,
          false,
          window,
          0,
          0,
          0,
          0,
          0,
          false,
          false,
          false,
          false,
          0,
          null
        );
      }
      aLink.dispatchEvent(event);
    },

    exportExcel() {
      var aoa = [
        ["成员工号", "项目上级工号"],
        ["xxx", "xxx"]
      ];
      var sheet = XLSX.utils.aoa_to_sheet(aoa);
      this.openDownloadDialog(this.sheet2blob(sheet), "项目成员信息模板.xlsx");
    }
  },

  mounted: function() {
    this.projectId = this.$route.query.projectId;
    // 获取项目状态
    this.state = this.$route.query.projectState;
    console.log("state: " + this.state);
    this.getSearchSuggestion();

    if (this.projectId === undefined) {
      this.$message({
        message: "请先选择项目！",
        type: "warning"
      });
    } else {
      this.keyword = "";
      this.getMemberList(this.keyword);
      // 获取项目权限
      this.getPermission(this.projectId);
    }
  }
};
</script>

<style>
.add-btn {
  height: 32px;
  margin-left: 20px;
  border-radius: 3px;
  width: 80px;
}
.el-table .cell {
  white-space: pre-line;
}
</style>
