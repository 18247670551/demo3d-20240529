<template>
  <div id="three-dom" ref="threeDomRef"/>
</template>

<script setup lang="ts">
import {onMounted, onUnmounted, ref} from "vue"
import {ThreeProject} from "./ThreeProject"

let three: ThreeProject
const threeDomRef = ref<HTMLDivElement | null>(null)

onMounted(() => {

  three = new ThreeProject(threeDomRef.value!)

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