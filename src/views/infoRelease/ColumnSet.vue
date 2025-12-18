<template>
  <div class="el-container" style="justify-content: space-around; align-items: center;">
    <div class="column-container">
      <div class="column-container-header">
        <div>
          <label>栏目设置</label>
          <el-tooltip effect="light">
            <div slot="content">您可以在此处调整栏目，拖拽以改变栏目顺序和所属关系</div>
            <span style="padding: 5px;"><i class="el-icon-warning-outline"></i></span>
          </el-tooltip>
        </div>
      </div>
      <div class="column-container-main">
        <TreeList ref="newColumnList" :column-data="columnList" @columnDataUpdated="updateColumnData"
                  @node-clicked="showNodeInfo"></TreeList>
      </div>
    </div>
    <div class="article-container">
      <div class="article-container-header">
        <div>
          <label>当前栏目{{ this.title }}文章 </label>
          <el-tooltip effect="light">
            <div slot="content">您可以在此处调整栏目下的文章</div>
            <span style="padding: 5px;"><i class="el-icon-warning-outline"></i></span>
          </el-tooltip>
        </div>
        <div class="input-container">
          <el-input
              v-model="filterText"
              placeholder="输入关键字进行过滤">
          </el-input>
        </div>
      </div>
      <div class="article-container-main">
        <div>
          <el-tooltip effect="light">
            <div slot="content">添加文章</div>
            <span style="padding: 5px;" class="click-able"><i class="el-icon-circle-plus-outline" @click="addSource"></i></span>
          </el-tooltip>
          <el-tooltip effect="light">
            <div slot="content">批量移动文章</div>
            <span style="padding: 5px;" class="click-able"><i class="el-icon-share" @click="moveSource"></i></span>
          </el-tooltip>
          <el-tree
              ref="tree"
              :data="formatSourceList(sourceList)"
              :draggable="true"
              :filter-node-method="filterNode"
              :render-content="renderContent"
              class="filter-tree"
              default-expand-all
              show-checkbox>
          </el-tree>
        </div>
      </div>
    </div>
    <el-dialog
        :before-close="clearSelectedSource"
        :cancel-button-text="cancelButtonText"
        :confirm-button-text="confirmButtonText"
        :custom-class="customClass"
        :show-cancel-button="true"
        :visible.sync="dialogVisible_move"
        title="移动文章"
    >
      <label>以下文章将被移至栏目</label>
      <el-cascader
          v-model="targetColumn" :options="formattedColumnList" filterable placeholder="选择栏目"
          popper-class="select_popper" style="margin: 10px;" @change="onColumnChange">
        <template slot-scope="{node,data }">
          <span>{{ data.label }}</span>
          <span v-if="!node.isLeaf"> ({{ data.children.length }}) </span>
        </template>
      </el-cascader>
      <div class="sourceList-container">
        <el-tree
            ref="tree-to-move"
            :data="formatSourceList(selectedSourceList)"
            :default-checked-keys="selectAll(selectedSourceList)"
            :draggable="true"
            :render-content="renderContentInDialog"
            class="filter-tree"
            default-expand-all
            node-key="id"
            show-checkbox>
        </el-tree>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible_move = false">取 消</el-button>
        <el-button type="primary" @click="moveSourceTo">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
        :cancel-button-text="cancelButtonText"
        :confirm-button-text="confirmButtonText"
        :custom-class="customClass"
        :show-cancel-button="true"
        :visible.sync="dialogVisible_add"
        title="添加文章"
    >
      <div class="dialog-body-header">
        <label>从栏目</label>
        <el-cascader
            v-model="fromColumnId"
            :options="formattedColumnList"
            filterable
            placeholder="选择栏目"
            popper-class="select_popper"
            style="margin: 10px;"
            @change="onColumnChange">
          <template slot-scope="{node,data }">
            <span>{{ data.label }}</span>
            <span v-if="!node.isLeaf"> ({{ data.children.length }}) </span>
          </template>
        </el-cascader>
        <label>移动文章至栏目{{ this.title }}</label>
      </div>
      <div class="sourceList-container">
        <el-tree
            ref="tree-in-dialog"
            :data="formatSourceList(sourceListInDialog)"
            :draggable="true"
            :filter-node-method="filterNode"
            :render-content="renderContentInDialog"
            class="filter-tree"
            default-expand-all
            node-key="id"
            show-checkbox>
        </el-tree>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible_add = false">取 消</el-button>
        <el-button type="primary" @click="moveSources">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import TreeList from "@/components/TreeList";

