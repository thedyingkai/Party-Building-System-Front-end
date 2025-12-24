<!--
  审核表单组件
  
  @component AuditForm
  @description 用于文章审核的表单组件，支持通过/打回选择和审核意见填写
  @author 党建系统开发团队
-->
<template>
  <!-- 审核表单 -->
  <el-form ref="auditForm" :model="auditForm" :rules="rules" class="demo-auditForm" label-width="100px"
           style="width: 150vh;">
    <!-- 审核状态选择 -->
    <el-form-item label="通过/打回" prop="status">
      <el-radio-group v-model="auditForm.status" @change="handleStatusChange">
        <el-radio :label="2">通过</el-radio>
        <el-radio :label="3">打回</el-radio>
      </el-radio-group>
    </el-form-item>
    <!-- 审核意见 -->
    <el-form-item label="审核意见" prop="advice">
      <el-input v-model="auditForm.advice" type="textarea"></el-input>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  name: "AuditForm",
  props: {
    /**
     * 草稿ID
     * @type {Number}
     */
    did: {type: Number}
  },
  data() {
    return {
      // 审核表单对象
      auditForm: {
        // 草稿ID
        did: '',
        // 文章标题
        title: '',
        // 文章内容
        content: '',
        // 审核状态（2-通过，3-打回）
        status: '',
        // 审核意见
        advice: '',
      },
      // 表单验证规则
      rules: {
        status: [
          {required: true, message: '请选择状态', trigger: 'change'}
        ],
      }
    }
  },
  /**
   * 组件创建时
   * @description 初始化草稿ID
   */
  created() {
    this.auditForm.did = this.did; // 在 created 生命周期将 props 中的 did 赋值给 auditForm.did
  },
  watch: {
    /**
     * 监听草稿ID变化
     * @param {number} newVal - 新的草稿ID
     * @description 当草稿ID变化时，重置审核表单
     */
    'did': function (newVal) {
      this.auditForm.did = newVal;
      this.auditForm.status = '';
      this.auditForm.advice = '';
    }
  },
  methods: {
    /**
     * 获取表单数据
     * @returns {Object} 审核表单数据
     * @description 返回当前审核表单的数据对象
     */
    getFormData() {
      return this.auditForm;
    },
    /**
     * 验证表单
     * @returns {Promise} 验证结果 Promise
     * @description 验证审核表单是否填写完整
     */
    validateForm() {
      return new Promise((resolve, reject) => {
        this.$refs.auditForm.validate((valid) => {
          if (valid) {
            resolve();
          } else {
            reject();
          }
        });
      });
    },
    /**
     * 处理审核状态变化
     * @param {number} value - 审核状态值（2-通过，3-打回）
     * @description 更新审核状态
     */
    handleStatusChange(value) {
      this.auditForm.status = value;
    }
  }
}
</script>

<style scoped>

</style>