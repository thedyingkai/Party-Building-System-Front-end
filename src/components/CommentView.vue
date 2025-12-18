<template>
  <el-row>
    <el-col :span="20" :offset="2">
      <el-card class="markdown-body" v-html="draft.content" style="padding: 3vh;">
      </el-card>
    </el-col>
  </el-row>
</template>

<script>
export default {
  name: "CommentView",
  props:{
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