<!--
/**
 * @component AuditProcess
 * @description 审核流程管理页面 - 配置多级审核流程、审核员分配、方案管理
 * @author Party Building System
 */
-->
<template>
  <!-- 审核流程配置容器 -->
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
      /** 当前登录用户信息 */
      user: JSON.parse(localStorage.getItem("current-user") || '{}'),
      /** 审核员列表 */
      auditors: [],
      /** 修改审核员对话框显示状态 */
      show1: false,
      /** 新增流程对话框显示状态 */
      show2: false,
      /** 新增方案对话框显示状态 */
      show3: false,
      /** 栏目设置对话框显示状态 */
      show4: false,
      /** 选中的用户ID */
      uid: 0,
      /** 当前编辑的流程/方案ID */
      pid: 0,
      /** 选中的栏目ID数组 */
      coid: [],
      /** 审核级别数量 */
      count: 0,
      /** 新方案名称 */
      processtypename: '',
      /** 当前展示的方案 */
      testprocess: {},
      /** 所有审核方案列表 */
      allprocesstype: [],
      /** 当前方案的审核流程 */
      showprocess: [],
      /** 栏目原始数据 */
      options: [],
      /** 栏目级联选择器数据 */
      columns: [],
    }
  },
  /**
   * 生命周期钩子 - 组件挂载时初始化数据
   */
  mounted() {
    this.getColumn();
   this.getProcessType();
    this.getAuditor();
  },
  methods: {
    /**
     * 获取栏目列表
     */
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
    /**
     * 显示修改审核员对话框
     * @param {number} id - 审核流程ID
     */
    showAuditorchange(id) {
      this.pid = id;
      this.show1 = true;
    },
    /**
     * 显示栏目设置对话框
     * @param {number} id - 方案ID
     */
    showColumn(id) {
      this.pid = id;
      this.show4 = true;
    },
    /**
     * 修改审核员
     */
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

    /**
     * 删除最后一级审核流程
     */
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

    /**
     * 获取审核员列表
     */
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
    /**
     * 获取审核流程
     */
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
    /**
     * 添加审核流程
     */
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
    /**
     * 获取审核方案列表
     */
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
    /**
     * 添加审核方案
     */
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
    /**
     * 删除审核方案
     * @param {Object} processtype - 方案对象
     */
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
    /**
     * 应用审核方案
     * 切换到选中的审核方案并加载审核流程
     * @param {Object} type - 审核方案对象
     */
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
    /**
     * 设置方案应用的栏目
     * 将审核方案关联到指定栏目
     */
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

    /**
     * 重置流程名称（预留方法）
     * @param {number} id - 方案ID
     */
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

    /**
     * 获取类型一（预留方法）
     */
    getTypeone() {
      /*
      this.testprocess = this.allprocesstype.find(item => item.type === 1);
      console.log(this.testprocess);
       */
    },
    /**
     * 转换栏目选项为级联选择器格式
     * @param {Array} options - 栏目原始数据
     * @returns {Array} 转换后的级联数据
     */
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
    /**
     * 获取最后一级审核流程ID
     * @returns {number|null} 最后一级流程ID，没有返回null
     */
    getLastOne() {
      const item = this.showprocess.find(item => item.last === 1);
      return item ? item.id : null;
    },
  }
}
</script>
<style scoped>

</style>