<template>
  <div class="carousel-editor-container">
    <div class="action-buttons" style="margin-bottom: 20px">
      <button @click="saveCarousel" class="primary-btn">保存</button>
      <button @click="cancelEdit" class="secondary-btn">取消</button>
    </div>

    <div class="carousel-config">
      <!-- 图片数量控制 -->
      <div class="form-group">
        <label>图片数量：</label>
        <div class="quantity-controls">
          <button @click="decreaseQuantity" :disabled="carouselImages.length <= 1" class="quantity-btn">-</button>
          <span>{{ carouselImages.length }}</span>
          <button @click="increaseQuantity" class="quantity-btn">+</button>
        </div>
      </div>

      <!-- 图片列表 -->
      <div class="image-list">
        <div v-for="(image, index) in carouselImages" :key="index" class="image-item">

          <div class="image-index">{{ index + 1 }}</div>

          <div
              class="drag-handle"
              @dragstart="handleDragStart(index, $event)"
              draggable="true"
              :class="{ 'is-dragging': isDragging && dragIndex === index }"
              aria-draggable="true"
              aria-label="拖动调整顺序"
          >
            <span class="drag-icon">≡</span> <!-- 更通用的排序图标 -->
            <span class="drag-text">拖动</span>
          </div>

          <div class="image-content">
            <!-- 图片上传 -->
            <div class="upload-section">
              <label class="upload-label"  @click="showDialog(index)">
                <img
                    v-if="image.url"
                    :src="image.url"
                    alt="轮播图"
                    class="preview-image"
                />
                <span v-else class="upload-placeholder">点击上传图片</span>
              </label>
            </div>

            <!-- 链接地址 -->
            <div class="link-input">
              <label>跳转链接：</label>
              <input
                  type="url"
                  v-model="image.link"
                  placeholder="请输入有效 URL（可选）"
                  class="input-field"
              />
            </div>
            <div class="link-input">
              <label>图片描述：</label>
              <input
                  type="text"
                  v-model="image.text"
                  placeholder="请输入图片描述"
                  class="input-field"
              />
            </div>

            <!-- 删除按钮 -->
            <button
                @click="deleteImage(index)"
                :disabled="carouselImages.length <= 1"
                class="delete-btn"
            >
              🗑 删除
            </button>
          </div>
        </div>
      </div>

      <!-- 排序提示 -->
      <div class="sort-tip" v-show="isDragging">
        拖动排序柄调整播放顺序
      </div>
    </div>

    <el-dialog
        :destroy-on-close="true"
        :visible.sync="dialogVisible"
        title="更换图片"
        width="40%">
      <div style="margin: 10px 0; display:flex;flex-direction: column;justify-content: center;align-items: center;">
        <single-image-uploader @updateQuery="updatePic"></single-image-uploader>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import SingleImageUploader from "@/components/SingleImageUploader.vue";

