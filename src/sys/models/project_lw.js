import { post, get, put, _delete } from "@/sys/plugins/axios";

export default class ProjectLW {
  constructor(projectId = 1) {
    this.projectId = projectId;
  }

  /************设备***************/
  /**
   * 获取当前项目所有设备信息
   * @param {number} pageNo
   * @param {number} pageSize
   * @param {number} projectId
   */

  static async getDeviceList(pageNo, pageSize, projectId) {
    // console.log("getDeviceList");
    const res = await get(
      "/device/show/all/details?pageNo=" +
        pageNo +
        "&pageSize=" +
        pageSize +
        "&projectId=" +
        projectId
    );
    return res;
  }

  /**
   * 展开设备检查信息
   * @param {string} deviceId
   * @param {number} projectId
   */
  static async getDeviceDetail(projectId, deviceId) {
    console.log("getDeviceDetail");
    const res = await get(
      "device/inspect?deviceOuterId=" + deviceId + "&projectId=" + projectId
    );
    return res;
  }

  /**
   * 新增设备信息
   * @param {string} outerId;
   * @param {string} type;
   * @param {number} projectId;
   * @param {number}  managerId;
   * @param {string} startDate;
   * @param {string} dueDate;
   */
  static addDevice(outerId, type, projectId, managerId, startDate, dueDate) {
    return post("device/create", {
      outerId,
      type,
      projectId,
      managerId,
      startDate,
      dueDate
    });
  }

  /**
   * 更新设备信息
   * @param {string} outerId;
   * @param {string} type;
   * @param {number} projectId;
   * @param {number}  managerId;
   * @param {string} startDate;
   * @param {string} dueDate;
   */
  static updateDevice(outerId, type, projectId, managerId, startDate, dueDate) {
    return put("device/update", {
      outerId,
      type,
      projectId,
      managerId,
      startDate,
      dueDate
    });
  }

  /**
   * 可选设备管理员
   */
  static async getAllMembers(projectId) {
    const res = await get("/project/" + projectId + "/members/simple");
    return res;
  }
  
  /**
   * 模糊查询设备信息
   * 
   */
  static async searchDevice(projectId,DeviceId){
    const res = await get("/device/search?keyword="+DeviceId+"&projectId="+projectId);
    return res;
  }

    /**
    * 返回查询的设备信息
    * @param {number} projectId 
    * @param {number} deviceId
    */
   static async getDevice(projectId,deviceId){
    const res =await get("/show/detail?projectId="+projectId+"&outerId="+deviceId);
    return res;
  }

  /***********风险***************/
  /**
   * 新增风险信息
   * @param {number} projectId
   * @param {string}  name;
   * @param {string}  type;
   * @param {number} level;
   * @param {number} impact;
   * @param {string} strategy;
   * @param {number} ownerId;
   * @param {string}  ownerName;
   * @param {number} trackingFreq;
   * @param {string}  source;
   * @param {string}  description;
   * @param {number} relatedPersons; //List<Integer>
   */
  static addRisk(
    projectId,
    name,
    type,
    level,
    impact,
    strategy,
    ownerId,
    ownerName,
    trackingFreq,
    description,
    relatedPersons
  ) {
    console.log("addRisk");
    return post("/project/" + projectId + "/risk", {
      // “/project/"+this.projectId+"/risk"
      name,
      type,
      level,
      impact,
      strategy,
      ownerId,
      ownerName,
      trackingFreq,
      description,
      relatedPersons
    });
  }

  /**
   * 获取当前项目所有风险信息
   * @param {number} page
   * @param {number} pageSize
   * @param {number} projectId
   */
  static async getRiskList(projectId, page, pageSize) {
    //  console.log("getRiskList");
    const res = await get(
      "/project/" + projectId + "/risks?page=" + page + "&pageSize=" + pageSize
    );
    //  console.log("getRiskList"+res);
    return res;
  }

  /**
   * 更新风险信息
   * @param {string}  name;
   * @param {string}  type;
   * @param {number} level;
   * @param {number} impact;
   * @param {string} strategy;
   * @param {number} state;    //！！！！check一下
   * @param {number} ownerId;
   * @param {number} trackingFreq;
   * @param {string}  source;
   * @param {string}  description;
   * @param {number} relatedPersons; //List<Integer>
   */
  static updateRisk(
    projectId,
    riskId,
    {
      name,
      type,
      level,
      impact,
      strategy,
      state,
      ownerId,
      trackingFreq,
      source,
      description,
      relatedPersons
    }
  ) {
    console.log("owner" + ownerId);
    console.log("riskId" + riskId);
    return put("/project/" + projectId + "/risk/" + riskId, {
      name,
      type,
      level,
      impact,
      strategy,
      ownerId,
      trackingFreq,
      source,
      description,
      relatedPersons,
      state
    });
  }

  /**
   * 删除某条风险信息
   * @param {number} projectId
   * @param {number} riskId
   */

   static deleteRisk(projectId,riskId){
     console.log("riskId"+riskId);
     return _delete("/project/"+projectId+"/risk/"+riskId);

   }

   /**
    * 模糊查询risk
    * @param {number} projectId 
    *  @param {string} riskName
    */
   static async searchRisk(projectId,riskName){
     const res = await get("/project/"+projectId+"/risks/search?name="+riskName);
     return res;
   }

   /**
    * 返回查询的风险
    * @param {*} projectId 
    */
   static async getRisk(projectId,riskId){
    const res =await get("/project/"+projectId+"/risk/"+riskId);
    return res;
  }


   /************项目配置信息**************/
   /**
    * 显示项目配置信息
    * @param {number} projectId
    * @param {number} riskId
    */
   
    static async getConfig(projectId){
          const res =await get("/project/"+projectId+"/config");
          return res;
    }

  /**
   * 模糊查询risk
   * @param {number} projectId
   *  @param {string} riskName
   */
  static async searchRisk(projectId, riskName) {
    const res = await get(
      "/project/" + projectId + "/risks/search?name=" + riskName
    );
    console.log("searchRisk=" + res);
    return res;
  }

  /************项目配置信息**************/
  /**
   * 显示项目配置信息
   * @param {number} projectId
   */

  static async getConfig(projectId) {
    const res = await get("/project/" + projectId + "/config");
    return res;
  }

  /**
   * 编辑项目配置信息
   * @param {number} projectId
   * @param {string} gitRepoAddress
   * @param {number} virtualMachineSpace
   * @param {string}  isFileServerDirConfirmed //boolean
   * @param {string} isMailConfirmed //boolean
   */

  static editConfig(
    projectId,
    gitRepoAddress,
    virtualMachineSpace,
    isFileServerDirConfirmed,
    isMailConfirmed
  ) {
    return put("/project/" + projectId + "/config", {
      gitRepoAddress,
      virtualMachineSpace,
      isFileServerDirConfirmed,
      isMailConfirmed
    });
  }

  /**********项目进展状态******************/

  /**
   * 进展状态 列表展示
   * @param {string} projectOuterId
   */

  static async getState(projectOuterId) {
    const res = await get("/project/state/change?outerId=" + projectOuterId);
    //   console.log("getState="+res);
    return res;
  }

  /**
   * 获取备注信息
   * @param {string} projectOuterId
   */

  static async getRemark(projectOuterId) {
    const res = await get("/project/retrieve?outerId=" + projectOuterId);
    // console.log("getRemark="+res);
    return res;
  }
}
