<template>
  <div id="three-dom" ref="threeDomRef"/>
</template>

<script setup lang="ts">
import {onMounted, ref} from "vue"
import * as THREE from "three"
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls"
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader"

const threeDomRef = ref<HTMLDivElement | null>(null)

onMounted(() => {
  init()
})

function init(){

  const scene = new THREE.Scene()
  scene.background = new THREE.Color(0x062469)

  const dom = threeDomRef.value!

  const camera = new THREE.PerspectiveCamera(45, dom.clientWidth/dom.clientHeight, 0.25, 20)
  camera.position.set(-1.8, 0.6, 4)

  const light = new THREE.AmbientLight()
  light.color = new THREE.Color(0xffffff)
  light.intensity = 5 // 光线强度
  scene.add(light)


  const light1 = new THREE.DirectionalLight()
  light1.position.set(0, 2, 4)
  light1.color = new THREE.Color(0xffffff)
  light1.intensity = 5
  scene.add(light1)


  const loader = new GLTFLoader().setPath("/demo/gltf-DamagedHelmet/")
  loader.load("DamagedHelmet.gltf", (gltf) => {
    scene.add(gltf.scene)
    renderer.render(scene, camera)
  })

  const renderer = new THREE.WebGLRenderer({ antialias: true })
  renderer.setSize(dom.clientWidth, dom.clientHeight)
  renderer.setPixelRatio(window.devicePixelRatio)
  // renderer.toneMapping = THREE.ACESFilmicToneMapping
  // renderer.toneMappingExposure = 1
  dom.appendChild(renderer.domElement)

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.minDistance = 2
  controls.maxDistance = 10
  controls.target.set(0, 0, - 0.2)
  controls.addEventListener("change", () => {
    renderer.render(scene, camera)
  })
  controls.update()
}

</script>

<style lang="scss" scoped>
#three-dom {
  width: 100%;
  height: 100%;
}
</style>