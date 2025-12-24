<!--
  导航菜单组件
  
  @component NavMenu
  @description 渲染导航菜单列表，支持多级菜单结构
  @author 党建系统开发团队
-->
<template>
  <div class="nav-menu">
    <ul class="nav">
      <!-- 遍历菜单项 -->
      <li v-for="item in menuItems" :key="item.id" class="menu-button">
        <!-- 菜单项组件，支持递归渲染子菜单 -->
        <NavMenuItem :item="item" :level="0"/>
      </li>
    </ul>
  </div>
</template>

<script>
import NavMenuItem from './NavMenuItem.vue';

export default {
  name: 'NavMenu',
  components: {
    NavMenuItem // 菜单项子组件
  },
  props: {
    /**
     * 菜单数据列表
     * @type {Array}
     * @required
     */
    menuItems: {
      type: Array,
      required: true
    }
  }
};
</script>

<style scoped>
.nav-menu {
  display: flex;
  flex-direction: row;
  list-style: none;
  padding: 0;
  margin: 0;
}

.nav {
  display: flex;
  flex-direction: row;
  align-items: center;
}
</style>