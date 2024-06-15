<template>
  <div id="three-dom" ref="threeDomRef"/>
</template>

<script setup lang="ts">
import {onMounted, ref} from "vue"
import * as THREE from 'three'
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls"
import {RGBELoader} from "three/examples/jsm/loaders/RGBELoader"

const threeDomRef = ref<HTMLDivElement | null>(null)

onMounted(() => {
  init()
})

function init() {
  const dom = threeDomRef.value!

  const scene = new THREE.Scene()

  const camera = new THREE.PerspectiveCamera(45, dom.clientWidth / dom.clientHeight, 0.1, 1000)
  camera.position.z = 0.1

  const renderer = new THREE.WebGLRenderer()

  renderer.setSize(window.innerWidth, window.innerHeight)
  dom.appendChild(renderer.domElement)

  const controls = new OrbitControls(camera, renderer.domElement)
  controls.enableDamping = true
  controls.target.set(0, 0, 0)
  controls.update()

  const animate = () => {
    requestAnimationFrame(animate)
    controls.update()
    renderer.render(scene, camera)
  }

  // 添加球
  const globeGeo = new THREE.SphereGeometry(5, 32, 32)
  const loader = new RGBELoader()
  loader.load("/demo/vr-room/Living.hdr", (texture) => {
    const material = new THREE.MeshBasicMaterial({
      map: texture
    })
    const sphere = new THREE.Mesh(globeGeo, material)
    sphere.geometry.scale(1, 1, -1)
    scene.add(sphere)
  })

  animate()

}

</script>

<style lang="scss" scoped>
#three-dom {
  width: 100%;
  height: 100%;
}
</style>