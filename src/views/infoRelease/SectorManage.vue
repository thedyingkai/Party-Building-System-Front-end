<!--
/**
 * @component SectorManage
 * @description 部门管理页面 - 支持部门增删改、人员分配和移动
 * @author Party Building System
 */
-->
<template>
  <!-- 部门管理容器 -->
  <div class="el-container" style="justify-content: space-around; align-items: center;">
    <div class="column-container">
      <div class="column-container-header">
        <div>
          <label>部门设置</label>
        </div>
      </div>
      <div class="column-container-main">
        <el-tooltip effect="light">
          <div slot="content">添加部门</div>
          <span style="padding: 5px;"><i class="el-icon-folder-add" @click="addSector()"></i></span>
        </el-tooltip>
        <el-tree
            style="max-width: 600px"
            :data="sectors"
            node-key="id"
            :expand-on-click-node="false"
            @node-click="handleNodeClick"
        >
          <template #default="{node}">
        <span class="custom-tree-node">
          <span>{{ node.data.name }}</span>
          <span>
            <i v-if="node.level == 1" class="el-icon-circle-plus-outline" @click="addDepartment(node.data.id)"></i>
            <i v-if="node.level==1" class="el-icon-edit-outline" @click="renamese(node.data.id)"></i>
              <i v-else class="el-icon-edit-outline" @click="renamede(node.data.id)"></i>
            <i v-if="node.level==1" class="el-icon-delete" @click="deletese(node.data.id)"></i>
            <i v-else class="el-icon-delete" @click="deletede(node.data.id)"></i>
          </span>
        </span>
          </template>
        </el-tree>
      </div>
    </div>
    <div class="article-container">
      <div class="article-container-header">
        <div>
          <label>（{{this.de_name}}）具体人员</label>
          <el-tooltip effect="light">
            <div slot="content">您可以在此处进行人员变动</div>
            <span style="padding: 5px;"><i class="el-icon-warning-outline"></i></span>
          </el-tooltip>
        </div>
        <div class="input-container">
          <el-input
              placeholder="输入关键字进行过滤"
          >
          </el-input>
        </div>
      </div>
      <div class="article-container-main">
        <div>
          <el-tooltip effect="light" >
            <div slot="content">未分类人员</div>
            <span style="padding: 5px;"><i class="el-icon-house" @click="returndefault()"></i></span>
          </el-tooltip>
<el-tree
    :data="users"
    node-key="id"
    :expand-on-click-node="false">
  <template #default="{node}">
    <div>
      <i class="el-icon-user"></i>
      <label>{{node.data.uname}}</label>
      <i class="el-icon-share" @click="showdialog(node.data.id)"></i>
    </div>
  </template>
</el-tree>
        </div>
      </div>
    </div>
    <el-dialog
        title="人员变动"
        :visible.sync="dialogVisible_move"
        show-cancel-button="true"
        confirm-button-text="确定"
        cancel-button-text="取消"
    >
      <label>移动至</label>
      <el-cascader
          placeholder="选择部门"
          v-model="fromColumnId"
          :options="sectors"
          filterable
          popper-class="select_popper"
          style="margin: 10px;"
          >
        <template slot-scope="{node}">
          <span>{{node.data.name}}</span>
        </template>
      </el-cascader>
      <span  style="align-items: center">
        <el-button @click="dialogVisible_move = false">取 消</el-button>
        <el-button type="primary" @click="moveUser()">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>


<script>


import {MessageBox} from "element-ui";

