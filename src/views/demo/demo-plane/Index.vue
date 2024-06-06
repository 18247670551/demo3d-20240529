<template>
  <div id="three-dom" ref="threeDomRef"/>
</template>

<script setup lang="ts">
import {onMounted, onUnmounted, ref} from "vue"
import {ThreePlane} from "./ThreePlane"

let three: ThreePlane
const threeDomRef = ref<HTMLDivElement | null>(null)

onMounted(() => {

  three = new ThreePlane(threeDomRef.value!, true)

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