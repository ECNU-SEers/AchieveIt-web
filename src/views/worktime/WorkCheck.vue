<template>
  <div>
    <PageHeader title="工时审核">
      <lin-date-picker
        @dateChange="handleDateChange"
        ref="searchDate"
        class="date"
      />
      <el-button type="primary" class="btn">查询</el-button>
    </PageHeader>
    <Pagination>
      <el-table :data="tableData" style="width:100%;">
        <el-table-column prop="date" label="序号" />
        <el-table-column prop="name" label="日期" />
        <el-table-column prop="province" label="功能名称" />
        <el-table-column prop="city" label="活动名称" />
        <el-table-column prop="city" label="开始时间" />
        <el-table-column prop="city" label="结束时间" />
        <el-table-column prop="city" label="提交人" />
        <el-table-column prop="city" label="提交日期" />
        <el-table-column prop="city" label="参与项目" />
        <el-table-column prop="city" label="状态" />
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              @click="handleClick(scope.row)"
              type="success"
              plain
              size="mini"
            >
              通过
            </el-button>
            <el-button type="danger" size="mini" plain>退回</el-button>
          </template>
        </el-table-column>
      </el-table>
    </Pagination>
  </div>
</template>

<script>
import Search from '../../components/common/Search';
import PageHeader from '../../components/common/PageHeader';
import Pagination from '../../components/common/Pagination';
import LinDatePicker from '@/components/base/date-picker/lin-date-picker';

export default {
  components: {
    Search,
    PageHeader,
    Pagination,
    LinDatePicker
  },
  data() {
    return {
      tableData: []
    };
  },
  methods: {}
};
</script>

<style lang="scss" scoped>
.date {
  padding: 0;
  margin-right: 10px;
}

.btn {
  min-width: 80px;
  margin: 0 10px;
}
</style>
