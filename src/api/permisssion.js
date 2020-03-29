import { get, post, put } from '@/sys/plugins/axios';
import { userPermissionTableHeader } from '@/views/permission/const';
import { generateEmptyArrayByLength } from '@/util/array';

<<<<<<< HEAD
const OPEN_DEVELOP_MOCK = true;
const MOCK = process.env.NODE_ENV === 'production' ? false : OPEN_DEVELOP_MOCK;

export const getUserList = () =>
=======
const OPEN_DEVELOP_MOCK = false;
const MOCK = process.env.NODE_ENV === 'production' ? false : OPEN_DEVELOP_MOCK;

export const getUserList = (page = 1, pageSize = 10) =>
>>>>>>> e389cd40b261aae7615d49a258b0624b6bbfdb01
  MOCK
    ? Promise.resolve(
        generateEmptyArrayByLength(10).map(() => {
          let listItem = {};
          userPermissionTableHeader.forEach(
            ({ prop }) => (listItem[prop] = 'xxx')
          );
          return listItem;
        })
      )
<<<<<<< HEAD
    : get('');

export const getRoleList = () =>
  MOCK
    ? Promise.resolve(
        generateEmptyArrayByLength(10).map(() => ({
          name: 'xx',
          permission: 'xxx',
          creator: 'xxx'
        }))
      )
    : get('');

export const addNewRole = () => (MOCK ? Promise.resolve() : post(''));

export const editUserRole = () => (MOCK ? Promise.resolve() : put(''));
=======
    : get('/users/view/permissions', { page, pageSize });

export const getRoleList = () => get('/view/roles');

export const addNewRole = (name, permissions) =>
  MOCK ? Promise.resolve() : post('/view/role', { name, permissions });

export const editUserRole = (id, name, permissions) =>
  MOCK ? Promise.resolve() : put(`/view/role/${id}`, { name, permissions });
>>>>>>> e389cd40b261aae7615d49a258b0624b6bbfdb01
