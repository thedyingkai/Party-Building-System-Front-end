<!--
/**
 * @component ReplyMe
 * @description 回复我的页面 - 展示其他用户对我的评论回复,支持再次回复
 * @author Party Building System
 */
-->
<template>
  <!-- 回复我的列表容器 -->
  <div style="display: flex; flex-direction: column; flex-grow: 1;padding: 1vh">
    <el-table :data="returntable.filter(data =>!search || (data.uname?.toLowerCase()?.includes(search.toLowerCase()))
                                                       || (data.content?.toLowerCase()?.includes(search.toLowerCase())))"
              stripe :row-style="{ height: '100px' }" :cell-style="{ padding: '0px' }" v-loading="loading">
      <el-table-column prop="uname" label="回复人" width="140">
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
              type="primary"
              @click="handleReply(scope.$index, scope.row)">回复
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog
        title="回复"
        :visible.sync="dialogVisible"
        width="90%"
        fullscreen=true
    >
<div>
  <el-row style="margin-bottom:20px">
    <el-card class="markdown-body">
      <h1 style="justify-content: center;font-size: 20px">{{this.replyme.content}}</h1>
    </el-card>
  </el-row>
  <el-row>
    <el-input type="textarea" autosize placeholder="请输入回复内容" v-model="reply"></el-input>
  </el-row>
</div>
      <el-alert
          v-if="show"
          title="回复内容不能为空"
          type="warning"
          :closable="false"
          show-icon>
      </el-alert>

      <span slot="footer" class="dialog-footer">
              <el-button @click="cancel">取 消</el-button>
              <el-button type="primary" @click="subreply(replyme.id,replyme.aid)">确 定</el-button>
            </span>
    </el-dialog>

    <el-pagination append-to-body
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
  name: "ReplyMe",
  data() {
    return {
      /** 当前登录用户信息 */
      user: JSON.parse(localStorage.getItem("current-user") || '{}'),
      /** 回复我的评论列表数据 */
      tableData: [],
      /** 搜索关键字 */
      search: '',
      /** 加载状态 */
      loading: true,
      /** 当前页码 */
      currentPage: 1,
      /** 总记录数 */
      total: 0,
      /** 文章列表（备用） */
      articles: [],
      /** 每页显示数量 */
      pageSize: 5,
      /** 文章标题（备用） */
      title: '',
      /** 回复对话框显示状态 */
      dialogVisible: false,
      /** 错误提示显示状态 */
      show: false,
      /** 回复内容 */
      reply: '',
      /** 评论提交对象 */
      comment: {
        id: 0,             // 评论ID
        title: '',         // 文章标题
        uid: 0,            // 用户ID
        aid: 0,            // 文章ID
        content: '',       // 评论内容
        send_time: '',     // 发送时间
        audit_uid: 0,      // 审核员ID
        status: 0,         // 审核状态
        parent_id: 0,      // 父评论ID
      },
      /** 回复我的评论信息 */
      replyme: {
        id: 1,       // 评论ID
        content: '', // 评论内容
        aid: 0,      // 文章ID
      }
    };
  },
  /**
   * 生命周期钩子 - 组件挂载后加载回复列表
   */
  mounted() {
    this.fetchData();
  },
  methods: {
    /**
     * 处理输入事件
     * @param {Event} event - 输入事件
     */
    handleInput(event) {
      console.log(event);
    },
    /**
     * 取消回复
     */
    cancel() {
      this.dialogVisible = false;
      this.reply='';
    },
    /**
     * 处理响应
     * @param {Object} res - 服务器响应
     * @param {Function} successCallback - 成功回调
     */
    handleResponse(res, successCallback) {
      if (res.code === '200') {
        successCallback();
      } else {
        this.$message.error(res.data.msg);
      }
    },
    /**
     * 提交回复
     * @param {number} id - 评论ID
     * @param {number} aid - 文章ID
     */
    subreply(id,aid){
      console.log(this.reply=='');
      if(this.reply=='')
      {
        this.show=true;
        setTimeout(() => {
          this.show = false;
        }, 1000);
      }
      else{
        this.comment.parent_id=id;
        this.comment.aid=aid;
        this.comment.content = this.reply;
        this.comment.uid = this.user.uid;
        this.comment.send_time = new Date();
        this.$request.post('/comment/submitreply', this.comment).then(
            res => this.handleResponse(res, () => {
              this.$message.success('提交成功');
            })
        )
        this.dialogVisible=false;
        this.reply='';
      }

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
     * 编辑记录
     * @param {number} index - 索引
     * @param {Object} row - 数据
     */
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
    /**
     * 回复评论
     * 跳转到文章页面并定位到评论
     * @param {number} index - 索引
     * @param {Object} row - 数据
     */
    handleReply(index, row) {
      console.log(index, row);
      this.replyme.id=row.id;
      this.replyme.content=row.content;
      this.replyme.aid=row.aid;
      this.$router.push({name: 'article', params: { id: row.aid },hash:`#comment${row.id}`})
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
     * 加载回复我的列表
     */
    fetchData() {
      this.loading = true; // 先将loading设置为true，表示正在加载数据
      let id = this.user.uid;
      this.$request.get('/comment/selectbyfatheruid/' + id).then(
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
    /**
     * 返回当前页的回复数据
     * @returns {Array} 分页后的回复列表
     */
    returntable() {
      return this.tableData.slice(this.pageSize * (this.currentPage - 1), this.pageSize * this.currentPage);
    }
  }
};
</script>

<style lang="scss" scoped>
.el-date-table td, .el-table .cell, .el-table-filter {
  max-height: 95px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>