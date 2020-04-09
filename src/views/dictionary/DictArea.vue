<template>
  <div>
    <el-row>
      <el-col :span="20">
        <div class="grid-content"></div>
        <el-table :data="areas" class="table" style="width:50%" stripe>
          <el-table-column width="70px" type="index" label="序号"></el-table-column>
          <el-table-column prop="name" label="技术名称"></el-table-column>
          <el-table-column label="操作" width="150px">
            <template slot-scope="scope">
              <el-button-group>
                <el-button
                  size="medium"
                  type="primary"
                  @click.stop="handleEdit(scope.$index, scope.row)"
                  icon="el-icon-edit"
                ></el-button>
                <el-button
                  size="medium"
                  type="danger"
                  @click.stop="handleDel(scope.$index, scope.row)"
                  icon="el-icon-delete"
                ></el-button>
              </el-button-group>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
      <el-col :span="1">
        <div class="grid-content"></div>
        <el-button type="primary" @click="handleAdd" class="add-btn">新增</el-button>
      </el-col>
    </el-row>

    <!--新增-->
    <el-dialog title="新增业务领域" :visible.sync="addFormVisible" :close-on-click-modal="false">
      <el-form
        @submit.native.prevent
        :model="addForm"
        :rules="addFormRules"
        ref="addForm"
        label-width="130px"
      >
        <el-form-item label="业务领域" prop="name">
          <el-input v-model="addForm.name" placeholder="请填写业务领域"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addFormVisible = false">取消</el-button>
        <el-button type="primary" @click.native="addAreaSubmit" :loading="submitLoading">提交</el-button>
      </div>
    </el-dialog>

    <!--编辑-->
    <el-dialog title="编辑业务领域" :visible.sync="editFormVisible" :close-on-click-modal="false">
      <el-form
        @submit.native.prevent
        :model="editForm"
        :rules="editFormRules"
        ref="editForm"
        label-width="130px"
      >
        <el-form-item label="业务领域" prop="name">
          <el-input v-model="editForm.name" placeholder="请填写业务领域"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editFormVisible = false">取消</el-button>
        <el-button type="primary" @click.native="editAreaSubmit" :loading="submitLoading">提交</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import ProjectSYJ from "@/sys/models/project_syj";

export default {
  data() {
    return {
      areas: [],

      // 新增
      addFormVisible: false,
      addForm: {
        name: ""
      },
      addFormRules: {
        name: [
          {
            required: true,
            message: "请填写技术名称",
            triggle: "blur"
          }
        ]
      },
      submitLoading: false,

      // 编辑
      editFormVisible: false,
      editForm: {
        id: "",
        name: ""
      },
      editFormRules: {
        name: [
          {
            required: true,
            message: "请填写业务领域",
            triggle: "blur"
          }
        ]
      }
    };
  },
  mounted() {
    this.getAllArea();
  },
  methods: {
    async getAllArea() {
      const res = await ProjectSYJ.getAllBusinessArea();
      this.areas = res;
    },

    handleAdd() {
      this.addFormVisible = true;
    },

    addAreaSubmit() {
      this.$refs.addForm.validate(valid => {
        if (valid) {
          this.$confirm("确认提交吗", "提示", {}).then(() => {
            this.submitLoading = true;
            ProjectSYJ.addArea(this.addForm.name).then(() => {
              this.$message({
                message: "提交成功！",
                type: "success"
              });
              this.submitLoading = false;
              this.addFormVisible = false;
              this.getAllArea();
            });
          });
        }
      });
    },

    handleEdit(index, row) {
      this.editForm = Object.assign({}, row);
      console.log(this.editForm);
      this.editFormVisible = true;
    },

    editAreaSubmit() {
      this.$refs.editForm.validate(valid => {
        if (valid) {
          this.$confirm("确认提交吗", "提示", {}).then(() => {
            this.submitLoading = true;
            console.log(this.editForm.name);
            ProjectSYJ.updateArea(this.editForm.id, this.editForm.name).then(
              () => {
                this.$message({
                  message: "提交成功！",
                  type: "success"
                });
                this.submitLoading = false;
                this.editFormVisible = false;
                this.getAllArea();
              }
            );
          });
        }
      });
    },

    handleDel(index, row) {
      this.$confirm("此操作将永久删除该条目, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          const arealist = [];
          arealist.push(row.id);
          ProjectSYJ.deleteArea(arealist).then(() => {
            this.$message({
              type: "success",
              message: "删除成功!"
            });
            this.getAllArea();
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    }
  }
};
</script>

<style lang="scss" scoped>
.table {
  margin: 0 auto;
  width: 99%;
  border-radius: 4px;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.12), 0 0 6px 0 rgba(0, 0, 0, 0.04);
}
.add-btn {
  height: 32px;
  float: right;
  border-radius: 3px;
  width: 80px;
}
.grid-content {
  border-radius: 4px;
  min-height: 36px;
}
</style>