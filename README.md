# vue3 + threejs

#

#### 1. 演示项目, 主要针对初学者学习 vue3 和 threejs
#### 2. 项目使用 ts, 基本的 vue组件都有, axios, pinia
#### 3. 有本人个人常用写好的样式文件包sass样式, 自定义的常用组件 等, 封装为插件方式引用
#### 4. 所有依赖包对当前时间 2024-05-30 都是较新或最新版本号
#### 5. threejs案例部分自己写的, 部分来自网络案例经过重构, 以对象方式封装
#### 6. 案例尽量找以代码建模案例, 方便学习, 引入3D模型文件的只做个别案例演示
#### 7. 目前案例较少, 本人自己项目还有一些案例会开源, 代码要做些调整, 后续慢慢添加上来
#### 8. 各种方式收集的案例, 原作者和来源当时没记, 所有非本人写的案例只标注了来源网络, 未写原作者名
#### 9. 如果打开有黑屏或白屏现象可能模型文件较大, 请稍等, 后续会优化代码加上加载进度条, 长时间等待无果请刷新页面

#

### 本地运行
```bash
// 克隆项目
git clone https://gitee.com/gitee18247670551/demo3d-20240529.git

// 安装依赖包
npm install

// 运行项目
npm run dev
```

#
### 在线体验
### http://demo3d.ycrlkj.com/

#
#### 示例总览
![preview](public/demo/__case-cover/__preview.png)




#
#### 示例: 天空盒
#### 单贴图
![preview](public/demo/__case-cover/mesh-skybox-image.png)

#
#### 示例: 天空盒-房间3d
![preview](public/demo/__case-cover/mesh-skybox-room3d.png)


#
#### 示例: 天空盒-皇家滨海大道广场
#### hdr材质
![preview](public/demo/__case-cover/mesh-skybox-royal-esplanade.png)







#
#### 示例: 模型-球形机器人
![preview](public/demo/__case-cover/model-sphere-robot.png)

#
#### 示例: 模型-小岛1
![preview](public/demo/__case-cover/model-island1.png)

#
#### 示例: 模型-小岛2
![preview](public/demo/__case-cover/model-island2.png)

#
#### 示例: 模型-小岛3
![preview](public/demo/__case-cover/model-island3.png)

#
#### 示例: csmart
![preview](public/demo/__case-cover/model-csmart.png)

#
#### 示例: 模型-损坏的头盔
![preview](public/demo/__case-cover/model-damaged-helmet.png)

#
#### 示例: 模型-风扇
![preview](public/demo/__case-cover/model-fan.png)

#
#### 示例: 模型-F18
![preview](public/demo/__case-cover/model-f18.png)

#
#### 示例: 模型-足球场
![preview](public/demo/__case-cover/model-football-field.png)

#
#### 示例: 模型-老虎
![preview](public/demo/__case-cover/model-tiger.png)

#
#### 示例: 模型-狐狸
![preview](public/demo/__case-cover/model-fox.png)

#
#### 示例: 模型-小米su7
![preview](public/demo/__case-cover/model-su7.png)

#
#### 示例: 模型-一些模型文件
![preview](public/demo/__case-cover/model-some.png)









#
#### 示例: 粒子-简单示例1
![preview](public/demo/__case-cover/mesh-points-simple1.png)

#
#### 示例: 粒子-下雨
![preview](public/demo/__case-cover/mesh-points-rain.png)

#
#### 示例: 粒子-雪花
![preview](public/demo/__case-cover/mesh-points-snow.png)

#
#### 示例: 粒子-银河系
![preview](public/demo/__case-cover/mesh-points-galaxy.png)

#
#### 示例: 粒子-shader1
![preview](public/demo/__case-cover/mesh-points-shader1.png)

#
#### 示例: 粒子-烟花
![preview](public/demo/__case-cover/mesh-points-fireworks.png)

#
#### 示例: 粒子-彩虹雨
![preview](public/demo/__case-cover/mesh-points-rainbow-rain.png)

#
#### 示例: 粒子-倒计时
![preview](public/demo/__case-cover/mesh-points-countdown.png)

#
#### 示例: 粒子-波动
##### 来源网络, 作者 郭先生的博客
##### https://www.cnblogs.com/vadim-web/p/13444198.html
![preview](public/demo/__case-cover/mesh-points-wave.png)

#
#### 示例: 粒子-太阳
##### 来源网络, csdn 作者 Jedi Hongbin
##### https://blog.csdn.net/printf_hello/article/details/127901103
![preview](public/demo/__case-cover/mesh-points-sun.png)






