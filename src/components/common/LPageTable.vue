<template>
  <Pagination
    :current-page="currentPage"
    :page-size="pageSize"
    :total="total || tableData.length"
    :page-change-handler="handleCurrentChange"
  >
    <el-table :data="tableData" class="table" v-loading="loading">
      <el-table-column type="index" :index="index => index + 1" />
      <slot name="prefix"></slot>
      <el-table-column
        v-for="(item, index) in tableHeader"
        :key="index"
        :prop="item.prop"
        :label="item.label"
      />
      <slot></slot>
    </el-table>
  </Pagination>
</template>

<script>
import Pagination from './Pagination';

export default {
  components: {
    Pagination
  },
  props: {
    tableData: {
      type: Array,
      default: () => []
    },
    tableHeader: {
      type: Array,
      default: () => []
    },
    currentPage: {
      type: Number,
      default: 1
    },
    pageSize: {
      type: Number,
      default: 10
    },
    loading: {
      type: Boolean,
      default: false
    },
    total: Number
  },
  methods: {
    handleCurrentChange(currentPage) {
      this.$emit('update:currentPage', currentPage);
      this.$emit('page-change', currentPage);
    }
  }
};
</script>

<style lang="scss" scoped>
.table {
  width: 100%;
}
</style>
