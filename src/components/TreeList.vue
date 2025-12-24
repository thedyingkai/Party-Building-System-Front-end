<!--
  树形列表组件
  
  @component TreeList
  @description 栏目树形结构管理组件，支持拖拽排序和增删改操作
  @author 党建系统开发团队
-->
<template>
  <div>
    <div>
      <!-- 添加根栏目按钮 -->
      <el-tooltip effect="light">
        <div slot="content">添加栏目</div>
        <span class="click-able" style="padding: 5px;"><i class="el-icon-folder-add" @click="addRootNode"></i></span>
      </el-tooltip>
    </div>
    <div>
      <!-- 树形结构 -->
      <el-tree
          :allow-drag="allowDrag"
          :allow-drop="allowDrop"
          :data="formattedData"
          :default-expand-all="true"
          :draggable="true"
          :expand-on-click-node="false"
          :highlight-current="true"
          :render-content="renderContent"
          node-key="id"
          @node-click="handleNodeClick"
          @node-drop="handleDrop"
      >
      </el-tree>
    </div>
  </div>
</template>

<script>
import {MessageBox} from 'element-ui';

export default {
  name: 'TreeList',
  props: {
    /**
     * 栏目数据
     * @type {Array}
     */
    columnData: Array
  },
  data() {
    return {
      /** 格式化后的树形数据 */
      formattedData: [],
      /** 右键菜单顶部位置 */
      contextMenuTop: 0,
      /** 右键菜单左侧位置 */
      contextMenuLeft: 0,
      /** 是否正在处理拖放操作 */
      isHandlingDrop: false,
    };
  },
  /**
   * 生命周期钩子 - 组件挂载时转换栏目数据
   */
  mounted() {
    if (this.columnData) {
      this.formattedData = this.convertToTree(this.columnData);
    }
  },
  watch: {
    /**
     * 监听栏目数据变化
     * 当栏目数据更新时重新转换树形结构
     * @param {Array} newVal - 新的栏目数据
     */
    columnData(newVal) {
      if (newVal) {
        this.formattedData = this.convertToTree(newVal);
      }
    }
  },
  methods: {
    /**
     * 转换数据为树形结构
     * @param {Array} data - 原始栏目数据
     * @returns {Array} 树形结构数据
     */
    convertToTree(data) {
      return this.processNodes(data);
    },
    /**
     * 处理栏目节点
     * @param {Array} nodes - 栏目节点数组
     * @returns {Array} 处理后的节点数组
     */
    processNodes(nodes) {
      return nodes.map((node) => {
        return {
          name: node.name || '',
          id: node.id,
          parent_id: node.parent_id || 0,
          index: node.index || 0,
          children: this.processChildren(node.children || []),
          is_empty: node.is_empty || 't',
        };
      });
    },
    /**
     * 处理子节点
     * @param {Array} children - 子节点数组
     * @returns {Array} 处理后的子节点
     */
    processChildren(children) {
      return children.map((children) => {
        return this.processNodes([children])[0];
      });
    },
    /**
     * 渲染树节点内容
     * @param {Function} h - createElement函数
     * @param {Object} params - 参数对象
     * @param {Object} params.data - 节点数据
     * @returns {VNode} 虚拟节点
     */
    renderContent(h, {data}) {
      const children = [];
      children.push(h('span', {class: 'icon'}, [
        h('i', {class: data.children ? 'el-icon-folder' : 'el-icon-folder'})
      ]));
      children.push(h('span', {}, data.name));
      children.push(h('span', {class: 'muted'}, `(${data.children ? data.children.length : 0})`));
      if (!this.hasSourceNode(data) && !this.isLastRootNode(data)) {
        children.push(h('span', {class: 'icon', on: {click: () => this.editNode(data)}}, [
          h('i', {class: 'el-icon-edit-outline'})
        ]));
        children.push(h('span', {class: 'icon', on: {click: () => this.deleteNode(data)}}, [
          h('i', {class: 'el-icon-delete'})
        ]));
        children.push(h('span', {class: 'icon', on: {click: () => this.appendNode(data)}}, [
          h('i', {class: 'el-icon-circle-plus-outline'})
        ]));
      } else if (!this.isLastRootNode(data)) {
        children.push(h('span', {class: 'icon', on: {click: () => this.editNode(data)}}, [
          h('i', {class: 'el-icon-edit-outline'})
        ]));
        children.push(h('span', {class: 'icon', on: {click: () => this.deleteNode(data)}}, [
          h('i', {class: 'el-icon-delete'})
        ]));
      }
      return h('span', {class: 'custom-tree-node'}, children);
    },
    /**
     * 处理节点点击事件
     * @param {Object} data - 节点数据
     */
    handleNodeClick(data) {
      this.$emit('node-clicked', data);
    },
    /**
     * 添加子节点
     * @param {Object} data - 父节点数据
     */
    appendNode(data) {
      // 弹出对话框添加节点
      MessageBox.prompt('请输入新节点名称', '添加节点', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(({value}) => {
        if (value) {
          // 生成新的 id
          const newId = this.generateUniqueId();
          let index = 0;
          if (data.children && data.children.length > 0) {
            index = data.children[data.children.length - 1].index + 1;
          }
          const newNode = {
            name: value,
            id: newId,
            parent_id: data.id,
            index: index,
            children: [],
            is_empty: 't',
          };
          this.addColumn(newNode);
          if (!data.children) {
            data.children = [];
          }
          data.children.push(newNode);
          // 触发自定义事件，传递更新后的数据
          this.$emit('columnDataUpdated', this.formattedData, null, newNode);
        }
      }).catch(() => {
      });
    },
    /**
     * 编辑节点
     * @param {Object} data - 节点数据
     */
    editNode(data) {
      // 弹出对话框编辑节点
      MessageBox.prompt('请输入新名称', '编辑栏目名称', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputValue: data.name
      }).then(({value}) => {
        if (value) {
          let node = {id: data.id, name: value};
          this.editColumn(node);
          data.name = value;
          // 触发自定义事件，传递更新后的数据
          this.$emit('columnDataUpdated', this.formattedData);
        }
      }).catch(() => {
      });
    },
    /**
     * 删除节点
     * @param {Object} data - 要删除的节点数据
     */
    deleteNode(data) {
      // 确认删除节点
      MessageBox.confirm('确定删除该栏目？其子栏目也会被删除，栏目下的资源将转移到默认栏目中', '删除栏目', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$request.delete('/column/delete/' + data.id).then(
            (res) => {
              if (res.code === '200') {
                this.removeNode(data);
                if (!data.parent_id) {
                  this.updateGreaterIndexRootNodes(data.index, -1);
                } else {
                  this.updateGreaterIndexNodes(data, data.index, -1);
                }
                this.$message.success('删除成功');
                this.$emit('columnDataUpdated', this.formattedData, data.id);
              } else {
                this.$message.error(res.data.msg);
              }
            }
        ).catch((error) => {
          console.error('删除栏目失败:', error);
          this.$message.error('删除栏目失败，请稍后再试');
        });
      }).catch(() => {
      });
    },
    /**
     * 从树中移除节点
     * @param {Object} data - 要移除的节点数据
     */
    removeNode(data) {
      const parentNode = this.findParentNode(data);
      if (parentNode) {
        const index = parentNode.children.findIndex(children => children.id === data.id);
        if (index > -1) {
          parentNode.children.splice(index, 1);
          this.updateIndices(parentNode.children, index);
          this.$emit('update:columnData', this.formattedData);
        }
      } else {
        const index = this.formattedData.findIndex(children => children.id === data.id);
        if (index > -1) {
          this.formattedData.splice(index, 1);
          this.updateIndices(this.formattedData, index);
          this.$emit('update:columnData', this.formattedData);
        }
      }
    },
    /**
     * 查找节点的父节点
     * @param {Object} node - 节点对象
     * @returns {Object|null} 父节点或null
     */
    findParentNode(node) {
      const traverse = (nodes) => {
        for (let n of nodes) {
          if (n.children) {
            if (n.children.some(children => children.id === node.id)) {
              return n;
            } else {
              const result = traverse(n.children);
              if (result) {
                return result;
              }
            }
          }
        }
        return null;
      };
      return traverse(this.formattedData);
    },
    /**
     * 生成唯一ID
     * 遍历所有节点，生成不重复的ID
     * @returns {number} 唯一的节点ID
     */
    generateUniqueId() {
      let existingIds = new Set();
      const traverse = (nodes) => {
        console.log('in gererateUniqueId')
        for (let node of nodes) {
          existingIds.add(node.id);
          if (node.children) {
            traverse(node.children);
          }
        }
      };
      traverse(this.formattedData);
      let id = 1;
      while (existingIds.has(id)) {
        id++;
      }
      return id;
    },
    /**
     * 处理自身和新兄弟节点
     * 处理拖放后的节点位置更新
     * @param {Object} draggingNode - 被拖动的节点
     * @param {Object} dropNode - 放置目标节点
     * @param {string} dropType - 放置类型（before/after/inner）
     */
    handleSelfAndNewBrother(draggingNode, dropNode, dropType) {
      if (dropType === 'inner') {
        draggingNode.data.index = dropNode.data.children.length - 1;
        draggingNode.data.parent_id = dropNode.data.id;
        this.$request.put('/column/update', draggingNode.data).then(
            res => {
              if (res.code === '200') {
                this.$message.success('修改成功');
              } else {
                this.$message.error(res.data.msg);
              }
            }
        ).catch(error => {
          console.error('修改栏目顺序失败:', error);
          this.$message.error('修改栏目顺序失败，请稍后再试');
        });
      } else {
        let newIndex;
        if (dropType === 'before') {
          newIndex = dropNode.data.index;
        } else {
          newIndex = dropNode.data.index + 1;
        }
        let Nodes = [];
        if (!dropNode.data.parent_id) {
          Nodes = this.formattedData.filter(node => (node.parent_id === null || node.parent_id === 0)
              && node.index >= newIndex && node.id !== -1);
        } else {
          this.traverseNodes(this.formattedData, dropNode.data.parent_id, newIndex, (node) => {
            Nodes.push(node);
          });
        }
        this.$request.put('/column/updateIndex/' + 1, Nodes).then(
            res => {
              if (res.code === '200') {
                Nodes.forEach(node => {
                  node.index = node.index + 1;
                });
                draggingNode.data.index = newIndex;
                draggingNode.data.parent_id = dropNode.data.parent_id;
                this.$request.put('/column/update', draggingNode.data).then(
                    res => {
                      if (res.code === '200') {
                        this.$message.success('修改成功');
                      } else {
                        this.$message.error(res.data.msg);
                      }
                    }
                ).catch(error => {
                  console.error('修改栏目顺序失败:', error);
                  this.$message.error('修改栏目顺序失败，请稍后再试');
                });
              } else {
                this.$message.error(res.data.msg);
              }
            }
        ).catch(error => {
          console.error('修改栏目顺序失败:', error);
          this.$message.error('修改栏目顺序失败，请稍后再试');
        });
      }
    },
    /**
     * 处理节点拖放事件
     * @param {Object} draggingNode - 被拖动的节点
     * @param {Object} dropNode - 放置目标节点
     * @param {string} dropType - 放置类型
     */
    handleDrop(draggingNode, dropNode, dropType) {
      if (this.isHandlingDrop) {
        this.$message.warning('操作过于频繁，请稍后');
        return; // 如果正在处理，不进行新的操作
      }
      this.isHandlingDrop = true; // 设置为正在处理
      if (!this.isLastRootNode(draggingNode.data)) {
        let Nodes = [];
        if (!draggingNode.data.parent_id) {
          Nodes = this.formattedData.filter(node => (node.parent_id === null || node.parent_id === 0) &&
              node.index >= draggingNode.data.index && node.id !== -1);
        } else {
          this.traverseNodes(this.formattedData, draggingNode.data.parent_id, draggingNode.data.index, (node) => {
            Nodes.push(node);
          });
        }
        this.$request.put('/column/updateIndex/' + -1, Nodes).then(
            (res) => {
              if (res.code === '200') {
                Nodes.forEach(node => {
                  node.index = node.index + -1;
                });
                this.handleSelfAndNewBrother(draggingNode, dropNode, dropType);
              } else {
                this.$message.error(res.data.msg);
              }
            }
        ).catch((error) => {
          console.error('修改栏目顺序失败:', error);
          this.$message.error('修改栏目顺序失败，请稍后再试');
        }).finally(() => {
          this.isHandlingDrop = false; // 无论成功与否，操作完成后重置状态
        });
      }
    },
    /**
     * 添加栏目到服务器
     * @param {Object} newNode - 新栏目节点数据
     */
    addColumn(newNode) {
      this.$request.post('/column/add', newNode).then(
          res => {
            if (res.code === '200') {
              this.$message.success('添加成功');
            } else {
              this.$message.error(res.data.msg);
            }
          }
      ).catch(error => {
        console.error('添加栏目失败:', error);
        this.$message.error('添加栏目失败，请稍后再试');
      });
    },
    /**
     * 编辑栏目
     * @param {Object} node - 栏目节点数据
     */
    editColumn(node) {
      this.$request.put('/column/edit/', node).then(
          res => {
            if (res.code === '200') {
              this.$message.success('修改成功');
            } else {
              this.$message.error(res.data.msg);
            }
          }
      ).catch(error => {
        console.error('编辑栏目失败:', error);
        this.$message.error('编辑栏目失败，请稍后再试');
      });
    },
    /**
     * 添加根节点
     */
    addRootNode() {
      // 弹出对话框添加根节点
      MessageBox.prompt('请输入新栏目名称', '添加栏目', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(({value}) => {
        if (value) {
          // 生成新的 id
          console.log('value=', value)
          const newId = this.generateUniqueId();
          let index = 0;
          if (this.formattedData.length > 1) {
            index = this.formattedData[this.formattedData.length - 2].index + 1;
          }
          const newNode = {
            name: value,
            id: newId,
            parent_id: null,
            index: index,
            children: [],
            is_empty: 't',
          };
          this.addColumn(newNode);
          let tempNode = this.formattedData[this.formattedData.length - 1];
          this.formattedData[this.formattedData.length - 1] = newNode;
          this.formattedData.push(tempNode);
          this.$emit('update:columnData', this.formattedData);
        }
      }).catch(() => {
      });
    },
    /**
     * 更新子节点的索引
     * @param {Array} children - 子节点数组
     * @param {number} startIndex - 起始索引
     */
    updateIndices(children, startIndex) {
      if (children) {
        for (let i = startIndex; i < children.length; i++) {
          children[i].index = i;
        }
      }
    },
    /**
     * 更新大于目标索引的根节点
     * @param {number} targetIndex - 目标索引
     * @param {number} x - 索引变化量
     */
    updateGreaterIndexRootNodes(targetIndex, x) {
      let rootNodes = this.formattedData.filter(node => (node.parent_id === null || node.parent_id === 0) && node.index >= targetIndex && node.id !== -1);
      this.$request.put('/column/updateIndex/' + x, rootNodes).then(
          res => {
            if (res.code !== '200') {
              this.$message.error(res.data.msg);
            }
            rootNodes.forEach(node => {
              node.index = node.index + x;
            });
          }
      ).catch(error => {
        console.error('修改栏目顺序失败:', error);
        this.$message.error('修改栏目顺序失败，请稍后再试');
      });

    },
    /**
     * 遍历节点
     * @param {Array} nodes - 节点数组
     * @param {number} parentId - 父节点ID
     * @param {number} targetIndex - 目标索引
     * @param {Function} callback - 回调函数
     */
    traverseNodes(nodes, parentId, targetIndex, callback) {
      for (let node of nodes) {
        if (node.parent_id === parentId && node.index >= targetIndex) {
          callback(node);
        }
        if (node.children) {
          this.traverseNodes(node.children, parentId, targetIndex, callback);
        }
      }
    },
    /**
     * 更新大于目标索引的节点
     * @param {Object} Node - 节点对象
     * @param {number} targetIndex - 目标索引
     * @param {number} x - 索引变化量
     */
    updateGreaterIndexNodes(Node, targetIndex, x) {
      let Nodes = [];
      this.traverseNodes(this.formattedData, Node.parent_id, targetIndex, (node) => {
        Nodes.push(node);
      });
      this.$request.put('/column/updateIndex/' + x, Nodes).then(
          res => {
            if (res.code !== '200') {
              this.$message.error(res.data.msg);
            }
            Nodes.forEach(node => {
              node.index = node.index + x;
            });
          }
      ).catch(error => {
        console.error('修改栏目顺序失败:', error);
        this.$message.error('修改栏目顺序失败，请稍后再试');
      });

    },
    /**
     * 判断是否为最后一个根节点
     * @param {Object} data - 节点数据
     * @returns {boolean} 是否为最后一个根节点
     */
    isLastRootNode(data) {
      const rootNodes = this.formattedData.filter(node => node.parent_id === null || node.parent_id === 0);
      const lastRootNode = rootNodes[rootNodes.length - 1];
      return lastRootNode && lastRootNode.id === data.id;
    },
    /**
     * 过滤有资源的节点
     * @param {Array} data - 节点数据数组
     * @returns {Array} 有资源的节点数组
     */
    filterNodesWithSource(data) {
      let result = [];
      data.forEach(node => {
        if (node.is_empty.toLowerCase() === 'f') {
          result.push(node);
        }
        if (node.children && node.children.length > 0) {
          result = result.concat(this.filterNodesWithSource(node.children));
        }
      });
      return result;
    },
    /**
     * 判断节点是否有资源
     * @param {Object} data - 节点数据
     * @returns {boolean} 是否有资源
     */
    hasSourceNode(data) {
      const hasSourceNodes = this.filterNodesWithSource(this.formattedData);
      return hasSourceNodes.some(node => node.id === data.id);
    },
    /**
     * 判断节点是否允许拖动
     * @param {Object} draggingNode - 被拖动节点
     * @returns {boolean} 是否允许拖动
     */
    allowDrag(draggingNode) {
      return draggingNode.data.name.indexOf('默认栏目（未分类）') === -1;
    },
    /**
     * 判断节点是否允许放置
     * @param {Object} draggingNode - 被拖动节点
     * @param {Object} dropNode - 放置目标节点
     * @param {string} type - 放置类型
     * @returns {boolean} 是否允许放置
     */
    allowDrop(draggingNode, dropNode, type) {
      if (dropNode.data.name === '默认栏目（未分类）') {
        return type !== 'inner' && type !== 'next' && type !== 'prev';
      } else {
        return true;
      }
    },
  }
};
</script>

<style lang="less" scoped>
.icon {
  margin: 3px;

  &:hover {
    cursor: pointer;
  }

  .muted {
    color: gray;
    font-size: 80%;
  }
}

.context-menu-dropdown {
  position: fixed;
  z-index: 1000;
}

.context-menu-dropdown.is-visible {
  display: block;
}

.context-menu-dropdown.context-menu-trigger {
  display: none;
}
</style>