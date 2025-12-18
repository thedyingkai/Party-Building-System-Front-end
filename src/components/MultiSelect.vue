<template>
  <div>
    <multiselect v-model="value" :label="labelName" :multiple="true" :options="options" :taggable="true"
                 :track-by="labelName" deselectLabel="回车或点击以移除" placeholder="键入以查找" selectLabel="回车或点击以选择" selectedLabel="已选择"
                 tagPlaceholder=""
    ></multiselect>
  </div>
</template>

<script>
import Multiselect from 'vue-multiselect'

export default {
  name: "MultiSelect",
  components: {
    Multiselect
  },
  props: {
    options: {type: Array},
    current: {type: Array},
    labelName: {type: String},
  },
  data() {
    return {
      value: [],
    }
  },
  watch: {
    options: {
      immediate: true, // 立即执行一次
      handler(newOptions) {
        if (newOptions !== undefined && newOptions !== null) {
          this.value = JSON.parse(JSON.stringify(newOptions)) || [];
        } else {
          this.value = [];
        }
      }
    },
    current: {
      immediate: true, // 立即执行一次
      handler(newCurrent) {
        if (newCurrent !== undefined && newCurrent !== null) {
          this.value = JSON.parse(JSON.stringify(newCurrent)) || [];
          if (this.value.length === 0 && this.options.length > 0) {
            this.value = JSON.parse(JSON.stringify(this.options)) || [];
          }
        } else {
          this.value = [];
        }
      }
    }
  },
  methods: {}
}
</script>
<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
<style scoped>

</style>