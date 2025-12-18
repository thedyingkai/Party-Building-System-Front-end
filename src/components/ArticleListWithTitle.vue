<template>
  <div class="oh pt7" style="padding-top:0;">
    <div class="yw-tit" v-if="this.columnList && this.columnList.length > 0">
      <ul>
        <li v-for="(column, index) in columnList" :key="column.id" :class="index === 0? 'on' : ''"
            @click="changeCoid(column.id)">
          <span>{{ column.name }}</span>
        </li>
      </ul>
    </div>
    <div class="yw-cont">
      <ArticleList style="margin: auto" :articles="articles" :page-size="pageSize"
                   :current-page="currentPage" :column-class1="columnClass1"
                   :column-class2="columnClass2" :show-date="showDate" :table-type="tableType"></ArticleList>
    </div>
    <router-link v-if="bottomButton" :to="{ name: 'ArticleShow', params: { id:coid } }" class="gengduo">更多</router-link>
  </div>
</template>

<script>
import ArticleList from "@/components/ArticleList";

export default {
  name: "ArticleListWithTitle",
  components: {ArticleList},
  props: {
    fatherId: {type: Number, required: false},
    columnList: {type: Array, required: false},
    coid: {type: Number, required: false},
    showDate: {type: Boolean, default: true, required: false},
    pageSize: {type: Number, default: 7, required: false},
    bottomButton: {type: Boolean, default: false, required: false},
    tableType: {type:String, default: 'default-table',required:false}
  },
  data() {
    return {
      currentPage: 1, // 当前页码
      total: 0, // 总数据量
      articles: [],
      title: 'Latest',
      loading: false,
      columnClass1: 'con',
      columnClass2: 'date',
    };
  },
  mounted() {
    if (this.columnList && this.columnList.length > 0) {
      this.fetchData(this.columnList[0].id);
    } else {
      this.fetchData(this.coid);
    }
  },
  methods: {
    goBack() {
      this.$router.go(-1);
    },
    handleButtonClick(id) {
      this.fetchData(id);
    },
    handleCurrentChange(newPage) {
      this.currentPage = newPage;
      this.fetchData();
    },
    fetchData(coid) {
      this.loading = true; // 先将loading设置为true，表示正在加载数据
      this.$request.get('/article/selectArticleBycoid/' + coid).then(
          res => {
            if (res.code === '200') {
              this.articles = res.data;
              this.loading = false; // 在数据获取成功后，将loading设置为false，表示加载完成
              this.total = this.articles.length;
            }
          }
      ).catch((error) => {
        console.error('数据加载出现错误:', error);
        this.loading = false; // 如果请求出现错误，同样将loading设置为false，避免一直处于加载状态
      });
    },
    changeCoid(newCoid) {
      this.fetchData(newCoid);
    },
  }
}
</script>

<style scoped>
@import "../assets/css/style.css";
@import "../assets/css/index.vsb.css";
@import "../assets/css/slick.css";

</style>
<style>
.text-overflow-box {
  font-size: 16px !important;
}
</style>