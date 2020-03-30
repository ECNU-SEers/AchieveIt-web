<template>
  <div>
    <el-dialog title="编辑用户信息" :visible="visibility" :before-close="close">
      <el-form label-width="80px" label-position="left">
        <el-form-item
          v-for="(item, index) in fields"
          :key="index"
          :label="item.label"
        >
          <el-input readonly disabled :value="item.prop" />
        </el-form-item>
        <el-form-item label="角色">
          <el-select multiple v-model="role">
            <el-option
              class="option"
              v-for="item in allRoles"
              :key="item.name"
              :label="item.name"
              :value="item.id"
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
import { userPermissionTableHeader } from '@/views/permission/const';
import { getRoleList, editUserRole } from '@/api/permisssion';
import { isEmpty } from 'lodash';
import { setUserRole } from '../../../api/permisssion';
import { dialogMixin } from '../../../util/mixin';

export default {
  props: {
    roles: {
      type: Array,
      default: () => []
    },
    id: Number,
    username: String,
    department: String,
    email: String,
    phoneNumber: String,
    projects: {
      type: Array,
      default: () => []
    }
  },
  mixins: [dialogMixin],
  data() {
    return {
      fields: [],
      allRoles: [],
      role: '未设置'
    };
  },
  methods: {
    getRoleListFromServe() {
      getRoleList().then(res => {
        this.allRoles = res;
        this.role = this.roles.map(item => {
          return this.allRoles.find(r => r.id === item.id).id;
        });
      });
    },
    onConfirmEdit() {
      setUserRole(this.id, this.role).then(() => {
        this.$message.success('修改成功');
        this.$emit('success');
        this.close();
      });
    }
  },
  created() {
    this.getRoleListFromServe();
    this.fields = userPermissionTableHeader.map(item => ({
      label: item.label,
      prop: this[item.prop]
    }));
    this.fields.push({
      label: '参与项目',
      prop: this.projects.join(' ')
    });
  }
};
</script>

<style lang="scss" scoped>
.option {
  width: 500px;
}
</style>
