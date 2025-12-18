<template>
  <div class="container">
    <div ref="editor" style="text-align: left" id="div1"></div>
  </div>
</template>

<script>
import E from 'wangeditor'

export default {
  name: 'WangEditor',
  data() {
    return {
      editor: null,
    }
  },
  props: {
    content: {
      type: String,
      default: '',
    },
  },
  watch: {
    // 当父组件传入的 content 变化时，更新编辑器内容
    content(newContent) {
      if (this.editor && newContent !== this.editor.txt.html()) {
        this.editor.txt.html(newContent)
      }
    },
  },
  mounted() {
    this.editor = new E(this.$refs.editor)
    // 设置图片上传接口地址
    this.editor.config.uploadImgServer = `${process.env.VUE_APP_BASEURL}/file/upload`
    // 配置图片上传时需要传递的参数
    this.editor.config.uploadImgParams = {
      file: null, // file字段用于接收本地图片文件
    }
    let that = this
    this.editor.config.customUploadImg = function (files, insertImgFn) {
      const formData = new FormData()
      formData.append('file', files[0])
      //其他参数根据需要自行添加 formData形式与JSON形式自行使用
      that.editor.config.uploadImgParams.file = files[0]
      const xhr = new XMLHttpRequest()
      xhr.open('POST', that.editor.config.uploadImgServer, true)
      xhr.onload = function () {
        if (xhr.status === 200) {
          const response = JSON.parse(xhr.responseText)
          insertImgFn(response.data.httpUrl) // 插入图片
        }
      }
      xhr.send(formData)
    }
    //下方本地上传视频方法同理
    this.editor.config.customUploadVideo = function (resultFiles, insertVideoFn) {
      const formData = new FormData()
      formData.append('file', resultFiles[0])
      that.editor.config.uploadImgParams.file = resultFiles[0]
      const xhr = new XMLHttpRequest()
      xhr.open('POST', that.editor.config.uploadImgServer, true)
      xhr.onload = function () {
        if (xhr.status === 200) {
          const response = JSON.parse(xhr.responseText)
          insertVideoFn(response.data.httpUrl) // 插入视频
        }
      }
      xhr.send(formData)
    }
    this.editor.config.onchange = () => {
      // 编辑器内容变化时，触发 input 事件传递给父组件
      this.$emit('input', this.editor.txt.html())
    }
    this.editor.config.zIndex = 1000
    this.editor.config.pasteFilterStyle = false
    // 创建编辑器
    this.editor.create()
    // 设置初始内容
    if (this.content) {
      this.editor.txt.html(this.content)
    }
  },
}
</script>

<style scoped>
/*.container {*/
/*  height: 100vh;*/
/*  width: 80vh;*/
/*}*/
</style>