const worktimeRouter = {
    route: null,
    name: null,
    title: '工时管理',
    type: 'folder',
    icon: 'iconfont icon-huiyuanguanli',
    filePath: 'views/worktime/',
    order: null,
    inNav: true,
    children: [{
      route: '/worktime/submit',
        type: 'view',
        name: null,
        filePath: 'views/worktime/WorkSubmit.vue',
        inNav: true,
        title: '工时提交',
        icon: 'iconfont icon-add'
    }, {
      route: '/worktime/check',
        type: 'view',
        name: null,
        filePath: 'views/worktime/WorkCheck.vue',
        inNav: true,
        title: '工时审核',
        icon: 'iconfont icon-add'
    }]
  };

  export default worktimeRouter;