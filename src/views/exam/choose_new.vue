<script>
export default {
  name: "Choose"
}
</script>

<template>
  <div class="enterprise-container">
    <el-card class="form-card" shadow="never">
      <div class="card-header">
        <h2 class="enterprise-title">智能组卷</h2>
        <div class="header-subtitle">试卷参数配置中心</div>
      </div>

      <el-form ref="form" :model="form" label-position="top" class="compact-form">
        <!-- 模式选择 -->
        <div class="form-section">
          <h3 class="section-title"><i class="el-icon-s-operation"></i> 组卷策略</h3>
          <el-radio-group v-model="form.mode" class="strategy-radio">
            <el-radio-button label="newrandom">智能配题</el-radio-button>
            <el-radio-button label="random">随机组卷</el-radio-button>
            <el-radio-button label="byCategory">关键词组卷</el-radio-button>
          </el-radio-group>

          <el-select
              v-if="form.mode === 'byCategory'"
              v-model="form.keyword"
              class="keyword-select"
              placeholder="请选择关键词"
              filterable
          >
            <el-option
                v-for="(category, index) in categories"
                :key="index"
                :label="category.keyword_description"
                :value="category.keyword_description"
            />
          </el-select>
        </div>

        <!-- 题目配置 -->
        <div class="form-section">
          <h3 class="section-title"><i class="el-icon-document"></i> 题目配置</h3>
          <div class="question-row">
            <el-form-item label="判断题数量" class="inline-item">
              <el-input-number
                  v-model="form.judgmentCount"
                  :min="0"
                  controls-position="right"
                  class="compact-input"
              />
            </el-form-item>

            <el-form-item label="选择题数量" class="inline-item">
              <el-input-number
                  v-model="form.choiceCount"
                  :min="0"
                  controls-position="right"
                  class="compact-input"
              />
            </el-form-item>

            <el-form-item label="填空题数量" class="inline-item">
              <el-input-number
                  v-model="form.fillBlankCount"
                  :min="0"
                  controls-position="right"
                  class="compact-input"
              />
            </el-form-item>
          </div>
        </div>

        <!-- 元数据配置 -->
        <div class="form-section">
          <h3 class="section-title"><i class="el-icon-setting"></i> 试卷属性</h3>
          <div class="metadata-grid">
            <el-form-item label="试卷标题" class="form-item-full">
              <el-input
                  v-model="form.filldescriptionCount"
                  placeholder="请输入试卷标题"
                  class="compact-input"
              />
            </el-form-item>

            <el-form-item label="生效时间" class="time-item">
              <el-input
                  type="datetime-local"
                  v-model="form.filltimeCount"
                  class="time-input"
              />
            </el-form-item>

            <el-form-item label="积分奖励" class="score-item">
              <el-tag type="info" class="score-tag">
                {{ fillrewardCount }} 积分
              </el-tag>
            </el-form-item>

            <el-form-item label="截止时间" class="time-item">
              <el-input
                  type="datetime-local"
                  v-model="form.filldeadlineCount"
                  class="time-input"
              />
            </el-form-item>


          </div>
        </div>

        <!-- 操作按钮 -->
        <div class="form-actions">
          <el-button
              type="primary"
              icon="el-icon-check"
              class="submit-btn"
              @click="handleSubmit"
          >
            生成试卷
          </el-button>
        </div>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import request from "@/utils/request";

