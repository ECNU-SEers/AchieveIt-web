<template>
  <div>
    <!--工具条：搜索栏-->
    <PageHeader title="项目列表">
      <Search />
      <el-button type="primary" class="add-btn" @click="addFormVisible = true"
        >新增</el-button
      >
    </PageHeader>

    <!--项目列表-->
    <Pagination>
      <el-table :data="projects" highlight-current-row style="width: 100%">
        <el-table-column type="expand">
          <!-- <template slot-scope="props">
              <el-table :data="props.row.projectProgress" highlight-current-row style="width:80%">
                <el-table-column type="index" label="序号" width="70px"></el-table-column>
                <el-table-column prop="updateDate" label="更新日期"></el-table-column>
                <el-table-column prop="state" label="更新状态"></el-table-column>
                <el-table-column prop="recorder" label="触发人"></el-table-column>
              </el-table>
          </template>-->
          <el-timeline :reverse="reverse">
            <el-timeline-item
              v-for="(activity, index) in activities"
              :key="index"
              :icon="activity.icon"
              :type="activity.type"
              :color="activity.color"
              :size="activity.size"
              :timestamp="activity.timestamp"
              >{{ activity.state }}</el-timeline-item
            >
          </el-timeline>
        </el-table-column>
        <el-table-column
          label="序号"
          type="index"
          width="70px"
        ></el-table-column>
        <el-table-column label="项目ID" prop="projectId"></el-table-column>
        <el-table-column label="项目名称" prop="projectName"></el-table-column>
        <el-table-column label="客户名称" prop="clientName"></el-table-column>
        <el-table-column label="预定时间" prop="startDate"></el-table-column>
        <el-table-column label="交付日" prop="endDate"></el-table-column>
        <el-table-column
          label="项目经理"
          prop="projectManager"
        ></el-table-column>
        <el-table-column label="项目状态" prop="projectState"></el-table-column>
        <el-table-column label="参与人数" prop="projectMem"></el-table-column>
        <el-table-column fixed="right" label="操作" width="180px">
          <template slot-scope="scope">
            <el-button-group>
              <el-button
                size="medium"
                @click="testNotify"
                icon="el-icon-search"
              ></el-button>
              <el-button
                size="medium"
                type="primary"
                @click.stop="handleEdit(scope.row)"
                icon="el-icon-edit"
              ></el-button>
              <el-button
                size="medium"
                type="danger"
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
          <el-select
            v-model="addForm.projectId"
            placeholder="请选择ID"
          ></el-select>
        </el-form-item>
        <el-form-item label="项目名称" style="width:500px" required>
          <el-input
            v-model="addForm.projectName"
            placeholder="请填写项目名称"
          ></el-input>
        </el-form-item>
        <el-form-item label="客户" required>
          <el-select
            v-model="addForm.clientId"
            placeholder="请选择客户"
          ></el-select>
        </el-form-item>
        <el-form-item label="预定时间" required>
          <el-date-picker
            v-model="addForm.startDate"
            placeholder="请选择预定时间"
            type="date"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="交付日" required>
          <el-date-picker
            v-model="addForm.endDate"
            placeholder="请选择交付日"
            type="date"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="项目经理" style="width: 500px" required>
          <el-input
            v-model="addForm.projectManager"
            disabled
            width="200px"
          ></el-input>
        </el-form-item>
        <el-form-item label="项目主管" required>
          <el-select
            v-model="addForm.projectMentor"
            placeholder="请选择项目主管"
          ></el-select>
        </el-form-item>
        <el-form-item label="采用技术" required>
          <el-select
            v-model="addForm.tech"
            placeholder="请选择采用技术"
          ></el-select>
        </el-form-item>
        <el-form-item label="业务领域">
          <el-select
            v-model="addForm.area"
            placeholder="请选择业务领域"
          ></el-select>
        </el-form-item>
        <el-form-item label="主要功能">
          <el-cascader
            v-model="addForm.function"
            placeholder="请选择主要功能"
          ></el-cascader>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addFormVisible = false">取消</el-button>
        <el-button
          type="primary"
          @click="addProjectSubmit"
          :loading="submitLoading"
          >提交</el-button
        >
      </div>
    </el-dialog>

    <!--编辑项目-->
    <el-dialog title="编辑项目" :visible.sync="editFormVisible">
      <el-form
        ref="editForm"
        :model="editForm"
        label-width="80px"
        class="demo-ruleForm"
      >
        <el-form-item label="项目ID">
          <el-select
            v-model="editForm.projectId"
            placeholder="请选择ID"
            disabled
          ></el-select>
        </el-form-item>
        <el-form-item label="项目名称" style="width:500px">
          <el-input
            v-model="editForm.projectName"
            placeholder="请填写项目名称"
          ></el-input>
        </el-form-item>
        <el-form-item label="客户">
          <el-select
            v-model="editForm.clientId"
            placeholder="请选择客户"
          ></el-select>
        </el-form-item>
        <el-form-item label="预定时间">
          <el-date-picker
            v-model="editForm.startDate"
            placeholder="请选择预定时间"
            type="date"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="交付日">
          <el-date-picker
            v-model="editForm.endDate"
            placeholder="请选择交付日"
            type="date"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="项目经理" style="width: 500px">
          <el-input
            v-model="editForm.projectManager"
            disabled
            width="200px"
          ></el-input>
        </el-form-item>
        <el-form-item label="项目主管">
          <el-select
            v-model="editForm.projectMentor"
            placeholder="请选择项目主管"
          ></el-select>
        </el-form-item>
        <el-form-item label="采用技术">
          <el-select
            v-model="editForm.tech"
            placeholder="请选择采用技术"
          ></el-select>
        </el-form-item>
        <el-form-item label="业务领域">
          <el-select
            v-model="editForm.area"
            placeholder="请选择业务领域"
          ></el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editFormVisible = false">取消</el-button>
        <el-button
          type="primary"
          @click="editProjectSubmit"
          :loading="submitLoading"
          >提交</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
