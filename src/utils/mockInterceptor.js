/**
 * Mock 拦截器
 * 
 * @description 拦截 API 请求并返回模拟数据，用于前后端分离开发和演示
 * @author 党建系统开发团队
 * @date 2026-01-06
 */

import {
  mockUsers,
  mockArticles,
  mockComments,
  mockActivities,
  mockExams,
  mockQuestions,
  mockOrganizations,
  mockCarousels,
  mockStatistics,
  mockAudits,
  mockResources,
  mockNotices,
  mockDrafts,
  mockSectors
} from './mockData'

/**
 * Mock 模式开关
 * true: 使用 Mock 数据（演示模式）
 * false: 使用真实后端接口
 * 
 * 支持从 localStorage 动态读取，可通过 MockSwitch 组件切换
 */
const getStoredMockStatus = () => {
  if (typeof window !== 'undefined' && window.localStorage) {
    const stored = localStorage.getItem('MOCK_ENABLED')
    if (stored !== null) {
      return stored === 'true'
    }
  }
  return true // 默认开启 Mock 模式（演示时设置为 true）
}

export const MOCK_ENABLED = getStoredMockStatus()

/**
 * 延迟函数 - 模拟网络请求延迟
 * @param {number} ms 延迟毫秒数
 */
const delay = (ms = 300) => new Promise(resolve => setTimeout(resolve, ms))

/**
 * 生成成功响应
 */
const successResponse = (data, message = '操作成功') => ({
  code: '200',
  message,
  data,
  timestamp: new Date().getTime()
})

/**
 * 生成分页响应
 */
const pageResponse = (list, page = 1, pageSize = 10) => {
  const start = (page - 1) * pageSize
  const end = start + pageSize
  const items = list.slice(start, end)
  
  return successResponse({
    list: items,
    total: list.length,
    page: parseInt(page),
    pageSize: parseInt(pageSize),
    totalPages: Math.ceil(list.length / pageSize)
  })
}

/**
 * Mock 请求处理器
 * @param {Object} config axios 请求配置
 * @returns {Promise} 返回模拟响应数据
 */
