<template>
  <div>
    <PageHeader title="项目进展状态" style="height:40px;"> </PageHeader>

    <!--列表展示-->
    <Pagination>
      <el-table
        :data="statusData"
        stripe
        border
        :default-sort="{ prop: 'id', order: 'ascending' }"
        highlight-current-row
        style="width: 100%"
      >
        <el-table-column label="序号" prop="index" fixed></el-table-column>

        <el-table-column label="变更日期" prop="changeDate"></el-table-column>

        <el-table-column label="变更状态" prop="status"></el-table-column>

        <el-table-column label="触发人" prop="trigger"></el-table-column>

        <el-table-column label="操作" width="180px" prop="action">
          <template slot-scope="scope">
            <el-button-group>
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
    <el-dialog title="提示" :visible.sync="detailFormVisible" width="30%">
      <span>这是一段信息</span>
    </el-dialog>
  </div>
</template>

<script>
import PageHeader from '@/components/common/PageHeader';
import Pagination from '@/components/common/Pagination';

export default {
  components: {
    PageHeader,
    Pagination
  },
  data() {
    return {
      //列表
      statusData: [
        {
          index: '1',
          changeDate: '2020-3-23',
          status: '立项驳回',
          trigger: '孙二狗'
          // action: "",
        },
        {
          index: '1',
          changeDate: '2020-3-23',
          status: '立项驳回',
          trigger: '孙二狗'
          // action: "",
        }
      ],
      detailFormVisible: false
    };
  },
  methods: {}
};
</script>

<style lang="scss" scoped></style>
