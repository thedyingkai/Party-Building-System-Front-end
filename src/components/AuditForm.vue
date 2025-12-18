<template>
  <el-form ref="auditForm" :model="auditForm" :rules="rules" class="demo-auditForm" label-width="100px"
           style="width: 150vh;">
    <el-form-item label="通过/打回" prop="status">
      <el-radio-group v-model="auditForm.status" @change="handleStatusChange">
        <el-radio :label="2">通过</el-radio>
        <el-radio :label="3">打回</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item label="审核意见" prop="advice">
      <el-input v-model="auditForm.advice" type="textarea"></el-input>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  name: "AuditForm",
  props: {did: {type: Number}}, // 新增 props 接收父组件传递的 did 属性
  data() {
    return {
      auditForm: {
        did: '',
        title: '',
        content: '',
        status: '',
        advice: '',
      },
      rules: {
        status: [
          {required: true, message: '请选择状态', trigger: 'change'}
        ],
      }
    }
  },
  created() {
    this.auditForm.did = this.did; // 在 created 生命周期将 props 中的 did 赋值给 auditForm.did
  },
  watch: {
    'did': function (newVal) {
      this.auditForm.did = newVal;
      this.auditForm.status = '';
      this.auditForm.advice = '';
    }
  },
  methods: {
    getFormData() {
      return this.auditForm;
    },
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
    handleStatusChange(value) {
      this.auditForm.status = value;
    }
  }
}
</script>

<style scoped>

</style>