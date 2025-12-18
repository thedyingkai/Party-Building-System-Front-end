<template>
  <div>
    <div class="head">
      <div class="box">
<h1>
  <img src="../assets/img/校徽2.png" class="img_title">
</h1>
        <!--        <h1>-->
        <!--          <img src="../assets/img/p11.png" class="img_title">-->
        <!--          <span>电科院</span>-->
        <!--        </h1>-->
      </div>
      <div class="box">
        <nav class="nav_link">
          <!--          <img src="../assets/img/p11.png" class="img_btn">-->
          <el-icon class="el-icon-user-solid" style="font-size: 30px;color: #f0f0f0"></el-icon>
          <router-link :to="{path:link}" active-class="active" class="link_btn">{{ name }}</router-link>
        </nav>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "NavBar",
  data() {
    return {
      user: JSON.parse(localStorage.getItem("current-user") || '{}'),
      link: '/login',
      name: '登录',
    }
  },
  created() {
    this.getName();
  },
  methods: {

    getName() {
      console.log(Object.keys(this.user).length);
      if (Object.keys(this.user).length == 0) {
        this.link = '/login'
        this.name = '登录'
      } else {
        this.link = '/home'
        this.name = '个人中心'
      }
    }
  },
}
</script>

<style scoped>
.head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 70px;
  background: url(../assets/img/j2.jpg) center no-repeat;
  -o-background-size: cover;
  background-size: cover
}

.box {
  display: flex;
  align-items: center;
}

h1 {
  display: flex;
  align-items: center;
  font: normal 30px Cookie;
  padding: 0px 20px;
  color: #2c2c2c;
  font-family: "Microsoft YaHei";
}

.img_title {
  width: 280px;
  height: 70px;
}

.nav_link {
  display: flex;
  align-items: center;
  padding: 0 30px;
}

.link_btn {
  text-decoration: none;
  color: #ffffff;
  font-size: 25px;
  font-weight: normal;
}

.img_btn {
  width: 30px;
  height: 30px;
}
</style>

