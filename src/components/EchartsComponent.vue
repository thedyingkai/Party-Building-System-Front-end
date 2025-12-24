<!--
  ECharts 图表组件
  
  @component EChartsComponent
  @description 封装的 ECharts 图表组件，支持折线图、柱状图、饼图和雷达图
  @author 党建系统开发团队
-->
<template>
  <!-- 图表容器 -->
  <div ref="echartsContainer" :style="{ width: width, height: height}"></div>
</template>

<script>
import * as echarts from 'echarts';

export default {
  name: 'EChartsComponent',
  props: {
    /**
     * 图表的宽度
     * @type {String}
     */
    width: {
      type: String,
      default: '100%',
    },
    /**
     * 图表的高度
     * @type {String}
     */
    height: {
      type: String,
      default: '400px',
    },
    /**
     * 图表的类型（line/bar/pie/radar）
     * @type {String}
     */
    chartType: {
      type: String,
      required: true,
      validator(value) {
        return ['line', 'bar', 'pie', 'radar'].includes(value);
      },
    },
    /**
     * 图表的配置数据
     * @type {Object}
     */
    chartData: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      // ECharts 实例对象
      chart: null,
    };
  },
  /**
   * 组件挂载后
   * @description 初始化图表
   */
  mounted() {
    this.initChart();
  },
  watch: {
    /**
     * 监听图表数据变化
     * @param {Object} newData - 新的图表数据
     * @description 当图表数据变化时，重新渲染图表
     */
    chartData: {
      deep: true,
      handler(newData) {
        this.updateChart(newData);
      },
    },
    /**
     * 监听图表类型变化
     * @description 当图表类型变化时，重新渲染图表
     */
    chartType: 'updateChart',
  },
  methods: {
    /**
     * 初始化图表
     * 
     * @description 创建 ECharts 实例并挂载到容器
     */
    initChart() {
      this.chart = echarts.init(this.$refs.echartsContainer);
      this.updateChart();
    },
    /**
     * 更新图表
     * 
     * @description 根据图表类型和数据更新图表配置
     */
    updateChart() {
      if (!this.chart) return;

      let option = {};
      const {chartType, chartData} = this;

      // 根据 chartType 渲染不同的图表
      switch (chartType) {
        case 'line':
          option = this.getLineChartOptions(chartData);
          break;
        case 'bar':
          option = this.getBarChartOptions(chartData);
          break;
        case 'pie':
          option = this.getPieChartOptions(chartData);
          break;
        case 'radar':
          option = this.getRadarChartOptions(chartData);
          break;
        default:
          option = {};
      }

      option.tooltip = {
        trigger: 'item',           // 触发类型，默认数据触发，见下图，可选为：'item' ¦ 'axis'
        showDelay: 20,             // 显示延迟，添加显示延迟可以避免频繁切换，单位ms
        hideDelay: 100,            // 隐藏延迟，单位ms
        transitionDuration: 0.4,  // 动画变换时间，单位s
        backgroundColor: 'rgba(0,0,0,0.7)',     // 提示背景颜色，默认为透明度为0.7的黑色
        borderColor: '#333',       // 提示边框颜色
        borderRadius: 4,           // 提示边框圆角，单位px，默认为4
        borderWidth: 0,            // 提示边框线宽，单位px，默认为0（无边框）
        padding: 5,                // 提示内边距，单位px，默认各方向内边距为5，
                                   // 接受数组分别设定上右下左边距，同css
        axisPointer: {            // 坐标轴指示器，坐标轴触发有效
          type: 'line',         // 默认为直线，可选为：'line' | 'shadow'
          lineStyle: {          // 直线指示器样式设置
            color: '#48b',
            width: 2,
            type: 'solid'
          },
          shadowStyle: {                       // 阴影指示器样式设置
            width: 'auto',                   // 阴影大小
            color: 'rgba(150,150,150,0.3)'  // 阴影颜色
          }
        },
        textStyle: {
          color: '#fff'
        }
      };
      option.grid = {
        x: 40,
        y: 40,
        x2: 20,
        y2: 20,
        // width: {totalWidth} - x - x2,
        // height: {totalHeight} - y - y2,
        backgroundColor: 'rgba(0,0,0,0)',
        borderWidth: 1,
        borderColor: '#ccc'
      },
          this.chart.setOption(option);
    },
    /**
     * 获取折线图配置
     * @param {Object} data - 图表数据
     * @param {Object} data.title - 图表标题
     * @param {Array} data.categories - X轴分类数据
     * @param {Array} data.values - Y轴数值数据
     * @returns {Object} ECharts 折线图配置对象
     */
    getLineChartOptions(data) {
      return {
        title: data.title,
        tooltip: {
          trigger: 'axis',
        },
        xAxis: {
          type: 'category',
          data: data.categories,
        },
        yAxis: {
          type: 'value',
        },
        series: [
          {
            data: data.values,
            type: 'line',
          },
        ],
      };
    },
    /**
     * 获取柱状图配置
     * @param {Object} data - 图表数据
     * @param {Object} data.title - 图表标题
     * @param {Array} data.categories - X轴分类数据
     * @param {Array} data.values - Y轴数值数据
     * @returns {Object} ECharts 柱状图配置对象
     * @description 包含自定义颜色配置
     */
    getBarChartOptions(data) {
      return {
        title: data.title,
        xAxis: {
          type: 'category',
          data: data.categories,
        },
        yAxis: {
          type: 'value',
        },
        series: [
          {
            data: data.values,
            type: 'bar',
            itemStyle: {
              normal: {
                color: function (params) {
                  var colorlist = ['#DA251D', '#E67716', '#FBC300', '#11440f', '#32585a', '#00ff77'];
                  return colorlist[params.dataIndex];
                }
              }
            }
          },
        ],
      };
    },
    /**
     * 获取饱图配置
     * @param {Object} data - 图表数据
     * @param {Object} data.title - 图表标题
     * @param {Array} data.series - 饱图系列数据
     * @returns {Object} ECharts 饱图配置对象
     */
    getPieChartOptions(data) {
      return {
        legend: {
          orient: 'vertical',
          left: 10,         // 距离左侧10px
          y: 'top',      // 垂直居中
          itemGap: 10,      // 图例项间距
          align: 'left',
          padding: [10, 5], // 上下10px，左右5px
          textStyle: {
            overflow: 'break' // 文本换行
          }
        },
        title: data.title,
        series: data.series,
      };
    },
    /**
     * 获取雷达图配置
     * @param {Object} data - 图表数据
     * @param {Object} data.title - 图表标题
     * @param {Array} data.indicators - 雷达图指标配置
     * @param {Array} data.values - 数值数据
     * @returns {Object} ECharts 雷达图配置对象
     */
    getRadarChartOptions(data) {
      return {
        title: data.title,
        radar: {
          indicator: data.indicators,
        },
        series: [
          {
            name: '评分',
            type: 'radar',
            data: [
              {
                value: data.values,
              },
            ],
          },
        ],
      };
    },
  },
};
</script>

<style scoped>
</style>
