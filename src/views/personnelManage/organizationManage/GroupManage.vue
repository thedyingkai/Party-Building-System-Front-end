<template>
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
      bid: 0,
      isMenu: true,
      add_show: false,
      branch: {},
      showGid: -1,
      show_group: {},
      groups: [],
      users: [],
      value1: [],
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
    selectUsers() {
      console.log(this.showGid);
      return this.allUsers.filter(user => user.gid != this.showGid);
    },
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
    showGroup(group) {
      this.show_group = group;
      console.log(this.show_group);
      this.isMenu = false;
      this.showGid = group.gid;
      this.getUser();
    },
    showClose() {
      this.isMenu = true;
      this.showGid = -1;
    },
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
    adduser() {
      this.add_show = true;
      this.getalluser();
    },
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
    routereturn() {
      this.$router.back();
    },
  }
}


</script>
<style scoped>

</style>