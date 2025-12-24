<!--
/**
 * @component GroupManage
 * @description 党小组管理页面 - 管理党小组、小组成员和组长分配
 * @author Party Building System
 */
-->
<template>
  <!-- 党小组管理容器 -->
  <div>
    <div v-show="isMenu">
      <el-container>
        <el-header style="margin: 20px;width: 80vw;text-align: center">
       <el-row style="font-size: 50px">{{ branch.name }} &nbsp; 党小组管理</el-row>
          <el-button  @click="routereturn">返回</el-button>
          <el-button type="primary" @click="addGroup">添加小组</el-button>
        </el-header>
        <el-main style="margin: 40px;border: solid crimson;width: 80vw;min-height: 65vh">
          <div style="display: flex;flex-wrap:wrap;gap:20px;">
            <el-card v-for="group in groups" :key="group.gid">
              <div slot="header" class="clearfix" style="text-align: center">
                <label style="font-size: 20px">{{ group.name }}</label>
              </div>
              <div>
                <el-row>
                  <i class="el-icon-edit-outline" @click="renameGroup(group.gid)"></i>
                  <label @click="renameGroup(group.gid)">重命名</label>
                  &nbsp;
                  <i class="el-icon-delete" @click="deletegroup(group.gid)"></i>
                  <label @click="deletegroup(group.gid)">删除</label>
                </el-row>
                <el-row>
                  <i class="el-icon-s-custom" @click="showGroup(group)"></i>
                  <label @click="showGroup(group)">小组成员</label>
                </el-row>

              </div>
            </el-card>
          </div>
        </el-main>
      </el-container>
    </div>
    <div v-show="!isMenu">
      <el-container>
        <el-header style="margin: 20px;width: 80vw;text-align: center">
          <el-row style="font-size: 50px"> {{ show_group.name }}成员</el-row>
          <el-button plain @click="showClose">返回</el-button>
          <el-button type="primary" @click="adduser">添加成员</el-button>
        </el-header>
        <el-main style="margin: 40px;border: solid crimson;width: 80vw;min-height: 65vh">
          <div style="display: flex;flex-wrap:wrap;gap:20px;">
            <el-card v-for="user in users" :key="user.id">
              <div slot="header" style="text-align: center">
                <el-row>
                  <el-avatar shape="square" :size="50" :src="user.avatar"></el-avatar>
                </el-row>
                <span>{{ user.uname }}</span><span v-if="show_group.leader_uid==user.id">(组长)</span>
              </div>
              <div>
                <el-row>
                  <i class="el-icon-star-off" @click="setLeader(user.id)"></i>
                  <label @click="setLeader(user.id)">设为组长</label>
                </el-row>
                <el-row>
                  <i class="el-icon-delete" @click="deleteUserFromGroup(user)"></i>
                  <label @click="deleteUserFromGroup(user)">移出小组</label>
                </el-row>
              </div>
            </el-card>
          </div>
        </el-main>
      </el-container>
    </div>
    <el-dialog
        title="添加人员"
        :visible.sync="add_show"
        show-cancel-button="true"
        confirm-button-text="确定"
        cancel-button-text="取消"
        style="width:800px"
    >
      <el-select v-model="value1" multiple placeholder="选择人员" popper-class="select_popper">
        <el-option
            v-for="user in selectUsers()"
            :key="user.id"
            :label="user.uname"
            :value="user.id">
        </el-option>
      </el-select>
      <el-row>
        <el-button @click="add_show=false">取 消</el-button>
        <el-button type="primary" @click="addNewUsers">确 定</el-button>
      </el-row>

    </el-dialog>
  </div>
</template>
<script>
import {MessageBox} from "element-ui";

