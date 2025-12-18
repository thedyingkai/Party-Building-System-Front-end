<template>
  <div style="display: flex">
    <el-container class="background-container">
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
      <el-main class="background-container">
        <div style="flex-grow: 1">
          <ArticleList style="width:80%;margin: auto" :articles="articles" :page-size="pageSize"
                       :current-page="currentPage"></ArticleList>
        </div>
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
      currentPage: 1, // 当前页码
      total: 0, // 总数据量
      articles: [],
      column:[],
      columnlist:[],
      pageSize: 10,
      title: 'Latest',
      loading: false,
      coid:1,
      fatherid:1,
    };
  },
  mounted() {
    this.fetchData();
  },
  created() {
    this.fatherid = this.$route.params.id;
    this.coid = this.$route.params.id;
    this.getColumnList();
  },
  watch: {
    '$route.params.id'(newId) {
      // 当 $route.params.id 发生变化时，更新 fatherid 和 coid，并重新获取数据
      this.fatherid = newId;
      this.coid = newId;
      this.getColumnList();
      this.fetchData();
    }
  },
  methods: {
    goBack() {
      this.$router.go(-1);
    },
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
    // 处理按钮点击的方法
    handleButtonClick(id) {
      this.coid = id;
      this.fetchData();
    },
    handleSizeChange(newSize) {
      this.pageSize = newSize;
      this.fetchData();
    },
    handleCurrentChange(newPage) {
      this.currentPage = newPage;
      this.fetchData();
    },
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