export async function mockRequestHandler(config) {
  if (!MOCK_ENABLED) {
    return null // 如果未启用 Mock，返回 null 让真实请求继续
  }

  await delay() // 模拟网络延迟

  const { url, method, data, params } = config
  const methodLower = method?.toLowerCase()

  console.log(`[Mock] ${method} ${url}`, { data, params })

  // ==================== 用户相关接口 ====================
  
  // 用户登录
  if (url.includes('/login') && methodLower === 'post') {
    const user = mockUsers[0] // 返回管理员账号
    // 合并用户信息和 token 到一个对象
    const loginData = { ...user }
    localStorage.setItem('current-user', JSON.stringify(loginData))
    return successResponse(loginData, '登录成功')
  }

  // 用户注册
  if (url.includes('/register') && methodLower === 'post') {
    const newUser = {
      id: mockUsers.length + 1,
      ...data,
      token: `mock-token-${Date.now()}`,
      status: 1
    }
    mockUsers.push(newUser)
    return successResponse(newUser, '注册成功')
  }

  // 获取用户信息
  if (url.includes('/user/info') || url.includes('/userInfo')) {
    return successResponse(mockUsers[0])
  }

  // 获取用户列表
  if (url.includes('/users') && methodLower === 'get') {
    const page = params?.page || 1
    const pageSize = params?.pageSize || 10
    return pageResponse(mockUsers, page, pageSize)
  }

  // 更新用户信息
  if (url.includes('/user') && (methodLower === 'put' || methodLower === 'post')) {
    return successResponse(data, '更新成功')
  }

  // ==================== 文章相关接口 ====================
  
  // 获取文章列表
  if ((url.includes('/articles') || url.includes('/article/list')) && methodLower === 'get') {
    const page = params?.page || 1
    const pageSize = params?.pageSize || 10
    const category = params?.category
    
    let filteredArticles = mockArticles
    if (category) {
      filteredArticles = mockArticles.filter(a => a.category === category)
    }
    
    return pageResponse(filteredArticles, page, pageSize)
  }

  // 获取按支部分类的文章列表
  if (url.includes('/article/selectArticleBybranch') && methodLower === 'get') {
    return successResponse(mockArticles)
  }

  // 获取文章详情
  if (url.includes('/article/') && methodLower === 'get') {
    const id = parseInt(url.split('/').pop())
    const article = mockArticles.find(a => a.id === id) || mockArticles[0]
    return successResponse(article)
  }

  // 创建文章
  if (url.includes('/article') && methodLower === 'post') {
    const newArticle = {
      id: mockArticles.length + 1,
      ...data,
      publishTime: new Date().toLocaleString('zh-CN'),
      views: 0,
      likes: 0,
      comments: 0,
      status: 'published'
    }
    mockArticles.unshift(newArticle)
    return successResponse(newArticle, '发布成功')
  }

  // 更新文章
  if (url.includes('/article') && methodLower === 'put') {
    return successResponse(data, '更新成功')
  }

  // 删除文章
  if (url.includes('/article') && methodLower === 'delete') {
    return successResponse(null, '删除成功')
  }

  // ==================== 评论相关接口 ====================
  
  // 获取评论列表
  if (url.includes('/comments') && methodLower === 'get') {
    const articleId = params?.articleId
    let filteredComments = mockComments
    if (articleId) {
      filteredComments = mockComments.filter(c => c.articleId == articleId)
    }
    return successResponse(filteredComments)
  }

  // 发表评论
  if (url.includes('/comment') && methodLower === 'post') {
    const newComment = {
      id: mockComments.length + 1,
      ...data,
      createTime: new Date().toLocaleString('zh-CN'),
      likes: 0,
      replies: []
    }
    mockComments.push(newComment)
    return successResponse(newComment, '评论成功')
  }

  // ==================== 活动相关接口 ====================
  
  // 获取活动列表
  if (url.includes('/activities') || url.includes('/activity/list')) {
    const page = params?.page || 1
    const pageSize = params?.pageSize || 10
    return pageResponse(mockActivities, page, pageSize)
  }

  // 获取活动详情
  if (url.includes('/activity/') && methodLower === 'get') {
    const id = parseInt(url.split('/').pop())
    const activity = mockActivities.find(a => a.id === id) || mockActivities[0]
    return successResponse(activity)
  }

  // 创建活动
  if (url.includes('/activity') && methodLower === 'post') {
    const newActivity = {
      id: mockActivities.length + 1,
      ...data,
      participants: 0,
      status: 'upcoming'
    }
    mockActivities.unshift(newActivity)
    return successResponse(newActivity, '活动创建成功')
  }

  // 报名参加活动
  if (url.includes('/activity/join') && methodLower === 'post') {
    return successResponse(null, '报名成功')
  }

  // ==================== 考试相关接口 ====================
  
  // 获取考试列表
  if (url.includes('/exams') || url.includes('/exam/list')) {
    const page = params?.page || 1
    const pageSize = params?.pageSize || 10
    return pageResponse(mockExams, page, pageSize)
  }

  // 获取考试详情
  if (url.includes('/exam/') && !url.includes('/questions') && methodLower === 'get') {
    const id = parseInt(url.split('/').pop())
    const exam = mockExams.find(e => e.id === id) || mockExams[0]
    return successResponse(exam)
  }

  // 获取试题列表
  if (url.includes('/exam/') && url.includes('/questions') && methodLower === 'get') {
    const examId = parseInt(url.split('/')[url.split('/').length - 2])
    const questions = mockQuestions.filter(q => q.examId === examId)
    return successResponse(questions)
  }

  // 提交考试答案
  if (url.includes('/exam/submit') && methodLower === 'post') {
    const score = Math.floor(Math.random() * 40) + 60 // 60-100分
    return successResponse({
      score,
      totalScore: 100,
      passed: score >= 60,
      correctCount: Math.floor(score / 2),
      totalCount: 50
    }, '提交成功')
  }

  // ==================== 组织架构相关接口 ====================
  
  // 获取组织架构
  if (url.includes('/organization') || url.includes('/branch')) {
    return successResponse(mockOrganizations)
  }

  // ==================== 轮播图相关接口 ====================
  
  // 获取轮播图列表
  if (url.includes('/carousel') && methodLower === 'get') {
    return successResponse(mockCarousels)
  }

  // ==================== 统计数据相关接口 ====================
  
  // 获取统计数据
  if (url.includes('/statistics') || url.includes('/stats')) {
    return successResponse(mockStatistics)
  }

  // ==================== 审核相关接口 ====================
  
  // 获取待审核列表
  if (url.includes('/audit/list') && methodLower === 'get') {
    const page = params?.page || 1
    const pageSize = params?.pageSize || 10
    return pageResponse(mockAudits, page, pageSize)
  }

  // 审核通过/拒绝
  if (url.includes('/audit') && methodLower === 'post') {
    return successResponse(null, '审核成功')
  }

  // ==================== 资源相关接口 ====================
  
  // 获取资源列表
  if (url.includes('/resources') || url.includes('/resource/list')) {
    const page = params?.page || 1
    const pageSize = params?.pageSize || 10
    return pageResponse(mockResources, page, pageSize)
  }

  // 上传资源
  if (url.includes('/upload') && methodLower === 'post') {
    return successResponse({
      url: 'https://via.placeholder.com/400x300',
      name: '上传文件.jpg',
      size: '1.2MB'
    }, '上传成功')
  }

  // ==================== 通知公告相关接口 ====================
  
  // 获取通知列表
  if (url.includes('/notices') || url.includes('/notice/list')) {
    const page = params?.page || 1
    const pageSize = params?.pageSize || 10
    return pageResponse(mockNotices, page, pageSize)
  }

  // ==================== 草稿相关接口 ====================
  
  // 获取本地草稿（未提交）
  if (url.includes('/draft/selectLocalByUid') && methodLower === 'get') {
    const uid = parseInt(url.split('/').pop())
    const drafts = mockDrafts.filter(d => d.uid === uid && d.status === 0)
    return successResponse(drafts)
  }

  // 获取已提交草稿
  if (url.includes('/draft/selectSubByUid') && methodLower === 'get') {
    const uid = parseInt(url.split('/').pop())
    const drafts = mockDrafts.filter(d => d.uid === uid && d.status === 1)
    return successResponse(drafts)
  }

  // 检查草稿状态
  if (url.includes('/draft/checkStatus') && methodLower === 'get') {
    const draftId = parseInt(url.split('/').pop())
    const draft = mockDrafts.find(d => d.id === draftId)
    return successResponse({ status: draft?.status || 0 })
  }

  // 保存/更新草稿
  if (url.includes('/draft') && (methodLower === 'post' || methodLower === 'put')) {
    return successResponse(data, '保存成功')
  }

  // ==================== 审核相关接口 ====================
  
  // 获取用户的审核任务
  if (url.includes('/audit/selectByUid') && methodLower === 'get') {
    const uid = parseInt(url.split('/').pop())
    // 返回待审核的草稿（管理员可以看到所有待审核）
    const audits = mockDrafts.filter(d => d.status === 1).map(draft => ({
      id: draft.id,
      draftId: draft.id,
      title: draft.title,
      submitter: mockUsers.find(u => u.id === draft.uid)?.realName || '未知',
      submitTime: draft.submitTime,
      status: 'pending'
    }))
    return successResponse(audits)
  }

  // 根据提交ID获取审核信息
  if (url.includes('/audit/selectBySubmitId') && methodLower === 'get') {
    const submitId = parseInt(url.split('/').pop())
    const audit = {
      id: submitId,
      draftId: submitId,
      status: 'pending',
      submitter: '李四',
      submitTime: '2026-01-05 15:00:00',
      comment: ''
    }
    return successResponse(audit)
  }

  // 更新审核状态
  if (url.includes('/audit/Update') && methodLower === 'post') {
    return successResponse(null, '审核成功')
  }

  // ==================== 评论相关接口（补充） ====================
  
  // 获取用户的评论
  if (url.includes('/comment/selectbyuid') && methodLower === 'get') {
    const uid = parseInt(url.split('/').pop())
    const userComments = mockComments.filter(c => c.userId === uid)
    return successResponse(userComments)
  }

  // 获取回复我的评论
  if (url.includes('/comment/selectbyfatheruid') && methodLower === 'get') {
    const uid = parseInt(url.split('/').pop())
    // 返回回复该用户的评论
    const replies = mockComments.filter(c => 
      c.replies && c.replies.some(r => r.userId !== uid)
    ).flatMap(c => c.replies)
    return successResponse(replies)
  }

  // 提交回复
  if (url.includes('/comment/submitreply') && methodLower === 'post') {
    return successResponse(null, '回复成功')
  }

  // 删除评论
  if (url.includes('/comment/delete') && methodLower === 'post') {
    return successResponse(null, '删除成功')
  }

  // ==================== 部门/板块相关接口 ====================
  
  // 获取所有板块
  if (url.includes('/sector/selectAll') && methodLower === 'get') {
    return successResponse(mockSectors)
  }

  // 根据部门ID获取用户
  if (url.includes('/user/selectByDeid') && methodLower === 'get') {
    const deid = parseInt(url.split('/').pop())
    const users = mockUsers.filter(u => u.department === mockSectors.find(s => s.id === deid)?.name)
    return successResponse(users)
  }

  // 获取所有用户
  if (url.includes('/user/selectAll') && methodLower === 'get') {
    return successResponse(mockUsers)
  }

  // 更新用户部门
  if (url.includes('/user/updateDeid') && methodLower === 'put') {
    return successResponse(null, '更新成功')
  }

  // 添加板块
  if (url.includes('/sector/add') && methodLower === 'post') {
    return successResponse(data, '添加成功')
  }

  // 添加部门
  if (url.includes('/department/add') && methodLower === 'post') {
    return successResponse(data, '添加成功')
  }

  // 重命名板块
  if (url.includes('/sector/rename') && methodLower === 'put') {
    return successResponse(null, '重命名成功')
  }

  // 重命名部门
  if (url.includes('/department/rename') && methodLower === 'put') {
    return successResponse(null, '重命名成功')
  }

  // 删除板块
  if (url.includes('/sector/delete') && methodLower === 'delete') {
    return successResponse(null, '删除成功')
  }

  // 删除部门
  if (url.includes('/department/delete') && methodLower === 'delete') {
    return successResponse(null, '删除成功')
  }

  // ==================== 资源相关接口（补充） ====================
  
  // 获取所有资源
  if (url.includes('/resource/selectAll') && methodLower === 'get') {
    return successResponse(mockResources)
  }

  // 按参与者查询资源
  if (url.includes('/resource/selectByJoiner') && methodLower === 'get') {
    return successResponse(mockResources)
  }

  // 获取最新图片
  if (url.includes('/resource/selectLatestImages') && methodLower === 'get') {
    const images = mockResources.filter(r => r.type === 'image').slice(0, 6)
    return successResponse(images)
  }

  // 资源统计
  if (url.includes('/resource/count') && methodLower === 'get') {
    return successResponse({
      total: mockResources.length,
      images: mockResources.filter(r => r.type === 'image').length,
      videos: mockResources.filter(r => r.type === 'video').length,
      documents: mockResources.filter(r => r.type === 'pdf' || r.type === 'pptx').length
    })
  }

  // 每月资源统计
  if (url.includes('/resource/countEachMonth') && methodLower === 'get') {
    return successResponse([
      { month: '2025-07', count: 12 },
      { month: '2025-08', count: 15 },
      { month: '2025-09', count: 18 },
      { month: '2025-10', count: 20 },
      { month: '2025-11', count: 22 },
      { month: '2025-12', count: 25 },
      { month: '2026-01', count: 10 }
    ])
  }

  // ==================== 搜索相关接口 ====================
  
  // 搜索
  if (url.includes('/search') && methodLower === 'get') {
    const keyword = params?.keyword || params?.q
    const results = mockArticles.filter(a => 
      a.title.includes(keyword) || a.content.includes(keyword)
    )
    return successResponse(results)
  }

  // ==================== 默认响应 ====================
  
  // 对于未匹配的 GET 请求，返回空列表
  if (methodLower === 'get') {
    return successResponse([])
  }

  // 对于未匹配的 POST/PUT/DELETE 请求，返回成功
  if (['post', 'put', 'delete'].includes(methodLower)) {
    return successResponse(data || null, '操作成功')
  }

  return successResponse(null, '接口暂未实现')
}
