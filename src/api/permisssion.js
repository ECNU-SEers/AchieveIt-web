import { get, post, put, _delete } from '@/sys/plugins/axios';
import { userPermissionTableHeader } from '@/views/permission/const';
import { generateEmptyArrayByLength } from '@/util/array';

const OPEN_DEVELOP_MOCK = false;
const MOCK = process.env.NODE_ENV === 'production' ? false : OPEN_DEVELOP_MOCK;

export const getUserList = (keyword = '', page = 1, pageSize = 10) =>
  MOCK
    ? Promise.resolve({
        items: generateEmptyArrayByLength(10).map(() => {
          let listItem = {};
          userPermissionTableHeader.forEach(
            ({ prop }) => (listItem[prop] = 'xxx')
          );
          return listItem;
        })
      })
    : get('/users/view/roles', { keyword, page, pageSize });

export const getRoleList = () =>
  MOCK ? Promise.resolve([{ id: 1, name: '管理员' }]) : get('/view/roles');

export const addNewRole = (name, permissions) =>
  MOCK ? Promise.resolve() : post('/view/role', { name, permissions });

export const editUserRole = (id, name, permissions) =>
  MOCK ? Promise.resolve() : put(`/view/role/${id}`, { name, permissions });

export const deleteRole = id => _delete(`/view/role/${id}`);

export const setUserRole = (userId, roles) =>
  MOCK ? Promise.resolve() : put(`/user/${userId}/view/roles`, { roles });
