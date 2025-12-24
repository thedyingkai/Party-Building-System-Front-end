<!--
  评论回复展示组件
  
  @component ReplyShow
  @description 递归显示评论的回复列表，支持多级嵌套回复
  @author 党建系统开发团队
-->
<template>
<div>
  <!-- 回复列表 -->
  <div v-for="(comment, index) in GetReply" :key="index" style="margin-top: 10px;">
    <div style="margin-left: 1vw" :id="'comment'+comment.id">
      <!-- 用户头像 -->
      <el-col :span="1"><el-avatar :size="30" :src="comment.avatar"></el-avatar></el-col>
      <!-- 回复内容 -->
      <el-col :span="23" style="margin-bottom: 10px;">
        <el-row> {{comment.uname}}:&nbsp; {{comment.content}}</el-row>
        <el-row><el-col :span="4">{{comment.send_time}}</el-col>
          <el-col :span="2"><span class="icon" @click="toggleLike">{{ comment.like }}</span></el-col>
          <el-col :span="2"><el-button type="text" @click="reply(comment.id)">回复</el-button></el-col>
          <el-col v-if="candelete(comment.uid)" :span="2"><el-button type="text" @click="deletecomment(comment.id)">删除</el-button></el-col>
        </el-row>
        <!-- 回复输入框 -->
        <el-row v-show="ifshow(comment.id)">
          <el-row>
            <el-input v-model="input2" type="textarea" autosize style="width: 50vw"></el-input>
          </el-row>
          <el-row>
            <el-button type="primary" style="margin-top:10px" @click="subreply(comment)">回复</el-button>
          </el-row>
        </el-row>
      </el-col>
    </div>
<div>
  <!-- 递归显示子回复 -->
  <el-col v-if="comment.children">
    <ReplyShow :get-reply="comment.children" :get-aid="comment.aid"></ReplyShow>
  </el-col>
</div>
</div>
</div>
</template>

<script>
export default {
  name:"ReplyShow",
  props:{
    /**
     * 回复列表数据
     * @type {Array}
     */
    GetReply:{
      type:Array,
      required:true,
    },
    /**
     * 文章ID
     * @type {Number}
     */
    GetAid:{
      type:Number,
      required: true,
    }
  },
  data() {
    return {
      // 点赞状态
      liked: false,
      // 回复框显示状态
      replyshow:false,
      // 评论数量
      length:0,
      // 输入内容
      input:"",
      // 回复输入内容
      input2:"",
      // 当前回复索引
      currentreply:0,
      // 文章ID
      aid:0,
      // 评论对象
      comment:{
        // 用户ID
        uid:1,
        // 评论内容
        content:'',
        // 文章ID
        aid:this.articleid,
        // 发送时间
        send_time:'',
        // 父评论id
        parent_id:1,
      },
      // 评论列表
      commentlist:[],
      // 回复框显示状态对象
      commentreplyshow:{
        // 评论id
        id:0,
        // 显示状态
        show:false,
      },
      // 当前用户
      user: JSON.parse(localStorage.getItem("current-user") || '{}'),
    };
  },
  /**
   * 组件挂载后
   * @description 初始化文章ID并加载评论列表
   */
  mounted() {
    this.aid=this.GetAid;
    console.log('test'+this.aid);
    this.getcommentlist();
  },
  methods: {
    /**
     * 删除评论
     * @param {number} id - 评论id
     * @description 弹出确认对话框后删除指定评论
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
     * 执行删除请求
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
     * @description 为每条评论创建回复框显示状态数组
     */
    getreplyshow() {
      this.commentreplyshow = Array.from({length: this.length}, () => ({
        value: false
      }));

    },
    /**
     * 判断是否显示回复框
     * @param {number} cmid - 评论id
     * @returns {boolean} 是否显示
     * @description 根据评论id判断回复框显示状态
     */
    ifshow(cmid){
      if((this.commentreplyshow.id==cmid) && this.commentreplyshow.show){
        return true
      }
      else {
        return false
      }
    },
    /**
     * 切换回复框显示
     * @param {number} cmid - 评论id
     * @description 切换指定评论的回复框显示/隐藏状态
     */
    reply(cmid) {
      this.commentreplyshow.id=cmid;
      if (this.commentreplyshow.show){
        this.commentreplyshow.show = false;
      }
      else {
        this.commentreplyshow.show=true;
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
      console.log(this.aid);
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
     * @description 统一处理接口响应
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
     * @param {Object} comment - 评论对象
     * @description 提交用户的回复内容
     */
    subreply(comment){
      this.comment.parent_id=comment.id;
      this.comment.content = this.input2;
      this.comment.uid = this.user.uid;
      this.comment.aid = comment.aid;
      this.comment.send_time = new Date();
      this.$request.post('/comment/submitreply', this.comment).then(
          res => this.handleResponse(res, () => {
            this.$message.success('提交成功');
            this.input2 = '';
          })
      )
    },

  }
}
</script>

<style scoped>

</style>