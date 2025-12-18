<template>
  <body class="idx">
  <div class="headerUe">
    <div class="wp">
      <span class="menuBtn"></span>
      <a class="logo" href="index.htm"><img
          :src=" require('../assets/img/logo.png')" alt=""/></a>
      <ul class="nav">
        <li>
          <a class="v1" href="index.htm">首页</a>

        </li>
        <li>
          <a class="v1" href="djyw.htm">主题专栏</a>
          <div class="dropIcon"></div>
          <div class="sub">
            <a class="v2" href="qhdzzjl95zn/qhds.htm">党的政策</a>
            <a class="v2" href="qhdzzjl95zn/sdxf.htm">热点事件</a>
          </div>

        </li>
        <li>
          <a class="v1" href="tzgg.htm">理论专栏</a>
          <div class="dropIcon"></div>
          <div class="sub">
            <a class="v2" href="qhdzzjl95zn/qhds.htm">马克思理论</a>
            <a class="v2" href="qhdzzjl95zn/sdxf.htm">JYMM</a>
            <a class="v2" href="qhdzzjl95zn/qhwh.htm">在线测试</a>
          </div>
        </li>
        <li>
          <a class="v1" href="hdkx.htm">党章党规</a>
          <div class="dropIcon"></div>
          <div class="sub">
            <a class="v2" href="qhdzzjl95zn/qhds.htm">党内法规</a>
            <a class="v2" href="qhdzzjl95zn/sdxf.htm">规范性文件</a>

          </div>
        </li>
        <li>
          <a class="v1" href="wwqzbss.htm">支部学习</a>
          <div class="dropIcon"></div>
          <div class="sub">
            <a class="v2" href="qhdzzjl95zn/qhds.htm">精品党课</a>
            <a class="v2" href="qhdzzjl95zn/sdxf.htm">所有课程</a>
            <a class="v2" href="qhdzzjl95zn/qhwh.htm">我的学习</a>
          </div>
        </li>
        <li>
          <a class="v1" href="qhdzzjl95zn/qhds.htm">党建活动</a>

          <div class="dropIcon"></div>
          <div class="sub">
            <a class="v2" href="qhdzzjl95zn/qhds.htm">活动通知</a>
            <a class="v2" href="qhdzzjl95zn/sdxf.htm">活动记录</a>
            <a class="v2" href="qhdzzjl95zn/qhwh.htm">创建活动</a>
          </div>
        </li>
        <li>
          <a class="v1" href="llwc.htm">团队建设</a>
          <div class="dropIcon"></div>
          <div class="sub">
            <a class="v2" href="qhdzzjl95zn/qhds.htm">团队风采</a>
          </div>
        </li>
        <li>
          <a class="v1" href="dszl/jdzz.htm">教育模块</a>

          <div class="dropIcon"></div>
          <div class="sub">
            <a class="v2" href="dszl/jdzz.htm">科研成果</a>
            <a class="v2" href="dszl/dsjt.htm">审核评估</a>
            <a class="v2" href="dszl/byll.htm">外校经验</a>
          </div>
        </li>
        <li>
          <a class="v1" href="hsyx.htm">红色影像</a>
        </li>
        <li>
          <a class="v1" href="dyzs.htm">党员之声</a>

        </li>
        <li>
          <a class="v1" href="gywm.htm">关于我们</a>

        </li>
        <li>
          <a class="v1" href="lxwm.htm">联系我们</a>

        </li>
      </ul>
    </div>
  </div>
  <div>
    <NavBar></NavBar>
  </div>
  <div class="m-jpg">
    <img :src=" require('../assets/img/dj100logoxx.jpeg')" alt="图片加载失败"></div>
  <div class="header">
    <div class="headerbox">
      <div class="wp">
        <div class="menu-button">
          <router-link :to="{name: 'home'}"
                       style="font-size: 18px;  line-height: 55px;  font-weight: 700;  color: #fff;">首页
          </router-link>
        </div>
        <NavMenu :menuItems="menuData"/>
      </div>
    </div>
  </div>
  <div class="main">
    <router-view></router-view>
  </div>
  <div class="footer">
    <div class="wp">


      <a class="f-logo" href="index.htm"><img
          :src=" require('../assets/img/f-logo.png')" alt=""></a>


      <div class="box">
        <div class="f-links">
          <a href="https://www.tsinghua.edu.cn/index.htm">学校主页 | </a>
          <a href="https://www.tsinghua.edu.cn/zjqh/xyfg/xydt1.htm">学校地图 | </a>
          <a href="https://www.redweb.tsinghua.edu.cn/">电科院大学红色网站</a>

        </div>
        <!-- 版权内容请在本组件"内容配置-版权"处填写 -->
        <div class="f-info">电科院大学党委宣传部版权所有，电科院大学党委宣传部维护，电子信箱：dsxxjyb@tsinghua.edu.cn</div>
        <div class="f-copy">Copyright 2021 电科院大学 All rights reserved.</div>
      </div>
    </div>
  </div>

  </body>
</template>

<script>
import NavMenu from "@/components/NavMenu";
import NavBar from "@/components/NavBar.vue";

export default {
  name: "HomeView",
  components: {
    NavBar,
    NavMenu
  },
  data() {
    return {
      menuData: [],
    };
  },
  created() {
    this.getColumn();
  },
  methods: {
    getColumn() {
      this.$request.get('/column/selectAllToShow').then(
          res => {
            if (res.code === '200') {
              this.menuData = res.data;
              console.log(this.menuData)
            }
          }
      ).catch((error) => {
        console.error('数据加载出现错误:', error);
      });
    }
  },

}
</script>

<style scoped>
@import "../assets/css/style.css";
@import "../assets/css/index.vsb.css";
@import "../assets/css/slick.css";

.ul-listb2 li {
  width: 50%;
}

.dzqhlink:hover span {
  color: #f1d677;
}

@media screen and (max-width: 767px) {
  .g-titb2 img {
    margin-left: -45%;
    max-width: 198%;
  }
}

.wp {
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  height: 80px;
}

</style>
<style>
.menu-button {
  width: 160px;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  line-height: 55px;
  font-weight: 700;
  color: #fff;
}
</style>