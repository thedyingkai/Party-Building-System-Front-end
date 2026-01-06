<!--
  应用根组件
  
  @component App
  @description Vue 应用的根组件，所有页面通过 router-view 在此处渲染
  @author 党建系统开发团队
  @update 2026-01-06 添加 Mock 模式切换器
-->
<template>
  <div id="app">
    <!-- 路由视图容器，所有页面组件在此渲染 -->
    <router-view/>
    <!-- Mock 模式切换器（仅开发环境显示） -->
    <MockSwitch />
  </div>
</template>

<script>
import MockSwitch from '@/components/MockSwitch.vue'

export default {
  name: 'App',
  components: {
    MockSwitch
  }
}
</script>

<style lang="scss">
/* 导入全局样式 */
@import "assets/css/global.css";

/* 应用根容器样式 */
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif; /* 字体族 */
  -webkit-font-smoothing: antialiased; /* WebKit 字体抗锯齿 */
  -moz-osx-font-smoothing: grayscale; /* Firefox 字体抗锯齿 */
  //text-align: center;
  color: #2c3e50; /* 文本颜色 */
}

/* 导航栏样式 */
nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    /* 激活的路由链接样式 */
    &.router-link-exact-active {
      color: #42b983;
    }
  }
}

</style>
