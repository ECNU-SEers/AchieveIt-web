<template>
  <div>
    <PageHeader title="项目进展状态" style="height:40px;"> </PageHeader>

    <!--列表展示-->
    <Pagination>
      <el-table
        :data="stateData"
        stripe
        border
        :default-sort="{ prop: 'id', order: 'ascending' }"
        highlight-current-row
        style="width: 100%"
      >
        <el-table-column label="序号" type="index" fixed></el-table-column>

        <el-table-column label="变更日期" prop="changeDate"></el-table-column>

        <el-table-column label="变更状态" prop="latterState"></el-table-column>

        <el-table-column label="触发人" prop="operatorId"></el-table-column>

        <el-table-column label="备注" width="180px" prop="operation">
          <template slot-scope="scope">
            <el-button-group
              v-if="scope.row.latterState === ('立项驳回' || '结束')"
            >
              <el-button
                type="info"
                icon="el-icon-s-comment"
                size="medium"
                @click="detailFormVisible = true"
              ></el-button>
            </el-button-group>
          </template>
        </el-table-column>
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

export default {
  components: {
    PageHeader,
    Pagination
  },
  data() {
    return {
      projectId: 1,
      projectOuterId: "P01",
      remark: "",
      //列表
      stateData: [],
      detailFormVisible: false
    };
  },
  mounted() {
    this.getState();
    this.getRemark();
  },
  methods: {
    //列表展示
    async getState() {
      const res = await ProjectLW.getState(this.projectOuterId);
      this.stateData = res;
    },

    //获取备注
    async getRemark() {
      const res = await ProjectLW.getRemark(this.projectOuterId);
      this.remark = res.project.remark;
    }
  }
};
</script>

<style lang="scss" scoped></style>
