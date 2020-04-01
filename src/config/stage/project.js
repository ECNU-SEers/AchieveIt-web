const projectRouter = {
  route: null,
  name: null,
  title: '项目管理',
  type: 'folder', //folder tab view,
  inNav: true,
  icon: 'iconfont icon-huiyuan1',
  filePath: 'views/project/',
  children: [{
    name: 'projectList',
    route: '/project/list',
    type: 'view',
    inNav: true,
    icon: 'iconfont icon-huiyuan1',
    filePath: 'views/project/ProjectList.vue',
    title: '项目列表'
  },
  {
    name: 'projectDetail',
    route: '/project/basic',
    type: 'tab',
    inNav: false,
    icon: 'iconfont icon-huiyuan1',
    filePath: 'views/project',
    title: '项目详情',
    children: [{
      name: 'projectBasic',
      route: '/project/basic',
      type: 'view',
      inNav: true,
      icon: 'iconfont icon-huiyuan1',
      filePath: 'views/project/ProjectBasic.vue',
      title: '基本信息'
    }, {
      name: 'projectMember',
      route: '/project/member',
      type: 'view',
      inNav: true,
      icon: 'iconfont icon-huiyuan1',
      filePath: 'views/project/ProjectMember.vue',
      title: '成员信息'
    }, {
      name: 'projectFunction',
      route: '/project/function',
      type: 'view',
      inNav: true,
      icon: 'iconfont icon-huiyuan1',
      filePath: 'views/project/ProjectFunction.vue',
      title: '功能列表'
    }, {
      name: 'projectDefect',
      route: '/project/defect',
      type: 'view',
      inNav: true,
      icon: 'iconfont icon-huiyuan1',
      filePath: 'views/project/ProjectDefect.vue',
      title: '缺陷信息'
    }, {
      name: 'projectRisk',
      route: '/project/risk',
      type: 'view',
      inNav: true,
      icon: 'iconfont icon-huiyuan1',
      filePath: 'views/project/ProjectRisk.vue',
      title: '风险信息'
    }, {
      name: 'projectDevice',
      route: '/project/device',
      type: 'view',
      inNav: true,
      icon: 'iconfont icon-huiyuan1',
      filePath: 'views/project/ProjectDevice.vue',
      title: '设备信息'
    }, {
      name: 'projectConfig',
      route: '/project/config',
      type: 'view',
      inNav: true,
      icon: 'iconfont icon-huiyuan1',
      filePath: 'views/project/ProjectConfig.vue',
      title: '配置信息'
    }, {
      name: 'projectState',
      route: '/project/state',
      type: 'view',
      inNav: true,
      icon: 'iconfont icon-huiyuan1',
      filePath: 'views/project/ProjectState.vue',
      title: '状态进展'
    }]
  }]
};
//   {
//     name: 'projectDetail',
//     route: '/project/basic',
//     type: 'tab',
//     inNav: true,
//     icon: 'iconfont icon-huiyuan1',
//     filePath: 'views/project',
//     title: '项目详情',
//     children: [{
//       name: 'projectBasic',
//       route: '/project/basic',
//       type: 'view',
//       inNav: true,
//       icon: 'iconfont icon-huiyuan1',
//       filePath: 'views/project/ProjectBasic.vue',
//       title: '基本信息'
//     }, {
//       name: 'projectMember',
//       route: '/project/member',
//       type: 'view',
//       inNav: true,
//       icon: 'iconfont icon-huiyuan1',
//       filePath: 'views/project/ProjectMember.vue',
//       title: '成员信息'
//     }, {
//       name: 'projectFunction',
//       route: '/project/function',
//       type: 'view',
//       inNav: true,
//       icon: 'iconfont icon-huiyuan1',
//       filePath: 'views/project/ProjectFunction.vue',
//       title: '功能列表'
//     }, {
//       name: 'projectDefect',
//       route: '/project/defect',
//       type: 'view',
//       inNav: true,
//       icon: 'iconfont icon-huiyuan1',
//       filePath: 'views/project/ProjectDefect.vue',
//       title: '缺陷信息'
//     }, {
//       name: 'projectRisk',
//       route: '/project/risk',
//       type: 'view',
//       inNav: true,
//       icon: 'iconfont icon-huiyuan1',
//       filePath: 'views/project/ProjectRisk.vue',
//       title: '风险信息'
//     }, {
//       name: 'projectDevice',
//       route: '/project/device',
//       type: 'view',
//       inNav: true,
//       icon: 'iconfont icon-huiyuan1',
//       filePath: 'views/project/ProjectDevice.vue',
//       title: '设备信息'
//     }, {
//       name: 'projectConfig',
//       route: '/project/config',
//       type: 'view',
//       inNav: true,
//       icon: 'iconfont icon-huiyuan1',
//       filePath: 'views/project/ProjectConfig.vue',
//       title: '配置信息'
//     }, {
//       name: 'projectState',
//       route: '/project/state',
//       type: 'view',
//       inNav: true,
//       icon: 'iconfont icon-huiyuan1',
//       filePath: 'views/project/ProjectState.vue',
//       title: '状态进展'
//     }]
//   }]
// };

export default projectRouter;
