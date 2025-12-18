<template>
  <BackgroundWrapper>
    <template #header>
      <!-- 这里可以直接写登录页面的导航栏，或者引入一个LoginNavbar.vue组件 -->
      <el-menu class="el-menu-demo" mode="horizontal" @select="handleMenuSelect">
        <el-menu-item index="1">首页</el-menu-item>
        <el-menu-item index="2">登录</el-menu-item>
      </el-menu>
    </template>
    <RegisterForm/>
  </BackgroundWrapper>
</template>

<script>
import BackgroundWrapper from '../components/LoginBackground.vue';
import RegisterForm from '../components/RegisterForm.vue';

export default {
  name: "RegisterPage",
  components: {
    BackgroundWrapper,
    RegisterForm
  },
  methods: {
    handleMenuSelect(index) {
      switch (index) {
        case '1':
          this.$router.push({name: 'EditorPage'});
          break;
        case '2':
          this.$router.push({name: 'Login'});
          break;
      }
    }
  }
}
</script>