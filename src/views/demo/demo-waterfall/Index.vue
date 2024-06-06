<template>
  <div id="three-dom" ref="threeDomRef"/>
  <div id="drop-count-label">水滴数量: {{dropCount}}</div>
</template>

<script setup lang="ts">
import {onMounted, onUnmounted, ref} from "vue"
import ThreeProject from "./ThreeProject"

let three: ThreeProject
const threeDomRef = ref<HTMLDivElement | null>(null)
const dropCount = ref(0)

onMounted(() => {

  three = new ThreeProject(threeDomRef.value!, dropCount)

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
#drop-count-label{
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