<!--
  文章列表组件
  
  @component ArticleList
  @description 展示文章列表，支持分页显示、自定义样式和可选日期显示
  @author 党建系统开发团队
-->
<template>
  <div>
    <!-- 文章列表表格 -->
    <el-table
        :data="returnArticles" :show-header="false" :class="tableType"
        style="width:100%;" :cell-style="{ textAlign: 'left'}"
        :row-style="{ height: '20px' }">
      <!-- 文章标题列 -->
      <el-table-column
          prop="title"
          label=""
          :class="columnClass1"
          :style="{
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'
          }"
      >
        <template slot-scope="scope">
          <!-- 文章标题链接 -->
          <router-link :to="getArticleUrl(scope.row)">
            <span class="text-overflow-box"> {{ scope.row.title }}</span>
          </router-link>
        </template>
      </el-table-column>
      <!-- 发布时间列（可选显示） -->
      <el-table-column
          prop="publish_time"
          label=""
          :class="columnClass2"
          width="100"
          v-if="showDate"
      >
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  name: 'ArticleList',
  props: {
    articles: {type: Array, required: true},              // 文章数据数组
    pageSize: {type: Number, default: 5},                 // 每页显示数量
    title: {type: String, required: false},               // 列表标题（可选）
    currentPage: {type: Number, default: 1, required: true}, // 当前页码
    columnClass1: {type: String, required: false},        // 第一列样式类
    columnClass2: {type: String, required: false},        // 第二列样式类
    showDate: {type: Boolean, default: true, required: true,}, // 是否显示日期
    tableType: {type: String, required: true},            // 表格类型样式
  },
  methods: {
    /**
     * 获取文章详情页 URL
     * @param {Object} article - 文章对象
     * @returns {string} 文章详情页路径
     */
    getArticleUrl(article) {
      return `/article/${article.id}`;
    }
  },
  computed: {
    /**
     * 返回当前页的文章列表
     * @returns {Array} 当前页文章数组
     */
    returnArticles() {
      return this.articles.slice(this.pageSize * (this.currentPage - 1), this.pageSize * this.currentPage);
    }
  },
}
</script>

<style>
/* 覆盖Element UI表格背景颜色 */
.transparent-table {
  background-color: transparent !important;
  color: #FFFFFF !important; /* 设置表格文字颜色为黑色 */
}

/* 覆盖Element UI表头背景颜色 */
.transparent-table th, .transparent-table tr {
  background-color: transparent !important;
  color: #FFFFFF !important; /* 设置表格文字颜色为黑色 */
}

/* 覆盖Element UI表格行背景颜色 */
.transparent-table .el-table__row {
  background-color: transparent !important;
  color: #FFFFFF !important; /* 设置表格文字颜色为黑色 */
}

/* 覆盖Element UI表格单元格背景颜色 */
.transparent-table tr:hover > td {
  background-color: transparent !important;
  color: #ffffff !important; /* 设置表格文字颜色为黑色 */
}

.transparent-table a {
  background-color: transparent !important;
  color: #ffffff !important; /* 设置表格文字颜色为黑色 */
}

/* 如果你还想要表格的边框透明，可以覆盖边框颜色 */
.transparent-table .el-table__body, .transparent-table .el-table__header, .transparent-table .el-table__body td,
.transparent-table .el-table__header th{
  border-color: transparent !important;
}

.transparent-table::before {
  content: '';
  position: absolute;
  background-color: transparent !important;
  z-index: 1;
}
</style>