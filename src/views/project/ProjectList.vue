<template>
  <div>
    <!--工具条：搜索栏-->
    <PageHeader title="项目列表">
<<<<<<< HEAD
      <Search
        placeholder="请输入项目名称"
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
      <el-button type="primary" class="add-btn" @click="handleAdd"
=======
      <Search />
      <el-button type="primary" class="add-btn" @click="addFormVisible = true"
>>>>>>> b07486148d0627ecae46743958e8b1fa21c02e1a
        >新增</el-button
      >
    </PageHeader>

    <!--项目列表-->
<<<<<<< HEAD
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
        <el-table-column
          label="序号"
          type="index"
          width="70px"
        ></el-table-column>
        <el-table-column label="项目ID" prop="outerId"></el-table-column>
        <el-table-column label="项目名称" prop="name"></el-table-column>
        <el-table-column label="客户名称" prop="company"></el-table-column>
        <el-table-column label="预定时间" prop="startDate"></el-table-column>
        <el-table-column label="交付日" prop="endDate"></el-table-column>
        <el-table-column label="项目经理" prop="managerName"></el-table-column>
        <el-table-column
          label="项目主管"
          prop="supervisorName"
        ></el-table-column>
        <el-table-column label="项目状态" prop="state"></el-table-column>
        <el-table-column label="QA" prop="qaAssigned"></el-table-column>
        <el-table-column label="EPG" prop="epgAssigned"></el-table-column>
        <el-table-column
          label="参与人数"
          prop="participantCounter"
        ></el-table-column>
        <el-table-column fixed="right" label="操作" width="180px">
          <template slot-scope="scope">
            <el-button-group>
              <el-button
                size="medium"
                @click.stop="handleDetail(scope.$index, scope.row)"
                icon="el-icon-search"
              ></el-button>
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
    <el-dialog
      title="新建项目"
      :visible.sync="addFormVisible"
      :close-on-click-modal="false"
    >
      <el-form
        @submit.native.prevent
        :model="addForm"
        :rules="addFormRules"
        ref="addForm"
        label-width="100px"
      >
        <el-form-item label="项目ID" prop="outerId">
          <el-select v-model="addForm.outerId" placeholder="请选择ID">
            <el-option
              v-for="item in IDs"
              :key="item"
              :label="item"
              :value="item"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="项目名称" prop="name">
          <el-input
            v-model="addForm.name"
            placeholder="请填写项目名称"
          ></el-input>
        </el-form-item>
        <el-form-item label="客户" prop="company">
          <el-select
            v-model="addForm.company"
            value-key="outerId"
            placeholder="请选择客户"
          >
            <el-option
              v-for="item in clients"
              :key="item.outerId"
              :label="item.company"
              :value="item"
            >
              <span style="float: left">{{ item.company }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">
                {{ item.outerId }}
              </span>
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
          <el-select
            v-model="addForm.supervisorName"
            value-key="id"
            placeholder="请选择项目主管"
          >
            <el-option
              v-for="item in mentors"
              :key="item.id"
              :label="item.realName"
              :value="item"
            >
              <span style="float: left">{{ item.realName }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{
                item.username
              }}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="采用技术" prop="skillNames">
          <el-select
            v-model="addForm.skillNames"
            multiple
            placeholder="请选择采用技术"
          >
            <el-option
              v-for="item in teches"
              :key="item.id"
              :label="item.name"
              :value="item.name"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="业务领域" prop="businessAreaName">
          <el-select
            v-model="addForm.businessAreaName"
            placeholder="请选择业务领域"
          >
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
        <el-button
          type="primary"
          @click.native="addProjectSubmit"
          :loading="submitLoading"
          >提交</el-button
        >
      </div>
    </el-dialog>

    <!--编辑项目-->
    <el-dialog
      title="编辑项目"
      :visible.sync="editFormVisible"
      :close-on-click-modal="false"
    >
      <el-form
        @submit.native.prevent
        ref="editForm"
        :model="editForm"
        :rules="editFormRules"
        label-width="100px"
      >
        <el-form-item label="项目ID" prop="outerId">
          <el-select
            v-model="editForm.outerId"
            placeholder="请选择ID"
            disabled
          ></el-select>
        </el-form-item>
        <el-form-item label="项目名称" prop="name">
          <el-input
            v-model="editForm.name"
            placeholder="请填写项目名称"
          ></el-input>
        </el-form-item>
        <el-form-item label="客户" prop="company">
          <el-select
            v-model="editForm.company"
            value-key="outerId"
            placeholder="请选择客户"
          >
            <el-option
              v-for="item in clients"
              :key="item.outerId"
              :label="item.company"
              :value="item"
            >
              <span style="float: left">{{ item.company }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">
                {{ item.outerId }}
              </span>
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
        <el-button
          type="primary"
          @click="editProjectSubmit"
          :loading="submitLoading"
          >提交</el-button
        >
      </div>
    </el-dialog>

    <!--审批项目-->
    <el-dialog
      title="审批项目"
      :visible.sync="approvalVisible"
      :close-on-click-modal="false"
    >
      <el-form
        @submit.native.prevent
        ref="approvalForm"
        :model="approvalForm"
        :rules="approvalFormRules"
        label-width="100px"
      >
        <el-form-item label="项目ID" prop="outerId">
          <el-select
            v-model="approvalForm.outerId"
            placeholder="请选择ID"
            disabled
          ></el-select>
        </el-form-item>
        <el-form-item label="项目名称" prop="name">
          <el-input
            v-model="approvalForm.name"
            placeholder="请填写项目名称"
            disabled
          ></el-input>
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
          <el-col class="line" :span="2">至</el-col>
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
          </el-radio-group>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input type="textarea" v-model="approvalForm.remark"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="approvalVisible = false">取消</el-button>
        <el-button
          type="primary"
          @click="approvalSubmit"
=======
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
>>>>>>> b07486148d0627ecae46743958e8b1fa21c02e1a
          :loading="submitLoading"
          >提交</el-button
        >
      </div>
    </el-dialog>

<<<<<<< HEAD
    <!--分配QA-->
    <el-dialog
      title="分配QA"
      :visible.sync="assignQAVisible"
      :close-on-click-modal="false"
    >
      <el-form
        @submit.native.prevent
        ref="assignQAForm"
        :model="assignQAForm"
        :rules="assignQAFormRules"
        label-width="100px"
      >
        <el-form-item label="项目ID" prop="outerId">
          <el-select
            v-model="assignQAForm.outerId"
=======
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
>>>>>>> b07486148d0627ecae46743958e8b1fa21c02e1a
            placeholder="请选择ID"
            disabled
          ></el-select>
        </el-form-item>
<<<<<<< HEAD
        <el-form-item label="项目名称" prop="name">
          <el-input
            v-model="assignQAForm.name"
            placeholder="请填写项目名称"
            disabled
          ></el-input>
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
          <el-col class="line" :span="2">至</el-col>
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
          <el-select
            v-model="assignQAForm.qalist"
            multiple
            placeholder="请选择QA"
          >
            <el-option
              v-for="item in employees"
              :key="item.userId"
              :label="item.username"
              :value="item.userId"
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
        <el-button @click="assignQAVisible = false">取消</el-button>
        <el-button
          type="primary"
          @click="assignQASubmit"
          :loading="submitLoading"
          >提交</el-button
        >
      </div>
    </el-dialog>

    <!-- 分配EPG -->
    <el-dialog
      title="分配EPG"
      :visible.sync="assignEPGVisible"
      :close-on-click-modal="false"
    >
      <el-form
        @submit.native.prevent
        ref="assignEPGForm"
        :model="assignEPGForm"
        :rules="assignEPGFormRules"
        label-width="100px"
      >
        <el-form-item label="项目ID" prop="outerId">
          <el-select
            v-model="assignEPGForm.outerId"
            placeholder="请选择ID"
            disabled
          ></el-select>
        </el-form-item>
        <el-form-item label="项目名称" prop="name">
          <el-input
            v-model="assignEPGForm.name"
            placeholder="请填写项目名称"
            disabled
          ></el-input>
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
          <el-col class="line" :span="2">至</el-col>
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
          <el-select
            v-model="assignEPGForm.epglist"
            multiple
            placeholder="请选择EPG"
          >
            <el-option
              v-for="item in employees"
              :key="item.userId"
              :label="item.username"
              :value="item.userId"
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
        <el-button @click="assignEPGVisible = false">取消</el-button>
        <el-button
          type="primary"
          @click="assignEPGSubmit"
=======
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
>>>>>>> b07486148d0627ecae46743958e8b1fa21c02e1a
          :loading="submitLoading"
          >提交</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
<<<<<<< HEAD
import PageHeader from "../../components/common/PageHeader";
import Search from "../../components/common/Search";
import Pagination from "../../components/common/Pagination";
import ProjectSYJ from "@/sys/models/project_syj";
=======
import PageHeader from '../../components/common/PageHeader';
import Search from '../../components/common/Search';
import Pagination from '../../components/common/Pagination';
>>>>>>> b07486148d0627ecae46743958e8b1fa21c02e1a

export default {
  components: {
    PageHeader,
    Search,
    Pagination
  },
  data() {
    return {
<<<<<<< HEAD
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
=======
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
>>>>>>> b07486148d0627ecae46743958e8b1fa21c02e1a

      // 新增项目
      addFormVisible: false,
      addForm: {
<<<<<<< HEAD
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
            triggle: "blur"
          }
        ],
        remark: [
          {
            required: true,
            message: "请填写审批意见",
            triggle: "blur"
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
            triggle: "blur"
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
=======
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
>>>>>>> b07486148d0627ecae46743958e8b1fa21c02e1a
      },
      assignEPGFormRules: {
        epglist: [
          {
            type: "array",
            required: true,
            message: "请选择EPG",
            triggle: "blur"
          }
        ]
      }
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
      this.projectModal.forEach(item => {
        const obj = {};
        obj.id = item.outerId;
        obj.value = item.name;
        projectModal.push(obj);
      });
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

<<<<<<< HEAD
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
      const permission = "5";
      if (permission === "1") {
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
      } else if (permission === "2") {
        this.approvalVisible = true;
        this.approvalForm = Object.assign({}, row);
      } else if (permission === "3") {
        this.getAllUsers();
        this.assignQAVisible = true;
        this.assignQAForm = Object.assign({}, row);
      } else if (permission === "4") {
        this.getAllUsers();
        this.assignEPGVisible = true;
        this.assignEPGForm = Object.assign({}, row);
      } else if (permission === "5") {
        this.$confirm("确定同意对该项目进行归档吗?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            ProjectSYJ.approvalArchive(res => {
              this.$message({
                type: "success",
                message: "已同意!"
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
            const para = {};
            para.outerId = this.approvalForm.outerId;
            para.remark = this.approvalForm.remark;
            console.log(para);
            console.log(result);
            if (result === "通过") {
              // ProjectSYJ.acceptProject(para).then(() => {
              // this.submitLoading = false;
              // this.approvalVisible = false;
              // this.refresh();
              // this.$refs["approvalForm"].resetFields();
              // this.$message({
              //   message: "提交成功！",
              //   type: "success"
              // });
              // });
            } else {
              // ProjectSYJ.rejectProject(para).then(() => {
              // this.submitLoading = false;
              // this.approvalVisible = false;
              // this.refresh();
              // this.$refs["approvalForm"].resetFields();
              // this.$message({
              //   message: "提交成功！",
              //   type: "success"
              // });
              // });
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
            para.userId = this.assignEPGForm.qalist;
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
      if (row.state !== "结束") {
        this.$message({
          type: "warning",
          message: "项目未结束，不允许进行归档"
        });
      } else {
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
=======
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
>>>>>>> b07486148d0627ecae46743958e8b1fa21c02e1a
  }
};
</script>

<style lang="scss" scoped>
.add-btn {
<<<<<<< HEAD
=======
  height: 40px;
>>>>>>> b07486148d0627ecae46743958e8b1fa21c02e1a
  margin-left: 20px;
  border-radius: 3px;
  width: 80px;
}
<<<<<<< HEAD
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
=======
>>>>>>> b07486148d0627ecae46743958e8b1fa21c02e1a
</style>
