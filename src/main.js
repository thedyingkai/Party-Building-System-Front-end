import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './assets/css/login&regist.css'
import 'element-ui/lib/theme-chalk/index.css';
import ElementUI from 'element-ui';
import Axios from 'axios';
import request from "@/utils/request";
import VueTreeList from 'vue-tree-list'
import 'element-ui/lib/theme-chalk/index.css';
import "github-markdown-css";
import "highlight.js/styles/github.css";

Vue.prototype.$axios = Axios;
Vue.config.productionTip = false
Vue.prototype.$request = request
Vue.prototype.$baseUrl = process.env.VUE_APP_BASEURL
Vue.use(ElementUI)
Vue.use(VueTreeList)
Vue.prototype.$handleResponseAndGoback = function (res, successCallback) {
    if (res.code === '200') {
        successCallback();
        this.$router.go(-1);
    } else {
        this.$message.error(res.data.msg);
    }
}
Vue.prototype.$handleResponse = function (res, successCallback) {
    if (res.code === '200') {
        successCallback();
    } else {
        this.$message.error(res.data.msg);
    }
};
new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')
