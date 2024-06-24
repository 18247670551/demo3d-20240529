

const demos : {name: string, path: string}[] = [
    {name: '天空盒-单张贴图', path: 'mesh-skybox-image'},
    {name: '天空盒-房间3d', path: 'mesh-skybox-room3d'},
    {name: '天空盒-皇家滨海大道广场', path: 'mesh-skybox-royal-esplanade'},

    {name: '模型-球形机器人', path: 'model-sphere-robot'},
    {name: '模型-小岛1', path: 'model-island1'},
    {name: '模型-小岛2', path: 'model-island2'},
    {name: '模型-小岛3', path: 'model-island3'},
    {name: '模型-csmart', path: 'model-csmart'},
    {name: '模型-损坏的头盔', path: 'model-damaged-helmet'},
    {name: '模型-风扇', path: 'model-fan'},
    {name: '模型-f18', path: 'model-f18'},
    {name: '模型-足球场', path: 'model-football-field'},
    {name: '模型-老虎', path: 'model-tiger'},
    {name: '模型-狐狸', path: 'model-fox'},
    {name: '模型-小米su7', path: 'model-su7'},
    {name: '模型-一些模型文件', path: 'model-some'},



    {name: '粒子-简单示例1', path: 'mesh-points-simple1'},
    {name: '粒子-下雨', path: 'mesh-points-rain'},
    {name: '粒子-雪花', path: 'mesh-points-snow'},
    {name: '粒子-银河系', path: 'mesh-points-galaxy'},
    {name: '粒子-shader1', path: 'mesh-points-shader1'},
    {name: '粒子-烟花', path: 'mesh-points-fireworks'},
    {name: '粒子-彩虹雨', path: 'mesh-points-rainbow-rain'},
    {name: '粒子-倒计时', path: 'mesh-points-countdown'},
    {name: '粒子-波动', path: 'mesh-points-wave'},
    {name: '粒子-太阳', path: 'mesh-points-sun'},



    {name: '缓冲几何体', path: 'mesh-geometry-buffer'},
    {name: '合并几何体', path: 'mesh-geometry-merged'},

    {name: '3d文字', path: 'mesh-text3d'},
    {name: '树林', path: 'mesh-sprite-forest'},
    {name: '金字塔logo', path: 'mesh-pyramid-logo'},
    {name: '奥运会logo', path: 'mesh-olympic-logo'},
    {name: '简易树', path: 'mesh-simple-tree'},
    {name: '用图片生成3D效果', path: 'mesh-photo3d'},
    {name: '房子', path: 'mesh-house'},
    {name: '材质示例-门', path: 'mesh-texture-door'},


    {name: '动画--门', path: 'mesh-animation-door'},
    {name: '动画--魔法阵', path: 'mesh-animation-magic-circle'},
    {name: '动画--时光机', path: 'mesh-animation-time-machine'},
    {name: '动画--音乐可视化', path: 'mesh-animation-music-visualize'},
    {name: '动画-流光墙', path: 'mesh-animation-light-wall'},
    {name: '动画-火焰', path: 'mesh-animation-fire'},
    {name: '动画-点标记', path: 'mesh-animation-point-tag'},
    {name: '动画-地月系统', path: 'mesh-animation-earthmoon'},
    {name: '动画-萤火虫', path: 'mesh-animation-firefly'},
    {name: '动画-曲线运动', path: 'mesh-animation-curve'},
    {name: '动画-管道流动', path: 'mesh-animation-pipe0'},
    {name: '动画-飞机', path: 'mesh-animation-airplane'},
    {name: '动画-俄乌战争', path: 'mesh-animation-war'},
    {name: '动画-爆炸效果', path: 'mesh-animation-model-bomb'},

    {name: 'shader-火焰', path: 'mesh-shader-fire'},
    {name: 'shader-太阳', path: 'mesh-shader-sun'},
    {name: 'shader-光环柱', path: 'mesh-shader-light-cylinder'},
    {name: 'shader-交通灯', path: 'mesh-shader-traffic-lights'},
    {name: 'shader-波动1', path: 'mesh-shader-wave1'},
    {name: 'shader-波动2', path: 'mesh-shader-wave2'},
    {name: 'shader-波动3', path: 'mesh-shader-wave3'},


    {name: '瀑布', path: 'scene-waterfall'},
    {name: '爱心气球', path: 'scene-heart-balloon'},
    {name: '上海', path: 'scene-shanghai'},
    {name: 'my-world', path: 'scene-my-world'},
    {name: '物理引擎', path: 'scene-physics'},
    {name: '人物控制', path: 'scene-player'},

    {name: '烘干车间', path: 'scene-ming-dry'},
    {name: '洗消车间', path: 'scene-ming-wash'},
    {name: '净水车间', path: 'scene-ming-purity'},
    {name: '净水车间2', path: 'scene-ming-purity2'},
    {name: '除臭车间简例', path: 'scene-ming-deodorize0'},
    {name: '除臭车间', path: 'scene-ming-deodorize'},
    {name: '除臭车间2', path: 'scene-ming-deodorize2'},


    {name: '游戏-飞机', path: 'game-airplane'},
    {name: '游戏-狼兔项目--狼', path: 'game-wr-wolf'},
    {name: '游戏-狼兔项目--兔', path: 'game-wr-rabbit'},
    {name: '游戏-狼兔项目--刺猬', path: 'game-wr-hedgehog'},
    {name: '游戏-狼兔项目--地球', path: 'game-wr-earth'},
    {name: '游戏-狼兔项目', path: 'game-wolf-rabbit'},


    {name: '镜头跟随', path: 'scene-camera-flow'},
    {name: '射线选中物体', path: 'scene-raycaster'},
    {name: '过山车', path: 'scene-roller-coaster'},
    {name: '鬼屋', path: 'scene-haunted-house'},
    {name: '智慧城市', path: 'scene-smart-city'},


    {name: 'canvas-绚烂粒子特效', path: 'canvas-animation-points1'},
    {name: 'canvas-字母喷泉', path: 'canvas-animation-letter-fountain'},


    {name: 'cesium-简例', path: 'cesium-simple-first'},

    {name: '测试页面', path: '_test'},

]

export default demos