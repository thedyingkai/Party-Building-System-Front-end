<template>
  <div style="height: 100%">
    <!--    <div class="title">-->
    <!--      <span style="color: red;">AI</span>智能客服为您服务-->
    <!--    </div>-->
    <div class="content">
      <template v-for="item in data">
        <question-item v-if="item.question !== ''" :value="item.question"/>
        <answer-item v-if="item.answer !== ''" :value="item.answer"/>
      </template>
    </div>
    <div class="textarea-container">
      <el-input v-model="questionInputValue" :rows="6" class="custom-textarea" placeholder="请输入内容" resize='none'
                type="textarea"></el-input>
      <el-button :disabled="submitButtonDisabled" class="submit-button" type="primary" @click="handleSubmit">
        提交
      </el-button>
    </div>
  </div>
</template>
<script>
import QuestionItem from "@/components/QuestionItem.vue";
import AnswerItem from "@/components/AnswerItem.vue";
import {marked} from 'marked'

export default {
  name: 'CustomerService',
  components: {
    'question-item': QuestionItem,
    'answer-item': AnswerItem
  },
  data() {
    return {
      question: '',
      submitButtonDisabled: false,
      questionInputValue: '',
      data: []
    }
  },
  methods: {
    async handleSubmit() {
      // 处理提交逻辑
      console.log('提交的内容:', this.questionInputValue);
      if (this.questionInputValue.trim() === '') {
        this.$message({
          type: "error",
          message: "你没有输入内容哦"
        })
      } else {
        this.question = this.questionInputValue
        this.submitButtonDisabled = true
        this.data.push({
          question: this.question,
          answer: '正在思考中...'
        })
        this.questionInputValue = ''
        try {// 发送请求
          let response = await fetch(process.env.VUE_APP_BASEURL + "/chatBot/chat?msg=" + this.question,
              {
                method: "get",
                responseType: "stream",
              });// ok字段判断是否成功获取到数据流
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          // 用来获取一个可读的流的读取器（Reader）以流的方式处理响应体数据
          const reader = response.body.getReader();
          // 将流中的字节数据解码为文本字符串
          const textDecoder = new TextDecoder();
          let result = true;
          let answer = ''
          while (result) {
            // done表示流是否已经完成读取value包含读取到的数据块
            const {done, value} = await reader.read();
            if (done) {
              result = false;
              this.submitButtonDisabled = false
              break;
            }
            answer += textDecoder.decode(value);
            this.$set(this.data, this.data.length - 1, {
              question: this.question,
              answer: marked(answer)
            });
          }
        } catch (err) {
          console.log("发生错误:", err)
        }
      }
    }
  }
}
</script>
<style scoped>
.title {
  text-align: center;
  font-size: larger;
  font-weight: bold;
}

.content {
  height: calc(100% - 150px);
  overflow-y: auto;
}

.question {
  border: 2px solid salmon;
  border-radius: 10px;
}

.textarea-container {
  position: relative;
  display: flex;
  flex-direction: column;
}

.custom-textarea {
  /* 为按钮留出空间 */
  box-sizing: border-box;
  /* 确保内边距不会增加元素的总宽度 */
}

.submit-button {
  position: absolute;
  bottom: 10px;
  /* 根据需要调整 */
  right: 10px;
  /* 根据需要调整 */
  z-index: 1;
  /* 确保按钮在文本域之上 */
}
</style>