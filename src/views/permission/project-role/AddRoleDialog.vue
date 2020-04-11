<template>
    <el-dialog title="新增角色" :visible="visibility" :before-close="close">
        <el-form v-model="form">
            <el-form-item label="角色名称">
                <el-input v-model="form.roleName"/>
            </el-form-item>
            <el-form-item>
                <RolePermissions
                        @updatePermissions="updatePermissions"
                        @updateAllPermissions="updateAllPermissions"
                        :is-project-permissions="true"
                        title="分配权限"
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
  import {addProjectRole} from '@/api/permisssion';
  import {dialogMixin} from '../../../util/mixin';

  export default {
    components: {
      RolePermissions
    },
    mixins: [dialogMixin],
    data() {
      return {
        allPermissions: [], // 所有权限
        form: {
          roleName: '',
          permissions: [] // 最终选择的权限
        }
      };
    },
    methods: {
      updatePermissions(permissions) {
        this.form.permissions = permissions;
      },
      updateAllPermissions(allPermissions) {
        this.allPermissions = allPermissions;
      },
      onAddRole() {
        const {roleName, permissions} = this.form;
        addProjectRole(roleName, permissions).then(() => {
          this.close();
          this.$message.success('新增角色成功');
          this.$emit('success');
        });
      }
    }
  };
</script>

<style lang="scss" scoped></style>
