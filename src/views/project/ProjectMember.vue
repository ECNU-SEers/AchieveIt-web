<template>
  <div>
    <!--工具条：搜索栏-->
    <PageHeader title="项目成员信息">
      <Search
        v-if="this.projectId !== undefined"
        placeholder="请输入功能名称"
        :query-search="querySearch"
        @search="searchMembers"
        @select-suggestion="selectSearch"
      />
      <!-- <el-input prefix-icon="el-icon-search" v-model="search" style="width: 200px" placeholder="输入关键字搜索"></el-input> -->
      <el-button
        v-if="this.projectId !== undefined"
        type="primary"
        class="add-btn"
        @click="addMember"
        >新增</el-button
      >
      <el-button
        v-if="this.projectId !== undefined"
        type="primary"
        class="add-btn"
        @click="addExcelFormVisible = true"
        >导入</el-button
      >
    </PageHeader>
    <el-row v-if="this.projectId === undefined">
      <el-col :span="24">
        <el-tag type="success" effect="dark">请选择项目</el-tag>
      </el-col>
    </el-row>

    <!-- 新增项目成员 -->
    <el-dialog title="新增项目成员" :visible.sync="addFormVisible">
      <el-form label-width="150px" class="demo-ruleForm">
        <!-- 单选 -->
        <el-form-item label="用户姓名" required>
          <el-select
            v-model="addForm.user"
            value-key="userId"
            placeholder="请选择成员"
            filterable
          >
            <el-option
              v-for="item in users"
              :key="item.userId"
              :label="item.username"
              :value="item"
            >
              <span style="float: left">{{ item.username }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{
                item.userId
              }}</span>
            </el-option>
          </el-select>
        </el-form-item>

        <!-- 多选 -->
        <el-form-item label="角色" prop="roles">
          <el-checkbox-group v-model="addForm.roles">
            <el-checkbox
              v-for="item in roles"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-checkbox>
          </el-checkbox-group>
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
              :label="item.username"
              :value="item"
            >
              <span style="float: left">{{ item.username }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{
                item.userId
              }}</span>
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
        action="https://jsonplaceholder.typicode.com/posts/"
        :file-list="fileList"
        accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
        :on-change="handleChange"
        :on-success="handleSuccess"
        :on-error="handleError"
      >
        <el-button size="small" type="primary">点击上传excel文件</el-button>
      </el-upload>

      <div slot="footer" class="dialog-footer">
        <el-button @click="addExcelFormVisible = false">取消</el-button>
        <el-button type="primary" @click="submitUpload" :loading="submitLoading"
          >提交</el-button
        >
      </div>
    </el-dialog>

    <!--项目成员列表-->
    <Pagination v-if="this.projectId !== undefined">
      <el-table
        v-if="this.projectId !== undefined"
        :data="
          tableData.filter(
            data =>
              !search ||
              data.userName.toLowerCase().includes(search.toLowerCase())
          )
        "
        stripe
        border
      >
        <el-table-column
          fixed
          prop="userId"
          label="序号"
          width="50"
          type="index"
        ></el-table-column>
        <el-table-column prop="userId" label="员工ID"></el-table-column>
        <el-table-column prop="username" label="姓名"></el-table-column>
        <el-table-column prop="rolesStr" label="角色"></el-table-column>
        <el-table-column
          prop="email"
          label="邮件地址"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column prop="department" label="所属部门"></el-table-column>
        <el-table-column
          prop="leaderName"
          label="项目中的上级"
        ></el-table-column>
        <el-table-column prop="phoneNumber" label="电话"></el-table-column>
        <el-table-column prop="workingHours" label="总工时"></el-table-column>
        <el-table-column label="操作" width="120px">
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
          ></el-input>
        </el-form-item>

        <!-- 多选 -->
        <el-form-item label="角色" prop="roles">
          <el-checkbox-group v-model="editForm.roles">
            <el-checkbox
              v-for="item in roles"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-checkbox>
          </el-checkbox-group>
        </el-form-item>

        <!-- 单选 -->
        <el-form-item label="项目中的上级">
          <el-select
            v-model="editForm.leader"
            value-key="userId"
            placeholder="请选择项目中的上级"
          >
            <el-option
              v-for="item in tableData"
              :key="item.userId"
              :label="item.username"
              :value="item"
            >
              <span style="float: left">{{ item.username }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{
                item.userId
              }}</span>
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
</template>

