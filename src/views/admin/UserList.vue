<template>
    <div>
        <PageHeader title="用户权限">
            <Search @search="onSearch"/>
        </PageHeader>
        <Pagination :current-page.sync="currentPage" :total="this.total" @page-change="onPageChange">
            <el-table :data="tableData" style="width:100%;">
                <el-table-column type="index" :index="index => index+1"/>
                <el-table-column v-for="(item,index) in tableHeader"
                                 :key="index" :prop="item.prop"
                                 :label="item.label"
                />
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button
                                @click="handleClick(scope.row)"
                                type="primary"
                                plain
                                size="mini"
                        >编辑
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
        </Pagination>
    </div>
</template>

<script>
  import Search from '../../components/common/Search';
  import PageHeader from '../../components/common/PageHeader';
  import Pagination from '../../components/common/Pagination';
  import {userPermissionTableHeader} from "./const";

  export default {
    components: {
      Search,
      PageHeader,
      Pagination
    },
    data() {
      return {
        tableData: [],
        currentPage: 1,
        total: 100,
        tableHeader: Object.freeze(userPermissionTableHeader)
      };
    },
    methods: {
      onSearch(key) {
        console.log(key);
      },
      onPageChange(currentPage) {
        console.log(currentPage, this.currentPage);
      }
    },
    watch: {
      currentPage: nextPage => {
        //TODO 向后端请求表数据
      }
    }
  };
</script>

<style lang="scss" scoped></style>
