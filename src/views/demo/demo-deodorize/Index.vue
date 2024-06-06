<template>
  <div id="three-dom" ref="threeDomRef"/>
</template>

<script setup lang="ts">
import {onMounted, onUnmounted, ref} from "vue"
import ThreeProject from "./ThreeProject"
import {Emitter} from "@/utils/emitter"
import _ from "lodash"

let three: ThreeProject
const threeDomRef = ref<HTMLDivElement | null>(null)


onMounted(() => {

  three = new ThreeProject(threeDomRef.value!)
  emitterTest()
})

onUnmounted(() => {
  three.destroyed()
})


// 由vue向 threeProject 传递变化数据有多种方式

// 1, 把 threeProject 的 executePoint() 不要用 private, 直接暴露出来,
// 上面 new ThreeProject(threeDomRef.value!)的时候已经取到了 three 对象, 直接 three.executePoint(point, value)

// 2, 通过自定义事件总线, 或者使用第三方包Emitter事件传递, 这里演示使用 Emitter
function emitterTest(){

  const emitter = Emitter.instance()

  let liquidLevel = 85.7

  setInterval(() => {
    liquidLevel += _.random(-1.0, 1.0)
    emitter.emit("pointDataChange", "40001", liquidLevel)
  }, 1000)

}


</script>

<style lang="scss" scoped>
#three-dom {
  width: 100%;
  height: 100%;
}
</style>