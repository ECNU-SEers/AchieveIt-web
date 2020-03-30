<template>
  <div>
    <!--工具条：搜索栏-->
    <PageHeader title="功能列表">
      <Search
        placeholder="请输入功能名称"
        :query-search="querySearch"
        @search="searchFunctions"
        @select-suggestion="getOne"
      >
        <!-- <span style="float: left">{{ item.value }}</span>
        <span style="float: right; color: #8492a6; font-size: 13px">{{item.id}}</span>-->
      </Search>
      <!-- <el-input prefix-icon="el-icon-search" v-model="search" style="width: 200px" placeholder="输入关键字搜索"></el-input> -->
      <el-button type="primary" class="add-btn" @click="addFirst">新增</el-button>
      <el-button type="primary" class="add-btn" @click="addExcelFormVisible = true">导入</el-button>
      <el-button type="primary" class="add-btn">下载</el-button>
    </PageHeader>

    <!-- 导入excel -->
    <el-dialog title="导入项目成员信息" :visible.sync="addExcelFormVisible">
      <el-upload
        action="https://jsonplaceholder.typicode.com/posts/"
        :file-list="fileList"
        accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
        :on-change="handleChange"
        :on-success="handleSuccess"
        :on-error="handleError"
      >
        <el-button size="small" type="primary">点击上传excel文件</el-button>
      </el-upload>

      <div slot="footer" class="dialog-footer">
        <el-button @click="addExcelFormVisible = false">取消</el-button>
        <el-button type="primary" @click="submitUpload" :loading="submitLoading">提交</el-button>
      </div>
    </el-dialog>

    <!-- 功能列表 -->
    <Pagination>
      <el-table
        :data="tableData"
        style="margin-bottom: 20px;"
        row-key="id"
        strip
        border
        lazy
        :load="load"
        :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
      >
        <el-table-column width="50"></el-table-column>
        <el-table-column type="index" label="序号" width="100"></el-table-column>
        <el-table-column prop="id" label="功能ID" width="180"></el-table-column>
        <el-table-column prop="name" label="功能名称" width="180"></el-table-column>
        <el-table-column prop="description" label="功能描述"></el-table-column>

        <el-table-column fixed="right" label="操作" width="180px">
          <template slot-scope="scope">
            <el-button-group>
              <el-button
                size="medium"
                @click="addSubFunction(scope.$index, scope.row)"
                icon="el-icon-plus"
              ></el-button>
              <el-button
                size="medium"
                type="primary"
                @click="editFunction(scope.$index, scope.row)"
                icon="el-icon-edit"
              ></el-button>
              <el-button
                size="medium"
                type="danger"
                @click="deleteFunction(scope.$index, scope.row)"
                icon="el-icon-delete"
              ></el-button>
            </el-button-group>
          </template>
        </el-table-column>
      </el-table>
    </Pagination>

    <!-- 新增 -->
    <el-dialog title="新增项目功能" :visible.sync="addFormVisible">
      <el-form label-width="150px" class="demo-ruleForm">
        <!-- <el-form-item label="项目ID" required>
          <el-input v-model="addForm.id" placeholder="请填写项目ID"></el-input>
        </el-form-item>-->

        <el-form-item label="功能名称" required>
          <el-input v-model="addForm.name" placeholder="请填写项目名称"></el-input>
        </el-form-item>

        <el-form-item label="功能描述" required>
          <el-input type="textarea" v-model="addForm.description" placeholder="请填写项目描述"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addFormVisible = false">取消</el-button>
        <el-button type="primary" @click="submitAddForm" :loading="submitLoading">提交</el-button>
      </div>
    </el-dialog>

    <!-- 修改 -->
    <el-dialog title="修改项目功能" :visible.sync="editFormVisible">
      <el-form label-width="150px" class="demo-ruleForm">
        <!-- <el-form-item label="项目ID" required>
          <el-input v-model="editForm.id" placeholder="请填写项目ID"></el-input>
        </el-form-item>-->

        <el-form-item label="项目名称" required>
          <el-input v-model="editForm.name" placeholder="请填写项目名称"></el-input>
        </el-form-item>

        <el-form-item label="项目描述" required>
          <el-input type="textarea" v-model="editForm.description" placeholder="请填写项目描述"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editFormVisible = false">取消</el-button>
        <el-button type="primary" @click="submitEditForm" :loading="submitLoading">提交</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import PageHeader from "../../components/common/PageHeader";
