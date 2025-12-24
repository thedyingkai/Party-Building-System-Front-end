<!--
  后台管理主页面框架
  
  @component PageView
  @description 后台管理系统的主框架，包含头部、侧边栏菜单和内容区域
  @author 党建系统开发团队
-->
<template>
  <el-container style="height: 100vh; border: 1px solid #eee">
    <!-- ==================== 顶部头部 ==================== -->
    <el-header>
      <!-- 左侧标题 -->
      <div class="header-left">智慧党建</div>
      <!-- 右侧面包屑导航和用户信息 -->
      <div class="header-right">
        <!-- 面包屑导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item
              v-for="breadCrumbItem in breadCrumbList"
              :key="breadCrumbItem.path"
              :to="breadCrumbItem.path">
            <span class="header-text">{{ breadCrumbItem.meta.title }}</span>
          </el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 用户下拉菜单 -->
        <el-dropdown>
          <span class="header-text"><i class="el-icon-setting"
                                       style="margin-right: 15px"> 你好，{{ user.username || user.uname }}</i></span>
          <el-dropdown-menu>
            <el-dropdown-item>个人信息</el-dropdown-item>
            <el-dropdown-item @click.native="goHome">首页</el-dropdown-item>
            <el-dropdown-item @click.native="logout">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </el-header>

    <el-container>
      <!-- ==================== 左侧侧边栏菜单 ==================== -->
      <el-aside class="hidden-scrollbar" style="background-color: rgb(238, 241, 246)" width="200px">
        <el-menu>
          <!-- 用户中心 -->
          <el-submenu index="1">
            <template slot="title"><i class="el-icon-message"></i>用户中心</template>
            <el-menu-item index="1-1" @click="$router.push('/home')">个人空间</el-menu-item>
            <el-menu-item index="1-2" @click="$router.push('/info')">个人信息</el-menu-item>
          </el-submenu>
          
          <!-- 信息发布 -->
          <el-submenu index="2">
            <template slot="title"><i class="el-icon-menu"></i>信息发布</template>
            <!-- 我的文章（需要编辑权限） -->
            <el-menu-item-group v-if="hasPermission(3)">
              <template slot="title">我的文章</template>
              <el-submenu index="2-1">
                <template slot="title">文章草稿</template>
                <el-menu-item index="2-1-1" @click="$router.push('/DraftList')">草稿箱</el-menu-item>
                <el-menu-item index="2-1-2" @click="$router.push('/SubmittedDraft')">提交记录</el-menu-item>
              </el-submenu>
            </el-menu-item-group>
            <!-- 评论管理 -->
            <el-submenu index="2-2">
              <template slot="title">评论</template>
              <el-menu-item index="2-2-1" @click="$router.push('/MyComments')">我的评论</el-menu-item>
              <el-menu-item index="2-2-2" @click="$router.push('/ReplyMe')">回复我的</el-menu-item>
            </el-submenu>
            <!-- 审核管理（需要审核权限） -->
            <el-menu-item-group v-if="hasPermission(2)" title="审核管理">
              <el-submenu index="2-3">
                <template slot="title">文章审核</template>
                <el-menu-item index="2-3-1" @click="$router.push('/DraftAuditList')">待审文章</el-menu-item>
                <el-menu-item index="2-3-2" @click="$router.push('/AuditRecord')">审核记录</el-menu-item>
              </el-submenu>
              <el-submenu index="2-4">
                <template slot="title">评论审核</template>
                <el-menu-item index="2-4-1" @click="$router.push('/CommentAuditList')">待审评论</el-menu-item>
              </el-submenu>
            </el-menu-item-group>
            <!-- 栏目管理（需要管理员权限） -->
            <el-menu-item-group v-if="hasPermission(1)" title="栏目管理">
              <el-menu-item index="2-5" @click="$router.push('/ColumnSet')">栏目设置</el-menu-item>
            </el-menu-item-group>
            <!-- 审核流程（需要管理员权限） -->
            <el-menu-item-group v-if="hasPermission(1)" title="审核流程">
              <el-menu-item index="2-6" @click="$router.push('/AuditProcess')">流程设置</el-menu-item>
            </el-menu-item-group>
            <!-- 轮播图管理（需要管理员权限） -->
            <el-menu-item-group v-if="hasPermission(1)" title="轮播图管理">
              <el-menu-item index="2-7" @click="$router.push('/CarouselSet')">轮播图编辑</el-menu-item>
            </el-menu-item-group>
          </el-submenu>
          
          <!-- 党建活动 -->
          <el-menu-item index="3" @click="$router.push('/ActivityManage')"><i class="el-icon-folder-opened"></i>党建活动
          </el-menu-item>
          <!-- 资源浏览 -->
          <el-menu-item index="4" @click="$router.push('/ResourceView')"><i
              class="el-icon-folder-opened"></i>资源浏览
          </el-menu-item>
          <!-- 人员管理（需要管理员权限） -->
          <el-submenu v-if="hasPermission(6)" index="5">
            <template slot="title"><i class="el-icon-user-solid"></i>人员管理</template>
            <el-menu-item index="5-1" @click="$router.push('/UserList')">人员列表</el-menu-item>
            <el-menu-item index="5-2" @click="$router.push('/BranchManage')">支部建设</el-menu-item>
            <el-menu-item index="5-3" @click="$router.push('/SectorManage')">部门管理</el-menu-item>
          </el-submenu>

          <el-submenu v-if="hasPermission(6)" index="6">
            <template slot="title"><i class="el-icon-document"></i>试题管理</template>
            <el-menu-item index="6-1" @click="$router.push('/Search')">试题搜索</el-menu-item>
            <el-menu-item index="6-2" @click="$router.push('/Choose')">试卷生成</el-menu-item>
            <el-menu-item index="6-3" @click="$router.push('/edit')">试题编辑</el-menu-item>
          </el-submenu>
          <el-submenu v-if="hasPermission(6)" index="7">
            <template slot="title"><i class="el-icon-edit"></i>理论测试</template>
            <el-menu-item index="7-1" @click="$router.push('/Papers')">参与测试</el-menu-item>
            <el-menu-item index="7-2" @click="$router.push('/SelfExam')">在线自测</el-menu-item>
          </el-submenu>
        </el-menu>

      </el-aside>

      <el-main
          style="padding: 0; display: flex; flex-direction: column; height: calc(100vh - 62px);background-color: #ffffff; flex-grow: 1;">
        <router-view>
          <slot name="table"></slot>
        </router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  name: "PageFrame",
  data() {
    return {
      // 当前登录用户信息，从localStorage中获取
      user: JSON.parse(localStorage.getItem("current-user") || '{}'),
      // 详情页路由名称
      detailPageRouteName: 'detailPage'
    };
  },
  /**
   * 组件挂载后设置页面标题
   */
  mounted() {
    document.title = '党建';
  },
  computed: {
    /**
     * 检查用户是否具有特定权限
     * @returns {Function} 接收权限索引，返回是否有权限
     */
    hasPermission() {
      return (index) => {
        return this.user.permissions && typeof this.user.permissions === 'string' && this.user.permissions[index] === '1';
      };
    },
    /**
     * 生成面包屑导航列表
     * 根据路由配置生成当前页面的导航路径
     * @returns {Array} 面包屑导航项数组
     */
    breadCrumbList() {
      const route = this.$route;
      if (route.meta && route.meta.breadcrumb) {
        return route.meta.breadcrumb.map(item => {
          return {
            path: item.path || '',
            meta: {title: item.title}
          };
        });
      }
      return this.$route.matched
          .filter(route => route.meta?.title)
          .map(route => ({
            path: this.getFullPath(route),
            meta: route.meta
          }));
    },
  },
  methods: {
    /**
     * 用户退出登录
     * 清除本地存储的用户信息并跳转到登录页
     */
    logout() {
      localStorage.removeItem('current-user');
      this.$router.push('/login');
    },
    /**
     * 跳转到首页
     */
    goHome() {
      this.$router.push('/public');
    },
    /**
     * 获取路由的完整路径
     * @param {Object} route - 路由对象
     * @returns {String} 完整路径
     */
    getFullPath(route) {
      if (!route.parent) return route.path;
      return route.path.startsWith('/')
          ? route.path
          : `${this.getFullPath(route.parent)}/${route.path}`;
    }
  },
  watch: {
    /**
     * 监听路由变化
     * 当路由改变时更新详情页路由名称
     * @param {Object} to - 目标路由对象
     */
    '$route'(to) {
      this.detailPageRouteName = to.name || 'detailPage'; // 当路由变化时，更新detailPageRouteName
    }
  }
};
</script>

