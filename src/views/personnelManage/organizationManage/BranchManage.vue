<!--
/**
 * @component BranchManage
 * @description 支部管理页面 - 管理党支部的增删改、党小组和支部委员配置
 * @author Party Building System
 */
-->
<template>
  <!-- 支部管理容器 -->
  <div>
    <el-container>
      <el-header style="margin: 20px;width: 80vw;text-align: center">
        <el-row style="font-size: 50px">
          支部管理
        </el-row>
        <el-button type="primary" @click="addBranch">添加支部</el-button>
      </el-header>
      <el-main style="margin: 40px;border: solid crimson;width: 80vw;min-height: 65vh">
        <div style="display: flex;flex-wrap:wrap;gap:20px;">
          <el-card v-for="branch in branches" :key="branch.bid">
            <div slot="header" class="clearfix" style="text-align: center">
              <label style="font-size: 20px">{{ branch.name }}</label>
            </div>
            <div>
              <el-row>
                <label @click="renameBranch(branch.bid)" class="click-able">
                  <i class="el-icon-edit-outline" @click="renameBranch(branch.bid)"></i>
                  重命名</label>
                &nbsp;
                <label @click="deleteBranch(branch.bid)" class="click-able">
                  <i class="el-icon-delete" @click="deleteBranch(branch.bid)"></i>
                  删除支部</label>
              </el-row>
              <el-row>
                <label @click="enterGroup(branch.bid)" class="click-able">
                  <i class="el-icon-office-building" @click="enterGroup(branch.bid)"></i>
                  党小组</label>
                &nbsp;
                <label @click="setManager(branch)" class="click-able">
                  <i class="el-icon-s-custom" @click="setManager(branch)"></i>
                  支部委员</label>
              </el-row>
            </div>
          </el-card>
        </div>
      </el-main>
    </el-container>
  </div>
</template>
<script>

import {MessageBox} from "element-ui";

export default {
  name: 'BranchManage',
  data() {
    return {
      /** 测试字段1 */
      test1: '',
      /** 对话框显示状态 */
      dialogVisible: false,
      /** 新支部名称 */
      newBranch: '',
      /** 支部列表 */
      branches: [],
      /** 当前显示的支部 */
      showBranch: {},
    }
  },
  methods: {
    /**
     * 设置支部委员
     * 跳转到支部委员管理页面
     * @param {Object} branch - 支部对象
     */
    setManager(branch) {
      this.showBranch = branch;
      this.$router.push({name: '委员会', params: {id: branch.bid}})
    },
    /**
     * 进入党小组管理
     * 跳转到指定支部的党小组管理页面
     * @param {number} gid - 支部ID（此处参数名为gid但实际为bid）
     */
    enterGroup(gid) {
      console.log(gid);
      this.$router.push({name: '党小组', params: {id: gid}})
    },
    /**
     * 获取支部列表
     * 从服务器加载所有支部信息
     */
    getBranch() {
      this.$request.get("/branch/selectAll").then(
          res => {
            if (res.code === '200') {
              this.branches = res.data;
            }
          }
      ).catch((error) => {
        console.error('数据加载出错', error);
      })
    },
    /**
     * 添加支部
     * 弹出输入框让用户输入支部名称并创建新支部
     */
    addBranch() {
      MessageBox.prompt('请输入新支部名称', '添加支部', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(({value}) => {
        if (value) {
          const branch = {name: value}
          this.$request.post("/branch/add", branch).then(
              res => {
                if (res.code === '200') {
                  this.$message.success("支部添加成功");
                  this.getBranch();
                }
              }
          ).catch((error) => {
            console.error('数据加载出错', error);
          })
        }
      }).catch(() => {
      });
    },
    /**
     * 删除支部
     * 弹出确认框后删除选中的支部及其下属小组
     * @param {number} id - 支部ID
     */
    deleteBranch(id) {
      MessageBox.confirm('确定删除该支部？支部下的小组将一起被删除', '删除支部', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$request.delete('/branch/delete/' + id).then(
            (res) => {
              if (res.code === '200') {
                this.$message.success('删除成功');
                this.getBranch();
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
     * 重命名支部
     * 弹出输入框让用户修改支部名称
     * @param {number} id - 支部ID
     */
    renameBranch(id) {
      // 弹出对话框编辑节点
      MessageBox.prompt('请输入新名称', '编辑支部名称', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
      }).then(({value}) => {
        if (value) {
          let node = {bid: id, name: value};
          console.log(node);
          this.$request.put('/branch/rename', node).then(
              (res) => {
                if (res.code === '200') {
                  this.$message.success('改名成功');
                  this.getBranch();
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
  },
  mounted() {
    this.getBranch();
  }
}
</script>
<style>

</style>