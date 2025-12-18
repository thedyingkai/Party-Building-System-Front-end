
<template xmlns="http://www.w3.org/1999/html">
  <div>
    <div style="margin: 6px 0">
      <div>
        <el-select style="margin-right: 10px;" v-model="value" placeholder="请选择">
          <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
          </el-option>
        </el-select>

      <el-input  style="width: 200px; margin-right: 10px" v-model="keyword" placeholder="查询"></el-input>
      <el-button  type="primary" @click="handleQuery">查询</el-button>
      <el-button  type="info" @click="handleClean">重置</el-button>
<!--      <el-button  style="float: right;" type="danger" icon="el-icon-delete" @click="handleDeleteBatch" >批量删除</el-button>-->

              <el-form id="uploadtest" enctype="multipart/form-data" method="post" action="/batch/import" style="margin-top: 20px;">
                <input type="file" name="file"  accept=".xls,.xlsx">
                <el-button style=" height: 35px;" type="success" icon="el-icon-plus" @click="doupload('uploadtest')">上传题库</el-button>
              </el-form>



        <el-button  style="float: right;" type="primary" icon="el-icon-plus" @click="handleexport">下载题库</el-button>
      <el-button  style="float: right;" type="success" icon="el-icon-plus" @click="handleAdd">添加</el-button>
      </div>

    </div>

    <el-table
        @selection-change="handleSelectionChange"
        :data="sliceDate()"
        border
        height="450px"
        style="width: 100%"
        :header-cell-style="{ backgroundColor :'aliceblue', color:'#666'}">
<!--      <el-table-column-->
<!--          type="selection"-->
<!--          width="55"-->
<!--          align="center">-->
<!--      </el-table-column>-->
      <el-table-column
          prop="id"
          label="题号"
          width="80">
      </el-table-column>
      <el-table-column
          prop="type"
          label="题型"
          width="100">
      </el-table-column>
      <el-table-column
          prop="keys"
          label="关键词"
          width="200"
          :show-overflow-tooltip="true">
          <template slot-scope="scope">
            <el-tag  type="primary" style="margin-left: 5px"
                v-for="(key, index) in scope.row.keys"
                :key="index"
            >{{ key }}</el-tag>
          </template>
      </el-table-column>
      <el-table-column
          prop="des"
          label="题干"
          :show-overflow-tooltip="true">
      </el-table-column>
      <el-table-column
          prop="answer"
          label="答案"
          :show-overflow-tooltip="true">
      </el-table-column>
      <el-table-column
          prop="anal"
          label="解析"
          :show-overflow-tooltip="true">
      </el-table-column>
<!--      <el-table-column label="操作" align="center" width="80px">-->
<!--        <template slot-scope="scope">-->
<!--          &lt;!&ndash;-->
<!--          <el-button-->
<!--              size="mini"-->
<!--              @click="handleEdit(scope.$index, scope.row)">编辑</el-button>-->
<!--              &ndash;&gt;-->
<!--          <el-button-->
<!--              size="mini"-->
<!--              type="danger"-->
<!--              @click="handleDelete(scope.$index, scope.row)">删除</el-button>-->
<!--        </template>-->
<!--      </el-table-column>-->
    </el-table >
    <div style="margin: 10px 0">
      <el-pagination
          @current-change="handleCurrentChange"
          :current-page="pageNum"
          :page-size="pageSize"
          layout="total, prev, pager, next, jumper"
          :total="tableData.length">
      </el-pagination>
    </div>
    <el-dialog  center="true"  title="增加题目" :visible.sync="formVisible" show-close="false" width="600px">
      <el-form  label-position="left" :model="form">

        <el-form-item>
          <el-select v-model="form.keyword" placeholder="请选择关键词"  style="width: 100%" >
            <el-option
                v-for="item in keywords"
                :key="item.value"
                :label="item.label"
                :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-select v-model="form.type" placeholder="请选择题型" label="题型" style="width: 100%" >
            <el-option
                v-for="item in questionTypes"
                :key="item.value"
                :label="item.label"
                :value="item.value">
            </el-option>
          </el-select>
        </el-form-item >

        <el-form-item >
          <el-input v-model="form.description" type="textarea" autocomplete="off" placeholder="题干" required></el-input>
        </el-form-item>

        <div v-if="form.type === 'mc'">
          <el-form-item
              v-for="(choice, index) in m_choices"
              :label="String.fromCharCode(65 + index)"
          >
            <el-input v-model="choice.value" style="width: 87%"></el-input><el-button type="danger" style="float: right" @click="handleDeleteChoice(index)" class="el-icon-minus"></el-button>

          </el-form-item>

          <el-form-item>
            <el-button type="danger" style="float: right; margin-top: 10px; margin-left: 10px" @click="m_choices = [{value: ''}]" class="el-icon-delete">重置</el-button>
            <el-button type="primary" style="float: right; margin-top: 10px; margin-left: 10px" @click="m_choices.push({value: ''})">添加选项</el-button>
          </el-form-item>

          <el-form-item >
            <el-select v-model="form.correctAnswer" placeholder="请选择答案" style="width: 100%" >
              <el-option
                  v-for="(item,index) in m_choices"
                  :label="item.value"
                  :value="index+1"
                  v-if="item !== ''">
              </el-option>
            </el-select>
          </el-form-item>

        </div>

        <div v-if="form.type === 'tf'">
          <el-form-item>
            <el-select v-model="form.correctAnswer" placeholder="正确答案" style="width: 100%">
              <el-option label="正确" value="正确"></el-option>
              <el-option label="错误" value="错误"></el-option>
            </el-select>
          </el-form-item>
        </div>

        <div v-if="form.type === 'fi'">
          <el-form-item >
            <el-input v-model="form.correctAnswer" autocomplete="off" placeholder="正确答案" ></el-input>
          </el-form-item>
        </div>

        <el-form-item>
          <el-input v-model="form.anal" placeholder="题目解析" type="textarea" ></el-input>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="formVisible = false; m_choices = [{value: ''}];">取 消</el-button>
        <el-button type="primary" @click="handleConfirm">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import request from "@/utils/request";