export default {
  name: "CarouselSet",
  components: {SingleImageUploader},
  data() {
    return {
      dialogVisible:false,
      chosenPic:-1,
      carouselImages: [
        // 初始图片数据示例
        { id: 1, url: '', link: '',text:'' }
      ],
      isDragging: false,
      dragIndex: -1,
      draggedElement: null
    };
  },

  mounted() {
    this.fetchCarouselData();
  },

  methods: {
    showDialog(index) {
      this.dialogVisible = true;
      this.chosenPic=index;
    },
    updatePic(url) {
      this.carouselImages[this.chosenPic].url=url;
    },

    fetchCarouselData() {
      this.$request.get('/homePic/all').
      then(res => {
        this.carouselImages=res.data;
      });
    },

    // 保存轮播图配置
    saveCarousel() {
      // 数据验证
      const invalidImages = this.carouselImages.some(img => !img.url);
      if (invalidImages) {
        this.$message.error('请为所有图片上传内容');
        return;
      }
      console.log(this.carouselImages);
      this.$request.post('/homePic/update',this.carouselImages).then(
          res => {
            if (res.code === '200') {
              this.$message.success('保存成功');
            }
          }
      ).catch((error) => {
        this.$message.error('保存失败');
      });

      console.log('保存的数据:', this.carouselImages);
    },

    // 取消编辑
    cancelEdit() {
      this.$router.go(-1);
    },

    // 增加图片数量
    increaseQuantity() {
      const newId = this.carouselImages.length + 1;
      this.carouselImages.push({ id: newId, url: '', link: '' ,text:''});
    },

    // 减少图片数量
    decreaseQuantity() {
      if (this.carouselImages.length > 1) {
        this.carouselImages.splice(this.carouselImages.length - 1, 1);
      }
    },

    // 处理图片上传
    handleImageUpload(event, index) {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          this.carouselImages[index].url = e.target.result;
        };
        reader.readAsDataURL(file);
      }
    },

    // 删除图片
    deleteImage(index) {
      if (this.carouselImages.length > 1) {
        this.carouselImages.splice(index, 1);
        // 重新生成 id
        this.carouselImages = this.carouselImages.map((img, i) => ({
          ...img,
          id: i + 1
        }));
      }
    },

    // 拖动排序开始
    handleDragStart(index, event) {
      this.dragIndex = index;
      this.isDragging = true;
      // 记录拖动元素的位置
      this.draggedElement = event.target.closest('.image-item');
      // 为了在拖动过程中保持元素位置，添加以下代码
      const rect = this.draggedElement.getBoundingClientRect();
      this.draggedElement.style.position = 'fixed';
      this.draggedElement.style.top = rect.top + window.pageYOffset + 'px';
      this.draggedElement.style.left = rect.left + window.pageXOffset + 'px';
      this.draggedElement.style.zIndex = '1000';
      // 新增：设置被拖动元素的数据
      event.dataTransfer.setData('text/plain', index);
    },

    handleDragOver(event) {
      event.preventDefault();
      const targetItem = event.target.closest('.image-item');
      if (targetItem) {
        event.dataTransfer.dropEffect = 'move';
        // 计算鼠标相对于目标元素的位置，用于调整拖动元素的位置
        const targetRect = targetItem.getBoundingClientRect();
        const x = event.clientX - targetRect.left;
        const y = event.clientY - targetRect.top;
        if (this.draggedElement) {
          this.draggedElement.style.top = y + targetRect.top + window.pageYOffset + 'px';
          this.draggedElement.style.left = x + targetRect.left + window.pageXOffset + 'px';
        }
      }
    },

    handleDragEnd(event) {
      this.isDragging = false;
      if (this.draggedElement) {
        this.draggedElement.style.position = '';
        this.draggedElement.style.top = '';
        this.draggedElement.style.left = '';
        this.draggedElement.style.zIndex = '';
      }
      const targetItem = event.target.closest('.image-item');
      if (targetItem) {
        const targetIndex = Array.from(event.target.closest('.image-list').children).indexOf(targetItem);
        const draggedIndex = parseInt(event.dataTransfer.getData('text/plain'), 10);

        if (draggedIndex!== targetIndex && targetIndex!== -1) {
          // 交换数组元素位置
          const temp = this.carouselImages[draggedIndex];
          this.carouselImages.splice(draggedIndex, 1);
          this.carouselImages.splice(targetIndex, 0, temp);
          // 重新生成 id（排序依据）
          this.carouselImages = this.carouselImages.map((img, i) => ({
            ...img,
            id: i + 1
          }));
        }
      }
    }
  },

  created() {
    document.addEventListener('dragend', this.handleDragEnd);
    document.addEventListener('dragover', this.handleDragOver);
  },

  beforeDestroy() {
    document.removeEventListener('dragend', this.handleDragEnd);
    document.removeEventListener('dragover', this.handleDragOver);
  }
};
</script>
<style scoped lang="scss">

