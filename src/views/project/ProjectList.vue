<template>
  <section>
    <!-- <p v-permission="{name:'查看系统消息',type:'disabled'}">Hello word</p>
        <p v-permission="'查看日志'">Hello word</p>
    <button v-permission="['修改信息','修改密码']">编辑</button>-->
    <!--工具条：搜索栏-->
    <el-row :span="24">
      <el-form :inline="true">
        <el-form-item>
          <el-select
            v-model="projectNameSearch"
            placeholder="请输入项目名称"
            clearable
            filterable
            style="width:500px;"
            :loading="projectNameLoading"
          >
            <el-option
              v-for="item in projectOptions"
              :key="item.projectId"
              :label="item.projectName"
              :value="item.projectName"
            >
              <span style="float: left">{{item.projectName}}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{item.projectId}}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" v-on:click="getProject">查询</el-button>
          <el-button type="primary" v-on:click="addProject">新增</el-button>
        </el-form-item>
      </el-form>
    </el-row>
    <template>
      <el-table :data="projects" highlight-current-row border style="width: 100%">
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-table :data="props.row.projectProgress" highlight-current-row border style="width:80%">
              <el-table-column type="index" label="序号" width="70px"></el-table-column>
              <el-table-column prop="updateDate" label="更新日期"></el-table-column>
              <el-table-column prop="state" label="更新状态"></el-table-column>
              <el-table-column prop="recorder" label="触发人"></el-table-column>
            </el-table>
          </template>
        </el-table-column>
        <el-table-column label="项目ID" prop="projectId"></el-table-column>
        <el-table-column label="项目名称" prop="projectName"></el-table-column>
        <el-table-column label="客户名称" prop="clientName"></el-table-column>
        <el-table-column label="预定时间" prop="startDate"></el-table-column>
        <el-table-column label="交付日" prop="endDate"></el-table-column>
        <el-table-column label="项目经理" prop="projectManager"></el-table-column>
        <el-table-column label="项目状态" prop="projectState"></el-table-column>
        <el-table-column label="参与人数" prop="projectMem"></el-table-column>
        <el-table-column fixed="right" label="操作" width="250px">
          <template slot-scope>
            <el-button>详情</el-button>
            <el-button type="primary">编辑</el-button>
            <el-button type="danger">归档</el-button>
          </template>
        </el-table-column>
      </el-table>
    </template>
  </section>
</template>

<script>
export default {
  data() {
    return {
      projectOptions: [{
        projectName: "项目1",
        projectId: "id1"
      }, {
        projectName: "项目2",
        projectId: "id2"
      }, {
        projectName: "项目2",
        projectId: "id3"
      }, {
        projectName: "项目2",
        projectId: "id4"
      }],
      
      projectNameLoading: false,
      projectNameSearch: "",

      projects: [
        {
          projectId: "123",
          projectName: "项目test",
          clientName: "客户1",
          startDate: "2020-01-01",
          endDate: "2020-08-01",
          projectManager: "项目经理",
          projectState: "进行中",
          projectMem: 10,
          projectProgress: [
            {
              updateDate: "2020-01-01",
              state: "申请立项",
              recorder: "项目经理"
            }, {
              updateDate: "2020-01-03",
              state: "已立项",
              recorder: "项目经理主管"
            }, {
              updateDate: "2020-01-05",
              state: "进行中",
              recorder: "项目经理"
            }
          ]
        }
      ]
    };
  },
  methods: {
    getProject() {

    },

    addProject() {

    }
  }
};
</script>

<style scoped>
.el-form--inline .el-form-item {
    display: inline-block;
    margin-right: 10px;
    margin-left: 20px;
    margin-top: 30px;
}
</style>
