<template>
  <div class="login_container">
    <div class="login_box">
      <el-form ref="loginRef" :model="user" :rules="rules" class="login_form" label-width="0px">
        <el-form-item prop="uname">
          <el-input v-model="user.uname" placeholder="用户名/手机号" prefix-icon="el-icon-user-solid"></el-input>
        </el-form-item>
        <el-form-item prop="psw">
          <el-input v-model="user.psw" placeholder="密码" prefix-icon="el-icon-lock" type="password"></el-input>
        </el-form-item>
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
      user: {
        uname: '',
        psw: '',
      },
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
    login() {
      this.$refs["loginRef"].validate((valid) => {
            if (valid) {
              request.post('/login', this.user).then(
                  res => {
                    if (res.code === '200') {
                      let modifiedData = {...res.data};
                      modifiedData.uid = modifiedData.id;
                      delete modifiedData.id;
                      localStorage.setItem("current-user", JSON.stringify(modifiedData));
                      this.$router.push('/home');
                      this.$message.success('登录成功');
                    } else {
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