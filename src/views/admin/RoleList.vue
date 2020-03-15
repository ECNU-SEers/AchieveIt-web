<template>
    <div>
        <PageHeader title="角色设置">
            <Search/>
            <el-button type="primary" class="add-btn">新增</el-button>
        </PageHeader>
        <Pagination>
            <el-table :data="tableData" style="width:100%;">
                <el-table-column prop="date" label="序号"/>
                <el-table-column prop="name" label="⻆色名称"/>
                <el-table-column prop="province" label="拥有权限"/>
                <el-table-column prop="city" label="创建人"/>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button
                                @click="handleClick(scope.row)"
                                type="primary"
                                plain
                                size="mini">
                            编辑
                        </el-button>
                        <el-button type="danger" size="mini" plain>删除</el-button>
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
    .add-btn {
        height: 40px;
        margin-left: 20px;
        border-radius: 3px;
        width: 80px;
    }
</style>