<style scoped>
.el-header {
  padding: 0;
  background-color: #d21300;
  color: #fbfbfb;
  /*line-height: 60px;*/
  display: flex; /* 设置为flex布局 */
  align-items: center; /* 在交叉轴方向居中对齐元素，确保垂直方向对齐 */
}

.header-right {
  line-height: 60px;
  display: flex; /* 设置为flex布局 */
  justify-content: space-between; /* 让元素在主轴方向两端对齐，可根据需求调整对齐方式 */
  align-items: center; /* 在交叉轴方向居中对齐元素，确保垂直方向对齐 */
  text-align: right;
  flex-grow: 1;
  font-size: 12px;
  padding-left: 10px;
}

.header-text {
  color: #fbfbfb;
}

.el-breadcrumb__separator {
  margin: 0 9px;
  font-weight: 700;
}

.el-aside {
  height: calc(100vh - 62px); /* 设置高度为视口高度，确保和整体布局高度适配 */
  overflow-y: auto; /* 当内容超出高度时，显示垂直滚动条 */
  overflow-x: hidden; /* 隐藏水平滚动条，可根据实际需求调整 */
}

.header-left {
  height: 60px;
  width: 200px;
  display: flex;
  flex-shrink: 0;
  justify-content: center;
  align-items: center;
}
/* 使面包屑可点击 */
.el-breadcrumb__inner {
  cursor: pointer;
  color: #fbfbfb !important;
}

.el-breadcrumb__inner:hover {
  color: #ffd04b !important;
}
</style>

<style>


</style>