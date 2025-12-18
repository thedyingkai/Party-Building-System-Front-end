<template>
  <div class="answer-warp">
    <div class="answer-content">
      <el-collapse v-show="thinkContent && thinkContent.trim()!== ''" v-model="expandedNames">
        <el-collapse-item name="think-process" title="思考过程">
          <div v-html="thinkContent"></div>
        </el-collapse-item>
      </el-collapse>
      <div class="markdown-body" v-html="nonThinkContent"></div>
    </div>
    <div>
      <el-avatar size="small" src="images/ai-icon.jpg"></el-avatar>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AnswerItem',
  props: {
    value: String,
  },
  data() {
    return {
      nonThinkContent: '',
      thinkContent: '',
      expandedNames: ['think-process'],
      thinkFinish: false,
    };
  },
  watch: {
    value: {
      immediate: true, // 初始化时也执行一次
      handler(newValue) {
        this.processContent(newValue);
      }
    },
    nonThinkContent(newVal) {
      // 监听 nonThinkContent 的变化，根据其值设置展开状态
      if (!this.thinkFinish) {
        if (newVal.trim() === '') {
          // 如果 nonThinkContent 为空，添加对应的 name 到展开数组
          if (!this.expandedNames.includes('think-process')) {
            this.expandedNames.push('think-process');
          }
        } else {
          // 如果 nonThinkContent 不为空，从展开数组中移除对应的 name
          const index = this.expandedNames.indexOf('think-process');
          if (index !== -1) {
            this.expandedNames.splice(index, 1);
          }
          this.thinkFinish = true;
        }
      }
    }
  },
  methods: {
    processContent(value) {
      const thinkIndex = value.indexOf('<think>');
      const endThinkIndex = value.indexOf('</think>');

      if (thinkIndex !== -1) {
        if (endThinkIndex !== -1 && endThinkIndex > thinkIndex) {
          // 存在 <think> 和 </think> 标签，且 </think> 在 <think> 之后
          this.thinkContent = value.slice(thinkIndex + '<think>'.length, endThinkIndex);
          this.nonThinkContent = value.slice(0, thinkIndex) + value.slice(endThinkIndex + '</think>'.length);
        } else {
          // 存在 <think> 标签，但没有有效的 </think> 标签
          this.thinkContent = value.slice(thinkIndex + '<think>'.length);
          this.nonThinkContent = '';
        }
      } else {
        // 如果没有 <think> 标签，全部内容作为回复内容
        this.thinkContent = '';
        this.nonThinkContent = value;
      }
    }
  }
};
</script>

<style scoped>
.answer-warp {
  display: flex;
}

.markdown-body {
  background-color: rgb(223, 241, 249);
}

.answer-content {
  margin: 5px;
  line-height: 25px;
  width: 100%;
  text-align: justify;
  background-color: rgb(223, 241, 249);
  border-radius: 10px;
  padding: 10px;
}
</style>