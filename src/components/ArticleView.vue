<template>
  <el-row>
    <el-col :offset="2" :span="20">
      <el-card class="markdown-body">
        <h1 style="text-align: center;justify-content: center;font-size: 36px">{{ draft.title }}</h1>
        <div v-if="draft.source !== ''" style="font-size: 14px;font-style: normal;font-weight: 400;margin-top: 15px">
          文章来源：{{ draft.source }}
        </div>
      </el-card>
      <el-card class="markdown-body" style="padding: 3vh;" v-html="draft.content">
      </el-card>
    </el-col>
  </el-row>
</template>

<script>
export default {
  name: "ArticleView",
  props: {
    draft: {
      id: '',
      title: '',
      source: '',
      content: '',
    },
  }
}
</script>

<style scoped>

</style>