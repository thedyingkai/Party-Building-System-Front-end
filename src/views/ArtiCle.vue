<!--
  文章详情页面
  
  @component ArtiCle
  @description 展示文章详细内容和评论区域
  @author 党建系统开发团队
-->
<template>
<el-container>
  <!-- 顶部导航栏 -->
  <el-header class="background-head">
    <el-menu  mode="horizontal" class="background-head">
      <el-menu-item @click="goBack" style="font-size: 20px;color:#ffd700">返回</el-menu-item>
    </el-menu>
  </el-header>
  
  <!-- 主内容区域 -->
  <el-main class="background-main">
    <!-- 文章标题 -->
    <el-col :span="20" :offset="2">
      <el-card class="markdown-body">
        <h1 style="text-align: center;justify-content: center;font-size: 40px">{{ article.title }}</h1>
      </el-card>
    </el-col>
    
    <!-- 文章内容 -->
    <el-col :span="20" :offset="2" style="margin-bottom: 10px">
      <el-card class="markdown-body" style="padding: 20px" v-html="article.content">
      </el-card>
    </el-col>
    
    <!-- 评论区域 -->
    <el-col :span="20" :offset="2" >
      <ComMents :articleid="this.id" @comments-loaded="scrollToHash" id="test" v-if="commentshow"></ComMents>
    </el-col>

  </el-main>
  </el-container>


</template>
<script>
import ComMents from "@/components/CommentList.vue";


export default {
  name: "ArtiCle",
  components: {
    ComMents  // 评论列表组件
  },
  computed: {

  },
  data() {
    return {
      // 文章ID
      id: 1,
      // 文章数据对象，包含标题、内容等信息
      article: [],
      // 是否显示评论区域
      commentshow: false
    };
  },
  /**
   * 组件创建时获取文章数据
   * 从路由参数中提取文章ID并加载文章内容
   */
  created() {
    // 获取路由传递的文章ID参数
    const id = this.$route.params.id;
    this.id = Number(id);
    // 获取文章详情
    this.getArticle();
    console.log(this.user);
  },
  watch: {
    /**
     * 监听路由变化，处理页面锚点滚动
     */
    '$route'(to) {
      if (to.hash) {
        // 等待组件更新后执行滚动
        this.$nextTick(() => {
          this.scrollToHash();
        });
      }
    }
  },
  methods: {
    /**
     * 滚动到页面锚点位置
     * 根据URL的hash值滚动到对应的DOM元素
     */
    scrollToHash() {
      const hash = this.$route.hash;
      if (hash) {
        // 处理 ID 以数字开头的非法情况
        const selector = hash.startsWith('#') ? `[id="${hash.slice(1)}"]` : hash;
        const selector2="#test";
        const element = document.querySelector(selector2);
        console.log(selector);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }
    },
    /**
     * 返回上一页
     */
    goBack() {
      this.$router.go(-1);
    },
    /**
     * 获取文章详细信息
     * 根据文章ID从后端获取文章内容并渲染
     */
    getArticle() {
      this.loading = true; // 先将loading设置为true，表示正在加载数据
      let id = this.id;
      this.$request.get('/article/selectArticleByid/' + id).then(
          res => {
            if (res.code === '200') {
              this.article = res.data;
              this.loading = false; // 在数据获取成功后，将loading设置为false，表示加载完成
              this.$nextTick(() => {
                this.scrollToHash();
              });
            }
          }
      ).catch((error) => {
        console.error('数据加载出现错误:', error);
        this.loading = false; // 如果请求出现错误，同样将loading设置为false，避免一直处于加载状态
      });
    },
  }

};
</script>

<style scoped>
.background-main {
  background-image: url('@/assets/img/background/background1.jpg');
  background-size: cover;
  background-position: center;
  min-height: 100vh; /* 确保至少覆盖整个视口高度 */
}

.background-head {
  background: #bf3020;
}

.el-card {
  margin-top: 15px;
}

.item-box {
  position: relative;
  width: 100%;
  height: 100%;
}

.carimg {
  width: 100%;
  height: 100%;
  overflow: hidden;
  object-fit: cover;
}

.desc-box {
  position: absolute;
  bottom: 0;
  left: 50%;
  top: 50%;
  width: 500px;
  height: 40px;
  margin-left: -250px;
  margin-top: -20px;
  text-align: center;
}


.article-info {
  margin-top: 10px;
  color: #909399;
  font-size: 13px;
}

.article-icon,
.article-icon .tag {
  color: #bf3020;
  font-size: 13px;
  margin-right: 10px;
  text-decoration: none;
}

.article-icon .tag:hover {
  color: #409eff;
  cursor: pointer;
}

.tabloid {
  color: #606266;
  font-size: 14px;
  margin-bottom: 10px;
}

.title {
  text-align: center;
  font-size: 32px;
  color: #ba2c22;
  justify-content: center
}
</style>