<script>
import PageHeader from "../../components/common/PageHeader";
import Search from "../../components/common/Search";
import Pagination from "../../components/common/Pagination";
import Project from "@/sys/models/project_htx";

export default {
  components: {
    PageHeader,
    Search,
    Pagination
  },
  data() {
    return {
      // 分页
      page: 1,
      pageSize: 10,
      keyword: "",
      projectId: "",

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
      tableData: [
        {
          userId: "",
          username: "",
          roles: [],
          email: "",
          department: "",
          leaderName: "",
          leaderEmail: "",
          phoneNumber: "",
          workingHours: 0.0
        }
      ]
    };
  },
  methods: {
    // 上传excel
    submitUpload() {},
    handleChange(file, fileList) {
      if (fileList.length > 0) {
        this.fileList = [fileList[fileList.length - 1]];
        console.log(fileList);
      }
    },
    handleSuccess() {},
    handleError() {},

    // 新增项目成员
    async addMember() {
      this.addFormVisible = true;
      this.users = await Project.getUsers();
      this.members = await Project.getMembers(this.projectId);
      this.roles = await Project.getRoles();
      console.log("add:");
      console.log(this.users);
      console.log(this.members);
    },
    // 提交新增成员
    async submitAddForm(form) {
      console.log(this.addForm);

      var info = await Project.addMember(
        this.projectId,
        this.addForm.user.userId,
        this.addForm.user.username,
        this.addForm.leader.userId,
        this.addForm.leader.userName,
        this.addForm.roles
      );
      this.$message({
        type: "success",
        message: "已提交!"
      });
      this.addFormVisible = false;
    },

    // 编辑项目成员信息
    async handleEdit(index, row) {
      console.log(row);
      this.editFormVisible = true;
      this.members = await Project.getMembers(this.projectId);
      this.roles = await Project.getRoles();
      this.editForm.userId = row.userId;
      this.editForm.username = row.username;
      this.editForm.roles = row.roles;
      this.editForm.leader = row.leaderName;
    },
    async submitEditForm(form) {
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
    },

    async handleDelete(index, row) {
      var functionId = "1";
      console.log(row);
      this.$confirm("是否将该成员移出项目组?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          var info = await Project.deleteMember(functionId, row.userId);
          this.$message({
            type: "success",
            message: "已移除!"
          });
          location.reload();
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消"
          });
        });
    },
    // 将数组用\n拼接以便展示时换行
    showRoles() {
      for (var i = 0; i < this.tableData.length; ++i) {
        this.tableData[i].rolesStr = "";
        this.tableData[i].rolesStr = this.tableData[i].roles.join("\n");
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
        console.log("get member list success!");
        this.tableData = info.items;
        this.showRoles();
        console.log(this.tableData);
      } catch (e) {
        console.log(e);
      }
    },
    // 搜索
    async querySearch(queryString, cb) {
      console.log(queryString);
      var tmp = [];
      this.memberSearch = await Project.searchMembers(
        this.projectId,
        queryString
      );
      console.log(this.memberSearch);
      // 下拉显示的数据
      this.memberSearch.forEach(item => {
        const obj = {};
        obj.id = item.id;
        obj.value = item.name;
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
      this.selectedMember = item.id;
      // this.projects = await ProjectSYJ.searchOneProject(item.id);
      // console.log(this.projects);
    },
    searchMembers(keyword) {
      this.getMemberList(this.keyword);
      // if(this.selectedMember !== "") {
      // console.log("selected search");
      // const res = await ProjectSYJ.searchOneProject(this.selectedProject);
      // const tmplist = [];
      // tmplist.push(res);
      // this.projects = tmplist;
      // } else {
      //   console.log("keyword search");
      // this.projects = await ProjectSYJ.getProjectList(this.pageNo, this.pageSize, this.userId, keyword);
      // }
    },
    async getOne(item) {
      console.log(item);
      try {
        const info = await Project.getOneMember(this.projectId, item.id);
        this.tableData = [];
        this.showRoles();
        this.tableData.push(info);
        console.log(this.tableData);
        console.log(this.tableData[0].userId);
      } catch (e) {
        console.log(e);
      }
    }
  },
  mounted: function() {
    this.projectId = this.$route.query.projectId;
    if (this.projectId === undefined) {
      this.$message({
        message: "请先选择项目！",
        type: "warning"
      });
    } else {
      this.keyword = "";
      this.getMemberList(this.keyword);
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
