<template>
  <div style="display: flex; flex-direction: column; flex-grow: 1;padding: 1vh;background-color: rgb(238, 241, 246);
  align-items: center;justify-content: center">
    <div class="container"
         style="padding-left: 70px;height: 200px;width: 90%;display: flex;align-items: center; justify-content: space-between;"> <!-- 修改为space-between布局 -->
      <!-- 左侧原有信息 -->
      <div style="display: flex; align-items: center;">
        <div class="avatar-container" style="cursor: pointer" @click="editAvatar">
          <el-tooltip content="更换头像" effect="light">
            <el-avatar :size="100" :src="user.avatar" style="margin-right: 30px"></el-avatar>
          </el-tooltip>
        </div>
        <div>
          <div class="username-container">
            <h2>{{ user.username || user.uname }}</h2>
            <el-tooltip content="修改名称" effect="light">
              <div class="overlay" @click="editUsername"><i class="el-icon-edit"></i></div>
            </el-tooltip>
          </div>
          <div><h1>{{ (user.branchName || '') + '  ' + user.groupName }}</h1></div>
        </div>
      </div>

      <!-- 新增支部统计 -->
      <div class="branch-stats-container" style="width: 50%; padding-right: 50px;">
        <div class="container" style="height: 150px; flex-direction: column">
          <div class="container-header"><h3>支部文章统计</h3></div>
          <div class="container-body">
            <div style="display: flex; justify-content: space-between; width: 100%">
              <div
                  v-for="branch in sortedBranches"
                  :key="branch.bid"
                  style="text-align: center; width: 25%"
              >
                <label style="font-size: 30px;font-weight: bold">{{ branch.count }}</label>
                <div style="font-size: 14px; margin-top: 8px">{{ branch.name }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div style="width: 90%;display:flex;">
      <div class="container" style="width: 49%;height: 150px;margin-right: 27px;flex-direction: column">
        <div class="container-header"><h3>账号信息</h3>
          <div>
            <el-link @click="editAccount">修改<i class="el-icon-arrow-right"></i></el-link>
          </div>
        </div>
        <div class="container-body">
          <div style="width: 80%">
            <div style="display: flex;flex-direction: column">
              <label>用户名：{{ user.uname }}</label>
              <label>密码：************</label>
            </div>
          </div>
        </div>
      </div>
      <div class="container" style="width: 49%;height: 150px">
        <div class="container-header"><h3>科室</h3>
        </div>
        <div class="container-body">
          <div style="display: flex;flex-direction: column;width: 80%">
            <div><label>{{ (user.sectorName || '') + ' ' }}</label>
              <label>{{ ' ' + user.departName }}</label></div>
          </div>
        </div>
      </div>
    </div>
    <div style="width: 90%;display:flex;">
      <div class="container" style="width: 24%;height: 250px;margin-right: 21px;flex-direction: column">
        <div class="container-header"><h3>积分</h3>
          <div>
            <el-link>详情<i class="el-icon-arrow-right"></i></el-link>
          </div>
        </div>
        <div class="container-body">
          <div style="display: flex;flex-direction: column;width: 80%">
            <div><label style="font-size: 30px;font-weight: bold">{{ user.points }}</label>分</div>
          </div>
        </div>
      </div>
      <!-- 新增发布文章统计 -->
      <div class="container" style="width: 35%;height: 250px;margin-right: 20px;flex-direction: column">
        <div class="container-header"><h3>发布文章统计</h3>
<!--          <div>-->
<!--            <el-link>详情<i class="el-icon-arrow-right"></i></el-link>-->
<!--          </div>-->
          <el-date-picker
              v-model="dateRange"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="yyyy-MM-dd"
              @change="filterArticles"
              style="width: 100%">
          </el-date-picker>
        </div>
        <div class="container-body">
          <div style="display: flex;flex-direction: column;width: 80%">
            <div><label style="font-size: 30px;font-weight: bold">{{ filteredCount }}</label>篇</div>
          </div>
        </div>
      </div>
      <div class="container" style="width: 38%;height: 250px;flex-direction: column">
        <div class="container-header"><h3>活动</h3>
          <div>
            <el-link @click="$router.push('/ResourceView')">详情<i class="el-icon-arrow-right"></i></el-link>
          </div>
        </div>
        <div class="container-body">
          <div style="display: flex;justify-content:space-between; width: 80%">
            <div><label class="number-label" style="font-size: 30px;font-weight: bold">{{ user.points }}</label>分</div>
            <div><label style="font-size: 30px;font-weight: bold">{{ user.points }}</label>分</div>
            <div><label style="font-size: 30px;font-weight: bold">{{ user.points }}</label>分</div>
            <div><label style="font-size: 30px;font-weight: bold">{{ user.points }}</label>分</div>
          </div>
        </div>
      </div>
    </div>
    <el-dialog
        :before-close="handleClose"
        :destroy-on-close="true"
        :visible.sync="dialogVisible_editAvatar"
        title="更换头像"
        width="30%">
      <div style="margin: 10px 0; display:flex;flex-direction: column;justify-content: center;align-items: center;">
        <single-image-uploader @updateQuery="updateAvatar"></single-image-uploader>
      </div>
    </el-dialog>
    <el-dialog
        :before-close="handleClose"
        :destroy-on-close="true"
        :visible.sync="dialogVisible_editAccount"
        title="修改账号信息"
        width="30%">
      <div style="margin: 10px 0; display:flex;flex-direction: column;justify-content: center;align-items: center;">
        <el-form ref="account" :model="account" label-width="80px" size="mini">
          <el-form-item label="用户名">
            <el-input v-model="account.uname"></el-input>
          </el-form-item>
          <el-form-item label="密码">
            <el-input v-model="account.psw" show-password></el-input>
          </el-form-item>
          <el-form-item size="large">
            <el-button type="primary" @click="updateAccount">修改</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import SingleImageUploader from "@/components/SingleImageUploader.vue";

export default {
  name: "UserInfo",
  components: {SingleImageUploader},
  data() {
    return {
      user: JSON.parse(localStorage.getItem("current-user") || '{}'),
      dialogVisible_editAvatar: false,
      dialogVisible_editAccount: false,
      account: {uname: '', psw: ''},
      dateRange: [],
      allArticles: [],    // 存储所有文章数据
      filteredCount: 0,// 新增文章统计字段
      branchStats: [], // 初始化为空数组
      allBranchArticles: []
    }
  },
  computed: {
    sortedBranches() {
      // 从所有文章中提取唯一支部信息
        // 修复1：使用新的数据源allBranchArticles
        const branchMap = this.allBranchArticles.reduce((acc, article) => {
          const bid = this.safeParseBid(article.bid)
          acc[bid] = {
            bid: bid,
            name: article.name,
            count: 0
          }
          return acc
        }, {})

      // 合并统计数量
        this.branchStats.forEach(stat => {
          const bid = this.safeParseBid(stat.bid)
          if (branchMap[bid]) {
            branchMap[bid].count = stat.count
          } else {
            branchMap[bid] = {
              bid: bid,
              name: stat.name || `支部${bid}`,
              count: stat.count
            }
          }
        })

      // 转换为数组并按bid升序排序
        const sorted = Object.values(branchMap)
            .sort((a, b) => a.bid - b.bid)
            .filter(b => b.bid > 0) // 过滤无效数据

      // 确保始终返回4个元素
        const filled = []
        for (let i = 0; i < 4; i++) {
          filled.push(
              sorted[i] || {
                bid: -i-1, // 生成唯一负数ID
                name: '未配置',
                count: 0
              }
          )
        }

        return filled
      }
    },
  mounted() {
    this.loadArticles(); // 新增挂载时加载
    this.loadBranchStats();
  },
  methods: {
    safeParseBid(value) {
      const bid = Number(value)
      return Number.isInteger(bid) ? bid : 0
    },
    loadBranchStats() {
      this.$request.get('/article/selectArticleBybranch')
          .then(res => {
            if (res.code === '200') {
              this.allBranchArticles = res.data

              // 修复4：增强统计逻辑
              const stats = res.data.reduce((acc, article) => {
                const bid = this.safeParseBid(article.bid)
                if (bid > 0) { // 只统计有效bid
                  acc[bid] = (acc[bid] || 0) + 1
                }
                return acc
              }, {})

              this.branchStats = Object.entries(stats).map(([bid, count]) => ({
                bid: this.safeParseBid(bid),
                count,
                name: this.getBranchName(this.safeParseBid(bid))
              }))

              console.log('修复后的支部统计结果:', this.branchStats)
            }
          })
    },
    getBranchName(bid) {
      const validBid = this.safeParseBid(bid)
      if (validBid <= 0) return '未配置'

      const article = this.allBranchArticles.find(a =>
          this.safeParseBid(a.bid) === validBid
      )
      return article?.name || `支部${validBid}`
    },
    filterArticles() {
      if (!this.dateRange || this.dateRange.length !== 2) {
        this.filteredCount = this.allArticles.length;
        return;
      }

      const [start, end] = this.dateRange;
      const startDate = new Date(start);
      const endDate = new Date(end + ' 23:59:59');

      this.filteredCount = this.allArticles.filter(article => {
        const publishDate = new Date(article.publish_time);
        return publishDate >= startDate && publishDate <= endDate;
      }).length;
    },

    loadArticles() {
      this.$request.get(`/article/selectArticleByuid/${this.user.uid}`)
          .then(res => {
            if (res.code === '200') {
              this.allArticles = res.data;
              this.filteredCount = res.data.length;
              this.updateUserArticleCount();
            }
          })
          .catch(error => {
            console.error('获取文章数据失败:', error);
            this.$message.error('获取文章统计失败');
          });
    },

    // 更新用户数据中的统计字段
    updateUserArticleCount() {
      this.user.articleCount = this.allArticles.length;
      localStorage.setItem("current-user", JSON.stringify(this.user));
    },

    editAvatar() {
      this.dialogVisible_editAvatar = true;
    },
    editAccount() {
      this.account = {uname: this.user.uname, psw: this.user.psw}
      this.dialogVisible_editAccount = true;
    },
    editUsername() {
      this.$prompt('请输入新名称', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern: /^[\u4e00-\u9fa5]+$/,
        inputErrorMessage: '请输入中文名称'
      }).then(({value}) => {
        this.$message({
          type: 'success',
          message: '修改成功'
        });
        const user1 = {
          id: this.user.uid,
          username: value,
        }
        this.$request.put('user/updateUsername', user1).then(
            res => {
              if (res.code === '200') {
                this.user.username = value;
                localStorage.setItem("current-user", JSON.stringify(this.user));
              }
            }
        ).catch((error) => {
          console.error('数据加载出现错误:', error);
        });
      }).catch(() => {
      });
    },
    handleClose() {
      this.dialogVisible_editAvatar = false;
      this.dialogVisible_editAccount = false;
    },
    updateAvatar(avatar) {
      const user1 = {
        id: this.user.uid,
        avatar: avatar,
      }
      this.$request.put('user/updateAvatar', user1).then(
          res => {
            if (res.code === '200') {
              this.$message.success('上传成功');
              // 使用Vue.set确保响应式更新
              this.$set(this.user, 'avatar', avatar);
              localStorage.setItem("current-user", JSON.stringify(this.user));
            }
          }
      ).catch((error) => {
        console.error('数据加载出现错误:', error);
      });
    },
    updateAccount() {
      this.account.id = this.user.uid
      this.$request.put('user/updateAccount', this.account).then(
          res => {
            if (res.code === '200') {
              this.$message.success('修改成功，请重新登录');
              localStorage.removeItem('current-user');
              this.$router.push('/login');
            }
          }
      ).catch((error) => {
        console.error('更改失败', error);
      });
    },
  }
}
</script>

