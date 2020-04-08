<template>
    <div>
        <EditUserDialog
                v-if="showEditUserDialog"
                :visibility.sync="showEditUserDialog"
                v-bind="editingUserInfo"
                @success="onEditOrAddUserSuccess"
        />
        <AddUserDialog
                v-if="showAddUserDialog"
                :visibility.sync="showAddUserDialog"
                @success="onEditOrAddUserSuccess"
        />
        <PageHeader title="用户权限">
            <Search @search="onSearch" :query-search="querySearch"/>
            <el-button @click="onAddUser" type="primary" class="add-btn">
                新增
            </el-button>
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
          {{ scope.row.roles.map(item => item.name).join("、") }}
        </span>
            </el-table-column>
            <el-table-column label="参与项目">
        <span slot-scope="scope">
          {{ scope.row.projects.join("、") }}
        </span>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            @click="onEditUser(scope.row)"
            type="primary"
            size="medium"
            icon="el-icon-edit"
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
  import EditUserDialog from '@/views/permission/user/EditUserDialog';
  import AddUserDialog from "@/views/permission/user/AddUserDialog";
  import LPageTable from '../../../components/common/LPageTable';
  import {userPermissionTableHeader} from '../const';
  import {getUserList} from '@/api/permisssion';
  import {loadable, pageable} from '../../../util/mixin';

  export default {
    components: {
      Search,
      PageHeader,
      Pagination,
      EditUserDialog,
      LPageTable,
      AddUserDialog
    },
    mixins: [pageable, loadable],
    data() {
      return {
        tableHeader: Object.freeze(userPermissionTableHeader),
        showEditUserDialog: false,
        showAddUserDialog: false,
        editingUserInfo: null,
        searchKey: ''
      };
    },
    methods: {
      onSearch(key) {
        this.searchKey = key;
        this.getUserListFromServe(1);
      },
      querySearch(queryString, cb) {
        const result = this.tableData
            .filter(item => item.realName && item.realName.includes(queryString))
            .map(item => ({value: item.realName}));
        cb(result);
      },
      onPageChange(nextPage) {
        this.getUserListFromServe(nextPage);
      },
      onEditUser(row) {
        this.editingUserInfo = row;
        this.showEditUserDialog = true;
      },
      onAddUser() {
        this.showAddUserDialog = true;
      },
      onEditOrAddUserSuccess() {
        this.getUserListFromServe(this.currentPage);
      },
      getUserListFromServe(page) {
        this.applyLoading(getUserList(this.searchKey, page, this.pageSize)).then(
            res => {
              const {items, total} = res;
              this.total = total;
              this.tableData = items;
            }
        );
      }
    },
    created() {
      this.getUserListFromServe(this.currentPage);
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
