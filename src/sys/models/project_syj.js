import { post, get, put, _delete } from "@/sys/plugins/axios";

export default class ProjectSYJ {
  constructor() {}

  /**
   * 获取项目列表
   * @param {当前页码} pageNo
   * @param {页面大小} pageSize
   * @param {用户id} userId
   */
  static async getProjectList(pageNo, pageSize, keyword) {
    return await get(
      "/project/show/all/projects?pageNo=" +
        pageNo +
        "&pageSize=" +
        pageSize +
        "&keyword=" +
        keyword
    );
  }

  static async searchOneProject(outerId) {
    return await get("/project/show/list", { outerId });
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

  static async getAllQAManagers() {
    return await get("/qa/managers");
  }

  static async getAllEPGLeaders() {
    return await get("/epg/leaders");
  }

  static async getAllConfigLeaders() {
    return await get("/config/organizers");
  }

  static async getAllProjectId() {
    return await get("/project/id/all");
  }

  static async getProjectModal() {
    let keyword = "";
    return await get("/project/search?keyword=" + keyword);
  }

  static async addProject(project) {
    return await post("/project/create", project);
  }

  static async updateProject(project) {
    return await put("/project/update/less", project);
  }

  static async acceptProject(projectOuterId, remark) {
    return await put(
      "/project/accept?" +
        "projectOuterId=" +
        projectOuterId +
        "&remark=" +
        remark
    );
  }

  static async addConfigAfterAccepted(projectId, config) {
    return await post("/project/" + projectId + "/config", config);
  }

  static async rejectProject(projectOuterId, remark) {
    return await put(
      "/project/reject?" +
        "projectOuterId=" +
        projectOuterId +
        "&remark=" +
        remark
    );
  }

  static async reSubmitProject(newProject) {
    return await put("/project/update/reject", newProject);
  }

  static async getAllUser() {
    return await get("/users");
  }

  static async assignQAs(QAs) {
    return await put("/project/assign/qa", QAs);
  }

  static async assignEPGs(EPGs) {
    return await put("/project/assign/epg", EPGs);
  }

  static async assignConfig(config) {
    return await put("/project/assign/config?outerId=" + config);
  }

  static async stateToRun(outerId, remark) {
    return await put(
      "/project/set/config?" + "outerId=" + outerId + "&remark=" + remark
    );
  }

  static async stateToDeliver(outerId, remark) {
    return await put(
      "/project/deliver?" + "outerId=" + outerId + "&remark=" + remark
    );
  }

  static async stateToEnd(outerId, remark) {
    return await put(
      "/project/end?" + "outerId=" + outerId + "&remark=" + remark
    );
  }

  static async approvalArchive(outerId, remark) {
    return await put(
      "/project/approve/archive?" + "outerId=" + outerId + "&remark=" + remark
    );
  }

  static async getProjectByKeyword(pageNo, pageSize, userId, keyword) {
    return await get("/project/retrieve/all/keyword", {
      pageNo,
      pageSize,
      userId,
      keyword
    });
  }

  static async getAllDefectTypes() {
    return await get("/defect/type");
  }

  static async getProjectDefects(page, pageSize, projectId, keyword) {
    return await get("/defects", {
      page,
      pageSize,
      projectId,
      keyword
    });
  }

  static async getDefectModal(projectId, name) {
    return await get("/project/" + projectId + "/defects/search", { name });
  }

  static async addProjectDefect(projectId, defect) {
    return await post("/project/" + projectId + "/defect", defect);
  }

  static async updateProjectDefect(projectId, defectId, defect) {
    return await put("/project/" + projectId + "/defect/" + defectId, defect);
  }

  static async changeDefectState(projectId, defectId, state) {
    return await put("/project/" + projectId + "/defect/" + defectId + "/transition", state);
  }

  static async getProjectMembers(projectId) {
    return await get("/project/" + projectId + "/members/search");
  }

  static async getPermission(projectId) {
    return await get("/project/" + projectId+ "/permissions/me");
  }

  // 字典
  static async addTech(skillName) {
    return await post("/skill/add", {skillName});
  }

  static async updateTech(skillId, newSkillName) {
    return await put("/skill/update", {skillId, newSkillName});
  }

  static async deleteTech(skillIds) {
    return await _delete("/skill/delete?skillIds=" + skillIds);
  }

  static async addArea(businessAreaName) {
    return await post("/business/area/add", {businessAreaName});
  }

  static async updateArea(businessAreaId, newBusinessAreaName) {
    return await put("/business/area/update", {businessAreaId, newBusinessAreaName});
  }

  static async deleteArea(businessAreaIds) {
    return await _delete("/business/area/delete?businessAreaIds=" + businessAreaIds);
  }

   // 权限
   static async assignRoleForPM(projectId, roleId, assigneeId) {
    return await post("/project/" + projectId + "/role/" + roleId + "/assign", {assigneeId});
   }

   // 用户
   static async getRiskResponsers(projectId) {
    return await get("/project/" + projectId + "/risk/owners");
   }

   static async getRiskRelators(projectId) {
    return await get("/project/" + projectId + "/risk/relatedPeople");
   }

   static async getDefectHandlers(projectId) {
     return await get("/project/" + projectId + "/defect/assignees");
   }

   static async getProjectLeaders(projectId) {
     return await get("/project/" + projectId + "/member/leaders");
   }

   // 归档信息
   static async getArchivedInfo(projectId) {
     return await get("/archived/info/get?projectId=" + projectId);
   }

   static async updateArchivedInfo(archievedInfo) {
     return await put("/archived/info/update", archievedInfo);
   }
   
}
