import {get, post, put} from '@/sys/plugins/axios';
import {userPermissionTableHeader} from "@/views/permission/const";
import {generateEmptyArrayByLength} from "@/util/array";

const OPEN_DEVELOP_MOCK = true;
const MOCK = process.env.NODE_ENV === 'production' ? false : OPEN_DEVELOP_MOCK;


export const getUserList = () => MOCK
    ? Promise.resolve(generateEmptyArrayByLength(10).map(() => {
      let listItem = {};
      userPermissionTableHeader.forEach(({prop}) => listItem[prop] = 'xxx');
      return listItem;
    }))
    : get('');

export const getRoleList = () => MOCK
    ? Promise.resolve(generateEmptyArrayByLength(10).map(() => ({
      name: 'xx',
      permission: 'xxx',
      creator: 'xxx'
    })))
    : get('');


export const addNewRow = () => MOCK
    ? Promise.resolve()
    : post('');

export const editUserRole = () => MOCK
    ? Promise.resolve()
    : put('');
