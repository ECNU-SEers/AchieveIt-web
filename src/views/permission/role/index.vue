<template>
  <div>
    <AddRoleDialog :visibility.sync="showAddRoleDialog" />
    <EditRoleDialog
      :visibility.sync="showEditRoleDialog"
      v-bind="editingRoleInfo"
    />
    <PageHeader title="角色设置">
      <Search :query-search="querySearch" />
      <el-button @click="onAddRole" type="primary" class="add-btn">
        新增
      </el-button>
    </PageHeader>
    <LPageTable
      :table-data="tableData"
      :table-header="tableHeader"
      :current-page.sync="currentPage"
      :loading="loading"
    >
      <el-table-column slot="prefix" type="expand">
        <template slot-scope="props">
          <RolePermissions readonly :permissions="props.row.permissions" />
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            @click="onEditRole(scope.row)"
            type="primary"
            plain
            size="mini"
          >
            编辑
          </el-button>
          <el-button
            @click="onDeleteRole(scope.row)"
            type="danger"
            size="mini"
            plain
          >
            删除
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
import LPageTable from '../../../components/common/LPageTable';
import AddRoleDialog from '@/views/permission/role/AddRoleDialog';
import EditRoleDialog from '@/views/permission/role/EditRoleDialog';
import RolePermissions from '../../admin/role/RolePermissions';
import { loadable, pageable } from '../../../util/mixin';
import { roleListTableHeader } from '../const';
import { getRoleList } from '@/api/permisssion';

export default {
  components: {
    Search,
    PageHeader,
    Pagination,
    AddRoleDialog,
    EditRoleDialog,
    LPageTable,
    RolePermissions
  },
  mixins: [pageable, loadable],
  data() {
    return {
      showAddRoleDialog: false,
      showEditRoleDialog: false,
      tableHeader: Object.freeze(roleListTableHeader),
      editingRoleInfo: null
    };
  },
  methods: {
    onAddRole() {
      this.showAddRoleDialog = true;
    },
    onEditRole(row) {
      this.editingRoleInfo = row;
      this.showEditRoleDialog = true;
    },
    onDeleteRole(row) {
      console.log(row);
    },
    getRoleListFromServe() {
      this.loading = true;
      getRoleList()
        .then(res => {
          this.loading = false;
          this.tableData = res;
        })
        .catch(() => (this.loading = false));
    },
    querySearch(queryString, cb) {
      cb([{ value: '111' }]);
    }
  },
  created() {
    this.getRoleListFromServe();
  }
};
</script>

<style lang="scss" scoped>
.add-btn {
  margin-left: 20px;
  border-radius: 3px;
  width: 80px;
}
</style>
