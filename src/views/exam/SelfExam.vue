<!--
  在线自测页面
  
  @component SelfExam
  @description 在线答题和自测页面，支持单选、多选、填空和判断题型
  @author 党建系统开发团队
-->
<template xmlns="http://www.w3.org/1999/html">
  <div id="app" class="container">
    <!-- 题目标题 -->
    <div class="header">
      <h1>在线自测</h1>
    </div>
    <!-- 答题卡区域 -->
    <div class="question-card" style="height: auto;">
      <!-- 显示当前题目 -->
      <div style="height: 10px"></div>
      <el-divider content-position="right"><h2>题目 {{ currentIndex + 1 }}/{{ questions.length }}</h2></el-divider>
      <div style="margin-bottom: 60px; margin-top: 20px">

        <p class="question-text" style="margin-top: 40px">{{ questions[currentIndex].text }}</p>
      </div>
      <!-- 答案选项 -->
      <div v-if="questions[currentIndex].type === 'single'" class="options">
        <el-radio-group v-model="userAnswers[currentIndex][0]">
          <el-radio
              v-for="(option, index) in questions[currentIndex].options"
              :key="index"
              :disabled="done"
              :label="option"
              style="display: flex"
          >
            <div style="margin-bottom: 10px">{{ option }}</div>
          </el-radio>
        </el-radio-group>
        <div v-if="done">
          <p>
            <el-tag type="success"> 正确答案</el-tag>
          <p> {{ questions[currentIndex].answer }} </p>
          <p>
            <el-tag type="info">题目解析</el-tag>
          <p> {{ questions[currentIndex].anal }} </p>
        </div>
      </div>
      <div v-else-if="questions[currentIndex].type === 'fill-in'" class="options">
        <div v-for="(blank, index) in questions[currentIndex].blanks" :key="index">
          <p>空 {{ index + 1 }}</p>
          <el-input
              v-model="userAnswers[currentIndex][index]"
              :disabled="done"
              placeholder="请输入答案"
              style="margin-bottom: 10px"
          ></el-input>
        </div>
        <div v-if="done">
          <p>
            <el-tag type="success"> 正确答案</el-tag>
          <p> {{ questions[currentIndex].answer }} </p>
          <p>
            <el-tag type="info">题目解析</el-tag>
          <p> {{ questions[currentIndex].anal }} </p>
        </div>
      </div>
    </div>


    <!-- 导航按钮 -->
    <div class="controls">
      <el-button
          :disabled="currentIndex === 0"
          type="primary"
          @click="prevQuestion"
      >
        上一题
      </el-button>
      <el-button
          v-if="currentIndex < questions.length - 1"
          type="success"
          @click="nextQuestion"
      >
        下一题
      </el-button>
      <template v-if="currentIndex === questions.length - 1">
        <el-button v-if="!done"
                   type="warning"
                   @click="submitAnswers">
          提交
        </el-button>
        <el-button v-if="done"
                   type="warning"
                   @click="returnHome">
          返回
        </el-button>
      </template>

    </div>

    <!-- 答题结果 -->
    <div v-if="showResult" class="result">
      <h2>答题完成！</h2>
      <p>您的得分是：<strong>{{ score }}</strong> 分</p>
    </div>
  </div>
</template>


<script>
import request from "@/utils/request";
import user from "@/views/exam/User.vue";

