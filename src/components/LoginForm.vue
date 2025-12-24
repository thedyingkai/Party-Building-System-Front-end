<!--
  登录表单组件
  
  @component LoginForm
  @description 用户登录表单，包含用户名、密码输入和表单验证
  @author 党建系统开发团队
-->
<template>
  <div class="login_container">
    <div class="login_box">
      <!-- 登录表单 -->
      <el-form ref="loginRef" :model="user" :rules="rules" class="login_form" label-width="0px">
        <!-- 用户名输入框 -->
        <el-form-item prop="uname">
          <el-input v-model="user.uname" placeholder="用户名/手机号" prefix-icon="el-icon-user-solid"></el-input>
        </el-form-item>
        <!-- 密码输入框 -->
        <el-form-item prop="psw">
          <el-input v-model="user.psw" placeholder="密码" prefix-icon="el-icon-lock" type="password"></el-input>
        </el-form-item>
        <!-- 登录按钮 -->
        <el-form-item class="button-container">
          <el-button type="primary" @click="login">登录</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import request from "@/utils/request";

export default {
  name: "LoginForm",
  data() {
    return {
      // 用户登录信息
      user: {
        uname: '', // 用户名
        psw: '',   // 密码
      },
      // 表单验证规则
      rules: {
        uname: [
          {required: true, message: '请输入用户名', trigger: 'blur'},
        ],
        psw: [
          {required: true, message: '请输入密码', trigger: 'blur'},
        ]
      }
    };
  },
  methods: {
    /**
     * 登录方法
     * 验证表单并发送登录请求，成功后保存用户信息并跳转到个人中心
     */
    login() {
      this.$refs["loginRef"].validate((valid) => {
            if (valid) {
              // 发送登录请求
              request.post('/login', this.user).then(
                  res => {
                    if (res.code === '200') {
                      // 登录成功，处理用户数据
                      let modifiedData = {...res.data};
                      modifiedData.uid = modifiedData.id; // 重命名 id 为 uid
                      delete modifiedData.id;
                      // 保存用户信息到本地存储
                      localStorage.setItem("current-user", JSON.stringify(modifiedData));
                      // 跳转到个人中心
                      this.$router.push('/home');
                      this.$message.success('登录成功');
                    } else {
                      // 登录失败，显示错误消息
                      this.$message.error(res.msg)
                    }
                  }
              )
            }
          }
      )
    },
  },
}
;
</script>

<style scoped>
.el-button--primary {
  width: 300px;
}
</style>