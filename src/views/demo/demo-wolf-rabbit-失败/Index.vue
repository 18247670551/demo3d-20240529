<template>
<!--  <div id="three-dom" ref="threeDomRef"/>-->



  <div id="world" ref="threeDomRef"/>
  <div id="gameoverInstructions"  ref="gameOverDomRef">
    Game Over
  </div>
  <div id="dist">
    <div class="label">distance</div>
    <div id="distValue" ref="fieldDistanceDomRef">000</div>
  </div>
  <div id="instructions">点击跳跃躲过追击</div>
</template>

<script setup lang="ts">
import {onMounted, onUnmounted, ref} from "vue"
import ThreeProject from "./ThreeProject"

let three: ThreeProject
const threeDomRef = ref<HTMLDivElement | null>(null)
const gameOverDomRef = ref<HTMLDivElement | null>(null)
const fieldDistanceDomRef = ref<HTMLDivElement | null>(null)


onMounted(() => {

  three = new ThreeProject(threeDomRef.value!, fieldDistanceDomRef.value!, gameOverDomRef.value!)

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
#world {
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: #dbe6e6;
  overflow: hidden;
}

#gameoverInstructions {
  position: absolute;
  font-family: "Voltaire", sans-serif;
  font-weight: bold;
  text-transform: uppercase;
  font-size: 120px;
  text-align: center;
  color: #ffc5a2;
  opacity: 0;
  left: 50%;
  top: 50%;
  width: 100%;
  transform: translate(-50%, -100%);
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  transition: all 500ms ease-in-out;
}
#gameoverInstructions.show {
  opacity: 1;
  transform: translate(-50%, -50%);
  transition: all 500ms ease-in-out;
}

#dist {
  position: absolute;
  left: 50%;
  top: 50px;
  transform: translate(-50%, 0%);
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}

.label {
  position: relative;
  font-family: "Voltaire", sans-serif;
  text-transform: uppercase;
  color: #ffa873;
  font-size: 12px;
  letter-spacing: 2px;
  text-align: center;
  margin-bottom: 5px;
}

#distValue {
  position: relative;
  text-transform: uppercase;
  color: #dc5f45;
  font-size: 40px;
  font-family: "Voltaire";
  text-align: center;
}

#credits {
  position: absolute;
  width: 100%;
  margin: auto;
  bottom: 0;
  margin-bottom: 20px;
  font-family: "Voltaire", sans-serif;
  color: #544027;
  font-size: 12px;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  text-align: center;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}

#credits a {
  color: #544027;
}

#credits a:hover {
  color: #dc5f45;
}

#instructions {
  position: absolute;
  width: 100%;
  bottom: 0;
  margin: auto;
  margin-bottom: 50px;
  font-family: "Voltaire", sans-serif;
  color: #dc5f45;
  font-size: 16px;
  letter-spacing: 1px;
  text-transform: uppercase;
  text-align: center;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}

.lightInstructions {
  color: #5f9042;
}
</style>