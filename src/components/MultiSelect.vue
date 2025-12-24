<!--
  多选选择器组件
  
  @component MultiSelect
  @description 基于 vue-multiselect 的多选组件，支持标签化和搜索
  @author 党建系统开发团队
-->
<template>
  <div>
    <!-- 多选组件 -->
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
    /**
     * 可选项列表
     * @type {Array}
     */
    options: {type: Array},
    /**
     * 当前已选中的项
     * @type {Array}
     */
    current: {type: Array},
    /**
     * 显示的标签属性名
     * @type {String}
     */
    labelName: {type: String},
  },
  data() {
    return {
      // 当前选中的值数组
      value: [],
    }
  },
  watch: {
    /**
     * 监听选项列表变化
     * @param {Array} newOptions - 新的选项列表
     * @description 当选项列表变化时，更新当前选中值
     */
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
    /**
     * 监听当前选中项变化
     * @param {Array} newCurrent - 新的当前选中项
     * @description 当当前选中项变化时，更新value
     */
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