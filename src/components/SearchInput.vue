<!--
  搜索输入组件
  
  @component SearchInput
  @description 带下拉选项的搜索输入框，支持按字段搜索
  @author 党建系统开发团队
-->
<template>
  <div style="display: flex">
    <!-- 搜索输入框 -->
    <el-input
        v-model="localSearch"
        class="input-with-select"
        placeholder="输入关键字搜索"
        @input="handleInput"
        style="max-width: 500px;height: 38px"
    >
      <!-- 搜索字段选择下拉框 -->
      <el-select v-model="localSelectedColumn" slot="prepend" placeholder="查询字段" style="width: 100px" @change="handleColumnChange">
        <el-option v-for="(column, index) in chineseColumns" :key="index" :label="column.label"
                   :value="column.value"></el-option>
      </el-select>
    </el-input>
  </div>
</template>

<script>
export default {
  name: "SearchInput",
  props: {
    /**
     * 搜索关键字
     * @type {String}
     */
    search: {
      type: String,
      default: ''
    },
    
    /**
     * 当前选中的搜索字段
     * @type {String}
     */
    selectedColumn: {
      type: String,
      default: ''
    },
    
    /**
     * 可搜索的字段列表
     * @type {Array}
     * @example [{label: '标题', value: 'title'}, {label: '作者', value: 'author'}]
     */
    chineseColumns: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      localSearch: this.search,                      // 本地搜索关键字副本
      localSelectedColumn: this.selectedColumn      // 本地选中字段副本
    };
  },
  watch: {
    /**
     * 监听 search 并更新 localSearch
     */
    search(newValue) {
      this.localSearch = newValue;
    },
    
    /**
     * 监听 selectedColumn 并更新 localSelectedColumn
     */
    selectedColumn(newValue) {
      this.localSelectedColumn = newValue;
    }
  },
  methods: {
    /**
     * 处理输入事件
     * 向父组件发送 input 事件
     */
    handleInput() {
      this.$emit('input', this.localSearch);
    },
    
    /**
     * 处理字段选择变化事件
     * 向父组件发送 change 事件
     */
    handleColumnChange() {
      this.$emit('change', this.localSelectedColumn);
    }
  }
};
</script>