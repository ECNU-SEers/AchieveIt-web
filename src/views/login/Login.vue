<template>
  <div class="container">
    <p class="title">AchieveIt 软件项目管理平台</p>
    <el-card class="login-box bg-translucence" shadow="hover">
      <el-form
        ref="form"
        label-position="left"
        :model="form"
        :rules="rules"
        label-width="60"
      >
        <el-form-item label="账号:" prop="account">
          <el-input v-model="form.username" />
        </el-form-item>
        <el-form-item label="密码:" prop="password">
          <el-input v-model="form.password" type="password" />
        </el-form-item>
      </el-form>
      <el-button
        type="primary"
        class="login-btn btn"
        @click="userLogin"
        :loading="loading"
        :disabled="loading"
      >
        登录
      </el-button>
    </el-card>
  </div>
</template>

<script>
import { mapActions, mapMutations } from "vuex";
import User from "@/sys/models/user";
import Utils from "@/sys/utils/util";

export default {
  data() {
    return {
      loading: false, // 加载动画
      wait: 2000, // 2000ms之内不能重复发起请求
      throttleLogin: null, // 节流登录
      form: {
        username: "admin",
        password: "admin"
      },
      rules: {
        account: [
          {
            required: true,
            message: "请输入账号"
          }
        ],
        password: [
          {
            required: true,
            message: "请输入密码"
          },
          {
            min: 6,
            message: "长度至少为6位"
          }
        ]
      }
    };
  },
  methods: {
    async userLogin() {
      const { username, password } = this.form;
      await this.login(username, password);
    },
    async login(username, password) {
      try {
        this.loading = true;
        await User.getToken(username, password);
        await this.getInformation();
        this.loading = false;
        this.$router.push("/about");
        this.$message.success("登录成功");
      } catch (e) {
        this.loading = false;
        console.log(e);
      }
    },
    async getInformation() {
      try {
        // 尝试获取当前用户信息
        const user = await User.getPermissions();
        this.setUserAndState(user);
        this.setUserPermissions(user.permissions);
      } catch (e) {
        console.log(e);
      }
    },
    ...mapActions(["setUserAndState"]),
    ...mapMutations({
      setUserPermissions: "SET_USER_PERMISSIONS"
    })
  },
  created() {
    // 节流登录
    this.throttleLogin = Utils.throttle(this.login, this.wait);
  }
};
</script>

<style lang="scss" scoped>
.container {
  width: 100%;
  height: 100%;
  background-image: url("../../assets/img/login-bg.jpg");
  background-size: cover;
  position: fixed;
}

.title {
  font-size: 48px;
  margin-top: 160px;
}

.login-box {
  width: 480px;
  height: 320px;
  margin: 80px auto;
  text-align: center;
}

.bg-translucence {
  background-color: rgba(255, 255, 255, 0.4);
}

.btn {
  width: 440px;
  height: 40px;
}

.login-btn {
  margin-bottom: 16px;
}

.tourist-btn {
  margin-left: -2px;
}
</style>
