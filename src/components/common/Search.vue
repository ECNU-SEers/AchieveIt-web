<template>
  <el-autocomplete
    class="inline-input"
    v-model="keyword"
    :fetch-suggestions="querySearch"
    :placeholder="placeholder || '请输入关键字查询'"
    @select="handleSelect"
  >
    <el-button
      @click="onSearch"
      slot="append"
      type="primary"
      icon="el-icon-search"
      >查询
    </el-button>
  </el-autocomplete>
</template>

<script>
import { isEmpty } from 'lodash';

export default {
  props: {
    placeholder: String,
    querySearch: Function
  },
  data() {
    return {
      keyword: '',
      timeout: null
    };
  },
  methods: {
    onSearch() {
      if (isEmpty(this.keyword)) return;
      this.$emit('search', this.keyword);
    },
    handleSelect(v) {
      this.$emit('selectSuggestion', v);
      this.keyword = v.value;
      this.onSearch();
    }
  }
};
</script>

<style lang="scss" scoped>
.inline-input {
  width: 320px;
}

/deep/ .el-input__inner {
  height: 32px;
}
</style>
