<!--
  资源上传器组件
  
  @component ResourceUploader
  @description 拖拽上传组件，支持多文件上传、预览和描述添加
  @author 党建系统开发团队
-->
<template>
  <div style="display: flex;flex-direction: column">
    <!-- 上传区域 -->
    <el-upload ref="uploadRef" v-model="files" :auto-upload="false" :file-list="files"
               :http-request="uploadSubmit" :limit="limit" :multiple="limit>1" :on-change="handleChange"
               :on-exceed="handleExceed" :show-file-list="false"  :action="uploadAction"
               drag>
      <template #trigger>
        <div @click="isUserSelecting = true">
          <i class="el-icon-upload"></i>
          <div class="el-upload__text">将文件拖到此处，或<em>点击选择</em></div>
        </div>
      </template>
    </el-upload>
    <!-- 上传按钮 -->
    <el-button size="small" type="success" @click="handleUpload">上传</el-button>
    <!-- 文件预览列表 -->
    <ul class="viewBox">
      <li v-for="(file, index) in files" :key="index">
        <div class="image-card">
          <el-image :src="file.url" fit="cover"></el-image>
          <i class="el-icon-delete" @click="remove(index)"></i>
          <i class="el-icon-zoom-in" @click="imageView"></i>
          <span v-if="file.status === 'success' && file.error !== 'failed'">
            <em class="el-icon-check"></em>
          </span>
          <el-tooltip :content="file.name" effect="light" placement="bottom" popper-class="filename-tip">
            <div class="filename">{{ file.name }}</div>
          </el-tooltip>
        </div>
        <!-- 文件描述输入 -->
        <div class="description-input">
          <el-input v-model="file.description" :rows="4" class="description-input-inner" placeholder="添加文件描述"
                    resize="none" type="textarea"></el-input>
        </div>
      </li>
    </ul>
    <!-- 图片查看器 -->
    <el-image-viewer v-if="showImageView" :on-close="closeViewer" :url-list="urls"
                     style="z-index: 99999;"></el-image-viewer>
  </div>
</template>

<script>
import ElImageViewer from "element-ui/packages/image/src/image-viewer";

