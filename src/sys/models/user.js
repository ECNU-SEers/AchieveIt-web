import _axios, {post, get, put} from "@/sys/plugins/axios";
import {saveTokens} from "../utils/token";
import store from "@/store";

export default class User {
  /**
   * 分配用户
   * @param {object} data 注册信息
   */
  static register(data) {
    return _axios({
      method: "post",
      url: "cms/user/register",
      data,
      handleError: true
    });
  }

  /**
   * 登陆获取tokens
   * @param {string} username 用户名
   * @param {string} password 密码
   */
  static async getToken(username, password) {
    const tokens = await post("/auth/login", {
      username,
      password
    });
    saveTokens(tokens.accessToken, tokens.refreshToken);
    return tokens;
  }

  /**
   * 获取当前用户信息，并返回User实例
   */
  static async getInformation() {
    const info = await get("cms/user/information");
    const storeUser = store.getters.user === null ? {} : store.getters.user;
    return Object.assign({...storeUser}, info);
  }

  /**
   * 获取当前用户信息和所拥有的权限
   */
  static async getPermissions() {
    const {permissions, user} = await get("/view/permissions/me");
    let _permissions = [];
    Object.keys(permissions).forEach(key => {
      let permission = {};
      permission[key] = permissions[key];
      _permissions.push(permission);
    });
    const _user = {
      nickname: user.realName,
      username: user.username,
      permissions: _permissions
    };
    const storeUser = store.getters.user === null ? {} : store.getters.user;
    return Object.assign({...storeUser}, _user);
  }

  /**
   * 用户修改密码
   * @param {string} newPassword 新密码
   * @param {string} confirmPassword 确认新密码
   * @param {string} oldPassword 旧密码
   */
  static updatePassword({old_password, new_password, confirm_password}) {
    return put("cms/user/change_password", {
      new_password,
      confirm_password,
      old_password
    });
  }
}
