
<template>
<div>
  <div v-for="(comment, index) in GetReply" :key="index" style="margin-top: 10px;">
    <div style="margin-left: 1vw" :id="'comment'+comment.id">
      <el-col :span="1"><el-avatar :size="30" :src="comment.avatar"></el-avatar></el-col>
      <el-col :span="23" style="margin-bottom: 10px;">
        <el-row> {{comment.uname}}:&nbsp; {{comment.content}}</el-row>
        <el-row><el-col :span="4">{{comment.send_time}}</el-col>
          <el-col :span="2"><span class="icon" @click="toggleLike">{{ comment.like }}</span></el-col>
          <el-col :span="2"><el-button type="text" @click="reply(comment.id)">回复</el-button></el-col>
          <el-col v-if="candelete(comment.uid)" :span="2"><el-button type="text" @click="deletecomment(comment.id)">删除</el-button></el-col>
        </el-row>
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
    GetReply:{
      type:Array,
      required:true,
    },
    GetAid:{
      type:Number,
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
      commentlist:[],
      commentreplyshow:{
        id:0,
        show:false,
      },
      user: JSON.parse(localStorage.getItem("current-user") || '{}'),
    };
  },
  mounted() {
    this.aid=this.GetAid;
    console.log('test'+this.aid);
    this.getcommentlist();
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

    },
    ifshow(cmid){
      if((this.commentreplyshow.id==cmid) && this.commentreplyshow.show){
        return true
      }
      else {
        return false
      }
    },
    reply(cmid) {
      this.commentreplyshow.id=cmid;
      if (this.commentreplyshow.show){
        this.commentreplyshow.show = false;
      }
      else {
        this.commentreplyshow.show=true;
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
    handleResponse(res, successCallback) {
      if (res.code === '200') {
        successCallback();
      } else {
        this.$message.error(res.data.msg);
      }
    },
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