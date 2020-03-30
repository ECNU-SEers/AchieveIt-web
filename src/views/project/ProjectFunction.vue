<template>
  <div>
    <div style="margin: 20px 0 20px 10px ">
      <!-- 只能查父级的 -->
      <el-input
        prefix-icon="el-icon-search"
        v-model="search"
        style="width: 200px"
        placeholder="输入关键字搜索"
      ></el-input>

      <!-- 导入excel -->
      <el-button
        @click="addExcelFormVisible = true"
        style="margin:0 10px 0 10px"
        >导入</el-button
      >
      <el-dialog title="导入项目成员信息" :visible.sync="addExcelFormVisible">
        <el-upload
          action="https://jsonplaceholder.typicode.com/posts/"
          :file-list="fileList"
          accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel"
          :on-change="handleChange"
          :on-success="handleSuccess"
          :on-error="handleError"
        >
          <el-button size="small" type="primary">点击上传excel文件</el-button>
        </el-upload>
        <el-button
          style="margin: 20px 0 0 0;"
          size="small"
          @click="submitUpload"
          >提交</el-button
        >
      </el-dialog>

      <!-- 下载 -->
      <el-button>下载</el-button>
    </div>

    <!-- 功能列表 -->
    <el-table
      :data="
        tableData.filter(
          data =>
            !search ||
            data.functionName.toLowerCase().includes(search.toLowerCase())
        )
      "
      style="margin-bottom: 20px;"
      row-key="id"
      strip
      border
      default-expand-all
      :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
    >
      <el-table-column prop="id" label="序号" width="100"></el-table-column>
      <el-table-column
        prop="functionId"
        label="功能ID"
        width="180"
      ></el-table-column>
      <el-table-column
        prop="functionName"
        label="功能名称"
        width="180"
      ></el-table-column>
      <el-table-column prop="functionInfo" label="功能描述"></el-table-column>
      <el-table-column label="操作" width="200">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleAdd(scope.$index, scope.row)"
            >新增</el-button
          >
          <el-button size="mini" @click="handleEdit(scope.$index, scope.row)"
            >编辑</el-button
          >
          <el-button
            size="mini"
            type="danger"
            @click="handleDelete(scope.$index, scope.row)"
            >移除</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <!-- 新增 -->
    <el-dialog title="新增项目功能" :visible.sync="addFormVisible">
      <el-form label-width="150px" class="demo-ruleForm">
        <el-form-item label="项目ID" required>
          <el-input v-model="addForm.id" placeholder="请填写项目ID"></el-input>
        </el-form-item>

        <el-form-item label="项目名称" required>
          <el-input
            v-model="addForm.name"
            placeholder="请填写项目名称"
          ></el-input>
        </el-form-item>

        <el-form-item label="项目描述" required>
          <el-input
            type="textarea"
            v-model="addForm.info"
            placeholder="请填写项目描述"
          ></el-input>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="submitAddForm('addForm')"
            >提交</el-button
          >
        </el-form-item>
      </el-form>
    </el-dialog>

    <!-- 修改 -->
    <el-dialog title="修改项目功能" :visible.sync="editFormVisible">
      <el-form label-width="150px" class="demo-ruleForm">
        <el-form-item label="项目ID" required>
          <el-input v-model="editForm.id" placeholder="请填写项目ID"></el-input>
        </el-form-item>

        <el-form-item label="项目名称" required>
          <el-input
            v-model="editForm.name"
            placeholder="请填写项目名称"
          ></el-input>
        </el-form-item>

        <el-form-item label="项目描述" required>
          <el-input
            type="textarea"
            v-model="editForm.info"
            placeholder="请填写项目描述"
          ></el-input>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="submitEditForm('editForm')"
            >提交</el-button
          >
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      search: '',
      addExcelFormVisible: false,
      fileList: [],
      functionId: 0,
      addFormVisible: false,
      editFormVisible: false,
      tableData: [
        {
          id: 1,
          functionId: '001',
          functionName: '功能1',
          functionInfo: 'xxxxxxxxxxxxxxxxxxx'
        },
        {
          id: 3,
          functionId: '003',
          functionName: '功能2',
          functionInfo: 'xxxxxxxxxxxxxxxxxxx',
          children: [
            {
              id: 31,
              functionId: '003001',
              date: '2016-05-01',
              functionName: '功能3',
              functionInfo: 'xxxxxxxxxxxxxxxxxxx'
            },
            {
              id: 32,
              functionId: '003002',
              functionName: '功能4',
              functionInfo: 'xxxxxxxxxxxxxxxxxxx'
            }
          ]
        }
      ],
      addForm: {
        id: '',
        name: '',
        info: ''
      },
      editForm: {
        id: '',
        name: '',
        info: ''
      }
    };
  },
  methods: {
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

    submitAddForm() {},
    submitEditForm() {},
    //
    handleAdd(index, row) {
      this.addFormVisible = true;
    },
    handleEdit(index, row) {
      this.editForm.id = this.tableData[index].functionId;
      this.editForm.name = this.tableData[index].functionName;
      this.editForm.info = this.tableData[index].functionInfo;
      this.editFormVisible = true;
    },
    handleDelete() {
      this.$confirm('是否确定删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          });
        });
    }
  }
};
</script>

<style scoped></style>
