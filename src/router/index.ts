import {createRouter, createWebHashHistory, RouteRecordRaw} from 'vue-router'
import {useUserStore} from "@/store/userStore"

import Login from '@/views/login/Index.vue'
import Home from '@/views/home/Index.vue'
import Index from '@/views/index/Index.vue'
import Page400 from "@/views/components/error-page/page400/Index.vue"
import Page404 from "@/views/components/error-page/page404/Index.vue"
import Empty from '@/views/empty/Index.vue'
import Protocol from '@/views/protocol/Index.vue'
import WxUserProtocol from '@/views/protocol/wx-user-protocol/Index.vue'
import DemoList from '@/views/demo/list/Index.vue'
import DemoPlane from '@/views/demo/demo-plane/Index.vue'
import DemoRoyalEsplanade from '@/views/demo/demo-royal-esplanade/Index.vue'
import DamagedHelmet from '@/views/demo/demo-damaged-helmet/Index.vue'
import RainbowRain from '@/views/demo/demo-rainbow-rain/Index.vue'
import SkyBox from '@/views/demo/demo-skybox/Index.vue'
import VRRoom from '@/views/demo/demo-vr-room/Index.vue'
import Island from '@/views/demo/demo-island/Index.vue'
import Island2 from '@/views/demo/demo-island2/Index.vue'
import Island3 from '@/views/demo/demo-island3/Index.vue'
import Waterfall from '@/views/demo/demo-waterfall/Index.vue'
import HeartBalloon from '@/views/demo/demo-heart-balloon/Index.vue'
import Csmart from '@/views/demo/demo-csmart/Index.vue'
import EarthMoon from '@/views/demo/demo-earth-moon/Index.vue'
import ShangHai from '@/views/demo/demo-shanghai/Index.vue'
import Firefly from '@/views/demo/demo-firefly/Index.vue'
import DryRoom from '@/views/demo/demo-dry/Index.vue'
import WashRoom from '@/views/demo/demo-wash/Index.vue'
import Purity from '@/views/demo/demo-purity/Index.vue'
import Purity2 from '@/views/demo/demo-purity2/Index.vue'
import Deodorize0 from '@/views/demo/demo-deodorize0/Index.vue'
import Deodorize from '@/views/demo/demo-deodorize/Index.vue'
import Deodorize2 from '@/views/demo/demo-deodorize2/Index.vue'
import Curve from '@/views/demo/demo-curve/Index.vue'
import Pipe0 from '@/views/demo/demo-pipe0/Index.vue'
import Water0 from '@/views/demo/demo-water0/Index.vue'
import Rain0 from '@/views/demo/demo-rain0/Index.vue'
import Points1 from '@/views/demo/demo-points1/Index.vue'
import Points2 from '@/views/demo/demo-points2/Index.vue'
import Points3 from '@/views/demo/demo-points3/Index.vue'
import Fan from '@/views/demo/demo-fan/Index.vue'
import F18 from '@/views/demo/demo-f18/Index.vue'
import Forest from '@/views/demo/demo-forest/Index.vue'
import Models from '@/views/demo/demo-models/Index.vue'
import MyWorld from '@/views/demo/demo-my-world/Index.vue'
import Test from '@/views/demo/demo-test/Index.vue'

