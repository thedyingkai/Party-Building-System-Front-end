<template>
<div>
  <el-card class="markdown-body" v-show="logined">
    <el-form>
      <el-form-item>
        <el-col :span="2" style="margin-left: 20px">
          <el-avatar :size="50" :src="user.avatar"></el-avatar>
        </el-col>
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
    ComMent
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
      commentlist:[],
      commentreplyshow:{},
      user: JSON.parse(localStorage.getItem("current-user") || '{}'),
    };
  },
  props:{
    articleid: {
    type: Number,
    default: 0,
},
  },
  mounted() {
  },
  created() {
    console.log(this.user);
    this.aid=this.articleid;
    this.getcommentlist();
  },
  computed:{
   logined() {
     console.log(this.user);
     if (Object.keys(this.user).length === 0){
       console.log(0);
       return false
     }
     else {
       console.log(1);
       return true}
   }
  },
  methods: {
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
    deletedata(id){
      this.$request.post('/comment/delete', id).then(
          res => this.handleResponse(res, () => {
          })
      )
    },
    getreplyshow() {
      this.commentreplyshow = Array.from({length: this.length}, () => ({
        value: false
      }));
      console.log(this.commentreplyshow);
    },
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
    candelete(uid) {
      if (this.user.uid == uid) {
        return true;
      } else {
        return false;
      }
    },
    toggleLike() {
    },
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
    handleResponse(res, successCallback) {
      if (res.code === '200') {
        successCallback();
      } else {
        this.$message.error(res.data.msg);
      }
    },
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