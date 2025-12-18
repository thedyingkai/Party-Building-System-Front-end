<template>
  <div ref="echartsContainer" :style="{ width: width, height: height}"></div>
</template>

<script>
import * as echarts from 'echarts';

export default {
  name: 'EChartsComponent',
  props: {
    // 图表的宽度
    width: {
      type: String,
      default: '100%',
    },
    // 图表的高度
    height: {
      type: String,
      default: '400px',
    },
    // 图表的类型
    chartType: {
      type: String,
      required: true,
      validator(value) {
        return ['line', 'bar', 'pie', 'radar'].includes(value);
      },
    },
    // 图表的配置数据
    chartData: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      chart: null,
    };
  },
  mounted() {
    this.initChart();
  },
  watch: {
    chartData: {
      deep: true,
      handler(newData) {
        this.updateChart(newData);
      },
    },
    chartType: 'updateChart',
  },
  methods: {
    // 初始化图表
    initChart() {
      this.chart = echarts.init(this.$refs.echartsContainer);
      this.updateChart();
    },
    // 更新图表
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
    // 获取折线图的配置
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
    // 获取柱状图的配置
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
    // 获取饼图的配置
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
    // 获取雷达图的配置
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
