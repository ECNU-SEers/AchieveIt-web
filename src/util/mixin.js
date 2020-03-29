export const pageable = {
  data() {
    return {
      currentPage: 1,
      pageSize: 10,
      total: 0,
      tableData: []
    };
  },
  method: {
    refreshTable(firstPageTableData) {
      this.currentPage = 1;
      this.tableData = firstPageTableData;
    }
  }
};

export const loadable = {
  data() {
    return {
      loading: false
    };
  }
};
