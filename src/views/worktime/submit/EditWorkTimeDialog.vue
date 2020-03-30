<template>
  <el-dialog title="编辑工时" :visible="visibility" :before-close="close">
    <el-form>
      <el-form-item label="角色名称">
        <el-input v-model="name" />
      </el-form-item>
      <el-form-item label="创建人">
        <el-input readonly disabled :value="creator" />
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="close">取 消</el-button>
      <el-button type="primary" @click="onAddRole">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import RolePermissions from '@/views/admin/role/RolePermissions';
import { editUserRole } from '@/api/permisssion';

export default {
  components: {
    RolePermissions
  },
  props: {
    visibility: Boolean,
    name: String,
    creator: String
  },
  data() {
    return {};
  },
  methods: {
    onAddRole() {
      //TODO 向后端发送更改角色信息请求
      editUserRole().then(() => {
        this.close();
        this.$message.success('新增角色成功');
      });
    },
    close() {
      this.$emit('update:visibility', false);
    }
  }
};
</script>

<style lang="scss" scoped></style>
