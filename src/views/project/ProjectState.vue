<template>
  <div>
    <PageHeader title="项目进展状态" style="height:40px;">
      <!-- <div style="float:left;"> <span >当前项目ID: {{this.projectId}}</span> </div> -->
    </PageHeader>

    <!--列表展示-->
    <Pagination :current-page.sync="pageNo"
      :page-size="pageSize"
      :total="statesLength"
      @page-change="handlePageChange">
    <el-table
      :data="stateData"
      stripe
      border
      :default-sort="{ prop: 'id', order: 'ascending' }"
      highlight-current-row
      style="width: 100%"
    >
      <el-table-column
        label="序号"
        type="index"
        fixed
        width="70px"
      ></el-table-column>

      <el-table-column label="变更日期" prop="changeDate"></el-table-column>
      <el-table-column label="变更操作" prop="operation"></el-table-column>
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
    </Pagination>

    <!--备注-->
    <el-dialog
      title="提示"
      :visible.sync="detailFormVisible"
      @open="this.getRemark()"
      width="30%"
    >
      <span>{{ this.remark }}</span>
    </el-dialog>
  </div>
</template>

<script>
import PageHeader from "@/components/common/PageHeader";
import Pagination from "@/components/common/Pagination";
import ProjectLW from "@/sys/models/project_lw";
import moment from "moment";

export default {
  components: {
    PageHeader,
    Pagination
  },
  data() {
    return {
      projectId: "",
      outerId: "",
      projectState:"",
      remark: "",

      pageNo: 1,
      pageSize: 10,
      statesLength: 0,

      //列表
      stateData: [],
      pageData: [],
      detailFormVisible: false,
      pageTitle: "项目进展状态" + "{当前项目：" + this.projectId + "}"
    };
  },
  mounted() {
    this.projectId = this.$route.query.projectId;
    this.outerId = this.$route.query.outerId;
    this.projectState=this.$route.query.projectState;
    if (this.projectId === undefined) {
      this.$message({
        message: "请先选择项目！",
        type: "warning"
      });
    } else {
      //console.log(this.projectId);
      this.pageTitle = "";
      this.getState();
      this.getRemark();
    }
  },
  methods: {
    //列表展示
    async getState() {
      const res = await ProjectLW.getState(this.outerId);
      this.pageData = res;
      this.stateData = this.pageData.slice(0, this.pageSize);
      let i = 0;
      this.statesLength = this.pageData.length;
      for (i = 0; i < this.stateData.length; i++) {
        if (this.stateData[i].changeDate !== null) {
          this.stateData[i].changeDate = moment(
            this.stateData[i].changeDate
          ).format("YYYY-MM-DD");
        }
        this.stateData[i].latterState = this.stateData[i].formerState + '-->' + this.stateData[i].latterState;
      }
    },

    //获取备注
    async getRemark() {
      const res = await ProjectLW.getRemark(this.outerId);
      this.remark = res.project.remark;
    },

    handlePageChange(val) {
      this.pageNo = val;
      this.stateData = this.pageData.slice(this.pageSize*(val-1), this.pageSize*val);
    }
  }
};
</script>

<style lang="scss" scoped></style>
