<!--
/**
 * @component AuthView
 * @description 权限提示页面 - 展示无权访问提示信息
 * @author Party Building System
 */
-->
<template>
  <!-- 无权访问提示容器 -->
  <div>
    <div style="height: calc(100vh - 60px);overflow: hidden;display: flex;align-items: center;justify-content: center">
      <div style="font-size: 40px">无权访问
        <router-link to="/public">返回首页</router-link>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "AuthView"
}
</script>

<style scoped>

</style>