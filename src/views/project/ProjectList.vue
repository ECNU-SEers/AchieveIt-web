<template>
  <div>
    <!--工具条：搜索栏-->
    <PageHeader title="项目列表">
      <Search
        placeholder="请输入项目名称"
        :query-search="querySearch"
        @search="searchProject"
        @select-suggestion="selectSearch"
      >
        <template slot-scope="{ item }">
          <div style="text-overflow: ellipsis; overflow: hidden;">{{ item.value }}</div>
          <span style="float: right; color: #8492a6; font-size: 13px">{{ item.outerId }}</span>
        </template>
      </Search>
      <el-button type="primary" class="add-btn" @click="handleAdd" v-permission="'新建项目'">新增</el-button>
    </PageHeader>

    <!--项目列表-->
    <Pagination
      :current-page.sync="pageNo"
      :page-size="pageSize"
      :total="projectsLength"
      @page-change="handlePageChange"
    >
      <el-table
        v-loading="infoLoading"
        :data="projects"
        highlight-current-row
        style="width: 100%"
        stripe
      >
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
              <el-button
                size="medium"
                @click.stop="handleDetail(scope.$index, scope.row)"
                icon="el-icon-search"
              ></el-button>
              <el-button
                v-permission="'新建项目'"
                size="medium"
                type="primary"
                @click.stop="handleEdit(scope.$index, scope.row)"
                icon="el-icon-edit"
              ></el-button>
              <el-button
                v-permission="'分配QA'"
                size="medium"
                type="primary"
                @click.stop="handleAssignQA(scope.$index, scope.row)"
                icon="el-icon-user-solid"
              ></el-button>
              <el-button
                v-permission="'分配EPG'"
                size="medium"
                type="primary"
                @click.stop="handleAssignEPG(scope.$index, scope.row)"
                icon="el-icon-user-solid"
              ></el-button>
              <el-button
                v-permission="'审核项目'"
                size="medium"
                type="primary"
                @click.stop="handleApproval(scope.$index, scope.row)"
                icon="el-icon-document"
              ></el-button>
              <el-button
                v-permission="'归档审批'"
                size="medium"
                type="primary"
                @click.stop="handleArchive(scope.$index, scope.row)"
                icon="el-icon-document"
              ></el-button>
              <el-button
                v-permission="'归档申请'"
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
        label-width="130px"
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
          <el-col class="line" :span="2" align="center">至</el-col>
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
        <!-- <el-form-item label="项目经理" prop="managerName">
          <el-input v-model="addForm.managerName" disabled></el-input>
        </el-form-item>-->
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
        <el-form-item label="QA经理" prop="qaManagerName">
          <el-select v-model="addForm.qaManagerName" value-key="id" placeholder="请选择QA经理">
            <el-option
              v-for="item in QAmanagers"
              :key="item.id"
              :label="item.realName"
              :value="item"
            >
              <span style="float: left">{{ item.realName }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">
                {{
                item.username
                }}
              </span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="EPG Leader" prop="epgLeaderName">
          <el-select v-model="addForm.epgLeaderName" value-key="id" placeholder="请选择EPG Leader">
            <el-option
              v-for="item in EPGLeaders"
              :key="item.id"
              :label="item.realName"
              :value="item"
            >
              <span style="float: left">{{ item.realName }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">
                {{
                item.username
                }}
              </span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="组织配置管理员" prop="configOrganizerName">
          <el-select v-model="addForm.configOrganizerName" value-key="id" placeholder="请选择组织配置管理员">
            <el-option
              v-for="item in configLeaders"
              :key="item.id"
              :label="item.realName"
              :value="item"
            >
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
        <el-form-item label="备注" prop="remark">
          <el-input v-model="addForm.remark" placeholder="请填写备注" type="textarea"></el-input>
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
          <el-col class="line" :span="2" align="center">至</el-col>
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

    <!--审批项目-->
    <el-dialog title="审批项目" :visible.sync="approvalVisible" :close-on-click-modal="false">
      <el-form
        @submit.native.prevent
        ref="approvalForm"
        :model="approvalForm"
        :rules="approvalFormRules"
        label-width="100px"
      >
        <el-form-item label="项目ID" prop="outerId">
          <el-select v-model="approvalForm.outerId" placeholder="请选择ID" disabled></el-select>
        </el-form-item>
        <el-form-item label="项目名称" prop="name">
          <el-input v-model="approvalForm.name" placeholder="请填写项目名称" disabled></el-input>
        </el-form-item>
        <el-form-item label="客户" prop="company">
          <el-select
            v-model="approvalForm.company"
            value-key="outerId"
            placeholder="请选择客户"
            disabled
          ></el-select>
        </el-form-item>
        <el-form-item label="起止时间" required>
          <el-col :span="11">
            <el-form-item prop="startDate">
              <el-date-picker
                type="date"
                placeholder="选择日期"
                v-model="approvalForm.startDate"
                value-format="yyyy-MM-dd"
                :picker-options="start_Date"
                style="width: 100%;"
                disabled
              ></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col class="line" :span="2" align="center">至</el-col>
          <el-col :span="11">
            <el-form-item prop="endDate">
              <el-date-picker
                type="date"
                placeholder="选择日期"
                v-model="approvalForm.endDate"
                value-format="yyyy-MM-dd"
                :picker-options="end_Date"
                style="width: 100%;"
                disabled
              ></el-date-picker>
            </el-form-item>
          </el-col>
        </el-form-item>
        <el-form-item label="项目经理" prop="managerName">
          <el-input v-model="approvalForm.managerName" disabled></el-input>
        </el-form-item>
        <el-form-item label="项目主管" prop="supervisorName">
          <el-input v-model="approvalForm.supervisorName" disabled></el-input>
        </el-form-item>
        <el-form-item label="审批结果" prop="result">
          <el-radio-group v-model="approvalForm.result">
            <el-radio label="通过"></el-radio>
            <el-radio label="驳回"></el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input type="textarea" v-model="approvalForm.remark"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="approvalVisible = false">取消</el-button>
        <el-button type="primary" @click="approvalSubmit" :loading="submitLoading">提交</el-button>
      </div>
    </el-dialog>

    <!--分配QA-->
    <el-dialog title="分配QA" :visible.sync="assignQAVisible" :close-on-click-modal="false">
      <el-form
        @submit.native.prevent
        ref="assignQAForm"
        :model="assignQAForm"
        :rules="assignQAFormRules"
        label-width="100px"
      >
        <el-form-item label="项目ID" prop="outerId">
          <el-select v-model="assignQAForm.outerId" placeholder="请选择ID" disabled></el-select>
        </el-form-item>
        <el-form-item label="项目名称" prop="name">
          <el-input v-model="assignQAForm.name" placeholder="请填写项目名称" disabled></el-input>
        </el-form-item>
        <el-form-item label="客户" prop="company">
          <el-select
            v-model="assignQAForm.company"
            value-key="outerId"
            placeholder="请选择客户"
            disabled
          ></el-select>
        </el-form-item>
        <el-form-item label="起止时间" required>
          <el-col :span="11">
            <el-form-item prop="startDate">
              <el-date-picker
                type="date"
                placeholder="选择日期"
                v-model="assignQAForm.startDate"
                value-format="yyyy-MM-dd"
                :picker-options="start_Date"
                style="width: 100%;"
                disabled
              ></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col class="line" :span="2" align="center">至</el-col>
          <el-col :span="11">
            <el-form-item prop="endDate">
              <el-date-picker
                type="date"
                placeholder="选择日期"
                v-model="assignQAForm.endDate"
                value-format="yyyy-MM-dd"
                :picker-options="end_Date"
                style="width: 100%;"
                disabled
              ></el-date-picker>
            </el-form-item>
          </el-col>
        </el-form-item>
        <el-form-item label="项目经理" prop="managerName">
          <el-input v-model="assignQAForm.managerName" disabled></el-input>
        </el-form-item>
        <el-form-item label="项目主管" prop="supervisorName">
          <el-input v-model="assignQAForm.supervisorName" disabled></el-input>
        </el-form-item>
        <el-form-item label="分配QA" prop="qalist">
          <el-select v-model="assignQAForm.qalist" multiple placeholder="请选择QA">
            <el-option
              v-for="item in employees"
              :key="item.userId"
              :label="item.realName"
              :value="item.userId"
              size="medium"
            >
              <span style="float: left">{{ item.realName }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">
                {{
                item.username
                }}
              </span>
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="assignQAVisible = false">取消</el-button>
        <el-button type="primary" @click="assignQASubmit" :loading="submitLoading">提交</el-button>
      </div>
    </el-dialog>

    <!-- 分配EPG -->
    <el-dialog title="分配EPG" :visible.sync="assignEPGVisible" :close-on-click-modal="false">
      <el-form
        @submit.native.prevent
        ref="assignEPGForm"
        :model="assignEPGForm"
        :rules="assignEPGFormRules"
        label-width="100px"
        :validate-on-rule-change="false"
      >
        <el-form-item label="项目ID" prop="outerId">
          <el-select v-model="assignEPGForm.outerId" placeholder="请选择ID" disabled></el-select>
        </el-form-item>
        <el-form-item label="项目名称" prop="name">
          <el-input v-model="assignEPGForm.name" placeholder="请填写项目名称" disabled></el-input>
        </el-form-item>
        <el-form-item label="客户" prop="company">
          <el-select
            v-model="assignEPGForm.company"
            value-key="outerId"
            placeholder="请选择客户"
            disabled
          ></el-select>
        </el-form-item>
        <el-form-item label="起止时间" required>
          <el-col :span="11">
            <el-form-item prop="startDate">
              <el-date-picker
                type="date"
                placeholder="选择日期"
                v-model="assignEPGForm.startDate"
                value-format="yyyy-MM-dd"
                :picker-options="start_Date"
                style="width: 100%;"
                disabled
              ></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col class="line" :span="2" align="center">至</el-col>
          <el-col :span="11">
            <el-form-item prop="endDate">
              <el-date-picker
                type="date"
                placeholder="选择日期"
                v-model="assignEPGForm.endDate"
                value-format="yyyy-MM-dd"
                :picker-options="end_Date"
                style="width: 100%;"
                disabled
              ></el-date-picker>
            </el-form-item>
          </el-col>
        </el-form-item>
        <el-form-item label="项目经理" prop="managerName">
          <el-input v-model="assignEPGForm.managerName" disabled></el-input>
        </el-form-item>
        <el-form-item label="项目主管" prop="supervisorName">
          <el-input v-model="assignEPGForm.supervisorName" disabled></el-input>
        </el-form-item>
        <el-form-item label="分配EPG" prop="epglist">
          <el-select v-model="assignEPGForm.epglist" multiple placeholder="请选择EPG">
            <el-option
              v-for="item in employees"
              :key="item.userId"
              :label="item.realName"
              :value="item.userId"
              size="medium"
            >
              <span style="float: left">{{ item.realName }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">
                {{
                item.username
                }}
              </span>
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="assignEPGVisible = false">取消</el-button>
        <el-button type="primary" @click="assignEPGSubmit" :loading="submitLoading">提交</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import PageHeader from "../../components/common/PageHeader";
import Search from "../../components/common/Search";
import Pagination from "../../components/common/Pagination";
import ProjectSYJ from "@/sys/models/project_syj";
import { mapGetters } from "vuex";

export default {
  components: {
    PageHeader,
    Search,
    Pagination
  },
  data() {
    return {
      infoLoading: true,
      // 分页
      pageNo: 1,
      pageSize: 10,
      projects: [],
      projectsLength: 0,
      keyword: "",
      selectedProject: "",

      // 模态框
      clients: [],
      teches: [],
      busiAreas: [],
      mentors: [],
      QAmanagers: [],
      EPGLeaders: [],
      configLeaders: [],
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
        businessAreaName: "",
        qaManagerId: 0,
        qaManagerName: "",
        epgLeaderId: 0,
        epgLeaderName: "",
        configOrganizerId: 0,
        configOrganizerName: "",
        remark: ""
      },
      addFormRules: {
        outerId: [
          {
            required: true,
            message: "请选择项目ID",
            trigger: "blur"
          }
        ],
        name: [
          {
            required: true,
            message: "请填写项目名称",
            trigger: "blur"
          }
        ],
        company: [
          {
            type: "object",
            required: true,
            message: "请选择客户",
            trigger: "blur"
          }
        ],
        startDate: [
          {
            required: true,
            message: "请选择项目开始日期",
            trigger: "blur"
          }
        ],
        endDate: [
          {
            required: true,
            message: "请选择项目结束日期",
            trigger: "blur"
          }
        ],
        supervisorName: [
          {
            type: "object",
            required: true,
            message: "请选择项目主管",
            trigger: "blur"
          }
        ],
        qaManagerName: [
          {
            type: "object",
            required: true,
            message: "请选择QA经理",
            trigger: "blur"
          }
        ],
        epgLeaderName: [
          {
            type: "object",
            required: true,
            message: "请选择EPG Leader",
            trigger: "blur"
          }
        ],
        configOrganizerName: [
          {
            type: "object",
            required: true,
            message: "请选择组织配置管理员",
            trigger: "blur"
          }
        ],
        skillNames: [
          {
            type: "array",
            required: true,
            message: "请选择采用技术",
            trigger: "blur"
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
            trigger: "blur"
          }
        ],
        company: [
          {
            type: "object",
            required: true,
            message: "请选择客户",
            trigger: "blur"
          }
        ],
        startDate: [
          {
            required: true,
            message: "请选择预定日期",
            trigger: "blur"
          }
        ],
        endDate: [
          {
            required: true,
            message: "请选择交付日期",
            trigger: "blur"
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
      ],

      // 立项审批
      approvalVisible: false,
      approvalForm: {
        outerId: "",
        name: "",
        company: {},
        startDate: "",
        endDate: "",
        managerId: "",
        managerName: "",
        supervisorName: "",
        supervisorId: "",
        result: "",
        remark: ""
      },
      approvalFormRules: {
        result: [
          {
            required: true,
            message: "请选择审批结果",
            trigger: "blur"
          }
        ],
        remark: [
          {
            required: true,
            message: "请填写审批意见",
            trigger: "blur"
          }
        ]
      },

      // 分配QA
      assignQAVisible: false,
      employees: [],
      assignQAForm: {
        outerId: "",
        name: "",
        company: {},
        startDate: "",
        endDate: "",
        managerId: "",
        managerName: "",
        supervisorName: "",
        supervisorId: "",
        qalist: []
      },
      assignQAFormRules: {
        qalist: [
          {
            type: "array",
            required: true,
            message: "请选择QA",
            trigger: "blur"
          }
        ]
      },

      // 分配EPG
      assignEPGVisible: false,
      assignEPGForm: {
        outerId: "",
        name: "",
        company: {},
        startDate: "",
        endDate: "",
        managerId: "",
        managerName: "",
        supervisorName: "",
        supervisorId: "",
        epglist: []
      },
      assignEPGFormRules: {
        epglist: [
          {
            type: "array",
            required: true,
            message: "请选择EPG",
            trigger: "blur"
          }
        ]
      }
    };
  },
  computed: {
    ...mapGetters(["permissions"])
  },
  mounted() {
    this.getProjects();
    this.getProjectModals();
    console.log(this.user);
  },
  methods: {
    refresh() {
      this.getProjects();
      this.getProjectModals();
    },

    clearcheck(formName) {
      if (this.$refs[formName]) {
        this.$refs[formName].clearValidate();
      }
    },

    handleDetail(index, row) {
      // if (row.state === '申请立项' || row.state === '立项驳回') {
      //   this.$message({
      //     type: "warning",
      //     message: "当前项目申请中，暂无详情"
      //   });
      // } else {
      this.$router.push({
        path: "/project/basic",
        query: {
          projectId: row.id,
          outerId: row.outerId,
          projectState: row.state
        }
      });
      // }
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
        this.keyword
      );
      this.projects = res.items;
      this.infoLoading = false;
    },

    async getProjectModals() {
      this.projectModal = await ProjectSYJ.getProjectModal();
      this.projectsLength = this.projectModal.length;
    },

    // 项目搜索框
    querySearch(queryString, cb) {
      var projectModal = [];
      this.projectModal.forEach(item => {
        const obj = {};
        obj.id = item.outerId;
        obj.value = item.name;
        projectModal.push(obj);
      });
      const results = queryString
        ? projectModal.filter(item => item.value.includes(queryString))
        : projectModal;
      // const results = [{value: '111'}];
      // cb([{ value: "111" }]);
      cb(results);
    },

    async selectSearch(item) {
      console.log("select search item-------");
      console.log(item);
      this.selectedMember = item.id;
    },

    async searchProject(keyword) {
      console.log("keyword search");
      console.log(keyword);
      const res = await ProjectSYJ.getProjectList(
        this.pageNo,
        this.pageSize,
        keyword
      );
      console.log(res);
      this.projects = res.items;
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

    async getQAManagerModal() {
      const res = await ProjectSYJ.getAllQAManagers();
      this.QAmanagers = res;
    },

    async getEPGLeaderModal() {
      const res = await ProjectSYJ.getAllEPGLeaders();
      this.EPGLeaders = res;
    },

    async getConfigLeader() {
      const res = await ProjectSYJ.getAllConfigLeaders();
      this.configLeaders = res;
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
      this.getQAManagerModal();
      this.getEPGLeaderModal();
      this.getConfigLeader();
    },

    addProjectSubmit() {
      this.$refs.addForm.validate(valid => {
        if (valid) {
          this.$confirm("确定提交吗？", "提示", {}).then(() => {
            this.submitLoading = true;
            const para = Object.assign({}, this.addForm);
            console.log(para);
            // const para = {};
            para.clientOuterId = para.company.outerId;
            para.company = para.company.company;
            para.supervisorId = para.supervisorName.id;
            para.supervisorName = para.supervisorName.username;
            para.qaManagerId = para.qaManagerName.id;
            para.qaManagerName = para.qaManagerName.username;
            para.epgLeaderId = para.epgLeaderName.id;
            para.epgLeaderName = para.epgLeaderName.username;
            para.configOrganizerId = para.configOrganizerName.id;
            para.configOrganizerName = para.configOrganizerName.username;
            delete para.managerId;
            delete para.managerName;
            console.log(para);
            ProjectSYJ.addProject(para).then(res => {
              this.submitLoading = false;
              this.addFormVisible = false;
              this.refresh();
              this.$refs["addForm"].resetFields();
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
      if (row.state === "已立项") {
        this.$prompt("如果确定将进行该项目，请填写备注（选填）", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(({ value }) => {
            ProjectSYJ.stateToRun(row.outerId, value).then(res => {
              this.getProjects();
              this.$message({
                type: "success",
                message: "已修改!"
              });
            });
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消"
            });
          });
      } else if (row.state === "进行中") {
        this.$prompt("如果确定交付该项目，请填写备注（选填）", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(({ value }) => {
            ProjectSYJ.stateToDeliver(row.outerId, value).then(res => {
              this.getProjects();
              this.$message({
                type: "success",
                message: "已修改!"
              });
            });
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消"
            });
          });
      } else if (
        row.state === "已交付" ||
        row.state === "结束" ||
        row.state === "已归档"
      ) {
        this.$message({
          type: "warning",
          message: "当前项目已交付，不允许编辑"
        });
      } else {
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
      }
    },

    handleAssignQA(index, row) {
      this.clearcheck(this.assignQAForm);
      this.assignQAForm = Object.assign({}, row);
      if (this.assignQAForm.state === "已立项") {
        this.getAllUsers();
        this.assignQAVisible = true;
      } else {
        this.$message({
          type: "warning",
          message: "项目当前状态不允许分配QA"
        });
      }
    },

    handleAssignEPG(index, row) {
      this.assignEPGForm = Object.assign({}, row);  
      // this.$refs.assignEPGForm.clearValidate();
      if (this.assignEPGForm.state === "已立项") {
        this.getAllUsers();
        this.assignEPGVisible = true;
        
      } else {
        this.$message({
          type: "warning",
          message: "项目当前状态不允许分配EPG"
        });
      }
    },

    handleApproval(index, row) {
      if (row.state === "申请立项") {
        this.approvalVisible = true;
        this.approvalForm = Object.assign({}, row);
      } else {
        this.$message({
          type: "warning",
          message: "项目当前状态不需要审批"
        });
      }
    },

    handleArchive(index, row) {
      const tmp = Object.assign({}, row);
      if (tmp.state === "结束") {
        this.$prompt("如果确定对该项目进行归档，请填写备注", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(({ value }) => {
            ProjectSYJ.approvalArchive(row.outerId, value).then(res => {
              this.$message({
                type: "success",
                message: "已同意!"
              });
              this.getProjects();
            });
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消"
            });
          });
      } else {
        this.$message({
          type: "warning",
          message: "当前项目未结束，不允许归档"
        });
      }
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
              this.$refs["editForm"].resetFields();
              this.$message({
                message: "提交成功！",
                type: "success"
              });
            });
          });
        }
      });
    },

    approvalSubmit() {
      this.$refs.approvalForm.validate(valid => {
        if (valid) {
          this.$confirm("确认提交吗", "提示", {}).then(() => {
            this.submitLoading = true;
            const result = this.approvalForm.result;
            if (result === "通过") {
              ProjectSYJ.acceptProject(
                this.approvalForm.outerId,
                this.approvalForm.remark
              ).then(() => {
                this.submitLoading = false;
                this.approvalVisible = false;
                this.refresh();
                this.$refs["approvalForm"].resetFields();
                this.$message({
                  message: "提交成功！",
                  type: "success"
                });
              });
              const config = {};
              config["fileServerDir"] = "root\\" + this.approvalForm.outerId;
              config["mail"] = this.approvalForm.outerId + "-List";
              config["isFileServerDirConfirmed"] = 0;
              config["isMailConfirmed"] = 0;
              ProjectSYJ.addConfigAfterAccepted(this.approvalForm.id, config);

              // 分配项目经理的权限
              // console.log(this.approvalForm);
              ProjectSYJ.assignRoleForPM(
                this.approvalForm.id,
                6,
                this.approvalForm.managerId
              );
            } else {
              ProjectSYJ.rejectProject(
                this.approvalForm.outerId,
                this.approvalForm.remark
              ).then(() => {
                this.submitLoading = false;
                this.approvalVisible = false;
                this.refresh();
                this.$refs["approvalForm"].resetFields();
                this.$message({
                  message: "提交成功！",
                  type: "success"
                });
              });
            }
          });
        }
      });
    },

    assignQASubmit() {
      this.$refs.assignQAForm.validate(valid => {
        if (valid) {
          this.$confirm("确认提交吗", "提示", {}).then(() => {
            this.submitLoading = true;
            const para = {};
            para.outerId = this.assignQAForm.outerId;
            para.userId = this.assignQAForm.qalist;
            console.log(para);
            ProjectSYJ.assignQAs(para).then(() => {
              this.submitLoading = false;
              this.assignQAVisible = false;
              this.refresh();
              this.$refs["assignQAForm"].resetFields();
              this.$message({
                message: "提交成功！",
                type: "success"
              });
            });
          });
        }
      });
    },

    assignEPGSubmit() {
      this.$refs.assignEPGForm.validate(valid => {
        if (valid) {
          this.$confirm("确认提交吗", "提示", {}).then(() => {
            this.submitLoading = true;
            const para = {};
            para.outerId = this.assignEPGForm.outerId;
            para.userId = this.assignEPGForm.epglist;
            console.log(para);
            ProjectSYJ.assignEPGs(para).then(() => {
              this.submitLoading = false;
              this.assignEPGVisible = false;
              this.refresh();
              this.$refs["assignEPGForm"].resetFields();
              this.$message({
                message: "提交成功！",
                type: "success"
              });
            });
          });
        }
      });
    },

    async getAllUsers() {
      this.employees = await ProjectSYJ.getAllUser();
    },

    handleDel(index, row) {
      if (row.state !== "已交付") {
        this.$message({
          type: "warning",
          message: "项目未交付，不允许进行归档"
        });
      } else {
        this.$prompt("如果确定结束该项目，请填写备注", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(({ value }) => {
            ProjectSYJ.stateToEnd(row.outerId, value).then(res => {
              this.getProjects();
              this.$message({
                type: "success",
                message: "已修改!"
              });
            });
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消"
            });
          });
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.add-btn {
  height: 32px;
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
