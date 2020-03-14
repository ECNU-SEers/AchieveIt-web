// const adminRouter = {
//   route: null,
//   name: null,
//   title: '权限管理',
//   type: 'folder',
//   icon: 'iconfont icon-huiyuanguanli',
//   filePath: 'views/admin/',
//   order: null,
//   inNav: true,
//   permission: ['超级管理员独有权限'],
//   children: [
//     {
//       route: '/admin/user/list',
//       name: null,
//       title: '用户管理',
//       type: 'folder', // 取 route 为默认加载页
//       icon: 'iconfont icon-huiyuanguanli',
//       filePath: 'views/admin/user/',
//       inNav: true,
//       children: [
//         {
//           title: '用户列表',
//           type: 'view',
//           name: 'userList',
//           route: '/admin/user/list',
//           filePath: 'views/admin/user/UserList.vue',
//           inNav: true,
//           icon: 'iconfont icon-huiyuanguanli',
//           permission: ['超级管理员独有权限'],
//         },
//         {
//           title: '添加用户',
//           type: 'view',
//           inNav: true,
//           route: '/admin/user/add',
//           icon: 'iconfont icon-add',
//           name: 'userAdd',
//           filePath: 'views/admin/user/UserAdd.vue',
//           permission: ['超级管理员独有权限'],
//         },
//       ],
//     },
//     {
//       route: '/admin/role/list',
//       name: null,
//       title: '角色管理',
//       type: 'tab', // 取 route 为默认加载页
//       icon: null,
//       filePath: 'views/admin/role',
//       inNav: true,
//       children: [
//         {
//           route: '/admin/role/list',
//           type: 'view',
//           name: 'groupList',
//           inNav: true,
//           filePath: 'views/admin/role/RoleList.vue',
//           title: '角色列表',
//           icon: 'iconfont icon-huiyuanguanli',
//           permission: ['超级管理员独有权限'],
//         },
//         {
//           route: '/admin/role/add',
//           type: 'view',
//           name: 'groupAdd',
//           filePath: 'views/admin/role/RoleAdd.vue',
//           inNav: true,
//           title: '添加角色',
//           icon: 'iconfont icon-add',
//           permission: ['超级管理员独有权限'],
//         },
//       ],
//     },
//   ],
// };


const adminRouter = {
  route: null,
  name: null,
  title: '权限管理',
  type: 'folder',
  icon: 'iconfont icon-huiyuanguanli',
  filePath: 'views/admin/',
  order: null,
  inNav: true,
  permission: ['超级管理员独有权限'],
  children: [{
    route: '/admin/user',
      type: 'view',
      name: null,
      filePath: 'views/admin/UserList.vue',
      inNav: true,
      title: '用户权限',
      icon: 'iconfont icon-add',
      permission: ['超级管理员独有权限'],
  }, {
    route: '/admin/list',
      type: 'view',
      name: null,
      filePath: 'views/admin/RoleList.vue',
      inNav: true,
      title: '角色设置',
      icon: 'iconfont icon-add',
      permission: ['超级管理员独有权限'],
  }]
};

export default adminRouter;
