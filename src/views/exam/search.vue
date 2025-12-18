<!--<template xmlns="http://www.w3.org/1999/html">-->
<!--  <div>-->
<!--    <div>-->
<!--    <el-input style="width: 200px" placeholder="查询题号"></el-input>-->
<!--      <el-input style="width: 200px;margin:0 6px" placeholder="查询关键词"></el-input>-->
<!--      <el-button type="primary">查询</el-button>-->
<!--  </div>-->
<!--    <div style="margin: 6px 0">-->
<!--      <el-button type="primary" plain>新增</el-button>-->
<!--      <el-button type="danger" plain>批量删除</el-button>-->
<!--    </div>-->

<!--    <el-table-->
<!--        :data="tableData"-->
<!--        border-->
<!--        style="width: 100%"-->
<!--        :header-cell-style="{ backgroundColor :'aliceblue' , color:'#666'}">-->
<!--    <el-table-column-->
<!--        type="selection"-->
<!--        width="55"-->
<!--        align="center">-->
<!--    </el-table-column>-->
<!--    <el-table-column-->
<!--        prop="date"-->
<!--        label="题号"-->
<!--        width="180">-->
<!--    </el-table-column>-->
<!--    <el-table-column-->
<!--        prop="name"-->
<!--        label="题型"-->
<!--        width="180">-->
<!--    </el-table-column>-->
<!--    <el-table-column-->
<!--        prop="key"-->
<!--        label="关键词"-->
<!--        width="180">-->
<!--    </el-table-column>-->
<!--    <el-table-column-->
<!--        prop="address"-->
<!--        label="题干">-->
<!--    </el-table-column>-->
<!--      <el-table-column label="操作" align="center" width="180px">-->
<!--        <template slot-scope="scope">-->
<!--          <el-button-->
<!--              size="mini"-->
<!--              @click="handleEdit(scope.$index, scope.row)">编辑</el-button>-->
<!--          <el-button-->
<!--              size="mini"-->
<!--              type="danger"-->
<!--              @click="handleDelete(scope.$index, scope.row)">删除</el-button>-->
<!--        </template>-->
<!--      </el-table-column>-->
<!--  </el-table>-->
<!--    <div style="margin: 10px 0">-->
<!--      <el-pagination-->
<!--          @size-change="handleSizeChange"-->
<!--          @current-change="handleCurrentChange"-->
<!--          :current-page="currentPage4"-->
<!--          :page-sizes="[100, 200, 300, 400]"-->
<!--          :page-size="100"-->
<!--          layout="total, sizes, prev, pager, next, jumper"-->
<!--          :total="400">-->
<!--      </el-pagination>-->
<!--    </div>-->
<!--  </div>-->
<!--</template>-->

