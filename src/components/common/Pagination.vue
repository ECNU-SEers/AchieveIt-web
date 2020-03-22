<template>
    <div class="container">
        <slot></slot>
        <div class="pagination">
            <el-pagination
                    @current-change="handleCurrentChange"
                    :background="true"
                    :hide-on-single-page="true"
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
        default: 20
      },
      total: {
        type: Number,
        default: 100
      }
    },
    data() {
      return {};
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
    .container {
        padding: 20px;

        .pagination {
            margin-top: 20px;
            float: right;
        }
    }
</style>
