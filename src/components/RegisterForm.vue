<!--
  用户注册表单组件
  
  @component RegisterForm
  @description 用户注册表单，包含用户名、密码输入和表单验证，注册成功后自动登录
  @author 党建系统开发团队
-->
<template>
  <div class="login_container">
    <div class="login_box">
      <!-- 注册表单 -->
      <el-form class="login_form" label-width="0px" :model="newUser">
        <!-- 用户名输入框 -->
        <el-form-item prop="uname">
          <el-input v-model="newUser.uname" @input="validateUsername" prefix-icon="el-icon-user-solid"
                    placeholder="用户名"></el-input>
          <span v-if="usernameError" class="error-message">{{ usernameError }}</span>
        </el-form-item>
        <!-- 密码输入框 -->
        <el-form-item prop="psw">
          <el-input v-model="newUser.psw" @input="validatePassword" type="password" prefix-icon="el-icon-lock"
                    placeholder="密码"></el-input>
          <span v-if="passwordError" class="error-message">{{ passwordError }}</span>
        </el-form-item>
        <!-- 确认密码输入框 -->
        <el-form-item prop="pswConfirm">
          <el-input v-model="pswConfirm" @input="validateConfirmPassword" type="password" prefix-icon="el-icon-lock"
                    placeholder="确认密码"></el-input>
          <span v-if="confirmPasswordError" class="error-message">{{ confirmPasswordError }}</span>
        </el-form-item>
        <!-- 注册按钮 -->
        <el-form-item class="button-container">
          <el-button type="primary" @click="register">注册并登录</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import request from "@/utils/request";

export default {
  name: 'RegisterForm',
  data() {
    return {
      // 新用户信息
      newUser: {
        uname: '',  // 用户名
        psw: '',    // 密码
      },
      pswConfirm: '',          // 确认密码
      usernameError: '',       // 用户名错误提示
      passwordError: '',       // 密码错误提示
      confirmPasswordError: '', // 确认密码错误提示
    };
  },
  methods: {
    /**
     * 验证用户名
     * 检查用户名是否为空
     */
    validateUsername() {
      if (!this.newUser.uname) {
        this.usernameError = '用户名不能为空';
      } else {
        this.usernameError = '';
      }
    },
    
    /**
     * 验证密码强度
     * 要求：包含大小写字母和数字，长度不少于8位
     */
    validatePassword() {
      const psw = this.newUser.psw;
      if (!psw) {
        this.passwordError = '密码不能为空';
      } else if (!/[A-Z]/.test(psw) || !/[a-z]/.test(psw) || !/[0-9]/.test(psw) || psw.length < 8) {
        this.passwordError = '密码强度不足，请包含大小写字母和数字，且长度不少于8位';
      } else {
        this.passwordError = '';
      }
    },
    
    /**
     * 验证确认密码
     * 检查两次输入的密码是否一致
     */
    validateConfirmPassword() {
      if (this.pswConfirm !== this.newUser.psw) {
        this.confirmPasswordError = '两次输入的密码不一致';
      } else {
        this.confirmPasswordError = '';
      }
    },
    
    /**
     * 注册方法
     * 提交注册信息，成功后自动登录并跳转到个人中心
     */
    register() {
      // 清除之前的错误消息
      this.usernameError = '';
      this.passwordError = '';
      this.confirmPasswordError = '';

      // 发送注册请求
      request.post('/register', this.newUser).then(res => {
        console.log('注册信息:', res);
        // 成功注册后，将用户相关信息存储到会话存储中
        if (res.code === '200') {
          request.post('/login', this.newUser).then(
              res => {
                if (res.code === '200') {
                  localStorage.setItem("current-user", JSON.stringify(res.data))
                  this.$router.push('/home')
                  this.$message.success('登录成功')
                } else {
                  this.$message.error(res.msg)
                }
              }
          )
        } else {
          this.$message.error(res.msg)
        }
      }).catch(error => {
        console.error('发生错误：', error);
        this.errorMessage = '注册失败，请稍后重试';  // 可以在这里设置更具体的错误消息
      });
    }
  }
}
</script>

<style scoped>
.error-message {
  color: red;
  margin-top: 10px;
}
</style>