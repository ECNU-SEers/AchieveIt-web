<template>
  <div>
    <EditUserDialog
      :visibility.sync="showEditUserDialog"
      v-bind="editingUserInfo"
    />
    <PageHeader title="用户权限">
      <Search @search="onSearch" />
    </PageHeader>
    <LPageTable
      :table-data="tableData"
      :table-header="tableHeader"
      :current-page.sync="currentPage"
      :loading="loading"
      :total="total"
      @page-change="onPageChange"
    >
      <el-table-column label="角色">
        <span slot-scope="scope">
          {{ scope.row.roles.map(item => item.name).join(" ") }}
        </span>
      </el-table-column>
      <el-table-column label="参与项目">
        <span slot-scope="scope">
          {{ scope.row.projects.join(" ") }}
        </span>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            @click="onEditUser(scope.row)"
            type="primary"
            plain
            size="mini"
          >
            编辑
          </el-button>
        </template>
      </el-table-column>
    </LPageTable>
  </div>
</template>

<script>
import Search from '@/components/common/Search';
import PageHeader from '@/components/common/PageHeader';
import Pagination from '@/components/common/Pagination';
import EditUserDialog from '@/views/permission/user/EditUserDialog';
import LPageTable from '../../../components/common/LPageTable';
import { userPermissionTableHeader } from '../const';
import { getUserList } from '@/api/permisssion';
import { loadable, pageable } from '../../../util/mixin';

export default {
  components: {
    Search,
    PageHeader,
    Pagination,
    EditUserDialog,
    LPageTable
  },
  mixins: [pageable, loadable],
  data() {
    return {
      tableHeader: Object.freeze(userPermissionTableHeader),
      showEditUserDialog: false,
      editingUserInfo: null
    };
  },
  methods: {
    onSearch(key) {
      console.log(key);
    },
    onPageChange(nextPage) {
      this.getUserListFromServe(nextPage);
    },
    onEditUser(row) {
      this.editingUserInfo = row;
      this.showEditUserDialog = true;
    },
    getUserListFromServe(page) {
      this.loading = true;
      getUserList(page, this.pageSize)
        .then(res => {
          this.loading = false;
          const { items, total } = res;
          this.total = total;
          this.tableData = items;
        })
        .catch(() => (this.loading = false));
    }
  },
  created() {
    this.getUserListFromServe(this.currentPage);
  }
};
</script>

<style lang="scss" scoped></style>
