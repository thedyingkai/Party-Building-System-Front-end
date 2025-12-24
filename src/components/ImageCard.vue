<!--
  图片卡片组件
  
  @component ImageCard
  @description 显示图片或文件图标的卡片组件，支持预览功能
  @author 党建系统开发团队
-->
<template>
  <div :class="showType" :style="{'height':totalHeight}">
    <!-- 图片展示比例为 16:9 ，比例不符合的图片会自适应裁剪-->
    <div>
      <!-- 图片区域 -->
      <div :class="showType+'-img'">
        <!-- 图片展示 -->
        <div v-if="isImage" class="image-container">
          <img v-if="!loading" :alt="imageInfo"
               :class="'img-'+showType"
               :src="url"
               :style="{ 'object-fit': objectFit, 'max-width': maxWidth, 'max-height': maxHeight,}"
               @click="handleClick"/>
          <div v-else class="loading-animation">Loading...</div>
        </div>
        <!-- 文件图标展示 -->
        <div v-else>
          <img v-if="!loading" :alt="imageInfo"
               :class="'img-'+showType" :src="iconUrl"
               :style="{ 'max-width': maxWidth, 'max-height': maxHeight,'border-radius':'10px'}"
               @click="handleClick"/>
          <div v-else class="loading-animation">Loading...</div>
        </div>
      </div>
      <!-- 标题区域 -->
      <div :class="showType+'-title'">
        <div :style="{'max-width': maxWidth}"
             :title="title"
             style="text-overflow: ellipsis; overflow: hidden; white-space: nowrap;"
        >
          {{ title }}
        </div>
        <div :style="{'max-width': maxWidth,'color':'#adadad','font-size':'13px'}">{{ subTitle }}</div>
      </div>
    </div>
    <!-- 预览对话框 -->
    <el-dialog :title="title" :visible.sync="dialogVisible" width="30%">
      <div style="display: flex;flex-direction: column;align-items: center;">
        <p style="width: 100%">{{ description }}</p>
        <el-button @click="previewContent">预览</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "ImageCard",
  props: {
    /**
     * 资源ID
     * @type {Number}
     */
    id: {type: Number},
    /**
     * 图片URL
     * @type {String}
     */
    url: {
      type: String,
      default: '/img/dsjtjt.jpg'
    },
    /**
     * 图片信息描述
     * @type {String}
     */
    imageInfo: String,
    /**
     * 标题
     * @type {String}
     */
    title: String,
    /**
     * 副标题
     * @type {String}
     */
    subTitle: String,
    /**
     * 详细描述
     * @type {String}
     */
    description: {
      type: String, default: '暂无描述'
    },
    /**
     * 图片填充方式
     * @type {String}
     */
    objectFit: {
      type: String,
      default: 'cover'
    },
    /**
     * 最大宽度
     * @type {String}
     */
    maxWidth: {
      type: String,
      default: '100%'
    },
    /**
     * 最大高度
     * @type {String}
     */
    maxHeight: {
      type: String,
      default: '200px'
    },
    /**
     * 显示类型
     * @type {String}
     */
    showType: {
      type: String,
      default: 'image-card'
    },
    /**
     * 总高度
     * @type {String}
     */
    totalHeight: {
      type: String,
      default: '200px',
    },
    /**
     * 总宽度
     * @type {String}
     */
    totalWidth: {
      type: String,
      default: '56px',
    }
  },
  data() {
    return {
      // 是否为图片文件
      isImage: true,
      // 文件图标URL
      iconUrl: '',
      // 文件类型到图标的映射
      iconMap: {
        'image/jpeg': 'https://pan-yz.cldisk.com/static/pc/images/icon/image.png',
        'image/png': 'https://pan-yz.cldisk.com/static/pc/images/icon/image.png',
        'image/gif': 'https://pan-yz.cldisk.com/static/pc/images/icon/image.png',
        'image/svg+xml': 'https://pan-yz.cldisk.com/static/pc/images/icon/image.png',
        'application/pdf': 'img/icons/pdf.png',
        'application/msword': 'img/icons/doc.png',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'img/icons/docx.ico',
        'application/vnd.ms-excel': 'img/icons/xls.png',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'img/icons/xls.png',
        'application/vnd.ms-powerpoint': 'img/icons/ppt.png',
        'application/vnd.openxmlformats-officedocument.presentationml.presentation': 'img/icons/ppt.png',
        'audio/mpeg': 'https://pan-yz.cldisk.com/static/pc/images/icon/audio.png',
        'audio/wav': 'https://pan-yz.cldisk.com/static/pc/images/icon/audio.png',
        'video/mp4': 'https://pan-yz.cldisk.com/static/pc/images/icon/video.png',
        'video/avi': 'https://pan-yz.cldisk.com/static/pc/images/icon/video.png',
        'video/mov': 'https://pan-yz.cldisk.com/static/pc/images/icon/video.png',
        'video/webm': 'https://pan-yz.cldisk.com/static/pc/images/icon/video.png',
        'default': '/icons/default-icon.png'
      },
      // 加载状态
      loading: false,
      // 对话框显示状态
      dialogVisible: false
    };
  },
  /**
   * 组件创建时
   * @description 检查文件类型并加载对应图标
   */
  created() {
    this.checkFileType();
  },
  methods: {
    /**
     * 处理卡片点击事件
     * @description 根据 showType 决定是触发事件还是预览文件
     * @emits image-clicked - 当 showType 为 image-card 时触发
     */
    handleClick() {
      if (this.showType === 'image-card') {
        this.$emit('image-clicked', this.id);
        if (this.showType !== 'image-card') {
          this.loading = true;
          const fileExtension = this.url.split('.').pop().toLowerCase();
          if (['jpg', 'jpeg', 'png', 'gif', 'bmp', 'svg'].includes(fileExtension)) {
            this.previewImage().then(() => this.loading = false);
          } else if (['mp4', 'avi', 'mov', 'wmv', 'webm'].includes(fileExtension)) {
            this.previewVideo().then(() => this.loading = false);
          } else if (['pdf'].includes(fileExtension)) {
            this.previewPDF().then(() => this.loading = false);
          } else {
            // 对于其他文件类型，触发下载
            this.downloadFile();
          }
        }
      } else {
        // 当 showType 不是 image-card 时，打开对话框
        this.dialogVisible = true;
      }
    },
    /**
     * 预览图片
     * @returns {Promise} Promise 对象
     * @description 在新窗口中打开图片
     */
    previewImage() {
      return new Promise((resolve) => {
        const imageWindow = window.open('', '_blank');
        imageWindow.document.write(`<img src="${this.url}" style="width: 100%; height: 100%; object-fit: contain;">`);
        resolve();
      });
    },
    /**
     * 预览视频
     * @returns {Promise} Promise 对象
     * @description 在新窗口中打开视频
     */
    previewVideo() {
      return new Promise((resolve) => {
        const videoWindow = window.open('', '_blank');
        videoWindow.document.write(`<video src="${this.url}" controls style="width: 100%; height: 100%;">Your browser does not support the video tag.</video>`);
        resolve();
      });
    },
    /**
     * 预览PDF文件
     * @returns {Promise} Promise 对象
     * @description 在新窗口中打开PDF文件
     */
    previewPDF() {
      return new Promise((resolve) => {
        const pdfWindow = window.open('', '_blank');
        pdfWindow.document.write(`<iframe src="${this.url}" style="width: 100%; height: 100%;"></iframe>`);
        resolve();
      });
    },
    /**
     * 下载文件
     * @description 触发浏览器下载指定文件
     */
    downloadFile() {
      const fileName = this.url.split('/').pop();
      const a = document.createElement('a');
      a.href = this.url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      this.loading = false;
    },
    /**
     * 检查文件类型
     * @description 根据文件扩展名判断文件类型并设置对应图标
     */
    checkFileType() {
      const fileType = this.url.split('.').pop().toLowerCase();
      if (['jpg', 'jpeg', 'png', 'gif', 'bmp', 'svg'].includes(fileType)) {
        this.isImage = true;
        this.iconUrl = this.iconMap['image/' + fileType];
      } else if (['mp4', 'avi', 'mov', 'wmv', 'webm'].includes(fileType)) {
        this.isImage = false;
        this.iconUrl = this.iconMap['video/' + fileType];
      } else if (fileType === 'pdf') {
        this.isImage = false;
        this.iconUrl = this.iconMap['application/pdf'];
      } else if (['doc', 'docx'].includes(fileType)) {
        this.isImage = false;
        this.iconUrl = this.iconMap['application/msword'];
      } else if (['xls', 'xlsx'].includes(fileType)) {
        this.isImage = false;
        this.iconUrl = this.iconMap['application/vnd.ms-excel'];
      } else if (['ppt', 'pptx'].includes(fileType)) {
        this.isImage = false;
        this.iconUrl = this.iconMap['application/vnd.ms-powerpoint'];
      } else if (['mp3', 'wav'].includes(fileType)) {
        this.isImage = false;
        this.iconUrl = this.iconMap['audio/' + fileType];
      } else {
        this.isImage = false;
        this.iconUrl = this.iconMap['default'];
      }
    },
    /**
     * 预览文件内容
     * @description 根据文件类型调用对应的预览方法
     */
    previewContent() {
      // 触发原来的预览操作
      const fileExtension = this.url.split('.').pop().toLowerCase();
      if (['jpg', 'jpeg', 'png', 'gif', 'bmp', 'svg'].includes(fileExtension)) {
        this.previewImage().then(() => this.loading = false);
      } else if (['mp4', 'avi', 'mov', 'wmv', 'webm'].includes(fileExtension)) {
        this.previewVideo().then(() => this.loading = false);
      } else if (['pdf'].includes(fileExtension)) {
        this.previewPDF().then(() => this.loading = false);
      }else {this.downloadFile()}
    }
  }
}
</script>

<style scoped>
@media screen and (max-width: 768px) {
  img {
    max-width: 50%;
    max-height: 150px;
  }
}

.image-card {
  cursor: pointer;
  border-radius: 5px;
  border: solid 1px #dcd5d5;
}

.image-card:hover {
  cursor: pointer;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.3); /* 添加边框阴影 */
}

.loading-animation {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 100%;
  font-size: 20px;
  color: #666;
}

.image-container {
  display: flex;
  justify-content: center;
}

.resource {
  width: 100px;
}

.resource:hover {
  background-color: #afd4fc;
}

.image-card-title {
  padding: 5px;
}

.resource-title {
  font-size: 12px;
  display: flex;
  justify-content: center
}

.resource-img {
  height: 100px;
}

.img-resource {
  min-height: 95px;
}

.img-image-card {
  width: 200px; /* 这里修改为你想要的固定宽度 */
  height: 150px; /* 这里修改为你想要的固定高度 */
}
</style>