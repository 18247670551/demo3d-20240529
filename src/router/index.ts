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
import Plane0 from '@/views/demo/demo-plane/Index.vue'
import Plane2 from '@/views/demo/demo-plane2/Index.vue'
import DemoRoyalEsplanade from '@/views/demo/demo-royal-esplanade/Index.vue'
import DamagedHelmet from '@/views/demo/demo-damaged-helmet/Index.vue'
import SkyBox from '@/views/demo/demo-skybox/Index.vue'
import VRRoom from '@/views/demo/demo-vr-room/Index.vue'
import Island from '@/views/demo/demo-island/Index.vue'
import Island2 from '@/views/demo/demo-island2/Index.vue'
import Island3 from '@/views/demo/demo-island3/Index.vue'
import Waterfall from '@/views/demo/demo-waterfall/Index.vue'
import HeartBalloon from '@/views/demo/demo-heart-balloon/Index.vue'
import Csmart from '@/views/demo/demo-csmart/Index.vue'
import EarthMoon from '@/views/demo/demo-earthmoon/Index.vue'
import ShangHai from '@/views/demo/demo-shanghai/Index.vue'
import ShangHai2 from '@/views/demo/demo-shanghai2/Index.vue'
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
import Points0 from '@/views/demo/demo-points0/Index.vue'
import Points1 from '@/views/demo/demo-points1/Index.vue'
import Points2 from '@/views/demo/demo-points2/Index.vue'
import Points3 from '@/views/demo/demo-points3/Index.vue'
import Points4 from '@/views/demo/demo-points4/Index.vue'
import Points5 from '@/views/demo/demo-points5/Index.vue'
import Points6 from '@/views/demo/demo-points6/Index.vue'
import Points7 from '@/views/demo/demo-points7/Index.vue'
import Points8 from '@/views/demo/demo-points8/Index.vue'
import Points9 from '@/views/demo/demo-points9/Index.vue'
import Points10 from '@/views/demo/demo-points10/Index.vue'
import Text3D from '@/views/demo/demo-text3d/Index.vue'
import Fan from '@/views/demo/demo-fan/Index.vue'
import F18 from '@/views/demo/demo-f18/Index.vue'
import Forest from '@/views/demo/demo-forest/Index.vue'
import Models from '@/views/demo/demo-models/Index.vue'
import MyWorld from '@/views/demo/demo-my-world/Index.vue'
import Physics from '@/views/demo/demo-physics/Index.vue'
import Player from '@/views/demo/demo-player/Index.vue'
import WRWolf from '@/views/demo/demo-wolf-rabbit/demo-wolf/Index.vue'
import WRRabbit from '@/views/demo/demo-wolf-rabbit/demo-rabbit/Index.vue'
import WRHedgehog from '@/views/demo/demo-wolf-rabbit/demo-hedgehog/Index.vue'
import WRMap from '@/views/demo/demo-wolf-rabbit/demo-earth/Index.vue'
import WolfRabbit from '@/views/demo/demo-wolf-rabbit-失败/Index.vue'
import Photo3d from '@/views/demo/demo-photo3d/Index.vue'
import BufferGeometry from '@/views/demo/demo-geometry-buffer/Index.vue'
import MergedGeometry from '@/views/demo/demo-geometry-merged/Index.vue'
import Canvas1 from '@/views/demo/demo-canvas1/Index.vue'
import Canvas2 from '@/views/demo/demo-canvas2/Index.vue'
import Wall from '@/views/demo/demo-wall/Index.vue'
import Fire from '@/views/demo/demo-fire/Index.vue'
import PlaneFire from '@/views/demo/demo-fire2/Index.vue'
import ShaderWave from '@/views/demo/demo-shader-wave/Index.vue'
import ShaderLightCylinder from '@/views/demo/demo-shader-light-cylinder/Index.vue'
import PointTag from '@/views/demo/demo-animation-point-tag/Index.vue'
import Scene1 from '@/views/demo/demo-scene1/Index.vue'
import Scene2 from '@/views/demo/demo-scene2/Index.vue'
import Scene3 from '@/views/demo/demo-scene3/Index.vue'
import SceneHauntedHouse from '@/views/demo/demo-scene4/Index.vue'
import SceneSphereRobot from '@/views/demo/demo-scene-sphere-robot/Index.vue'
import TextureDoor from '@/views/demo/demo-texture-door/Index.vue'
import AnimationDoor from '@/views/demo/demo-animation-door/Index.vue'
import AnimationMagicCircle from '@/views/demo/demo-animation-magic-circle/Index.vue'
import AnimationTimeMachine from '@/views/demo/demo-animation-time-machine/Index.vue'
import AnimationMusicVisualize from '@/views/demo/demo-animation-music-visualize/Index.vue'

