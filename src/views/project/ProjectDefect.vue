<template>
  <section>
    <!-- <p v-permission="{name:'查看系统消息',type:'disabled'}">Hello word</p>
        <p v-permission="'查看日志'">Hello word</p>
    <button v-permission="['修改信息','修改密码']">编辑</button>-->
    <!--工具条：搜索栏-->
    <el-row :span="24">
      <el-form :inline="true">
        <el-form-item>
          <el-select
            v-model="defectNameSearch"
            placeholder="请输入缺陷名称"
            clearable
            filterable
            style="width:500px;"
            :loading="defectNameLoading"
          >
            <el-option
              v-for="item in defectOptions"
              :key="item.defectId"
              :label="item.defectName"
              :value="item.defectName"
            >
              <span style="float: left">{{ item.defectName }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{
                item.defectId
              }}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" v-on:click="getDefect">查询</el-button>
          <el-button type="primary" v-on:click="addDefect">新增</el-button>
        </el-form-item>
      </el-form>
    </el-row>
    <template style="margin: 0 auto">
      <el-table
        :data="defects"
        highlight-current-row
        border
        style="width: 100%"
      >
        <el-table-column
          type="index"
          label="序号"
          width="70px"
        ></el-table-column>
        <el-table-column label="缺陷ID" prop="defectId"></el-table-column>
        <el-table-column label="缺陷名称" prop="defectName"></el-table-column>
        <el-table-column
          label="缺陷描述"
          prop="defectDescription"
        ></el-table-column>
        <el-table-column label="缺陷状态" prop="defectState"></el-table-column>
        <el-table-column label="提交人" prop="recorder"></el-table-column>
        <el-table-column label="处理人" prop="handler"></el-table-column>
        <el-table-column fixed="right" label="操作" width="250px">
          <template slot-scope>
            <el-button type="primary">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
    </template>
  </section>
</template>

<script>
export default {
  data() {
    return {
      defectOptions: [
        {
          defectName: "缺陷1",
          defectId: "id1"
        },
        {
          defectName: "缺陷2",
          defectId: "id2"
        },
        {
          defectName: "缺陷3",
          defectId: "id3"
        },
        {
          defectName: "缺陷4",
          defectId: "id4"
        }
      ],
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
      ]
    };
  },
  methods: {
    getDefect() {},

    addDefect() {}
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