#
#### 示例: 缓冲几何体
![preview](public/demo/__case-cover/mesh-geometry-buffer.png)

#
#### 示例: 合并几何体
![preview](public/demo/__case-cover/mesh-geometry-merged.png)



#
#### 示例: 3d文字
![preview](public/demo/__case-cover/mesh-text3d.png)

#
#### 示例: 树林
#### 树木全是精灵材质
![preview](public/demo/__case-cover/mesh-sprite-forest.png)

#
#### 示例: 金字塔logo
![preview](public/demo/__case-cover/mesh-pyramid-logo.png)

#
#### 示例: 奥运会logo
![preview](public/demo/__case-cover/mesh-olympic-logo.png)

#
#### 示例: 简易树
#### 由多个平面贴图交叉生成
![preview](public/demo/__case-cover/mesh-simple-tree.png)

#
#### 示例: 用图片生成3D效果
#### 景深图片是随意生成的, 效果不好
![preview](public/demo/__case-cover/mesh-photo3d.png)

#
#### 示例: 材质示例-门
![preview](public/demo/__case-cover/mesh-texture-door.png)

#
#### 示例: 房子, 有开门动画
![preview](public/demo/__case-cover/mesh-house.png)




#
#### 示例: 动画--门
![preview](public/demo/__case-cover/mesh-animation-door.png)

#
#### 示例: 动画--魔法阵
#### 来源: csdn 作者 ~在水一方
#### https://blog.csdn.net/qq_40147088/article/details/128418022
![preview](public/demo/__case-cover/mesh-animation-magic-circle.png)

#
#### 示例: 动画--时光机
#### 来源: 稀土掘金 作者 zxg_神说要有光
#### https://juejin.cn/post/7258319655285178428
![preview](public/demo/__case-cover/mesh-animation-time-machine.png)

#
#### 示例: 动画--音乐可视化
#### 来源: 稀土掘金 作者 zxg_神说要有光
#### https://mp.weixin.qq.com/s?__biz=Mzg3OTYzMDkzMg==&mid=2247486665&idx=1&sn=6dee71f9b99c49c89590174a24a8a96e&chksm=cf00c3f2f8774ae46dcbc886fded5c36a835730d2c0813975864c3a9faa1748c106886733e53&token=475014312&lang=zh_CN#rd
![preview](public/demo/__case-cover/mesh-animation-music-visualize.png)

#
#### 示例: 动画--流光墙
![preview](public/demo/__case-cover/mesh-animation-light-wall.png)

#
#### 示例: 动画--火焰
#### 关键帧动画
![preview](public/demo/__case-cover/mesh-animation-fire.png)

#
#### 示例: 动画--点标记
#### 来源 csdn 作者 焦焦焦焦焦
#### https://blog.csdn.net/weixin_60645637/article/details/135520320
![preview](public/demo/__case-cover/mesh-animation-point-tag.png)

#
#### 示例: 动画--地月系统
![preview](public/demo/__case-cover/mesh-animation-earthmoon.png)

#
#### 示例: 动画--萤火虫
![preview](public/demo/__case-cover/mesh-animation-firefly.png)

#
#### 示例: 动画--曲线运动
![preview](public/demo/__case-cover/mesh-animation-curve.png)

#
#### 示例: 动画--管道流动
![preview](public/demo/__case-cover/mesh-animation-pipe0.png)

#
#### 示例: 动画--飞机
![preview](public/demo/__case-cover/mesh-animation-airplane.png)

#
#### 示例: 动画--俄乌战争
![preview](public/demo/__case-cover/mesh-animation-war.png)

#
#### 示例: 动画--爆炸效果
![preview](public/demo/__case-cover/mesh-animation-model-bomb.png)





#
#### 示例: shader-火焰
![preview](public/demo/__case-cover/mesh-shader-fire.png)

#
#### 示例: shader-太阳
#### 用最新版three重写失败, 附上作者原文
#### 来源 ice-图形学社区 作者 Jsonco
#### https://www.icegl.cn/ask/article/28.html
![preview](public/demo/__case-cover/mesh-shader-sun.png)

#
#### 示例: shader-光环柱
![preview](public/demo/__case-cover/mesh-shader-light-cylinder.png)

#
#### 示例: shader-交通灯
#### 来源 郭先生的博客
#### https://cloud.tencent.com/developer/article/1689743?from_column=20421&from=20421
![preview](public/demo/__case-cover/mesh-shader-traffic-lights.png)


#
#### 示例: shader-波动1
![preview](public/demo/__case-cover/mesh-shader-wave1.png)