<!--<script>-->
<!--export default {-->
<!--  data() {-->
<!--    return {-->
<!--      tableData: [{-->
<!--        date: '1',-->
<!--        name: '选择题',-->
<!--        address: '1'-->
<!--      }, {-->
<!--        date: '2',-->
<!--        name: '填空题',-->
<!--        address: '2'-->
<!--      }, {-->
<!--        date: '3',-->
<!--        name: '选择题',-->
<!--        address: '2'-->
<!--      }, {-->
<!--        date: '4',-->
<!--        name: '判断题',-->
<!--        address: '4'-->
<!--      }]-->
<!--    }-->
<!--  }-->
<!--}-->
<!--</script>-->
<template xmlns="http://www.w3.org/1999/html">
  <div>
    <div style="margin: 6px 0">
      <div>
        <!--
    <el-dropdown>

      <el-button type="primary">
        模式选择<i class="el-icon-arrow-down el-icon--right"></i>
      </el-button>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item>查询题号</el-dropdown-item>
        <el-dropdown-item>查询关键词</el-dropdown-item>
        <el-dropdown-item>查询题干</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
    -->

        <el-select v-model="value" placeholder="请选择" style="margin-right: 10px;">
          <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
          </el-option>
        </el-select>

        <el-input v-model="keyword" placeholder="查询" style="width: 200px; margin-right: 10px"></el-input>
        <el-button type="primary" @click="handleQuery">查询</el-button>
        <el-button type="info" @click="handleClean">重置</el-button>
      </div>

    </div>

    <el-table
        :data="sliceDate()"
        :header-cell-style="{ backgroundColor :'aliceblue', color:'#666'}"
        border
        height="540px"
        style="width: 100%">
      <!--
      <el-table-column
          type="selection"
          width="55"
          align="center">
      </el-table-column>
      -->
      <!--
      <el-table-column
          prop="id"
          label="题号"
          width="80">
      </el-table-column>
      -->
      <el-table-column
          label="题型"
          prop="type"
          width="100">
      </el-table-column>
      <el-table-column
          :show-overflow-tooltip="true"
          label="关键词"
          prop="keys"
          width="200">
        <template slot-scope="scope">
          <el-tag v-for="(key, index) in scope.row.keys" :key="index"
                  style="margin-left: 5px"
                  type="primary"
          >{{ key }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
          :show-overflow-tooltip="true"
          label="题干"
          prop="des">
      </el-table-column>
      <el-table-column align="center" fixed="right" label="操作" width="80px">
        <template slot-scope="scope">
          <el-button
              type="text"
              @click="handleView(scope.row)"
          >查看<i class="el-icon-view el-icon--right"></i></el-button>
        </template>
      </el-table-column>
    </el-table>
    <div style="margin: 10px 0">
      <el-pagination
          :current-page="pageNum"
          :page-size="pageSize"
          :total="tableData.length"
          layout="total, prev, pager, next, jumper"
          @current-change="handleCurrentChange">
      </el-pagination>
    </div>
  </div>
</template>

<script>
import request from "@/utils/request";

export default {
  name: "search",
  data() {
    return {
      tableData: [],        //动态传入页面数据
      pageNum: 1,  //当前页码
      pageSize: 10, //当前页面大小
      options: [
        {value: 'des', label: "题目描述"},
        {value: 'keyword', label: '题目关键词'}
      ],
      value: '',
      keyword: '',
      loading: true
    }
  },
  mounted() {
    this.allQuestions();

    this.allKeys();

  },
  updated() {
  },
  methods: {
    handleView(row) {
      this.$msgbox({
        dangerouslyUseHTMLString: true,
        title: row.type,
        message: '<strong>' + row.des + '</strong><p></p><p>' + row.anal + '</p>'
      }).then(r => {
      }).catch(e => {
      })
    },
    handleQuery() {
      if (this.value === '' || this.keyword === '') {
        this.tableData = [];
        this.allQuestions();
      } else {
        this.searchQuestions();
      }
    },
    load() {

      //分页查询
    },
    handleCurrentChange(pageNum) {
      this.pageNum = pageNum;
    },
    sliceDate() {
      return this.tableData.slice(this.pageSize * (this.pageNum - 1), this.pageSize * (this.pageNum))
    },
    handleClean() {
      this.keyword = '';
      this.value = '';
    },
    reset() {//清除重置

    },
    allQuestions() {
      request.get('/questions/tf').then((res) => {
        let questions = res.data;
        questions.forEach(q => {
          let question =
              {
                id: q.true_false_question_id,
                type: '判断题',
                des: q.question_description,
                anal: q.question_analysis,
                answer: q.correct_answer,
                keys: []
              }
          request.get('/keywords/in_tf/' + question.id).then(res => {
            let keywords = res.data;
            keywords.forEach(keyword => {
              question.keys.push(keyword['keyword_description'])
            })
          })
          this.tableData.push(question)
        })
      })


      request.get('/questions/mc').then((res) => {
        let questions = res.data;
        questions.forEach(q => {
          let question =
              {
                id: q.multiple_choice_question_id,
                type: '选择题',
                des: q.question_description,
                anal: q.question_analysis,
                answer: String.fromCharCode(65 + q.correct_answer - 1),
                keys: []
              }

          request.get('/keywords/in_mc/' + question.id).then(res => {
            let keywords = res.data;
            keywords.forEach(keyword => {
              question.keys.push(keyword['keyword_description'])
            })
          })

          request.get('/options/in_question/' + question.id).then(res => {
            let options = res.data
            options.forEach((op, index) => {
              let option = ' ' + String.fromCharCode(65 + index) + '.' + op.option_description;
              question.des += option
            })
          })

          this.tableData.push(question)
        })
      })

      request.get('/questions/fi').then((res) => {
        let questions = res.data;
        questions.forEach(q => {
          let question =
              {
                id: q.fill_in_the_blank_question_id,
                type: '填空题',
                des: q.question_description,
                anal: q.question_analysis,
                answer: q.correct_answer,
                keys: []
              }
          request.get('/keywords/in_fi/' + question.id).then(res => {
            let keywords = res.data;
            keywords.forEach(keyword => {
              question.keys.push(keyword['keyword_description'])
            })
          })
          this.tableData.push(question)
        })
      })
    },
    searchQuestions() {
      this.tableData = [];
      request.get("/questions/tf/search/" + this.value + "/" + this.keyword.toString()).then(res => {
        let questions = res.data;
        questions.forEach
        (q => {
          let question =
              {
                id: q.true_false_question_id,
                type: '判断题',
                des: q.question_description,
                anal: q.question_analysis,
                answer: q.correct_answer,
                keys: []
              }
          request.get('/keywords/in_tf/' + question.id).then
          (res => {
                let keywords = res.data;
                keywords.forEach
                (
                    keyword => {
                      question.keys.push(keyword['keyword_description'])
                    }
                )
              }
          )
          this.tableData.push(question);
        })
      })
      request.get("/questions/mc/search/" + this.value + "/" + this.keyword.toString()).then(res => {
        let questions = res.data;
        questions.forEach
        (q => {
          let question =
              {
                id: q.multiple_choice_question_id,
                type: '选择题',
                des: q.question_description,
                anal: q.question_analysis,
                answer: q.correct_answer,
                keys: []
              }
          request.get('/keywords/in_mc/' + question.id).then
          (res => {
                let keywords = res.data;
                keywords.forEach
                (
                    keyword => {
                      question.keys.push(keyword['keyword_description'])
                    }
                )
              }
          )

          request.get('/options/in_question/' + question.id).then(res => {
            let options = res.data
            options.forEach((op, index) => {
              let option = ' ' + String.fromCharCode(65 + index) + '.' + op.option_description;
              question.des += option
            })
          })

          this.tableData.push(question);
        })
      })
      request.get("/questions/fi/search/" + this.value + "/" + this.keyword.toString()).then(res => {
        let questions = res.data;
        questions.forEach
        (q => {
          let question =
              {
                id: q.fill_in_the_blank_question_id,
                type: '填空题',
                des: q.question_description,
                anal: q.question_analysis,
                answer: q.correct_answer,
                keys: []
              }
          request.get('/keywords/in_fi/' + question.id).then
          (res => {
                let keywords = res.data;
                keywords.forEach
                (
                    keyword => {
                      question.keys.push(keyword['keyword_description'])
                    }
                )
              }
          )
          this.tableData.push(question);
        })
      })
    }
  }
}
</script>

<style>
.el-dropdown {
  vertical-align: top;
}

.el-dropdown + .el-dropdown {
  margin-left: 15px;
}

.el-icon-arrow-down {
  font-size: 12px;
}
</style>