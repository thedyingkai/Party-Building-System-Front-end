<!--
  评论组件
  
  @component ComMent
  @description 显示评论列表，支持点赞、回复和删除功能
  @author 党建系统开发团队
-->
<template>
  <div>
    <!-- 评论列表表单 -->
    <el-form v-if="commentlist.length > 0">
      <el-form-item v-for="(comment, index) in commentlist" :key="index" style="margin-top: 20px;margin-left: 20px">
    <!-- 用户头像 -->
    <el-col :span="1">
      <el-avatar :size="45" :src=comment.avatar></el-avatar>
    </el-col>
    <!-- 评论内容区域 -->
    <el-col :span="22" style="margin-bottom: 10px;margin-left: 10px">
      <el-row>{{comment.uname}}</el-row><el-row>{{comment.content}}</el-row>
      <!-- 时间、点赞、回复、删除 -->
      <el-row><el-col :span="4">{{comment.send_time}}</el-col>
        <el-col :span="2"><span class="icon" @click="toggleLike">{{ comment.like }}</span></el-col>
        <el-col :span="2"><el-button type="text" @click="reply(index)">回复</el-button></el-col>
        <el-col v-if="candelete(comment.uid)" :span="2"><el-button type="text" @click="deletecomment(comment.id)">删除</el-button></el-col>
      </el-row>
      <el-row v-show="commentreplyshow[index].value">
        <el-row>
          <el-input v-model="input2" type="textarea" autosize style="width: 50vw"></el-input>
        </el-row>
        <el-row>
          <el-button type="primary" style="margin-top:10px" @click="subreply(comment.id)">回复</el-button>
        </el-row>
      </el-row>
    </el-col>
        <el-col v-if="comment.children">
          <ReplyShow :get-reply="comment.children" :get-aid="comment.aid"></ReplyShow>
        </el-col>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import ReplyShow from "@/components/ReplyShow.vue";

export default {
  name: "ComMent",
  components: {ReplyShow},
  props:{
    /**
     * 文章ID
     * @type {Number}
     */
    getAid: {
      type: Number,
      required: true,
    }
  },
  data() {
    return {
      liked: false,
      replyshow:false,
      length:0,
      input:"",
      input2:"",
      currentreply:0,
      aid:0,
      comment:{
        uid:1,
        content:'',
        aid:this.articleid,
        send_time:'',
        parent_id:1,
      },
      commentlist:[
        {id:1}
      ],
      commentreplyshow:{},
      user: JSON.parse(localStorage.getItem("current-user") || '{}'),
    };
  },
  mounted() {
    this.aid=this.getAid;
    this.getcommentlist();
  },
  methods: {
    /**
     * 删除评论
     * 
     * @param {Number} id - 评论ID
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
     * 执行删除评论请求
     * 
     * @param {Number} id - 评论ID
     */
    deletedata(id){
      this.$request.post('/comment/delete', id).then(
          res => this.handleResponse(res, () => {
          })
      )
    },
    /**
     * 初始化回复显示状态数组
     * 
     * @description 为每条评论创建回复框显示状态
     */
    getreplyshow() {
      this.commentreplyshow = Array.from({length: this.length}, () => ({
        value: false
      }));

    },
    /**
     * 切换回复输入框显示
     * 
     * @param {Number} index - 评论索引
     * @description 控制评论回复框的显示/隐藏
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
     * 
     * @param {Number} uid - 评论用户ID
     * @returns {Boolean} 是否可删除
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
     * 
     * @description 根据文章ID获取所有评论
     */
    getcommentlist() {
      this.loading = true;
      this.$request.get('/comment/selectbyarticle/' + this.aid).then(
          res => {
            if (res.code === '200') {
              this.commentlist = res.data;
              this.length = this.commentlist.length;
              this.loading = false;
              this.getreplyshow();
              this.$emit('comments-loaded');
            }
          }
      ).catch((error) => {
        console.error('数据加载出现错误:', error);
        this.loading = false;
      });
    },
    /**
     * 处理响应结果
     * 
     * @param {Object} res - 响应对象
     * @param {Function} successCallback - 成功回调函数
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
     * 
     * @param {Number} id - 父评论ID
     * @description 提交用户的回复内容
     */
    subreply(id){
      this.comment.parent_id=id;
      this.comment.content = this.input2;
      this.comment.uid = this.user.uid;
      this.comment.aid = Number(this.aid);
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