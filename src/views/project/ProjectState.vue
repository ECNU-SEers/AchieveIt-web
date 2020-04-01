<template>
  <div>
    <PageHeader title="项目进展状态" style="height:40px;">
      <!-- <div style="float:left;"> <span >当前项目ID: {{this.projectId}}</span> </div> -->
    </PageHeader>
    <el-row v-if="this.projectId === undefined">
      <el-col :span="24">
        <el-tag type="success" effect="dark">请选择项目</el-tag>
      </el-col>
    </el-row>

    <!--列表展示-->

    <el-table
      :data="stateData"
      stripe
      border
      :default-sort="{ prop: 'id', order: 'ascending' }"
      highlight-current-row
      style="width: 100%"
    >
      <el-table-column label="序号" type="index" fixed width="70px"></el-table-column>

      <el-table-column label="变更日期" prop="changeDate"></el-table-column>

      <el-table-column label="变更状态" prop="latterState"></el-table-column>
      <el-table-column label="变更人姓名" prop="realName"></el-table-column>

      <el-table-column label="变更人工号" prop="username"></el-table-column>
      <el-table-column label="备注" prop="remark"></el-table-column>

      <!-- <el-table-column label="备注" width="180px" prop="operation">
        <template slot-scope="scope">
          <el-button-group v-if="scope.row.latterState === ('立项驳回' || '结束')">
            <el-button
              type="info"
              icon="el-icon-s-comment"
              size="medium"
              @click="detailFormVisible = true"
            ></el-button>
          </el-button-group>
        </template>
      </el-table-column> -->
    </el-table>

    <!--备注-->
    <el-dialog title="提示" :visible.sync="detailFormVisible" @open="this.getRemark()" width="30%">
      <span>{{ this.remark }}</span>
    </el-dialog>
  </div>
</template>

<script>
import PageHeader from "@/components/common/PageHeader";
import Pagination from "@/components/common/Pagination";
import ProjectLW from "@/sys/models/project_lw";
import moment from 'moment'

export default {
  components: {
    PageHeader,
    Pagination
  },
  data() {
    return {
      projectId: "",
      projectOuterId: "P01",
      remark: "",
      //列表
      stateData: [],
      detailFormVisible: false,
      pageTitle: "项目进展状态" + "{当前项目：" + this.projectId + "}"
    };
  },
  mounted() {
    this.projectId = this.$route.query.projectId;
    if (this.projectId === undefined) {
      this.$message({
        message: "请先选择项目！",
        type: "warning"
      });
    } else {
      //console.log(this.projectId);
      this.pageTitle = ""
      this.getState();
      this.getRemark();
    }
  },
  methods: {
    //列表展示
    async getState() {
      const res = await ProjectLW.getState(this.projectOuterId);
      this.stateData = res;
      let i = 0;
      for (i = 0; i < this.stateData.length; i++) {
        if (this.stateData[i].changeDate !== null) {
          this.stateData[i].changeDate = moment(
            this.stateData[i].changeDate
          ).format("YYYY-MM-DD");
        }
      }
    },

    // //获取项目OuterId
    // async getProjectOuterId(){
    //   const res = await ProjectLW.getRemark(this.projectOuterId);
    //   this.remark=res.project.remark;
    // }

    //获取备注
    async getRemark() {
      const res = await ProjectLW.getRemark(this.projectOuterId);
      this.remark = res.project.remark;
    }
  }
};
</script>

<style lang="scss" scoped></style>