export default {
  name: "ExamComposer",
  data() {
    return {
      // 表单数据
      form: {
        mode: "", // 试卷组成方式: "random" 或 "byCategory"
        categories: [], // 关键词选择
        judgmentCount: 0, // 判断题数量
        choiceCount: 0, // 选择题数量
        fillBlankCount: 0, // 填空题数量
        fillidCount: '',//试卷id
        filldescriptionCount: '',//试卷标题
        filltimeCount: '',//试卷开始日期
        filldeadlineCount: '',//试卷截至日期
        fillrewardCount: 0,
        testid: [],
        test: [],
        keyword: '',//当前选择关键词
        keyword_description: [],//所有关键词
        column_id: [],//关键词所属栏目id
        keyword_id: [],//关键词id
      },
      //选择题元素
      choicequestion: {
        answer: [],//答案
        cmid: [],//选择题号
        analysis: [],//解析
        description: [],//题干
        all: [],
        selectids: [],

      },
      //填空题元素
      fiquestion: {
        answer: [],//答案
        fiid: [],//选择题号
        analysis: [],//解析
        description: [],//题干
        all: [],
        selectids: []
      },
      //判断题元素
      tfquestion: {
        answer: [],//答案
        tfid: [],//选择题号
        analysis: [],//解析
        description: [],//题干
        all: [],
        selectids: []
      },
      //关键词选择题元素
      flexmcquestion: {
        answer: [],//答案
        cmid: [],//选择题号
        analysis: [],//解析
        description: [],//题干
        all: [],
        selectids: [],

      },
      //关键词填空题元素
      flexfiquestion: {
        answer: [],//答案
        fiid: [],//选择题号
        analysis: [],//解析
        description: [],//题干
        all: [],
        selectids: []
      },
      //关键词判断题元素
      flextfquestion: {
        answer: [],//答案
        tfid: [],//选择题号
        analysis: [],//解析
        description: [],//题干
        all: [],
        selectids: []
      },
    };
  },
  created() {
    // 在组件加载时获取栏目数据
    this.fetchCategories();
    this.fetchgetid();
    this.fetchgetchoice();
    this.fetchgetfi();
    this.fetchgettf();

  },
  computed: {
    formArray() {
      // 创建一个对象来存储键值对
      let result = {};
      // 为每个元素添加键值对，键为自定义的字符串，值为原数组元素
      result['grouping_method'] = this.form.mode;
      result['test_paper_id'] = this.form.fillidCount;
      result['paper_description'] = this.form.filldescriptionCount;
      result['points_reward'] = this.fillrewardCount;
      result['create_date'] = this.formatDatetime(this.form.filltimeCount);
      result['deadline'] = this.formatDatetime(this.form.filldeadlineCount);
      return result;
    },
    fillrewardCount() {
      // 根据题目数量计算积分奖励
      return 10 * this.form.judgmentCount + 10 * this.form.choiceCount + 10 * this.form.fillBlankCount;
    },
    cmformArray() {
      // 创建一个对象来存储键值对
      let result = {};
      // 为每个元素添加键值对，键为自定义的字符串，值为原数组元素
      result['correct_answer'] = this.choicequestion.answer;
      result['question_analysis'] = this.choicequestion.analysis;
      result['question_description'] = this.choicequestion.description;
      result['multiple_choice_question_id'] = this.choicequestion.cmid;
      return result;
    },
    tfformArray() {
      // 创建一个对象来存储键值对
      let result = {};
      // 为每个元素添加键值对，键为自定义的字符串，值为原数组元素
      result['correct_answer'] = this.tfquestion.answer;
      result['question_analysis'] = this.tfquestion.analysis;
      result['question_description'] = this.tfquestion.description;
      result['true_false_question_id'] = this.tfquestion.tfid;
      return result;
    },
    fiformArray() {
      // 创建一个对象来存储键值对
      let result = {};
      // 为每个元素添加键值对，键为自定义的字符串，值为原数组元素
      result['correct_answer'] = this.fiquestion.answer;
      result['question_analysis'] = this.fiquestion.analysis;
      result['question_description'] = this.fiquestion.description;
      result['fill_in_the_blank_question_id'] = this.fiquestion.fiid;
      return result;
    },
    keywordsArray() {
      // 创建一个对象来存储键值对
      let result = {};
      // 为每个元素添加键值对，键为自定义的字符串，值为原数组元素
      result['keyword_id'] = this.form.keyword_id;
      result['column_id'] = this.form.column_id;
      result['keyword_description'] = this.form.keyword;
      return result;
    }
  },
  methods: {
    //
    handlequestionnumber()
    {
      if(this.form.mode==='byCategory')
      {
        if(this.form.choiceCount>this.flexmcquestion.all.length)
        {
          this.$message.error("题库中选择题没有这么多！");
        }
        if(this.form.judgmentCount>this.flextfquestion.all.length)
        {
          this.$message.error("题库中判断题没有这么多！");
        }
        if(this.form.fillBlankCount>this.flexfiquestion.all.length)
        {
          this.$message.error("题库中填空题没有这么多！");
        }
      }
      if(this.form.choiceCount>this.choicequestion.all.length)
      {
        this.$message.error("题库中选择题没有这么多！");
      }
      if(this.form.judgmentCount>this.tfquestion.all.length)
      {
        this.$message.error("题库中判断题题没有这么多！");
      }
      if(this.form.fillBlankCount>this.fiquestion.all.length)
      {
        this.$message.error("题库中填空题没有这么多！");
      }

    },
    // 切换模式时重置相关选项
    handleModeChange() {
      if (this.form.mode === "random") {
        this.form.categories = []; // 清空栏目选择
      }
    },
    handlechange() {
      this.test1()
      this.fetchgetflexmc()
      this.fetchgetflextf()
      this.fetchgetflexfi()
    },
    test1() {
      console.log(this.form.keyword);
    },

    formatDatetime(datetime) {
      // 检查是否存在值
      if (!datetime) return '';
      // 替换 'T' 为 ' ' 并补充秒数 ':00'
      return datetime.replace('T', ' ') + ':00';
    },
    //获取填空题数据
    fetchgetfi() {
      request.get("/questions/fi") // 后台接口路径
          .then((response) => {
            // 假设返回的数据是全部选择题的数据
            this.fi = response.data;
            this.fiquestion.all = this.fi;
          })
          .catch((error) => {
            this.$message.error("获取填空题数据失败！");
            console.error("获取填空题失败:", error);
          });
    },
    //获取判断题数据
    fetchgettf() {
      request.get("/questions/tf") // 后台接口路径
          .then((response) => {
            // 假设返回的数据是全部选择题的数据
            this.tf = response.data;
            this.tfquestion.all = this.tf
          })
          .catch((error) => {
            this.$message.error("获取判断题数据失败！");
            console.error("获取判断题失败:", error);
          });
    },
    //获取选择题数据
    fetchgetchoice() {
      request.get("/questions/mc") // 后台接口路径
          .then((response) => {
            // 假设返回的数据是全部选择题的数据
            this.choice = response.data;
            this.choicequestion.all = this.choice;
            console.log(this.choicequestion.all);
          })
          .catch((error) => {
            this.$message.error("获取选择题数据失败！");
            console.error("获取选择题失败:", error);
          });
    },
    //获取满足关键词选择题数据
    fetchgetflexmc() {
      request.get("/questions/mc/search/keyword/" + this.form.keyword) // 后台接口路径
          .then((response) => {
            // 假设返回的数据是全部选择题的数据
            this.choice = response.data;
            this.flexmcquestion.all = this.choice;
            console.log(this.flexmcquestion.all);
          })
          .catch((error) => {
            this.$message.error("获取关键词选择题数据失败！");
            console.error("获取关键词选择题失败:", error);
          });
    },
    //获取满足关键词判断题数据
    fetchgetflextf() {
      request.get("/questions/tf/search/keyword/" + this.form.keyword) // 后台接口路径
          .then((response) => {
            // 假设返回的数据是全部判断题的数据
            this.tf = response.data;
            this.flextfquestion.all = this.tf
          })
          .catch((error) => {
            this.$message.error("获取关键词判断题数据失败！");
            console.error("获取关键词判断题失败:", error);
          });
    },
    //获取满足关键词填空题数据
    fetchgetflexfi() {
      request.get("/questions/fi/search/keyword/" + this.form.keyword) // 后台接口路径
          .then((response) => {
            // 假设返回的数据是全部填空题的数据
            this.fi = response.data;
            this.flexfiquestion.all = this.fi;
          })
          .catch((error) => {
            this.$message.error("获取关键词填空题数据失败！");
            console.error("获取关键词填空题失败:", error);
          });
    },
    //获取现有试卷数据
    fetchgetid() {
      request.get("/papers") // 后台接口路径
          .then((response) => {
            // 假设返回的数据是一个试卷数组
            this.test = response.data;
            this.form.test = this.test;
            console.log(this.test);
            const existingIds = new Set(this.form.test.map(category => category.test_paper_id));
            let temple;
            do {
              temple = Math.floor(Math.random() * 1000); // 可根据需要调整范围
            } while (existingIds.has(temple));
            this.form.fillidCount = temple;
          })
          .catch((error) => {
            this.$message.error("获取试卷数据失败！");
            console.error("获取试卷失败:", error);
          });
    },
    // 获取关键词数据
    fetchCategories() {
      request.get("/keywords") // 假设后台接口路径为 /api/getCategories
          .then((response) => {
            // 假设返回的数据是一个关键词数组
            this.categories = response.data;
            console.log(this.categories);
          })
          .catch((error) => {
            this.$message.error("获取关键词数据失败！");
            console.error("获取关键词失败:", error);
          });

    },
    randomcmid(count) {
      //随机获得选择题号
      this.getchid();
      const randomIds = [];
      const selectedIndices = []; // 存储已经选取过的元素索引
      for (let i = 0; i < count; i++) {
        let randomIndex;
        do {
          randomIndex = Math.floor(Math.random() * this.choicequestion.cmid.length);
        } while (selectedIndices.includes(randomIndex)); // 检查是否已经选取过
        selectedIndices.push(randomIndex); // 存储已选索引
        const randomId = this.choicequestion.cmid[randomIndex];
        randomIds.push(randomId);
      }
      this.choicequestion.selectids = randomIds;
      console.log(this.choicequestion.selectids);
      this.cmsubmit(count);
    },
    randomtfid(count) {
      //随机获得判断题号
      this.gettfid();
      const randomIds = [];
      const selectedIndices = []; // 存储已经选取过的元素索引
      for (let i = 0; i < count; i++) {
        let randomIndex;
        do {
          randomIndex = Math.floor(Math.random() * this.tfquestion.tfid.length);
        } while (selectedIndices.includes(randomIndex)); // 检查是否已经选取过
        selectedIndices.push(randomIndex); // 存储已选索引
        const randomId = this.tfquestion.tfid[randomIndex];
        randomIds.push(randomId);
      }
      this.tfquestion.selectids = randomIds;
      console.log(this.tfquestion.selectids);
      this.tfsubmit(count);

    },
    randomfiid(count) {
      //随机获得填空题号
      this.getfiid();
      const randomIds = [];
      const selectedIndices = []; // 存储已经选取过的元素索引
      for (let i = 0; i < count; i++) {
        let randomIndex;
        do {
          randomIndex = Math.floor(Math.random() * this.fiquestion.fiid.length);
        } while (selectedIndices.includes(randomIndex)); // 检查是否已经选取过
        selectedIndices.push(randomIndex); // 存储已选索引
        const randomId = this.fiquestion.fiid[randomIndex];
        randomIds.push(randomId);
      }
      this.fiquestion.selectids = randomIds;
      console.log(this.fiquestion.selectids);
      this.fisubmit(count);

    },
    flexrandomcmid(count) {
      //随机获得选择题号
      this.getflchid();
      const randomIds = [];
      const selectedIndices = []; // 存储已经选取过的元素索引
      for (let i = 0; i < count; i++) {
        let randomIndex;
        do {
          randomIndex = Math.floor(Math.random() * this.flexmcquestion.cmid.length);
        } while (selectedIndices.includes(randomIndex)); // 检查是否已经选取过
        selectedIndices.push(randomIndex); // 存储已选索引
        const randomId = this.flexmcquestion.cmid[randomIndex];
        randomIds.push(randomId);
      }
      this.flexmcquestion.selectids = randomIds;
      console.log(this.flexmcquestion.selectids);
      this.flexcmsubmit(count);
    },
    flexrandomtfid(count) {
      //随机获得判断题号
      this.getfltfid();
      const randomIds = [];
      const selectedIndices = []; // 存储已经选取过的元素索引
      for (let i = 0; i < count; i++) {
        let randomIndex;
        do {
          randomIndex = Math.floor(Math.random() * this.flextfquestion.tfid.length);
        } while (selectedIndices.includes(randomIndex)); // 检查是否已经选取过
        selectedIndices.push(randomIndex); // 存储已选索引
        const randomId = this.flextfquestion.tfid[randomIndex];
        randomIds.push(randomId);
      }
      this.flextfquestion.selectids = randomIds;
      console.log(this.flextfquestion.selectids);
      this.flextfsubmit(count);

    },
    flexrandomfiid(count) {
      //随机获得填空题号
      this.getflfiid();
      const randomIds = [];
      const selectedIndices = []; // 存储已经选取过的元素索引
      for (let i = 0; i < count; i++) {
        let randomIndex;
        do {
          randomIndex = Math.floor(Math.random() * this.flexfiquestion.fiid.length);
        } while (selectedIndices.includes(randomIndex)); // 检查是否已经选取过
        selectedIndices.push(randomIndex); // 存储已选索引
        const randomId = this.flexfiquestion.fiid[randomIndex];
        randomIds.push(randomId);
      }
      this.flexfiquestion.selectids = randomIds;
      console.log(this.flexfiquestion.selectids);
      this.flexfisubmit(count);

    },
    getchid() {
      const existingIds = this.choicequestion.all.map(category => category.multiple_choice_question_id);
      this.choicequestion.cmid = existingIds;
    },
    //获取选择题题目id
    gettfid() {
      const existingIds = this.tfquestion.all.map(category => category.true_false_question_id);
      this.tfquestion.tfid = existingIds;
    },
    //获取题目id
    getfiid() {
      const existingIds = this.fiquestion.all.map(category => category.fill_in_the_blank_question_id);
      this.fiquestion.fiid = existingIds;
      console.log(this.fiquestion.fiid);
    },
    getflchid() {
      const existingIds = this.flexmcquestion.all.map(category => category.multiple_choice_question_id);
      this.flexmcquestion.cmid = existingIds;
    },
    //获取题目id
    getfltfid() {
      const existingIds = this.flextfquestion.all.map(category => category.true_false_question_id);
      this.flextfquestion.tfid = existingIds;
    },
    //获取题目id
    getflfiid() {
      const existingIds = this.flexfiquestion.all.map(category => category.fill_in_the_blank_question_id);
      this.flexfiquestion.fiid = existingIds;
      console.log(this.flexfiquestion.fiid);
    },
    // 提交表单
    handleSubmit() {
      if (
          // (this.form.mode === "byCategory" && this.form.categories.length === 0) ||
          this.form.judgmentCount <= 0 ||
          this.form.choiceCount <= 0 ||
          this.form.fillBlankCount <= 0
      ) {
        this.$message.error("请完整填写表单！");
        return;
      }
      console.log(this.formArray);
      request.post("/papers/create", this.formArray).then(res => {
        const examData = res.data;
        console.log(this.form.mode);
        if (this.form.mode === 'random'||this.form.mode==='newrandom') {
          this.submit();
        }
        if (this.form.mode === 'byCategory') {
          this.fsubmit();
        }
        this.$router.push({
          path: "/Papers", // 路由路径（例如跳转到试卷预览页面）
          query: {
            examData,
          }, // 如果需要传递数据，可以通过 query 参数传递
        });
      })
          .catch((error) => {
            this.$message.error("提交失败，请稍后再试！");
            console.error("提交失败:", error);
          });
    },
    submit() {
      this.randomcmid(this.form.choiceCount);//随机选择选择题号并提交
      this.randomtfid(this.form.judgmentCount);//随机选择判断题号并提交
      this.randomfiid(this.form.fillBlankCount);//随机选择填空题号并提交
    },
    fsubmit() {//关键词题号
      this.flexrandomcmid(this.form.choiceCount);//随机选择选择题号并提交
      this.flexrandomtfid(this.form.judgmentCount);//随机选择判断题号并提交
      this.flexrandomfiid(this.form.fillBlankCount);//随机选择填空题号并提交
    },
    //提交选择题题号
    cmsubmit(count) {
      let temple;
      let i;
      for (i = 0; i < count; i++) {
        let id = this.form.fillidCount;

        temple = this.choicequestion.selectids[i];
        let postData = {
          test_paper_id: id,
          multiple_choice_question_id: temple,
          question_order_in_paper: i+1
        };
        console.log(postData);
        request.post("/papers/add/mc", postData).then(res => {
          const examData = res.data;
        })
            .catch((error) => {
              this.$message.error("选择题提交失败，请稍后再试！");
              console.error("选择题提交失败:", error);
            });
      }
    },
    tfsubmit(count) {
      let temple;
      let i;
      for (i = 0; i < count; i++) {
        let id = this.form.fillidCount;

        temple = this.tfquestion.selectids[i];
        let postData = {
          test_paper_id: id,
          question_order_in_paper: i+1+Number(this.form.choiceCount),
          true_false_question_id: temple
        };
        console.log('随机判断',postData);
        request.post("/papers/add/tf", postData).then(res => {
          const examData = res.data;
        })
            .catch((error) => {
              this.$message.error("判断题提交失败，请稍后再试！");
              console.error("判断题提交失败:", error);
            });
      }
    },
    fisubmit(count) {
      let temple;
      let i;
      for (i = 0; i < count; i++) {
        temple = this.fiquestion.selectids[i];

        let id = this.form.fillidCount;
        let postData = {
          test_paper_id: id,
          question_order_in_paper: (i + 1) + Number(this.form.choiceCount) + Number(this.form.judgmentCount),
          fill_in_the_blank_question_id: temple
        };
        console.log('随机填空',postData);
        request.post("/papers/add/fi", postData).then(res => {
          const examData = res.data;
        })
            .catch((error) => {
              this.$message.error("填空题提交失败，请稍后再试！");
              console.error("填空题提交失败:", error);
            });
      }
    },
    //提交关键词选择题题号
    flexcmsubmit(count) {
      let temple;
      let i;
      for (i = 0; i < count; i++) {
        let id = this.form.fillidCount;

        temple = this.flexmcquestion.selectids[i];
        let postData = {
          test_paper_id: id,
          multiple_choice_question_id: temple,
          question_order_in_paper: i+1
        };
        console.log(postData);
        request.post("/papers/add/mc", postData).then(res => {
          const examData = res.data;
        })
            .catch((error) => {
              this.$message.error("选择题提交失败，请稍后再试！");
              console.error("选择题提交失败:", error);
            });
      }
    },
    flextfsubmit(count) {
      let temple;
      let i;
      for (i = 0; i < count; i++) {
        let id = this.form.fillidCount;

        temple = this.flextfquestion.selectids[i];
        let postData = {
          test_paper_id: id,
          question_order_in_paper: i+1+Number(this.form.choiceCount),
          true_false_question_id: temple
        };
        console.log(postData);
        request.post("/papers/add/tf", postData).then(res => {
          const examData = res.data;
        })
            .catch((error) => {
              this.$message.error("判断题提交失败，请稍后再试！");
              console.error("判断题提交失败:", error);
            });
      }
    },
    flexfisubmit(count) {
      let temple;
      let i;
      for (i = 0; i < count; i++) {
        temple = this.flexfiquestion.selectids[i];

        let id = this.form.fillidCount;
        let postData = {
          test_paper_id: id,
          question_order_in_paper: (i + 1) + Number(this.form.choiceCount) + Number(this.form.judgmentCount),
          fill_in_the_blank_question_id: temple
        };
        console.log(postData);
        request.post("/papers/add/fi", postData).then(res => {
          const examData = res.data;
        })
            .catch((error) => {
              this.$message.error("填空题提交失败，请稍后再试！");
              console.error("填空题提交失败:", error);
            });
      }
    },
  },
};
</script>

