<template>
  <div id="three-dom" ref="threeDomRef"/>
  <div id="balloon-count-label">气球数量: {{balloonCount}}</div>
</template>

<script setup lang="ts">
import {onMounted, onUnmounted, ref} from "vue"
import ThreeProject from "./ThreeProject"

let three: ThreeProject
const threeDomRef = ref<HTMLDivElement | null>(null)
const balloonCount = ref(0)

onMounted(() => {

  three = new ThreeProject(threeDomRef.value!, balloonCount)

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
#balloon-count-label{
  background: yellow;
  position: absolute;
  top: 0;
  right: 0;
  width: 300px;
  height: 100px;
  font-size: 40px;
  text-align: center;
  line-height: 100px;
  color: red;
}
</style>



<style>
.balloon-count-label {
  background: yellow;
  position: absolute;
  top: -1000px;
  left: -300px;
  width: 300px;
  height: 100px;
  font-size: 40px;
  text-align: center;
  line-height: 100px;
  color: red;
}
</style>