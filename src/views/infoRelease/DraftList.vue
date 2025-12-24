<!--
/**
 * @component DraftList
 * @description 草稿箱页面 - 展示用户的草稿列表,支持编辑、删除和搜索
 * @author Party Building System
 */
-->
<template>
  <!-- 草稿列表容器 -->
  <div style="display: flex; flex-direction: column; flex-grow: 1;padding: 1vh">
    <el-table :data="returntable.filter(data =>!search || (data.title?.toLowerCase()?.includes(search.toLowerCase()))
                                                       || (data.content?.toLowerCase()?.includes(search.toLowerCase())))"
              stripe :row-style="{ height: '100px' }" :cell-style="{ padding: '0px' }" v-loading="loading">
      <el-table-column prop="title" label="标题" width="120">
      </el-table-column>
      <el-table-column prop="content" label="内容" width="300">
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
      <el-table-column prop="save_time" label="保存时间" width="100">
      </el-table-column>

      <el-table-column
          align="right">
        <template slot="header" slot-scope="scope">
          <div style="display: flex;">
            <el-button
                size="mini"
                @click="$router.push('/EditorPage')"
                type="primary"
                style="margin-left: -10px;"
            >新建草稿
            </el-button>
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
              size="large"
              @click="handleEdit(scope.$index, scope.row)">编辑
          </el-button>
          <el-button
              size="large"
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
      dialogVisible_add: false,
      dialogTitle: '',
    };
  },
  mounted() {
    this.fetchData();
    console.log(this.user);
  },
  methods: {
    /**
     * 打开新增活动对话框
     */
    addActivity() {
      this.dialogTitle = '新增活动';
      this.dialogVisible_add = true;
    },
    /**
     * 移除HTML标签
     * 将HTML内容转换为纯文本
     * @param {string} html - HTML内容
     * @returns {string} 纯文本内容
     */
    stripHtmlTags(html) {
      let tmp = document.createElement("DIV");
      tmp.innerHTML = html;
      return tmp.textContent || tmp.innerText;
    },
    /**
     * 编辑草稿
     * 跳转到草稿编辑页面
     * @param {number} index - 表格索引
     * @param {Object} row - 草稿数据对象
     */
    handleEdit(index, row) {
      this.$router.push({
        name: '草稿编辑',
        params: {
          id: row.id,
          coid: row.coid,
          source: row.source,
          title: row.title,
          content: row.content,
        }
      });
    },
    /**
     * 删除草稿
     * @param {number} index - 表格索引
     * @param {Object} row - 草稿数据对象
     */
    handleDelete(index, row) {
      let id=row.id;
      this.$request.delete('/draft/delete/'+id).then(
          res => {
            if (res.code === '200') {
              this.fetchData();
            }
          }
      )
    },
    /**
     * 获取HTML中的第一张图片
     * @param {string} htmlContent - HTML内容
     * @returns {string|null} 图片URL或null
     */
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
    /**
     * 计算图片等比例缩放后的宽度
     * @param {string} htmlContent - HTML内容
     * @returns {Promise<string>|string} 图片宽度或'0px'
     */
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
    /**
     * 处理每页条数变化
     * @param {number} newSize - 新的每页条数
     */
    handleSizeChange(newSize) {
      this.pageSize = newSize;
      this.fetchData();
    },
    /**
     * 处理当前页码变化
     * @param {number} newPage - 新的页码
     */
    handleCurrentChange(newPage) {
      this.currentPage = newPage;
      this.fetchData();
    },
    /**
     * 加载草稿列表数据
     */
    fetchData() {
      this.loading = true; // 先将loading设置为true，表示正在加载数据
      let uid = this.user.uid;
      this.$request.get('/draft/selectLocalByUid/' + uid).then(
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
    },
    hasPermission() {
      return (index) => {
        return this.user.permissions && typeof this.user.permissions === 'string' && this.user.permissions[index] === '1';
      };
    },
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