export default {
  name: "SectorManage",

  data() {
    return {
      /** 当前登录用户信息 */
      user: JSON.parse(localStorage.getItem("current-user") || '{}'),
      /** 目标移动栏目ID */
      fromColumnId: '',
      /** 人员移动对话框显示状态 */
      dialogVisible_move: false,
      /** 当前展示的科室名称 */
      de_name: '未分类',
      /** 当前选中的部门ID */
      se_id: 0,
      /** 当前选中的科室ID */
      de_id: -1,
      /** 要移除的用户ID */
      remove_uid: 0,
      /** 总记录数 */
      total: 0,
      /** 新增部门对象 */
      newSector: {
        name: '',
      },
      /** 新增科室对象 */
      newDepartment: {
        name: '',
        seid: -1,  // 所属部门ID
      },
      /** 活动列表（备用） */
      activities: [],
      /** 部门树形结构数据 */
      sectors: [],
      /** 当前科室的用户列表 */
      users: [],
    };
  },
  /**
   * 生命周期钩子 - 组件挂载时加载部门和未分类用户
   */
  mounted() {
    this.fetchData();
    this.fetchUser(this.de_id);
  },
  methods: {
    /**
     * 显示移动对话框
     * @param {number} id - 用户ID
     */
    showdialog(id){
      this.remove_uid=id;
      console.log(this.remove_uid);
      this.dialogVisible_move=true;
    },
    /**
     * 移动用户到指定部门
     */
    moveUser(){
      console.log(this.fromColumnId);
      let user1 = {
        id : Number(this.remove_uid),
        deid: Number(this.fromColumnId[1]),
      };
      console.log(user1);
      this.$request.put('/user/updateDeid',user1).then(
          res => {
            if (res.code === '200') {
              this.$message.success('移动成功');
              this.dialogVisible_move=false;
              this.fetchUser(this.de_id);
            }
          }
      )
    },
    /**
     * 获取部门数据
     */
    fetchData() {
      this.$request.get('/sector/selectAll').then(
          res => {
            if (res.code === '200') {
              const array=res.data;
              this.sectors = array.map(sector=>({  ...sector, // 使用展开运算符保留其他属性
                label: sector.name,
                value:sector.id,// 创建新的属性 yearsOld 并赋值
              }));
              this.total = this.sectors.length;
              console.log(this.sectors);
            }
          }
      ).catch((error) => {
        console.error('数据加载出现错误:', error);
      });
    },
    /**
     * 获取指定部门的用户列表
     * @param {number} id - 部门ID
     */
    fetchUser(id){
      console.log(id);
      this.$request.get('/user/selectByDeid/'+id).then(
          res => {
            if (res.code === '200') {
              this.users = res.data;
              this.total = this.sectors.length;
              console.log(this.users);
            }
          }
      ).catch((error) => {
        console.error('数据加载出现错误:', error);
      });

    },
    /**
     * 返回默认未分类视图
     */
    returndefault(){
      this.de_id=-1;
      this.de_name="未分类";
      this.fetchUser(this.de_id);
    },
    /**
     * 处理节点点击事件
     * @param {Object} data - 节点数据
     * @param {Object} node - 节点对象
     */
    handleNodeClick(data, node) {
      // 判断节点是否为子节点
      if (!node.childNodes.length) {
        // 如果是子节点，执行相关逻辑
        console.log('点击的子节点数据:', data);
        this.se_id=data.seid;
        this.de_id=data.id;
        this.de_name=data.name;
        this.fetchUser(data.id);
        // 这里可以进一步处理子节点被点击的逻辑
      }
    },
    /**
     * 切换活动
     * @param {Object} item - 活动项
     */
    /**
     * 切换活动（预留方法）
     * @param {Object} item - 活动对象
     */
    changeac(item) {
      this.ac_title = item.name;
      this.ac_id = item.id;
      console.log(item);
    },
    /**
     * 添加部门
     */
    addSector() {
      // 弹出对话框添加根节点
      MessageBox.prompt('请输入新部门名称', '添加部门', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(({value}) => {
        if (value) {
          this.newSector.name = value;
          this.$request.post('/sector/add', this.newSector).then(
              res => this.$handleResponse(res, () => {
                this.$message.success('添加成功');
                this.fetchData();
              }));
        }
      }).catch(() => {
      });
    },
    /**
     * 添加科室
     * @param {number} id - 所属部门ID
     */
    addDepartment(id) {
      // 弹出对话框添加根节点
      MessageBox.prompt('请输入新科室名称', '添加科室', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(({value}) => {
        if (value) {
          this.newDepartment.name = value;
          this.newDepartment.seid = id;
          console.log(this.newDepartment);
          this.$request.post('/department/add', this.newDepartment).then(
              res => this.$handleResponse(res, () => {
                this.$message.success('添加成功');
                this.fetchData();
              }));
        }
      }).catch(() => {
      });
    },
    /**
     * 重命名部门
     * @param {number} id - 部门ID
     */
    renamese(id) {
      // 弹出对话框编辑节点
      MessageBox.prompt('请输入新名称', '编辑部门名称', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
      }).then(({value}) => {
        if (value) {
          let node = {id: id, name: value};
          console.log(node);
          this.$request.put('/sector/rename', node).then(
              (res) => {
                if (res.code === '200') {
                  this.$message.success('改名成功');
                  this.fetchData();
                }
              }
          ).catch((error) => {
            console.error('失败:', error);
            this.$message.error('改名失败，请稍后再试');
          });
        }
      }).catch(() => {
      });
    },
    /**
     * 重命名科室
     * @param {number} id - 科室ID
     */
    renamede(id) {
      // 弹出对话框编辑节点
      MessageBox.prompt('请输入新名称', '编辑科室名称', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
      }).then(({value}) => {
        if (value) {
          let node = {id: id, name: value};
          console.log(node);
          this.$request.put('/department/rename', node).then(
              (res) => {
                if (res.code === '200') {
                  this.$message.success('改名成功');
                  this.fetchData();
                }
              }
          ).catch((error) => {
            console.error('失败:', error);
            this.$message.error('改名失败，请稍后再试');
          });
        }
      }).catch(() => {
      });
    },
    /**
     * 删除部门
     * @param {number} id - 部门ID
     */
    deletese(id) {
      MessageBox.confirm('确定删除该部门？部门下的科室将一起被删除', '删除部门', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$request.delete('/sector/delete/' + id).then(
            (res) => {
              if (res.code === '200') {
                this.$message.success('删除成功');
                this.fetchData();
              }
            }
        ).catch((error) => {
          console.error('删除失败:', error);
          this.$message.error('删除失败，请稍后再试');
        });
      }).catch(() => {
      });
    },
    /**
     * 删除科室
     * @param {number} id - 科室ID
     */
    deletede(id) {
      MessageBox.confirm('确定删除该科室？', '删除科室', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$request.delete('/department/delete/' + id).then(
            (res) => {
              if (res.code === '200') {
                this.$message.success('删除成功');
                this.fetchData();
              }
            }
        ).catch((error) => {
          console.error('删除失败:', error);
          this.$message.error('删除失败，请稍后再试');
        });
      }).catch(() => {
      });
    },
  },

}
</script>

<style scoped>
.text-ellipsis {
  display: inline;
  white-space: nowrap; /* 禁止文本换行 */
  overflow: hidden; /* 隐藏溢出的文本 */
  text-overflow: ellipsis; /* 使用省略号表示溢出的文本 */
  max-width: 60px; /* 设置最大宽度，根据需要调整 */
  width: 200px; /* 确保宽度不是由其他属性强制设置的 */
  box-sizing: border-box;
}

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