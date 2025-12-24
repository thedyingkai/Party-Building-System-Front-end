<!--
/**
 * @component ResourceView
 * @description 资源管理页面 - 展示活动资源、资源统计图表、支持资源上传和筛选
 * @author Party Building System
 */
-->
<template>
  <!-- 资源管理容器 -->
  <div class="flex-col flex-1 section_3">
    <div class="flex-row group">
      <div class="flex-col shrink-0 section_4">
        <span class="self-start font_3 text_4">最近活动图片</span>
        <div class="flex-row self-stretch relative group_3 mt-23">
          <el-carousel height="9rem" indicator-position="none" style="width: 16rem" trigger="click">
            <el-carousel-item v-for="(item, index) in carouselItems" :key="index">
              <div class="txt">{{ item.description }}</div>
              <div :style="{ backgroundImage: `url(${item.content})` }" class="img"></div>
            </el-carousel-item>
          </el-carousel>
        </div>
      </div>
      <div class="flex-col items-start flex-1 section_5 ml-59">
        <span class="font_3 text_5">资源统计</span>
        <div class="mt-4 flex-col section_6">
          <div class="mt-12 flex-col relative group_4">
            <e-charts-component :chartData="barChartData" :chartType="'bar'" :height="'10rem'"></e-charts-component>
            <e-charts-component :chartData="lineChartData" :chartType="'line'" :height="'10rem'"
                                :width="'20rem'"></e-charts-component>
          </div>
        </div>
      </div>
    </div>
    <div class="flex-row justify-between group">
      <div class="flex-col  section_8 hidden-scrollbar-corner" style="width: 100%">
        <span class="font_3 text_10">我上传的</span>
        <resource-upload style="width: 100%"></resource-upload>
      </div>
    </div>
    <div class="flex-row justify-between group">
      <div class="flex-col section_8" style="width: 100%">
        <div class="flex-col justify-start items-start flex-1 text-wrapper_3">
          <div style="flex-direction: row;display: flex;justify-content: space-between;width: 100%">
            <span class="font_3">全部资源</span>
            <div style="display: flex;align-items: center">
              <el-select
                  v-model="selectedFilter"
                  placeholder="请选择筛选方式"
                  style="width: 120px; margin-right: 10px"
              >
                <el-option label="描述/类型" value="description"></el-option>
                <el-option label="上传者" value="uploader"></el-option>
                <el-option label="活动参与者" value="joiner"></el-option>
                <el-option label="活动" value="activity"></el-option>
              </el-select>
              <div class="input-container">
                <el-input
                    v-model="filterTextForResources"
                    :placeholder="`输入${filterPlaceholder}进行过滤`"
                ></el-input>
              </div>
              <div class="input-container">
                <el-input type="datetime-local" v-model="filterDate" class="time-input">
                </el-input>
              </div>
              <drop-down-menu :menu-items="menuData" @filterType="filterType"></drop-down-menu>
            </div>
          </div>
          <div v-if="filteredResources.length>0" class="image-card-container resources"
               style="padding: 10px;flex-direction: row">
            <image-card v-for="resource in filteredResources" :id="resource.id" :key="resource.id"
                        :description="resource.description" :max-height="iconSize" :max-width="iconSize"
                        :title="resource.name" :url="resource.content" show-type="resource"
                        total-height=120px
            ></image-card>
          </div>
          <div v-else style="display: flex;width: 100%;justify-content: center;">
            <el-empty :image-size="200"></el-empty>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import EChartsComponent from "@/components/EchartsComponent";
import DropDownMenu from "@/components/DropDownMenu";
import ResourceUpload from "@/components/ResourceUpload";
import ImageCard from "@/components/ImageCard";

