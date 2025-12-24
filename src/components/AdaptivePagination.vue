<!--
  自适应分页组件
  
  @component AdaptivePagination
  @description 根据表格高度自动计算每页显示数量的分页组件
  @author 党建系统开发团队
-->
<template>
  <div>
    <!-- Element UI 分页组件 -->
    <el-pagination
        :current-page.sync="currentPage"
        :page-size="pageSize"
        :total="total"
        layout="prev, pager, next"
        style="display: flex; justify-content: center; align-items: center;"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
    ></el-pagination>
  </div>
</template>

<script>
export default {
  name: "AdaptivePagination",
  props: {
    /**
     * 表格行高（像素）
     * @type {Number}
     */
    rowHeight: { type: Number, default: 50 },
    
    /**
     * 数据总数
     * @type {Number}
     */
    total: {
      type: Number,
      required: true,
    },
    
    /**
     * 表格 DOM 元素引用
     * @type {Object}
     */
    tableRef: {
      type: Object,
    },
    
    /**
     * 完整的表格数据
     * @type {Array}
     */
    tableData: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      currentPage: 1,     // 当前页码
      pageSize: 1,        // 每页数量，初始值设为 1 避免为 0
      tableHeight: 0,     // 表格高度
    };
  },
  watch: {
    /**
     * 监听表格高度变化，重新计算每页数量
     */
    tableHeight(newHeight) {
      this.calculatePageSize(newHeight);
    },
    
    /**
     * 监听表格数据变化
     */
    tableData: {
      handler() {
        this.emitSlicedData();
      },
      immediate: true,
    },
    
    /**
     * 监听当前页码变化
     */
    currentPage() {
      this.emitSlicedData();
    },
    
    /**
     * 监听每页数量变化
     */
    pageSize() {
      this.emitSlicedData();
    },
  },
  mounted() {
    this.$nextTick(() => {
      this.calculateTableHeight(); // 确保表格渲染完成后再计算高度
    });
    // 监听窗口大小变化
    window.addEventListener("resize", this.handleWindowResize);
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.handleWindowResize);
  },
  methods: {
    /**
     * 计算表格高度
     * 获取表格容器高度并扣除表头高度，得到可用于显示数据的高度
     */
    calculateTableHeight() {
      if (this.tableRef) {
        const table = this.tableRef.$el;
        const headerHeight = table.querySelector('.el-table__header-wrapper')?.offsetHeight || 0;
        const tableHeight = table.offsetHeight - headerHeight;

        if (tableHeight > 0) {
          this.tableHeight = tableHeight;
          this.calculatePageSize(tableHeight);
        } else {
          // 如果高度为 0，延迟 100ms 后重新计算
          setTimeout(() => {
            this.calculateTableHeight();
          }, 100);
        }
      }
    },
    
    /**
     * 根据表格高度计算每页显示数量
     * @param {Number} height - 表格可用高度
     */
    calculatePageSize(height) {
      const newPageSize = Math.max(1, Math.floor(height / this.rowHeight));
      this.pageSize = newPageSize;
      this.sliceTableData();
    },
    
    /**
     * 处理窗口大小变化事件
     * 窗口大小改变时重新计算表格高度和每页数量
     */
    handleWindowResize() {
      this.$nextTick(() => {
        this.calculateTableHeight();
      });
    },
    
    /**
     * 切片表格数据
     * 根据当前页码和每页数量返回对应的数据片段
     * @returns {Array} 当前页的数据数组
     */
    sliceTableData() {
      const start = (this.currentPage - 1) * this.pageSize;
      const end = start + this.pageSize;
      return this.tableData.slice(start, end);
    },
    
    /**
     * 向父组件发送切片后的数据
     * 通过事件通知父组件更新显示的数据
     */
    emitSlicedData() {
      const slicedData = this.sliceTableData();
      this.$emit("update:sliced-data", slicedData);
    },
    
    /**
     * 处理每页数量变化
     * @param {Number} newSize - 新的每页数量
     */
    handleSizeChange(newSize) {
      this.pageSize = newSize;
    },
    
    /**
     * 处理当前页码变化
     * @param {Number} newPage - 新的页码
     */
    handleCurrentChange(newPage) {
      this.currentPage = newPage;
    },
  },
};
</script>