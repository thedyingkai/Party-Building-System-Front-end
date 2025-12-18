<template>
  <div class="question-warp">
    <div class="question-content">
      {{ value }}
    </div>
  </div>
</template>
<script>
export default {
  name: 'QuestionItem',
  props: {
    value: String,
  },
  data() {
    return {}
  },
  methods: {}
}
</script>
<style scoped>

.question-warp {
  display: flex;
}

.question-content {
  margin: 5px;
  line-height: 25px;
  text-align: justify;
  width: 100%;
  background-color: rgb(249, 246, 243);
  border-radius: 10px;
  padding: 10px;
}
</style>