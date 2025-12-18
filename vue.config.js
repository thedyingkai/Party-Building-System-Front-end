const { defineConfig } = require('@vue/cli-service')
const path = require("path");
const fs = require('fs');

module.exports = defineConfig({
    transpileDependencies: true,
    configureWebpack: {
        module: {
            rules: [
                // 配置读取 *.md 文件的规则
                {
                    test: /\.md$/,
                    use: [
                        {loader: "html-loader"},
                        {loader: "markdown-loader", options: {}}
                    ]
                }
            ]
        },
        resolve: {
            fallback: {
                "util": require.resolve("util/")
            }
        }
    },
    devServer: {
        headers: {
            'Content-Security-Policy': ''
        },
        https: {
            pfx: fs.readFileSync(path.join(__dirname, './WebServer.pfx')),
            passphrase: 'zpx@20222111'
        },
        port: 8080
    }
})