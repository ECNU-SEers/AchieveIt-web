<template>
    <div>
        <el-dialog
                title="编辑用户信息"
                :visible="visibility"
                :before-close="close"
        >
            <el-form label-width="80px" label-position="left">
                <el-form-item v-for="(item,index) in fields" :key="index" :label="item.label">
                    <el-input readonly :value="item.prop"/>
                </el-form-item>
                <el-form-item label="角色">
                    <el-select v-model="currentRole">
                        <el-option
                                class="option"
                                v-for="item in roles"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                        />
                    </el-select>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="close">取 消</el-button>
                <el-button type="primary" @click="onConfirmEdit">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
  import {userPermissionTableHeader} from "@/views/permission/const";
  import {getRoleList, editUserRole} from "@/api/permisssion";

  export default {
    props: {
      visibility: Boolean,
      userInfo: Object
    },
    data() {
      return {
        fields: userPermissionTableHeader.filter(item => item.label !== '角色'),
        roles: [],
        currentRole: '未设置'
      };
    },
    methods: {
      close() {
        this.$emit('update:visibility', false);
      },
      getRoleListFromServe() {
        getRoleList().then(res => this.roles = res);
      },
      onConfirmEdit() {
        editUserRole().then(() => {
          this.$message.success('修改成功');
          this.close();
        });
      }
    },
    created() {
      this.getRoleListFromServe();
      this.userInfo && this.userInfo.role && (this.currentRole = this.userInfo.role);
    }
  };
</script>

<style lang="scss" scoped>
    .option {
        width: 500px
    }
</style>
