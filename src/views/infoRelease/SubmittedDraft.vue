<!--
/**
 * @component SubmittedDraft
 * @description 已提交草稿页面 - 展示用户已提交的草稿及审核状态
 * @author Party Building System
 */
-->
<template>
  <!-- 已提交草稿列表容器 -->
  <div style="display: flex; flex-direction: column; flex-grow: 1;padding: 1vh">
    <el-table
        v-loading="loading"
        :cell-style="{ padding: '0px' }"
        :data="returntable.filter(data =>!search || (data.title?.toLowerCase()?.includes(search.toLowerCase())) || (data.content?.toLowerCase()?.includes(search.toLowerCase())))"
        :row-style="{ height: '100px' }" stripe>
      <el-table-column label="标题" prop="title" width="140">
      </el-table-column>
      <el-table-column label="内容" prop="content" width="400">
        <template slot-scope="scope">
          <span v-if="scope.row.content" class="ellipsis-text">{{ stripHtmlTags(scope.row.content) }}</span>
        </template>
      </el-table-column>
      <!-- 新增的图片列 -->
      <el-table-column width="200">
        <template slot-scope="scope">
          <img v-if="getFirstImage(scope.row.content)" :src="getFirstImage(scope.row.content)"
               :style="{ width: getImageWidth(scope.row.content), height: '100px' }"/>
        </template>
      </el-table-column>
      <el-table-column label="提交时间" prop="save_time" width="180">
      </el-table-column>
      <el-table-column
          :filter-method="filterTag"
          :filters="[{ text: '审核中', value: '0' }, { text: '通过', value: '2' }, { text: '未通过', value: '3' }]"
          filter-placement="bottom-start"
          label="状态"
          prop="status"
          width="110">
        <template slot-scope="scope">
          <el-tag
              :type="scope.row.status === 1? 'primary' : (scope.row.status === 2? 'success' : (scope.row.status === 3? 'danger' : 'info'))"
              disable-transitions>{{ formatSubmitRecordStatus(scope.row.status) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
          label="详情"
          prop="status"
          width="110">
        <template slot-scope="scope">
          <el-button size="small" type="info" @click="check(scope.$index,scope.row)">查看详情</el-button>
        </template>
      </el-table-column>
      <el-table-column
          align="right">
        <template slot="header" slot-scope="scope">
          <el-input
              v-model="search"
              placeholder="输入关键字搜索"
              size="mini"
              @input="handleInput(scope)"
          />
        </template>
        <template slot-scope="scope">
          <el-button
              v-if="scope.row.status === 2"
              size="large" type="primary"
              @click="handlePreview(scope.$index, scope.row)">预览
          </el-button>
          <el-button
              size="large" type="primary"
              @click="handleEdit(scope.$index, scope.row)">编辑
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog
        :fullscreen="true"
        :visible.sync="dialogVisible"
        title="预览"
        width="90%"
    >
      <ArticleView :draft="draft"></ArticleView>
    </el-dialog>
    <el-dialog
        :visible.sync="dialogVisible_check"
        title="详情"
        width="60%"
    >
      <el-timeline>
        <el-timeline-item
            v-for="(audit, index) in auditList"
            :key="index" :color="audit.color"
            :timestamp="audit.timestamp">
          {{ audit.content }}
        </el-timeline-item>
      </el-timeline>
    </el-dialog>
    <el-pagination
        :current-page.sync="currentPage"
        :page-size="5"
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

export default {
  name: "SubmittedDraftList",
  components: {ArticleView},
  data() {
    return {
      /** 当前登录用户信息 */
      user: JSON.parse(localStorage.getItem("current-user") || '{}'),
      /** 草稿列表完整数据 */
      tableData: [],
      /** 搜索关键字 */
      search: '',
      /** 加载状态 */
      loading: true,
      /** 当前预览的草稿对象 */
      draft: {
        id: '',
        source: '',
        title: '',
        content: '',
      },
      /** 当前页码 */
      currentPage: 1,
      /** 总记录数 */
      total: 0,
      /** 每页显示数量 */
      pageSize: 5,
      /** 预览对话框显示状态 */
      dialogVisible: false,
      /** 审核详情对话框显示状态 */
      dialogVisible_check: false,
      /** 审核流程记录列表 */
      auditList: [],
    };
  },
  /**
   * 生命周期钩子 - 组件挂载后加载草稿列表
   */
  mounted() {
    this.fetchData();
  },
  methods: {
    /**
     * 查看审核详情
     * 显示草稿的审核流程和详细信息
     * @param {number} index - 表格索引
     * @param {Object} row - 草稿数据
     */
    check(index, row) {
      this.auditList = [];
      this.dialogVisible_check = true;
      this.$request.get('/audit/selectBySubmitId/' + row.id).then(
          res => {
            let send = {
              content: '提交',
              timestamp: row.send_time,
            }
            this.auditList.push(send);
            if (res.code === '200') {
              res.data.forEach((item, index) => {
                const serialNumber = index + 1;
                let audit_content = `${serialNumber}级${this.formatStatus(item.status)}`;
                if (item.advice !== '' && item.advice !== null) {
                  audit_content = audit_content + '，审核意见：' + item.advice;
                }
                let audit = {
                  content: audit_content,
                  timestamp: item.time,
                };
                if (audit.content.includes('审核未通过')) {
                  audit.color = '#ba0101'
                }
                this.auditList.push(audit);
              });
              if (this.auditList.length === 0 ||
                  this.auditList[this.auditList.length - 1].timestamp < this.tableData[index].send_time) {
                let latest = {
                  content: '提交，待审核',
                  timestamp: this.tableData[index].send_time,
                }
                this.auditList.push(latest);
              }
              if (this.auditList[this.auditList.length - 1].color !== '#ba0101')
                this.auditList[this.auditList.length - 1].color = '#0bbd87';
            }
          }
      ).catch((error) => {
        console.error('数据加载出现错误:', error);
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
     * 加载已提交的草稿列表
     */
    fetchData() {
      this.loading = true; // 先将loading设置为true，表示正在加载数据
      let uid = this.user.uid;
      this.$request.get('/draft/selectSubByUid/' + uid).then(
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
    },
    /**
     * 移除HTML标签
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
     * 检查审核状态后跳转到编辑页面
     * @param {number} index - 表格索引
     * @param {Object} row - 草稿数据
     */
    handleEdit(index, row) {
      this.checkLatestStatus(row.id).then(latestStatus => {
        if (latestStatus === 4) {
          this.$message({
            message: '审核中，无法修改',
            type: 'warning'
          });
        } else {
          this.$router.push({
            name: '草稿编辑',
            params: {
              id: row.id,
              source: row.source,
              coid: row.coid,
              title: row.title,
              content: row.content
            }
          });
        }
      }).catch(error => {
        console.error('获取最新状态出错:', error);
        // 可以根据具体情况决定是否允许编辑或者给出更友好的提示
      });
    },
    /**
     * 预览草稿
     * @param {number} index - 表格索引
     * @param {Object} row - 草稿数据
     */
    handlePreview(index, row) {
      this.draft.id = row.id;
      this.draft.title = row.title;
      this.draft.content = row.content;
      this.dialogVisible = true;
    },
    /**
     * 检查草稿最新状态
     * @param {number} draftId - 草稿ID
     * @returns {Promise} 返回状态值
     */
    checkLatestStatus(draftId) {
      return this.$request.get('/draft/checkStatus/' + draftId).then(res => {
        if (res.code === '200') {
          return res.data;
        }
        throw new Error('获取状态失败');
      });
    },
    /**
     * 删除草稿
     * @param {number} index - 表格索引
     * @param {Object} row - 草稿数据
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
     * 获取HTML中的第一张图片
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
     * 计算图片宽度
     * @param {string} htmlContent - HTML内容
     * @returns {Promise<string>|string} 图片宽度
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
     * 标签过滤方法
     * @param {string} value - 过滤值
     * @param {Object} row - 行数据
     * @returns {boolean} 是否匹配
     */
    filterTag(value, row) {
      return row.status === parseInt(value);
    },
    /**
     * 格式化审核状态
     * @param {number} cellValue - 状态值
     * @returns {string} 状态文本
     */
    formatStatus(cellValue) {
      switch (cellValue) {
        case 0:
          return '待审核';
        case 1:
          return '审核中';
        case 2:
          return '审核通过';
        case 3:
          return '审核未通过';
        default:
          return '未知状态';
      }
    },
    /**
     * 格式化提交记录状态
     * @param {number} cellValue - 状态值
     * @returns {string} 状态文本
     */
    formatSubmitRecordStatus(cellValue) {
      switch (cellValue) {
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
    },
    /**
     * 取消操作
     */
    cancel() {
      this.dialogVisible = false;
    },
    /**
     * 提交审核
     */
    submitAudit() {
      // 此处可添加具体的提交审核逻辑，例如调用 API 进行审核操作
      console.log('执行提交审核操作');
    /**
     * 返回当前页的草稿数据
     * 根据分页信息对完整数据进行切片
     * @returns {Array} 当前页的草稿列表
     */
    }
  },
  computed: {
    returntable() {
      return this.tableData.slice(this.pageSize * (this.currentPage - 1), this.pageSize * this.currentPage);
    }
  }
};
</script>


<style lang="scss" scoped>
.el-date-table td, .el-table.cell {
  max-height: 95px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}


.el-table-filter {
  max-height: unset !important;
}
</style>