<!--
  图片轮播组件
  
  @component ImgCarousel
  @description 首页轮播图组件，支持点击切换和页码显示
  @author 党建系统开发团队
-->
<template>
  <div class="ImgCarousel">
    <!-- 轮播组件 -->
    <el-carousel :height="carouselHeight" trigger="click">
      <el-carousel-item v-for="(item, index) in carouselItems" :key="index" :current-index="currentIndex">
        <a :href="item.link" target="_blank">
          <!-- 轮播项文本 -->
          <div class="txt">{{ item.text }}</div>
          <!-- 轮播项图片 -->
          <div :style="{ backgroundImage: `url(${item.url})` }" class="img"></div>
          <!-- 页码信息 -->
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
    /**
     * 轮播项列表
     * @type {Array}
     * @property {String} imageUrl - 图片URL
     * @property {String} text - 显示文本
     * @property {String} link - 跳转链接
     */
    carouselItems: {
      type: Array,
      required: true,
      // 确保 carouselItems 数组中的每个对象都有一个有效的 imageUrl 属性
      validator: function (value) {
        return value.every(item => typeof item.imageUrl === 'string' && item.imageUrl.trim() !== '');
      }
    },
    /**
     * 轮播器高度
     * @type {String}
     */
    carouselHeight: {
      type: String,
      default: '150px' // 默认轮播器高度
    }
  },
  data() {
    return {
      // 当前轮播项索引
      currentIndex: 0
    };
  },
  methods: {
    /**
     * 处理轮播切换
     * @param {number} index - 新的轮播项索引
     * @description 更新当前轮播项索引
     */
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