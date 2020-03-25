const adminRouter = {
  route: null,
  name: null,
  title: '权限管理',
  type: 'folder',
  icon: 'iconfont icon-huiyuanguanli',
  order: null,
  inNav: true,
  permission: ['用户权限管理', '角色设置'],
  children: [
    {
      route: '/admin/user',
      type: 'view',
      name: null,
      filePath: 'views/permission/user',
      inNav: true,
      title: '用户权限',
      icon: 'iconfont icon-add',
      permission: ['用户权限管理']
    },
    {
      route: '/admin/list',
      type: 'view',
      name: null,
      filePath: 'views/permission/role',
      inNav: true,
      title: '角色设置',
      icon: 'iconfont icon-add',
      permission: ['角色设置']
    }
  ]
};

export default adminRouter;
