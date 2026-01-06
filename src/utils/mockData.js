/**
 * Mock 数据配置
 * 
 * @description 用于中期验收演示的模拟数据，当后端未就绪时使用
 * @author 党建系统开发团队
 * @date 2026-01-06
 */

// ==================== 用户数据 ====================
export const mockUsers = [
  {
    id: 1,
    username: 'admin',
    realName: '张三',
    role: '管理员',
    department: '党委办公室',
    phone: '13800138000',
    email: 'admin@party.com',
    token: 'mock-token-admin-123456',
    avatar: 'https://via.placeholder.com/100',
    status: 1,
    permissions: '1111111' // 全部权限（7位权限字符串，1表示有权限）
  },
  {
    id: 2,
    username: 'user001',
    realName: '李四',
    role: '党员',
    department: '第一党支部',
    phone: '13800138001',
    email: 'user001@party.com',
    token: 'mock-token-user-123457',
    avatar: 'https://via.placeholder.com/100',
    status: 1,
    permissions: '1001000' // 部分权限
  }
]

// ==================== 文章/新闻数据 ====================
export const mockArticles = [
  {
    id: 1,
    title: '学习贯彻党的二十大精神专题会议',
    content: '<p>为深入学习贯彻党的二十大精神，进一步推动党建工作高质量发展...</p>',
    author: '张三',
    authorId: 1,
    bid: 2, // 支部ID：第一党支部
    category: '党建要闻',
    tags: ['党的二十大', '学习活动'],
    publishTime: '2026-01-05 10:00:00',
    views: 1280,
    likes: 56,
    comments: 23,
    status: 'published',
    cover: 'https://via.placeholder.com/800x400'
  },
  {
    id: 2,
    title: '党员志愿服务活动圆满结束',
    content: '<p>本月党员志愿服务活动在社区圆满结束，共有50余名党员参加...</p>',
    author: '李四',
    authorId: 2,
    bid: 2, // 支部ID：第一党支部
    category: '组织活动',
    tags: ['志愿服务', '社区活动'],
    publishTime: '2026-01-04 14:30:00',
    views: 856,
    likes: 42,
    comments: 18,
    status: 'published',
    cover: 'https://via.placeholder.com/800x400'
  },
  {
    id: 3,
    title: '党史学习教育常态化长效化推进会',
    content: '<p>持续深化党史学习教育，推动党史学习教育常态化长效化...</p>',
    author: '王五',
    authorId: 1,
    bid: 3, // 支部ID：第二党支部
    category: '学习教育',
    tags: ['党史学习', '教育活动'],
    publishTime: '2026-01-03 09:00:00',
    views: 2100,
    likes: 89,
    comments: 34,
    status: 'published',
    cover: 'https://via.placeholder.com/800x400'
  },
  {
    id: 4,
    title: '基层党组织建设工作座谈会',
    content: '<p>加强基层党组织建设，提升党组织的凝聚力和战斗力...</p>',
    author: '张三',
    authorId: 1,
    bid: 3, // 支部ID：第二党支部
    category: '组织建设',
    tags: ['基层党建', '座谈会'],
    publishTime: '2026-01-02 15:00:00',
    views: 1540,
    likes: 67,
    comments: 28,
    status: 'published',
    cover: 'https://via.placeholder.com/800x400'
  },
  {
    id: 5,
    title: '党风廉政建设专题讲座',
    content: '<p>邀请专家开展党风廉政建设专题讲座，强化廉洁自律意识...</p>',
    author: '赵六',
    authorId: 2,
    bid: 4, // 支部ID：第三党支部
    category: '廉政建设',
    tags: ['廉政', '专题讲座'],
    publishTime: '2026-01-01 10:30:00',
    views: 1890,
    likes: 78,
    comments: 31,
    status: 'published',
    cover: 'https://via.placeholder.com/800x400'
  }
]

// ==================== 评论数据 ====================
export const mockComments = [
  {
    id: 1,
    articleId: 1,
    userId: 2,
    userName: '李四',
    content: '学习贯彻党的二十大精神，我们要在实际工作中落实',
    createTime: '2026-01-05 11:30:00',
    likes: 12,
    replies: [
      {
        id: 101,
        userId: 1,
        userName: '张三',
        content: '说得好！我们要学以致用',
        createTime: '2026-01-05 12:00:00'
      }
    ]
  },
  {
    id: 2,
    articleId: 1,
    userId: 3,
    userName: '王五',
    content: '这次学习活动很有意义',
    createTime: '2026-01-05 14:00:00',
    likes: 8,
    replies: []
  }
]

