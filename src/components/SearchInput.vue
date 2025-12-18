<template>
  <div style="display: flex">
    <el-input
        v-model="localSearch"
        class="input-with-select"
        placeholder="输入关键字搜索"
        @input="handleInput"
        style="max-width: 500px;height: 38px"
    >
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
    search: {
      type: String,
      default: ''
    },
    selectedColumn: {
      type: String,
      default: ''
    },
    chineseColumns: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      localSearch: this.search,  // 存储 search 的副本
      localSelectedColumn: this.selectedColumn  // 存储 selectedColumn 的副本
    };
  },
  watch: {
    // 监听 search 并更新 localSearch
    search(newValue) {
      this.localSearch = newValue;
    },
    // 监听 selectedColumn 并更新 localSelectedColumn
    selectedColumn(newValue) {
      this.localSelectedColumn = newValue;
    }
  },
  methods: {
    handleInput() {
      this.$emit('input', this.localSearch);  // 发出事件时使用 localSearch
    },
    handleColumnChange() {
      this.$emit('change', this.localSelectedColumn); // 发出 change 事件通知父组件 selectedColumn 的更新
    }
  }
};
</script>