export default
{
  name:"edit",
  data() {
    return {
      tableData:[],        //动态传入页面数据
      pageNum:1,  //当前页码
      pageSize:10, //当前页面大小
      options:[
        {value: 'des', label: "题目描述"},
        {value: 'anal',label: "题目解析"},
        {value: 'keyword',label: '题目关键词'}
      ],
      questionTypes:[
        {value: 'tf', label: '判断题'},
        {value: 'mc', label: '选择题'},
        {value: 'fi', label: '填空题'}
      ],
      keywords:[],
      value:'',
      keyword:'',
      choices:[],
      m_choices:[{
        value:''
      }],
      formVisible:false,
      form:{
        type:'',

      },
      new_type:'',
      more:false,
    }
  },
  watch:
  {
    tableData()
    {
    }
  },
  created() {
    this.allKeywords()
  },
  mounted(){
    this.allQuestions();

  },
  updated() {
  },
  methods: {
    handleDeleteChoice(index)
    {
      if(index > 0)
      {
        this.m_choices.splice(index,1)
      }
    },
    allKeywords()
    {
      request.get('/keywords').then(res =>{
        let data = res.data
        data.forEach(d =>
        {
          this.keywords.push(
              {
                value:d.keyword_id,
                label:d.keyword_description
              }
          )
        })
      })
    },


    doupload(formId) {
      // 获取表单元素
      const form = document.getElementById(formId);
      // 创建 FormData 对象，用于封装表单数据
      const formData = new FormData(form)



      request.post('/batch/import',formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }).then(response => {
            // 请求成功的处理逻辑
            console.log('文件上传成功', response.data);
            // 可以在这里添加提示信息，如使用 Element UI 的消息提示组件
             this.$message.success('文件上传成功');
          })
          .catch(error => {
            // 请求失败的处理逻辑
            console.error('文件上传失败', error);
            // 可以在这里添加提示信息，如使用 Element UI 的消息提示组件
             this.$message.error('文件上传失败');
          });
    },



handleexport() {    //一键导出题库
  // 替换为实际的下载链接

  window.open( process.env.VUE_APP_BASEURL+'/batch/export');
    },
    handleConfirm()
    {
      console.log(this.form)
      console.log(this.form.type)
      console.log(this.form.keyword)
      console.log(this.form.description)
      console.log(this.form.correctAnswer)
      if(this.form.type === undefined || this.form.keyword === undefined || this.form.description === undefined || this.form.correctAnswer === undefined)
      {
        this.$message.error("请正确填写")
      }
      else
      {
        let is_mc = true

        this.m_choices.forEach(mc =>
        {
          if(mc.value === '' || mc.value === undefined)
          {
            is_mc = false
          }
        })

        if(this.form.type !== 'mc')
        {
          is_mc = true
        }

        if(is_mc === false)
        {
          this.$message.error('请正确填写')
        }
        else
        {
          if(this.form.type === 'fi')
          {
            request.post('/questions/fi/add',{question_description:this.form.description,correct_answer:this.form.correctAnswer,question_analysis:this.form.anal}).then(res =>{
              if(res.code === '200')
              {
                let id = res.data.length
                request.post('/questions/fi/add/keyword',{fill_in_the_blank_question_id:id,keyword_id:this.form.keyword}).then(res =>
                {
                  if(res.code === '200')
                  {
                    this.$message.success("成功添加")
                    this.formVisible = false
                    this.m_choices = [{value: ''}]
                    this.form = {}
                  }
                })
              }
            })
          }else if(this.form.type === 'tf')
          {
            request.post('/questions/tf/add',{question_description:this.form.description,correct_answer:this.form.correctAnswer,question_analysis:this.form.anal}).then(res =>{
              if(res.code === '200')
              {
                let id = res.data.length
                request.post('/questions/tf/add/keyword',{true_false_question_id:id,keyword_id:this.form.keyword}).then(res =>
                {
                  if(res.code === '200')
                  {
                    this.$message.success("成功添加")
                    this.formVisible = false
                    this.m_choices = [{value: ''}]
                    this.form = {}
                  }
                })
              }
            })
          }
          else
          {
            request.post('/questions/mc/add',{question_description:this.form.description,correct_answer:this.form.correctAnswer,question_analysis:this.form.anal}).then(res =>{
              if(res.code === '200')
              {
                let id = res.data.length
                request.post('/questions/mc/add/keyword',{multiple_choice_question_id:id,keyword_id:this.form.keyword}).then(res =>
                {
                  if(res.code === '200')
                  {
                    let all_post = []
                    console.log(this.m_choices)
                    this.m_choices.forEach(op =>
                    {
                      let is_correct = false
                      if(op.value === this.form.correctAnswer)
                      {
                        is_correct = true
                      }
                      all_post.push( request.post('/options/add',{multiple_choice_question_id:id,option_description:op.value,is_correct:is_correct}))

                    })

                    Promise.all(all_post).then(ress =>
                    {
                      let success = true
                      ress.forEach(res =>{
                        if(res.code !== '200')
                        {
                          success = false
                        }
                      })
                      if(success === true)
                      {
                        this.$message.success("成功添加")
                        this.formVisible = false
                        this.m_choices = [{value: ''}]
                        this.form = {}
                      }
                    })
                  }
                })
              }
            })
          }
        }

      }

    },
    handleAdd()
    {
      this.formVisible = true

      this.form = {}
    },
    handleDeleteBatch()
    {
      console.log(this.choices)
    },
    handleEdit(index, row)
    {
      console.log(row)
    },
    handleDelete(index, row)
    {
      if(row.type === '选择题')
      {
        this.$message.info("选择题" + row.id)
      }
      else if (row.type === '填空题' + row.id)
      {

        this.$message.info("填空题" + row.id)
      }
      else
      {
        request.get('/questions/tf/delete/' + row.id).then(res =>
        {
          if(res.code === '200')
          {
            this.$message.success("判断题" + row.id + "删除成功")
          }
          else
          {
            this.$message.success("判断题" + row.id + "删除失败")
          }
        })

      }
      this.tableData.splice(index, 1)
    },
    handleSelectionChange(s)
    {
      this.choices = s
    },
    handleQuery() {
      if (this.value === '' || this.keyword === '' ) {
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
    sliceDate()
    {
      return this.tableData.slice(this.pageSize*(this.pageNum -1 ), this.pageSize*(this.pageNum))
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
                anal:q.question_analysis,
                answer:q.correct_answer,
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
                anal:q.question_analysis,
                answer:String.fromCharCode(65 + q.correct_answer - 1),
                keys: []
              }

          request.get('/keywords/in_mc/' + question.id).then(res => {
            let keywords = res.data;
            keywords.forEach(keyword => {
              question.keys.push(keyword['keyword_description'])
            })

            request.get('/options/in_question/' + question.id).then(res =>{
              let options = res.data
              options.forEach((op,index) =>{
                let option = ' ' + String.fromCharCode(65 + index) + '.' + op.option_description;
                question.des += option
              })
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
                anal:q.question_analysis,
                answer:q.correct_answer,
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
                anal:q.question_analysis,
                answer:q.correct_answer,
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
                anal:q.question_analysis,
                answer:String.fromCharCode(65 + q.correct_answer - 1),
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

            request.get('/options/in_question/' + question.id).then(res =>{
              let options = res.data
              options.forEach((op,index) =>{
                let option = ' ' + String.fromCharCode(65 + index) + '.' + op.option_description;
                question.des += option
              })
            })
              }

          )
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
                anal:q.question_analysis,
                answer:q.correct_answer,
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