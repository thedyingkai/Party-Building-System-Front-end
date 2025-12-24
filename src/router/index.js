/**
 * Vue Router 路由配置文件
 * 
 * @description 定义应用的所有路由规则，包括公共页面、管理后台、权限控制等
 * @author 党建系统开发团队
 * @date 2025
 */

// ==================== 核心依赖导入 ====================
import Vue from 'vue'
import VueRouter from 'vue-router'

// ==================== 页面组件导入 ====================
// 公共页面
import Login from "@/views/LoginPage";
import Register from "@/views/RegisterPage";
import Public from "@/views/PublicView";
import test from "@/views/TestAI";
import NotFound from "@/views/NotFound";

// 文章相关
import ArtiCle from "@/views/ArtiCle.vue";
import ArticleShow from "@/views/ArticleShow.vue";

// 页面框架
import PageView from "@/views/PageView";
import AuthView from "@/views/infoRelease/AuthView";

// 信息发布模块
import EditorPage from "@/views/infoRelease/EditorPage";
import AuditEditorPage from "@/views/infoRelease/AuditEditorPage.vue";
import DraftList from "@/views/infoRelease/DraftList";
import AppHome from "@/views/infoRelease/AppHome";
import SubmittedDraft from "@/views/infoRelease/SubmittedDraft";
import DraftAuditList from "@/views/infoRelease/DraftAuditList";
import AuditRecord from "@/views/infoRelease/AuditRecord";
import ColumnSet from "@/views/infoRelease/ColumnSet"
import CarouselSet from "@/views/infoRelease/CarouselSet";
import CommentAuditList from "@/views/infoRelease/CommentAuditList.vue";
import MyComments from "@/views/infoRelease/MyComments.vue";
import ReplyMe from "@/views/infoRelease/ReplyMe.vue";
import ActivityManage from "@/views/infoRelease/ActivityManage.vue";
import SectorManage from "@/views/infoRelease/SectorManage.vue";
import ResourceView from "@/views/infoRelease/ResourceView";
import AuditProcess from "@/views/infoRelease/AuditProcess.vue";

// 人员管理模块
import UserInfo from "@/views/personnelManage/UserInfo.vue";
import UserList from "@/views/personnelManage/UserList.vue";
import BranchManage from "@/views/personnelManage/organizationManage/BranchManage.vue";
import GroupManage from "@/views/personnelManage/organizationManage/GroupManage.vue";
import BranchManager from "@/views/personnelManage/organizationManage/BranchManager.vue";

// 公共视图
import DefaultView from "@/views/publicView/DefaultView";

// ==================== 注册路由插件 ====================
Vue.use(VueRouter)

// ==================== 路由配置 ====================
/**
 * 路由表
 * @type {Array<RouteConfig>}
 */
