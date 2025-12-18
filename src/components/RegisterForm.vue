<template>
  <div class="login_container">
    <div class="login_box">
      <el-form class="login_form" label-width="0px" :model="newUser">
        <el-form-item prop="uname">
          <el-input v-model="newUser.uname" @input="validateUsername" prefix-icon="el-icon-user-solid"
                    placeholder="用户名"></el-input>
          <span v-if="usernameError" class="error-message">{{ usernameError }}</span>
        </el-form-item>
        <el-form-item prop="psw">
          <el-input v-model="newUser.psw" @input="validatePassword" type="password" prefix-icon="el-icon-lock"
                    placeholder="密码"></el-input>
          <span v-if="passwordError" class="error-message">{{ passwordError }}</span>
        </el-form-item>
        <el-form-item prop="pswConfirm">
          <el-input v-model="pswConfirm" @input="validateConfirmPassword" type="password" prefix-icon="el-icon-lock"
                    placeholder="确认密码"></el-input>
          <span v-if="confirmPasswordError" class="error-message">{{ confirmPasswordError }}</span>
        </el-form-item>
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
      newUser: {
        uname: '',
        psw: '',
      },
      pswConfirm: '',
      usernameError: '',
      passwordError: '',
      confirmPasswordError: '',
    };
  },
  methods: {
    validateUsername() {
      if (!this.newUser.uname) {
        this.usernameError = '用户名不能为空';
      } else {
        this.usernameError = '';
      }
    },
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
    validateConfirmPassword() {
      if (this.pswConfirm !== this.newUser.psw) {
        this.confirmPasswordError = '两次输入的密码不一致';
      } else {
        this.confirmPasswordError = '';
      }
    },
    register() {
      // 清除之前的错误消息（虽然理论上在点击注册前应该没有错误消息）
      this.usernameError = '';
      this.passwordError = '';
      this.confirmPasswordError = '';

      // 在这里处理注册逻辑，比如发送请求到后端
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