<template>
  <div class="page-container m-wh100p m-bg-white0 m-p10">
    <div class="list-wrap m-pos-a">
      <div class="list">

        <div class="item" @click="toDemo('示例-天空盒')">
          <div class="image">
            <img src="/demo/case-cover/skybox.png" alt="天空盒"/>
          </div>
          <div class="title">室外景色--天空盒-单张贴图</div>
        </div>

        <div class="item" @click="toDemo('示例-皇家滨海大道广场')">
          <div class="image">
            <img src="/demo/case-cover/royal_esplanade.png" alt="皇家滨海大道广场"/>
          </div>
          <div class="title">皇家滨海大道广场--天空盒-hdr</div>
        </div>

        <div class="item" @click="toDemo('示例-VR看房')">
          <div class="image">
            <img src="/demo/case-cover/vr-room.png" alt="VR看房"/>
          </div>
          <div class="title">VR看房--天空盒-hdr</div>
        </div>


        <div class="item" @click="toDemo('示例-损坏的头盔')">
          <div class="image">
            <img src="/demo/case-cover/damaged-helmet.png" alt="损坏的头盔"/>
          </div>
          <div class="title">损坏的头盔--模型文件</div>
        </div>

        <div class="item" @click="toDemo('示例-csmart')">
          <div class="image">
            <img src="/demo/case-cover/csmart.png" alt="csmart"/>
          </div>
          <div class="title">csmart--模型文件</div>
        </div>

        <div class="item" @click="toDemo('示例-f18')">
          <div class="image">
            <img src="/demo/case-cover/f18.png" alt="f18"/>
          </div>
          <div class="title">f18--模型文件</div>
        </div>

        <div class="item" @click="toDemo('示例-小岛')">
          <div class="image">
            <img src="/demo/case-cover/island.png" alt="小岛"/>
          </div>
          <div class="title">小岛--模型文件</div>
        </div>

        <div class="item" @click="toDemo('示例-小岛2')">
          <div class="image">
            <img src="/demo/case-cover/island2.png" alt="小岛2"/>
          </div>
          <div class="title">小岛2--模型文件</div>
        </div>

        <div class="item" @click="toDemo('示例-小岛3')">
          <div class="image">
            <img src="/demo/case-cover/island3.png" alt="小岛3"/>
          </div>
          <div class="title">小岛3--模型文件</div>
        </div>




        <div class="item" @click="toDemo('示例-曲线动画')">
          <div class="image">
            <img src="/demo/case-cover/curve.png" alt="曲线动画"/>
          </div>
          <div class="title">曲线动画</div>
        </div>


        <div class="item" @click="toDemo('示例-萤火虫动画')">
          <div class="image">
            <img src="/demo/case-cover/firefly.png" alt="萤火虫动画"/>
          </div>
          <div class="title">萤火虫动画</div>
        </div>



        <div class="item" @click="toDemo('示例-水面简例')">
          <div class="image">
            <img src="/demo/case-cover/water0.png" alt="水面简例"/>
          </div>
          <div class="title">水面简例</div>
        </div>


        <div class="item" @click="toDemo('示例-管道简例')">
          <div class="image">
            <img src="/demo/case-cover/pipe0.png" alt="管道简例"/>
          </div>
          <div class="title">管道简例</div>
        </div>

        <div class="item" @click="toDemo('示例-树林')">
          <div class="image">
            <img src="/demo/case-cover/forest.png" alt="树林"/>
          </div>
          <div class="title">树林--精灵材质</div>
        </div>


        <div class="item" @click="toDemo('示例-风扇')">
          <div class="image">
            <img src="/demo/case-cover/fan.png" alt="风扇"/>
          </div>
          <div class="title">可调档摇头风扇--带控制动画</div>
        </div>


        <div class="item" @click="toDemo('示例-地月系统')">
          <div class="image">
            <img src="/demo/case-cover/earth-moon.png" alt="地月系统"/>
          </div>
          <div class="title">地月系统--纯代码建模</div>
        </div>


        <div class="item" @click="toDemo('示例-飞机')">
          <div class="image">
            <img src="/demo/case-cover/plane.png" alt="飞机"/>
          </div>
          <div class="title">飞机--纯代码建模</div>
        </div>


        <div class="item" @click="toDemo('示例-瀑布')">
          <div class="image">
            <img src="/demo/case-cover/waterfall.png" alt="瀑布"/>
          </div>
          <div class="title">瀑布--纯代码建模</div>
        </div>


        <div class="item" @click="toDemo('示例-爱心气球')">
          <div class="image">
            <img src="/demo/case-cover/heart-balloon.png" alt="爱心气球"/>
          </div>
          <div class="title">爱心气球--纯代码建模</div>
        </div>



        <div class="item" @click="toDemo('示例-my-world')">
          <div class="image">
            <img src="/demo/case-cover/my-world.png" alt="my-world"/>
          </div>
          <div class="title">my-world</div>
        </div>

        <div class="item" @click="toDemo('示例-物理引擎')">
          <div class="image">
            <img src="/demo/case-cover/physics.png" alt="物理引擎"/>
          </div>
          <div class="title">物理引擎</div>
        </div>

        <div class="item" @click="toDemo('示例-人物控制')">
          <div class="image">
            <img src="/demo/case-cover/player.png" alt="人物控制"/>
          </div>
          <div class="title">人物控制</div>
        </div>



        <div class="item" @click="toDemo('示例-上海2')">
          <div class="image">
            <img src="/demo/case-cover/shanghai2.png" alt="上海2"/>
          </div>
          <div class="title">上海--模型文件</div>
        </div>


        <div class="item" @click="toDemo('示例-上海')">
          <div class="image">
            <img src="/demo/case-cover/shanghai.png" alt="上海"/>
          </div>
          <div class="title">上海--纯代码建模</div>
        </div>




        <div class="item" @click="toDemo('示例-下雨简例')">
          <div class="image">
            <img src="/demo/case-cover/rain0.png" alt="下雨简例"/>
          </div>
          <div class="title">粒子简例0--下雨</div>
        </div>


        <div class="item" @click="toDemo('示例-粒子简例1')">
          <div class="image">
            <img src="/demo/case-cover/points1.png" alt="粒子简例1"/>
          </div>
          <div class="title">粒子简例1--几何体顶点粒子</div>
        </div>

        <div class="item" @click="toDemo('示例-粒子简例2')">
          <div class="image">
            <img src="/demo/case-cover/points2.png" alt="粒子简例2"/>
          </div>
          <div class="title">粒子简例2--漫天雪花</div>
        </div>

        <div class="item" @click="toDemo('示例-粒子简例3')">
          <div class="image">
            <img src="/demo/case-cover/points3.png" alt="粒子简例3"/>
          </div>
          <div class="title">粒子简例3--银河系</div>
        </div>

        <div class="item" @click="toDemo('示例-粒子简例4')">
          <div class="image">
            <img src="/demo/case-cover/points4.png" alt="粒子简例4"/>
          </div>
          <div class="title">粒子简例4--shader</div>
        </div>

        <div class="item" @click="toDemo('示例-粒子简例5')">
          <div class="image">
            <img src="/demo/case-cover/fireworks.png" alt="粒子简例5"/>
          </div>
          <div class="title">粒子简例5--烟花-shader</div>
        </div>






        <div class="item" @click="toDemo('示例-彩虹雨')">
          <div class="image">
            <img src="/demo/case-cover/rainbow-rain.png" alt="彩虹雨"/>
          </div>
          <div class="title">彩虹雨--粒子动画</div>
        </div>



        <div class="item" @click="toDemo('示例-洗消车间')">
          <div class="image">
            <img src="/demo/case-cover/truck-wash-room.png" alt="洗消车间"/>
          </div>
          <div class="title">车辆消杀--洗消车间--纯代码建模</div>
        </div>

        <div class="item" @click="toDemo('示例-烘干车间')">
          <div class="image">
            <img src="/demo/case-cover/truck-dry-room.png" alt="烘干车间"/>
          </div>
          <div class="title">车辆消杀--烘干车间--纯代码建模</div>
        </div>

        <div class="item" @click="toDemo('示例-净水车间')">
          <div class="image">
            <img src="/demo/case-cover/purity.png" alt="净水车间"/>
          </div>
          <div class="title">净水车间--纯代码建模</div>
        </div>

        <div class="item" @click="toDemo('示例-净水车间2')">
          <div class="image">
            <img src="/demo/case-cover/purity2.png" alt="净水车间2"/>
          </div>
          <div class="title">净水车间2--纯代码建模</div>
        </div>

        <div class="item" @click="toDemo('示例-除臭车间简例')">
          <div class="image">
            <img src="/demo/case-cover/deodorize0.png" alt="除臭车间简例"/>
          </div>
          <div class="title">除臭车间简例--纯代码建模</div>
        </div>

        <div class="item" @click="toDemo('示例-除臭车间')">
          <div class="image">
            <img src="/demo/case-cover/deodorize.png" alt="除臭车间"/>
          </div>
          <div class="title">除臭车间--纯代码建模</div>
        </div>

        <div class="item" @click="toDemo('示例-除臭车间2')">
          <div class="image">
            <img src="/demo/case-cover/deodorize2.png" alt="除臭车间2"/>
          </div>
          <div class="title">除臭车间2--纯代码建模</div>
        </div>









        <div class="item" @click="toDemo('示例-狼兔项目--狼')">
          <div class="image">
            <img src="/demo/case-cover/wr-wolf.png" alt="my-world"/>
          </div>
          <div class="title">狼兔项目--狼</div>
        </div>

        <div class="item" @click="toDemo('示例-狼兔项目--兔')">
          <div class="image">
            <img src="/demo/case-cover/wr-rabbit.png" alt="my-world"/>
          </div>
          <div class="title">狼兔项目--兔</div>
        </div>

        <div class="item" @click="toDemo('示例-狼兔项目--刺猬')">
          <div class="image">
            <img src="/demo/case-cover/wr-hedgehog.png" alt="my-world"/>
          </div>
          <div class="title">狼兔项目--刺猬</div>
        </div>

        <div class="item" @click="toDemo('示例-狼兔项目--地球')">
          <div class="image">
            <img src="/demo/case-cover/wr-earth.png" alt="my-world"/>
          </div>
          <div class="title">狼兔项目--地球</div>
        </div>

        <div class="item" @click="toDemo('示例-狼兔项目')">
          <div class="image">
            <img src="/demo/case-cover/wolf-rabbit.png" alt="my-world"/>
          </div>
          <div class="title">狼兔项目--重构失败, 求大佬指导</div>
        </div>








        <div class="item" @click="toDemo('示例-一些模型文件')">
          <div class="image">
            <img src="/demo/case-cover/models.png" alt="一些模型文件"/>
          </div>
          <div class="title">一些模型文件</div>
        </div>



        <div class="item" @click="toDemo('测试页面')">
          <div class="image">
            <img src="/demo/case-cover/busy.png" alt="测试页面"/>
          </div>
          <div class="title">测试页面</div>
        </div>

      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import {useRouter} from "vue-router"

const router = useRouter()

function toDemo(screen: string) {
  const to = router.resolve({
    name: screen
  })
  window.open(to.href, "_blank")
}

</script>

<style lang="scss" scoped>
.page-container {
  position: relative;
  overflow: auto;

  .list-wrap {
    width: calc(100% - 40px);

    .list {
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      margin-bottom: 100px;

      & > .item {
        cursor: pointer;
        border: 2px solid #ccc;
        padding: 4px;
        margin: 10px;

        & > .image {
          overflow: hidden;

          img {
            width: 400px;
            height: 300px;
            transition-duration: 500ms;

            &:hover {
              transform: scale(1.1);
            }
          }
        }

        & > .title {
          width: 100%;
          height: 40px;
          font-size: 20px;
          line-height: 40px;
          text-align: center;
        }
      }
    }
  }
}


</style>