# AchieveIt-web

### 目录结构

├───public // 公共资源目录，该目录webpack原封打包 <br>
│    ├───icons // icon图片存放目录 <br>
│    │   ecnu.ico // favicon图片 <br>
│    │   iconfont.css // 阿里iconfont文件 <br>
│    │   index.html // template模板 <br>
│    │   robots.txt // Robots协议 <br>
├───script // 脚本 <br>
├───src <br>
│    ├───assets // 静态资源文件存放目录 <br>
│    ├───components // 布局组件及业务基础组件 <br>
│    │   ├───layout // layout布局组件 <br>
│    │   ├───base // 通用基础组件库（包含element-ui二次封装组件） <br>
│    ├───config // config配置项 <br>
│    │   ├───stage // 路由配置文件 <br>
│    │   │   error-code.js // 与服务端约定的错误状态码 <br>
│    │   │   index.js // 前端自定义配置项 <br>
│    ├───sys // system核心库 <br>
│    │   ├───directives // 全局指令 <br>
│    │   ├───filter // 全局过滤器 <br>
│    │   ├───mixin // 全局mixin <br>
│    │   ├───models // model层 <br>
│    │   ├───utils // 各种工具函数 <br>
│    ├───plugins // 插件 <br>
│    ├───router // 前端路由 <br>
│    │   ├───modules // 每个业务模型的路由树 <br>
│    │   │   home-router.js // 菜单路由 <br>
│    │   │   index.js // vue-router入口文件 <br>
│    │   │   routes.js // vue-router路由配置 <br>
│    ├───store // vuex状态管理文件 <br>
│    ├───views // 业务组件 <br>
│    │   App.vue // vue根组件 <br>
│    │   main.js // webpack打包入口 <br>
│   babel.config.js // babel配置文件 <br>
│   .browserslistrc // 适配浏览器版本 <br>
│   .eslintrc.js // eslint配置文件 <br>
│   .gitignore // git上传忽略文件 <br>
