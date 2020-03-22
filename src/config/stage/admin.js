const adminRouter = {
  route: null,
  name: null,
  title: '权限管理',
  type: 'folder',
  icon: 'iconfont icon-huiyuanguanli',
  order: null,
  inNav: true,
  permission: ['超级管理员独有权限'],
  children: [{
    route: '/admin/user',
    type: 'view',
    name: null,
    filePath: 'views/permission/user',
    inNav: true,
    title: '用户权限',
    icon: 'iconfont icon-add',
    permission: ['超级管理员独有权限'],
  }, {
    route: '/admin/list',
    type: 'view',
    name: null,
    filePath: 'views/permission/role',
    inNav: true,
    title: '角色设置',
    icon: 'iconfont icon-add',
    permission: ['超级管理员独有权限'],
  }]
};

export default adminRouter;
