export const pageable = {
  data() {
    return {
      currentPage: 1,
      pageSize: 10,
      total: 0,
      tableData: []
    };
  }
};

export const loadable = {
  data() {
    return {
      loading: false
    };
  },
  showLoading(promise) {
    this.loading = true;
  }
};
