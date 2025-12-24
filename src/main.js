/**
 * Vue 应用主入口文件
 * 
 * @description 初始化 Vue 应用，配置全局插件、样式、原型方法等
 * @author 党建系统开发团队
 * @date 2025
 */

// ==================== 核心依赖导入 ====================
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

// ==================== 样式导入 ====================
import './assets/css/login&regist.css' // 登录注册页面样式
import 'element-ui/lib/theme-chalk/index.css'; // Element UI 主题样式
import "github-markdown-css"; // GitHub 风格的 Markdown 样式
import "highlight.js/styles/github.css"; // 代码高亮样式

// ==================== 第三方库导入 ====================
import ElementUI from 'element-ui'; // Element UI 组件库
import Axios from 'axios'; // HTTP 请求库
import request from "@/utils/request"; // 封装的请求工具
import VueTreeList from 'vue-tree-list' // 树形列表组件

// ==================== 全局配置 ====================
Vue.config.productionTip = false // 关闭生产环境提示

// ==================== 注册全局插件 ====================
Vue.use(ElementUI) // 注册 Element UI
Vue.use(VueTreeList) // 注册树形列表组件

// ==================== 全局属性挂载 ====================
Vue.prototype.$axios = Axios; // 挂载 Axios 到 Vue 原型
Vue.prototype.$request = request // 挂载封装的请求工具
Vue.prototype.$baseUrl = process.env.VUE_APP_BASEURL // 挂载后端接口基础地址

// ==================== 全局方法定义 ====================

/**
 * 处理响应并返回上一页
 * @param {Object} res - 服务器响应对象
 * @param {Function} successCallback - 成功时的回调函数
 */
Vue.prototype.$handleResponseAndGoback = function (res, successCallback) {
    if (res.code === '200') {
        successCallback();
        this.$router.go(-1); // 返回上一页
    } else {
        this.$message.error(res.data.msg); // 显示错误信息
    }
}

/**
 * 处理响应
 * @param {Object} res - 服务器响应对象
 * @param {Function} successCallback - 成功时的回调函数
 */
Vue.prototype.$handleResponse = function (res, successCallback) {
    if (res.code === '200') {
        successCallback();
    } else {
        this.$message.error(res.data.msg); // 显示错误信息
    }
};

// ==================== 创建 Vue 实例 ====================
new Vue({
    router, // 路由实例
    store, // 状态管理实例
    render: h => h(App) // 渲染根组件
}).$mount('#app') // 挂载到 #app 元素
