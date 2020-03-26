import { post, get, put, _delete } from "@/sys/plugins/axios";

export default class ProjectLW {
  constructor() {}

  /**
   * 获取当前项目所有设备信息
   * @param {number} pageNo
   * @param {number} nppageSize
   * @param {number} projectId
   */

  static async getDeviceList(pageNo, pageSize, projectId) {
    // return await get('/device/show/all/details?pageNo=pageNo&pageSize=pageSize&projectId=projectId');
    const res = {
      code: 1000,
      message: "Success",
      data: {
        page: 1,
        pageSize: 1,
        total: 1,
        items: [
          {
            outerId: "01",
            type: "ipad",
            managerId: 1,
            managerName: "admin",
            startDate: "2020-02-02",
            dueDate: "2020-02-28",
            state: "已归还",
            returnDate: "2020-02-21"
          }
        ]
      }
    };
    return res;
  }

  /**
   * 获取平台用户作为可选管理员
   */
  static async getAllUsers() {
    //  return await get('/api/employees');
    const users = {
      code: 1000,
      message: "Success",
      data: [
        {
          userId: 3,
          username: "小张"
        },
        {
          userId: 4,
          username: "小力"
        }
      ]
    };
    return users;
  }

  /**
   * 编辑设备信息
   * @param {string} outerId
   * @param {string} type
   * @param {number} projectId
   * @param {number} managerId
   * @param {string} managerName
   * @param {日期}  startDate
   * @param {日期} dueDate
   *
   */
  static updateDeviceDetail({
    outerId,
    type,
    projectId,
    managerId,
    managerName,
    startDate,
    dueDate
  }) {
    return put("api/device/update", {
      outerId,
      type,
      projectId,
      managerId,
      managerName,
      startDate,
      dueDate
    });
  }

  /**
   * 获取当前项目所有设备信息
   * @param {当前页码} pageNo
   * @param {页面大小} pageSize
   * @param {设备id} deviceId
   */
  static async getDeviceInspection(pageNo, pageSize, deviceId) {
    const res = {
      code: 1000,
      message: "Success",
      data: {
        page: 1,
        pageSize: 1,
        total: 1,
        items: [
          {
            inspectDate: "2020-02-02",
            intact: "损坏",
            remark: "设备完好"
          }
        ]
      }
    };
    return res;
  }
}