export default {
  name: "ResourceUploader",
  components: {
    ElImageViewer,
  },
  props: {
    /**
     * 最大上传数量
     * @type {Number}
     */
    limit: {
      type: Number,
      default: 9,
    },
    /**
     * 活动ID
     * @type {Number}
     */
    acid: {
      type: Number,
    }
  },
  data() {
    return {
      // 文件列表
      files: [],
      // 图片URL列表（用于查看器）
      urls: [],
      // 当前用户
      user: JSON.parse(localStorage.getItem("current-user") || '{}'),
      // 是否为用户选择操作
      isUserSelecting: false,
      // 是否显示图片查看器
      showImageView: false,
    };
  },
  computed: {
    /**
     * 上传接口地址
     * @returns {string} 完整的上传API URL
     */
    uploadAction() {
      return `${process.env.VUE_APP_BASEURL}/file/upload`;
    },
  },
  methods: {
    /**
     * 执行文件上传
     * @param {Object} options - 上传选项对象
     * @param {File} options.file - 要上传的文件
     * @description 将文件上传到服务器并保存资源信息
     */
    async uploadSubmit(options) {
      const formData = new FormData();
      formData.append('file', options['file']);
      try {
        const response = await this.$request.post('file/upload', formData, {
          headers: {
            token: this.user.token
          },
        });
        this.files.forEach(item => {
          if (item.uid === options.file.uid) {
            if (response && response.code === '200') {
              item.url = response.data;
              let file = {
                uid: this.user.uid,
                acid: this.acid,
                type: item.raw.type,
                name: item.raw.name,
                content: response.data,
                description: item.description || '暂无描述'
              };
              if (file.type.startsWith('image/')) {
                file.type = 1;
              } else if (file.type.startsWith('video/')) {
                file.type = 2;
              } else if (file.type.startsWith('audio/')) {
                file.type = 3;
              } else if (file.type === 'application/msword' ||
                  file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
                file.type = 4; // Word 文档
              } else if (file.type === 'application/vnd.ms-excel' ||
                  file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
                file.type = 5; // Excel 表格
              } else if (file.type === 'application/vnd.ms-powerpoint' ||
                  file.type === 'application/vnd.openxmlformats-officedocument.presentationml.presentation') {
                file.type = 6; // PowerPoint 演示文稿
              } else if (file.type === 'application/pdf') {
                file.type = 7; // PDF 文件
              } else {
                file.type = 8; // 默认类型，对于未匹配到的文件类型
              }
              this.$request.post('resource/add', file).then(
                  res => {
                    if (res.code === '200') {
                      this.$message.success('上传成功');
                      this.$emit('visitActivity', this.acid)
                    }
                  }
              ).catch((error) => {
                console.error('数据加载出现错误:', error);
              });
            } else {
              item.error = 'failed';
              this.$message.error(response.msg);
            }
          }
        });
      } catch (error) {
        console.error('上传文件出错:', error);
      }
      this.isUserSelecting = false;
    },
    /**
     * 处理文件变化
     * @param {Object} uploadFile - 当前上传的文件
     * @param {Array} uploadFiles - 所有上传的文件列表
     * @description 当用户选择文件后，创建预览URL
     */
    handleChange(uploadFile, uploadFiles) {
      if (this.isUserSelecting) {
        uploadFiles.forEach(item => {
          item.url = URL.createObjectURL(item.raw);
          this.$set(item, 'description', '');
        });
        this.files = uploadFiles;
      }
    },
    /**
     * 执行上传
     * @description 手动触发文件上传
     */
    handleUpload() {
      this.$refs.uploadRef.submit();
    },
    /**
     * 处理文件超出限制
     * @param {Array} files - 新选择的文件
     * @param {Array} uploadfiles - 已上传的文件列表
     * @description 当上传文件数量超过限制时的处理
     */
    handleExceed(files, uploadfiles) {
      if (this.limit === 1) {
        this.$refs.uploadRef.clearFiles();
        this.$refs.uploadRef.handleStart(files[0]);
      } else {
        this.$message.error('最多允许上传' + this.limit + '张，已上传'
            + uploadfiles.length + '张，本次还可以上传' + (this.limit - uploadfiles.length) + '张');
      }
    },
    /**
     * 移除文件
     * @param {number} index - 文件索引
     * @description 从文件列表中移除指定文件
     */
    remove(index) {
      this.files.splice(index, 1);
    },
    /**
     * 查看图片
     * @description 打开图片查看器
     */
    imageView() {
      this.showImageView = true;
      this.urls = this.files.map(file => {
        return file.url;
      });
    },
    /**
     * 关闭查看器
     * @description 关闭图片查看器
     */
    closeViewer() {
      this.showImageView = false;
    },
  },
};
</script>

<style lang="scss" scoped>
.viewBox {
  width: 100%;

  li {
    padding: 5px 5px 25px;
    border: 1px solid #d21300;
    margin: 3px;
    position: relative;
  }
}

.image-card {
  width: 180px;
  height: 120px;
  position: relative;

  .el-image {
    width: 100%;
    height: 100%;
  }

  i {
    position: absolute;
    width: 30px;
    height: 30px;
    background: rgb(0, 0, 0, .3);
    color: #fff;
    line-height: 30px;
    text-align: center;
    cursor: pointer;

    &.el-icon-zoom-in {
      left: 3px;
    }

    &.el-icon-delete {
      right: 3px;
      bottom: 3px;
    }
  }

  span {
    width: 0;
    height: 0;
    content: '';
    border: 20px solid #42b983;
    position: absolute;
    top: 3px;
    right: 3px;
    border-left-color: transparent;
    border-bottom-color: transparent;

    em {
      position: absolute;
      top: -12px;
      color: #fff;
    }
  }

  .filename {
    position: relative;
    bottom: 2px;
    overflow: hidden;
    white-space: nowrap;
    height: 18px;
    text-overflow: ellipsis;
  }
}

.description-input {
  position: absolute;
  left: 200px;
  top: 30px;
  width: calc(100% - 210px);
}

</style>
<style>
.filename-tip {
  z-index: 99999 !important;
}
</style>