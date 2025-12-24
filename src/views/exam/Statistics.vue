<!--
/**
 * @component Statistics
 * @description 测评情况统计 - 展示试卷答题统计数据,包括各选项选择人数、填空题详情、答题人数分布
 * @author Party Building System
 */
-->
<template>
  <!-- 统计容器 -->
  <div id="app" class="container">
    <!-- 页面标题 -->
    <div class="header">
      <h1>测评情况查看</h1>
    </div>

    <!-- 题目展示 -->
    <el-scrollbar class="custom-scrollbar" style="height: 80%; overflow-y: auto;">
    <div v-for="(question, index) in questions" :key="index" class="question-card">
      <!-- 题目标题 -->
      <div style="margin-bottom: 20px">
        <h2>题目 {{ index + 1 }}: {{ question.text }}</h2>
        <el-tag v-if="question.type === 'single'" type="success">单选题</el-tag>
        <el-tag v-if="question.type === 'fill-in'" type="warning">填空题</el-tag>
      </div>

      <!-- 单选题和判断题 -->
      <div v-if="question.type === 'single'" class="answer-container">
        <div v-for="(option, idx) in question.options" :key="idx" class="answer-item">
          <!-- 左边文字内容 -->
          <div class="answer-left">
            {{ option.text }}（{{ option.count }}人选择）
            <!-- 点击选项时显示选择该选项的用户 -->
            <el-button @click="showUsers(option)" size="mini">查看选择用户</el-button>
          </div>
          <!-- 中间进度条 -->
          <div class="answer-middle">
            <el-progress
                :percentage="Math.round((option.count / total) * 100)"
                :text-inside="false"
                stroke-width="10"
            ></el-progress>
          </div>
          <!-- 右边留空 -->
          <div class="answer-right"></div>
        </div>
      </div>

      <!-- 填空题的显示 -->
      <div v-else-if="question.type === 'fill-in'" class="answer-container">
        <!-- 明细功能 -->
        <el-collapse v-model="question.expanded">
          <el-collapse-item title="查看明细" :name="index.toString()">
            <div v-for="(user, idx) in question.detailedAnswers" :key="idx">
              <p>{{ user.user_name }}: {{ user.user_answer }}</p>
            </div>
          </el-collapse-item>
        </el-collapse>
      </div>
    </div>
    </el-scrollbar>

    <!-- 用户选择列表浮现窗口 -->
    <el-dialog :visible.sync="showUserDialog" title="选择该选项的用户">
      <el-table :data="selectedUsers" style="width: 100%">
        <el-table-column label="用户名" prop="user_name"></el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button @click="showUserDialog = false">关闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>


<script>
import request from "@/utils/request";

