<!--
  文章列表展示页面
  
  @component ArticleShow
  @description 按栏目展示文章列表，支持分页和面包屑导航
  @author 党建系统开发团队
-->
<template>
  <div style="display: flex">
    <el-container class="background-container">
      <!-- 顶部面包屑导航 -->
      <el-header>
        <div style="flex-grow: 1;margin-top: 20px;margin-left:10vw;">
        <el-breadcrumb separator-class="el-icon-arrow-right" style="font-size: 18px">
          <el-breadcrumb-item>栏目</el-breadcrumb-item>
          <el-breadcrumb-item v-for="column in columnlist" :key="column.id">
            {{ column.name }}
          </el-breadcrumb-item>
        </el-breadcrumb>
        </div>
      </el-header>
      <!-- 主内容区 -->
      <el-main class="background-container">
        <div style="flex-grow: 1">
          <!-- 文章列表 -->
          <ArticleList style="width:80%;margin: auto" :articles="articles" :page-size="pageSize"
                       :current-page="currentPage"></ArticleList>
        </div>
        <!-- 分页组件 -->
        <div class="block">
          <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page.sync="currentPage"
              :page-size="10"
              layout="prev, pager, next"
              :total="total">
          </el-pagination>
        </div>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import ArticleList from "@/components/ArticleList.vue";

export default {
  components: {
    ArticleList
  },
  data() {
    return {
      // 当前页码
      currentPage: 1,
      // 总数据量
      total: 0,
      // 文章列表数组
      articles: [],
      // 当前栏目信息
      column:[],
      // 栏目面包屑导航列表
      columnlist:[],
      // 每页显示的文章数量
      pageSize: 10,
      // 页面标题
      title: 'Latest',
      // 数据加载状态
      loading: false,
      // 当前栏目ID
      coid:1,
      // 父栏目ID
      fatherid:1,
    };
  },
  /**
   * 组件挂载后加载文章数据
   */
  mounted() {
    this.fetchData();
  },
  /**
   * 组件创建时初始化栏目ID
   */
  created() {
    this.fatherid = this.$route.params.id;
    this.coid = this.$route.params.id;
    this.getColumnList();
  },
  watch: {
    /**
     * 监听路由参数变化
     * 当栏目ID改变时重新加载数据
     * @param {Number} newId - 新的栏目ID
     */
    '$route.params.id'(newId) {
      // 当 $route.params.id 发生变化时，更新 fatherid 和 coid，并重新获取数据
      this.fatherid = newId;
      this.coid = newId;
      this.getColumnList();
      this.fetchData();
    }
  },
  methods: {
    /**
     * 返回上一页
     */
    goBack() {
      this.$router.go(-1);
    },
    /**
     * 获取栏目层级列表
     * 用于生成面包屑导航
     */
    getColumnList(){
      this.loading = true; // 先将 loading 设置为 true，表示正在加载数据
      this.$request.get('/column/getlist/' + this.coid).then(
          res => {
            if (res.code === '200') {
              this.columnlist = res.data.reverse();
              console.log('1');
              console.log(this.columnlist);
              this.loading = false; // 在数据获取成功后，将 loading 设置为 false，表示加载完成
            }
          }
      ).catch((error) => {
        console.error('数据加载出现错误:', error);
        this.loading = false; // 如果请求出现错误，同样将 loading 设置为 false，避免一直处于加载状态
      });
    },
    /**
     * 获取栏目名称列表
     * 根据父栏目ID获取子栏目信息
     */
    getColumnNames() {
      this.loading = true; // 先将 loading 设置为 true，表示正在加载数据
      this.$request.get('/column/selectByFather/' + this.fatherid).then(
          res => {
            if (res.code === '200') {
              this.column = res.data;
              this.loading = false; // 在数据获取成功后，将 loading 设置为 false，表示加载完成
            }
          }
      ).catch((error) => {
        console.error('数据加载出现错误:', error);
        this.loading = false; // 如果请求出现错误，同样将 loading 设置为 false，避免一直处于加载状态
      });
    },
    /**
     * 处理栏目切换按钮点击
     * @param {Number} id - 栏目ID
     */
    handleButtonClick(id) {
      this.coid = id;
      this.fetchData();
    },
    /**
     * 处理每页显示数量变化
     * @param {Number} newSize - 新的每页显示数量
     */
    handleSizeChange(newSize) {
      this.pageSize = newSize;
      this.fetchData();
    },
    /**
     * 处理页码变化
     * @param {Number} newPage - 新的页码
     */
    handleCurrentChange(newPage) {
      this.currentPage = newPage;
      this.fetchData();
    },
    /**
     * 获取文章列表数据
     * 根据栏目ID从后端获取该栏目下的所有文章
     */
    fetchData() {
      this.loading = true; // 先将 loading 设置为 true，表示正在加载数据
      let coid = this.coid;
      console.log(coid);
      this.$request.get('/article/selectArticleBycoid/' + coid).then(
          res => {
            if (res.code === '200') {
              this.articles = res.data;
              this.loading = false; // 在数据获取成功后，将 loading 设置为 false，表示加载完成
              this.total = this.articles.length;
            }
          }
      ).catch((error) => {
        console.error('数据加载出现错误:', error);
        this.loading = false; // 如果请求出现错误，同样将 loading 设置为 false，避免一直处于加载状态
      });
    }
  }
};
</script>

<style scoped>
.el-main {
  background-color: #E9EEF3;
  color: #333;
  text-align: center;
  line-height: 30px;
  font-size: 20px;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
}

.background-container {
  background-image: url('@/assets/img/background/background1.jpg');
  background-size: cover;
  background-position: center;
  min-height: 100vh; /* 确保至少覆盖整个视口高度 */
}
</style>