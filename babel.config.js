/* eslint-disable comma-dangle */
module.exports = {
  presets: [
    [
      "@vue/app",
      {
        useBuiltIns: "entry"
      }
    ],
    ["@vue/cli-plugin-babel/preset", {}, "jest"]
  ],
  plugins: [
    [
      "component",
      {
        libraryName: "element-ui",
        styleLibraryName: "theme-chalk"
      }
    ]
  ]
};
