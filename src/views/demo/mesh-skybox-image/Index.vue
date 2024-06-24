<template>
  <div id="three-dom" ref="threeDomRef"/>
</template>

<script setup lang="ts">
import {onMounted, ref} from "vue"
import * as THREE from 'three'
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls"
import {getTextureLoader} from "@/three-widget/loader/ThreeLoader"

const threeDomRef = ref<HTMLDivElement | null>(null)

onMounted(() => {
  init()
})

function init() {
  const dom = threeDomRef.value!

  const scene = new THREE.Scene()

  const camera = new THREE.PerspectiveCamera(45, dom.clientWidth / dom.clientHeight, 0.1, 1000)
  camera.position.z = 5

  const light = new THREE.DirectionalLight(0xFFFFFF, 2)
  light.position.set(-1, 2, 4)
  scene.add(light)

  const renderer = new THREE.WebGLRenderer({
    antialias: true
  })

  renderer.setSize(dom.clientWidth, dom.clientHeight)
  renderer.setPixelRatio(window.devicePixelRatio)

  dom.appendChild(renderer.domElement)

  const controls = new OrbitControls(camera, renderer.domElement)
  controls.enableDamping = true
  controls.target.set(0, 0, 0)
  controls.update()



  const geometry = new THREE.BoxGeometry(1, 1, 1)
  const material = new THREE.MeshPhongMaterial({color: "9f9",})
  const cube = new THREE.Mesh(geometry, material)
  scene.add(cube)


  getTextureLoader().load("/demo/mesh-skybox-image/panorama.jpg", texture => {
    const rt = new THREE.WebGLCubeRenderTarget(texture.image.height)
    rt.fromEquirectangularTexture(renderer, texture)
    scene.background = rt.texture
  })


  const animate = () => {

    controls.update()
    renderer.render(scene, camera)

    cube.rotation.x += 0.01
    cube.rotation.y += 0.01

    requestAnimationFrame(animate)
  }

  animate()

}

</script>

<style lang="scss" scoped>
#three-dom {
  width: 100%;
  height: 100%;
}
</style>