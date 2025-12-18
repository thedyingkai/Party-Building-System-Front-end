<template>
  <div style="display: flex; flex-direction: column; flex-grow: 1;">
    <el-menu class="draft-menu" mode="horizontal">
      <div style="float: left;color: #fbfbfb">
        <el-menu-item @click="goBack">返回</el-menu-item>
      </div>
      <div style="float: right;display: flex">
        <el-menu-item @click="preview">预览</el-menu-item>
        <el-menu-item @click="save">保存</el-menu-item>
        <el-menu-item @click="submit">提交</el-menu-item>
        <el-dialog
            :visible.sync="dialogVisible"
            fullscreen=true
            title="预览"
            width="90%"
        >
          <ArticleView :draft="draft"></ArticleView>
        </el-dialog>
      </div>
    </el-menu>
    <div class="form-container">
      <el-form ref="editorRef" :label-position="left" :model="draft">
        <el-form-item :rules="[{required:true,message:'请输入标题'}]" label="标题" prop="title">
          <el-input v-model="draft.title" placeholder="请输入标题" style="width: calc(150vh - 50px)"></el-input>
        </el-form-item>
        <div style="display: flex;flex-direction: row;justify-content: space-between;">
          <el-form-item label="栏目" prop="coid" style="display: flex">
            <el-cascader
                v-model="draft.coid" :options="formattedOptions" filterable placeholder="选择栏目">
              <template slot-scope="{ node, data }">
                <span>{{ data.label }}</span>
                <span v-if="!node.isLeaf"> ({{ data.children.length }}) </span>
              </template>
            </el-cascader>
          </el-form-item>
          <el-form-item label="文章来源" prop="source" style="display: flex">
            <el-input v-model="draft.source" placeholder="请输入文章来源" style="width: calc(150vh - 400px)"></el-input>
          </el-form-item>
        </div>
        <el-form-item prop="content">
          <div id="editor"></div>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import E from 'wangeditor'
import ArticleView from "@/components/ArticleView";

