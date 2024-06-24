<template>
  <div id="three-dom" ref="threeDomRef"/>
</template>

<script setup lang="ts">
import {onMounted, ref} from "vue"
import * as THREE from "three"
import {RGBELoader} from "three/examples/jsm/loaders/RGBELoader"
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls"
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader"

const threeDomRef = ref<HTMLDivElement | null>(null)

// 注意: 因为要取 dom, 请把代码放进 onMounted 中执行, 确保 dom 已加载, 避免空指针
onMounted(() => {
  init()
})

/**
 * 注意: 本例的特殊性
 * 本例并没有使用 animate函数 执行 requestAnimationFrame 来循环刷新完成动画,
 * 而是在 3个 tag处分别执行 renderer.render(scene, camera)
 * 即: 当天空盒加载完成时, 当头盔加载完成时, 当轨道控制器加载完成时
 * 如果去掉tag1, tag2处, 则会黑屏, 当鼠标托动时(即轨道控制器触发 change事件, 会执行tag3), 会显示出画面
 *
 * 以此思路, 当画面中无主动执行的动画, 只有用户操作才会有动画时, 可以用此思路来节约资源,
 * 实际用途并不大, 但可以学习到此思路
 */

function init(){

  const scene = new THREE.Scene()

  const dom = threeDomRef.value!

  const camera = new THREE.PerspectiveCamera(45, dom.clientWidth/dom.clientHeight, 0.25, 20)
  camera.position.set(-1.8, 0.6, 2.7)

  // 加载天空盒
  const rgbeLoader = new RGBELoader()
  rgbeLoader.load("/demo/mesh-skybox-royal_esplanade/royal_esplanade_1k.hdr", texture => {
    texture.mapping = THREE.EquirectangularReflectionMapping
    scene.background = texture
    scene.environment = texture


    // todo tag-1
    renderer.render(scene, camera)


    // 加载头盔模型
    new GLTFLoader().load("/demo/model-damaged-helmet/DamagedHelmet.gltf", (gltf) => {
      scene.add(gltf.scene)

      // todo tag-2
      renderer.render(scene, camera)

    })
  })

  const renderer = new THREE.WebGLRenderer({ antialias: true })
  renderer.setSize(dom.clientWidth, dom.clientHeight)
  renderer.setPixelRatio(window.devicePixelRatio)
  renderer.toneMapping = THREE.ACESFilmicToneMapping
  renderer.toneMappingExposure = 1
  dom.appendChild(renderer.domElement)

  const controls = new OrbitControls(camera, renderer.domElement)
  controls.minDistance = 2
  controls.maxDistance = 10
  controls.target.set(0, 0, - 0.2)
  controls.addEventListener("change", () => {


    // todo tag-3
    renderer.render(scene, camera)


  })
  controls.update()



  // todo 不使用 requestAnimationFrame 动画, 用 controls.addEventListener("change", func) 事件来刷新画面
  // const animate = () => {
  //   renderer.render(scene, camera)
  //   requestAnimationFrame(animate)
  // }
  // animate()

}

</script>

<style lang="scss" scoped>
#three-dom {
  width: 100%;
  height: 100%;
}
</style>