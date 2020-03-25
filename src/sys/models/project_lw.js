import { post, get, put, _delete } from '@/sys/plugins/axios';

export default class ProjectLW {
    constructor() {

    }

    /**
     * 获取当前项目所有设备信息
     * @param {当前页码} pageNo
     * @param {页面大小} pageSize
     * @param {项目id} projectId
     */

    static async getDeviceList(pageNo, pageSize, projectId) {
        // return await get('/api/device/show/all/details?pageNo=pageNo&pageSize=pageSize&projectId=projectId');
        const res = {
            "code": 1000,
            "message": "Success",
            "data": {
                "page": 1,
                "pageSize": 1,
                "total": 1,
                "items": [
                    {
                        "outerId": "01",
                        "type": "ipad",
                        "managerId": 1,
                        "managerName": "admin",
                        "startDate": "2020-02-02",
                        "dueDate": "2020-02-28",
                        "state": "已归还",
                        "returnDate": "2020-02-21"
                    }
                ]
            }
        };
        return res;
    }

}