const routes = [
    // 登录页面
    {
        path: '/login',
        name: 'Login',
        component: Login
    },
    // 公共访问页面（无需登录）
    {
        path: '/public',
        name: 'public',
        redirect: 'publichome',
        component: Public,
        meta: { title: '首页' },
        children: [
            { path: '', name: 'home', component: DefaultView },
            { path: 'ArticleShow/:id', name: 'ArticleShow', component: ArticleShow },
        ]
    },
    // 注册页面
    {
        path: '/register',
        name: 'Register',
        component: Register
    },
    // 测试页面
    {
        path: '/test',
        name: 'test',
        component: test
    },
    // 文章详情页面
    {
        path: '/article/:id',
        name: 'article',
        component: ArtiCle,
    },
    // 主应用框架（需要登录）
    {
        path: '/',
        name: 'PageView',
        component: PageView,
        meta: { title: '首页' },
        children: [
            // 个人空间
            {
                path: 'home',
                name: '个人空间',
                component: AppHome,
                meta: {
                    title: '个人空间',
                    breadcrumb: [
                        { title: '首页', path: '/' },
                        { title: '个人空间' }
                    ]
                }
            },
            // 个人信息
            {
                path: 'info',
                name: '个人信息',
                component: UserInfo,
                meta: {
                    title: '个人信息',
                    breadcrumb: [
                        { title: '首页', path: '/' },
                        { title: '个人信息' }
                    ]
                }
            },
            // 草稿箱
            {
                path: 'DraftList',
                name: '草稿箱',
                component: DraftList,
                meta: {
                    title: '草稿箱',
                    breadcrumb: [
                        { title: '首页', path: '/' },
                        { title: '草稿箱' }
                    ]
                }
            },
            // 我的评论
            {
                path: 'MyComments',
                name: '我的评论',
                component: MyComments,
                meta: {
                    title: '我的评论',
                    breadcrumb: [
                        { title: '首页', path: '/' },
                        { title: '我的评论' }
                    ]
                }
            },
            // 回复我的
            {
                path: 'ReplyMe',
                name: '回复我的',
                component: ReplyMe,
                meta: {
                    title: '回复评论',
                    breadcrumb: [
                        { title: '首页', path: '/' },
                        { title: '回复评论' }
                    ]
                }
            },
            // 人员列表
            {
                path: 'UserList',
                name: '人员列表',
                component: UserList,
                meta: {
                    title: '人员列表',
                    breadcrumb: [
                        { title: '首页', path: '/' },
                        { title: '人员列表' }
                    ]
                }
            },
            // 草稿编辑
            {
                path: 'EditorPage',
                name: '草稿编辑',
                component: EditorPage,
                meta: {
                    title: '草稿编辑',
                    breadcrumb: [
                        { title: '首页', path: '/' },
                        { title: '草稿编辑' }
                    ]
                }
            },
            // 审核文章编辑
            {
                path: 'AuditEditorPage',
                name: '审核文章编辑',
                component: AuditEditorPage,
                meta: {
                    title: '审核文章编辑',
                    breadcrumb: [
                        { title: '首页', path: '/' },
                        { title: '审核文章编辑' }
                    ]
                }
            },
            // 已提交的草稿
            {
                path: 'SubmittedDraft',
                name: '已提交的草稿',
                component: SubmittedDraft,
                meta: {
                    title: '已提交的草稿',
                    breadcrumb: [
                        { title: '首页', path: '/' },
                        { title: '已提交的草稿' }
                    ]
                }
            },
            // 待审文章
            {
                path: 'DraftAuditList',
                name: '待审文章',
                component: DraftAuditList,
                meta: {
                    title: '待审文章',
                    breadcrumb: [
                        { title: '首页', path: '/' },
                        { title: '待审文章' }
                    ]
                }
            },
            // 文章审核记录
            // 文章审核记录
            {
                path: 'AuditRecord',
                name: '文章审核记录',
                component: AuditRecord,
                meta: {
                    title: '审核记录',
                    breadcrumb: [
                        { title: '首页', path: '/' },
                        { title: '审核记录' }
                    ]
                }
            },
            // 待审评论
            {
                path: 'CommentAuditList',
                name: '待审评论',
                component: CommentAuditList,
                meta: {
                    title: '待审评论',
                    breadcrumb: [
                        { title: '首页', path: '/' },
                        { title: '待审评论' }
                    ]
                }
            },
            // 栏目设置
            {
                path: 'ColumnSet',
                name: '栏目设置',
                component: ColumnSet,
                meta: {
                    title: '栏目设置',
                    breadcrumb: [
                        { title: '首页', path: '/' },
                        { title: '栏目设置' }
                    ]
                }
            },
            // 轮播图管理
            {
                path: 'CarouselSet',
                name: '编辑轮播图',
                component: CarouselSet,
                meta: {
                    title: '编辑轮播图',
                    breadcrumb: [
                        { title: '首页', path: '/' },
                        { title: '编辑轮播图' }
                    ]
                }
            },
            // 审核流程配置
            {
                path: 'AuditProcess',
                name: '审核流程',
                component: AuditProcess,
                meta: {
                    title: '审核流程',
                    breadcrumb: [
                        { title: '首页', path: '/' },
                        { title: '审核流程' }
                    ]
                }
            },
            // 活动管理
            {
                path: 'ActivityManage',
                name: '活动管理',
                component: ActivityManage,
                meta: {
                    title: '活动管理',
                    breadcrumb: [
                        { title: '首页', path: '/' },
                        { title: '活动管理' }
                    ]
                }
            },
            // 资源浏览
            {
                path: 'ResourceView',
                name: '资源浏览',
                component: ResourceView,
                meta: {
                    title: '资源浏览',
                    breadcrumb: [
                        { title: '首页', path: '/' },
                        { title: '资源浏览' }
                    ]
                }
            },
            // 支部建设
            {
                path: 'BranchManage',
                name: '支部建设',
                component: BranchManage,
                meta: {
                    title: '支部建设',
                    breadcrumb: [
                        { title: '首页', path: '/' },
                        { title: '支部建设' }
                    ]
                },
            },
            // 委员会管理
            {
                path: 'BranchManager',
                name: '委员会',
                component: BranchManager,
                meta: {
                    title: '委员会',
                    breadcrumb: [
                        { title: '首页', path: '/' },
                        { title: '支部建设', path: '/BranchManage' },
                        { title: '委员会' }
                    ]
                }
            },
            // 党小组管理
            {
                path: 'GroupManage/:id',
                name: '党小组',
                component: GroupManage,
                meta: {
                    title: '党小组',
                    breadcrumb: [
                        { title: '首页', path: '/' },
                        { title: '支部建设', path: '/BranchManage' },
                        { title: '党小组管理' }
                    ]
                }
            },
            // 部门管理
            {
                path: 'SectorManage',
                name: '部门管理',
                component: SectorManage,
                meta: {
                    title: '部门管理',
                    breadcrumb: [
                        { title: '首页', path: '/' },
                        { title: '部门管理' }
                    ]
                }
            },
            // ==================== 考试模块路由 ====================
            // 试题搜索
            {
                path: 'search',
                name: 'Search',
                meta: {
                    title: '试题搜索',
                    breadcrumb: [
                        { title: '首页', path: '/' },
                        { title: '试题搜索' }
                    ]
                },
                component: () => import('@/views/exam/search.vue')
            },
            // 试题编辑
            {
                path: 'edit',
                name: 'Edit',
                meta: {
                    title: '试题编辑',
                    breadcrumb: [
                        { title: '首页', path: '/' },
                        { title: '试题编辑' }
                    ]
                },
                component: () => import('@/views/exam/edit.vue')
            },
            // 考试页面
            {
                path: 'exam',
                name: 'Exam',
                meta: {
                    title: '不知道是啥',
                    breadcrumb: [
                        { title: '首页', path: '/' },
                        { title: '不知道是啥' }
                    ]
                },
                component: () => import('@/views/exam/Exam_b.vue')
            },
            // 在线自测
            {
                path: 'selfExam',
                name: 'SelfExam',
                meta: {
                    title: '在线自测',
                    breadcrumb: [
                        { title: '首页', path: '/' },
                        { title: '在线自测' }
                    ]
                },
                component: () => import('@/views/exam/SelfExam.vue')
            },
            // 参与测试
            {
                path: 'papers',
                name: 'Papers',
                meta: {
                    title: '参与测试',
                    breadcrumb: [
                        { title: '首页', path: '/' },
                        { title: '参与测试' }
                    ]
                },
                component: () => import('@/views/exam/TestPaperDetail.vue')
            },
            // 试卷生成
            {
                path: 'choose',
                name: 'Choose',
                meta: {
                    title: '试卷生成',
                    breadcrumb: [
                        { title: '首页', path: '/' },
                        { title: '试卷生成' }
                    ]
                },
                component: () => import('@/views/exam/choose_new.vue')
            },
            // 统计
            {
                path: 'statistics',
                name: 'Statistics',
                meta: {
                    title: '统计',
                    breadcrumb: [
                        { title: '首页', path: '/' },
                        { title: '统计' }
                    ]
                },
                component: () => import('@/views/exam/Statistics.vue')
            },
            // 用户管理
            {
                path: 'user',
                name: 'User',
                meta: {
                    title: '用户',
                    breadcrumb: [
                        { title: '首页', path: '/' },
                        { title: '用户' }
                    ]
                },
                component: () => import('@/views/exam/User.vue')
            },
            // 403 权限不足页面
            {
                path: '/403',
                name: 'AuthView',
                component: AuthView,
                meta: {
                    title: '403 权限不足',
                    breadcrumb: [
                        { title: '首页', path: '/' },
                        { title: '403 权限不足' }
                    ]
                }
            }
        ]
    },
    // 404 页面（匹配所有未定义路由）
    {
        path: '*',
        name: '404',
        component: NotFound,
    }
]