export default {
  name: "GroupManage",
  data() {
    return {
      /** 当前支部ID */
      bid: 0,
      /** 是否显示主菜单（小组列表） */
      isMenu: true,
      /** 是否显示添加成员对话框 */
      add_show: false,
      /** 当前支部信息 */
      branch: {},
      /** 当前展示的小组ID */
      showGid: -1,
      /** 当前展示的小组信息 */
      show_group: {},
      /** 小组列表 */
      groups: [],
      /** 小组成员列表 */
      users: [],
      /** 选中的用户ID数组 */
      value1: [],
      /** 所有用户列表 */
      allUsers: [],
    }
  },
  mounted() {
    this.bid = this.$route.params.id;
    console.log(this.bid);
    this.getGroup();
    this.getBranchName();

  },
  methods: {
    /**
     * 获取支部名称
     * 从服务器加载当前支部的详细信息
     */
    getBranchName() {
      this.$request.get("/branch/selectByBid/" + this.bid).then(
          res => {
            if (res.code === '200') {
              this.branch = res.data;
            }
          }
      ).catch((error) => {
        console.error('数据加载出错', error);
      })
    },
    /**
     * 筛选可选用户
     * 过滤掉已在当前小组的用户，返回可添加的用户列表
     * @returns {Array} 可添加的用户列表
     */
    selectUsers() {
      console.log(this.showGid);
      return this.allUsers.filter(user => user.gid != this.showGid);
    },
    /**
     * 添加新成员到小组
     * 将选中的用户批量添加到当前小组
     */
    addNewUsers() {
      console.log(this.value1);
      this.$request.put("/user/setgid?gid=" + this.showGid, this.value1).then(
          res => {
            if (res.code === '200') {
              this.$message.success("添加成功");
              this.getUser();
              this.add_show = false;
            }
          }
      ).catch((error) => {
        console.error('数据加载出错', error);
      })
    },
    /**
     * 获取所有用户
     * 从服务器加载系统中的所有用户信息
     */
    getalluser() {
      this.$request.get("/user/selectAll").then(
          res => {
            if (res.code === '200') {
              this.allUsers = res.data;
              console.log(this.allUsers);
            }
          }
      ).catch((error) => {
        console.error('数据加载出错', error);
      })
    },
    /**
     * 从小组中移除成员
     * 弹出确认框后将用户从当前小组中移除
     * @param {Object} user - 要移除的用户对象
     */
    deleteUserFromGroup(user) {
      console.log(user);
      MessageBox.confirm('确定删除？', '删除成员', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$request.put('/user/deletegid/' + user.id).then(
            (res) => {
              if (res.code === '200') {
                this.$message.success('删除成功');
                this.getUser();
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
     * 显示小组成员
     * 切换到小组成员管理视图
     * @param {Object} group - 要查看的小组对象
     */
    showGroup(group) {
      this.show_group = group;
      console.log(this.show_group);
      this.isMenu = false;
      this.showGid = group.gid;
      this.getUser();
    },
    /**
     * 关闭小组详情视图
     * 返回到小组列表主菜单
     */
    showClose() {
      this.isMenu = true;
      this.showGid = -1;
    },
    /**
     * 获取支部下的所有小组
     * 从服务器加载当前支部的所有小组列表
     */
    getGroup() {
      this.$request.get("/group/selectByBid/" + this.bid).then(
          res => {
            if (res.code === '200') {
              this.groups = res.data;
            }
          }
      ).catch((error) => {
        console.error('数据加载出错', error);
      })
    },
    /**
     * 获取小组成员
     * 从服务器加载当前小组的所有成员
     */
    getUser() {
      this.$request.get("/user/selectByGid/" + this.showGid).then(
          res => {
            if (res.code === '200') {
              this.users = res.data;
              console.log(this.users);
            }
          }
      ).catch((error) => {
        console.error('数据加载出错', error);
      })
    },
    /**
     * 打开添加成员对话框
     * 显示对话框并加载所有用户数据
     */
    adduser() {
      this.add_show = true;
      this.getalluser();
    },
    /**
     * 设置小组组长
     * 将指定用户设置为当前小组的组长
     * @param {number} id - 用户ID
     */
    setLeader(id) {
      console.log(id);
      let group = {
        leader_uid: id,
        gid: this.showGid,
      };
      this.$request.put('/group/setleader', group).then(
          (res) => {
            if (res.code === '200') {
              this.$message.success('组长设置成功');
              window.location.reload();
            }
          }
      ).catch((error) => {
        console.error('失败:', error);
        this.$message.error('修改失败，请稍后再试');
      });
    },
    /**
     * 添加新小组
     * 弹出输入框让用户输入小组名称并创建
     */
    addGroup() {
      MessageBox.prompt('请输入新小组名称', '添加小组', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(({value}) => {
        if (value) {
          const group = {bid: this.bid, name: value}
          this.$request.post("/group/add", group).then(
              res => {
                if (res.code === '200') {
                  this.$message.success("小组添加成功");
                  this.getGroup();
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
     * 重命名小组
     * 弹出输入框让用户修改小组名称
     * @param {number} id - 小组ID
     */
    renameGroup(id) {
      MessageBox.prompt('请输入新名称', '编辑小组名称', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
      }).then(({value}) => {
        if (value) {
          let node = {gid: id, name: value};
          console.log(node);
          this.$request.put('/group/rename', node).then(
              (res) => {
                if (res.code === '200') {
                  this.$message.success('改名成功');
                  this.getGroup();
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
     * 删除小组
     * 删除指定的小组
     * @param {number} id - 小组ID
     */
    deletegroup(id) {
      this.$request.delete("/group/delete/" + id).then(
          res => {
            if (res.code === '200') {
              this.$message.success("删除成功");
              this.getGroup();
            }
          }
      ).catch((error) => {
        console.error('数据加载出错', error);
      })
    },
    /**
     * 返回上一页
     * 使用路由导航返回到上一个页面
     */
    routereturn() {
      this.$router.back();
    },
  }
}


</script>
<style scoped>

</style>