<style scoped>
.enterprise-container {
  max-width: 1000px;
  margin: 20px auto; /* 原40px → 20px */
  padding: 0 20px;
  min-height: 80vh; /* 原100vh → 80vh */
}

.form-card {
  border: 1px solid #ebeef5;
  border-radius: 8px;
  background: #ffffff;
}

.card-header {
  padding: 24px 32px;
  border-bottom: 1px solid #ebeef5;
}

.enterprise-title {
  font-size: 20px;
  color: #303133;
  margin: 0;
  font-weight: 600;
}

.header-subtitle {
  color: #909399;
  font-size: 12px;
  margin-top: 4px;
}

.compact-form {
  padding: 16px 24px;
}

.form-section {
  margin-bottom: 32px;
  padding: 20px;
  background: #f8f9fc;
  border-radius: 6px;
  border: 1px solid #ebeef5;
}

.section-title {
  font-size: 14px; /* 原16px → 14px */
  margin: 0 0 16px 0; /* 原20px → 16px */
  color: #303133;
  display: flex;
  align-items: center;
}

.section-title i {
  margin-right: 8px;
  color: #409EFF;
}

.strategy-radio {
  margin-bottom: 16px;
}

.keyword-select {
  width: 300px;
}

.grid-layout {
  display: grid;
  grid-template-columns: 160px 1fr;
  gap: 24px;
}

