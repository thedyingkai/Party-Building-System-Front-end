<!--
  党建活动表单组件
  
  @component ActivityForm
  @description 用于创建和编辑党建活动的表单组件，支持活动信息填写、缺勤人员管理和富文本内容编辑
  @author 党建系统开发团队
-->
<template>
  <!-- 活动表单主体 -->
  <el-form ref="activityForm" :model="activityForm" :rules="rules" class="demo-activityForm" label-width="100px"
           style="width: 100%">
    <!-- 活动名称输入 -->
    <el-form-item label="活动名称" prop="name" >
      <el-input v-model="activityForm.name"></el-input>
    </el-form-item>
    <div style="display: flex;">
      <el-form-item label="活动类型" prop="type">
        <el-select v-model="activityForm.type" placeholder="请选择活动类型" popper-class="select_popper">
          <el-option v-for="type in activityTypes" :key="type.id" :label="type.name" :value="type.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="主持人" prop="uid">
        <el-select v-model="activityForm.uid" placeholder="请选择主持人" popper-class="select_popper">
          <el-option v-for="user in activityForm.members" :key="user.uid" :label="user.username"
                     :value="user.uid"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="活动时间" required>
        <el-date-picker
            v-model="activityForm.time"
            placeholder="选择日期时间"
            popper-class="select_popper" type="datetime">
        </el-date-picker>
      </el-form-item>
    </div>
    <el-form-item label="缺勤人员">
      <el-select v-model="selectedIds"
                 filterable
                 multiple placeholder="请选择"
                 popper-class="select_popper"
                 style="width: 100%"
                 @change="handleAbsenceChange"
      >
        <el-option
            v-for="item in activityForm.members"
            :key="item.uid"
            :label="item.username"
            :value="item.uid"
        ></el-option>
      </el-select>
    </el-form-item>
    <div v-show="activityForm.members.some(member => member.isAbsent)">
      <div style="width: 100px;text-align: right;padding: 0 12px 0 0;">缺勤原因</div>
      <div>
        <el-form-item v-for="(member, index) in activityForm.members"
                      v-if="member.isAbsent"
                      :key="member.uid"
                      :label="member.username">
          <el-form-item :prop="'members.' + index + '.type'"
                        :rules="{ required: true, message: '缺勤类型不能为空', trigger: 'change' }"
                        class="select-in-input">
            <el-select v-model="member.type" placeholder="缺勤类型" popper-class="select_popper">
              <el-option label="病假" value="1"></el-option>
              <el-option label="事假" value="2"></el-option>
              <el-option label="其他" value="3"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item :prop="'members.' + index + '.detail'" style="width: calc(100% - 6.5rem);">
            <el-input v-model="member.detail" placeholder="具体原因">
              <el-button slot="append" @click.prevent="removeAbsence(member)"><i class="el-icon-minus"></i></el-button>
            </el-input>
          </el-form-item>
        </el-form-item>
      </div>
    </div>
    <!--    <el-form-item label="活动内容" prop="content">-->
    <!--      <el-input v-model="activityForm.content" :rows="9" type="textarea"></el-input>-->
    <!--    </el-form-item>-->

    <div>
    <el-form-item prop="content" style="margin-left: -60px;">
      <div id="editor"></div>
    </el-form-item>
</div>
    <el-form-item>
      <el-button type="primary" @click="submitForm('activityForm')">{{ dialogTitle }}</el-button>
      <el-button @click="resetForm('activityForm')">重置</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import E from "wangeditor";

