<!--
  评论列表组件
  
  @component CommentList
  @description 文章评论区域，包含评论输入框和评论列表展示
  @author 党建系统开发团队
-->
<template>
<div>
  <!-- 评论输入区（仅登录用户可见） -->
  <el-card class="markdown-body" v-show="logined">
    <el-form>
      <el-form-item>
        <!-- 用户头像 -->
        <el-col :span="2" style="margin-left: 20px">
          <el-avatar :size="50" :src="user.avatar"></el-avatar>
        </el-col>
        <!-- 评论输入框和发布按钮 -->
        <el-col :span="20">
          <el-row>
            <el-input v-model="input" type="textarea" autosize></el-input>
          </el-row>
          <el-row style="margin-top: 10px">
            <el-button type="primary" @click="subcomment">发布</el-button>
          </el-row>
        </el-col>
      </el-form-item>
    </el-form>
  </el-card>
  <!-- 评论列表展示区 -->
  <el-card class="markdown-body">
    <ComMent :get-aid="aid"></ComMent>
  </el-card>
</div>
</template>

<script>
import ComMent from "@/components/ComMent.vue";

export default {
  name: "CommentList",
  components: {
    ComMent // 评论展示子组件
  },
  data() {
    return {
      liked: false,              // 是否点赞
      replyshow: false,          // 是否显示回复框
      length: 0,                 // 评论数量
      input: "",                 // 评论输入内容
      input2: "",                // 回复输入内容
      currentreply: 0,           // 当前回复的评论ID
      aid: 0,                    // 文章ID
      // 评论对象
      comment: {
        uid: 1,                  // 用户ID
        content: '',             // 评论内容
        aid: this.articleid,     // 文章ID
        send_time: '',           // 发送时间
        parent_id: 1,            // 父评论ID
      },
      commentlist: [],           // 评论列表
      commentreplyshow: {},      // 评论回复显示状态
      user: JSON.parse(localStorage.getItem("current-user") || '{}'), // 当前用户
    };
  },
  props: {
    /**
     * 文章ID
     * @type {Number}
     */
    articleid: {
      type: Number,
      default: 0,
    },
  },
  /**
   * 组件挂载后
   */
  mounted() {
  },
  /**
   * 组件创建时初始化
   * @description 加载文章ID并获取评论列表
   */
  created() {
    console.log(this.user);
    this.aid = this.articleid;
    this.getcommentlist();
  },
  computed: {
    /**
     * 检查用户是否已登录
     * @returns {boolean} 登录状态
     */
    logined() {
      console.log(this.user);
      if (Object.keys(this.user).length === 0) {
        console.log(0);
        return false
      }
      else {
        console.log(1);
        return true
      }
    }
  },
  methods: {
    /**
     * 删除评论
     * @param {number} id - 评论ID
     */
    deletecomment(id) {
      this.$confirm('您确定要删除此评论吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.deletedata(id);
        this.$message({
          type: 'success',
          message: '删除成功!'
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    /**
     * 执行删除评论操作
     * @param {number} id - 评论id
     * @description 发送删除请求到后端
     */
    deletedata(id){
      this.$request.post('/comment/delete', id).then(
          res => this.handleResponse(res, () => {
          })
      )
    },
    /**
     * 初始化回复显示状态
     * @description 为每条评论创建回复框显示状态
     */
    getreplyshow() {
      this.commentreplyshow = Array.from({length: this.length}, () => ({
        value: false
      }));
      console.log(this.commentreplyshow);
    },
    /**
     * 切换回复输入框显示
     * @param {number} index - 评论索引
     * @description 控制指定评论的回复框显示/隐藏
     */
    reply(index) {
      if (this.commentreplyshow[index].value){
        this.commentreplyshow[index].value = false;
      }
      else {
        this.commentreplyshow[this.currentreply].value=false;
        this.currentreply=index;
        this.commentreplyshow[index].value = true;
      }

    },
    /**
     * 判断是否可以删除评论
     * @param {number} uid - 评论用户ID
     * @returns {boolean} 是否可删除
     * @description 只有评论作者本人可以删除评论
     */
    candelete(uid) {
      if (this.user.uid == uid) {
        return true;
      } else {
        return false;
      }
    },
    /**
     * 切换点赞状态（功能占位）
     */
    toggleLike() {
    },
    /**
     * 获取评论列表
     * @description 从服务器获取指定文章的所有评论
     */
    getcommentlist() {
      this.loading = true;
      this.$request.get('/comment/selectbyarticle/' + this.aid).then(
          res => {
            if (res.code === '200') {
              this.commentlist = res.data;
              this.length = this.commentlist.length;
              this.loading = false;
              console.log(this.commentlist);
              this.getreplyshow();
            }
          }
      ).catch((error) => {
        console.error('数据加载出现错误:', error);
        this.loading = false;
      });
    },
    /**
     * 处理响应结果
     * @param {Object} res - 响应对象
     * @param {Function} successCallback - 成功回调函数
     * @description 统一处理接口响应，成功调用回调，失败显示错误
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
     * @param {number} id - 父评论id
     * @description 提交用户的回复内容
     */
    subreply(id){
      this.comment.parent_id=id;
      this.comment.content = this.input2;
      this.comment.uid = this.user.uid;
      this.comment.aid = this.articleid;
      this.comment.send_time = new Date();
      this.$request.post('/comment/submitreply', this.comment).then(
          res => this.handleResponse(res, () => {
            this.$message.success('提交成功');
            this.input2 = '';
          })
      )
    },
    /**
     * 提交评论
     * @description 提交用户的评论内容
     */
    subcomment() {
      console.log(this.input);
      this.comment.content = this.input;
      this.comment.uid = this.user.uid;
      this.comment.aid = this.articleid;
      this.comment.send_time = new Date();
      this.$request.post('/comment/submitcomment', this.comment).then(
          res => this.handleResponse(res, () => {
            this.$message.success('提交成功');
            this.input = '';
          })
      )
    },
  }
};
</script>

<style scoped>

</style>