const worktimeRouter = {
  route: null,
  name: null,
  title: '工时管理',
  type: 'folder',
  icon: 'iconfont icon-clock',
  filePath: 'views/worktime/',
  order: null,
  inNav: true,
  permission: ['工时提交', '工时审核'],
  children: [
    {
      route: '/worktime/submit',
      type: 'view',
      name: null,
      filePath: 'views/worktime/submit/WorkSubmit.vue',
      inNav: true,
      title: '工时提交',
      icon: 'iconfont icon-add',
      permission: ['工时提交']
    },
    {
      route: '/worktime/check',
      type: 'view',
      name: null,
      filePath: 'views/worktime/check/WorkCheck.vue',
      inNav: true,
      title: '工时审核',
      icon: 'iconfont icon-add',
      permission: ['工时审核']
    }
  ]
};

export default worktimeRouter;
