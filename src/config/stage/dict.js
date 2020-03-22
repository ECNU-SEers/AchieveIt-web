const dictRouter = {
  route: null,
  name: null,
  title: '字典管理',
  type: 'folder',
  inNav: true,
  icon: 'iconfont icon-huiyuan1',
  filePath: 'views/dictinary/',
  children: [
    {
      name: 'dictConfig',
      route: '/dictionary/config',
      type: 'view',
      inNav: true,
      icon: 'iconfont icon-huiyuan1',
      filePath: 'views/dictionary/DictConfig.vue',
      title: '字典设置'
    }
  ]
};

export default dictRouter;
