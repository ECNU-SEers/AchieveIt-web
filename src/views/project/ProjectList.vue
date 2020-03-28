<template>
  <div>
    <!--工具条：搜索栏-->
    <PageHeader title="项目列表">
      <Search
        placeholder="请输入项目名称"
        v-model="projectNameSearch"
        :query-search="querySearch"
        @search="searchProject"
      >
        <!-- <template slot-scope="item">
          <div style="text-overflow: ellipsis; overflow: hidden;">{{ item.name }}</div>
          <span style="float: right; color: #8492a6; font-size: 13px">
            {{
            item.outerId
            }}
          </span>
        </template>-->
      </Search>
      <el-button type="primary" class="add-btn" @click="handleAdd">新增</el-button>
    </PageHeader>

    <!--项目列表-->
    <Pagination
      :current-page.sync="pageNo"
      :page-size="pageSize"
      :total="projectsLength"
      @page-change="handlePageChange"
    >
      <el-table :data="projects" highlight-current-row style="width: 100%">
        <!-- <el-table-column type="expand">
                    <template slot-scope="props">
                        <el-table :data="props.row.projectProgress" highlight-current-row style="width:80%">
                          <el-table-column type="index" label="序号" width="70px"></el-table-column>
                          <el-table-column prop="updateDate" label="更新日期"></el-table-column>
                          <el-table-column prop="state" label="更新状态"></el-table-column>
                          <el-table-column prop="recorder" label="触发人"></el-table-column>
                        </el-table>
                    </template>
                    <el-timeline :reverse="reverse">
                        <el-timeline-item
                                v-for="(activity, index) in activities"
                                :key="index"
                                :icon="activity.icon"
                                :type="activity.type"
                                :color="activity.color"
                                :size="activity.size"
                                :timestamp="activity.timestamp"
                        >{{activity.state}}
                        </el-timeline-item>
                    </el-timeline>
        </el-table-column>-->
        <el-table-column label="序号" type="index" width="70px"></el-table-column>
        <el-table-column label="项目ID" prop="outerId"></el-table-column>
        <el-table-column label="项目名称" prop="name"></el-table-column>
        <el-table-column label="客户名称" prop="company"></el-table-column>
        <el-table-column label="预定时间" prop="startDate"></el-table-column>
        <el-table-column label="交付日" prop="endDate"></el-table-column>
        <el-table-column label="项目经理" prop="managerName"></el-table-column>
        <el-table-column label="项目主管" prop="supervisorName"></el-table-column>
        <el-table-column label="项目状态" prop="state"></el-table-column>
        <el-table-column label="QA" prop="qaAssigned"></el-table-column>
        <el-table-column label="EPG" prop="epgAssigned"></el-table-column>
        <el-table-column label="参与人数" prop="participantCounter"></el-table-column>
        <el-table-column fixed="right" label="操作" width="180px">
          <template slot-scope="scope">
            <el-button-group>
              <el-button size="medium" @click.stop="handleDetail(scope.$index, scope.row)" icon="el-icon-search"></el-button>
              <el-button
                size="medium"
                type="primary"
                @click.stop="handleEdit(scope.$index, scope.row)"
                icon="el-icon-edit"
              ></el-button>
              <el-button
                size="medium"
                type="danger"
                @click.stop="handleDel(scope.$index, scope.row)"
                icon="el-icon-delete"
              ></el-button>
            </el-button-group>
          </template>
        </el-table-column>
      </el-table>
    </Pagination>

    <!-- 新建项目 -->
    <el-dialog title="新建项目" :visible.sync="addFormVisible" :close-on-click-modal="false">
      <el-form
        @submit.native.prevent
        :model="addForm"
        :rules="addFormRules"
        ref="addForm"
        label-width="100px"
      >
        <el-form-item label="项目ID" prop="outerId">
          <el-select v-model="addForm.outerId" placeholder="请选择ID">
            <el-option v-for="item in IDs" :key="item" :label="item" :value="item"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="项目名称" prop="name">
          <el-input v-model="addForm.name" placeholder="请填写项目名称"></el-input>
        </el-form-item>
        <el-form-item label="客户" prop="company">
          <el-select v-model="addForm.company" value-key="outerId" placeholder="请选择客户">
            <el-option
              v-for="item in clients"
              :key="item.outerId"
              :label="item.company"
              :value="item"
            >
              <span style="float: left">{{ item.company }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{ item.outerId }}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="起止时间" required>
          <el-col :span="11">
            <el-form-item prop="startDate">
              <el-date-picker
                type="date"
                placeholder="选择日期"
                v-model="addForm.startDate"
                value-format="yyyy-MM-dd"
                :picker-options="add_start_Date"
                style="width: 100%;"
              ></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col class="line" :span="2">至</el-col>
          <el-col :span="11">
            <el-form-item prop="endDate">
              <el-date-picker
                type="date"
                placeholder="选择日期"
                v-model="addForm.endDate"
                value-format="yyyy-MM-dd"
                :picker-options="add_end_Date"
                style="width: 100%;"
              ></el-date-picker>
            </el-form-item>
          </el-col>
        </el-form-item>
        <el-form-item label="项目经理" prop="managerName">
          <el-input v-model="addForm.managerName" disabled></el-input>
        </el-form-item>
        <el-form-item label="项目主管" prop="supervisorName">
          <el-select v-model="addForm.supervisorName" value-key="id" placeholder="请选择项目主管">
            <el-option v-for="item in mentors" :key="item.id" :label="item.realName" :value="item">
              <span style="float: left">{{ item.realName }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">
                {{
                item.username
                }}
              </span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="采用技术" prop="skillNames">
          <el-select v-model="addForm.skillNames" multiple placeholder="请选择采用技术">
            <el-option v-for="item in teches" :key="item.id" :label="item.name" :value="item.name"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="业务领域" prop="businessAreaName">
          <el-select v-model="addForm.businessAreaName" placeholder="请选择业务领域">
            <el-option
              v-for="item in busiAreas"
              :key="item.id"
              :label="item.name"
              :value="item.name"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addFormVisible = false">取消</el-button>
        <el-button type="primary" @click.native="addProjectSubmit" :loading="submitLoading">提交</el-button>
      </div>
    </el-dialog>

    <!--编辑项目-->
    <el-dialog title="编辑项目" :visible.sync="editFormVisible" :close-on-click-modal="false">
      <el-form
        @submit.native.prevent
        ref="editForm"
        :model="editForm"
        :rules="editFormRules"
        label-width="100px"
      >
        <el-form-item label="项目ID" prop="outerId">
          <el-select v-model="editForm.outerId" placeholder="请选择ID" disabled></el-select>
        </el-form-item>
        <el-form-item label="项目名称" prop="name">
          <el-input v-model="editForm.name" placeholder="请填写项目名称"></el-input>
        </el-form-item>
        <el-form-item label="客户" prop="company">
          <el-select v-model="editForm.company" value-key="outerId" placeholder="请选择客户">
            <el-option
              v-for="item in clients"
              :key="item.outerId"
              :label="item.company"
              :value="item"
            >
              <span style="float: left">{{ item.company }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{ item.outerId }}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="起止时间" required>
          <el-col :span="11">
            <el-form-item prop="startDate">
              <el-date-picker
                type="date"
                placeholder="选择日期"
                v-model="editForm.startDate"
                value-format="yyyy-MM-dd"
                :picker-options="start_Date"
                style="width: 100%;"
              ></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col class="line" :span="2">至</el-col>
          <el-col :span="11">
            <el-form-item prop="endDate">
              <el-date-picker
                type="date"
                placeholder="选择日期"
                v-model="editForm.endDate"
                value-format="yyyy-MM-dd"
                :picker-options="end_Date"
                style="width: 100%;"
              ></el-date-picker>
            </el-form-item>
          </el-col>
        </el-form-item>
        <el-form-item label="项目经理" prop="managerName">
          <el-input v-model="editForm.managerName" disabled></el-input>
        </el-form-item>
        <el-form-item label="项目主管" prop="supervisorName">
          <el-input v-model="editForm.supervisorName" disabled></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editFormVisible = false">取消</el-button>
        <el-button type="primary" @click="editProjectSubmit" :loading="submitLoading">提交</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import PageHeader from "../../components/common/PageHeader";
import Search from "../../components/common/Search";
import Pagination from "../../components/common/Pagination";
import ProjectSYJ from "@/sys/models/project_syj";

export default {
  components: {
    PageHeader,
    Search,
    Pagination
  },
  data() {
    return {
      // 分页
      pageNo: 1,
      pageSize: 5,
      userId: 1,
      userName: "管理员",
      projects: [],
      projectsLength: 0,

      // 模态框
      clients: [],
      teches: [],
      busiAreas: [],
      mentors: [],
      IDs: [],

      // 搜索框
      projectModal: [],
      projectNameSearch: "",
      timeout: null,

      projectOptions: [
        {
          projectName: "项目1",
          projectId: "id1"
        }
      ],
      projectNameLoading: false,

      // 新增项目
      addFormVisible: false,
      addForm: {
        outerId: "",
        name: "",
        startDate: "",
        endDate: "",
        clientOuterId: "",
        company: "",
        supervisorId: 0,
        supervisorName: "",
        managerId: 0,
        managerName: "",
        skillNames: [],
        businessAreaName: ""
      },
      addFormRules: {
        outerId: [
          {
            required: true,
            message: "请选择项目ID",
            triggle: "blur"
          }
        ],
        name: [
          {
            required: true,
            message: "请填写项目名称",
            triggle: "blur"
          }
        ],
        company: [
          {
            type: "object",
            required: true,
            message: "请选择客户",
            triggle: "blur"
          }
        ],
        startDate: [
          {
            required: true,
            message: "请选择项目开始日期",
            triggle: "blur"
          }
        ],
        endDate: [
          {
            required: true,
            message: "请选择项目结束日期",
            triggle: "blur"
          }
        ],
        supervisorName: [
          {
            type: "object",
            required: true,
            message: "请选择项目主管",
            triggle: "blur"
          }
        ],
        skillNames: [
          {
            type: "array",
            required: true,
            message: "请选择采用技术",
            triggle: "blur"
          }
        ]
      },
      // 编辑项目
      editFormVisible: false,
      editForm: {
        outerId: "",
        name: "",
        company: {},
        startDate: "",
        endDate: "",
        managerId: "",
        managerName: "",
        supervisorName: "",
        supervisorId: ""
      },

      // 起止日期限制
      start_Date: {
        disabledDate: time => {
          if (this.editForm.endDate) {
            return time.getTime() > new Date(this.editForm.endDate).getTime();
          } else {
            return;
          }
        }
      },
      end_Date: {
        disabledDate: time => {
          if (
            this.editForm.startDate &&
            new Date(this.editForm.startDate).getTime() > Date.now()
          ) {
            return time.getTime() < new Date(this.editForm.startDate).getTime();
          } else {
            return time.getTime() < Date.now();
          }
        }
      },
      add_start_Date: {
        disabledDate: time => {
          if (this.addForm.endDate) {
            return time.getTime() > new Date(this.addForm.endDate).getTime();
          } else {
            return;
          }
        }
      },
      add_end_Date: {
        disabledDate: time => {
          if (
            this.addForm.startDate &&
            new Date(this.addForm.startDate).getTime() > Date.now()
          ) {
            return time.getTime() < new Date(this.addForm.startDate).getTime();
          } else {
            return time.getTime() < Date.now();
          }
        }
      },

      editFormRules: {
        name: [
          {
            required: true,
            message: "请填写项目名称",
            triggle: "blur"
          }
        ],
        company: [
          {
            type: "object",
            required: true,
            message: "请选择客户",
            triggle: "blur"
          }
        ],
        startDate: [
          {
            required: true,
            message: "请选择预定日期",
            triggle: "blur"
          }
        ],
        endDate: [
          {
            required: true,
            message: "请选择交付日期",
            triggle: "blur"
          }
        ]
      },

      submitLoading: false,
      // 时间轴
      reverse: false,
      activities: [
        {
          state: "进行中",
          timestamp: "2018-04-15",
          type: "primary",
          size: "large"
        },
        {
          state: "已立项",
          timestamp: "2018-04-13",
          type: "success"
        },
        {
          state: "申请立项",
          timestamp: "2018-04-11",
          type: "success"
        }
      ]
    };
  },
  mounted() {
    this.getProjects();
    this.getProjectModals();
  },
  methods: {
    refresh() {
      this.getProjects();
      this.getProjectModals();
      this.$refs['addForm'].resetFields();
    },

    handleDetail(index, row) {
      this.$router.push({
        path: "/project/basic",
        query: {
          projectId: row.outerId
        }
      });
    },

    handlePageChange(val) {
      this.pageNo = val;
      this.getProjects();
    },

    // 获取所有项目列表
    async getProjects() {
      const res = await ProjectSYJ.getProjectList(
        this.pageNo,
        this.pageSize,
        this.userId
      );
      this.projects = res.items;
    },

    async getProjectModals() {
      this.projectModal = await ProjectSYJ.getProjectModal(this.userId);
      this.projectsLength = this.projectModal.length;
    },

    // 项目搜索框
    querySearch(queryString, cb) {
      console.log(this.projectModal);
      var projectModal = [];
      // let i = 0;
      // for (i = 0; i < this.projectModal.length; i++) {
      //   const obj = {};
      //   obj.id = this.projectModal[i].outerId;
      //   obj.value = this.projectModal[i].name;
      //   projectModal.push(obj);
      // }
      this.projectModal.forEach((item)=> {
        const obj = {};
        obj.id = item.outerId;
        obj.value = item.name;
        projectModal.push(obj);
      })
      console.log(projectModal);
      console.log(queryString);
      // // const results = queryString
      // //   ? projectModal.filter(this.createFilter(queryString))
      // //   : projectModal;
      // const results = [{value: '111'}];
      // cb([{ value: "111" }]);
      cb(projectModal);
    },

    createFilter(queryString) {
      return projectNameSearch => {
        return (
          projectNameSearch.name
            .toLowerCase()
            .indexOf(queryString.toLowerCase()) === 0
        );
      };
    },

    searchProject(project) {},

    // 获取客户模态框
    async getClientModal() {
      const res = await ProjectSYJ.getAllClients();
      this.clients = res;
    },

    // 获取技术模态框
    async getTechModal() {
      const res = await ProjectSYJ.getAllTech();
      this.teches = res;
    },

    // 获取业务领域模态框
    async getBusinessModal() {
      const res = await ProjectSYJ.getAllBusinessArea();
      this.busiAreas = res;
    },

    // 获取项目经理主管模态框
    async getMentorModal() {
      const res = await ProjectSYJ.getAllMentors();
      this.mentors = res;
    },

    async getProjectIdModal() {
      const res = await ProjectSYJ.getAllProjectId();
      this.IDs = res;
    },

    // 新增项目
    handleAdd() {
      this.addFormVisible = true;
      this.addForm.managerName = this.userName;
      this.getClientModal();
      this.getTechModal();
      this.getBusinessModal();
      this.getMentorModal();
      this.getProjectIdModal();
    },

    addProjectSubmit() {
      this.$refs.addForm.validate(valid => {
        if (valid) {
          this.$confirm("确定提交吗？", "提示", {}).then(() => {
            this.submitLoading = true;
            const para = Object.assign({}, this.addForm);
            para.clientOuterId = para.company.outerId;
            para.company = para.company.company;
            para.supervisorId = para.supervisorName.id;
            para.supervisorName = para.supervisorName.username;
            para.managerId = this.userId;
            console.log(para);
            ProjectSYJ.addProject(para).then(res => {
                this.submitLoading = false;
                this.addFormVisible = false;
                this.refresh();
                this.$message({
                  message: "提交成功！",
                  type: "success"
                });
            });
          });
        }
      });
    },

    handleEdit(index, row) {
      this.editFormVisible = true;
      this.editForm = Object.assign({}, row);
      const id = this.editForm.clientOuterId;
      const name = this.editForm.company;
      this.editForm.company = { outerId: id, company: name };
      this.getClientModal();
      this.getTechModal();
      this.getBusinessModal();
      this.getMentorModal();
      this.getProjectIdModal();
    },
    async editProjectSubmit() {
      this.$refs.editForm.validate(valid => {
        if (valid) {
          this.$confirm("确认提交吗", "提示", {}).then(() => {
            this.submitLoading = true;
            const para = {};
            para.outerId = this.editForm.outerId;
            para.name = this.editForm.name;
            para.clientOuterId = this.editForm.company.outerId;
            para.company = this.editForm.company.company;
            para.startDate = this.editForm.startDate;
            para.endDate = this.editForm.endDate;
            para.supervisorId = this.editForm.supervisorId;
            para.supervisorName = this.editForm.supervisorName;
            console.log(para);
            ProjectSYJ.updateProject(para).then(res => {
              this.submitLoading = false;
              this.editFormVisible = false;
              this.refresh();
              this.$message({
                message: "提交成功！",
                type: "success"
              });
            });
          });
        }
      });
    },

    handleDel(index, row) {
      this.$confirm("确定对该项目进行归档吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$message({
            type: "success",
            message: "删除成功!"
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    }
  }
};
</script>

<style lang="scss" scoped>
.add-btn {
  margin-left: 20px;
  border-radius: 3px;
  width: 80px;
}
.my-autocomplete {
  li {
    line-height: normal;
    padding: 7px;

    .name {
      text-overflow: ellipsis;
      overflow: hidden;
    }
    .projectId {
      font-size: 12px;
      color: #b4b4b4;
    }

    .highlighted .addr {
      color: #ddd;
    }
  }
  .line {
    text-align: right;
  }
}
</style>
