<template>
  <div>
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
    rowHeight: { type: Number, default: 50 },
    total: {
      type: Number,
      required: true,
    },
    tableRef: {
      type: Object, // 接收表格的 DOM 元素
    },
    tableData: {
      type: Array, // 接收完整的表格数据
      required: true,
    },
  },
  data() {
    return {
      currentPage: 1,
      pageSize: 1, // 初始值设为 1，避免为 0
      tableHeight: 0,
    };
  },
  watch: {
    tableHeight(newHeight) {
      this.calculatePageSize(newHeight);
    },
    tableData: {
      handler() {
        this.emitSlicedData();
      },
      immediate: true,
    },
    currentPage() {
      this.emitSlicedData();
    },
    pageSize() {
      this.emitSlicedData();
    },
  },
  mounted() {
    this.$nextTick(() => {
      this.calculateTableHeight(); // 确保表格渲染完成后再计算高度
    });
    window.addEventListener("resize", this.handleWindowResize);
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.handleWindowResize);
  },
  methods: {
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
    calculatePageSize(height) {
      const newPageSize = Math.max(1, Math.floor(height / this.rowHeight));
      this.pageSize = newPageSize;
      this.sliceTableData();
    },
    handleWindowResize() {
      this.$nextTick(() => {
        this.calculateTableHeight();
      });
    },
    sliceTableData() {
      const start = (this.currentPage - 1) * this.pageSize;
      const end = start + this.pageSize;
      return this.tableData.slice(start, end);
    },
    emitSlicedData() {
      const slicedData = this.sliceTableData();
      this.$emit("update:sliced-data", slicedData);
    },
    handleSizeChange(newSize) {
      this.pageSize = newSize;
    },
    handleCurrentChange(newPage) {
      this.currentPage = newPage;
    },
  },
};
</script>