export default {
  name: "ActivityForm",
  props: {
    /**
     * 活动类型列表
     * @type {Array}
     */
    activityTypes: {type: Array},
    /**
     * 党小组ID
     * @type {Number}
     */
    gid: {type: Number},
    /**
     * 编辑模式下的原始数据
     * @type {Object}
     */
    oldData: {type: Object, default: () => ({})},
    /**
     * 是否为新增模式
     * @type {Boolean}
     */
    addType: {type: Boolean, default: true},
    /**
     * 对话框标题
     * @type {String}
     */
    dialogTitle: {type: String, default: '新增活动'}
  },
  created() {
    this.selectUsers(this.gid)
  },
  watch: {
    gid(newGid) {
      if (!this.loaded) {
        this.selectUsers(newGid);
        this.loaded = true;
      }
    },
    oldData(newOldData) {
      this.activityForm = {}
      if (Object.keys(newOldData).length > 0) {
        this.activityForm = newOldData;
      }
    }
  },
  data() {
    return {
      user: JSON.parse(localStorage.getItem("current-user") || '{}'),
      activityForm: {
        name: '',
        uid: '',
        time: '',
        type: '',
        members: [],
        content: '',
      },
      rules: {
        name: [
          {required: true, message: '请输入活动名称', trigger: 'blur'},
        ],
        time: [
          {type: 'date', required: true, message: '请选择日期', trigger: 'change'}
        ],
        type: [
          {type: 'number', required: true, message: '请选择活动类型', trigger: 'change'}
        ],
        uid: [
          {required: true, message: '请添加主持人', trigger: 'blur'}
        ],
        content: [
          {required: true, message: '请填写活动内容', trigger: 'blur'}
        ],
        'members.type': [
          {required: true, message: '请选择缺勤类型', trigger: 'change'}
        ]
      },
      selectedIds: []
    };
  },
  mounted() {
    this.initWangEditor()
  },
  methods: {
    /**
     * 查询党小组成员列表
     * 
     * @param {Number} gid - 党小组ID
     * @description 获取党小组所有成员，并初始化缺勤状态
     */
    selectUsers(gid) {
      this.$request.get('/user/selectBranchByGid/' + gid).then(
          res => {
            if (res.code === '200') {
              this.activityForm.members = res.data.map(member => {
                const {id, ...rest} = member;
                return {
                  uid: id,
                  ...rest,
                  isAbsent: false,
                  type: null,
                  detail: ''
                };
              });
            } else {
              this.$message.error(res.msg);
            }
          }
      ).catch((error) => {
        console.error('党支部成员数据加载出错', error);
      })
    },
    /**
     * 提交表单
     * 
     * @param {String} formName - 表单引用名称
     * @description 验证表单后提交，根据 addType 决定是新增还是更新
     */
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (!valid) {
          this.$message.error('请正确填写表单内容');
          return false;
        } else {
          if (this.addType) {
            this.$request.post('/activity/add/', this.activityForm).then(
                res => {
                  if (res.code === '200') {
                    this.$message.success('活动创建成功');
                    this.$emit('ActivityAdded');
                  } else {
                    this.$message.error(res.msg);
                  }
                }
            ).catch((error) => {
              console.error('党小组成员数据加载出错', error);
            })
          } else {
            this.$request.put('/activity/update/', this.activityForm).then(
                res => {
                  if (res.code === '200') {
                    this.$message.success('活动修改成功');
                    this.$emit('ActivityAdded');
                  } else {
                    this.$message.error(res.msg);
                  }
                }
            ).catch((error) => {
              console.error('党小组成员数据加载出错', error);
            })
          }
        }
      });
    },
    /**
     * 重置表单
     * 
     * @param {String} formName - 表单引用名称
     * @description 重置所有表单字段和缺勤信息
     */
    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.activityForm.members.forEach(member => {
        member.isAbsent = false;
        member.type = null;
        member.detail = '';
      });
      this.selectedIds = [];
    },
    /**
     * 处理缺勤人员变化
     * 
     * @param {Array} selectedIds - 选中的缺勤人员ID数组
     * @description 更新成员的缺勤状态
     */
    handleAbsenceChange(selectedIds) {
      this.selectedIds = selectedIds;
      this.activityForm.members.forEach(member => {
        member.isAbsent = selectedIds.includes(member.uid);
        if (!member.isAbsent) {
          member.type = null;
          member.detail = '';
        }
      });
    },
    /**
     * 移除单个缺勤记录
     * 
     * @param {Object} member - 要移除缺勤的成员对象
     * @description 清除成员的缺勤标记和相关信息
     */
    removeAbsence(member) {
      member.isAbsent = false;
      member.type = null;
      member.detail = '';
      const idIndex = this.selectedIds.indexOf(member.uid);
      if (idIndex !== -1) {
        this.selectedIds.splice(idIndex, 1);
      }
    },
    /**
     * 初始化富文本编辑器
     * 
     * @description 创建 WangEditor 实例并配置图片上传功能
     */
    initWangEditor() {
      setTimeout(() => {
        if (!this.editor) {
          this.editor = new E(document.getElementById('editor'));
          this.editor.config.placeholder = '请输入内容';
          // 设置文件上传的后端路径
          this.editor.config.uploadImgServer = this.$baseUrl + '/file/editor/upload';
          // 设置文件上传的参数名
          this.editor.config.uploadFileName = 'file'
          // 设置文件上传的请求头
          this.editor.config.uploadImgHeaders = {
            token: this.user.token
          }
          this.editor.create();

          this.editor.config.uploadImgHooks = {
            customInsert: function (insertImgFn, result) {
              // result 即服务端返回的接口数据，假设其中包含图片的 URL 信息
              let imgUrl = result.data[0].url;
              // 使用 insertImgFn 将图片插入到编辑器中
              insertImgFn(imgUrl);
            }
          };
        }

      }, 100);
    },
  }
}
</script>

<style scoped>
::v-deep .el-form-item__content {
  display: flex;
  align-items: center;
}

::v-deep .select-in-input .el-form-item__content .el-select {
  background-color: #fff;
  width: 6.5rem;
}
</style>