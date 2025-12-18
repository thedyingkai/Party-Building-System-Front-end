<template>
  <el-container class="login_background">
    <el-header>
      <slot name="header"></slot> <!-- 使用插槽来插入登录表单或其他内容 -->
    </el-header>
    <el-main>
      <slot></slot> <!-- 使用插槽来插入登录表单或其他内容 -->
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