const projectRouter = {
  route: null,
  name: null,
  type: 'folder', //folder tab view,
  inNav: true,
  title: '项目',
  icon: 'iconfont icon-huiyuan1',
  filePath: 'views/project/',
  children: [{
    name: 'project',
    route: '/project',
    type: 'view',
    inNav: true,
    icon: 'iconfont icon-huiyuan1',
    filePath: 'views/project/Project.vue',
    title: '项目管理'
  }]
};

export default projectRouter;