export default {
  name: "ColumnSet",
  components: {TreeList},
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val);
      this.$nextTick(() => {
        this.$refs.tree.store.filteredNodes = [];
        this.$refs.tree.filter(val);
      });
    },
  },
  data() {
    return {
      columnList: [],
      formattedColumnList: [],
      title: '（默认栏目（未分类））',
      sourceList: [],
      filterText: '',
      selectedColumn: '',
      fromColumnId: '',
      dialogVisible_move: false,
      dialogVisible_add: false,
      selectedSourceList: [],
      targetColumn: '',
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      customClass: 'custom-dialog-box',
      sourceListInDialog: '',
    };
  },
  async created() {
    await this.loadData();
    this.showNodeInfo(this.columnList[this.columnList.length - 1]);
  },
  methods: {
    async loadData() {
      try {
        const res = await this.$request.get('/column/selectAll');
        if (res.code === '200') {
          if (Array.isArray(res.data)) {
            this.columnList = this.convertToArray(res.data);
            this.formattedColumnList = this.transformOptions(this.columnList);
          } else {
            console.error('返回的数据不是数组:', res.data);
          }
        } else {
          console.error('请求失败', res.code);
        }
      } catch (error) {
        console.error('栏目信息获取失败:', error);
      }
    },
    showNodeInfo(node) {
      if (!node) return;
      if (node.children.length > 0) return;
      this.selectedColumn = node;
      this.title = '（' + node.name + '）';
      this.$request.get('/article/selectArticleBycoid/' + node.id).then(
          res => {
            if (res.code === '200') {
              this.sourceList = res.data;
            } else {
              console.error('请求失败', res.data.msg);
            }
          }
      ).catch(error => {
        console.error('发送请求失败:', error);
      });
    },
    onColumnChange(selectedOptions) {
      if (selectedOptions && selectedOptions.length > 0) {
        const selectedNode = selectedOptions[selectedOptions.length - 1];
        this.showSourceOfColumn(selectedNode);
      }
    },
    showSourceOfColumn(nodeId) {
      this.$request.get('/article/selectArticleBycoid/' + nodeId).then(
          res => {
            if (res.code === '200') {
              this.sourceListInDialog = res.data;
            } else {
              console.error('请求失败', res.data.msg);
            }
          }
      ).catch(error => {
        console.error('发送请求失败:', error);
      });
    },
    convertToArray(array) {
      let result = [];
      if (Array.isArray(array)) {
        array.forEach(item => {
          let newItem = {
            id: item.id,
            parent_id: item.parent_id,
            name: item.name,
            index: item.index,
            is_empty: item.is_empty,
            children: this.convertToArray(item.child)
          };
          result.push(newItem);
        });
      }
      return result;
    },
    formatSourceList(array) {
      if (!Array.isArray(array)) {
        return [];
      }
      let result = [];
      array.forEach(item => {
        let newItem = {
          id: item.id,
          label: item.title || item.label,
        };
        result.push(newItem);
      });
      return result;
    },
    transformOptions(options) {
      return options.map(item => {
        let newItem = {
          value: item.id,
          label: item.name
        };
        if (item.children && item.children.length > 0) {
          newItem.children = this.transformOptions(item.children);
        }
        return newItem;
      });
    },
    filterNode(value, data) {
      if (!value) return true;
      const valueLower = value.toLowerCase();
      const label = data.label && typeof data.label === 'string' ? data.label.toLowerCase() : '';
      const id = data.id && typeof data.id === 'string' ? data.id.toLowerCase() : '';
      const labelMatch = label.includes(valueLower);
      const idMatch = id.includes(valueLower);
      return labelMatch || idMatch;
    },
    renderContent(h, {data}) {
      const children = [];
      children.push(h('span', {class: 'icon'}, [
        h('i', {class: data.children ? 'el-icon-folder' : 'el-icon-document'})
      ]));
      let labelText = data.label;
      const parentWidth = this.getParentWidth() * 0.8;
      const maxLength = Math.floor(parentWidth / 14);
      if (labelText.length > maxLength) {
        labelText = labelText.slice(0, maxLength) + '...';
      }
      children.push(h('span', {}, labelText));
      children.push(h('span', {class: 'icon', on: {click: () => this.move(data)}}, [
        h('i', {class: 'el-icon-share'})
      ]));
      return h('span', {class: 'custom-tree-node'}, children);
    },
    renderContentInDialog(h, {data}) {
      const children = [];
      children.push(h('span', {class: 'icon'}, [
        h('i', {class: data.children ? 'el-icon-folder' : 'el-icon-document'})
      ]));
      let labelText = data.label;
      const parentWidth = this.getParentWidth() * 0.8;
      const maxLength = Math.floor(parentWidth / 14);
      if (labelText.length > maxLength) {
        labelText = labelText.slice(0, maxLength) + '...';
      }
      children.push(h('span', {}, labelText));
      return h('span', {class: 'custom-tree-node'}, children);
    },
    move(data) {
      this.selectedSourceList = [];
      this.dialogVisible_move = true;
      this.selectedSourceList.push(data);
    },
    moveSourceTo() {
      if (Array.isArray(this.targetColumn)) {
        this.targetColumn = this.targetColumn[this.targetColumn.length - 1];
      }
      const selectedSourceIdList = this.$refs["tree-to-move"].getCheckedKeys();
      this.$request.put('/article/batchMoveToColumn/' + this.targetColumn, selectedSourceIdList).then(
          res => this.$handleResponse(res, () => {
            this.$message.success('移动成功');
            this.loadData();
            this.showNodeInfo(this.selectedColumn);
          }));
      this.dialogVisible_move = false;
    },
    getParentWidth() {
      const treeNode = this.$refs.tree.$el;
      return treeNode.offsetWidth;
    },
    addSource() {
      this.dialogVisible_add = true;
    },
    moveSource() {
      this.selectedSourceList = this.$refs["tree"].getCheckedNodes();
      this.dialogVisible_move = true;
    },
    updateColumnData(updatedData, deletedId, newNode) {
      this.columnList = updatedData;
      this.formattedColumnList = this.transformOptions(updatedData);
      if (deletedId) {
        if (deletedId === this.selectedColumn.id) {
          if (this.columnList.length > 0) {
            this.selectedColumn = this.columnList[this.columnList.length - 1];
            this.showNodeInfo(this.selectedColumn);
          }
        }
      }
      if (newNode) {
        this.selectedColumn = newNode;
        this.showNodeInfo(this.selectedColumn);
      }
    },
    moveSources() {
      const selectedSourceIdList = this.$refs["tree-in-dialog"].getCheckedKeys();
      this.$request.put('/article/batchMoveToColumn/' + this.selectedColumn.id, selectedSourceIdList).then(
          res => this.$handleResponse(res, () => {
            this.$message.success('移动成功');
            this.loadData();
            this.showNodeInfo(this.selectedColumn);
          }));
      this.dialogVisible_add = false;
    },
    clearSelectedSource() {
      this.selectedSourceList = [];
      this.dialogVisible_move = false;
    },
    selectAll(selectedSourceList) {
      let result = [];
      selectedSourceList.forEach(item => {
        let id = item.id
        result.push(id);
      })
      return result;
    },
  }
};
</script>

<style scoped>
.column-container, .article-container {
  border: 1px solid #ccc;
}

.column-container {
  width: 50vh;
}

.article-container {
  width: 110vh;
  height: calc(90vh - 90px);
}

.column-container-header, .article-container-header {
  background-color: #cbcbcb;
  height: 60px;
  padding: 15px;
  display: flex;
  align-items: center;
  font-size: larger;
  justify-content: space-between;
}

.column-container-main, .article-container-main {
  height: calc(90vh - 150px);
  overflow: auto;
  padding: 10px;
}

.input-container {
  width: 40vh;
}

.custom-tree-node {
  display: flex;
  align-items: center;

}

.sourceList-container {
  height: calc(100vh - 500px);
  min-height: 60px;
  border: 1px solid #8c8c8c;
}
</style>
<style>
.select_popper {
  z-index: 100100 !important;
}

.el-tree-node.is-hidden {
  display: none !important;
}


</style>