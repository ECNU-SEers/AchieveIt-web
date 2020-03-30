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
  methods: {
    applyLoading(promise) {
      return new Promise((resolve, reject) => {
        this.loading = true;
        promise
          .then(res => {
            this.loading = false;
            resolve(res);
          })
          .catch(e => {
            this.loading = false;
            reject(e);
          });
      });
    }
  }
};

export const dialogMixin = {
  props: {
    visibility: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    close() {
      this.$emit('update:visibility', false);
    }
  }
};
