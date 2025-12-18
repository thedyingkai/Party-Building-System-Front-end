<template>
  <div style="display: flex;justify-content: center;align-items: center;justify-content: center;flex-grow: 1;">
    <div>
      <el-form ref="form" :model="formData" label-width="80px" size="mini">
        <el-form-item label="账号">
          <el-input v-model="formData.uname" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="密码">
          <el-input v-model="formData.psw" show-password ></el-input>
        </el-form-item>
        <el-form-item label="积分" >
          <el-input v-model="formData.points" v-if="editor.permissions[6] === '1'"></el-input>
          <el-input v-model="formData.points" v-if="editor.permissions[6] === '0'" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="身份">
          <el-select v-model="formData.cname" placeholder="请设置用户身份" @change="handleCidChange"
                     v-if="editor.permissions[6] === '1'" popper-class="select_popper">
            <el-option label="管理员" value="1"></el-option>
            <el-option label="拟稿员" value="2"></el-option>
            <el-option label="审核员" value="3"></el-option>
            <el-option label="普通用户" value="4"></el-option>
          </el-select>
          <el-input v-model="formData.cname" :disabled="true" v-if="editor.permissions[6] === '0'"></el-input>
        </el-form-item>
        <el-form-item size="large">
          <el-button type="primary" @click="onSubmit()">修改</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  name: "UserEdit",
  props: {
    user: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      editor: JSON.parse(localStorage.getItem("current-user") || '{}'),
      formData: {}
    };
  },
  watch: {
    user: {
      immediate: true,
      handler(newValue) {
        this.formData = {...newValue};
      }
    }
  },
  methods: {
    handleCidChange(value) {
      this.formData.cid = value;
    },
    onSubmit() {
      this.$emit('update-user', this.formData);
      this.$request.put('user/update',this.formData).then(
          res=>{
            if (res.code === '200') {
              this.$message.success('修改成功');
            }
          }
      ).catch(
          (error) => {
            console.error('设置失败:', error);
            this.$message.error('设置失败，请稍后再试');
          });


    }
  }
};
</script>

<style scoped>

</style>