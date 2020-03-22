<template>
  <div>
    <PageHeader title="项目缺陷信息">
      <Search />
      <el-button type="primary" class="add-btn" @click="addFormVisible = true"
        >新增</el-button
      >
    </PageHeader>
    <!-- <p v-permission="{name:'查看系统消息',type:'disabled'}">Hello word</p>
        <p v-permission="'查看日志'">Hello word</p>
    <button v-permission="['修改信息','修改密码']">编辑</button>-->
    <!--工具条：搜索栏-->
    <Pagination>
      <el-table :data="defects" highlight-current-row border style="width: 100%">
        <el-table-column type="index" label="序号" width="70px"></el-table-column>
        <el-table-column label="缺陷ID" prop="defectId"></el-table-column>
        <el-table-column label="缺陷名称" prop="defectName"></el-table-column>
        <el-table-column label="缺陷描述" prop="defectDescription"></el-table-column>
        <el-table-column label="缺陷状态" prop="defectState"></el-table-column>
        <el-table-column label="提交人" prop="recorder"></el-table-column>
        <el-table-column label="处理人" prop="handler"></el-table-column>
        <el-table-column fixed="right" label="操作" width="250px">
          <template slot-scope>
            <el-button type="primary">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
    </Pagination>
  </div>
</template>

<script>
import PageHeader from '../../components/common/PageHeader';
import Search from '../../components/common/Search';
import Pagination from '../../components/common/Pagination';

export default {
  components: {
    PageHeader,
    Search,
    Pagination
  },
  data() {
    return {
      defectOptions: [{
        defectName: "缺陷1",
        defectId: "id1"
      }, {
        defectName: "缺陷2",
        defectId: "id2"
      }, {
        defectName: "缺陷3",
        defectId: "id3"
      }, {
        defectName: "缺陷4",
        defectId: "id4"
      }],
      defectNameSearch: "",
      defectNameLoading: false,

      defects: [
        {
          defectId: "123",
          defectName: "缺陷test",
          defectDescription: "缺陷描述",
          defectState: "缺陷状态",
          recorder: "JJJ",
          handler: "yyy"
        }
      ],

      // 分页
      page: 1,
      pageSize: 15,
      projectId: 1
    };
  },
  methods: {
    async getAllDefects() {
        this.defects = await Project.getDefects(projectId, page, pageSize);
        console.log(this.defects);
    },

    addDefect() {

    }
  },
  mounted () {
        this.getAllDefects();
    }
};
</script>

<style scoped>
.el-form--inline .el-form-item {
    display: inline-block;
    margin-right: 10px;
    margin-left: 20px;
    margin-top: 30px;
}
</style>