export default {
  name: "TeacherView",
  /**
   * @description 组件数据
   * @returns {Object} 包含试卷信息、题目列表、答题记录等数据
   */
  data() {
    return {
      paper: {},
      questions: [],
      AlluserAnswers: [],
      total: 0,
      showUserDialog: false, // 控制用户选择列表浮现
      selectedUsers: [], // 存储选择该选项的用户列表
    };
  },
  async created() {
    const id = parseInt(this.$route.query.id);

    try {
      const papersRes = await request.get('/papers');
      let papers = papersRes.data.sort((a, b) => new Date(b.create_date) - new Date(a.create_date));
      papers.forEach(paper => {
        if (paper.test_paper_id === id) {
          this.paper = paper;
        }
      });

      const tfRes = await request.get('/questions/tf/in_paper/' + this.paper.test_paper_id);
      let questions = tfRes.data;
      questions.forEach(q => {
        this.questions.push({
          text: q.question_description,
          type: 'single',
          options: [
            { text: '正确', count: 0, users: [] },
            { text: '错误', count: 0, users: [] },
          ],
          answer: q.correct_answer,
          rate: 0,
          order: q.question_order_in_paper,  // 存储 order 字段
          expanded: false,
          detailedAnswers: [],
        });
      });

      const mcRes = await request.get('/questions/mc/in_paper/' + this.paper.test_paper_id);
      await Promise.all(mcRes.data.map(async (q) => {
        const optionsRes = await request.get('/options/in_question/' + q.multiple_choice_question_id);
        let question = {
          text: q.question_description,
          type: 'single',
          options: [],
          answer: q.correct_answer,
          rate: 0,
          order: q.question_order_in_paper,  // 存储 order 字段
          expanded: false,
          detailedAnswers: [],
        };
        optionsRes.data.forEach(op => {
          question.options.push({
            text: op.option_description,
            count: 0,
            users: [],
          });
          if (q.correct_answer === op.order_in_question) {
            question.answer = op.option_description;
          }
        });
        this.questions.push(question);
      }));

      const fiRes = await request.get('/questions/fi/in_paper/' + this.paper.test_paper_id);
      fiRes.data.forEach(q => {
        this.questions.push({
          text: q.question_description,
          type: 'fill-in',
          blanks: [''],
          answer: q.correct_answer,
          rate: 0,
          order: q.question_order_in_paper,  // 存储 order 字段
          expanded: false,
          detailedAnswers: q.answers || [],
        });
      });

      // 在这里对 questions 数组按照 order 排序
      this.questions.sort((a, b) => a.order - b.order);  // 按照 order 字段排序

      // 获取答题记录
      const participationRes = await request.get('/participation/paperwithname/' + this.paper.test_paper_id);
      let participation = participationRes.data;
      participation.forEach(q => {
        this.total += 1;
        this.AlluserAnswers.push({
          userid: q.user_id,
          testrecord: q.test_record,
          username: q.user_name,
        });
      });
      this.countAnswers(); // 解析答题记录

    } catch (error) {
      console.error('Error fetching data:', error);
    }
  },

  methods: {
    /**
     * @description 显示选择该选项的用户列表
     * @param {Object} option - 选项对象,包含text、count、users等属性
     */
    showUsers(option) {
      this.selectedUsers = [];
      this.AlluserAnswers.forEach(answer => {
        const answers = answer.testrecord.split('#');
        if (answers.includes(option.text)) {
          this.selectedUsers.push({ user_name: answer.username }); // 确保推送选项的用户
        }
      });
      this.showUserDialog = true;
    },

    /**
     * @description 显示填空题的详细作答情况
     */
    displayFillInUsers() {
      this.questions.forEach((question) => {
        if (question.type === 'fill-in') {
          question.detailedAnswers = [];
          this.AlluserAnswers.forEach(answer => {
            const answers = answer.testrecord.split('#');
            const questionIndex = this.questions.indexOf(question); // 获取该题在 questions 数组中的索引
            if (answers[questionIndex] !== undefined) {
              // 保存该题作答的用户名和答案
              question.detailedAnswers.push({
                user_name: answer.username,
                user_answer: answers[questionIndex], // 显示作答用户的答案
              });
            }
          });
        }
      });
    },
    /**
     * @description 统计单选题的选项选择情况
     */
    countSingleChoiceAnswers() {
      this.AlluserAnswers.forEach(userAnswer => {
        const answers = userAnswer.testrecord.split('#');
        this.questions.forEach((question, index) => {
          if (question.type === 'single' && answers[index]) {
            question.options.forEach(option => {
              if (answers[index] === option.text) {
                option.count += 1;
                if (!option.users.includes(userAnswer.username)) {  // 确保没有重复用户
                  option.users.push(userAnswer.username);
                }
              }
            });
          }
        });
      });
    },

    /**
     * @description 解析所有用户的答题记录并统计
     */
    countAnswers() {
      this.countSingleChoiceAnswers();
      this.displayFillInUsers();
    },
  },
};
</script>



<style scoped>
/* 页面样式 */
.container {
  max-width: 900px; /* 保持宽度 */
  height: 90vh; /* 高度设置为占满整个视口 */
  margin: 0 auto;
  padding: 20px;
  display: flex;
  flex-direction: column;
  font-family: Arial, sans-serif;
  background: #f5f7fa;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  overflow-x: hidden; /* 去掉水平滚动条 */
}

.custom-scrollbar {
  height: 80%; /* 使 el-scrollbar 占满父容器的高度 */
  overflow-y: auto; /* 只允许竖直滚动 */
}

.header {
  margin-bottom: 20px;
}

.header h1 {
  font-size: 2em;
  color: #409eff;
  text-align: center;
}

.question-card {
  width: 100%;
  background: #ffffff;
  padding: 20px;
  border-radius: 10px;
  margin-bottom: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.question-card h2 {
  font-size: 1.2em;
  margin-bottom: 10px;
}

.answer-container {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.answer-item {
  display: flex;
  align-items: center;
}

.answer-left {
  flex: 1;
  font-size: 14px;
  color: #333;
}

.answer-middle {
  flex: 2;
  margin: 0 10px;
}

.answer-right {
  flex: 1;
}
</style>