<style scoped>
.container {
  border-radius: 10px;
  background-color: #fbfbfb;
  margin-top: 15px;
  padding: 20px;
  display: flex;
}

.number-label {
  font-size: 30px;
  font-weight: bold;
}

.avatar-container, .username-container {
  position: relative;
  display: inline-block;
}


.container-header {
  /*flex-grow: 1;*/
  display: flex;
  justify-content: space-between;
}

.container-body {
  display: flex;
  flex-grow: 1;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-size: 16px;
}

.overlay {
  position: absolute;
  bottom: 17px;
  right: -30px;
  background-color: rgb(255 252 252 /50%); /* Semi-transparent black */
  width: 30px;
  height: 30px;
  cursor: pointer; /* Change cursor to pointer on hover */
  display: flex; /* Use flexbox for centering content */
  justify-content: center; /* Center content horizontally */
  align-items: center; /* Center content vertically */
}
.container-header {
  flex-direction: column;
  gap: 10px;
}

.el-date-editor {
  width: 100%;
}

</style>
<style>
.el-breadcrumb__inner {
  cursor: pointer;
  color: #ffd04b !important;
}

.el-breadcrumb__inner:hover {
  color: #ff3232 !important;
}

.el-descriptions__body {
  background-color: #fbfbfb !important;
}
</style>