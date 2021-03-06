<template>
  <div>
    <AddRoleDialog
      @success="getRoleListFromServe"
      v-if="showAddRoleDialog"
      :visibility.sync="showAddRoleDialog"
    />
    <EditRoleDialog
      v-if="showEditRoleDialog"
      :visibility.sync="showEditRoleDialog"
      v-bind="editingRoleInfo"
      @success="getRoleListFromServe"
    />
    <PageHeader title="角色设置">
      <Search :query-search="querySearch" @search="onSearch" />
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
            size="medium"
            icon="el-icon-edit"
          >
          </el-button>
          <el-button
            @click="onDeleteRole(scope.row)"
            size="medium"
            type="danger"
            icon="el-icon-delete"
          >
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
import { deleteRole } from '../../../api/permisssion';
import { isEmpty } from 'lodash';

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
      editingRoleInfo: null,
      noFilteredTableData: []
    };
  },
  methods: {
    onSearch(key) {
      if (isEmpty(key)) return this.getRoleListFromServe();
      this.tableData = this.noFilteredTableData.filter(item =>
        item.name.includes(key)
      );
    },
    onAddRole() {
      this.showAddRoleDialog = true;
    },
    onEditRole(row) {
      this.editingRoleInfo = row;
      this.showEditRoleDialog = true;
    },
    onDeleteRole(row) {
      this.$confirm('删除后不可恢复，确认删除该角色吗?')
        .then(() => deleteRole(row.id))
        .then(() => {
          this.$message.success('删除成功');
          this.getRoleListFromServe();
        });
    },
    getRoleListFromServe() {
      this.applyLoading(getRoleList()).then(res => {
        this.tableData = this.noFilteredTableData = res;
      });
    },
    querySearch(queryString, cb) {
      const results = this.tableData
        .filter(item => item.name.includes(queryString))
        .map(item => ({ value: item.name }));
      cb(results);
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
