<!--
  导航菜单项组件
  
  @component NavMenuItem
  @description 递归菜单项组件，支持多级下拉菜单，鼠标悬停显示子菜单
  @author 党建系统开发团队
-->
<template>
  <div class="nav-menu-item" @mouseenter="showSubMenu = true" @mouseleave="handleMouseLeave">
    <!-- 菜单项标题 -->
    <div class="nav-menu-item-title">
      <!-- 无子菜单：直接跳转到文章详情页 -->
      <router-link v-if="!item.child || item.child.length === 0" :to="{ name: 'ArticleShow', params: { id: item.id } }">
        {{ item.name }}
      </router-link>
      <!-- 有子菜单：只显示名称，不跳转 -->
      <span v-else>{{ item.name }}</span>
    </div>
    <!-- 子菜单区域（鼠标悬停显示） -->
    <div v-if="showSubMenu && item.child && item.child.length" class="nav-submenu" @mouseenter="preventSubMenuHide"
         @mouseleave="handleSubMenuLeave">
      <ul :class="{ rightSubmenu: level >= 2 }">
        <!-- 递归渲染子菜单项 -->
        <li v-for="childItem in item.child" :key="childItem.id">
          <NavMenuItem :item="childItem" :level="level + 1" :showSubMenuParent="showSubMenu"/>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: 'NavMenuItem',
  props: {
    /**
     * 菜单项数据
     * @type {Object}
     */
    item: {
      type: Object,
      required: true
    },
    /**
     * 菜单层级（0为根层级）
     * @type {Number}
     */
    level: {
      type: Number,
      default: 0
    },
    /**
     * 父级菜单是否显示子菜单
     * @type {Boolean}
     */
    showSubMenuParent: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      showSubMenu: false  // 当前菜单项是否显示子菜单
    };
  },
  methods: {
    /**
     * 鼠标离开菜单项处理
     * 增加延迟判断，避免鼠标移入子菜单时关闭
     */
    handleMouseLeave() {
      setTimeout(() => {
        if (!this.$el.querySelector('.nav-submenu:hover')) {
          this.showSubMenu = false;
        }
      }, 200);  // 200ms 延迟
    },
    
    /**
     * 阻止子菜单隐藏
     * 鼠标进入子菜单区域时保持显示
     */
    preventSubMenuHide() {
      this.showSubMenu = true;
    },
    
    /**
     * 子菜单鼠标离开处理
     */
    handleSubMenuLeave() {
      this.showSubMenu = false;
    }
  },
  watch: {
    /**
     * 监听父组件传入的显示状态
     */
    showSubMenuParent(newVal) {
      this.showSubMenu = newVal;
    }
  }
};
</script>

<style scoped>
a {
  color: #ffffff !important;
  vertical-align: middle;
}

.nav-menu-item {
  width: 160px;
  height: 80px;
  font-size: 18px;
  line-height: 55px;
  font-weight: 700;
  color: #fff;
}

.nav-menu-item-title {
  cursor: pointer;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.nav-submenu {
  position: absolute;
  top: 100%;
  height: 60px;
  left: 0;
  padding: 0;
  margin: 0;
  list-style: none;
  background-color: #bb3902;
  z-index: 10;
}

.nav-submenu.rightSubmenu {
  left: 100%;
  top: 0;
  z-index: 10;
}

.nav-submenu.rightSubmenu.nav-submenu {
  top: 0;
  left: 100%;
  z-index: 10;
}

.nav-submenu li {
  background-color: #bb3902; /* 为 li 元素添加背景颜色 */
}
</style>