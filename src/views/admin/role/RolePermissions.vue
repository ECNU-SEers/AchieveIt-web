<template>
  <div class="container" v-loading="loading">
    <div class="group">
      <div class="details">
        <p>{{ title }}</p>
        <div
          class="permissions-box"
          v-for="(permission, moduleName) in allPermissions"
          :key="moduleName"
        >
          <el-checkbox-group v-model="permission_module_name">
            <div class="module-box">
              <el-checkbox
                @change="moduleCheck($event, permission, moduleName)"
                class="module"
                :label="moduleName"
                :disabled="readonly"
                :indeterminate="halfPermissions.includes(moduleName)"
              ></el-checkbox>
            </div>
          </el-checkbox-group>
          <ul class="permissions-ul">
            <li
              class="permissions-li"
              v-for="(item, key) in permission"
              :key="key"
            >
              <el-checkbox
                :disabled="readonly"
                :label="item.name"
                :value="permission_module_ids.indexOf(item.id) > -1"
                @change="singleCheck(item.id, permission, moduleName)"
              ></el-checkbox>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Admin from "@/sys/models/admin";
import { getAllProjectPermissions } from "@/api/permisssion";

export default {
  props: {
    id: Number,
    permissions: {
      type: Array,
      default: () => []
    },
    readonly: {
      type: Boolean,
      default: false
    },
    isProjectPermissions: {
      type: Boolean,
      default: false
    },
    title: String
  },
  data() {
    return {
      allPermissions: {}, // 所有角色权限
      allAuthIds: [],
      // permissions: [], // 拥有的角色权限
      permission_module_name: [], // 权限组 module name
      permission_module_ids: [], // 权限组 集合 id
      halfPermissions: [], // 该分类下的权限没有全选中
      cacheFlag: true,
      loading: false
    };
  },
  async created() {
    try {
      this.loading = true;
      await this.getGroupPermissions();
      Array.isArray(this.permissions) && this.getInitPermissions();
      this.loading = false;
    } catch (e) {
      this.loading = false;
      console.log(e);
    }
  },
  methods: {
    getInitPermissions() {
      let permissionModules = [];
      this.permissions.forEach(permission => {
        permissionModules[permission.module]
          ? permissionModules[permission.module].push({
              ...permission,
              name: permission.permission
            })
          : (permissionModules[permission.module] = [
              { ...permission, name: permission.permission }
            ]);
      });
      this.permissions.forEach(item => {
        const { id, module } = item;
        this.singleCheck(id, permissionModules[module], module);
      });
    },
    // 获取角色权限
    async getGroupPermissions() {
      this.allPermissions = await Admin.getAllPermissions(
        this.isProjectPermissions
      );
      // 通过判断有没有传入id，来判断当前页面是添加角色还是编辑角色
      if (this.id) {
        const res = await Admin.getOneGroup(this.id);
        let temp = [];
        const cache = {};
        res.permissions.forEach(v => {
          this.permission_module_ids.push(v.id);
          temp.push(v.module);
          // 每个module拥有权限个数
          if (!cache[v.module]) {
            cache[v.module] = 1;
          } else {
            cache[v.module]++;
          }
        });
        temp = Array.from(new Set(temp));
        // 半选
        temp.forEach(item => {
          if (this.allPermissions[item].length !== cache[item]) {
            this.halfPermissions.push(item);
          }
        });
        this.permission_module_name = Array.from(new Set(temp));
      }
      this.$emit("getCacheAuthIds", this.permission_module_ids.slice());
      this.$emit("updatePermissions", this.permission_module_ids);
      this.$emit("updateAllPermissions", this.allPermissions);
    },

    // 批量选中
    moduleCheck(checked, ids, moduleName) {
      const _ids = ids.map(item => item.id);
      if (checked) {
        this.permission_module_ids = Array.from(
          new Set(this.permission_module_ids.concat(_ids))
        );
        this.permission_module_name.push(moduleName);
        this.halfPermissions = this.halfPermissions.filter(
          v => v !== moduleName
        );
      } else {
        this.permission_module_ids = this.permission_module_ids.filter(
          v => !_ids.includes(v)
        );
        this.permission_module_name = this.permission_module_name.filter(
          v => v !== moduleName
        );
      }
      this.$emit("updatePermissions", this.permission_module_ids);
    },

    // 单选
    singleCheck(id, permission, moduleName) {
      const _ids = permission.map(item => item.id);
      let count = 0;
      const index = this.permission_module_ids.indexOf(id);
      if (index === -1) {
        this.permission_module_ids.push(id);
      } else {
        this.permission_module_ids.splice(index, 1);
      }
      _ids.forEach(item => {
        if (this.permission_module_ids.indexOf(item) > -1) {
          count++;
        }
        // 全选状态
        if (_ids.length === count) {
          this.permission_module_name.push(moduleName);
          this.halfPermissions = this.halfPermissions.filter(
            v => v !== moduleName
          );
        } else if (count === 0) {
          // 未选中状态
          this.permission_module_name = this.permission_module_name.filter(
            v => v !== moduleName
          );
          this.halfPermissions = this.halfPermissions.filter(
            v => v !== moduleName
          );
        } else {
          // 半选状态
          this.permission_module_name = this.permission_module_name.filter(
            v => v !== moduleName
          );
          this.halfPermissions.push(moduleName);
        }
      });
      this.$emit("updatePermissions", this.permission_module_ids);
    }
  }
};
</script>

<style lang="scss" scoped>
.group {
  .details {
    display: inline-block;
    width: 100%;
    margin-top: 5px;
    margin-left: 5px;

    p {
      font-size: 14px;
      color: #333;
      font-weight: 500;
    }

    .text-input {
      height: 40px;
      width: 780px;
      background: rgba(255, 255, 255, 1);
      border-radius: 2px;
      border: 1px solid #dee2e6;
      text-indent: 20px;

      &::placeholder {
        font-size: 14px;
        font-weight: 400;
        color: #c4c9d2;
        text-indent: 20px;
      }
    }

    .permissions-box {
      .module {
        height: 20px;
        font-size: 13px;
        color: #45526b;
        line-height: 20px;
        margin-bottom: 10px;
      }

      .permissions-ul {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        padding: 20px 20px 0;
        background: #f5f5f6;
        margin-bottom: 20px;

        .permissions-li {
          width: 150px;
          height: 20px;
          line-height: 20px;
          margin-bottom: 20px;
          display: flex;
          flex-direction: row;
          justify-content: flex-start;
          vertical-align: text-top;
          margin-right: 10px;

          .check {
            transform: translateY(2px);
            margin-right: 5px;
          }

          .permissions-name {
            height: 20px;
            font-size: 14px;
            font-weight: 400;
            color: #596c8e;
            line-height: 20px;
            margin-right: 20px;
          }
        }
      }
    }
  }
}
</style>
