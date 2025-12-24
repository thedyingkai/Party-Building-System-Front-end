<!--
  问题项组件
  
  @component QuestionItem
  @description 显示用户提问内容的组件
  @author 党建系统开发团队
-->
<template>
  <div class="question-warp">
    <!-- 问题内容 -->
    <div class="question-content">
      {{ value }}
    </div>
  </div>
</template>
<script>
export default {
  name: 'QuestionItem',
  props: {
    /**
     * 问题文本内容
     * @type {String}
     */
    value: String,
  },
  data() {
    return {}
  },
  methods: {}
}
</script>
<style scoped>

.question-warp {
  display: flex;
}

.question-content {
  margin: 5px;
  line-height: 25px;
  text-align: justify;
  width: 100%;
  background-color: rgb(249, 246, 243);
  border-radius: 10px;
  padding: 10px;
}
</style>