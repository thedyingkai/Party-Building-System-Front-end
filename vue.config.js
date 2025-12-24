/**
 * Vue CLI 配置文件
 * 用于自定义 Vue 项目的构建和开发服务器配置
 * 
 * @description 配置 Webpack、开发服务器、Markdown 加载器等
 * @requires @vue/cli-service Vue CLI 服务
 * @requires fs 文件系统模块
 * @requires path 路径处理模块
 */
const { defineConfig } = require('@vue/cli-service')
const path = require("path");
const fs = require('fs');

module.exports = defineConfig({
    transpileDependencies: true, // 启用依赖项转译，确保第三方库的兼容性

    // Webpack 配置
    configureWebpack: {
        module: {
            rules: [
                // 配置 Markdown 文件加载器
                {
                    test: /\.md$/,  // 匹配 .md 文件
                    use: [
                        { loader: "html-loader" },           // 将 Markdown 转换为 HTML
                        { loader: "markdown-loader", options: {} } // 解析 Markdown 文件
                    ]
                }
            ]
        },
        resolve: {
            fallback: {
                "util": require.resolve("util/") // 为浏览器环境提供 util 模块的 polyfill
            }
        }
    },

    // 开发服务器配置
    devServer: {
        headers: {
            'Content-Security-Policy': '' // 内容安全策略配置
        },
        https: {
            // HTTPS 证书配置
            pfx: fs.readFileSync(path.join(__dirname, './WebServer.pfx')), // 读取 PFX 证书文件
            passphrase: 'zpx@20222111' // 证书密码
        },
        port: 8080 // 开发服务器端口
    }
})