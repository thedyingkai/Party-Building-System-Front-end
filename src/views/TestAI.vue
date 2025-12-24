<!--
  AI 测试页面
  
  @component TestAI
  @description AI 智能客服测试页面，用于测试智能问答功能
  @author 党建系统开发团队
-->
<template>
    <!-- AI 客服组件 -->
    <customer-service/>
</template>

<script>
import CustomerService from "@/components/CustomerService.vue";

export default {
  components: {
    "customer-service": CustomerService
  },
  data() {
    return {};
  }
};

</script>