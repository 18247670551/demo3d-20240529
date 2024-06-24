<template>
  <div class="page-container m-wh100p m-bg-white0 m-p10">
    <div class="list-wrap m-pos-a">
      <div class="list">

        <div v-for="item in demoList" class="item" @click="toDemo(item.route)">
          <div class="image">
            <img :src=item.cover alt="{{item.route}}"/>
          </div>
          <div class="title">{{item.route}}</div>
        </div>

      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import {useRouter} from "vue-router"
import demos from "@/router/demos"
import {reactive} from "vue"

const router = useRouter()

const demoList = reactive(
    demos.map(demo => {
      return {
        route: demo.name,
        cover: "/demo/__case-cover/" + demo.path + ".png",
      }
    })
)

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