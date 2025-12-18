<template>
  <div>
    <el-table
        :data="returnArticles" :show-header="false" :class="tableType"
        style="width:100%;" :cell-style="{ textAlign: 'left'}"
        :row-style="{ height: '20px' }">
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
          <router-link :to="getArticleUrl(scope.row)">
            <span class="text-overflow-box"> {{ scope.row.title }}</span>
          </router-link>
        </template>
      </el-table-column>
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
    articles: {type: Array, required: true},
    pageSize: {type: Number, default: 5},
    title: {type: String, required: false},
    currentPage: {type: Number, default: 1, required: true},
    columnClass1: {type: String, required: false},
    columnClass2: {type: String, required: false},
    showDate: {type: Boolean, default: true, required: true,},
    tableType: {type: String, required: true},
  },
  methods: {
    getArticleUrl(article) {
      // 假设每个文章都有一个唯一的ID，可以用于构建URL
      return `/article/${article.id}`;
    }
  },
  computed: {
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