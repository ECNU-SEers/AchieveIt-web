<template>
    <div>
        <AddRoleDialog :visibility.sync="showAddRoleDialog"/>
        <EditRoleDialog :visibility.sync="showEditRoleDialog" v-bind="editingRoleInfo"/>
        <PageHeader title="角色设置">
            <Search/>
            <el-button @click="onAddRole" type="primary" class="add-btn">新增</el-button>
        </PageHeader>
        <Pagination :current-page.sync="currentPage" :total="tableData.length">
            <el-table :data="tableData" style="width:100%;">
                <el-table-column type="index" :index="index => index+1"/>
                <el-table-column v-for="(item,index) in tableHeader"
                                 :key="index" :prop="item.prop"
                                 :label="item.label"
                />
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button @click="onEditRole(scope.row)" type="primary" plain size="mini">
                            编辑
                        </el-button>
                        <el-button @click="onDeleteRole(scope.row)" type="danger" size="mini" plain>
                            删除
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
  import AddRoleDialog from "@/views/permission/role/AddRoleDialog";
  import EditRoleDialog from "@/views/permission/role/EditRoleDialog";
  import {roleListTableHeader} from "../const";
  import {getRoleList} from "@/api/permisssion";

  export default {
    components: {
      Search,
      PageHeader,
      Pagination,
      AddRoleDialog,
      EditRoleDialog
    },
    data() {
      return {
        tableData: [],
        currentPage: 1,
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

      },
      getRoleListFromServe() {
        getRoleList().then(res => this.tableData = res);
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
