<template>
  <div class="mock-switch-container" v-if="isDev">
    <el-tooltip :content="mockEnabled ? '当前：演示模式（Mock数据）' : '当前：真实模式（后端接口）'" placement="left">
      <div class="mock-switch-badge" :class="{ active: mockEnabled }" @click="toggleMock">
        <i :class="mockEnabled ? 'el-icon-view' : 'el-icon-connection'"></i>
        <span class="badge-text">{{ mockEnabled ? 'Mock' : '真实' }}</span>
      </div>
    </el-tooltip>
  </div>
</template>

<script>
export default {
  name: 'MockSwitch',
  data() {
    return {
      mockEnabled: false,
      isDev: process.env.NODE_ENV === 'development'
    }
  },
  mounted() {
    this.checkMockStatus()
  },
  methods: {
    checkMockStatus() {
      // 检查当前 Mock 状态（从 localStorage 读取或默认值）
      const stored = localStorage.getItem('MOCK_ENABLED')
      this.mockEnabled = stored ? stored === 'true' : true
    },
    toggleMock() {
      this.$confirm(
        this.mockEnabled 
          ? '确定要切换到真实后端模式吗？需要确保后端服务已启动。' 
          : '确定要切换到演示模式（Mock数据）吗？',
        '切换模式',
        {
          confirmButtonText: '确定切换',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).then(() => {
        this.mockEnabled = !this.mockEnabled
        localStorage.setItem('MOCK_ENABLED', this.mockEnabled.toString())
        
        this.$message({
          type: 'success',
          message: `已切换到${this.mockEnabled ? '演示模式' : '真实模式'}，页面即将刷新`,
          duration: 2000
        })
        
        // 延迟刷新，让用户看到提示
        setTimeout(() => {
          window.location.reload()
        }, 2000)
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消切换'
        })
      })
    }
  }
}
</script>

<style scoped>
.mock-switch-container {
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 9999;
}

.mock-switch-badge {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 50px;
  cursor: pointer;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
  transition: all 0.3s ease;
  font-weight: bold;
  font-size: 14px;
  user-select: none;
}

.mock-switch-badge:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.6);
}

.mock-switch-badge:active {
  transform: translateY(0);
}

.mock-switch-badge.active {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  box-shadow: 0 4px 15px rgba(245, 87, 108, 0.4);
}

.mock-switch-badge.active:hover {
  box-shadow: 0 6px 20px rgba(245, 87, 108, 0.6);
}

.mock-switch-badge i {
  font-size: 18px;
}

.badge-text {
  font-size: 13px;
  letter-spacing: 0.5px;
}

/* 脉动动画 */
.mock-switch-badge.active::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 100%;
  height: 100%;
  border-radius: 50px;
  background: rgba(245, 87, 108, 0.3);
  transform: translate(-50%, -50%);
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% {
    transform: translate(-50%, -50%) scale(1);
    opacity: 1;
  }
  100% {
    transform: translate(-50%, -50%) scale(1.3);
    opacity: 0;
  }
}
</style>
