# vue3 + threejs

#

#### 1. 演示项目, 主要针对初学者学习 vue3 和 threejs
#### 2. 项目使用 ts, 基本的 vue组件都有, axios, pinia
#### 3. 有本人个人常用写好的样式文件包sass样式, 自定义的常用组件 等, 封装为插件方式引用
#### 4. 所有依赖包对当前时间 2024-05-30 都是较新或最新版本号
#### 5. threejs案例部分自己写的, 部分来自网络, 自己写的优先以对象方式封装, 方便调用, 网络示例有些代码稍作调整, 改为ts
#### 6. 案例尽量找以代码建模案例, 方便学习, 引入3D模型文件的只做个别案例演示
#### 7. 目前案例较少, 本人自己项目还有一些案例会开源, 代码要做些调整, 后续慢慢添加上来
#### 8. 各种方式收集的案例, 原作者和来源当时没记, 所有非本人写的案例只标注了来源网络, 未写原作者名
#### 9. 如果打开有黑屏现象可能模型文件较大, 请稍等, 后续会优化代码加上加载进度条, 长时间等待无果请刷新页面

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
![preview](./public/demo/case-cover/all-demo.png)


#
#### 示例: 飞机
##### 本人编写, 参照网络案例原模型, 以对象方式重写, 纯代码建模, GUI控制光源和动画
![preview](./public/demo/case-cover/plane.png)

#
#### 示例: 损坏的头盔
##### 来源网络, gltf
![preview](./public/demo/case-cover/damaged-helmet.png)

#
#### 示例: ***
##### 来源网络
![preview](./public/demo/case-cover/royal_esplanade.png)


#
#### 示例: 天空盒
##### 来源网络

![preview](./public/demo/case-cover/skybox.png)
#### 示例: vr看房
##### 来源网络

![preview](./public/demo/case-cover/vr-room.png)
#### 示例: 小岛
##### 来源网络, glb文件

#### 示例: 小岛2
##### 来源网络, glb文件
![preview](./public/demo/case-cover/island2.png)

#### 示例: 小岛3
##### 来源网络, glb文件
![preview](./public/demo/case-cover/island3.png)

![preview](./public/demo/case-cover/island.png)
#### 示例: 瀑布
##### 本人编写, 参照网络案例原模型, 以对象方式重写, 纯代码建模

![preview](./public/demo/case-cover/waterfall.png)
#### 示例: 爱心气球
##### 来源网络, 纯代码建模

![preview](./public/demo/case-cover/heart-balloon.png)
#### 示例: csmart
##### 来源网络, 模型文件


![preview](./public/demo/case-cover/earth-moon.png)
#### 示例: 上海
##### 来源网络, 出自稀土掘金 作者 Funky_Tiger
##### 本人重构, 原代码threejs版本较低, 改为最新版本164, 弯曲的楼贴图有bug, 代码中有标出
##### 原地址 https://juejin.cn/post/6844903957416902669
![preview](./public/demo/case-cover/shanghai.png)

#### 示例: 车辆消杀-清消车间
##### 本人编写, 纯代码建模, 以对象方式调用动画
![preview](./public/demo/case-cover/truck-wash-room.png)

#### 示例: 车辆消杀-烘干车间
##### 本人编写, 纯代码建模, 以对象方式调用动画
![preview](./public/demo/case-cover/truck-dry-room.png)

#### 示例: 净水车间
##### 本人编写, 纯代码建模, 以对象方式调用动画
![preview](./public/demo/case-cover/purity.png)

#### 示例: 除臭车间简例
##### 本人编写, 纯代码建模, 以对象方式调用动画
![preview](./public/demo/case-cover/deodorize0.png)

#### 示例: 除臭车间
##### 本人编写, 纯代码建模, 以对象方式调用动画
![preview](./public/demo/case-cover/deodorize.png)

#### 示例: 除臭车间2
##### 本人编写, 纯代码建模, 以对象方式调用动画
![preview](./public/demo/case-cover/deodorize2.png)







#### 示例: 粒子简例1--几何体顶点粒子
##### 来源网络, 重构
![preview](./public/demo/case-cover/points1.png)

#### 示例: 粒子简例2--漫天雪花
##### 来源网络, 重构
![preview](./public/demo/case-cover/points2.png)

#### 示例: 粒子简例3--银河系
##### 来源网络, 重构
![preview](./public/demo/case-cover/points3.png)

#### 示例: 可调档摇头风扇, 带控制动画
##### 来源网络, 重构
![preview](./public/demo/case-cover/fan.png)

#### 示例: 园区
##### 来源网络, 单glb未贴图
![preview](./public/demo/case-cover/park.png)

#### 示例: 树林--精灵材质
##### 本人编写
![preview](./public/demo/case-cover/forest.png)

#### 示例: 下雨简例
##### 本人编写
![preview](./public/demo/case-cover/rain0.png)

#
#### 示例: 彩虹雨
##### 来源网络
![preview](./public/demo/case-cover/rainbow-rain.png)


#### 示例: 曲线动画
##### 来源网络, 重构
![preview](./public/demo/case-cover/curve.png)

#### 示例: 萤火虫动画
##### 来源网络, 重构
![preview](./public/demo/case-cover/firefly.png)


![preview](./public/demo/case-cover/csmart.png)
#### 示例: 地月系统
##### 本人编写, 参照网络案例原模型, 以对象方式重写, 纯代码建模


#### 示例: 管道简例
##### 本人编写
![preview](./public/demo/case-cover/pipe0.png)


#### 示例: 水面简例
##### 本人编写
![preview](./public/demo/case-cover/water0.png)


#### 示例: 我的世界随机地图
##### 来源网络, csdn 作者 X01动力装甲
##### https://webgl.blog.csdn.net/article/details/83965754
![preview](./public/demo/case-cover/my-world.png)

#### 示例: 一些模型文件
##### 网络收集
![preview](./public/demo/case-cover/models.png)





# 源码文件夹

#### 1. 网络上搜集来的源码没保留原作者注释或信息, 网络案例大多都比较老旧, threejs新版本与旧版本改动较大, 本项目整理过的网络案例, 源码经过重构, 改成ts, 改成对象化
#### 2. 无意抄袭删除原作者, 如果介意, 请留言, 本人会添加原作者信息或删除
#### 3. 本项目 _doc 目录下, 附上了本人搜集来的网络案例源码包, 如有侵权, 请联系本人删除
#### 4. 附带的网络案例, 如果有兴趣重构并愿意开源重构后代码的(最好是基于three最新版本号, ts, 对象化封装), 可以加qq好友402337325共同学习, 更新代码
