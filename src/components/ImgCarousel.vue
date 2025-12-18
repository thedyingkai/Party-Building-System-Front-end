<template>
  <div class="ImgCarousel">
    <el-carousel :height="carouselHeight" trigger="click">
      <el-carousel-item v-for="(item, index) in carouselItems" :key="index" :current-index="currentIndex">
        <a :href="item.link" target="_blank">
          <div class="txt">{{ item.text }}</div>
          <div :style="{ backgroundImage: `url(${item.url})` }" class="img"></div>
          <div class="page-info">
            <div class="current"> {{ item.index}}</div>
            <div class="total">/{{ carouselItems.length }}</div>
          </div>
        </a>
      </el-carousel-item>
    </el-carousel>
  </div>
</template>

<script>
export default {
  name: "ImgCarousel",
  props: {
    carouselItems: {
      type: Array,
      required: true,
      // 确保 carouselItems 数组中的每个对象都有一个有效的 imageUrl 属性
      validator: function (value) {
        return value.every(item => typeof item.imageUrl === 'string' && item.imageUrl.trim() !== '');
      }
    },
    carouselHeight: {
      type: String,
      default: '150px' // 默认轮播器高度
    }
  },
  data() {
    return {
      currentIndex: 0 // 初始化为第一项
    };
  },
  methods: {
    handleCarouselChange(index) {
      this.currentIndex = index;
    }
  }
}
</script>

<style scoped>
.img {
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
  position: relative; /* 确保 .txt 可以相对于 .img 定位 */
  /* 你可以添加其他样式，比如 background-color: rgba(0,0,0,0.5); 用于调试 */
}

.txt {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  font-size: 110%;
  color: #fff;
  height: 56px;
  line-height: 56px;
  -o-text-overflow: ellipsis;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  padding-right: 56px;
  padding-left: 12px;
  background: url(../assets/img/p6.png);
  z-index: 1;
}

.page-info {
  position: absolute;
  z-index: 2;
  bottom: 0;
  right: 20px;
  font-size: 16px;
  line-height: 56px;
  color: #fff;
  display: flex; /* 使用 flex 布局 */
  align-items: baseline; /* 向下对齐 */
}

.page-info .current {
  font-size: 24px; /* 当前页码使用更大的字体大小 */
  margin-right: 2px; /* 可选：在当前页码和总页码之间添加一些间距 */
}
</style>