export default {
  name: 'ResourceView',
  components: {ImageCard, ResourceUpload, DropDownMenu, EChartsComponent},
  props: {},
  data() {
    return {
      carouselItems: [],
      barChartData: {
        title: {
          text: '资源数量',
          x: 'left', // 标题位置（可选：'left', 'center', 'right'）
          y: '0%', // 标题顶部位置（百分比或像素值）
          textStyle: { // 标题文本样式
            color: '#333', // 字体颜色
            fontSize: 14, // 字体大小
            fontWeight: 'normal' // 字体粗细
          },
        },
        categories: ['图像', '视频', '音频', '文档'],
        values: [],
      },
      lineChartData: {
        title: {
          text: '各月活动资源数量',
          x: 'left', // 标题位置（可选：'left', 'center', 'right'）
          y: '0%', // 标题顶部位置（百分比或像素值）
          textStyle: { // 标题文本样式
            color: '#333', // 字体颜色
            fontSize: 14, // 字体大小
            fontWeight: 'normal' // 字体粗细
          },
        },
        categories: [],
        values: [],
      },
      menuData: [
        {icon: "el-icon-menu", label: "全部"},
        {icon: "el-icon-picture", label: "图片"},
        {icon: "el-icon-film", label: "视频"},
        {icon: "el-icon-check", label: "音频"},
        {icon: "el-icon-circle-check", label: "WORD"},
        {icon: "el-icon-circle-check", label: "EXCEL"},
        {icon: "el-icon-circle-check", label: "PPT"},
        {icon: "el-icon-circle-check", label: "PDF"}
      ],
      filterTextForActivities: '',
      filterTextForResources: '',
      filterDate: '',
      iconSize: '100px',
      resources: [],
      filterResources: [],
      idToNameForUsers: {},    // 用户ID到用户名的映射 { [id: number]: string }
      idToNameForActivities: {}, // 活动ID到活动名的映射 { [id: number]: string }
      selectedFilter: 'description',
      debounceTimer: null,
    };
  },
  /**
   * 生命周期钩子 - 组件挂载时加载数据
   */
  mounted() {
    this.fetchLatestImages();
    this.countResource();
    this.fetchResources();
    this.fetchUser();       // 新增：加载用户数据
    this.fetchActivities(); // 新增：加载活动数据
  },
  watch: {
    /**
     * 监听资源筛选关键字变化
     * 当筛选类型为'活动参与者'时进行防抖处理
     * @param {string} newVal - 新的关键字
     */
    filterTextForResources(newVal) {
      if (this.selectedFilter === 'joiner') {
        // 防抖处理：300ms 内无新输入才执行
        clearTimeout(this.debounceTimer);
        this.debounceTimer = setTimeout(() => {
          this.fetchResourcesByJoiner(newVal);
        }, 300);
      }
    },
    /**
     * 监听筛选类型变化
     * 当切换到'活动参与者'筛选时立即触发查询
     * @param {string} newVal - 新的筛选类型
     */
    selectedFilter(newVal) {
      if (newVal === 'joiner') {
        // 切换筛选类型时立即触发（可选）
        this.fetchResourcesByJoiner(this.filterTextForResources);
      }
    }
  },
  computed: {
    filterPlaceholder() {
      switch (this.selectedFilter) {
        case 'description':
          return '描述或类型';
        case 'uploader':
          return '用户名'
        case 'joiner' :
          return '活动参与者'
        case 'activity':
          return '活动名称';
        default:
          return '关键字';
      }
    },
    filteredResources() {
      let filtered = this.filterResources;

      // 关键词筛选（仅处理非 joiner 的本地过滤）
      if (this.filterTextForResources) {
        const keyword = this.filterTextForResources.toLowerCase();
        switch (this.selectedFilter) {
          case 'description':
            filtered = filtered.filter(resource =>
                resource.name.toLowerCase().includes(keyword));
            break;
          case 'uploader':
            filtered = filtered.filter(resource => {
              const userName = this.idToNameForUsers[resource.uid]?.toLowerCase() || '';
              return userName.includes(keyword);
            });
            break;
          case 'activity':
            filtered = filtered.filter(resource => {
              const activityName = this.idToNameForActivities[resource.acid]?.toLowerCase() || '';
              return activityName.includes(keyword);
            });
            break;
        }
      }

      // 日期筛选
      if (this.filterDate) {
        const filterDatePart = this.filterDate.split('T')[0];
        filtered = filtered.filter(resource => {
          if (!resource.savetime) return false;
          const resourceDay = resource.savetime.split(' ')[0];
          return resourceDay === filterDatePart;
        });
      }

      return filtered;
    }
  },
  methods: {
    /**
     * 根据活动参与者获取资源
     * @param {string} keyword - 参与者关键字
     */
    async fetchResourcesByJoiner(keyword) {
      try {
        const res = await this.$request.get('/resource/selectByJoiner', {
          params: {joiner: keyword}
        });
        if (res.code === '200') {
          // 直接更新 filterResources，而非返回数据
          this.filterResources = res.data;
        } else {
          this.$message.error(res.msg);
        }
      } catch (error) {
        console.error('活动参与者资源加载失败', error);
      }
    },
    /**
     * 获取最新图片
     * 加载轮播图所需的最新活动图片
     */
    fetchLatestImages() {
      this.$request.get('/resource/selectLatestImages').then(
          res => {
            if (res.code === '200') {
              this.carouselItems = res.data;
            } else {
              this.$message.error(res.msg);
            }
          }
      ).catch((error) => {
        console.error('资源加载失败', error);
      })
    },
    /**
     * 统计资源数据
     */
    countResource() {
      this.countByType();
      this.countByActivityDate();
    },
    /**
     * 按类型统计资源
     */
    countByType() {
      this.$request.get('/resource/count').then(
          res => {
            if (res.code === '200') {
              const {imageAmount, videoAmount, audioAmount, fileAmount} = res.data;
              this.barChartData.values = [imageAmount, videoAmount, audioAmount, fileAmount];
            } else {
              this.$message.error(res.msg);
            }
          }
      ).catch((error) => {
        console.error('资源加载失败', error);
      })
    },
    /**
     * 按活动日期统计资源
     */
    countByActivityDate() {
      this.$request.get('/resource/countEachMonth').then(
          res => {
            if (res.code === '200') {
              this.lineChartData.categories = [];
              this.lineChartData.values = [];

              for (const [yearMonth, count] of Object.entries(res.data)) {
                // 将年月添加到 categories 数组
                this.lineChartData.categories.push(yearMonth);
                // 将对应的数量添加到 values 数组
                this.lineChartData.values.push(count);
              }
              // 对 categories 和 values 按照年月排序
              const sortedIndices = this.lineChartData.categories
                  .map((_, index) => index)
                  .sort((a, b) => {
                    return this.lineChartData.categories[a].localeCompare(this.lineChartData.categories[b]);
                  });

              this.lineChartData.categories = sortedIndices.map(
                  index => this.lineChartData.categories[index]
              );
              this.lineChartData.values = sortedIndices.map(
                  index => this.lineChartData.values[index]
              );
            } else {
              this.$message.error(res.msg);
            }
          }
      ).catch((error) => {
        console.error('资源加载失败', error);
      })
    },
    /**
     * 获取用户列表
     * 构建ID到姓名的映射
     */
    fetchUser() {
      this.$request.get('/user/selectAll').then(res => {
        if (res.code === '200') {
          // 构建用户ID到用户名的映射
          this.idToNameForUsers = res.data.reduce((map, user) => {
            map[user.id] = user.uname;
            return map;
          }, {});
        }
      }).catch(error => {
        console.error('用户数据加载失败', error);
      });
    },
    /**
     * 获取活动列表
     * 构建ID到活动名的映射
     */
    fetchActivities() {
      this.$request.get('/activity/selectAll').then(res => {
        if (res.code === '200') {
          // 构建活动ID到活动名的映射
          this.idToNameForActivities = res.data.reduce((map, activity) => {
            map[activity.id] = activity.name;
            return map;
          }, {});
        }
      }).catch(error => {
        console.error('活动数据加载失败', error);
      });
    },
    /**
     * 获取所有资源
     */
    fetchResources() {
      this.$request.get('/resource/selectAll').then(
          res => {
            if (res.code === '200') {
              this.resources = res.data;
              this.filterResources = this.resources; // 初始化 filterResources
            } else {
              this.$message.error(res.msg);
            }
          }
      ).catch((error) => {
        console.error('资源加载失败', error);
      })
    },
    /**
     * 按类型筛选资源
     * @param {number} documentType - 文档类型(0表示全部)
     */
    filterType(documentType) {
      if (documentType === 0) {
        this.filterResources = this.resources;
      } else {
        this.filterResources = this.resources.filter(resource => {
          return resource.type === documentType;
        });
      }
    },
  },
};
</script>
<style>
.txt {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  font-size: 110%;
  color: #fff;
  height: 56px;
  line-height: 56px;
  -o-text-overflow: ellipsis;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  padding-right: 56px;
  padding-left: 12px;
  background: url(../../assets/img/p6.png);
  z-index: 1;
}

