<template>
  <div>
    <div style="width:40vw;float: left">
      <div style="margin-top: 30px;margin-left: 5vw">
        <el-row>
          <label style="font-size: 20px">当前方案: {{ testprocess.name }}
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            {{ count }}级审核
          </label>
        </el-row>
        <el-card v-for="(process,index) in showprocess" :key="index" style="margin: 10px;width: 320px">
          <el-row>
            <label>第{{ index + 1 }}级
              &nbsp;&nbsp;&nbsp;&nbsp;
              审核员:{{ process.uname }}
            </label>
            <div style="float: right">
              <label class="click-able" @click="showAuditorchange(process.id)">
                <el-icon class="el-icon-user"></el-icon>
                修改审核</label>
            </div>
          </el-row>
        </el-card>

        <el-card style="margin: 10px;width: 320px">
          <el-row style="text-align: center">
            <label class="click-able" @click="show2=true">
              <el-icon class="el-icon-circle-plus-outline"></el-icon>
              新增一级</label>
            &nbsp;&nbsp;

            <label class="click-able" @click="deleteprocess">
              <el-icon class="el-icon-delete"></el-icon>
              删除最后一级</label>
          </el-row>
        </el-card>
      </div>

    </div>

    <div style="display: inline-block;width:40vw;margin: 10px;float: right">
      <el-row style="width: 500px;margin-top: 20px" >
        <label style="font-size: 20px">
          方案列表
        </label>
      </el-row>
      <el-row>
        <el-card v-for="(processtype,index) in allprocesstype" :key="index" style="margin: 10px;width: 250px">
          <el-row>
            <label>
              方案名:{{ processtype.name }}&nbsp;&nbsp;&nbsp;&nbsp;
              栏目:{{processtype.co_name}}
            </label>
          </el-row>
          <el-row>
            <div style="float: left">
              <label @click="applyprocesstype(processtype)" class="click-able">
                <el-icon class="el-icon-video-play"></el-icon>
                查看</label>
              &nbsp;
              <label @click="showColumn(processtype.id)" class="click-able">
                <el-icon class="el-icon-edit-outline"></el-icon>
                专栏配置</label>

              <label @click="deleteprocesstype(processtype)" class="click-able">
                <el-icon class="el-icon-delete"></el-icon>
                删除</label>
            </div>
          </el-row>

        </el-card>

        <el-card style="margin: 10px;width: 250px">
          <el-row style="text-align: center">
            <el-icon class="el-icon-circle-plus-outline"></el-icon>
            <label @click="show3=true">新建方案</label>
          </el-row>
        </el-card>
      </el-row>
    </div>
    <el-dialog
        title="修改审核"
        :visible.sync="show1"
        show-cancel-button="true"
        confirm-button-text="确定"
        cancel-button-text="取消"
        style="width: 1200px"
    >
      <label>选择新审核员:</label>
      <el-select v-model="uid"
                 placeholder="请选择"
                 popper-class="select_popper"
                 style="margin: 10px;">
        <el-option
            v-for="item in auditors"
            :key="item.id"
            :label="item.uname"
            :value="item.id">
        </el-option>
      </el-select>
      <span style="align-items: center">
        <el-button @click="show1 = false">取 消</el-button>
        <el-button type="primary" @click="changeAuditor()">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog
        title="新增流程"
        :visible.sync="show2"
        show-cancel-button="true"
        confirm-button-text="确定"
        cancel-button-text="取消"
        style="width: 1200px"
    >
      <label>选择审核员:</label>
      <el-select v-model="uid"
                 placeholder="请选择"
                 popper-class="select_popper"
                 style="margin: 10px;">
        <el-option
            v-for="item in auditors"
            :key="item.id"
            :label="item.uname"
            :value="item.id">
        </el-option>
      </el-select>
      <span style="align-items: center">
        <el-button @click="show2 = false">取 消</el-button>
        <el-button type="primary" @click="addProcess()">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog
        title="新增方案"
        :visible.sync="show3"
        show-cancel-button="true"
        confirm-button-text="确定"
        cancel-button-text="取消"
        style="width: 1000px"
    >
      <el-row>
        <label>输入新方案名称: &nbsp;</label>
        <el-input v-model="processtypename" style="width: 300px" placeholder="请输入新方案名称"></el-input>
      </el-row>
      <el-row>
        <label>选择第一级审核员:</label>
        <el-select v-model="uid"
                   placeholder="请选择"
                   popper-class="select_popper"
                   style="margin: 10px;">
          <el-option
              v-for="item in auditors"
              :key="item.id"
              :label="item.uname"
              :value="item.id">
          </el-option>
        </el-select>
      </el-row>
      <el-row style="text-align: center">
        <el-button @click="show3 = false">取 消</el-button>
        <el-button type="primary" @click="addProcessType()">确 定</el-button>
      </el-row>
    </el-dialog>

    <el-dialog
        title="栏目设置"
        :visible.sync="show4"
        show-cancel-button="true"
        confirm-button-text="确定"
        cancel-button-text="取消"
        style="width: 1200px"
    >
      <label>选择应用的栏目:</label>
        <el-cascader
            v-model="coid" :options="columns" filterable placeholder="选择栏目"  popper-class="select_popper">
          <template slot-scope="{ node, data }">
            <span>{{ data.label }}</span>
            <span v-if="!node.isLeaf"> ({{ data.children.length }}) </span>
          </template>
        </el-cascader>
      <span style="align-items: center">
        <el-button @click="show4 = false">取 消</el-button>
        <el-button type="primary" @click="setColumn()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {MessageBox} from "element-ui";


