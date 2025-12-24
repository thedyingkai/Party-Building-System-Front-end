<!--
  404 页面未找到组件
  
  @component NotFound
  @description 当用户访问不存在的路由时显示的 404 错误页面
  @author 党建系统开发团队
-->
<template>
  <div>
    <div style="height: 100vh;overflow: hidden;display: flex;align-items: center;justify-content: center">
      <div style="font-size: 40px">
        404 找不到页面
        <!-- 返回首页链接 -->
        <router-link to="/public">返回首页</router-link>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "NotFound"
}
</script>

<style scoped>

</style>