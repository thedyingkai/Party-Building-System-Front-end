<template>
  <div id="app" class="container">
    <!-- 题目标题 -->
    <div class="header">
      <h1>在线测试#{{ paper.test_paper_id }}</h1>
    </div>
    <!--
    <div class="question-card">
      <el-collapse v-model="activeNames" @change="handleChange">
      <el-collapse-item title="试卷描述" >
        <div>{{paper.paper_description}}</div>
      </el-collapse-item>
      </el-collapse>
    </div>
    -->
    <!-- 答题卡区域 -->
    <div class="question-card" style="height: auto;">
      <!-- 显示当前题目 -->
      <div style="margin-bottom: 10px">
        <el-tag style="float: left; margin-right: 10px">
          {{ paper.paper_description }}
        </el-tag>
        <el-tag style="float: left;" type="warning">
          截至 {{ paper.deadline }}
        </el-tag>
      </div>
      <div style="height: 10px"></div>
      <el-divider content-position="right"><h2>题目 {{ currentIndex + 1 }}/{{ questions.length }}</h2></el-divider>

      <div style="margin-bottom: 60px; margin-top: 20px">
        <p class="question-text">{{ questions[currentIndex].text }}</p>
      </div>
      <!-- 答案选项 -->
      <!--      <div v-if="questions[currentIndex].type === 'single'" class="options">-->
      <!--        <el-radio-group v-model="userAnswers[currentIndex][0]">-->
      <!--          <el-radio-->
      <!--              style="display: flex"-->
      <!--              v-for="(option, index) in questions[currentIndex].options"-->
      <!--              :key="index"-->
      <!--              :label="option"-->
      <!--          >-->
      <!--            <div style="margin-bottom: 10px">{{ option }}</div>-->
      <!--          </el-radio>-->
      <!--        </el-radio-group>-->
      <!--      </div>-->
      <!--&lt;!&ndash;-->
      <!--      <div v-else-if="questions[currentIndex].type === 'multiple'" class="options">-->
      <!--        <el-checkbox-group v-model="userAnswers[currentIndex]">-->
      <!--          <el-checkbox-->
      <!--              style="display: flex"-->
      <!--              v-for="(option, index) in questions[currentIndex].options"-->
      <!--              :key="index"-->
      <!--              :label="option"-->
      <!--          >-->
      <!--            <div style="margin-bottom: 10px">{{ option }}</div>-->
      <!--          </el-checkbox>-->
      <!--        </el-checkbox-group>-->
      <!--      </div>-->
      <!--&ndash;&gt;-->
      <!--      <div v-else-if="questions[currentIndex].type === 'fill-in'" class="options">-->
      <!--        <div v-for="(blank, index) in questions[currentIndex].blanks" :key="index">-->
      <!--          <p>空 {{ index + 1 }}</p>-->
      <!--          <el-input-->
      <!--              v-model="userAnswers[currentIndex][index]"-->
      <!--              placeholder="请输入答案"-->
      <!--              style="margin-bottom: 10px"-->
      <!--          ></el-input>-->
      <!--        </div>-->
      <!--      </div>-->
      <div v-if="questions[currentIndex].type === 'single'" class="options">
        <el-radio-group v-model="userAnswers[currentIndex][0]">
          <el-radio
              v-for="(option, index) in questions[currentIndex].options"
              :key="index"
              :disabled="showResult"
              :label="option"
              style="display: flex"
          >
            <div style="margin-bottom: 10px">{{ option }}</div>
          </el-radio>
        </el-radio-group>
        <div v-if="showResult">
          <p>
            <el-tag type="success"> 正确答案</el-tag>
          <p> {{ questions[currentIndex].answer }} </p>
          </p>
          <!--          <p>-->
          <!--            <el-tag type="info">题目解析</el-tag> <p> {{ questions[currentIndex].anal}} </p>-->
          <!--          </p>-->
        </div>
      </div>
      <div v-else-if="questions[currentIndex].type === 'fill-in'" class="options">
        <div v-for="(blank, index) in questions[currentIndex].blanks" :key="index">
          <p>空 {{ index + 1 }}</p>
          <el-input
              v-model="userAnswers[currentIndex][index]"
              :disabled="showResult"
              placeholder="请输入答案"
              style="margin-bottom: 10px"
          ></el-input>
        </div>
        <div v-if="showResult">
          <p>
            <el-tag type="success"> 正确答案</el-tag>
          <p> {{ questions[currentIndex].answer }} </p>
          </p>
          <!--          <p>-->
          <!--            <el-tag type="info">题目解析</el-tag> <p> {{ questions[currentIndex].anal}} </p>-->
          <!--          </p>-->
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
      <!--      <el-button-->
      <!--          type="warning"-->
      <!--          v-if="currentIndex === questions.length - 1"-->
      <!--          @click="submitAnswers"-->
      <!--      >-->
      <!--        提交-->
      <!--      </el-button>-->
      <template v-if="currentIndex === questions.length - 1">
        <el-button v-if="!showResult"
                   type="warning"
                   @click="submitAnswers">
          提交
        </el-button>
        <el-button v-if="showResult"
                   type="warning"
                   @click="returnPapers">
          退出
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
  data() {
    return {
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

      user: JSON.parse(localStorage.getItem("current-user") || '{}'),
    };
  },
  created() {

    const id = parseInt(this.$route.query.id);

    request.get('/papers').then(res => {
      let papers = res.data.sort((a, b) => new Date(b.create_date) - new Date(a.create_date))
      console.log(papers)
      papers.forEach(paper => {
        if (paper.test_paper_id === id) {
          console.log(paper)
          this.paper = paper
        }
      })
      request.get('/questions/tf/in_paper/' + this.paper.test_paper_id).then(res => {
        let questions = res.data
        questions.forEach(q => {
          this.questions.push({
            text: q.question_description,
            type: 'single',
            options: ['正确', '错误'],
            answer: q.correct_answer,
            order: q.question_order_in_paper
          })
        })
      })

      request.get('/questions/mc/in_paper/' + this.paper.test_paper_id).then(res => {
        let questions = res.data
        questions.forEach(q => {
          request.get('/options/in_question/' + q.multiple_choice_question_id).then(res => {
            let question =
                {
                  text: q.question_description,
                  type: 'single',
                  options: [],
                  answer: q.correct_answer,
                  order: q.question_order_in_paper
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

      request.get('/questions/fi/in_paper/' + this.paper.test_paper_id).then(res => {
        let questions = res.data
        questions.forEach(q => {
          this.questions.push({
            text: q.question_description,
            type: 'fill-in',
            blanks: [''],
            answer: q.correct_answer,
            order: q.question_order_in_paper
          })
        })
      })
    })
  },
  updated() {
  },
  computed: {
    Resarray() {
      let result = {};
      result['user_id'] = this.user.id;
      result['test_paper_id'] = parseInt(this.$route.query.id);
      result['participation_time'] = this.getFormattedDate();
      result['test_record'] = this.userAnswers.join('#');
      return result;
    }
  },
  watch:
      {
        questions(newValue, oldValue) {
          this.updateAnswer()
        }
      },
  methods: {
    getFormattedDate() {
      const currentDate = new Date();

      const year = currentDate.getFullYear(); // 获取年份
      const month = (currentDate.getMonth() + 1).toString().padStart(2, '0'); // 获取月份（注意：月份是从0开始的，所以要加1）
      const day = currentDate.getDate().toString().padStart(2, '0'); // 获取日期
      const hours = currentDate.getHours().toString().padStart(2, '0'); // 获取小时
      const minutes = currentDate.getMinutes().toString().padStart(2, '0'); // 获取分钟
      const seconds = currentDate.getSeconds().toString().padStart(2, '0'); // 获取秒钟

      return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`; // 返回格式化后的日期和时间
    },
    returnPapers() {
      this.$router.back()
    },
    SortAnswer() {
      // 将 questions 和 userAnswers 合并成一个数组，包含了题目和对应的用户答案
      let combinedQuestions = this.questions.map((question, index) => {
        return {
          question: question,
          answer: this.userAnswers[index]
        };
      });

      // 按照 question 中的 order 字段进行排序，注意 order 从 1 开始，所以要比较正确
      combinedQuestions.sort((a, b) => a.question.order - b.question.order);

      // 排序之后，将问题和答案分别提取出来，更新 questions 和 userAnswers
      this.userAnswers = combinedQuestions.map(item => item.answer);
    },
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
    // 上一题
    prevQuestion() {
      if (this.currentIndex > 0) {
        this.currentIndex -= 1;
      }
    },
    // 下一题
    nextQuestion() {
      if (this.currentIndex < this.questions.length - 1) {
        this.currentIndex += 1;
      }
    },
    // 提交答案
    submitAnswers() {

      // 拼接答案
      this.SortAnswer()
      console.log('answer', this.Resarray);
      request.post("/participation/add", this.Resarray).then(res => {
        const Data = res.data;
      });

      this.showResult = true;
      this.calculateScore();
    },

    // 计算得分
    calculateScore() {
      this.score = 0;
      console.log(this.questions.length)
      for (let index = 0; index < this.questions.length; index++) {
        let question = this.questions[index]
        let userAnswer = this.userAnswers[index]
        console.log(question)
        console.log(userAnswer)
        if (question.answer === userAnswer[0]) {
          this.score += 10;
        }
        //     this.questions.forEach((question, index) => {
        //       if (question.type === 'single') {
        //         // 单选题：用户答案与正确答案匹配
        //         if (this.userAnswers[index][0] === question.answer) {
        //           this.score += 10; // 每题 10 分
        //         }
        //       } else if (question.type === 'multiple') {
        //         // 多选题：比较用户答案和正确答案是否一致
        //         if (
        //             JSON.stringify(this.userAnswers[index].sort()) ===
        //             JSON.stringify(question.answer.sort())
        //         ) {
        //           this.score += 10; // 每题 10 分
        //         }
        //       } else if (question.type === 'fill-in') {
        //         // 填空题：逐一比较用户答案和正确答案
        //         let isCorrect = true;
        //         question.answer.forEach((correctAnswer, blankIndex) => {
        //           if (this.userAnswers[index][blankIndex] !== correctAnswer) {
        //             isCorrect = false;
        //           }
        //         });
        //         if (isCorrect) {
        //           this.score += 10; // 每题 10 分
        //         }
        //       }
        //     });
        //   },
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