<!--
  登录背景容器组件
  
  @component LoginBackground
  @description 登录和注册页面的背景容器，使用插槽支持自定义头部和主体内容
  @author 党建系统开发团队
-->
<template>
  <el-container class="login_background">
    <!-- 头部插槽：用于导航栏 -->
    <el-header>
      <slot name="header"></slot>
    </el-header>
    <!-- 主体插槽：用于登录/注册表单 -->
    <el-main>
      <slot></slot>
    </el-main>
  </el-container>
</template>

<script>
export default {
  name: "LoginBackground"
}
</script>

<style  scoped>
.el-main {
  display: flex;
  justify-content: center;
  align-items: center;
}
.el-header{
  padding: 0;
}

</style>
<style>
/* 你可以在这里添加你的CSS样式 */

.el-menu-demo {
  background-color: #d21300 !important;
}

.el-menu-demo > .el-menu-item {
  width: 150px; /* 根据需要调整宽度 */
  text-align: center; /* 可选，使文本居中 */
  color: white !important;
  transition: background-color 0.3s, color 0.3s;
}

/* 鼠标悬停时的样式 */
.el-menu-demo .el-menu-item:hover {
  background-color: #fa1a00 !important;
  color: #ffffff !important;
}
</style>