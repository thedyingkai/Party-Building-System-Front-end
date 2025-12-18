<template>
  <div style="flex-grow: 1;display: flex">
    <div v-if="isMenu" ref="tabsContentRef" style="flex-grow: 1">
      <el-tabs v-model="typeIndex" style="height: calc(100vh - 150px)" type="border-card" @tab-click="handleClick">
        <el-tab-pane v-for="type in activityTypes" :key="type.id" :label="type.name" style="height: 100%">
          <div class="menu" style="display: flex; justify-content: space-between; padding: 15px;">
            <div class="addActivity">
              <el-button v-if="hasPermission(4)" type="primary" @click="addActivity">新增活动</el-button>
            </div>
            <div style="display: flex; align-items: center">
              <el-date-picker
                  v-model="selectedMonth"
                  placeholder="根据活动月份筛选"
                  style="margin-left: 15px"
                  type="month">
              </el-date-picker>
              <div class="input-container">
                <el-input v-model="filterText" placeholder="输入关键字进行过滤"></el-input>
              </div>
            </div>
          </div>
          <div v-if="!sortedGroupedActivities.length" v-loading="loading"
               style="display: flex;flex-grow: 1;justify-content: center;">
            <el-empty :image-size="200"></el-empty>
          </div>
          <div v-else v-loading="loading" class="image-card-container" style="height: 100%;">
            <div v-for="(item, index) in sortedGroupedActivities" :key="index"
                 style="display: flex; flex-direction: column">
              <h2 style="width: 100%;">{{ item.year }}年</h2>
              <div v-for="monthData in item.data" :key="monthData.monthYear" style="display: flex">
                <div style="width: 50px;margin: 10px 0 10px 10px;">
                  <h3>{{ getMonthYearName(monthData.monthYear).split('年')[1] }}</h3>
                </div>
                <div style="display: flex;flex-wrap: wrap;">
                  <image-card v-for="activity in monthData.activities" :id="activity.id" :key="activity.id"
                              :max-width="maxWidth" :sub-title="activity.time" :title="activity.name"
                              :url="activity.cover_image"
                              style="margin: 15px" @image-clicked="visitActivity"></image-card>
                </div>
              </div>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
    <div v-if="!isMenu" style="flex-grow: 1;display: flex; flex-direction: column">
      <div style="width: 100%;height:60%;padding: 20px;border-bottom:10px solid rgb(238 241 246);display: flex;
      flex-direction: column;justify-content: space-between;">
        <div>
          <el-page-header :content=currentActivity.name @back="goBack"></el-page-header>
          <div style="display: flex;flex-direction: column;align-items: center;margin-top: 10px;">
            <div class="image-with-overlay-container">
              <el-image :src="currentActivity.cover_image" style="max-height: 200px;" fit="contain">
              </el-image>
              <el-tooltip effect="light">
                <div slot="content">修改活动封面图片</div>
                <div class="overlay" @click="editCover"><i class="el-icon-edit"></i></div>
              </el-tooltip>
            </div>
            <div style="width: 80%;margin-top: 10px">
              <p><label style="font-weight: bold">时间：</label>{{ currentActivity.time }}</p>
              <div class="flex-row justify-between">
                <div>
                  <p><label style="font-weight: bold">主持人：</label>{{ currentActivity.username }}</p>
                  <p><label style="font-weight: bold">支部成员参与情况：</label></p>
                  <e-charts-component :chartData="pieChartData" :chartType="'pie'" :height="'10rem'"
                                      :width="'16rem'"></e-charts-component>
                </div>
              </div>
              <label style="font-weight: bold">活动内容：</label>
              <div v-html="formatContent(currentActivity.content)"></div>
            </div>
          </div>
        </div>
        <div style="display: flex;justify-content: center;">
          <el-button v-if="hasPermission(4)" type="primary" @click="editActivity">修改活动信息</el-button>
        </div>
      </div>
      <div class="resources-container" style="flex-grow: 1;width: 100%;height:40%;">
        <div style="padding: 10px;display: flex;flex-direction: column">
          <div class="menu"
               style="display: flex;justify-content: space-between;padding: 15px;">
            <div style="display: flex;justify-content: space-between;align-items: center">
              <h1 style="margin-right: 15px">活动资源</h1>
              <el-button size="middle" type="primary" @click="dialogVisible=true"><i class="el-icon-upload"></i>上传文件
              </el-button>
            </div>
            <div style="display: flex;align-items: center">
              <div class="click-able" style="margin-right: 15px" @click="filterMine=!filterMine">
                <span v-if="!filterMine"> 我上传的</span>
                <span v-else>查看全部</span>
              </div>
              <div class="input-container">
                <el-input
                    v-model="filterTextForActivities"
                    placeholder="输入关键字进行过滤">
                </el-input>
              </div>
              <drop-down-menu :menu-items="menuData" @filterType="filterType"></drop-down-menu>
            </div>
          </div>
        </div>
        <div v-if="filterMyResources.length>0" class="image-card-container resources"
             style="padding: 10px;flex-direction: row">
          <image-card v-for="resource in filterMyResources" :id="resource.id" :key="resource.id"
                      :description="resource.description" :max-height="iconSize" :max-width="iconSize"
                      :title="resource.name" :url="resource.content" show-type="resource"
                      total-height=120px
          ></image-card>
        </div>
        <div v-else style="display: flex;flex-grow: 1;justify-content: center;">
          <el-empty :image-size="200"></el-empty>
        </div>
      </div>
    </div>
    <el-dialog
        :before-close="handleClose"
        :destroy-on-close="true"
        :visible.sync="dialogVisible"
        title="文件上传"
        width="30%">
      <div style="margin: 10px 0; display:flex;flex-direction: column;justify-content: center;align-items: center;">
        <div style="display: flex;width: 360px;margin-bottom: 10px;flex-direction: column">
          <label>上传资源到活动：{{ currentActivity.name }}</label>
        </div>
        <resource-uploader :acid="currentActivity.id" @visitActivity="visitActivity"></resource-uploader>
      </div>
    </el-dialog>
    <el-dialog
        :before-close="handleClose"
        :destroy-on-close="true"
        :visible.sync="dialogVisible_editCover"
        title="活动封面更改"
        width="30%">
      <div style="margin: 10px 0; display:flex;flex-direction: column;justify-content: center;align-items: center;">
        <div style="display: flex;width: 360px;margin-bottom: 10px;flex-direction: column">
          <label>更改活动{{ currentActivity.name }}封面</label>
        </div>
        <single-image-uploader @updateQuery="updateCover"></single-image-uploader>
      </div>
    </el-dialog>
    <el-dialog
        :before-close="handleClose"
        :title="dialogTitle"
        :visible.sync="dialogVisible_add"
        width="80%">
      <div style="margin: 10px 0; display:flex;flex-direction: column;justify-content: center;align-items: center;">
        <activity-form :activity-types="activityTypes" :add-type="dialogTitle === '新增活动'"
                       :dialog-title="dialogTitle"
                       :gid="user.gid" :old-data="currentActivity"
                       @ActivityAdded="handleClose"></activity-form>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import ImageCard from "@/components/ImageCard";
