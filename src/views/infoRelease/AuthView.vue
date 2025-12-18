<template>
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