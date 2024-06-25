<template>
  <div id="three-dom" ref="threeDomRef"/>
</template>

<script setup lang="ts">
import {onMounted, onUnmounted, ref} from "vue"
import ThreeProject from "./ThreeProject"
import QueueTask from "@/utils/手写任务队列/TaskQueue"

let three: ThreeProject
const threeDomRef = ref<HTMLDivElement | null>(null)


onMounted(() => {

  three = new ThreeProject(threeDomRef.value!)

})

function coastTask(time: number) {
  return new Promise((resolve: Function) => {
    setTimeout(() => resolve(), time)
  })
}


const queue = new QueueTask()

function addTask(name: string, time: number) {
  console.log("添加任务: ", name)
  queue.add(() => coastTask(time))
      .then(() => {
        console.log(`${name}完成`)
      })
}

addTask("任务1", 10000)
addTask("任务2", 5000)
addTask("任务3", 3000)
addTask("任务4", 4000)
addTask("任务5", 5000)

// 添加任务:  任务1
// 添加任务:  任务2
// 添加任务:  任务3
// 添加任务:  任务4
// 添加任务:  任务5
//
// 任务2完成
// 任务3完成
// 任务1完成
// 任务4完成
// 任务5完成


onUnmounted(() => {
  three.destroyed()
})

</script>

<style lang="scss" scoped>
#three-dom {
  width: 100%;
  height: 100%;
}
</style>