// ==================== 活动数据 ====================
export const mockActivities = [
  {
    id: 1,
    title: '党员志愿服务日',
    description: '组织党员开展志愿服务活动，服务社区群众',
    startTime: '2026-01-10 09:00:00',
    endTime: '2026-01-10 17:00:00',
    location: '社区服务中心',
    organizer: '党委办公室',
    participants: 50,
    maxParticipants: 100,
    status: 'upcoming',
    cover: 'https://via.placeholder.com/600x300'
  },
  {
    id: 2,
    title: '党史知识竞赛',
    description: '以竞赛形式检验党史学习成果',
    startTime: '2026-01-15 14:00:00',
    endTime: '2026-01-15 16:30:00',
    location: '多功能会议室',
    organizer: '组织部',
    participants: 30,
    maxParticipants: 50,
    status: 'upcoming',
    cover: 'https://via.placeholder.com/600x300'
  },
  {
    id: 3,
    title: '红色教育基地参观',
    description: '前往红色教育基地开展现场教学',
    startTime: '2026-01-20 08:00:00',
    endTime: '2026-01-20 18:00:00',
    location: '革命纪念馆',
    organizer: '宣传部',
    participants: 45,
    maxParticipants: 60,
    status: 'upcoming',
    cover: 'https://via.placeholder.com/600x300'
  }
]

// ==================== 考试数据 ====================
export const mockExams = [
  {
    id: 1,
    title: '党的二十大精神学习测试',
    description: '检验党的二十大精神学习成果',
    duration: 60,
    totalScore: 100,
    passScore: 60,
    questionCount: 50,
    startTime: '2026-01-08 09:00:00',
    endTime: '2026-01-08 18:00:00',
    status: 'active',
    participants: 120
  },
  {
    id: 2,
    title: '党章党规知识测试',
    description: '党章党规基础知识测试',
    duration: 45,
    totalScore: 100,
    passScore: 60,
    questionCount: 40,
    startTime: '2026-01-12 09:00:00',
    endTime: '2026-01-12 18:00:00',
    status: 'upcoming',
    participants: 0
  }
]

// ==================== 试题数据 ====================
export const mockQuestions = [
  {
    id: 1,
    examId: 1,
    type: 'single',
    question: '中国共产党第二十次全国代表大会于何时召开？',
    options: [
      'A. 2022年10月16日',
      'B. 2022年10月18日',
      'C. 2022年11月16日',
      'D. 2022年11月18日'
    ],
    answer: 'A',
    score: 2,
    analysis: '党的二十大于2022年10月16日在北京开幕'
  },
  {
    id: 2,
    examId: 1,
    type: 'single',
    question: '全面建设社会主义现代化国家的首要任务是什么？',
    options: [
      'A. 经济发展',
      'B. 高质量发展',
      'C. 科技创新',
      'D. 改革开放'
    ],
    answer: 'B',
    score: 2,
    analysis: '高质量发展是全面建设社会主义现代化国家的首要任务'
  },
  {
    id: 3,
    examId: 1,
    type: 'multiple',
    question: '中国式现代化的本质要求包括（多选）',
    options: [
      'A. 坚持中国共产党领导',
      'B. 坚持中国特色社会主义',
      'C. 实现高质量发展',
      'D. 发展全过程人民民主'
    ],
    answer: 'ABCD',
    score: 3,
    analysis: '以上都是中国式现代化的本质要求'
  }
]

// ==================== 组织架构数据 ====================
export const mockOrganizations = [
  {
    id: 1,
    name: '党委',
    type: 'committee',
    level: 1,
    parentId: null,
    leader: '张三',
    memberCount: 15,
    children: [
      {
        id: 2,
        name: '第一党支部',
        type: 'branch',
        level: 2,
        parentId: 1,
        leader: '李四',
        memberCount: 25,
        children: []
      },
      {
        id: 3,
        name: '第二党支部',
        type: 'branch',
        level: 2,
        parentId: 1,
        leader: '王五',
        memberCount: 30,
        children: []
      },
      {
        id: 4,
        name: '第三党支部',
        type: 'branch',
        level: 2,
        parentId: 1,
        leader: '赵六',
        memberCount: 22,
        children: []
      }
    ]
  }
]

// ==================== 轮播图数据 ====================
export const mockCarousels = [
  {
    id: 1,
    title: '学习贯彻党的二十大精神',
    image: 'https://via.placeholder.com/1200x500/FF6B6B/FFFFFF?text=学习党的二十大精神',
    link: '/article/1',
    order: 1,
    status: 'active'
  },
  {
    id: 2,
    title: '党员志愿服务',
    image: 'https://via.placeholder.com/1200x500/4ECDC4/FFFFFF?text=党员志愿服务',
    link: '/activity/1',
    order: 2,
    status: 'active'
  },
  {
    id: 3,
    title: '党史学习教育',
    image: 'https://via.placeholder.com/1200x500/45B7D1/FFFFFF?text=党史学习教育',
    link: '/article/3',
    order: 3,
    status: 'active'
  }
]

