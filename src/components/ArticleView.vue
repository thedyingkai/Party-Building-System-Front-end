<!--
  文章预览组件
  
  @component ArticleView
  @description 显示文章标题、来源和内容的预览组件
  @author 党建系统开发团队
-->
<template>
  <el-row>
    <el-col :offset="2" :span="20">
      <!-- 文章标题和来源 -->
      <el-card class="markdown-body">
        <h1 style="text-align: center;justify-content: center;font-size: 36px">{{ draft.title }}</h1>
        <div v-if="draft.source !== ''" style="font-size: 14px;font-style: normal;font-weight: 400;margin-top: 15px">
          文章来源：{{ draft.source }}
        </div>
      </el-card>
      <!-- 文章内容 -->
      <el-card class="markdown-body" style="padding: 3vh;" v-html="draft.content">
      </el-card>
    </el-col>
  </el-row>
</template>

<script>
export default {
  name: "ArticleView",
  props: {
    /**
     * 文章数据对象
     * @type {Object}
     * @property {String} id - 文章ID
     * @property {String} title - 文章标题
     * @property {String} source - 文章来源
     * @property {String} content - 文章内容（HTML格式）
     */
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