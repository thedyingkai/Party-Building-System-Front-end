/**
 * Babel 配置文件
 * 用于配置 JavaScript 代码的转译规则，确保代码在不同浏览器环境中的兼容性
 * 
 * @description 使用 Vue CLI 的默认 Babel 预设，支持 ES6+ 语法转译
 */
module.exports = {
  presets: [
    '@vue/cli-plugin-babel/preset' // Vue CLI Babel 预设，包含所需的转译插件
  ]
}