import DropDownMenu from "@/components/DropDownMenu";
import ActivityForm from "@/components/ActivityForm";
import ResourceUploader from "@/components/ResourceUploader";
import SingleImageUploader from "@/components/SingleImageUploader";
import EChartsComponent from "@/components/EchartsComponent";

export default {
  name: 'ActivityManage',
  components: {EChartsComponent, SingleImageUploader, ResourceUploader, ActivityForm, DropDownMenu, ImageCard},
  data() {
    return {
      user: JSON.parse(localStorage.getItem("current-user") || '{}'),
      activityTypes: [
        {id: 1, name: '支部党员大会',},
        {id: 2, name: '支部委员会',},
        {id: 3, name: '党小组会',},
        {id: 4, name: '党课',},
        {id: 5, name: '党日活动',},
      ],
      selectedMonth: null,
      dialogVisible: false,
      dialogVisible_add: false,
      dialogVisible_editCover: false,
      activities: [],
      resources: [],
      dialogTitle: '',
      filterText: '',
      filterTextForActivities: '',
      filterResources: [],
      maxWidth: '260px',
      iconSize: '100px',
      filterMine: false,
      typeIndex: 0,
      isMenu: true,
      loading: true,
      currentActivity: {},
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
      pieChartData: {
        series: [
          {
            label: {show: false,},
            // name: '参与情况',
            type: 'pie',
            data: [
              {value: 10, name: '参与'},
              {value: 20, name: '病假'},
              {value: 15, name: '事假'},
              {value: 30, name: '其他'},
            ],
          },
        ],
      },
    }
  },
  mounted() {
    this.selectActivitiesOfType(this.activityTypes[this.typeIndex].id);
    const tabsContent = this.$refs.tabsContentRef.querySelector('.el-tabs__content');
    if (tabsContent) {
      tabsContent.classList.add('hidden-scrollbar');
    }
  },
  computed: {
    hasPermission() {
      return (index) => {
        return this.user.permissions && typeof this.user.permissions === 'string' && this.user.permissions[index] === '1';
      };
    },
    filteredActivities() {
      let filtered = this.activities;
      if (this.filterText) {
        filtered = filtered.filter(row => {
          return row.name.toLowerCase().includes(this.filterText.toLowerCase());
        });
      }
      if (this.selectedMonth) {
        const selectedYear = this.selectedMonth.getFullYear();
        const selectedMonth = this.selectedMonth.getMonth();
        filtered = filtered.filter(activity => {
          const date = new Date(activity.time);
          return date.getFullYear() === selectedYear && date.getMonth() === selectedMonth;
        });
      }
      return filtered;
    },
    filteredResources() {
      if (this.filterTextForActivities === '') {
        return this.filterResources;
      } else {
        return this.filterResources.filter(row => {
          return row.name.toLowerCase().includes(this.filterTextForActivities.toLowerCase());
        });
      }
    },
    filterMyResources() {
      if (!this.filterMine) {
        return this.filteredResources;
      } else {
        return this.filteredResources.filter(item => {
          if (item.uid === this.user.uid) return item;
        })
      }
    },
    groupedActivities() {
      const yearMap = {};
      this.filteredActivities.forEach(activity => {
        const date = new Date(activity.time);
        const month = date.getMonth();
        const year = date.getFullYear();
        if (!yearMap[year]) {
          yearMap[year] = [];
        }
        const monthYear = `${year}-${month}`;
        if (!yearMap[year].find(y => y.monthYear === monthYear)) {
          yearMap[year].push({monthYear, activities: []});
        }
        const targetMonth = yearMap[year].find(y => y.monthYear === monthYear);
        targetMonth.activities.push(activity);
      });
      const result = {};
      Object.keys(yearMap).forEach(year => {
        result[year] = yearMap[year];
      });
      return result;
    },
    sortedGroupedActivities() {
      const entries = Object.entries(this.groupedActivities)
          .map(([yearStr, value]) => ({year: parseInt(yearStr, 10), value}));
      entries.sort((a, b) => b.year - a.year);
      const sortedResult = [];
      entries.forEach(entry => {
        sortedResult.push({year: entry.year, data: entry.value});
      });
      return sortedResult;
    }
  },
  methods: {
    formatContent(content) {
      return content.replace(/\n/g, '<br>');
    },
    getMonthYearName(monthYear) {
      const [year, month] = monthYear.split('-');
      const months = ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'];
      return `${year}年${months[parseInt(month)]}`;
    },
    updateCover(url) {
      let activity = {
        id: this.currentActivity.id,
        cover_image: url,
      };
      this.$request.put('activity/updateCoverImage', activity).then(
          res => {
            if (res.code === '200') {
              this.$message.success('上传成功');
              this.visitActivity(this.currentActivity.id);
            }
          }
      ).catch((error) => {
        console.error('数据加载出现错误:', error);
      });
    },
    handleClose() {
      this.dialogVisible = false;
      this.dialogVisible_editCover = false;
      this.dialogVisible_add = false;
      if (this.isMenu)
        this.selectActivitiesOfType(this.activityTypes[this.typeIndex].id);
    },
    goBack() {
      this.currentActivity = {};
      this.selectActivitiesOfType(this.activityTypes[this.typeIndex].id);
      this.filterMine = false;
    },
    handleClick() {
      this.loading = true;
      this.selectActivitiesOfType(this.activityTypes[this.typeIndex].id);
    },
    selectActivitiesOfType(typeId) {
      this.loading = true;
      this.$request.get('/activity/selectByTypeId', {params: {typeId: typeId, uid: this.user.uid}}).then(
          res => {
            if (res.code === '200') {
              this.selectedMonth = null;
              this.activities = res.data;
              // 对活动列表按时间倒序排序，时间晚的排在前面
              this.activities.sort((a, b) => new Date(b.time) - new Date(a.time));
              this.activities.forEach(item => {
                item.time = item.time.slice(0, 10)
              })
              this.isMenu = true;
              this.loading = false;
            } else {
              this.$message.error(res.msg);
              this.loading = false;
            }
          }
      ).catch((error) => {
        console.error('数据加载出错', error);
        this.loading = false;
      })
    },
    visitActivity(activityId) {
      this.$request.get('activity/selectById/' + activityId).then(
          res => {
            if (res.code === '200') {
              res.data.content = res.data.content || '暂无内容'
              this.currentActivity = res.data;
              const {participateCount, sickLeaveCount, personalLeaveCount, otherCount} = res.data;

              this.pieChartData.series[0].data = [
                {value: participateCount, name: '参与'},
                {value: sickLeaveCount, name: '病假'},
                {value: personalLeaveCount, name: '事假'},
                {value: otherCount, name: '其他'}
              ].filter(item => item.value > 0);
              this.isMenu = false;
            } else {
              this.$message.error(res.msg);
            }
          }
      ).catch((error) => {
        console.error('活动信息获取失败', error);
      })
      this.$request.get('/resource/selectByAcid/' + activityId).then(
          res => {
            if (res.code === '200') {
              this.resources = res.data;
              // 对资源列表按时间倒序排序，时间晚的排在前面
              this.resources.sort((a, b) => new Date(b.time) - new Date(a.time));
              this.filterResources = this.resources;
            } else {
              this.$message.error(res.msg);
            }
          }
      ).catch((error) => {
        console.error('资源加载失败', error);
      })
    },
    filterType(documentType) {
      if (documentType === 0) {
        this.filterResources = this.resources;
      } else {
        this.filterResources = this.resources.filter(resource => {
          return resource.type === documentType;
        });
      }
    },
    addActivity() {
      this.dialogTitle = '新增活动';
      this.dialogVisible_add = true;
    },
    editActivity() {
      this.dialogTitle = '修改活动信息';
      this.dialogVisible_add = true;
    },
    editCover() {
      this.dialogVisible_editCover = true;
    },
  },
}
</script>

