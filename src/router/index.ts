import {createRouter, createWebHashHistory, RouteRecordRaw} from 'vue-router'

import Login from '@/views/login/Index.vue'
import Home from '@/views/home/Index.vue'
import Index from '@/views/index/Index.vue'
import Page400 from "@/views/components/error-page/page400/Index.vue"
import Page404 from "@/views/components/error-page/page404/Index.vue"
import Empty from '@/views/empty/Index.vue'
import Protocol from '@/views/protocol/Index.vue'
import WxUserProtocol from '@/views/protocol/wx-user-protocol/Index.vue'

import DemoList from '@/views/demo/_list/Index.vue'
import demos from "@/router/demos"

// import Test from '@/views/demo/_demo-test/Index.vue'

const routes: RouteRecordRaw[] = [

    //{name: '测试页面', path: '/demo-_test', component: () => import('@/views/demo/_test/Index.vue'), meta: {title: "测试页面", isLogin: true}},

    {name: '微信用户协议', path: '/wx-user-protocol', component: WxUserProtocol, meta: {isLogin: true}},
    {name: '登录', path: '/login', component: Login, meta: {isLogin: false}},
    {name: '首页', path: '/', component: Home, meta: {isLogin: true}, redirect: 'index',
        children: [
            {name: '总览', path: '/index', component: Index},
            {name: '占位页面', path: '/empty', component: Empty},
            {name: '平台协议', path: '/protocol', component: Protocol},
            {name: '示例列表', path: '/demo/list', component: DemoList, meta: {isLogin: true}},

            {name: 'page400', path: '/busy', component: Page400},
            {name: 'page404', path: '/:pathMatch(.*)*', component: Page404},
        ]
    },
    {name: 'page400', path: '/busy', component: Page400},
    {name: 'page404', path: '/:pathMatch(.*)*', component: Page404},
]

const demoRoutes = demos.map(demo => {
    return {
        name: demo.name,
        path: "/demo-" + demo.path,
        component: () => import(`@/views/demo/${demo.path}/Index.vue`),
        meta: {title: demo.name, isLogin: true},
    }
})


const router = createRouter({
    history: createWebHashHistory(),
    routes: routes.concat(demoRoutes),
})

// 路由守卫
router.beforeEach((to, _, next) => {
    // 进度条插件
    // NProgress.start()

    if(to.meta.title){
        // @ts-ignore 改变网页标签名
        document.title = to.meta.title
    }

    if (to.meta.isLogin) {

        // todo 调试期不做登录拦截
        next()

        //if (useUserStore().isLogin()) {
        //    next()
        //} else {
        //    next('/login')
        //}
    } else {
        next()
    }
})

router.afterEach(() => {
    // 进度条插件
    // NProgress.done()
})

export default router