const routes: RouteRecordRaw[] = [

    {name: '示例-飞机', path: '/demo/plane', component: DemoPlane, meta: {title: "示例-飞机", isLogin: true}},
    {name: '示例-损坏的头盔', path: '/demo/damagedhelmet', component: DamagedHelmet, meta: {title: "示例-损坏的头盔", isLogin: true}},
    {name: '示例-皇家滨海大道广场', path: '/demo/royal_esplanade', component: DemoRoyalEsplanade, meta: {title: "示例-皇家滨海大道广场", isLogin: true}},
    {name: '示例-彩虹雨', path: '/demo/demo-rainbowrain', component: RainbowRain, meta: {title: "示例-彩虹雨", isLogin: true}},
    {name: '示例-天空盒', path: '/demo/demo-skybox', component: SkyBox, meta: {title: "示例-天空盒", isLogin: true}},
    {name: '示例-VR看房', path: '/demo/demo-vr-room', component: VRRoom, meta: {title: "示例-VR看房", isLogin: true}},
    {name: '示例-小岛', path: '/demo/demo-island', component: Island, meta: {title: "示例-小岛", isLogin: true}},
    {name: '示例-小岛2', path: '/demo/demo-island2', component: Island2, meta: {title: "示例-小岛2", isLogin: true}},
    {name: '示例-小岛3', path: '/demo/demo-island3', component: Island3, meta: {title: "示例-小岛3", isLogin: true}},
    {name: '示例-瀑布', path: '/demo/demo-waterfall', component: Waterfall, meta: {title: "示例-瀑布", isLogin: true}},
    {name: '示例-爱心气球', path: '/demo/demo-heart-balloon', component: HeartBalloon, meta: {title: "示例-爱心气球", isLogin: true}},
    {name: '示例-csmart', path: '/demo/demo-csmart', component: Csmart, meta: {title: "示例-csmart", isLogin: true}},
    {name: '示例-地月系统', path: '/demo/demo-earth-moon', component: EarthMoon, meta: {title: "示例-地月系统", isLogin: true}},
    {name: '示例-上海', path: '/demo/demo-shanghai', component: ShangHai, meta: {title: "示例-上海", isLogin: true}},
    {name: '示例-萤火虫动画', path: '/demo/demo-firefly', component: Firefly, meta: {title: "示例-萤火虫动画", isLogin: true}},
    {name: '示例-烘干车间', path: '/demo/demo-dry', component: DryRoom, meta: {title: "示例-烘干车间", isLogin: true}},
    {name: '示例-洗消车间', path: '/demo/demo-wash', component: WashRoom, meta: {title: "示例-洗消车间", isLogin: true}},
    {name: '示例-净水车间', path: '/demo/demo-purity', component: Purity, meta: {title: "示例-净水车间", isLogin: true}},
    {name: '示例-净水车间2', path: '/demo/demo-purity2', component: Purity2, meta: {title: "示例-净水车间2", isLogin: true}},
    {name: '示例-除臭车间简例', path: '/demo/demo-deodorize0', component: Deodorize0, meta: {title: "示例-除臭车间简例", isLogin: true}},
    {name: '示例-除臭车间', path: '/demo/demo-deodorize', component: Deodorize, meta: {title: "示例-除臭车间", isLogin: true}},
    {name: '示例-除臭车间2', path: '/demo/demo-deodorize2', component: Deodorize2, meta: {title: "示例-除臭车间2", isLogin: true}},
    {name: '示例-曲线动画', path: '/demo/demo-curve', component: Curve, meta: {title: "示例-曲线动画", isLogin: true}},
    {name: '示例-管道简例', path: '/demo/demo-pipe0', component: Pipe0, meta: {title: "示例-管道简例", isLogin: true}},
    {name: '示例-水面简例', path: '/demo/demo-water0', component: Water0, meta: {title: "示例-水面简例", isLogin: true}},
    {name: '示例-下雨简例', path: '/demo/demo-rain0', component: Rain0, meta: {title: "示例-下雨简例", isLogin: true}},
    {name: '示例-粒子简例1', path: '/demo/demo-points1', component: Points1, meta: {title: "示例-粒子简例1", isLogin: true}},
    {name: '示例-粒子简例2', path: '/demo/demo-points2', component: Points2, meta: {title: "示例-粒子简例2", isLogin: true}},
    {name: '示例-粒子简例3', path: '/demo/demo-points3', component: Points3, meta: {title: "示例-粒子简例3", isLogin: true}},
    {name: '示例-风扇', path: '/demo/demo-fan', component: Fan, meta: {title: "示例-风扇", isLogin: true}},
    {name: '示例-f18', path: '/demo/demo-park', component: F18, meta: {title: "示例-f18", isLogin: true}},
    {name: '示例-树林', path: '/demo/demo-forest', component: Forest, meta: {title: "示例-树林", isLogin: true}},
    {name: '示例-一些模型文件', path: '/demo/demo-models', component: Models, meta: {title: "示例-一些模型文件", isLogin: true}},
    {name: '示例-my-world', path: '/demo/demo-my-world', component: MyWorld, meta: {title: "示例-my-world", isLogin: true}},
    {name: '测试页面', path: '/demo/demo-test', component: Test, meta: {title: "测试页面", isLogin: true}},



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

const router = createRouter({
    history: createWebHashHistory(),
    routes
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
        if (useUserStore().isLogin()) {
            next()
        } else {
            next('/login')
        }
    } else {
        next()
    }
})

router.afterEach(() => {
    // 进度条插件
    // NProgress.done()
})

export default router