.img {
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
  position: relative; /* 确保 .txt 可以相对于 .img 定位 */
  /* 你可以添加其他样式，比如 background-color: rgba(0,0,0,0.5); 用于调试 */
}
</style>
<style lang="css" scoped>
.mt-23 {
  margin-top: 1.44rem;
}

.ml-59 {
  margin-left: 3.69rem;
}

.font {
  font-size: 0.94rem;
  font-family: SourceHanSansCN;
  line-height: 0.86rem;
  color: #000000;
}

.section_3 {
  padding: 0 3.19rem 1.94rem;
  background-color: #eef1f6;
  overflow: auto;
  height: 48.5rem;
}

.group {
  padding: 1.75rem 0 0;
}

.section_4 {
  padding: 1.25rem 1.75rem 1.63rem;
  background-color: #ffffff;
  border-radius: 0.88rem;
  height: 14.13rem;
}

.font_3 {
  font-size: 1.13rem;
  font-family: SourceHanSansCN;
  line-height: 1.04rem;
  color: #000000;
}

.text_4 {
  line-height: 1.04rem;
}

.group_3 {
  /*padding: 1.13rem 0;*/
}

.section_5 {
  padding: 1.25rem 1.75rem 0.94rem;
  background-color: #ffffff;
  border-radius: 0.88rem;
  height: 14.13rem;
}

.text_5 {
  line-height: 1.04rem;
}

.section_6 {
  margin-left: 0.25rem;
  padding-left: 1.75rem;
  /*padding-top: 1.5rem;*/
  background-color: rgba(255, 255, 255, 0);
  width: 15.81rem;
}

.group_4 {
  flex-direction: row;
}

.section_8 {
  padding: 1.25rem 1.13rem 1rem;
  background-color: #ffffff;
  border-radius: 0.88rem;
  overflow-x: hidden;
}

.text-wrapper_2 {
  padding: 0 0 21.88rem;
  width: 27.94rem;
  height: 23.56rem;
}

.text_10 {
  margin-left: 1.25rem;
  width: 100%;
}

.text-wrapper_3 {
  padding: 0.88rem 0 21.88rem;
  height: 23.56rem;
}

.text_11 {
  margin-left: 1.25rem;
  line-height: 0.86rem;
}
</style>