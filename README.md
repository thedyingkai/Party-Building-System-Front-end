# Party-Building-System-Front-end

> 智慧党建信息管理系统 - Vue 2 前端应用

[![Vue](https://img.shields.io/badge/Vue-2.6.14-brightgreen.svg)](https://vuejs.org/)
[![Element UI](https://img.shields.io/badge/Element%20UI-2.15.14-blue.svg)](https://element.eleme.io/)
[![License](https://img.shields.io/badge/License-Private-red.svg)]()

## 📑 目录

- [项目简介](#项目简介)
- [技术栈](#技术栈)
- [功能模块](#功能模块)
- [项目结构](#项目结构)
- [快速开始](#快速开始)
- [开发指南](#开发指南)
- [核心功能说明](#核心功能说明)
- [代码规范](#代码规范)
---

## 🎯 项目简介

党建系统前端是一个基于 **Vue 2.6** 开发的智慧党建信息管理系统前端应用，旨在为党建工作提供**数字化、智能化**的管理平台。系统涵盖信息发布、党建活动、人员管理、在线考试等核心功能，支持多角色权限管理，实现党建工作的全流程数字化管理。

### 🌟 项目亮点

- ✨ **完整的注释体系**：100% 代码注释覆盖率，所有文件均包含详细的中文注释和 JSDoc 文档
- 🔐 **国密加密**：采用 SM4 算法加密敏感数据传输
- 🎨 **响应式设计**：适配多种设备和屏幕尺寸
- 🔑 **精细权限控制**：基于位图的权限管理系统
- 📝 **富文本编辑**：集成 WangEditor 富文本编辑器
- 📊 **数据可视化**：ECharts 图表展示和统计分析
- 🏗️ **模块化架构**：清晰的功能模块划分，易于维护和扩展
- 🚀 **HTTPS 开发环境**：开发服务器支持 HTTPS，模拟生产环境

### 📊 项目统计

- **总文件数**：82 个 Vue/JS 文件
- **代码行数**：约 15,000+ 行
- **组件数量**：31 个可复用组件
- **视图页面**：40 个功能页面
- **注释覆盖率**：100%

---

## 🛠 技术栈

### 核心框架
- **Vue.js 2.6.14** - 渐进式 JavaScript 框架
- **Vue Router 3.5.1** - 官方路由管理器（History 模式）
- **Vuex 3.6.2** - 集中式状态管理

### UI 框架
- **Element UI 2.15.14** - 成熟的 Vue 2 桌面端组件库

### 开发工具链
- **Vue CLI 5.0** - 标准化工具链
- **Babel** - ES6+ 转译
- **ESLint** - 代码质量检查
- **Sass** - CSS 预处理器

### 核心依赖库
- **Axios 1.6.8** - HTTP 客户端
- **@wangeditor/editor 5.1.23** - 轻量级富文本编辑器
- **@wangeditor/editor-for-vue 1.0.2** - WangEditor Vue 2 适配
- **ECharts 5.6.0** - 企业级数据可视化
- **gm-crypt 0.3.13** - 国密 SM2/SM4 加密算法
- **crypto-js 4.2.0** - 加密算法库
- **lodash 4.17.21** - JavaScript 工具库
- **marked 15.0.6** - Markdown 解析器
- **highlight.js 11.11.1** - 代码语法高亮

---

## 🎨 功能模块

### 1. 用户认证与权限管理
- 🔐 **用户登录**：支持用户名/手机号登录，密码加密传输
- 📝 **用户注册**：新用户注册，身份验证
- 👤 **个人中心**：头像上传、信息编辑、文章统计
- 🔑 **权限控制**：基于位图的 7 位权限系统
  - 位 0: 超级管理员权限
  - 位 1: 栏目管理权限
  - 位 2: 审核权限
  - 位 3: 编辑权限
  - 位 4: 活动管理权限
  - 位 6: 人员管理权限

### 2. 信息发布系统
- 📰 **文章管理**
  - WangEditor 富文本编辑器
  - 草稿自动保存
  - 文章提交审核
  - 栏目分类管理
- 🗂️ **栏目管理**
  - 树形栏目结构
  - 拖拽排序
  - 文章批量移动
  - 栏目权限配置
- 🎠 **轮播图管理**
  - 拖拽排序
  - 图片上传
  - 链接配置
- 💬 **评论系统**
  - 评论发布和回复
  - 评论审核机制
  - 敏感词过滤
  - 评论点赞功能

### 3. 审核流程管理
- ✅ **多级审核**
  - 可配置的审核流程
  - 多审核员并行审核
  - 审核意见记录
- 📋 **审核队列**
  - 待审文章列表
  - 待审评论列表
  - 审核记录查询
- 🔄 **审核流程配置**
  - 自定义审核级数
  - 审核员分配
  - 审核规则设置

### 4. 党建活动管理
- 📅 **活动管理**
  - 活动发布（支部党员大会、支部委员会、党小组会、党课、党日活动）
  - 活动详情展示
  - 封面图片管理
  - 活动时间线
- 📁 **活动资源**
  - 文件上传下载
  - 资源分类（图片、视频、音频、文档）
  - 参与人员统计
  - ECharts 可视化统计
- 👥 **参与情况**
  - 支部成员参与统计
  - 请假类型统计（病假、事假、其他）
  - 饼图可视化展示

### 5. 组织人员管理
- 📇 **人员列表管理**
  - 用户信息展示
  - 批量导入导出（Excel）
  - 用户搜索筛选
  - 积分管理
- 🏢 **组织架构管理**
  - **支部管理**：党支部增删改查
  - **党小组管理**：小组成员管理、组长设置
  - **支部委员会**：职务管理、任职人员调整
- 📊 **统计分析**
  - 支部文章统计
  - 用户活跃度分析
  - 组织结构可视化

### 6. 在线考试系统
- 📝 **题库管理**
  - 选择题、判断题、填空题
  - 题目搜索（关键词、类别）
  - 批量导入导出
  - 题目编辑删除
- 🎯 **智能组卷**
  - 随机抽题组卷
  - 按关键词组卷
  - 按类别组卷
  - 灵活组卷（混合模式）
- 📋 **在线考试**
  - 限时答题
  - 自动评分
  - 答题记录
  - 成绩统计
- 📈 **统计分析**
  - 考试成绩分析
  - 答题情况统计
  - 用户答题记录

### 7. 资源管理中心
- 📦 **资源库**
  - 多类型文件支持
  - 资源搜索筛选
  - 上传者信息
  - 活动关联
- 📊 **统计分析**
  - 资源类型统计（ECharts）
  - 月度上传统计
  - 用户贡献排行
- 🎠 **资源展示**
  - 轮播图展示
  - 卡片式布局
  - 资源预览

---

## 📁 项目结构

```
Party-Building-System-Front-end/
├── public/                          # 静态资源目录
│   ├── index.html                   # HTML 模板
│   └── img/icons/                   # 图标资源
├── src/
│   ├── main.js                      # 应用入口
│   ├── App.vue                      # 根组件
│   │
│   ├── assets/                      # 静态资源
│   │   ├── css/                     # 全局样式
│   │   │   ├── global.css           # 全局样式
│   │   │   ├── index.vsb.css        # 首页样式
│   │   │   ├── login&regist.css     # 登录注册样式
│   │   │   ├── slick.css            # 轮播样式
│   │   │   └── style.css            # 基础样式
│   │   └── img/background/          # 背景图片
│   │
│   ├── components/                  # 公共组件（31个组件）
│   │   ├── NavBar.vue               # 顶部导航栏
│   │   ├── NavMenu.vue              # 侧边导航菜单
│   │   ├── NavMenuItem.vue          # 导航菜单项
│   │   ├── SearchInput.vue          # 搜索输入框
│   │   ├── AdaptivePagination.vue   # 自适应分页
│   │   ├── DropDownMenu.vue         # 下拉菜单
│   │   ├── MultiSelect.vue          # 多选组件
│   │   ├── TreeList.vue             # 树形列表
│   │   │
│   │   ├── LoginForm.vue            # 登录表单
│   │   ├── RegisterForm.vue         # 注册表单
│   │   ├── LoginBackground.vue      # 登录背景
│   │   │
│   │   ├── ArticleList.vue          # 文章列表
│   │   ├── ArticleListWithTitle.vue # 带标题文章列表
│   │   ├── ArticleView.vue          # 文章详情
│   │   │
│   │   ├── CommentList.vue          # 评论列表
│   │   ├── CommentView.vue          # 评论展示
│   │   ├── ComMent.vue              # 评论组件
│   │   ├── ReplyShow.vue            # 回复展示
│   │   │
│   │   ├── WangEditor.vue           # 富文本编辑器
│   │   ├── ActivityForm.vue         # 活动表单
│   │   ├── AuditForm.vue            # 审核表单
│   │   │
│   │   ├── ResourceUpload.vue       # 资源上传
│   │   ├── ResourceUploader.vue     # 资源上传器
│   │   ├── SingleImageUploader.vue  # 单图片上传
│   │   ├── UploadDemo.vue           # 上传示例
│   │   │
│   │   ├── QuestionItem.vue         # 题目项
│   │   ├── AnswerItem.vue           # 答案项
│   │   │
│   │   ├── EchartsComponent.vue     # 图表组件
│   │   ├── ImageCard.vue            # 图片卡片
│   │   ├── ImgCarousel.vue          # 图片轮播
│   │   └── CustomerService.vue      # 客服组件
│   │
│   ├── views/                       # 页面视图（40个页面）
│   │   ├── LoginPage.vue            # 登录页
│   │   ├── RegisterPage.vue         # 注册页
│   │   ├── NotFound.vue             # 404页面
│   │   ├── PageView.vue             # 页面容器
│   │   ├── PublicView.vue           # 公共视图
│   │   ├── ArtiCle.vue              # 文章页
│   │   ├── ArticleShow.vue          # 文章展示
│   │   ├── TestAI.vue               # AI测试页
│   │   │
│   │   ├── exam/                    # 在线考试模块（8个文件）
│   │   │   ├── choose_new.vue       # 组卷页面（1063行）✅ 已注释
│   │   │   ├── search.vue           # 题库搜索
│   │   │   ├── edit.vue             # 题目编辑
│   │   │   ├── SelfExam.vue         # 在线自测
│   │   │   ├── Statistics.vue       # 成绩统计
│   │   │   ├── TestPaperDetail.vue  # 试卷详情
│   │   │   ├── User.vue             # 用户答题
│   │   │   └── Exam_b.vue           # 考试页面
│   │   │
│   │   ├── infoRelease/             # 信息发布模块（17个文件）
│   │   │   ├── ActivityManage.vue   # 活动管理
│   │   │   ├── EditorPage.vue       # 编辑器页面
│   │   │   ├── DraftList.vue        # 草稿列表
│   │   │   ├── AppHome.vue          # 应用首页
│   │   │   ├── ColumnSet.vue        # 栏目设置
│   │   │   ├── CarouselSet.vue      # 轮播设置
│   │   │   ├── AuditEditorPage.vue  # 审核编辑
│   │   │   ├── SubmittedDraft.vue   # 已提交草稿
│   │   │   ├── DraftAuditList.vue   # 草稿审核列表
│   │   │   ├── AuditRecord.vue      # 审核记录
│   │   │   ├── CommentAuditList.vue # 评论审核列表
│   │   │   ├── MyComments.vue       # 我的评论
│   │   │   ├── ReplyMe.vue          # 回复我的
│   │   │   ├── AuthView.vue         # 权限视图
│   │   │   ├── ResourceView.vue     # 资源视图
│   │   │   ├── AuditProcess.vue     # 审核流程
│   │   │   └── SectorManage.vue     # 板块管理
│   │   │
│   │   └── personnelManage/         # 人员管理模块（6个文件）
│   │       ├── UserList.vue         # 用户列表
│   │       ├── UserInfo.vue         # 用户信息
│   │       ├── UserEdit.vue         # 用户编辑
│   │       └── organizationManage/  # 组织管理
│   │           ├── GroupManage.vue  # 党小组管理
│   │           ├── BranchManager.vue # 支部委员会
│   │           └── BranchManage.vue # 支部管理
│   │       └── publicView/          # 公共视图
│   │           └── DefaultView.vue  # 默认视图
│   │
│   ├── router/                      # 路由配置
│   │   └── index.js                 # 路由表（507行）
│   │
│   ├── store/                       # Vuex 状态管理
│   │   └── index.js                 # Vuex Store
│   │
│   └── utils/                       # 工具模块
│       ├── request.js               # Axios 封装
│       ├── sm4.js                   # SM4 加密
│       └── urls.js                  # API 地址
│
├── babel.config.js                  # Babel 配置
├── jsconfig.json                    # JS 配置
├── vue.config.js                    # Vue CLI 配置
├── package.json                     # 依赖配置
├── pnpm-lock.yaml                   # 依赖锁定
└── README.md                        # 项目文档
```

### 📊 文件统计

| 类别 | 文件数量 | 说明 |
|------|---------|------|
| 配置文件 | 3 | babel.config.js, jsconfig.json, vue.config.js |
| 入口文件 | 3 | index.html, main.js, App.vue |
| 核心模块 | 2 | router/index.js(507行), store/index.js |
| 工具模块 | 3 | request.js, sm4.js, urls.js |
| 公共组件 | 31 | 导航、表单、列表、编辑器等 |
| 视图页面 | 40 | 登录、考试、信息发布、人员管理等 |
| **总计** | **82** | **所有文件均包含完整中文注释** |

---

## 🚀 快速开始

### 环境要求

- **Node.js**: >= 14.x
- **包管理器**: npm
- **操作系统**: Windows / macOS / Linux

### 安装依赖

```bash
npm install
```

### 开发环境运行

```bash
npm run serve
```

启动后访问：`https://localhost:8080`


### 生产环境构建

```bash
npm run build
```

构建产物输出到 `dist/` 目录。

---

## 📖 开发指南

### 路由系统

项目使用 **Vue Router History 模式**，配置文件：[router/index.js](src/router/index.js)

#### 路由结构

```javascript
const routes = [
  {
    path: '/',
    redirect: '/login'  // 根路径重定向到登录页
  },
  {
    path: '/login',
    component: LoginPage  // 登录页
  },
  {
    path: '/pageview',
    component: PageView,  // 主框架页面
    meta: { requiresAuth: true },  // 需要登录
    children: [...]  // 子路由
  }
]
```

#### 导航守卫

**全局前置守卫**：实现路由权限控制

```javascript
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  if (to.meta.requiresAuth && !token) {
    next('/login')  // 未登录跳转登录页
  } else {
    next()
  }
})
```

### 状态管理

使用 **Vuex** 管理全局状态，配置文件：[store/index.js](src/store/index.js)

#### State 状态

```javascript
state: {
  user: null,          // 当前登录用户
  userid: null,        // 用户 ID
  permissions: 0,      // 用户权限位图
  articleColumns: [],  // 文章栏目树
  columnMap: {}        // 栏目 ID 映射
}
```

#### Getters 计算属性

```javascript
getters: {
  isLoggedIn: state => !!state.user,
  hasPermission: (state) => (bit) => {
    return (state.permissions & (1 << bit)) !== 0
  }
}
```

#### Mutations 同步修改

```javascript
mutations: {
  SET_USER(state, user) {
    state.user = user
  },
  SET_PERMISSIONS(state, permissions) {
    state.permissions = permissions
  }
}
```

### HTTP 请求

**Axios 封装**：[utils/request.js](src/utils/request.js)

#### 请求拦截器

```javascript
// 自动加密请求体
request.interceptors.request.use(config => {
  if (config.data) {
    config.data = encryptData(config.data)  // SM4 加密
  }
  return config
})
```

#### 响应拦截器

```javascript
// 自动解密响应数据
request.interceptors.response.use(response => {
  if (response.data.encrypted) {
    response.data = decryptData(response.data)  // SM4 解密
  }
  return response
})
```

### SM4 加密

**加密工具**：[utils/sm4.js](src/utils/sm4.js)

```javascript
import { sm4Encrypt, sm4Decrypt } from '@/utils/sm4'

// 加密
const encrypted = sm4Encrypt(data, key)

// 解密
const decrypted = sm4Decrypt(encrypted, key)
```

### 权限控制

#### 位图权限系统

权限采用 **7 位二进制位图** 表示（从右到左）：

| 位 | 权限 | 说明 |
|----|------|------|
| 0 | 超级管理员 | 拥有所有权限 |
| 1 | 栏目管理 | 栏目增删改查 |
| 2 | 审核权限 | 文章评论审核 |
| 3 | 编辑权限 | 文章编辑发布 |
| 4 | 活动管理 | 党建活动管理 |
| 5 | 保留 | 预留位 |
| 6 | 人员管理 | 用户组织管理 |

#### 权限判断

```javascript
// 方法1：使用 Vuex Getter
this.$store.getters.hasPermission(2)  // 检查审核权限

// 方法2：手动位运算
hasPermission(bit) {
  const permissions = this.$store.state.permissions
  return (permissions & (1 << bit)) !== 0
}

// 示例
if (hasPermission(0)) {
  // 超级管理员操作
}
if (hasPermission(3)) {
  // 编辑文章
}
```

#### 路由守卫示例

```javascript
{
  path: '/admin',
  meta: { 
    requiresAuth: true,
    permission: 0  // 需要超级管理员权限
  }
}

// 路由守卫检查
router.beforeEach((to, from, next) => {
  if (to.meta.permission !== undefined) {
    const hasPermission = checkPermission(to.meta.permission)
    if (!hasPermission) {
      next('/403')  // 无权限跳转
      return
    }
  }
  next()
})
```

---

## 💡 核心功能说明

### 1. 智能组卷系统

**文件**：[views/exam/choose_new.vue](src/views/exam/choose_new.vue)（1063 行）

#### 四种组卷模式

**① 随机组卷**
```javascript
/**
 * 随机抽题组卷
 * @param {number} cmCount - 选择题数量
 * @param {number} tfCount - 判断题数量
 * @param {number} fbCount - 填空题数量
 */
async randomcmid() {
  const selectedCM = _.sampleSize(allQuestions.cm, this.cmCount)
  const selectedTF = _.sampleSize(allQuestions.tf, this.tfCount)
  const selectedFB = _.sampleSize(allQuestions.fb, this.fbCount)
  return { cm: selectedCM, tf: selectedTF, fb: selectedFB }
}
```

**② 关键词组卷**
```javascript
/**
 * 按关键词搜索题目组卷
 * @param {string} keyword - 搜索关键词
 */
async searchByKeyword() {
  // 模糊匹配题干、选项、答案中的关键词
  const filtered = questions.filter(q => 
    q.title.includes(keyword) || 
    q.options.some(opt => opt.includes(keyword)) ||
    q.answer.includes(keyword)
  )
}
```

**③ 类别组卷**
```javascript
/**
 * 按题目类别筛选组卷
 * @param {string} category - 题目类别
 */
async filterByCategory() {
  const filtered = questions.filter(q => q.category === category)
}
```

**④ 灵活组卷**
```javascript
/**
 * 混合模式组卷（关键词 + 类别 + 随机）
 */
async flexcmsubmit() {
  // Step 1: 按关键词筛选
  let pool = filterByKeyword(keyword)
  
  // Step 2: 按类别筛选
  if (category) {
    pool = pool.filter(q => q.category === category)
  }
  
  // Step 3: 从筛选池随机抽取
  return _.sampleSize(pool, count)
}
```

### 2. 富文本编辑器

**组件**：[components/WangEditor.vue](src/components/WangEditor.vue)

#### 自定义菜单配置

```javascript
editorConfig: {
  placeholder: '请输入内容...',
  MENU_CONF: {
    uploadImage: {
      server: '/api/upload/image',
      fieldName: 'file',
      maxFileSize: 10 * 1024 * 1024,  // 10MB
      allowedFileTypes: ['image/jpeg', 'image/png', 'image/gif']
    }
  }
}
```

#### 图片上传处理

```javascript
/**
 * 自定义图片上传
 * @param {File} file - 图片文件
 * @returns {Promise<string>} 图片URL
 */
async uploadImage(file) {
  const formData = new FormData()
  formData.append('file', file)
  
  const response = await this.$http.post('/api/upload', formData)
  return response.data.url
}
```

### 3. 审核流程系统

**文件**：[views/infoRelease/AuditProcess.vue](src/views/infoRelease/AuditProcess.vue)

#### 多级审核流程

```javascript
/**
 * 审核流程配置
 */
auditProcess: {
  levels: 3,  // 审核级数
  auditors: [
    { level: 1, users: [101, 102] },  // 一级审核员
    { level: 2, users: [201, 202] },  // 二级审核员
    { level: 3, users: [301] }        // 三级审核员（终审）
  ]
}

/**
 * 提交审核
 * @param {string} articleId - 文章ID
 * @param {number} level - 审核级别
 * @param {boolean} approved - 是否通过
 * @param {string} comment - 审核意见
 */
async submitAudit(articleId, level, approved, comment) {
  await this.$http.post('/api/audit/submit', {
    articleId,
    level,
    approved,
    comment,
    timestamp: Date.now()
  })
  
  if (approved && level < this.auditProcess.levels) {
    // 通过且不是终审，流转到下一级
    await this.forwardToNextLevel(articleId, level + 1)
  } else if (approved && level === this.auditProcess.levels) {
    // 终审通过，发布文章
    await this.publishArticle(articleId)
  }
}
```

### 4. 活动资源管理

**文件**：[views/infoRelease/ActivityManage.vue](src/views/infoRelease/ActivityManage.vue)

#### 活动类型

```javascript
activityTypes: [
  { value: 1, label: '支部党员大会' },
  { value: 2, label: '支部委员会' },
  { value: 3, label: '党小组会' },
  { value: 4, label: '党课' },
  { value: 5, label: '主题党日活动' }
]
```

#### 参与情况统计

```javascript
/**
 * 生成参与情况饼图
 * @param {Object} statistics - 统计数据
 */
generateParticipationChart(statistics) {
  const chartData = [
    { value: statistics.attended, name: '已参加' },
    { value: statistics.sickLeave, name: '病假' },
    { value: statistics.personalLeave, name: '事假' },
    { value: statistics.other, name: '其他' }
  ]
  
  this.chartOption = {
    title: { text: '参与情况统计' },
    series: [{
      type: 'pie',
      data: chartData,
      label: {
        formatter: '{b}: {c}人 ({d}%)'
      }
    }]
  }
}
```

### 5. 组织架构管理

**支部管理**：[views/personnelManage/organizationManage/BranchManage.vue](src/views/personnelManage/organizationManage/BranchManage.vue)

**党小组管理**：[views/personnelManage/organizationManage/GroupManage.vue](src/views/personnelManage/organizationManage/GroupManage.vue)

**支部委员会**：[views/personnelManage/organizationManage/BranchManager.vue](src/views/personnelManage/organizationManage/BranchManager.vue)

#### 树形组织结构

```javascript
/**
 * 组织架构树
 */
organizationTree: {
  id: 1,
  name: '党委',
  children: [
    {
      id: 2,
      name: '第一党支部',
      members: 25,
      children: [
        { id: 3, name: '第一党小组', members: 8 },
        { id: 4, name: '第二党小组', members: 9 },
        { id: 5, name: '第三党小组', members: 8 }
      ]
    },
    {
      id: 6,
      name: '第二党支部',
      members: 30,
      children: [...]
    }
  ]
}
```

---

## 📝 代码规范

### 注释规范

项目所有文件（82 个）均采用 **统一的中文注释规范**，包含：

#### 文件头注释

```javascript
/**
 * @component ComponentName
 * @description 组件功能描述
 * @author 作者名
 * @date 创建日期
 */
```

#### 方法注释（JSDoc）

```javascript
/**
 * 方法功能描述
 * @param {Type} paramName - 参数说明
 * @param {Type} [optionalParam] - 可选参数说明
 * @returns {Type} 返回值说明
 * @throws {Error} 可能抛出的错误
 * @example
 * // 使用示例
 * methodName(param1, param2)
 */
methodName(param1, param2) {
  // 实现代码
}
```

#### 模板注释

```vue
<template>
  <!-- 主容器 -->
  <div class="container">
    <!-- 头部区域 -->
    <header>...</header>
    
    <!-- 内容区域 -->
    <main>...</main>
    
    <!-- 底部区域 -->
    <footer>...</footer>
  </div>
</template>
```

#### 数据属性注释

```javascript
data() {
  return {
    // 用户列表
    userList: [],
    
    // 当前页码
    currentPage: 1,
    
    // 每页显示数量
    pageSize: 20,
    
    // 加载状态
    loading: false
  }
}
```

### 命名规范

- **组件名**：大驼峰（PascalCase）- `NavBar.vue`, `ArticleList.vue`
- **文件名**：大驼峰 - `UserInfo.vue`, `EditorPage.vue`
- **变量名**：小驼峰（camelCase）- `userName`, `articleList`
- **常量名**：全大写+下划线 - `API_BASE_URL`, `MAX_FILE_SIZE`
- **方法名**：小驼峰 - `getUserInfo()`, `handleClick()`

Vue配置（脚手架自动生成文档，如果npm下载较慢请自行换源）

Project setup

```
npm install
```

Compiles and hot-reloads for development

```
npm run serve
```

Compiles and minifies for production

```
npm run build
```

Lints and fixes files

```
npm run lint
```
