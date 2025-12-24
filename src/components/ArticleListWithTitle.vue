<!--
  带标题的文章列表组件
  
  @component ArticleListWithTitle
  @description 显示文章列表，支持多栏目标签切换和底部"更多"按钮
  @author 党建系统开发团队
-->
<template>
  <div class="oh pt7" style="padding-top:0;">
    <!-- 栏目标签栏 -->
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
    /**
     * 父栏目ID
     * @type {Number}
     */
    fatherId: {type: Number, required: false},
    /**
     * 栏目列表
     * @type {Array}
     */
    columnList: {type: Array, required: false},
    /**
     * 当前栏目ID
     * @type {Number}
     */
    coid: {type: Number, required: false},
    /**
     * 是否显示日期
     * @type {Boolean}
     */
    showDate: {type: Boolean, default: true, required: false},
    /**
     * 每页显示数量
     * @type {Number}
     */
    pageSize: {type: Number, default: 7, required: false},
    /**
     * 是否显示底部"更多"按钮
     * @type {Boolean}
     */
    bottomButton: {type: Boolean, default: false, required: false},
    /**
     * 表格类型
     * @type {String}
     */
    tableType: {type:String, default: 'default-table',required:false}
  },
  data() {
    return {
      // 当前页码
      currentPage: 1,
      // 总数据量
      total: 0,
      // 文章列表数据
      articles: [],
      // 标题
      title: 'Latest',
      // 加载状态
      loading: false,
      // 栏目类名1
      columnClass1: 'con',
      // 栏目类名2
      columnClass2: 'date',
    };
  },
  /**
   * 组件挂载后加载数据
   * @description 根据栏目列表或栏目ID加载初始文章数据
   */
  mounted() {
    if (this.columnList && this.columnList.length > 0) {
      this.fetchData(this.columnList[0].id);
    } else {
      this.fetchData(this.coid);
    }
  },
  methods: {
    /**
     * 返回上一页
     * @description 通过路由返回上一个页面
     */
    goBack() {
      this.$router.go(-1);
    },
    /**
     * 处理按钮点击
     * @param {number} id - 栏目ID
     * @description 根据栏目ID获取文章列表
     */
    handleButtonClick(id) {
      this.fetchData(id);
    },
    /**
     * 处理页码变化
     * @param {number} newPage - 新的页码
     * @description 切换到指定页码并重新加载数据
     */
    handleCurrentChange(newPage) {
      this.currentPage = newPage;
      this.fetchData();
    },
    /**
     * 获取文章数据
     * @param {number} coid - 栏目ID
     * @description 从服务器获取指定栏目的文章列表
     */
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
    /**
     * 切换栏目
     * @param {number} newCoid - 新的栏目ID
     * @description 切换到指定栏目并重新加载文章列表
     */
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