export default {
  name: "EditorPage",
  components: {ArticleView},
  data() {
    return {
      user: JSON.parse(localStorage.getItem("current-user") || '{}'),
      draft: {
        id: '',
        coid: -1,
        source: '',
        title: '',
        content: '',
        bid:-1,
      },
      dialogVisible: false,
      options: [],
      formattedOptions: []
    }
  },
  computed:{

  },
  mounted() {
    // 获取路由传递过来的参数
    const {id, title, content, coid, source} = this.$route.params;
    // 将参数赋值到 draft 对象相应属性
    this.draft.id = id || '';
    this.draft.coid = coid || -1;
    this.draft.source = source || '';
    this.draft.title = title || '';
    this.draft.content = content || '';
    this.draft.bid=this.user.bid;
    console.log(this.draft);
    this.$request.get('/column/selectAll').then(
        res => {
          if (res.code === '200') {
            this.options = res.data;
            this.formattedOptions = this.transformOptions(this.options);
          }
        }
    ).catch((error) => {
      console.error('栏目信息获取失败:', error);
    });
    this.initWangEditor(this.draft.content);
  },
  methods: {
    //根据id查找对象
    findById(data, targetId) {
      for (const item of data) {
        if (item.id === targetId) {
          return item; // 找到目标对象，返回
        }
        if (item.child && item.child.length > 0) {
          const result = this.findById(item.child, targetId); // 递归查找子节点
          if (result) return result; // 如果在子节点中找到，返回结果
        }
      }
      return null; // 如果未找到，返回 null
    },
    goBack() {
      this.$router.go(-1);
    },
    preview() {
      this.draft.content = this.editor.txt.html()
      this.dialogVisible = true;
    },
    getContent() {
      // 获取编辑框内容
      this.draft.content = this.editor.txt.html()
    },
    save() {
      if (!this.draft.title) {
        this.$message.error('请输入标题');
        return;
      }//如果未输入标题，提示”请输入标题“并阻塞
      this.$refs["editorRef"].validate((valid) => {
        if (valid) {
          this.getContent();
          if (Array.isArray(this.draft.coid)) {
            this.draft.coid = this.draft.coid[this.draft.coid.length - 1];
          }//获取草稿信息和所选栏目id
          if (!this.draft.id) {//如果当前草稿id为空，说明是新建草稿，执行插入操作
            this.$request.post('/draft/add', this.draft).then(
                res => this.handleResponse(res, () => {
                  this.$message.success('保存成功');
                })
            )
          } else {//如果当前草稿id不为空，说明是已有草稿，执行更新操作
            this.$request.put('/draft/update', this.draft).then(
                res => this.handleResponse(res, () => {
                  this.$message.success('保存成功');
                })
            )
          }
        }
      })
    },
    submit() {
      let column=this.findById(this.options, this.draft.coid[this.draft.coid.length - 1]);
      console.log("cplumn");
      console.log(column);
      if (!this.draft.title) {
        this.$message.error('请输入标题');
        return;
      }
      if (this.draft.coid === -1) {
        this.$message.error('提交时不能选择默认栏目');
        return;
      }
      if (!("ptid" in column)||(column.ptid===null)) {
        this.$message.error('该栏目未开放审核，等待管理员设置审核流程');
        return;
      }

      this.$refs["editorRef"].validate((valid) => {
        if (valid) {
          this.getContent();
          if (Array.isArray(this.draft.coid)) {
            this.draft.coid = this.draft.coid[this.draft.coid.length - 1];
          }
          if (!this.draft.id) {
            this.$request.post('/draft/new&submit', this.draft).then(
                res => this.handleResponse(res, () => {
                  this.$message.success('提交成功');
                })
            )
          } else {
            this.$request.put('/draft/submit', this.draft).then(
                res => this.handleResponse(res, () => {
                  this.$message.success('提交成功');
                })
            )
          }
        }
      })
    },
    handleResponse(res, successCallback) {
      if (res.code === '200') {
        successCallback();
        this.goBack();
      } else {
        this.$message.error(res.data.msg);
      }
    },
    // 转换 options 数据结构，并移除 child 为空的项
    transformOptions(options) {
      return options.map(item => {
        let newItem = {
          value: item.id,
          label: item.name
        };
        if (item.child && item.child.length > 0) {
          newItem.children = this.transformOptions(item.child);
        }
        return newItem;
      });
    },

    // 富文本编辑器初始化
    initWangEditor(content) {
      setTimeout(() => {
        if (!this.editor) {
          this.editor = new E(document.getElementById('editor'));
          this.editor.config.placeholder = '请输入内容';
          // 设置文件上传的后端路径
          this.editor.config.uploadImgServer = this.$baseUrl + '/file/upload';
          // 设置文件上传的参数名
          this.editor.config.uploadFileName = 'file'
          // 设置文件上传的请求头
          this.editor.config.uploadImgHeaders = {
            token: this.user.token
          }
          this.editor.create();

          this.editor.config.uploadImgHooks = {
            customInsert: function (insertImgFn, result) {
              console.log(result)
              // result 即服务端返回的接口数据，假设其中包含图片的 URL 信息
              let imgUrl = result.data;
              // 使用 insertImgFn 将图片插入到编辑器中
              insertImgFn(imgUrl);
            }
          };
        }
        // 给 wangeditor 中设置内容
        this.editor.txt.html(content);

      }, 100);
    }
  },


}
</script>

<style lang="scss" scoped>
.draft-menu {
  background-color: #807f7f;
}

.el-menu-item {
  color: #fbfbfb;
}

.el-input {
  width: 150vh;
}

.form-container {
  background-color: rgb(245 245 245 / 88%) !important;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  padding: 2vh;
  height: calc(100vh - 120px);
}

#editor {
  width: 150vh;
}

.el-dropdown {
  float: right;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center; /* 水平居中 */
  height: 60px;
  color: #fbfbfb;
  margin-right: 15px;
}

.el-card {
  padding: 3vh;
}

</style>
<style>
.w-e-text-container {
  height: calc(100vh - 400px) !important;
  z-index: 99 !important;
}

.w-e-toolbar {
  z-index: 100 !important;
}

.el-dialog__wrapper {
  z-index: 99999 !important;
}

</style>