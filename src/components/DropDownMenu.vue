<template>
  <el-dropdown style="margin-left: 15px" @command="handleCommand">
    <span class="click-able">
      分类<i class="el-icon-arrow-down el-icon--right"></i>
    </span>
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