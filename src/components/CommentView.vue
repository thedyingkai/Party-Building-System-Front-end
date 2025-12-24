<!--
  评论预览组件
  
  @component CommentView
  @description 显示单条评论的内容预览
  @author 党建系统开发团队
-->
<template>
  <el-row>
    <el-col :span="20" :offset="2">
      <!-- 评论内容 -->
      <el-card class="markdown-body" v-html="draft.content" style="padding: 3vh;">
      </el-card>
    </el-col>
  </el-row>
</template>

<script>
export default {
  name: "CommentView",
  props:{
    /**
     * 评论数据对象
     * @type {Object}
     * @property {String} id - 评论ID
     * @property {String} title - 评论标题
     * @property {String} content - 评论内容（HTML格式）
     */
    draft: {
      id: '',
      title: '',
      content: '',
    },
  }
}
</script>

<style scoped>

</style>