import {post, get, put, _delete} from '@/sys/plugins/axios';

export default class ProjectSYJ {

    constructor() {
    }

    /**
     * 获取项目列表
     * @param {当前页码} pageNo 
     * @param {页面大小} pageSize 
     * @param {用户id} userId 
     */
    static async getProjectList(pageNo, pageSize, userId) {
        // return await get('/api/project/show/all/projects?pageNo=pageNo&pageSize=pageSize&userId=userId');
        const res = {
            "code": 1000,
            "message": "Success",
            "data": {
                "page": 1,
                "pageSize": 10,
                "total": 1,
                "items": [
                    {
                        "outerId": "P01",
                        "name": "项目1",
                        "company": "公司1",
                        "startDate": "2020-01-01",
                        "endDate": "2020-06-01",
                        "supervisorId": 5,
                        "supervisorName": "zhangsan",
                        "managerId": 3,
                        "managerName": "lisi",
                        "participantCounter": 1,
                        "qaAssigned": "未分配",
                        "epgAssigned": "未分配",
                        "reviewResult": false
                    }
                ]
            }
        };
        return res; 
    }

    static async getAllClients() {
        // return await get('/api/client/all');
        const clients = {
            "code": 1000,
            "message": "Success",
            "data": [
                {
                    "outerId": "C01",
                    "company": "阿里巴巴"
                }
            ]
        };

        return clients;
    }

    static async getAllTech() {
        // return await get('/api/skill/all');
        const res = {
            "code": 1000,
            "message": "Success",
            "data": [
                {
                    "id": 1,
                    "name": "Java"
                },
                {
                    "id": 2,
                    "name": "Vue.js"
                },
                {
                    "id": 3,
                    "name": "MySQL"
                },
                {
                    "id": 4,
                    "name": "MongoDB"
                }
            ]
        };
        return res;
    }

    static async getAllBusinessArea() {
        // return await get('/api/business/area/all');
        const res = {
            "code": 1000,
            "message": "Success",
            "data": [
                {
                    "id": 1,
                    "name": "AI"
                },
                {
                    "id": 2,
                    "name": "金融"
                },
                {
                    "id": 3,
                    "name": "教育"
                }
            ]
        };
        return res;
    }

    static async getProjectDefects(projectId, page, pageSize) {
        // return await get('47.100.92.156:8080/achieveit/api/defects?page=page&pageSize=pageSize&projectId=projectId');
        const res = {
            "code": 1000,
            "message": "Success",
            "data": {
                "page": 1,
                "pageSize": 10,
                "total": 1,
                "items": [
                    {
                        "id": 1,
                        "projectId": 1,
                        "name": "缺陷1",
                        "description": "描述1",
                        "type": 1,
                        "level": 1,
                        "state": 1,
                        "creatorId": 1,
                        "creatorName": "管理员",
                        "handlerId": 1,
                        "handlerName": "管理员",
                        "due": "2020-02-02T00:00:00",
                        "createdAt": "2020-01-01T00:00:00",
                        "updatedAt": "2020-01-31T00:00:00"
                    }
                ]
            }
        };
        return res;
    }
}