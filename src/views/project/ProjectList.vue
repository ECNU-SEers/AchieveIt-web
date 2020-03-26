<template>
  <div>
    <!--工具条：搜索栏-->
    <PageHeader title="项目列表">
      <Search placeholder="请输入项目名称" :query-search="searchProject">
        <template slot-scope="{ item }">
          <div style="text-overflow: ellipsis; overflow: hidden;">{{ item.name }}</div>
          <span style="float: right; color: #8492a6; font-size: 13px">{{item.outerId}}</span>
        </template>
      </Search>
      <el-button type="primary" class="add-btn" @click="handleAdd">新增</el-button>
    </PageHeader>

    <!--项目列表-->
    <Pagination>
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
              <el-button size="medium" @click="testNotify" icon="el-icon-search"></el-button>
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
        ref="addForm"
        :model="addForm"
        :rules="addFormRules"
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
          <el-select v-model="addForm.company" placeholder="请选择客户">
            <el-option
              v-for="item in clients"
              :key="item.outerId"
              :label="item.company"
              :value="item.outerId"
            >
              <span style="float: left">{{ item.company }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{item.outerId}}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <!-- <el-form-item label="预定时间" prop="startDate">
          <el-date-picker v-model="addForm.startDate" placeholder="请选择预定时间" type="date"></el-date-picker>
        </el-form-item>
        <el-form-item label="交付日" prop="endDate">
          <el-date-picker v-model="addForm.endDate" placeholder="请选择交付日" type="date"></el-date-picker>
        </el-form-item>-->
        <el-form-item label="起止时间" prop="dateRange">
          <el-date-picker
            v-model="addForm.dateRange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="项目经理" prop="manager">
          <el-input v-model="addForm.manager" disabled></el-input>
        </el-form-item>
        <el-form-item label="项目主管" prop="supervisor">
          <el-select v-model="addForm.supervisor" placeholder="请选择项目主管">
            <el-option v-for="item in mentors" :key="item.id" :label="item.name" :value="item.id">
              <span style="float: left">{{ item.name }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{item.id}}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="采用技术" prop="tech">
          <el-select v-model="addForm.tech" placeholder="请选择采用技术">
            <el-option v-for="item in teches" :key="item.id" :label="item.name" :value="item.id">
              <span style="float: left">{{ item.name }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{item.id}}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="业务领域" prop="area">
          <el-select v-model="addForm.area" placeholder="请选择业务领域">
            <el-option v-for="item in busiAreas" :key="item.id" :label="item.name" :value="item.id">
              <span style="float: left">{{ item.name }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{item.id}}</span>
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addFormVisible = false">取消</el-button>
        <el-button type="primary" @click="addProjectSubmit('addForm')" :loading="submitLoading">提交</el-button>
      </div>
    </el-dialog>

    <!--编辑项目-->
    <el-dialog title="编辑项目" :visible.sync="editFormVisible">
      <el-form ref="editForm" :model="editForm" label-width="80px" class="demo-ruleForm">
        <el-form-item label="项目ID" prop="outerId">
          <el-select v-model="editForm.outerId" placeholder="请选择ID" disabled></el-select>
        </el-form-item>
        <el-form-item label="项目名称" prop="name">
          <el-input v-model="editForm.name" placeholder="请填写项目名称"></el-input>
        </el-form-item>
        <el-form-item label="客户" prop="company">
          <el-select v-model="editForm.company" placeholder="请选择客户">
            <el-option
              v-for="item in clients"
              :key="item.outerId"
              :label="item.company"
              :value="item.outerId"
            >
              <span style="float: left">{{ item.company }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{item.outerId}}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="预定时间" prop="startDate">
          <el-date-picker v-model="editForm.startDate" placeholder="请选择预定时间" type="date"></el-date-picker>
        </el-form-item>
        <el-form-item label="交付日" prop="endDate">
          <el-date-picker v-model="editForm.endDate" placeholder="请选择交付日" type="date"></el-date-picker>
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
      pageSize: 10,
      userId: 1,
      userName: "管理员",
      projects: [],

      clients: [],

      teches: [],

      busiAreas: [],

      mentors: [],

      IDs: [],

      projectOptions: [
        {
          projectName: "项目1",
          projectId: "id1"
        },
        {
          projectName: "项目2",
          projectId: "id2"
        },
        {
          projectName: "项目2",
          projectId: "id3"
        },
        {
          projectName: "项目2",
          projectId: "id4"
        }
      ],
      projectNameLoading: false,
      projectNameSearch: "",
      // 新增项目
      addFormVisible: false,
      addForm: {
        outerId: "",
        name: "",
        company: "",
        startDate: "",
        endDate: "",
        manager: "",
        supervisor: "",
        tech: "",
        area: "",
        dateRange: ""
      },
      addFormRules: {
        outerId: [
          {
            required: true,
            message: "请选择项目ID",
            triggle: "change"
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
            required: true,
            message: "请选择客户",
            triggle: "change"
          }
        ],
        startDate: [
          {
            required: true,
            message: "请选择预定日期",
            triggle: "change"
          }
        ],
        endDate: [
          {
            required: true,
            message: "请选择交付日",
            triggle: "change"
          }
        ],
        manager: [
          {
            required: true,
            message: "请选择项目经理",
            triggle: "change"
          }
        ],
        supervisor: [
          {
            required: true,
            message: "请选择项目主管",
            triggle: "change"
          }
        ],
        tech: [
          {
            required: true,
            message: "请选择采用技术",
            triggle: "change"
          }
        ]
      },
      // 编辑项目
      editFormVisible: false,
      editForm: {
        outerId: "",
        name: "",
        company: "",
        startDate: "",
        endDate: "",
        managerName: "",
        supervisorName: ""
      },
      editFormRules: {
        outerId: [
          {
            required: true,
            message: "请选择项目ID",
            triggle: "change"
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
            required: true,
            message: "请选择客户",
            triggle: "change"
          }
        ],
        startDate: [
          {
            required: true,
            message: "请选择预定日期",
            triggle: "change"
          }
        ],
        endDate: [
          {
            required: true,
            message: "请选择交付日",
            triggle: "change"
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
  },
  methods: {
    testNotify() {
      this.$notify({
        title: "成功",
        message: "这是一条成功的提示消息",
        type: "success"
      });
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

    // 项目搜索框
    searchProject(queryString, cb) {
      var projects = this.projects;
      console.log(projects);
      console.log(queryString);
      var results = queryString
        ? projects.filter(this.createFilter(queryString))
        : projects;
      cb(results);
    },

    createFilter(queryString) {
      return project => {
        return (
          project.name.toLowerCase().indexOf(queryString.toLowerCase()) === 0
        );
      };
    },

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
      this.addForm.manager = this.userName;
      this.getClientModal();
      this.getTechModal();
      this.getBusinessModal();
      // this.getMentorModal();
      this.getProjectIdModal();
    },

    addProjectSubmit(addForm) {
      console.log(this.addForm.dateRange);
      console.log(this.addForm);
      this.$refs[addForm].validate(valid => {
        if (valid) {
          this.$confirm("确定提交吗？", "提示", {}).then(() => {
            this.submitLoading = true;
            const para = Object.assign({}, this.addForm);
            console.log(para);
          });
        }
      });
      // this.submitLoading = false;
    },

    handleEdit(index, row) {
      this.editFormVisible = true;
      this.editForm = Object.assign({}, row);
      this.getClientModal();
      this.getTechModal();
      this.getBusinessModal();
      // this.getMentorModal();
      this.getProjectIdModal();
    },
    editProjectSubmit() {},

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
}
</style>
