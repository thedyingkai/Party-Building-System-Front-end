<!--
  登录页面
  
  @component LoginPage
  @description 系统登录页面，包含背景、导航栏和登录表单
  @author 党建系统开发团队
-->
<template>
  <BackgroundWrapper>
    <template #header>
      <!-- 顶部导航栏 -->
      <el-menu class="el-menu-demo" mode="horizontal" @select="handleMenuSelect">
        <el-menu-item index="1">首页</el-menu-item>
      </el-menu>
    </template>
    <!-- 登录表单组件 -->
    <LoginForm/>
  </BackgroundWrapper>
</template>

<script>
import BackgroundWrapper from '../components/LoginBackground.vue';
import LoginForm from '../components/LoginForm.vue';

export default {
  name: "LoginPage",
  components: {
    BackgroundWrapper, // 背景包装组件
    LoginForm          // 登录表单组件
  },
  methods: {
    /**
     * 处理菜单选择事件
     * @param {string} index - 菜单项索引
     */
    handleMenuSelect(index) {
      switch (index) {
        case '1':
          // 跳转到首页
          this.$router.push({name: 'home'});
          break;
      }
    }
  }
}
</script>

<style>

</style>