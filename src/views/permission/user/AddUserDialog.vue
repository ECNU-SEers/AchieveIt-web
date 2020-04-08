<template>
    <div>
        <el-dialog title="新增用户" :visible="visibility" :before-close="close">
            <el-form ref="form" :model="form" :rules="rules" label-width="80px" label-position="left">
                <!--                <el-form-item-->
                <!--                        v-for="(item, index) in formLabel"-->
                <!--                        :key="index"-->
                <!--                        :label="item.label"-->
                <!--                        :prop="item.prop"-->
                <!--                >-->
                <!--                    <el-input v-model="form[item.prop]"/>-->
                <!--                </el-form-item>-->
                <el-form-item label="工号" prop="usernames">
                    <el-select multiple v-model="form.usernames">
                        <el-option
                                class="option"
                                v-for="item in unRegisterUsers"
                                :key="item.jobNumber"
                                :label="item.jobNumber"
                                :value="item.jobNumber"
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
  import {getUnRegisterUserList} from '@/api/permisssion';
  import {addNewUsers} from '../../../api/permisssion';
  import {dialogMixin} from '../../../util/mixin';
  import {userPermissionTableHeader} from "@/views/permission/const";
  import {isEmpty} from "lodash";

  export default {
    mixins: [dialogMixin],
    data() {
      return {
        unRegisterUsers: [],
        form: {
          usernames: []
        },
        formLabel: userPermissionTableHeader.concat([{label: '密码', prop: 'password'}]),
        rules: {
          usernames: [{
            validator: (r, v, cb) => isEmpty(v) && cb(new Error('请至少选择一个工号')) || cb()
          }]
        },
      };
    },
    methods: {
      getUnRegisterUserListFromServe() {
        getUnRegisterUserList().then(res => {
          this.unRegisterUsers = res;
          if (isEmpty(res)) {
            this.$message.warning('当前没有未注册的用户');
            this.close();
          }
        });
      },
      onConfirmEdit() {
        this.$refs.form.validate()
            .then(() => addNewUsers(this.form.usernames))
            .then(() => {
              this.$message.success('新增用户成功');
              this.$emit('success');
              this.close();
            });
      }
    },
    created() {
      this.getUnRegisterUserListFromServe();
      // this.formLabel.forEach(item => {
      //   const field = {[item.prop]: ''};
      //   this.form = {...this.form, ...field};
      //   this.rules[item.prop] = [{required: true, message: '该字段不能为空'}];
      // });
    },
  };
</script>

<style lang="scss" scoped>
    .option {
        width: 500px;
    }
</style>
