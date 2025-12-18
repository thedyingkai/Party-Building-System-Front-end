<template>
  <div style="display: flex; flex-direction: column; flex-grow: 1;padding: 1vh">
    <el-table :data="returntable.filter(data =>!search || (data.title?.toLowerCase()?.includes(search.toLowerCase()))
                                                       || (data.content?.toLowerCase()?.includes(search.toLowerCase())))"
              stripe :row-style="{ height: '100px' }" :cell-style="{ padding: '0px' }" v-loading="loading">
      <el-table-column prop="title" label="所属文章" width="140">
      </el-table-column>
      <el-table-column prop="content" label="评论内容" width="500">
        <template slot-scope="scope">
          <span class="ellipsis-text" v-if="scope.row.content">{{ stripHtmlTags(scope.row.content) }}</span>
        </template>
      </el-table-column>
      <!-- 新增的图片列 -->
      <el-table-column width="200">
        <template slot-scope="scope">
          <img v-if="getFirstImage(scope.row.content)" :src="getFirstImage(scope.row.content)"
               :style="{ width: getImageWidth(scope.row.content), height: '100px' }"/>
        </template>
      </el-table-column>
      <el-table-column prop="send_time" label="评论时间" width="200">
      </el-table-column>
      <el-table-column
          prop="status"
          label="状态"
          width="110"
          :filters="[{ text: '待审核', value: '1' }, { text: '通过', value: '2' }, { text: '未通过', value: '3' }]"
          :filter-method="filterTag"
          filter-placement="bottom-start">
        <template slot-scope="scope">
          <el-tag
              :type="scope.row.status === 1? 'primary' : (scope.row.status === 2? 'success' : (scope.row.status === 3? 'danger' : 'info'))"
              disable-transitions>{{ formatStatus(scope.row, null, scope.row.status) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
          align="right">
        <template slot="header" slot-scope="scope">
          <div style="display: flex;justify-content: space-between;">
            <el-input
                v-model="search"
                size="mini"
                placeholder="输入关键字搜索"
                style="max-width: 200px;"
                @input="handleInput(scope)"
            />
          </div>
        </template>
        <template slot-scope="scope">
          <el-button
              size="medium"
              type="danger"
              @click="handleDelete(scope.$index, scope.row)">删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="currentPage"
        :page-size="5"
        layout="prev, pager, next"
        :total="total"
        style="text-align: center">
    </el-pagination>


  </div>
</template>

<script>
export default {
  name: "DraftList",
  data() {
    return {
      user: JSON.parse(localStorage.getItem("current-user") || '{}'),
      tableData: [],
      search: '',
      loading: true,
      currentPage: 1, // 当前页码
      total: 0, // 总数据量
      articles: [],
      pageSize: 5,
      title: '',
    };
  },
  mounted() {
    this.fetchData();
  },
  methods: {
    formatStatus(row, column, cellValue) {
      switch (cellValue) {
        case 0:
          return '未审核';
        case 1:
          return '待审核';
        case 2:
          return '审核通过';
        case 3:
          return '审核未通过';
        case 4:
          return '审核中';
        default:
          return '未知状态';
      }
    },
    stripHtmlTags(html) {
      let tmp = document.createElement("DIV");
      tmp.innerHTML = html;
      return tmp.textContent || tmp.innerText;
    },
    handleEdit(index, row) {
      this.$router.push({
        name: '评论列表',
        params: {
          id: row.id,
          coid: row.coid,
          source: row.source,
          title: row.title,
          content: row.content
        }
      });
    },
    handleDelete(index, row) {
      console.log(index, row);
      let id=row.id;
      this.$request.post('/comment/delete/',id).then(
          res => {
            if (res.code === '200') {
              this.fetchData();
            }
          }
      )
    },
    getFirstImage(htmlContent) {
      if (htmlContent) {
        let tmp = document.createElement("DIV");
        tmp.innerHTML = htmlContent;
        let images = tmp.getElementsByTagName('img');
        if (images.length > 0) {
          return images[0].src;
        }
      }
      return null;
    },
    // 新增的计算图片等比例缩放后宽度的计算属性
    getImageWidth(htmlContent) {
      const img = this.getFirstImage(htmlContent);
      if (img) {
        return new Promise((resolve, reject) => {
          const imgElement = new Image();
          imgElement.onload = function () {
            const ratio = imgElement.width / imgElement.height;
            resolve(`${100 * ratio}px`);
          };
          imgElement.onerror = function () {
            reject(new Error('图片加载失败'));
          };
          imgElement.src = img;
        });
      }
      return '0px';
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
      this.loading = true; // 先将loading设置为true，表示正在加载数据
      let uid = this.user.uid;
      this.$request.get('/comment/selectbyuid/' + uid).then(
          res => {
            if (res.code === '200') {
              this.tableData = res.data;
              this.total = this.tableData.length;
              this.loading = false; // 在数据获取成功后，将loading设置为false，表示加载完成
            }
          }
      ).catch((error) => {
        console.error('数据加载出现错误:', error);
        this.loading = false; // 如果请求出现错误，同样将loading设置为false，避免一直处于加载状态
      });

    }
  },
  computed: {
    returntable() {
      return this.tableData.slice(this.pageSize * (this.currentPage - 1), this.pageSize * this.currentPage);
    }
  }
};
</script>

<style lang="scss">
.el-date-table td, .el-table .cell, .el-table-filter {
  max-height: 95px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

</style>