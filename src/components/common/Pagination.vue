<template>
  <div class="container">
    <slot></slot>
    <div class="pagination">
      <el-pagination
        @current-change="handleCurrentChange"
        :background="true"
        :page-size="10"
        :current-page="1"
        layout="prev, pager, next, jumper"
        :total="100"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  methods: {}
};
</script>

<style lang="scss" scoped>
.container {
  padding: 20px;

  .pagination {
    margin-top: 20px;
    float: right;
  }
}
</style>