// ==================== 统计数据 ====================
export const mockStatistics = {
  overview: {
    totalMembers: 235,
    totalBranches: 12,
    totalActivities: 48,
    totalArticles: 156
  },
  memberGrowth: [
    { month: '2025-07', count: 210 },
    { month: '2025-08', count: 215 },
    { month: '2025-09', count: 220 },
    { month: '2025-10', count: 225 },
    { month: '2025-11', count: 230 },
    { month: '2025-12', count: 235 }
  ],
  activityStats: [
    { type: '学习教育', count: 18 },
    { type: '志愿服务', count: 12 },
    { type: '组织活动', count: 10 },
    { type: '座谈会', count: 8 }
  ],
  examParticipation: [
    { name: '已参加', value: 180 },
    { name: '未参加', value: 55 }
  ]
}

// ==================== 审核数据 ====================
export const mockAudits = [
  {
    id: 1,
    type: 'article',
    title: '关于开展党史学习教育的通知',
    submitter: '李四',
    submitTime: '2026-01-06 10:00:00',
    status: 'pending',
    auditor: null
  },
  {
    id: 2,
    type: 'comment',
    content: '这是一条待审核的评论内容',
    submitter: '王五',
    submitTime: '2026-01-06 11:30:00',
    status: 'pending',
    auditor: null
  }
]

// ==================== 资源数据 ====================
export const mockResources = [
  {
    id: 1,
    name: '党的二十大报告.pdf',
    type: 'pdf',
    size: '2.5MB',
    category: '学习资料',
    uploadTime: '2026-01-05 09:00:00',
    uploader: '张三',
    downloads: 156,
    url: '#'
  },
  {
    id: 2,
    name: '党章学习课件.pptx',
    type: 'pptx',
    size: '8.3MB',
    category: '课件资料',
    uploadTime: '2026-01-04 14:00:00',
    uploader: '李四',
    downloads: 89,
    url: '#'
  },
  {
    id: 3,
    name: '党员发展流程图.jpg',
    type: 'image',
    size: '1.2MB',
    category: '流程图',
    uploadTime: '2026-01-03 16:30:00',
    uploader: '王五',
    downloads: 234,
    url: 'https://via.placeholder.com/800x600'
  }
]

// ==================== 通知公告数据 ====================
export const mockNotices = [
  {
    id: 1,
    title: '关于召开党员大会的通知',
    content: '定于1月15日召开党员大会，请各位党员准时参加...',
    type: 'notice',
    priority: 'high',
    publishTime: '2026-01-06 08:00:00',
    publisher: '党委办公室',
    status: 'active'
  },
  {
    id: 2,
    title: '党费缴纳提醒',
    content: '请各党员于本月底前完成党费缴纳...',
    type: 'reminder',
    priority: 'medium',
    publishTime: '2026-01-05 10:00:00',
    publisher: '组织部',
    status: 'active'
  }
]

// ==================== 草稿数据 ====================
export const mockDrafts = [
  {
    id: 1,
    title: '关于开展党史学习教育的通知（草稿）',
    content: '<p>草稿内容...</p>',
    uid: 1, // 创建者ID
    status: 0, // 0-本地草稿 1-已提交 2-审核通过 3-已发布
    createTime: '2026-01-06 09:00:00',
    updateTime: '2026-01-06 09:30:00',
    category: '学习教育',
    cover: 'https://via.placeholder.com/600x300'
  },
  {
    id: 2,
    title: '党员活动安排（草稿）',
    content: '<p>活动详情草稿...</p>',
    uid: 1,
    status: 1, // 已提交待审核
    createTime: '2026-01-05 14:00:00',
    updateTime: '2026-01-05 15:00:00',
    submitTime: '2026-01-05 15:00:00',
    category: '组织活动',
    cover: 'https://via.placeholder.com/600x300'
  },
  {
    id: 3,
    title: '党建工作总结（草稿）',
    content: '<p>总结内容...</p>',
    uid: 2,
    status: 1, // 已提交待审核
    createTime: '2026-01-04 10:00:00',
    updateTime: '2026-01-04 11:00:00',
    submitTime: '2026-01-04 11:00:00',
    category: '工作总结',
    cover: 'https://via.placeholder.com/600x300'
  }
]

// ==================== 部门/板块数据 ====================
export const mockSectors = [
  {
    id: 1,
    name: '党委办公室',
    type: 'sector',
    parentId: null,
    createTime: '2025-12-01'
  },
  {
    id: 2,
    name: '组织部',
    type: 'sector',
    parentId: null,
    createTime: '2025-12-01'
  },
  {
    id: 3,
    name: '宣传部',
    type: 'sector',
    parentId: null,
    createTime: '2025-12-01'
  }
]