import MeshPyramidLogo from '@/views/demo/demo-mesh-pyramid-logo/Index.vue'
import MeshOlympicLogo from '@/views/demo/demo-mesh-olympic-logo/Index.vue'
import MeshSimpleTree from '@/views/demo/demo-mesh-simple-tree/Index.vue'


import ModelFootballField from '@/views/demo/demo-model-football-field/Index.vue'
import ModelTiger from '@/views/demo/demo-model-tiger/Index.vue'
import ModelFox from '@/views/demo/demo-model-fox/Index.vue'
import ModelBomb from '@/views/demo/demo-model-bomb/Index.vue'

import ModelSu7 from '@/views/demo/demo-model-su7/Index.vue'
import Raycaster from '@/views/demo/demo-raycaster/Index.vue'
import War from '@/views/demo/demo-war/Index.vue'
import Test from '@/views/demo/demo-test/Index.vue'

const routes: RouteRecordRaw[] = [

    {name: '示例-飞机', path: '/demo/plane', component: Plane0, meta: {title: "示例-飞机", isLogin: true}},
    {name: '示例-飞机2', path: '/demo/plane2', component: Plane2, meta: {title: "示例-飞机2", isLogin: true}},
    {name: '示例-损坏的头盔', path: '/demo/damagedhelmet', component: DamagedHelmet, meta: {title: "示例-损坏的头盔", isLogin: true}},
    {name: '示例-皇家滨海大道广场', path: '/demo/royal_esplanade', component: DemoRoyalEsplanade, meta: {title: "示例-皇家滨海大道广场", isLogin: true}},
    {name: '示例-天空盒', path: '/demo/demo-skybox', component: SkyBox, meta: {title: "示例-天空盒", isLogin: true}},
    {name: '示例-VR看房', path: '/demo/demo-vr-room', component: VRRoom, meta: {title: "示例-VR看房", isLogin: true}},
    {name: '示例-小岛', path: '/demo/demo-island', component: Island, meta: {title: "示例-小岛", isLogin: true}},
    {name: '示例-小岛2', path: '/demo/demo-island2', component: Island2, meta: {title: "示例-小岛2", isLogin: true}},
    {name: '示例-小岛3', path: '/demo/demo-island3', component: Island3, meta: {title: "示例-小岛3", isLogin: true}},
    {name: '示例-瀑布', path: '/demo/demo-waterfall', component: Waterfall, meta: {title: "示例-瀑布", isLogin: true}},
    {name: '示例-爱心气球', path: '/demo/demo-heart-balloon', component: HeartBalloon, meta: {title: "示例-爱心气球", isLogin: true}},
    {name: '示例-csmart', path: '/demo/demo-csmart', component: Csmart, meta: {title: "示例-csmart", isLogin: true}},
    {name: '示例-地月系统', path: '/demo/demo-earthmoon', component: EarthMoon, meta: {title: "示例-地月系统", isLogin: true}},
    {name: '示例-上海', path: '/demo/demo-shanghai', component: ShangHai, meta: {title: "示例-上海", isLogin: true}},
    {name: '示例-上海2', path: '/demo/demo-shanghai2', component: ShangHai2, meta: {title: "示例-上海2", isLogin: true}},
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



    {name: '示例-粒子简例0', path: '/demo/demo-points0', component: Points0, meta: {title: "示例-粒子简例0", isLogin: true}},
    {name: '示例-粒子简例1', path: '/demo/demo-points1', component: Points1, meta: {title: "示例-粒子简例1", isLogin: true}},
    {name: '示例-粒子简例2', path: '/demo/demo-points2', component: Points2, meta: {title: "示例-粒子简例2", isLogin: true}},
    {name: '示例-粒子简例3', path: '/demo/demo-points3', component: Points3, meta: {title: "示例-粒子简例3", isLogin: true}},
    {name: '示例-粒子简例4', path: '/demo/demo-points4', component: Points4, meta: {title: "示例-粒子简例4", isLogin: true}},
    {name: '示例-粒子简例5', path: '/demo/demo-points5', component: Points5, meta: {title: "示例-粒子简例5", isLogin: true}},
    {name: '示例-粒子简例6', path: '/demo/demo-points6', component: Points6, meta: {title: "示例-粒子简例6", isLogin: true}},
    {name: '示例-粒子简例7', path: '/demo/demo-points7', component: Points7, meta: {title: "示例-粒子简例7", isLogin: true}},
    {name: '示例-粒子简例8', path: '/demo/demo-points8', component: Points8, meta: {title: "示例-粒子简例8", isLogin: true}},
    {name: '示例-粒子简例9', path: '/demo/demo-points9', component: Points9, meta: {title: "示例-粒子简例9", isLogin: true}},
    {name: '示例-粒子简例10', path: '/demo/demo-points10', component: Points10, meta: {title: "示例-粒子简例10", isLogin: true}},



    {name: '示例-3d文字', path: '/demo/demo-text3d', component: Text3D, meta: {title: "示例-3d文字", isLogin: true}},
    {name: '示例-风扇', path: '/demo/demo-fan', component: Fan, meta: {title: "示例-风扇", isLogin: true}},
    {name: '示例-f18', path: '/demo/demo-park', component: F18, meta: {title: "示例-f18", isLogin: true}},
    {name: '示例-树林', path: '/demo/demo-forest', component: Forest, meta: {title: "示例-树林", isLogin: true}},
    {name: '示例-一些模型文件', path: '/demo/demo-models', component: Models, meta: {title: "示例-一些模型文件", isLogin: true}},
    {name: '示例-my-world', path: '/demo/demo-my-world', component: MyWorld, meta: {title: "示例-my-world", isLogin: true}},
    {name: '示例-物理引擎', path: '/demo/demo-physics', component: Physics, meta: {title: "示例-物理引擎", isLogin: true}},
    {name: '示例-人物控制', path: '/demo/demo-player', component: Player, meta: {title: "示例-人物控制", isLogin: true}},
    {name: '示例-狼兔项目--狼', path: '/demo/demo-wr-wolf', component: WRWolf, meta: {title: "示例-狼兔项目--狼", isLogin: true}},
    {name: '示例-狼兔项目--兔', path: '/demo/demo-wr-rabbit', component: WRRabbit, meta: {title: "示例-狼兔项目--兔", isLogin: true}},
    {name: '示例-狼兔项目--刺猬', path: '/demo/demo-wr-hedgehog', component: WRHedgehog, meta: {title: "示例-狼兔项目--刺猬", isLogin: true}},
    {name: '示例-狼兔项目--地球', path: '/demo/demo-wr-earth', component: WRMap, meta: {title: "示例-狼兔项目--地球", isLogin: true}},
    {name: '示例-狼兔项目', path: '/demo/demo-wolf-rabbit', component: WolfRabbit, meta: {title: "示例-狼兔项目", isLogin: true}},
    {name: '示例-用图片生成3D效果', path: '/demo/demo-photo3d', component: Photo3d, meta: {title: "示例-用图片生成3D效果", isLogin: true}},
    {name: '示例-缓冲几何体', path: '/demo/demo-geometry-buffer', component: BufferGeometry, meta: {title: "示例-缓冲几何体", isLogin: true}},
    {name: '示例-合并几何体', path: '/demo/demo-geometry-merged', component: MergedGeometry, meta: {title: "示例-合并几何体", isLogin: true}},
    {name: '示例-流光墙', path: '/demo/demo-wall', component: Wall, meta: {title: "示例-流光墙", isLogin: true}},
    {name: '示例-火焰', path: '/demo/demo-fire', component: Fire, meta: {title: "示例-火焰", isLogin: true}},
    {name: '示例-平面火焰', path: '/demo/demo-fire2', component: PlaneFire, meta: {title: "示例-平面火焰", isLogin: true}},


    {name: '示例-shader-波动', path: '/demo/demo-shader-wave', component: ShaderWave, meta: {title: "示例-shader-波动", isLogin: true}},
    {name: '示例-shader-光环柱', path: '/demo/demo-shader-light-cylinder', component: ShaderLightCylinder, meta: {title: "示例-shader-光环柱", isLogin: true}},
    {name: '示例-点标记', path: '/demo/demo-animation-point-tag', component: PointTag, meta: {title: "示例-点标记", isLogin: true}},


    {name: '示例-简单场景1', path: '/demo/demo-scene1', component: Scene1, meta: {title: "示例-简单场景1", isLogin: true}},
    {name: '示例-简单场景2', path: '/demo/demo-scene2', component: Scene2, meta: {title: "示例-简单场景2", isLogin: true}},
    {name: '示例-简单场景3', path: '/demo/demo-scene3', component: Scene3, meta: {title: "示例-简单场景3", isLogin: true}},
    {name: '示例-简单场景4', path: '/demo/demo-scene4', component: SceneHauntedHouse, meta: {title: "示例-简单场景4", isLogin: true}},
    {name: '示例-简单场景5', path: '/demo/demo-scene-sphere-robot', component: SceneSphereRobot, meta: {title: "示例-简单场景5", isLogin: true}},

    {name: '示例-材质示例1', path: '/demo/demo-texture-door', component: TextureDoor, meta: {title: "示例-材质示例1", isLogin: true}},

    {name: '示例-动画--门', path: '/demo/demo-animation-door', component: AnimationDoor, meta: {title: "示例-动画--门", isLogin: true}},
    {name: '示例-动画--魔法阵', path: '/demo/demo-animation-magic-circle', component: AnimationMagicCircle, meta: {title: "示例-动画--魔法阵", isLogin: true}},
    {name: '示例-动画--时光机', path: '/demo/demo-animation-time-machine', component: AnimationTimeMachine, meta: {title: "示例-动画--时光机", isLogin: true}},
    {name: '示例-动画--音乐可视化', path: '/demo/demo-animation-music-visualize', component: AnimationMusicVisualize, meta: {title: "示例-动画--音乐可视化", isLogin: true}},


    {name: '示例-金字塔logo', path: '/demo/demo-mesh-pyramid-logo', component: MeshPyramidLogo, meta: {title: "示例-金字塔logo", isLogin: true}},
    {name: '示例-奥运会logo', path: '/demo/demo-mesh-olympic-logo', component: MeshOlympicLogo, meta: {title: "示例-奥运会logo", isLogin: true}},
    {name: '示例-简易树', path: '/demo/demo-mesh-simple-tree', component: MeshSimpleTree, meta: {title: "示例-简易树", isLogin: true}},

    {name: '示例-模型-足球场', path: '/demo/demo-model-football-field', component: ModelFootballField, meta: {title: "示例-模型-足球场", isLogin: true}},
    {name: '示例-模型-老虎', path: '/demo/demo-model-tiger', component: ModelTiger, meta: {title: "示例-模型-老虎", isLogin: true}},
    {name: '示例-模型-狐狸', path: '/demo/demo-model-fox', component: ModelFox, meta: {title: "示例-模型-狐狸", isLogin: true}},
    {name: '示例-模型-小米su7', path: '/demo/demo-model-su7', component: ModelSu7, meta: {title: "示例-模型-小米su7", isLogin: true}},
    {name: '示例-模型-爆炸效果', path: '/demo/demo-model-bomb', component: ModelBomb, meta: {title: "示例-模型-爆炸效果", isLogin: true}},


    {name: '示例-射线选中物体', path: '/demo/demo-raycaster', component: Raycaster, meta: {title: "示例-射线选中物体", isLogin: true}},
    {name: '示例-俄乌战争', path: '/demo/demo-war', component: War, meta: {title: "示例-俄乌战争", isLogin: true}},
    {name: '示例-canvas1', path: '/demo/demo-canvas1', component: Canvas1, meta: {title: "示例-canvas1", isLogin: true}},
    {name: '示例-canvas2', path: '/demo/demo-canvas2', component: Canvas2, meta: {title: "示例-canvas2", isLogin: true}},
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