import Search from "../../components/common/Search";
import Pagination from "../../components/common/Pagination";
import Project from "@/sys/models/project_htx";
export default {
  components: {
    PageHeader,
    Search,
    Pagination
  },
  data() {
    return {
      // 搜索
      keyword: "",
      functionSearch: [],
      submitLoading: false,

      addExcelFormVisible: false,
      fileList: [],
      functionId: 0,
      addFormVisible: false,
      editFormVisible: false,
      tableData: [],
      addForm: {
        // id: "",
        name: "",
        description: ""
      },
      parentId: -1,
      editForm: {
        id: "",
        name: "",
        description: ""
      }
    };
  },
  methods: {
    // 获取一级功能列表并展示
    async getFunctionList(keyword) {
      try {
        var projectId = "1";
        const info = await Project.getFirstFunctionList(projectId,keyword);
        console.log("get function list success!");
        this.tableData = info;
        // 标记有二级功能的功能
        for (var i = 0; i < this.tableData.length; ++i) {
          if (this.tableData[i].numSubFunctions > 0) {
            this.tableData[i].hasChildren = true;
          }
        }
      } catch (e) {
        console.log(e);
        // this.$message.error("获取功能列表失败");
      }
    },
    // 二级功能懒加载
    async load(tree, treeNode, resolve) {
      // 当前节点的id
      var projectId = "1";
      console.log("tree.id");
      console.log(tree.id);
      var info = await Project.getSubFunctionList(projectId, tree.id);
      console.log("sub function:");
      console.log(info);
      // 标记有二级功能的功能
      for (var i = 0; i < info.length; ++i) {
        if (info[i].numSubFunctions > 0) {
          info[i].hasChildren = true;
        }
      }
      setTimeout(() => {
        resolve(info);
      }, 500);
    },
    // 新增一级弹框
    addFirst() {
      this.addFormVisible = true;
      this.parentId = -1;
    },
    // 新增子功能弹框
    addSubFunction(index, row) {
      this.addFormVisible = true;
      this.parentId = row.id;
    },
    // 提交新增功能
    async submitAddForm() {
      try {
        var projectId = "1";
        const info = await Project.addFunction(
          projectId,
          this.addForm.name,
          this.addForm.description,
          this.parentId
        );
        console.log("add function list success!");
        this.addFormVisible = false;
        this.parentId = -1;
      } catch (e) {
        console.log(e);
      }
    },
    // 删除功能
    async deleteFunction(index, row) {
      var functionId = "1";
      this.$confirm("是否确定删除?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          try {
            var info = await Project.deleteFunction(functionId, row.id);
            this.$message({
              type: "success",
              message: "删除成功!"
            });
            location.reload();
          } catch (e) {
            console.log(e);
          }
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消"
          });
        });
    },
    // 修改弹窗
    editFunction(index, row) {
      this.editForm.name = row.name;
      this.editForm.description = row.description;
      this.editForm.id = row.id;
      this.editFormVisible = true;
    },
    // 修改提交
    async submitEditForm() {
      try {
        var projectId = "1";
        const info = await Project.editFunction(
          projectId,
          this.editForm.id,
          this.editForm.name,
          this.editForm.description
        );
        console.log("edit function list success!");
        this.editFormVisible = false;
      } catch (e) {
        console.log(e);
      }
    },
    // 上传excel
    submitUpload() {},
    handleChange(file, fileList) {
      if (fileList.length > 0) {
        this.fileList = [fileList[fileList.length - 1]];
        console.log(fileList);
      }
    },
    handleSuccess() {},
    handleError() {},
    
    // 搜索
    async querySearch(queryString, cb) {
      var projectId = "1";
      console.log(queryString);
      var tmp = [];
      this.functionSearch = await Project.searchFunctions(
        projectId,
        queryString
      );
      console.log(this.functionSearch);
      // 下拉显示的数据
      this.functionSearch.forEach(item => {
        const obj = {};
        obj.id = item.id;
        obj.value = item.name;
        tmp.push(obj);
      });
      this.functionSearch = tmp;
      cb(tmp);
    },
    createFilter(queryString) {
      return functionSearch => {
        return (
          functionSearch.name
            .toLowerCase()
            .indexOf(queryString.toLowerCase()) === 0
        );
      };
    },
    searchFunctions(item) {
      console.log(item);
      console.log("search or click");
    },

    // 点击下拉中的一条获取一条功能信息
    async getOne(item) {
      console.log(item);
      try {
        var projectId = "1";
        const info = await Project.getOneFunction(projectId, item.id);
        console.log(info);
        // 标记有二级功能的功能
        if(info.subFunctions.length>0){
          info.hasChildren = true;
        }else{
          info.hasChildren = false;
        }
        this.tableData = [];
        this.tableData.push(info);
      } catch (e) {
        console.log(e);
      }
    }
  },
  mounted: function() {
    this.keyword=""
    this.getFunctionList(this.keyword);
  }
};
</script>

<style scoped>
.add-btn {
        height: 40px;
        margin-left: 20px;
        border-radius: 3px;
        width: 80px;
    }
</style>
