<template>
    <el-autocomplete
            class="inline-input"
            v-model="keyword"
            :fetch-suggestions="querySearch"
            placeholder="请输入内容"
            @select="handleSelect"
    >
        <el-button slot="append" type="primary" icon="el-icon-search">查询</el-button>
    </el-autocomplete>
</template>

<script>
  export default {
    data() {
      return {
        keyword: ''
      };
    },
    methods: {}
  };
</script>

<style lang="scss" scoped>
    .inline-input {
        width: 320px;
    }
</style>