// ==================== 创建路由实例 ====================
const router = new VueRouter({
    mode: 'history', // 使用 HTML5 History 模式
    routes // 路由配置
}
)

// ==================== 路由导航错误处理 ====================
/**
 * 捕获并忽略 NavigationDuplicated 错误
 * 解决重复导航到相同路由时的控制台错误提示
 */
const originalPush = VueRouter.prototype.push;
VueRouter.prototype.push = function push(location) {
    return originalPush.call(this, location).catch(err => {
        if (err.name !== 'NavigationDuplicated') {
            throw err;
        }
    });
}

// ==================== 全局路由守卫 ====================
/**
 * 全局前置路由守卫
 * 用于权限验证和路由访问控制
 * 
 * @param {Route} to - 即将进入的目标路由对象
 * @param {Route} from - 当前导航正要离开的路由
 * @param {Function} next - 调用该方法 resolve 这个钩子
 */
router.beforeEach((to, from, next) => {
    // 定义公共页面路径（无需登录）
    const publicPaths = ['/public', '/login', '/register', '/publichome'];
    const publicPathRegex1 = /^\/(article)\/.*$/; // 匹配文章详情页
    const publicPathRegex2 = /^\/public\/ArticleShow\/.*$/; // 匹配公共文章展示页

    // 判断是否是公共页面
    if (publicPaths.includes(to.path) || publicPathRegex1.test(to.path) || publicPathRegex2.test(to.path)) {
        next();
        return;
    } else if (to.path.startsWith('/public')) {
        next();
        return;
    }

    // 定义不同角色的路径权限
    let editorPath = ['/ActivityManage', '/SubmittedDraft']; // 编辑者权限路径
    let auditorPath = ['/DraftAuditList', '/AuditRecord']; // 审核者权限路径
    let rootPath = ['/UserList', 'ColumnSet', 'CarouselSet']; // 管理员权限路径

    // 从本地存储获取当前用户信息
    let user = JSON.parse(localStorage.getItem('current-user') || '{}');
    let permissions = user.permissions; // 用户权限字符串

    // 未登录用户访问 /home 时，重定向到登录页
    if (!user && to.path === '/home') {
        next({ name: 'Login' });
        return;
    }

    // 未登录用户访问根路径时，重定向到公共首页
    if (!user && to.path === '/') {
        next({ name: 'publichome' });
    } else {
        // 已登录用户权限验证
        if (user && typeof permissions === 'string') {
            // 根据权限字符串判断是否有权限访问目标路径
            // permissions[3] - 编辑权限
            // permissions[6] - 管理员权限
            // permissions[2] - 审核权限
            if (permissions[3] !== '1' && editorPath.includes(to.path) ||
                permissions[6] !== '1' && rootPath.includes(to.path) ||
                permissions[2] !== '1' && auditorPath.includes(to.path)) {
                next({ name: 'AuthView' }); // 无权限，跳转到 403 页面
            } else {
                next(); // 有权限，放行
            }
        } else {
            // 用户信息无效，跳转到登录页
            next({ name: 'Login' });
        }
    }
});

// ==================== 导出路由实例 ====================
export default router