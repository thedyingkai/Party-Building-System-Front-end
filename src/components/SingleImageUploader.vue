<template>
  <div class="container">
    <el-upload ref="uploadRef" v-model="files" :auto-upload="false" :file-list="files"
               :http-request="uploadSubmit" :limit="limit" :multiple="limit>1" :on-change="handleChange"
               :on-exceed="handleExceed" :show-file-list="false" accept="image/*"
               :action="uploadAction">
      <template #trigger>
        <div @click="isUserSelecting = true">
          <i v-if="files.length === 0" class="el-icon-plus cover-uploader-icon"></i>
        </div>
      </template>
      <ul class="viewBox">
        <li v-for="(file,index) of files" :key="index">
          <el-tooltip class="click-able" content="点击以更换图片" effect="light" popper-class="tip-message">
            <el-image :src="file.url" fit="cover" @click="handleImageClick"></el-image>
          </el-tooltip>
          <i class="el-icon-delete" @click="remove(index)"></i>
          <i class="el-icon-zoom-in" @click="imageView"></i>
          <span v-if="file.status === 'success' && file.error!== 'failed'">
            <em class="el-icon-check"></em>
          </span>
        </li>
      </ul>
    </el-upload>
    <el-button size="small" style="margin: 5px;" type="success" @click="handleUpload">上传</el-button>
    <el-image-viewer v-if="showImageView" :on-close="closeViewer" :url-list="urls"
                     style="z-index: 99999;"></el-image-viewer>
  </div>
</template>

<script>
import ElImageViewer from "element-ui/packages/image/src/image-viewer";

export default {
  name: "SingleImageUploader",
  components: {
    ElImageViewer,
  },
  props: {
    limit: {
      type: Number,
      default: 1
    }
  },
  data() {
    return {
      files: [],
      urls: [],
      user: JSON.parse(localStorage.getItem("current-user") || '{}'),
      isUserSelecting: false,
      showImageView: false,
    };
  },
  computed: {
    uploadAction() {
      return `${process.env.VUE_APP_BASEURL}/file/upload`;
    },
  },
  methods: {
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
              this.$emit('updateQuery', item.url)
            } else {
              item.error = 'failed';
            }
          }
        });
      } catch (error) {
        console.error('上传文件出错:', error);
      }
      this.isUserSelecting = false;
    },
    handleChange(uploadFile, uploadFiles) {
      if (this.isUserSelecting) {
        uploadFiles.map(item => {
          item.url = URL.createObjectURL(item.raw);
        });
        this.files = uploadFiles;
      }
    },
    handleUpload() {
      this.$refs.uploadRef.submit();
    },
    handleExceed(files, uploadfiles) {
      if (this.limit === 1) {
        this.$refs.uploadRef.clearFiles();
        this.$refs.uploadRef.handleStart(files[0]);
      } else {
        this.$message.error('最多允许上传' + this.limit + '张，已上传' + uploadfiles.length + '张，本次还可以上传' + (this.limit - uploadfiles.length) + '张');
      }
    },
    remove(index) {
      this.files.splice(index, 1);
    },
    imageView() {
      this.showImageView = true;
      this.urls = this.files.map(file => {
        return file.url;
      });
    },
    closeViewer() {
      this.showImageView = false;
    },
    handleImageClick() {
      this.isUserSelecting = true;
      this.$refs.uploadRef.$el.querySelector('input[type="file"]').click();
    }
  },
};
</script>

<style lang="scss" scoped>
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.viewBox {
  width: 100%;

  li {
    //width: 180px;
    height: 148px;
    float: left;
    margin: 3px;
    position: relative;

    .el-image {
      width: 100%;
      height: 100%;
      border: #7a7a7a solid 1px;
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
  }
}

.cover-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  text-align: center;
  height: 148px;
  width: 148px;
  line-height: 148px;
  border: dotted 1px;
}
</style>

<style>
.tip-message {
  z-index: 99999 !important;
}
</style>