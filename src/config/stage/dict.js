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
      route: '/dictionary/tech',
      type: 'tab',
      inNav: true,
      icon: 'iconfont icon-huiyuan1',
      filePath: 'views/dictionary/DictTech.vue',
      title: '字典设置',
      children: [{
        name: 'projectTech',
        route: '/dictionary/tech',
        type: 'view',
        inNav: true,
        filePath: 'views/dictionary/DictTech.vue',
        title: '采用技术'
      }, {
        name: 'projectArea',
        route: '/dictionary/area',
        type: 'view',
        inNav: true,
        filePath: 'views/dictionary/DictArea.vue',
        title: '业务领域'
      }]
    }
  ]
};

export default dictRouter;