export default {
  name: "Exam",
  /**
   * @description 组件数据
   * @returns {Object} 包含题目列表、用户答案、当前索引、得分等数据
   */
  data() {
    return {
      done: false,
      paper: {},
      questions: [],
      // 用户答案（二维数组）
      userAnswers: [],
      // 当前题目索引
      currentIndex: 0,
      // 是否显示结果
      showResult: false,
      // 总分
      score: 0,
    };
  },
  created() {
    request.get('/questions/tf').then(res => {
      let questions = res.data
      questions = this.getRandomElements(questions, 3)
      questions.forEach(q => {
        this.questions.push({
          text: q.question_description,
          type: 'single',
          options: ['正确', '错误'],
          answer: q.correct_answer,
          anal: q.question_analysis
        })
      })
    })

    request.get('/questions/mc').then(res => {
      let questions = res.data
      questions = this.getRandomElements(questions, 4)
      questions.forEach(q => {
        request.get('/options/in_question/' + q.multiple_choice_question_id).then(res => {
          let question =
              {
                text: q.question_description,
                type: 'single',
                options: [],
                answer: q.correct_answer,
                anal: q.question_analysis
              }
          let options_data = res.data
          options_data.forEach(op => {
            question.options.push(op.option_description)
            if (q.correct_answer === op.order_in_question) {
              question.answer = op.option_description
            }
          })
          this.questions.push(question)
        })
      })
    })

    request.get('/questions/fi').then(res => {
      let questions = res.data
      questions = this.getRandomElements(questions, 3)
      questions.forEach(q => {
        this.questions.push({
          text: q.question_description,
          type: 'fill-in',
          blanks: [''],
          answer: q.correct_answer,
          anal: q.question_analysis
        })
      })
    })
  },
  updated() {
  },
  watch:
      {
        questions(newValue, oldValue) {
          this.updateAnswer()
        }
      },
  methods: {
    /**
     * @description 返回首页
     */
    returnHome() {
      this.$router.push({path: "/Home"});
    },
    /**
     * @description 从数组中随机获取指定数量的元素
     * @param {Array} arr - 源数组
     * @param {Number} num - 需要获取的元素数量
     * @returns {Array} 随机选择的元素数组
     */
    getRandomElements(arr, num) {
      const shuffled = arr.slice();
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      return shuffled.slice(0, num);
    },
    /**
     * @description 更新用户答案数组,根据题型初始化不同的答案格式
     */
    updateAnswer() {
      this.userAnswers = this.questions.map((question) => {
        if (question.type === 'single') {
          return ['']; // 单选题初始值为单一字符串
        } else if (question.type === 'multiple') {
          return []; // 多选题初始值为空数组
        } else if (question.type === 'fill-in') {
          return new Array(question.blanks.length).fill(''); // 填空题初始值为与空数量匹配的数组
        }
      });
    },
    /**
     * @description 切换到上一题
     */
    prevQuestion() {
      if (this.currentIndex > 0) {
        this.currentIndex -= 1;
      }
    },
    /**
     * @description 切换到下一题
     */
    nextQuestion() {
      if (this.currentIndex < this.questions.length - 1) {
        this.currentIndex += 1;
      }
    },
    /**
     * @description 提交答案,显示结果和得分
     */
    submitAnswers() {
      this.done = true;
      this.showResult = true;
      this.calculateScore();
    },
    /**
     * @description 计算得分,每题10分
     */
    calculateScore() {
      this.score = 0;
      console.log(this.questions.length)
      for (let index = 0; index < this.questions.length; index++) {
        let question = this.questions[index]
        let userAnswer = this.userAnswers[index]
        if (question.answer === userAnswer[0]) {
          this.score += 10;
        }
      }
    }
  }
};
</script>

<style>
/* 页面布局 */
.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-family: Arial, sans-serif;
  background: #f5f7fa;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.header {
  margin-bottom: 20px;
}

.header h1 {
  font-size: 2em;
  color: #409eff;
}

.question-card {
  width: 100%;
  background: #ffffff;
  padding: 20px;
  border-radius: 10px;
  margin-bottom: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.question-text {
  font-size: 1.2em;
  margin-bottom: 20px;
}

.options {
  margin-bottom: 20px;
}

.controls {
  display: flex;
  justify-content: space-between;
  width: 100%;
}

.result {
  text-align: center;
  margin-top: 20px;
}

.result h2 {
  font-size: 1.5em;
  color: #67c23a;
}
</style>