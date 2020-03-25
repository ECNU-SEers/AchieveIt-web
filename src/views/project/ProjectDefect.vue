<template>
  <div>
    <PageHeader title="项目缺陷信息">
      <Search />
      <el-button type="primary" class="add-btn" @click="addFormVisible = true">新增</el-button>
    </PageHeader>
    <!-- <p v-permission="{name:'查看系统消息',type:'disabled'}">Hello word</p>
        <p v-permission="'查看日志'">Hello word</p>
    <button v-permission="['修改信息','修改密码']">编辑</button>-->
    <!--工具条：搜索栏-->
    <Pagination>
      <el-table :data="defects" highlight-current-row border style="width: 100%">
        <el-table-column type="index" label="序号" width="70px"></el-table-column>
        <el-table-column label="缺陷ID" prop="id"></el-table-column>
        <el-table-column label="缺陷名称" prop="name"></el-table-column>
        <el-table-column label="缺陷描述" prop="description"></el-table-column>
        <el-table-column label="缺陷状态" prop="state"></el-table-column>
        <el-table-column label="缺陷类型" prop="type"></el-table-column>
        <el-table-column label="缺陷级别" prop="level"></el-table-column>
        <el-table-column label="提交人" prop="creatorName"></el-table-column>
        <el-table-column label="处理人" prop="handlerName"></el-table-column>
        <el-table-column label="创建日期" prop="createdAt"></el-table-column>
        <el-table-column label="预定日期" prop="due"></el-table-column>
        <el-table-column label="更新日期" prop="updatedAt"></el-table-column>
        <el-table-column fixed="right" label="操作" width="100px">
          <template slot-scope>
            <el-button
                size="medium"
                type="primary"
                @click.stop="handleEdit(scope.$index, scope.row)"
                icon="el-icon-edit"
              ></el-button>
          </template>
        </el-table-column>
      </el-table>
    </Pagination>

    <!-- 新建项目 -->
    <el-dialog title="新增缺陷" :visible.sync="addFormVisible">
      <el-form
        ref="addForm"
        :model="addForm"
        :rules="addFormRules"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="缺陷名称" style="width:500px" required>
          <el-input v-model="addForm.name" placeholder="请填写缺陷名称"></el-input>
        </el-form-item>
        <el-form-item label="缺陷类型" style="width:500px" required>
          <el-input v-model="addForm.type" placeholder="请填写缺陷类型"></el-input>
        </el-form-item>
        <el-form-item label="缺陷等级" style="width:500px" required>
          <el-input v-model="addForm.level" placeholder=""></el-input>
        </el-form-item>
        <el-form-item label="客户" required>
          <el-select v-model="addForm.company" placeholder="请选择客户">
            <el-option
              v-for="item in clients"
              :key="item.outerId"
              :label="item.company"
              :value="item.outerId"
            >
              <span style="float: left">{{ item.company }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{ item.outerId }}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="预定时间" required>
          <el-date-picker v-model="addForm.startDate" placeholder="请选择预定时间" type="date"></el-date-picker>
        </el-form-item>
        <el-form-item label="交付日" required>
          <el-date-picker v-model="addForm.endDate" placeholder="请选择交付日" type="date"></el-date-picker>
        </el-form-item>
        <el-form-item label="项目经理" style="width: 500px" required>
          <el-input v-model="addForm.manager" disabled width="200px"></el-input>
        </el-form-item>
        <el-form-item label="项目主管" required>
          <el-select v-model="addForm.supervisorName" placeholder="请选择项目主管"></el-select>
        </el-form-item>
        <el-form-item label="采用技术" required>
          <el-select v-model="addForm.tech" placeholder="请选择采用技术">
            <el-option v-for="item in teches" :key="item.id" :label="item.name" :value="item.id">
              <span style="float: left">{{ item.name }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{ item.id }}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="业务领域">
          <el-select v-model="addForm.area" placeholder="请选择业务领域">
            <el-option v-for="item in busiAreas" :key="item.id" :label="item.name" :value="item.id">
              <span style="float: left">{{ item.name }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{ item.id }}</span>
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addFormVisible = false">取消</el-button>
        <el-button type="primary" @click="addProjectSubmit" :loading="submitLoading">提交</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import PageHeader from "../../components/common/PageHeader";
import Search from "../../components/common/Search";
import Pagination from "../../components/common/Pagination";
import ProjectSYJ from "@/sys/models/project_syj";
import moment from "moment";

export default {
  components: {
    PageHeader,
    Search,
    Pagination
  },
  data() {
    return {
      page: 1,
      pageSize: 10,
      projectId: 1,

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

      // 新增缺陷
      addFormVisible: false
    };
  },
  methods: {
    async getAllDefects() {
      const res = await ProjectSYJ.getProjectDefects(
        this.projectId,
        this.page,
        this.pageSize
      );
      if (res.code === 1000) {
        this.defects = res.data.items;
        let i = 0;
        for (i = 0; i < this.defects.length; i++) {
          this.defects[i].due = moment(this.defects[i].due).format(
            "YYYY-MM-DD"
          );
          this.defects[i].createdAt = moment(this.defects[i].createdAt).format(
            "YYYY-MM-DD"
          );
          this.defects[i].updatedAt = moment(this.defects[i].updatedAt).format(
            "YYYY-MM-DD"
          )
        }
      } else {
        this.$message.error("获取缺陷列表失败");
      }
    },

    addDefect() {},

    handleEdit(index, row) {

    }
  },
  mounted() {
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
.add-btn {
  margin-left: 20px;
  border-radius: 3px;
  width: 80px;
}
</style>