<style>
.image-card-container {
  display: flex;
  gap: 10px;
  flex-direction: column;
}

.resources {
  flex-wrap: wrap;
}

.el-tabs--border-card > .el-tabs__content {
  height: 100%;
  overflow-y: scroll;
}

.el-tabs--border-card {
  background: #FFF;
  border: 0 solid #DCDFE6 !important;
  box-shadow: 0 0 0 0 rgba(0, 0, 0, .12), 0 0 0 0 rgba(0, 0, 0, .04) !important;
}

.image-with-overlay-container {
  width: 80%;
  position: relative;
  display: inline-block; /* Or 'block' depending on your layout needs */
}

.image-with-overlay-container .el-image {
  display: block; /* Removes bottom margin/whitespace */
  width: 100%; /* Or your desired width */
}

.overlay {
  position: absolute;
  bottom: 0px; /* Distance from the bottom */
  right: 0px; /* Distance from the right */
  background-color: rgb(255 252 252 /50%); /* Semi-transparent black */
  width: 30px;
  height: 30px;
  cursor: pointer; /* Change cursor to pointer on hover */
  display: flex; /* Use flexbox for centering content */
  justify-content: center; /* Center content horizontally */
  align-items: center; /* Center content vertically */
}

.cover-uploader {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 178px; /* 确保容器有一定的高度，以便内容居中 */
  width: 178px;
}

.cover-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  line-height: 178px;
  text-align: center;
}
</style>