<template>
  <div>
    <div style="margin: 20px 0 20px 10px ">
      <el-input
        prefix-icon="el-icon-search"
        v-model="search"
        style="width: 200px"
        placeholder="输入关键字搜索"
      ></el-input>

      <el-button @click="addFormVisible = true" style="margin:0 10px 0 10px"
        >新增</el-button
      >
      <el-dialog title="新增项目成员" :visible.sync="addFormVisible">
        <el-form label-width="150px" class="demo-ruleForm">
          <!-- 单选 -->
          <el-form-item label="用户姓名" required>
            <el-select v-model="addForm.name" placeholder="请选择成员">
              <el-option label="用户1" value="用户1"></el-option>
              <el-option label="用户2" value="用户2"></el-option>
            </el-select>
          </el-form-item>

          <!-- 多选 -->
          <el-form-item label="角色" prop="roles">
            <el-checkbox-group v-model="addForm.roles">
              <el-checkbox label="角色1" name="type"></el-checkbox>
              <el-checkbox label="角色2" name="type"></el-checkbox>
              <el-checkbox label="角色3" name="type"></el-checkbox>
              <el-checkbox label="角色4" name="type"></el-checkbox>
            </el-checkbox-group>
          </el-form-item>

          <!-- 单选 -->
          <el-form-item label="项目中的上级">
            <el-select
              v-model="addForm.leader"
              placeholder="请选择项目中的上级"
            >
              <el-option label="成员1" value="成员1"></el-option>
              <el-option label="成员2" value="成员2"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item>
            <el-button type="primary" @click="submitAddForm('addForm')"
              >提交</el-button
            >
          </el-form-item>
        </el-form>
      </el-dialog>

      <!-- 导入excel -->
      <el-button @click="addExcelFormVisible = true">导入</el-button>
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
    </div>

    <el-table
      :data="
        tableData.filter(
          data =>
            !search ||
            data.userName.toLowerCase().includes(search.toLowerCase())
        )
      "
      stripe
      border="true"
    >
      <el-table-column
        fixed
        prop="id"
        label="序号"
        width="50"
      ></el-table-column>
      <el-table-column
        prop="userId"
        label="员工ID"
        width="100"
      ></el-table-column>
      <el-table-column
        prop="userName"
        label="姓名"
        width="90"
      ></el-table-column>
      <el-table-column prop="role" label="角色" width="110"></el-table-column>
      <el-table-column
        prop="userEmail"
        label="邮件地址"
        width="180"
      ></el-table-column>
      <el-table-column
        prop="department"
        label="所属部门"
        width="150"
      ></el-table-column>
      <el-table-column
        prop="leader"
        label="项目中的上级"
        width="120"
      ></el-table-column>
      <el-table-column
        prop="leaderEmail"
        label="电子邮件"
        width="180"
      ></el-table-column>
      <el-table-column
        prop="userPhone"
        label="电话"
        width="120"
      ></el-table-column>
      <el-table-column
        prop="laborHour"
        label="总工时"
        width="100"
      ></el-table-column>
      <el-table-column label="操作" width="150">
        <template slot-scope="scope">
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

    <!-- 编辑项目成员信息 -->
    <el-dialog title="编辑项目成员信息" :visible.sync="editFormVisible">
      <el-form label-width="150px" class="demo-ruleForm">
        <!-- 不可修改 -->
        <el-form-item label="用户姓名" required>
          <el-input
            v-model="tableData[editId].userName"
            :disabled="true"
            placeholder=""
          ></el-input>
        </el-form-item>

        <!-- 多选 -->
        <el-form-item label="角色" prop="roles">
          <el-checkbox-group v-model="editForm.roles">
            <el-checkbox label="角色1" name="type"></el-checkbox>
            <el-checkbox label="角色2" name="type"></el-checkbox>
            <el-checkbox label="角色3" name="type"></el-checkbox>
            <el-checkbox label="角色4" name="type"></el-checkbox>
          </el-checkbox-group>
        </el-form-item>

        <!-- 单选 -->
        <el-form-item label="项目中的上级">
          <el-select v-model="editForm.leader" placeholder="请选择项目中的上级">
            <el-option label="成员1" value="成员1"></el-option>
            <el-option label="成员2" value="成员2"></el-option>
          </el-select>
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
      editId: 0,
      search: "",
      addFormVisible: false,
      addExcelFormVisible: false,
      editFormVisible: false,
      fileList: [],
      addForm: {
        name: "",
        roles: [],
        leader: ""
      },
      editForm: {
        roles: [],
        leader: ""
      },
      tableData: [
        {
          id: "1",
          userId: "00001",
          userName: "小明",
          role: "测试Leader",
          userEmail: "123456789@163.com",
          department: "achieve项目组",
          leader: "张大虎",
          leaderEmail: "987654321@163.com",
          userPhone: "12345678900",
          laborHour: "456"
        },
        {
          id: "2",
          userId: "00002",
          userName: "小张",
          role: "配置管理员",
          userEmail: "123456789@163.com",
          department: "achieve项目组",
          leader: "张大虎",
          leaderEmail: "987654321@163.com",
          userPhone: "12345678900",
          laborHour: "56"
        }
      ]
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

    // 新增项目成员
    submitAddForm(form) {},
    // 编辑项目成员信息
    submitEditForm(form) {},
    handleEdit(index, row) {
      this.editId = index;
      this.editFormVisible = true;
    },
    handleDelete(index, row) {
      this.$confirm("是否将该成员移出项目组?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$message({
            type: "success",
            message: "已移除!"
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消"
          });
        });
    }
  }
};
</script>

<style scoped></style>
