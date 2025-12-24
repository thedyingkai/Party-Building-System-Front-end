<!--
/**
 * @component AuditRecord
 * @description 审核记录页面 - 展示用户审核过的所有文章记录
 * @author Party Building System
 */
-->
<template>
  <!-- 审核记录列表容器 -->
  <div style="display: flex; flex-direction: column; flex-grow: 1;padding: 1vh">
    <el-table v-loading="loading"
              :cell-style="{ padding: '0px' }" :data="returntable.filter(data =>!search || (data.title?.toLowerCase()?.includes(search.toLowerCase()))
                                                       || (data.content?.toLowerCase()?.includes(search.toLowerCase())))"
              :row-style="{ height: '100px' }" stripe>
      <el-table-column label="标题" prop="title" width="140">
      </el-table-column>
      <el-table-column label="拟稿人" prop="editor_uname" width="140">
      </el-table-column>
      <el-table-column label="内容" prop="content" width="300">
        <template slot-scope="scope">
          <span v-if="scope.row.content">{{ stripHtmlTags(scope.row.content) }}</span>
        </template>
      </el-table-column>
      <el-table-column width="200">
        <template slot-scope="scope">
          <img v-if="getFirstImage(scope.row.content)" :src="getFirstImage(scope.row.content)"
               :style="{ width: getImageWidth(scope.row.content), height: '100px' }"/>
        </template>
      </el-table-column>
      <el-table-column label="审核时间" prop="time" width="150">
      </el-table-column>
      <el-table-column
          label="状态"
          prop="status"
          width="110">
        <template slot-scope="scope">
          <el-tag
              :type="scope.row.status === 1? 'primary' : (scope.row.status === 2? 'success' : (scope.row.status === 3? 'danger' : 'info'))"
              disable-transitions>{{ returnRecordStatus(scope.row.status) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
          align="right">
        <template slot="header" slot-scope="scope">
          <div style="display: flex;justify-content: space-between;">
            <el-input
                v-model="search"
                placeholder="输入关键字搜索"
                size="mini"
                style="max-width: 200px;"
                @input="handleInput(scope)"
            />
          </div>
        </template>
        <template slot-scope="scope">
          <el-button
              size="mini"
              @click="check(scope.$index, scope.row)">查看
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog
        :visible.sync="dialogVisible"
        fullscreen=true
        title="预览"
        width="90%"
    >
      <ArticleView :draft="draft"></ArticleView>
      <span slot="footer" class="dialog-footer">
              <el-button type="primary" @click="cancel">完成</el-button>
            </span>
    </el-dialog>

    <el-pagination
        :current-page.sync="currentPage"
        :page-size="pageSize"
        :total="total"
        layout="prev, pager, next"
        style="text-align: center"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange">
    </el-pagination>
  </div>
</template>

<script>
import ArticleView from "@/components/ArticleView";
import AuditForm from "@/components/AuditForm";

export default {
  name: "AuditRecord",
  components: {AuditForm, ArticleView},
  data() {
    return {
      /** 当前登录用户信息 */
      user: JSON.parse(localStorage.getItem("current-user") || '{}'),
      /** 审核记录列表数据 */
      tableData: [],
      /** 搜索关键字 */
      search: '',
      /** 加载状态 */
      loading: true,
      /** 当前查看的草稿信息 */
      draft: {
        id: '',
        title: '',
        source: '',
        content: '',
      },
      /** 预览对话框显示状态 */
      dialogVisible: false,
      /** 当前页码 */
      currentPage: 1,
      /** 总记录数 */
      total: 0,
      /** 每页显示数量 */
      pageSize: 5,
    };
  },
  /**
   * 生命周期钩子 - 组件挂载后加载审核记录和计算分页大小
   */
  mounted() {
    this.fetchData();
    this.calculatePageSize();
  },
  methods: {
    /**
     * 加载审核记录
     */
    fetchData() {
      this.loading = true; // 先将 loading 设置为 true，表示正在加载数据
      this.$request.get('/audit/selectAuditedByUid/' + this.user.uid).then(
          res => {
            if (res.code === '200') {
              this.tableData = res.data;
              console.log(this.tableData);
              this.total = this.tableData.length;
              this.loading = false; // 在数据获取成功后，将 loading 设置为 false，表示加载完成
            }
          }
      ).catch((error) => {
        console.error('数据加载出现错误:', error);
        this.loading = false; // 如果请求出现错误，同样将 loading 设置为 false，避免一直处于加载状态
      });
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
     * 处理页码变化
     * @param {number} newPage - 新的页码
     */
    handleCurrentChange(newPage) {
      this.currentPage = newPage;
      this.fetchData();
    },
    /**
     * 移除HTML标签
     * @param {string} html - HTML内容
     * @returns {string} 纯文本
     */
    stripHtmlTags(html) {
      let tmp = document.createElement("DIV");
      tmp.innerHTML = html;
      return tmp.textContent || tmp.innerText;
    },
    /**
     * 查看审核记录详情
     * @param {number} index - 索引
     * @param {Object} row - 记录数据
     */
    check(index, row) {
      this.draft.id = row.id;
      this.draft.title = row.title;
      this.draft.source = row.source;
      this.draft.content = row.content;
      this.dialogVisible = true;
    },
    /**
     * 删除记录
     * @param {number} index - 索引
     * @param {Object} row - 数据
     */
    handleDelete(index, row) {
      console.log(index, row);
    },
    /**
     * 处理输入事件
     * @param {Event} event - 输入事件
     */
    handleInput(event) {
      console.log(event);
    },
    /**
     * 获取第一张图片
     * @param {string} htmlContent - HTML内容
     * @returns {string|null} 图片URL
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
     * 获取图片宽度
     * @param {string} htmlContent - HTML内容
     * @returns {Promise|string} 图片宽度
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
     * 关闭预览对话框
     */
    cancel() {
      this.dialogVisible = false;
    },
    /**
     * 计算每页显示数量
     * 根据组件高度计算合适的分页大小
     */
    calculatePageSize() {
      const rowHeight = 50; // 假设 el-table 每行的高度为 50px
      const templateHeight = 300; // 假设减去一些边距，这里是 20px，可根据实际调整
      this.pageSize = Math.floor(templateHeight / rowHeight);
    },
    /**
     * 格式化审核记录状态
     * @param {number} id - 状态值
     * @returns {string} 状态文本
     */
    returnRecordStatus(id){
      switch (id) {
        case 0:
          return '审核中';
        case 1:
          return '未知状态';
        case 2:
          return '审核通过';
        case 3:
          return '审核未通过';
        default:
          return '未知状态';
      }
    }
  },
  computed: {
    /**
     * 返回当前页的审核记录
     * @returns {Array} 分页后的记录列表
     */
    returntable() {
      return this.tableData.slice(this.pageSize * (this.currentPage - 1), this.pageSize * this.currentPage);
    },
  }
}
;
</script>

<style lang="scss" scoped>
.el-date-table td, .el-table.cell, .el-table-filter {
  max-height: 95px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.audit-form-container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
}
</style>