import PageHeader from '../../components/common/PageHeader';
import Search from '../../components/common/Search';
import Pagination from '../../components/common/Pagination';

export default {
  components: {
    PageHeader,
    Search,
    Pagination
  },
  data() {
    return {
      projectOptions: [
        {
          projectName: '项目1',
          projectId: 'id1'
        },
        {
          projectName: '项目2',
          projectId: 'id2'
        },
        {
          projectName: '项目2',
          projectId: 'id3'
        },
        {
          projectName: '项目2',
          projectId: 'id4'
        }
      ],

      projectNameLoading: false,
      projectNameSearch: '',

      projects: [
        {
          projectId: '123',
          projectName: '项目test',
          clientName: '客户1',
          startDate: '2020-01-01',
          endDate: '2020-08-01',
          projectManager: '项目经理',
          projectState: '进行中',
          projectMem: 10,
          projectProgress: [
            {
              updateDate: '2020-01-01',
              state: '申请立项',
              recorder: '项目经理'
            },
            {
              updateDate: '2020-01-03',
              state: '已立项',
              recorder: '项目经理主管'
            },
            {
              updateDate: '2020-01-05',
              state: '进行中',
              recorder: '项目经理'
            }
          ]
        }
      ],

      // 新增项目
      addFormVisible: false,
      addForm: {
        projectId: '',
        projectName: '',
        clientId: '',
        startDate: '',
        endDate: '',
        projectManager: '',
        projectMentor: '',
        tech: '',
        area: '',
        function: ''
      },
      addFormRules: {
        projectId: [
          {
            required: true,
            message: '请选择项目ID',
            triggle: 'blur'
          }
        ],
        projectName: [
          {
            required: true,
            message: '请填写项目名称',
            triggle: 'blur'
          }
        ],
        clientId: [
          {
            required: true,
            message: '请选择客户',
            triggle: 'blur'
          }
        ],
        startDate: [
          {
            required: true,
            message: '请选择预定日期',
            triggle: 'blur'
          }
        ],
        endDate: [
          {
            required: true,
            message: '请选择交付日',
            triggle: 'blur'
          }
        ],
        projectManager: [
          {
            required: true,
            message: '请选择项目经理',
            triggle: 'blur'
          }
        ],
        projectMentor: [
          {
            required: true,
            message: '请选择项目主管',
            triggle: 'blur'
          }
        ],
        tech: [
          {
            required: true,
            message: '请选择技术',
            triggle: 'blur'
          }
        ]
      },

      // 编辑项目
      editFormVisible: false,
      editForm: {
        projectId: '',
        projectName: '',
        clientId: '',
        startDate: '',
        endDate: '',
        projectManager: '',
        projectMentor: '',
        tech: '',
        area: '',
        function: ''
      },

      submitLoading: false,

      // 时间轴
      reverse: false,
      activities: [
        {
          state: '进行中',
          timestamp: '2018-04-15',
          type: 'primary',
          size: 'large'
        },
        {
          state: '已立项',
          timestamp: '2018-04-13',
          type: 'success'
        },
        {
          state: '申请立项',
          timestamp: '2018-04-11',
          type: 'success'
        }
      ]
    };
  },
  methods: {
    testNotify() {
      this.$notify({
        title: '成功',
        message: '这是一条成功的提示消息',
        type: 'success'
      });
    },
    getProject() {},

    addProjectSubmit() {},

    handleEdit(row) {
      this.editFormVisible = true;
      this.editForm = Object.assign({}, row);
    },

    editProjectSubmit() {}
  }
};
</script>

<style lang="scss" scoped>
.add-btn {
  height: 40px;
  margin-left: 20px;
  border-radius: 3px;
  width: 80px;
}
</style>
