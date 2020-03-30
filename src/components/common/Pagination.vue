<template>
  <div class="container">
    <slot></slot>
    <div class="pagination">
      <el-pagination
        @current-change="currentChangeHandler"
        :background="true"
        :page-size="pageSize"
        :current-page="currentPage"
        layout="prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    currentPage: {
      type: Number,
      default: 1
    },
    pageSize: {
      type: Number,
      default: 10
    },
    total: {
      type: Number,
      default: 0
    },
    pageChangeHandler: Function
  },
  data() {
    return {
      currentChangeHandler: null
    };
  },
  methods: {
    defaultPageChangeHandler(currentPage) {
      this.$emit('update:currentPage', currentPage);
      this.$emit('page-change', currentPage);
    }
  },
  created() {
    this.currentChangeHandler =
      this.pageChangeHandler || this.defaultPageChangeHandler;
  }
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
