import _axios, { post, get, put, _delete } from "@/sys/plugins/axios";

import store from "@/store";

export default class Project {
  constructor(uPage = 0, uCount = 10, gPage = 0, gCount = 5) {
    this.uPage = uPage;
    this.uCount = uCount;
    this.lPage = gPage;
    this.gCount = gCount;
  }

  /**
   * 获取当前项目的基本信息
   * @param outerId
   */
  static async getBasic(outerId) {
    const info = await get("/project/retrieve?outerId=" + outerId);
    console.log("interface getBasic succcess");
    console.log(info);
    return info;
  }

  /**
   * 修改项目基本信息
   * @param {*} projectId
   */
  static async updateBasic() {
    const res = await put("project/update", {});
    console.log("interface update basic success");
    console.log(res);
    return res;
  }

  /**
   * 获取当前项目的一级功能列表
   * @param {string} projectId
   */
  static async getFirstFunctionList(projectId, keyword) {
    const info = await get(
      "/project/" + projectId + "/functions?keyword=" + keyword
    );
    console.log("interface getFirstFunction succcess");
    console.log(info);
    return info;
  }

  /**
   * 获取当前一级功能的二级功能列表
   * @param {string} projectId
   * @param {string} functionId
   */
  static async getSubFunctionList(projectId, functionId) {
    console.log(functionId);
    const info = await get(
      "/project/" + projectId + "/functions/" + functionId + "/sub"
    );
    console.log("interface getSubFunction succcess");
    console.log(info);
    return info;
  }

  /**
   * 增加功能
   * @param {string} projectId
   * @param {string} name
   * @param {string} description
   * @param {Integer} parentId
   */
  static async addFunction(projectId, name, description, parentId) {
    console.log("interface addFunction succcess");
    if (parentId === -1) {
      const info = await post("/project/" + projectId + "/function", {
        name,
        description
      });
      return info;
    } else {
      const info = await post("/project/" + projectId + "/function", {
        name,
        description,
        parentId
      });
      return info;
    }
  }

  /**
   * 删除功能
   * @param {*} projectId
   * @param {*} functionId
   */
  static async deleteFunction(projectId, functionId) {
    const info = await _delete(
      "/project/" + projectId + "/function/" + functionId
    );
    console.log("interface deleteFunction success");
    return info;
  }

  /**
   * 修改功能
   * @param {string} projectId
   * @param {string} name
   * @param {string} description
   * @param {Integer} functionId
   */
  static async editFunction(projectId, functionId, name, description) {
    const info = await put(
      "/project/" + projectId + "/function/" + functionId,
      {
        name,
        description
      }
    );
    console.log("interface edit function");
    console.log(info);
    return info;
  }

  /**
   * 获取当前项目的成员列表（分页）
   * @param {string} projectId
   * @param {string} page
   * @param {string} pageSize
   */
  static async getMemberList(projectId, page, pageSize, keyword) {
    const info = await get(
      "/project/" +
        projectId +
        "/members?page=" +
        page +
        "&pageSize=" +
        pageSize +
        "&keyword=" +
        keyword
    );
    console.log("interface getMember succcess");
    console.log(info);
    return info;
  }

  /**
   * 获取当前项目成员
   * @param {*} projectId
   */
  // static async getMembers(projectId) {
  //   const info = await get("/project/" + projectId + "/members/simple");
  //   return info;
  // }

  /**
   * 获取所有员工
   */
  static async getUsers() {
    const info = get("/employees");
    return info;
  }

  /**
   * 新增成员
   */
  static async addMember(
    projectId,
    userId,
    username,
    leaderId,
    leaderName,
    roleId
  ) {
    const info = post("/project/" + projectId + "/member", {
      userId,
      username,
      leaderId,
      leaderName,
      roleId
    });
    return info;
  }

  /**
   * 删除成员
   */
  static async deleteMember(projectId, memberId) {
    const info = await _delete("/project/" + projectId + "/member/" + memberId);
    console.log("delete member!");
    return info;
  }

  /**
   * 修改成员
   */
  static async editMember(projectId, memberId, leaderId, leaderName, roles) {
    const info = await put("/project/" + projectId + "/member/" + memberId, {
      leaderId,
      leaderName,
      roles
    });
    return info;
  }

  /**
   * 获取所有客户
   */
  static async getClients() {
    const info = await get("/client/all");
    return info;
  }

  /**
   * 获得所有角色
   */
  static async getRoles() {
    const info = await get("/roles?pageSize=999&page=1");
    return info.items;
  }

  /**
   * 获得所有项目上级
   */
  static async getSupervisors() {
    const info = await get("/supervisors");
    return info;
  }

  /**
   * 获取所有业务领域
   */
  static async getAreas() {
    const info = await get("/business/area/all");
    return info;
  }

  /**
   * 获得所有技术
   */
  static async getSkills() {
    const info = get("/skill/all");
    return info;
  }

  /**
   * 修改当前项目的基本信息
   */

  static async updateBasic(
    outerId,
    name,
    clientOuterId,
    company,
    startDate,
    endDate,
    milestone,
    skillNames,
    businessAreaName
  ) {
    return put("/project/update", {
      outerId,
      name,
      clientOuterId,
      company,
      startDate,
      endDate,
      milestone,
      skillNames,
      businessAreaName
    });
  }

  /**
   * 搜索功能
   */
  static async searchFunctions(projectId, name) {
    var info = get("/project/" + projectId + "/functions/search?name=" + name);
    console.log(info);
    return info;
  }

  /**
   * 获取单个功能
   * @param {*} projectId
   * @param {*} name
   */
  static async getOneFunction(projectId, functionId, keyword) {
    return get(
      "/project/" +
        projectId +
        "/functions/" +
        functionId +
        "?keyword=" +
        keyword
    );
  }

  /**
   * 搜索成员
   */
  static async searchMembers(projectId, name) {
    return get("/project/" + projectId + "/members/search?name=" + name);
  }

  /**
   * 获取单个成员
   */
  static async getOneMember(projectId, memberId) {
    return get("/project/" + projectId + "/member/" + memberId);
  }

  /**
   * 获取成员在项目中的权限
   */
  static async getPermissions(projectId) {
    return get("/project/" + projectId + "/permissions/me");
  }
}
