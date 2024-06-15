<template>
  <div id="three-dom" ref="threeDomRef"/>
</template>

<script setup lang="ts">
import {onMounted, ref} from "vue"
import * as THREE from 'three'
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls"
import {RGBELoader} from "three/examples/jsm/loaders/RGBELoader"
import {Water} from "three/examples/jsm/objects/Water2"
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader"
import {DRACOLoader} from "three/examples/jsm/loaders/DRACOLoader"

const threeDomRef = ref<HTMLDivElement | null>(null)

onMounted(() => {
  init()
})

function init() {
  const dom = threeDomRef.value!

  const scene = new THREE.Scene()

  const camera = new THREE.PerspectiveCamera(75, dom.clientWidth / dom.clientHeight, 0.1, 2000)
  camera.position.set(-50, 50, 200)
  camera.aspect = dom.clientWidth / dom.clientHeight
  camera.updateProjectionMatrix()
  scene.add(camera)

  const light = new THREE.DirectionalLight(0xffffff, 1)
  light.position.set(-100, 100, 10)
  scene.add(light)

  const renderer = new THREE.WebGLRenderer({
    antialias: true, // 抗锯齿
    logarithmicDepthBuffer: true, // 对数深度缓存
  })

  renderer.setSize(dom.clientWidth, dom.clientHeight)
  renderer.setPixelRatio(window.devicePixelRatio)
  dom.appendChild(renderer.domElement)

  // 创建水面
  const waterGeo = new THREE.CircleGeometry(300, 64)
  const waterTexLoader = new THREE.TextureLoader()
  const water = new Water(waterGeo, {
    textureWidth: 1024,
    textureHeight: 1024,
    color: 0xeeeeff,
    flowDirection: new THREE.Vector2(1, 1),
    scale: 2,
    normalMap0: waterTexLoader.load("/demo/island/Water_1_M_Normal.jpg"),
    normalMap1: waterTexLoader.load("/demo/island/Water_2_M_Normal.jpg"),
  })
  // 水平面抬高3米淹没石头
  water.position.y = 3
  // 水面旋转至水平
  water.rotation.x = -Math.PI / 2


  // 创建天空球体
  const skyGeo = new THREE.SphereGeometry(1000, 60, 60)
  // 视角进入球体内部
  skyGeo.scale(1, 1, -1)

  const skyMat = new THREE.MeshBasicMaterial({
    map: new THREE.TextureLoader().load("/demo/island/sky.jpg")
  })
  const video = document.createElement("video")
  video.src = "/demo/island/sky.mp4"
  video.loop = true

  window.addEventListener("click", () => {
    if (video.paused) {
      video.play()
      skyMat.map = new THREE.VideoTexture(video)
      skyMat.map.needsUpdate = true
    }
  })
  const sky = new THREE.Mesh(skyGeo, skyMat)
  scene.add(sky)


  // 载入环境纹理
  const hdrLoader = new RGBELoader()
  hdrLoader.loadAsync("/demo/island/050.hdr").then((texture) => {
    texture.mapping = THREE.EquirectangularReflectionMapping
    scene.background = texture
    scene.environment = texture
  })
  scene.add(water)


  // 添加小岛模型
  const loader = new GLTFLoader()
  const dracoLoader = new DRACOLoader()
  dracoLoader.setDecoderPath("/draco/")
  loader.setDRACOLoader(dracoLoader)
  loader.load("/demo/island/island2.glb", (gltf) => {
    const isLand = gltf.scene
    // isLand.position.y = -50
    scene.add(isLand)
  })

  const controls = new OrbitControls(camera, renderer.domElement)
  controls.target.y = 50
  controls.enableDamping = true
  controls.update()

  const animate = () => {
    renderer.render(scene, camera)
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