<template>
  <div>
    <EditUserDialog
      :visibility.sync="showEditUserDialog"
      v-bind="editingUserInfo"
    />
    <PageHeader title="用户权限">
      <Search @search="onSearch" />
    </PageHeader>
    <Pagination
      :current-page.sync="currentPage"
      :total="tableData.length"
      @page-change="onPageChange"
    >
      <el-table :data="tableData" style="width:100%;">
        <el-table-column type="index" :index="index => index + 1" />
        <el-table-column
          v-for="(item, index) in tableHeader"
          :key="index"
          :prop="item.prop"
          :label="item.label"
        />
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
      </el-table>
    </Pagination>
  </div>
</template>

<script>
import Search from '@/components/common/Search';
import PageHeader from '@/components/common/PageHeader';
import Pagination from '@/components/common/Pagination';
import EditUserDialog from '@/views/permission/user/EditUserDialog';
import { userPermissionTableHeader } from '../const';
import { getUserList } from '@/api/permisssion';

export default {
  components: {
    Search,
    PageHeader,
    Pagination,
    EditUserDialog
  },
  data() {
    return {
      tableData: [],
      currentPage: 1,
      total: 100,
      tableHeader: Object.freeze(userPermissionTableHeader),
      showEditUserDialog: false,
      editingUserInfo: null
    };
  },
  methods: {
    onSearch(key) {
      console.log(key);
      this.$router.push({ path: '/project/basic', query: { id: '1' } });
    },
    onPageChange(currentPage) {
      console.log(currentPage, this.currentPage);
    },
    onEditUser(row) {
      this.editingUserInfo = row;
      this.showEditUserDialog = true;
    },
    getUserListFromServe() {
      getUserList().then(res => (this.tableData = res));
    }
  },
  created() {
    this.getUserListFromServe();
  },
  watch: {
    currentPage: nextPage => {
      //TODO 向后端请求单页数据
    }
  }
};
</script>

<style lang="scss" scoped></style>
