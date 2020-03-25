<template>
  <div>
    <!--工具条：搜索栏-->
    <PageHeader title="项目列表">
      <Search placeholder="请输入项目名称" :query-search="searchProject">
        <template slot-scope="{ item }">
          <span style="float: left">{{ item.name }}</span>
          <span style="float: right; color: #8492a6; font-size: 13px">{{ item.outerId }}</span>
        </template>
      </Search>
      <el-button type="primary" class="add-btn" @click="addFormVisible = true">新增</el-button>
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
    <el-dialog title="新建项目" :visible.sync="addFormVisible">
      <el-form
        ref="addForm"
        :model="addForm"
        :rules="addFormRules"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="项目ID" required>
          <el-select v-model="addForm.outerId" placeholder="请选择ID"></el-select>
        </el-form-item>
        <el-form-item label="项目名称" style="width:500px" required>
          <el-input v-model="addForm.name" placeholder="请填写项目名称"></el-input>
        </el-form-item>
        <el-form-item label="客户" required>
          <el-select v-model="addForm.company" placeholder="请选择客户">
            <el-option
              v-for="item in clients"
              :key="item.outerId"
              :label="item.company"
              :value="item.outerId"
            >
              <span style="float: left">{{ item.company }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{ item.outerId }}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="预定时间" required>
          <el-date-picker v-model="addForm.startDate" placeholder="请选择预定时间" type="date"></el-date-picker>
        </el-form-item>
        <el-form-item label="交付日" required>
          <el-date-picker v-model="addForm.endDate" placeholder="请选择交付日" type="date"></el-date-picker>
        </el-form-item>
        <el-form-item label="项目经理" style="width: 500px" required>
          <el-input v-model="addForm.manager" disabled width="200px"></el-input>
        </el-form-item>
        <el-form-item label="项目主管" required>
          <el-select v-model="addForm.supervisorName" placeholder="请选择项目主管"></el-select>
        </el-form-item>
        <el-form-item label="采用技术" required>
          <el-select v-model="addForm.tech" placeholder="请选择采用技术">
            <el-option v-for="item in teches" :key="item.id" :label="item.name" :value="item.id">
              <span style="float: left">{{ item.name }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{ item.id }}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="业务领域">
          <el-select v-model="addForm.area" placeholder="请选择业务领域">
            <el-option v-for="item in busiAreas" :key="item.id" :label="item.name" :value="item.id">
              <span style="float: left">{{ item.name }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{ item.id }}</span>
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addFormVisible = false">取消</el-button>
        <el-button type="primary" @click="addProjectSubmit" :loading="submitLoading">提交</el-button>
      </div>
    </el-dialog>

    <!--编辑项目-->
    <el-dialog title="编辑项目" :visible.sync="editFormVisible">
      <el-form ref="editForm" :model="editForm" label-width="80px" class="demo-ruleForm">
        <el-form-item label="项目ID">
          <el-select v-model="editForm.outerId" placeholder="请选择ID" disabled></el-select>
        </el-form-item>
        <el-form-item label="项目名称" style="width:500px">
          <el-input v-model="editForm.name" placeholder="请填写项目名称"></el-input>
        </el-form-item>
        <el-form-item label="客户">
          <el-select v-model="editForm.company" placeholder="请选择客户">
            <el-option
              v-for="item in clients"
              :key="item.outerId"
              :label="item.company"
              :value="item.outerId"
            >
              <span style="float: left">{{ item.company }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{ item.outerId }}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="预定时间">
          <el-date-picker v-model="editForm.startDate" placeholder="请选择预定时间" type="date"></el-date-picker>
        </el-form-item>
        <el-form-item label="交付日">
          <el-date-picker v-model="editForm.endDate" placeholder="请选择交付日" type="date"></el-date-picker>
        </el-form-item>
        <el-form-item label="项目经理" style="width: 500px">
          <el-input v-model="editForm.manager" disabled width="200px"></el-input>
        </el-form-item>
        <el-form-item label="项目主管">
          <el-select v-model="editForm.supervisorName" placeholder="请选择项目主管"></el-select>
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
      projects: [],

      clients: [],

      teches: [],

      busiAreas: [],

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
        supervisorName: "",
        tech: "",
        area: "",
        function: ""
      },
      addFormRules: {
        projectId: [
          {
            required: true,
            message: "请选择项目ID",
            triggle: "blur"
          }
        ],
        projectName: [
          {
            required: true,
            message: "请填写项目名称",
            triggle: "blur"
          }
        ],
        clientId: [
          {
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
            message: "请选择交付日",
            triggle: "blur"
          }
        ],
        projectManager: [
          {
            required: true,
            message: "请选择项目经理",
            triggle: "blur"
          }
        ],
        projectMentor: [
          {
            required: true,
            message: "请选择项目主管",
            triggle: "blur"
          }
        ],
        tech: [
          {
            required: true,
            message: "请选择技术",
            triggle: "blur"
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
        manager: "",
        supervisorName: "",
        tech: "",
        area: "",
        function: ""
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
    this.getClientModal();
    this.getTechModal();
    this.getBusinessModal();
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
      if (res.code === 1000) {
        this.projects = res.data.items;
      } else {
        this.$message.error("获取项目列表失败");
      }
    },

    // 项目搜索框
    searchProject(queryString, cb) {
      var projects = this.projects;
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
      if (res.code === 1000) {
        this.clients = res.data;
      } else {
        this.$message.error("获取客户信息失败");
      }
    },

    // 获取技术模态框
    async getTechModal() {
      const res = await ProjectSYJ.getAllTech();
      if (res.code === 1000) {
        this.teches = res.data;
      } else {
        this.$message.error("获取技术信息失败");
      }
    },

    //
    async getBusinessModal() {
      const res = await ProjectSYJ.getAllBusinessArea();
      if (res.code === 1000) {
        this.busiAreas = res.data;
      } else {
        this.$message.error("获取业务领域失败");
      }
    },

    // 新增项目

    addProjectSubmit() {},
    handleEdit(index, row) {
      this.editFormVisible = true;
      this.editForm = Object.assign({}, row);
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
</style>