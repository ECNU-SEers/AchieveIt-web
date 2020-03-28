import { post, get, put, _delete } from "@/sys/plugins/axios";

export default class ProjectSYJ {
  constructor() {}

  /**
   * 获取项目列表
   * @param {当前页码} pageNo
   * @param {页面大小} pageSize
   * @param {用户id} userId
   */
  static async getProjectList(pageNo, pageSize, userId) {
    return await get("/project/show/all/projects", {
      pageNo,
      pageSize,
      userId
    });
  }

  static async getAllClients() {
    return await get("/client/all");
  }

  static async getAllTech() {
    return await get("/skill/all");
  }

  static async getAllBusinessArea() {
    return await get("/business/area/all");
  }

  static async getAllMentors() {
    return await get("/supervisors");
  }

  static async getAllProjectId() {
    return await get("/project/id/all");
  }

  static async getProjectModal(userId) {
    let keyword = "";
    return await get("/project/search", { userId, keyword });
  }

  static async addProject(project) {
    return await post("/project/create", project);
  }

  static async updateProject(project) {
    return await put("/project/update/less", project);
  }

  static async getAllDefectTypes() {
    return await get("/defect/type");
  }

  static async getProjectDefects(page, pageSize, projectId) {
    return await get("/defects", {
      page,
      pageSize,
      projectId
    });
  }

  static async addProjectDefect(projectId, defect) {
    return await post("/project/" + projectId + "/defect",  defect);
  }

  static async updateProjectDefect(projectId, defectId, defect) {
    return await put("/project/" + projectId + "/defect/" + defectId, defect);
  }
}
