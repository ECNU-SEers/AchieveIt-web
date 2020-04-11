<template>
    <el-dialog title="编辑角色" :visible="visibility" :before-close="close">
        <el-form v-model="form">
            <el-form-item label="角色名称">
                <el-input v-model="form.name"/>
            </el-form-item>
            <el-form-item label="创建人">
                <el-input readonly disabled :value="creator"/>
            </el-form-item>
            <el-form-item>
                <RolePermissions
                        @updatePermissions="updatePermissions"
                        @updateAllPermissions="updateAllPermissions"
                        :is-project-permissions="true"
                        title="分配权限"
                        :permissions="permissions"
                >
                </RolePermissions>
            </el-form-item>
        </el-form>
        <span slot="footer">
      <el-button @click="close">取 消</el-button>
      <el-button ref="btn" type="primary" @click="onEditRole">确 定</el-button>
    </span>
    </el-dialog>
</template>

<script>
  import RolePermissions from '@/views/admin/role/RolePermissions';
  import {editProjectRole} from '@/api/permisssion';
  import {permissions} from '../../../store/getters';
  import {dialogMixin} from '../../../util/mixin';

  export default {
    components: {
      RolePermissions
    },
    props: {
      id: Number,
      name: String,
      creator: String,
      permissions: {
        type: Array,
        default: () => []
      }
    },
    mixins: [dialogMixin],
    data() {
      return {
        allPermissions: [], // 所有权限
        form: {
          name: this.name,
          permissions: this.permissions
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
      onEditRole() {
        const {name, permissions} = this.form;
        editProjectRole(this.id, name, permissions).then(() => {
          this.$message.success('更新角色成功');
          this.close();
          this.$emit('success');
        });
      }
    }
  };
</script>

<style lang="scss" scoped></style>