.question-config,
.metadata-config {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 24px;
}

.compact-item {
  margin-bottom: 0;
}

.compact-item >>> .el-form-item__label {
  font-size: 13px;
  color: #606266;
  padding-bottom: 6px;
}

.compact-input >>> .el-input__inner {
  height: 32px; /* 原36px → 32px */
  line-height: 32px;
  font-size: 13px;
}

.compact-date >>> .el-input__inner {
  height: 36px;
}

.score-tag {
  font-size: 12px; /* 原14px → 12px */
  padding: 6px 12px; /* 原8px 16px → 6px 12px */
}

.time-group {
  display: grid;
  gap: 16px;
}

.form-actions {
  margin-top: 32px;
  text-align: center;
}

.submit-btn {
  padding: 8px 32px; /* 原12px 40px → 8px 32px */
  font-size: 13px; /* 原14px → 13px */
  letter-spacing: 1px;
}
.question-row {
  display: flex;
  flex-wrap: wrap;
  gap: 24px;
}

.inline-item {
  margin-bottom: 0;
  display: flex;
  align-items: center;
}

.inline-item >>> .el-form-item__label {
  padding-right: 12px;
  line-height: 36px;
  margin-bottom: 0;
}

/* 时间输入组件样式 */
.time-input >>> .el-input__inner {
  height: 32px; /* 原36px → 32px */
  width: 200px; /* 原240px → 200px */
}

/* 元数据栅格布局 */
.metadata-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 12px !important;
}

.form-item-full {
  margin-bottom: 8px !important;
}

.time-item {
  margin-bottom: 8px !important;
}

.score-item {
  margin-bottom: 8px !important;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .question-row {
    flex-direction: column;
    gap: 16px;
  }

  .inline-item >>> .el-form-item__content {
    width: 100%;
  }

  .time-input >>> .el-input__inner {
    width: 100%;
  }


  .metadata-grid {
    grid-template-columns: 1fr;
  }
}
</style>
