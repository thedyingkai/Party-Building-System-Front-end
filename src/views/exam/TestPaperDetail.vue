<!--
/**
 * @component TestPaperDetail
 * @description 试卷列表管理 - 展示所有试卷,支持搜索、排序、查看统计和参与答题
 * @author Party Building System
 */
-->
<template>
  <!-- 试卷列表容器 -->
  <div class="testpaper-container">
    <el-card class="testpaper-card">
      <div >
        <div class="header-top">
          <h2>试卷列表</h2>
          <div class="header-controls">
            <el-input
                placeholder="请输入问卷名进行搜索..."
                style="width: 200px; margin-right: 10px"
            />
            <el-select v-model="sortType" placeholder="时间倒序">
              <el-option label="时间倒序" value="desc" />
            </el-select>
          </div>
        </div>
      </div>
      <div class="testpaper-list">
        <div v-for="paper in testPapers" :key="paper.test_paper_id" class="paper-item">
          <div class="paper-content">
            <div class="paper-info">
              <div class="paper-title">{{ paper.paper_description }}</div>
              <div class="paper-meta">
                <span class="meta-item"><i class="el-icon-coin"></i> {{ paper.points_reward }}积分</span>
                <span class="meta-item"><i class="el-icon-time"></i> 截止：{{ paper.deadline }}</span>
              </div>
            </div>
            <div class="paper-actions">
              <div class="status-info">
                <span class="status-tag">未发布</span>
                <span class="response-count">答卷:59</span>
                <span class="update-time">2024/7/10 14:44</span>
              </div>
              <div class="action-buttons">
                <el-button type="text" @click="handlePaperClicktoS(paper.test_paper_id)">查看</el-button>
                <el-button type="text" @click="handlePaperClick(paper.test_paper_id)">参与</el-button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
import request from "@/utils/request";

export default {
  /**
   * @description 组件数据
   * @returns {Object} 包含排序类型和试卷列表
   */
  data() {
    return {
      sortType: 'desc',
      testPapers: [] // 保持与后端一致的字段名
    };
  },
  methods: {
    /**
     * @description 获取所有试卷列表
     */
    fetchTestPapers() {
      request.get("/papers").then((res) => {
        this.testPapers = res.data;
      });
    },
    /**
     * @description 跳转到答题页面
     * @param {Number} id - 试卷ID
     */
    handlePaperClick(id) {
      this.$router.push({ path: "/Exam", query: { id } });
    },
    /**
     * @description 跳转到统计页面
     * @param {Number} id - 试卷ID
     */
    handlePaperClicktoS(id) {
      this.$router.push({ path: "/Statistics", query: { id } });
    },
  },
  created() {
    this.fetchTestPapers();
  }
};
</script>

<style scoped>
/* 保持原有样式不变 */
.testpaper-container {
  padding: 20px;
  background-color: #f5f6f7;
  min-height: 100vh;
}

.testpaper-card {
  border-radius: 4px;
  box-shadow: 0 1px 3px rgba(0,0,0,.1);
  min-height: 600px;
}

.header-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding: 0 20px;
}

.header-controls {
  display: flex;
  align-items: center;
}

.paper-item {
  border-bottom: 1px solid #ebeef5;
  padding: 16px 20px;
  transition: background-color 0.3s;
}

.paper-item:hover {
  background-color: #f8f9fa;
}

.paper-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.paper-info {
  flex: 1;
}

.paper-title {
  font-size: 14px;
  color: #303133;
  margin-bottom: 8px;
  font-weight: 500;
}

.paper-meta {
  display: flex;
  align-items: center;
  gap: 20px;
}

.meta-item {
  font-size: 12px;
  color: #606266;
  display: flex;
  align-items: center;
  gap: 4px;
}

.paper-actions {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 8px;
}

.status-info {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 12px;
  color: #909399;
}

.status-tag {
  background: #f0f2f5;
  color: #606266;
  padding: 2px 6px;
  border-radius: 3px;
}

.response-count {
  color: #409eff;
}

.action-buttons {
  display: flex;
  align-items: center;
  gap: 4px;
}

.el-button--text {
  padding: 4px 8px;
  color: #606266;
}

.el-button--text:hover {
  color: #409eff;
  background: #f5f7fa;
}
</style>