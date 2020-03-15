<template>
    <div>
        <PageHeader title="用户权限">
            <Search/>
        </PageHeader>
        <Pagination>
            <el-table :data="tableData" style="width:100%;">
                <el-table-column prop="date" label="序号"/>
                <el-table-column prop="name" label="员工ID"/>
                <el-table-column prop="province" label="姓名"/>
                <el-table-column prop="city" label="所属部⻔"/>
                <el-table-column prop="address" label="邮件地址"/>
                <el-table-column prop="zip" label="电子邮件"/>
                <el-table-column prop="zip" label="电话"/>
                <el-table-column prop="zip" label="角色"/>
                <el-table-column prop="zip" label="参与项目"/>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button
                                @click="handleClick(scope.row)"
                                type="primary"
                                plain
                                size="mini">编辑
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
        </Pagination>
    </div>
</template>

<script>
  import Search from "../../components/common/Search";
  import PageHeader from "../../components/common/PageHeader";
  import Pagination from "../../components/common/Pagination";

  export default {
    components: {
      Search,
      PageHeader,
      Pagination
    },
    data() {
      return {
        tableData: []
      };
    },
    methods: {}
  };
</script>

<style lang="scss" scoped>

</style>
