import Vue from 'vue'
import VueRouter from 'vue-router'

const LogIn = () =>
    import ('../components/common/login/Login.vue')
const Banner = () =>
    import ('../components/Banner.vue')
const HomePage = () =>
    import ('../components/homePage/HomePage.vue')
const Home = () =>
    import ('../components/home/Home.vue')
const Administrator = () =>
    import ('../components/administrator/Admonistrator.vue')
const Development = () =>
    import ('../components/Development/Development.vue')
const Boards = () =>
    import ('../components/Development/boards/Boards.vue')
const GroupBy = () =>
    import ('../components/Development/groupBy/GroupBy.vue')
const List = () =>
    import ('../components/Development/list/List.vue')
const Members = () =>
    import ('../components/members/Members.vue')
const Plan = () =>
    import ('../components/plan/Plan.vue')
const Topics = () =>
    import ('../components/topics/Topics.vue')
const Test = () =>
    import ('../components/test/Test.vue')
const TestDetailPanel = () =>
    import ('../components/test/TestDetailPanel.vue')
const TestRun = () =>
    import ('../components/testRun/TestRun.vue')
const TestRunGroupBy = () =>
    import ('../components/testRun/TestRunGroupBy.vue')
const TestRunTemplate = () =>
    import ('../components/testRun/TestRunTemplate.vue')
const TestLibrary = () =>
    import ('../components/testLibrary/TestLibrary.vue')
const Manage = () =>
    import ('../components/management/Manage.vue')
const ManageView = () =>
    import ('../components/management/Management.vue')
const Requirement = () =>
    import ('../components/requirement/Requirement.vue')
const NotFoundComponent = () =>
    import ('../components/common/notFoundComponent/NotFoundComponent.vue')



Vue.use(VueRouter);

const router = new VueRouter({
    routes: [{
            path: '/LogIn',
            component: LogIn
        },
        {
            path: '/banner',
            component: Banner,
            meta: { requiresAuth: true }
        },
        {
            path: '/homepage',
            component: HomePage,
            children: [
                { path: '', component: Home },
                { path: 'home', component: Home, meta: { requiresAuth: true } },
                { path: 'administrator', component: Administrator, meta: { requiresAuth: true } },
                { path: 'members', component: Members, meta: { requiresAuth: true } },
                {
                    path: 'requirement',
                    component: Requirement,
                    meta: { requiresAuth: true }
                },

                {
                    path: 'manage',
                    component: Manage,
                    children: [
                        { path: 'manageView', component: ManageView, meta: { requiresAuth: true } }
                    ]
                },
                {
                    path: 'test',
                    component: Test,
                    children: [
                        { path: 'testRun', component: TestRun, meta: { requiresAuth: true } },
                        { path: 'testLibrary', component: TestLibrary, meta: { requiresAuth: true } },
                        { path: 'TestRunGroupBy', component: TestRunGroupBy, meta: { requiresAuth: true } },
                        { path: 'TestRunTemplate', component: TestRunTemplate, meta: { requiresAuth: true } }
                    ]
                },
                {
                    path: 'development',
                    component: Development,
                    children: [
                        { path: 'boards', component: Boards, meta: { requiresAuth: true } },
                        { path: 'groupBy', component: GroupBy, meta: { requiresAuth: true } },
                        { path: 'list', component: List, meta: { requiresAuth: true } }
                    ]
                }
            ]
        },
        {
            path: '/',
            redirect: '/LogIn'
        }
    ]
});


router.beforeEach((to, from, next) => {
    if (to.matched.some(record => record.meta.requiresAuth)) {
        var token = sessionStorage.getItem('user_token');
        if (token != null) {
            //已经登陆
            next()
        } else {
            // 未登录,跳转到登陆页面
            next({ path: '/login', query: { redirect: to.fullPath } })
        }
    } else {
        next()
    }
})

export default router;