#
#### 示例: shader-波动2
![preview](public/demo/__case-cover/mesh-shader-wave2.png)

#
#### 示例: shader-波动3
![preview](public/demo/__case-cover/mesh-shader-wave3.png)



#
#### 示例: 瀑布
![preview](public/demo/__case-cover/scene-waterfall.png)

#
#### 示例: 爱心气球
![preview](public/demo/__case-cover/scene-heart-balloon.png)

#
#### 示例: 上海
##### 来源网络, 出自稀土掘金 作者 Funky_Tiger
##### 本人重构, 原代码threejs版本较低, 改为最新版本164, 弯曲的楼贴图有bug, 代码中有标出
##### 原地址 https://juejin.cn/post/6844903957416902669
![preview](public/demo/__case-cover/scene-shanghai.png)

#
#### 示例: my-world
##### 来源网络, csdn 作者 X01动力装甲
##### https://webgl.blog.csdn.net/article/details/83965754
![preview](public/demo/__case-cover/scene-my-world.png)

#
#### 示例: 物理引擎
![preview](public/demo/__case-cover/scene-physics.png)

#
#### 示例: 人物控制
![preview](public/demo/__case-cover/scene-player.png)





#
#### 示例: 烘干车间
![preview](public/demo/__case-cover/scene-ming-dry.png)

#
#### 示例: 洗消车间
![preview](public/demo/__case-cover/scene-ming-wash.png)

#
#### 示例: 净水车间
![preview](public/demo/__case-cover/scene-ming-purity.png)

#
#### 示例: 净水车间2
![preview](public/demo/__case-cover/scene-ming-purity2.png)

#
#### 示例: 除臭车间简例
![preview](public/demo/__case-cover/scene-ming-deodorize0.png)

#
#### 示例: 除臭车间
![preview](public/demo/__case-cover/scene-ming-deodorize.png)

#
#### 示例: 除臭车间2
![preview](public/demo/__case-cover/scene-ming-deodorize2.png)




#
#### 示例: 镜头跟随
![preview](public/demo/__case-cover/scene-camera-flow.png)

#
#### 示例: 射线选中物体
![preview](public/demo/__case-cover/scene-raycaster.png)

#
#### 示例: 过山车
#### 可编辑轨道
![preview](public/demo/__case-cover/scene-roller-coaster.png)

#
#### 示例: 鬼屋
#### 来源: csdn 作者 sayid760
#### https://blog.csdn.net/qq_14993375/article/details/125240762
![preview](public/demo/__case-cover/scene-haunted-house.png)

#
#### 示例: 智慧城市
![preview](public/demo/__case-cover/scene-smart-city.png)











#
#### 示例: 游戏-飞机
![preview](public/demo/__case-cover/game-airplane.png)

#
#### 示例: 游戏-狼兔游戏--狼
![preview](public/demo/__case-cover/game-wolf-rabbit-wolf.png)

#
#### 示例: 游戏-狼兔游戏--兔
![preview](public/demo/__case-cover/game-wolf-rabbit-rabbit.png)

#
#### 示例: 游戏-狼兔游戏--刺猬
![preview](public/demo/__case-cover/game-wolf-rabbit-hedgehog.png)

#
#### 示例: 游戏-狼兔游戏--地球
![preview](public/demo/__case-cover/game-wolf-rabbit-earth.png)

#
#### 示例: 游戏-狼兔游戏
#### 用最新版three重构失败
![preview](public/demo/__case-cover/game-wolf-rabbit.png)




#
#### 示例: cesium-简例
#### cesium.js 的一个简单示例
![preview](public/demo/__case-cover/cesium-simple-first.png)




#
#### 示例: canvas-绚烂粒子特效
![preview](public/demo/__case-cover/canvas-animation-points1.png)

#
#### 示例: canvas-字母喷泉
![preview](public/demo/__case-cover/canvas-animation-letter-fountain.png)




# 源码文件夹

#### 1. 网络上搜集来的源码没保留原作者注释或信息, 网络案例大多都比较老旧, threejs新版本与旧版本改动较大, 本项目整理过的网络案例, 源码经过重构, 改成ts, 改成对象化
#### 2. 无意抄袭删除原作者, 如果介意, 请留言, 本人会添加原作者信息或删除
#### 3. 本项目 _doc 目录下, 附上了本人搜集来的网络案例源码包, 如有侵权, 请联系本人删除
#### 4. 附带的网络案例和本人重构失败案例, 如果有兴趣重构(基于three最新版本, ts对象化封装)并愿意开源的, 可以加qq好友402337325共同学习, 更新代码