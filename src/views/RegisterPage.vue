<!--
  用户注册页面
  
  @component RegisterPage
  @description 系统用户注册页面，包含背景、导航栏和注册表单
  @author 党建系统开发团队
-->
<template>
  <BackgroundWrapper>
    <template #header>
      <!-- 顶部导航栏 -->
      <el-menu class="el-menu-demo" mode="horizontal" @select="handleMenuSelect">
        <el-menu-item index="1">首页</el-menu-item>
        <el-menu-item index="2">登录</el-menu-item>
      </el-menu>
    </template>
    <!-- 注册表单组件 -->
    <RegisterForm/>
  </BackgroundWrapper>
</template>

<script>
import BackgroundWrapper from '../components/LoginBackground.vue';
import RegisterForm from '../components/RegisterForm.vue';

export default {
  name: "RegisterPage",
  components: {
    BackgroundWrapper,  // 背景包装组件
    RegisterForm        // 注册表单组件
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
          this.$router.push({name: 'EditorPage'});
          break;
        case '2':
          // 跳转到登录页
          this.$router.push({name: 'Login'});
          break;
      }
    }
  }
}
</script>