export default {
  name: "AuditProcess",
  data() {
    return {
      user: JSON.parse(localStorage.getItem("current-user") || '{}'),
      auditors: [],

      show1: false,
      show2: false,
      show3: false,
      show4:false,
      uid: 0,
      pid:0,
      coid:[],
      count: 0,
      processtypename: '',
      testprocess: {},
      allprocesstype: [],
      showprocess: [],
      options:[],
      columns:[],
    }
  },
  mounted() {
    this.getColumn();
   this.getProcessType();
    this.getAuditor();
  },
  methods: {
    getColumn() {
      this.$request.get('/column/selectAll').then(
          res => {
            if (res.code === '200') {
              this.options = res.data;
              this.columns = this.transformOptions(this.options);

            }
          }
      ).catch((error) => {
        console.error('栏目信息获取失败:', error);
      });
    },
    showAuditorchange(id) {
      this.pid = id;
      this.show1 = true;
    },
    showColumn(id) {
      this.pid = id;
      this.show4 = true;
    },
    changeAuditor() {
      let newprocess = {id: this.pid, uid: this.uid};
      this.$request.put('/process/updateAuditor', newprocess).then(
          res => {
            if (res.code === '200') {
              this.$message.success("审核员修改成功");
              this.show1 = false;
              this.getProcess();
            }
          }
      ).catch((error) => {
        console.error('数据加载出现错误:', error);
      });
    },

    deleteprocess() {
      if (this.showprocess.length <= 1) {
        this.$message.warning("仅剩一级时无法删除！");
      } else {
        MessageBox.confirm('确定删除最后一级吗？', '删除确认', {
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        }).then(() => {
          this.$request.delete('/process/delete/' + this.getLastOne).then(
              res => {
                if (res.code === '200') {
                  this.$message.success("删除成功");
                  this.getProcess();
                }
              }
          ).catch((error) => {
            console.error('数据加载出现错误:', error);
          });

        }).catch(() => {
          this.$message.info("已取消");
        });
      }
    },

    getAuditor() {
      this.$request.get('/user/selectAuditor').then(
          res => {
            if (res.code === '200') {
              this.auditors = res.data;
              console.log(this.auditors);
            }
          }
      ).catch((error) => {
        console.error('数据加载出现错误:', error);
      });

    },
    getProcess() {
      this.$request.get('/process/selectBYptid/'+this.pid).then(
          res => {
            if (res.code === '200') {
              this.showprocess = res.data;
              this.count = this.showprocess.length;
            }
          }
      ).catch((error) => {
        console.error('数据加载出现错误:', error);
      });

    },
    addProcess() {
      let newprocess = {before: this.getLastOne, uid: this.uid};
      this.$request.post("/process/add", newprocess).then(
          res => {
            if (res.code === '200') {
              this.$message.success("流程添加成功");
              this.show2 = false;
              this.getProcess();
            }
          }
      ).catch((error) => {
        console.error('数据加载出错', error);
      });
    },
    getProcessType() {
      if (this.user.bid!=null){
        this.$request.get('/processtype/selectByBid/'+this.user.bid).then(
            res => {
              if (res.code === '200') {
                this.allprocesstype = res.data;
                this.getTypeone();
              }
            }
        ).catch((error) => {
          console.error('数据加载出现错误:', error);
        });
      }
    },
    addProcessType() {
      let newprocesstype = {name: this.processtypename, uid: this.uid, bid:this.user.bid};
      this.$request.post("/processtype/add", newprocesstype).then(
          res => {
            if (res.code === '200') {
              this.$message.success("添加成功");
              this.show3 = false;
              this.getProcessType();
            }
          }
      ).catch((error) => {
        console.error('数据加载出错', error);
      });
    },
    deleteprocesstype(processtype) {
      if (processtype.id == 1) {
        this.$message.warning("默认方案无法删除！");
      } else {
        MessageBox.confirm('确定删除方案"' + processtype.name + '"吗？', '删除确认', {
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        }).then(() => {
          this.$request.delete('/processtype/delete/' + processtype.id).then(
              res => {
                if (res.code === '200') {
                  this.$message.success("删除成功");
                  this.getProcessType();
                }
              }
          ).catch((error) => {
            console.error('数据加载出现错误:', error);
          });

        }).catch(() => {
          this.$message.info("已取消");
        });
      }
    },
    applyprocesstype(type) {
      this.pid=type.id;
      this.testprocess.name=type.name;
      this.getProcess();
      /*
      this.$request.put('/processtype/setType/' + id).then(
          res => {
            if (res.code === '200') {
              this.$message.success("设置成功");
              this.getProcess();
              this.getProcessType();
              this.getTypeone();
            }
          }
      ).catch((error) => {
        console.error('数据加载出现错误:', error);
      });

       */
    },
    setColumn() {
      this.show4=false;
      let coidr=this.coid.reverse();
      const ProcessType={id:this.pid,coid:coidr[0],bid:this.user.bid};
      this.$request.put('/processtype/setCoid',ProcessType).then(
          res => {
            if (res.code === '200') {
              this.$message.success("设置成功");
              this.getProcess();
              this.getProcessType();
            }
          }
      ).catch((error) => {
        console.error('数据加载出现错误:', error);
      });


    },

    resetProcessName(id) {
      /*
      this.$request.put('/processtype/setType/' + id).then(
          res => {
            if (res.code === '200') {
              this.$message.success("设置成功");
              this.getProcess();
              this.getProcessType();
              this.getTypeone();
            }
          }
      ).catch((error) => {
        console.error('数据加载出现错误:', error);
      });

       */
    },

    getTypeone() {
      /*
      this.testprocess = this.allprocesstype.find(item => item.type === 1);
      console.log(this.testprocess);
       */
    },
    transformOptions(options) {
      return options.map(item => {
        let newItem = {
          value: item.id,
          label: item.name
        };
        if (item.child && item.child.length > 0) {
          newItem.children = this.transformOptions(item.child);
        }
        return newItem;
      });
    }
  },
  computed: {
    getLastOne() {
      const item = this.showprocess.find(item => item.last === 1);
      return item ? item.id : null;
    },
  }
}
</script>
<style scoped>

</style>