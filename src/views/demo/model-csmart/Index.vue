<template>
  <div id="three-dom" ref="threeDomRef"/>
</template>

<script setup lang="ts">
import {onMounted, onUnmounted, ref} from "vue"
import ThreeProject from "./ThreeProject"
import Events from "@/three-widget/events"
import {LOAD_PROCESS, UI_EVENT_NAME} from '@/three-widget/events/eventConstructs'
import ActionEvent from "@/three-widget/events/ActionEvent"

let three: ThreeProject
const threeDomRef = ref<HTMLDivElement | null>(null)

onMounted(() => {

  const threeDom = threeDomRef.value!

  three = new ThreeProject(threeDom)

  const _event = Events.getStance().getEvent(UI_EVENT_NAME) as ActionEvent

  const progressDom = document.createElement("div")
  progressDom.style.display = "none"
  progressDom.style.position = "absolute"
  progressDom.style.left = "40%"
  progressDom.style.top = "50%"
  progressDom.style.background = "#39ff6b"
  progressDom.style.width = "400px"
  progressDom.style.height = "100px"
  progressDom.style.textAlign = "center"
  progressDom.style.lineHeight = "100px"
  progressDom.style.fontSize = "30px"
  threeDom.appendChild(progressDom)


  _event.addEventListener(LOAD_PROCESS, ({ message }) => {

    //console.log("message = ", message)

    const { url, itemsLoaded, itemsTotal } = message
    if (itemsLoaded / itemsTotal >= 1) {

      progressDom.innerHTML = `加载成功`

      setTimeout(() => {
        progressDom.style.display = "none"
      }, 2000)

    } else {
      const per = Math.round((itemsLoaded / itemsTotal) * 100 * 100) / 100
      progressDom.innerHTML = `正在加载: ${per}%`
      progressDom.style.display = "block"
    }

  })

})

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