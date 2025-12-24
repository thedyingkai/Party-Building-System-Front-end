<!--
  富文本编辑器组件
  
  @component WangEditor
  @description 基于 wangeditor 的富文本编辑器，支持图片、视频上传
  @author 党建系统开发团队
-->
<template>
  <div class="container">
    <!-- 编辑器容器 -->
    <div ref="editor" style="text-align: left" id="div1"></div>
  </div>
</template>

<script>
import E from 'wangeditor'

export default {
  name: 'WangEditor',
  data() {
    return {
      editor: null, // 编辑器实例
    }
  },
  props: {
    /**
     * 编辑器内容
     * @type {String}
     */
    content: {
      type: String,
      default: '',
    },
  },
  watch: {
    /**
     * 监听父组件传入的 content 变化，更新编辑器内容
     * @param {string} newContent - 新的内容
     */
    content(newContent) {
      if (this.editor && newContent !== this.editor.txt.html()) {
        this.editor.txt.html(newContent)
      }
    },
  },
  mounted() {
    // 创建编辑器实例
    this.editor = new E(this.$refs.editor)
    
    // ==================== 配置图片上传 ====================
    // 设置图片上传接口地址
    this.editor.config.uploadImgServer = `${process.env.VUE_APP_BASEURL}/file/upload`
    // 配置图片上传参数
    this.editor.config.uploadImgParams = {
      file: null, // file 字段用于接收本地图片文件
    }
    
    let that = this
    
    /**
     * 自定义图片上传方法
     * @param {Array} files - 选中的图片文件
     * @param {Function} insertImgFn - 插入图片到编辑器的回调函数
     */
    this.editor.config.customUploadImg = function (files, insertImgFn) {
      const formData = new FormData()
      formData.append('file', files[0])
      that.editor.config.uploadImgParams.file = files[0]
      
      // 使用原生 XMLHttpRequest 上传
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
    
    /**
     * 自定义视频上传方法
     * @param {Array} resultFiles - 选中的视频文件
     * @param {Function} insertVideoFn - 插入视频到编辑器的回调函数
     */
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
    
    // ==================== 编辑器配置 ====================
    // 内容变化时触发事件
    this.editor.config.onchange = () => {
      // 编辑器内容变化时，触发 input 事件传递给父组件
      this.$emit('input', this.editor.txt.html())
    }
    
    this.editor.config.zIndex = 1000              // 设置编辑器 z-index
    this.editor.config.pasteFilterStyle = false   // 粘贴时保留样式
    
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