.image-index {
  width: 30px;
  height: 30px;
  background-color: #4a90e2;
  color: white;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 14px;
  margin-right: 10px;
}
.drag-handle {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 12px;
  border-radius: 4px;
  cursor: grab;
  user-select: none;
  transition: all 0.2s ease;

  /* 常态样式 */
  background: #f5f7fa;
  color: #667085;
  border: 1px solid #e0e7ff;

  /* 拖动中样式 */
  &.is-dragging {
    cursor: grabbing;
    background: #e9f2ff;
    border-color: #4a90e2;
    box-shadow: 0 2px 4px rgba(74, 144, 226, 0.15);
    transform: scale(1.02);
  }

  .drag-icon {
    font-size: 1.1em;
    font-weight: bold;
  }

  .drag-text {
    font-size: 14px;
    letter-spacing: 0.5px;
  }
}
.carousel-editor-container {
  padding: 60px;
  max-width: 1600px;
  margin: 0 auto;

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 30px;

    .page-title {
      font-size: 24px;
      color: #333;
    }
  }

  .carousel-config {
    background: #fff;
    padding: 25px;
    border-radius: 10px;
    box-shadow: 0 2px 15px rgba(0,0,0,0.05);

    .form-group {
      margin-bottom: 20px;
      font-size: 16px;

      label {
        display: block;
        margin-bottom: 8px;
        color: #666;
      }
    }

    .quantity-controls {
      display: inline-flex;
      gap: 8px;
      align-items: center;

      .quantity-btn {
        padding: 6px 12px;
        border: 1px solid #e0e0e0;
        border-radius: 4px;
        background: #f5f5f5;
        cursor: pointer;
        transition: all 0.3s;

        &:hover {
          background: #e9e9e9;
        }

        &:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
      }
    }

    .image-list {
      margin-top: 30px;
      display: grid;
      gap: 20px;

      .image-item {
        padding: 20px;
        border: 1px dashed #e0e0e0;
        border-radius: 8px;
        display: grid;
        grid-template-columns: 60px 1fr auto;
        align-items: start;
        gap: 20px;
        min-height: 180px;

        .drag-handle {
          cursor: grab;
          padding: 4px 8px;
          background: #f8f8f8;
          border-radius: 4px;
          font-size: 14px;
          color: #666;
        }

        .image-content {
          display: flex;
          flex-direction: column;
          gap: 12px;
          flex: 1;

          .upload-label {
            display: block;
            width: 100%;
            height: 120px;
            border: 2px dashed #e0e0e0;
            border-radius: 6px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: all 0.3s;

            &:hover {
              border-color: #4a90e2;
            }

            .preview-image {
              max-width: 100%;
              max-height: 100%;
              object-fit: cover;
            }

            .upload-placeholder {
              color: #999;
              font-size: 14px;
            }
          }

          .link-input {
            input {
              width: 100%;
              padding: 8px 12px;
              border: 1px solid #e0e0e0;
              border-radius: 4px;
              font-size: 14px;
            }
          }
        }

        .delete-btn {
          color: #ff4d4f;
          background: transparent;
          border: none;
          cursor: pointer;
          font-size: 16px;
        }
      }
    }

    .sort-tip {
      margin-top: 15px;
      font-size: 14px;
      color: #666;
      display: none;

      .sort-tip.is-visible {
        display: block;
      }
    }
  }

  .primary-btn {
    background: #4a90e2;
    color: #fff;
    padding: 10px 24px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: all 0.3s;

    &:hover {
      background: #357abd;
    }
  }

  .secondary-btn {
    margin-left: 15px;
    background: #f5f5f5;
    color: #333;
    padding: 10px 24px;
    border: 1px solid #e0e0e0;
    border-radius: 4px;
    cursor: pointer;
    transition: all 0.3s;

    &:hover {
      background: #f0f0f0;
    }
  }

  // 移动端适配
  @media (max-width: 768px) {
    padding: 15px;

    .header {
      flex-direction: column;
      gap: 15px;
    }

    .image-list {
      grid-template-columns: 1fr;
    }
  }
}
</style>