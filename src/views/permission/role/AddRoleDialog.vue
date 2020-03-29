<template>
  <el-dialog title="新增角色" :visible="visibility" :before-close="close">
    <el-form v-model="form">
      <el-form-item label="角色名称">
        <el-input v-model="form.roleName" />
      </el-form-item>
      <el-form-item>
        <RolePermissions
          @updatePermissions="updatePermissions"
          @updateAllPermissions="updateAllPermissions"
          ref="groupPermissions"
        >
        </RolePermissions>
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
import { addNewRole } from '@/api/permisssion';

export default {
  components: {
    RolePermissions
  },
  props: {
    visibility: Boolean
  },
  data() {
    return {
      allPermissions: [], // 所有权限
      permissions: [], // 最终选择的权限
      form: {
        roleName: '',
        permissions: []
      }
    };
  },
  methods: {
    updatePermissions(permissions) {
      this.permissions = permissions;
    },
    updateAllPermissions(allPermissions) {
      this.allPermissions = allPermissions;
    },
    onAddRole() {
      console.log(JSON.stringify(this.permissions));
      //TODO 向后端发送新建角色请求
      addNewRole().then(() => {
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
