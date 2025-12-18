<template>
  <BackgroundWrapper>
    <template #header>
      <!-- 这里可以直接写登录页面的导航栏，或者引入一个LoginNavbar.vue组件 -->
      <el-menu class="el-menu-demo" mode="horizontal" @select="handleMenuSelect">
        <el-menu-item index="1">首页</el-menu-item>
      </el-menu>
    </template>
    <LoginForm/>
  </BackgroundWrapper>
</template>

<script>
import BackgroundWrapper from '../components/LoginBackground.vue';
import LoginForm from '../components/LoginForm.vue';

export default {
  name: "LoginPage",
  components: {
    BackgroundWrapper,
    LoginForm
  },
  methods: {
    handleMenuSelect(index) {
      switch (index) {
        case '1':
          this.$router.push({name: 'home'});
          break;
      }
    }
  }
}
</script>

<style>

</style>