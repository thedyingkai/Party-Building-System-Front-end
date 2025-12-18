<template>
  <div class="nav-menu-item" @mouseenter="showSubMenu = true" @mouseleave="handleMouseLeave">
    <div class="nav-menu-item-title">
      <router-link v-if="!item.child || item.child.length === 0" :to="{ name: 'ArticleShow', params: { id: item.id } }">
        {{ item.name }}
      </router-link><!-- 当 item.child.length 不为 0 时，只显示名字，不进行跳转 -->
      <span v-else>{{ item.name }}</span>
    </div>
    <div v-if="showSubMenu && item.child && item.child.length" class="nav-submenu" @mouseenter="preventSubMenuHide"
         @mouseleave="handleSubMenuLeave"> <!-- 有子栏目，则递归调用自身 -->
      <ul :class="{ rightSubmenu: level >= 2 }">
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
    item: {
      type: Object,
      required: true
    },
    level: {
      type: Number,
      default: 0
    },
    showSubMenuParent: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      showSubMenu: false
    };
  },
  methods: {
    handleMouseLeave() {
// 增加一个短暂的延迟，用于判断鼠标是否进入了子菜单区域
      setTimeout(() => {
        if (!this.$el.querySelector('.nav-submenu:hover')) {
          this.showSubMenu = false;
        }
      }, 200);
    },
    preventSubMenuHide() {
      this.showSubMenu = true;
    },
    handleSubMenuLeave() {
      this.showSubMenu = false;
    }
  },
  watch: {
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