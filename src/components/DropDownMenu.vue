<!--
  下拉菜单组件
  
  @component DropDownMenu
  @description 可自定义菜单项的下拉选择组件，支持高亮显示选中项
  @author 党建系统开发团队
-->
<template>
  <!-- 下拉菜单 -->
  <el-dropdown style="margin-left: 15px" @command="handleCommand">
    <span class="click-able">
      分类<i class="el-icon-arrow-down el-icon--right"></i>
    </span>
    <!-- 下拉菜单项 -->
    <el-dropdown-menu slot="dropdown" class="dropdown-menu">
      <el-dropdown-item
          v-for="(item, index) in menuItems"
          :key="index"
          :class="{ 'highlighted-item': selectedIndex === index }"
          :command="index"
          :icon="item.icon"
          class="dropdown-item-fixed">
        {{ item.label }}
      </el-dropdown-item>
    </el-dropdown-menu>
  </el-dropdown>
</template>

<script>
export default {
  name: "DropDownMenu",
  props: {
    /**
     * 菜单项列表
     * @type {Array}
     * @property {String} label - 菜单项显示文本
     * @property {String} icon - 菜单项图标
     */
    menuItems: {
      type: Array,
      required: true,
      default: () => []
    }
  },
  data() {
    return {
      selectedIndex: null
    };
  },
  methods: {
    /**
     * 处理菜单项选择
     * 
     * @param {Number} command - 选中的菜单项索引
     * @emits filterType - 触发过滤类型选择事件
     */
    handleCommand(command) {
      this.selectedIndex = command;
      this.$emit('filterType', command);
    }
  }
};
</script>

<style scoped>
.dropdown-menu {
  display: flex;
  flex-wrap: wrap;
  width: 300px; /* 设置一个足以容纳两个元素的宽度，可根据实际情况调整 */
}

.dropdown-item-fixed {
  width: 140px; /* 设置每个下拉项的固定宽度，可根据实际情况调整 */
}

.highlighted-item {
  background-color: #e6f7ff; /* 高亮背景色，可根据需要修改 */
  color: #1890ff; /* 高亮文本颜色，可根据需要修改 */
}

.check-icon {
  margin-left: 5px; /* 勾图标与文本的间距，可根据需要修改 */
}
</style>