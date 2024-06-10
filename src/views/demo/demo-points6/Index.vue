<template>
  <div id="three-dom" ref="threeDomRef"/>
</template>

<script setup lang="ts">
import {onMounted, ref} from "vue"
import * as THREE from 'three'

const threeDomRef = ref<HTMLDivElement | null>(null)

onMounted(() => {
  init()
})

function init() {
  const dom = threeDomRef.value!

  const scene = new THREE.Scene()
  scene.background = new THREE.Color(0x000000)

  const camera = new THREE.PerspectiveCamera(45, dom.clientWidth / dom.clientHeight, 0.1, 1000)
  camera.position.z = 5

  const renderer = new THREE.WebGLRenderer();
  renderer.setSize(dom.clientWidth, dom.clientHeight)
  dom.appendChild(renderer.domElement)

  const particleCount = 1800
  const particleSystem = createParticleSystem(particleCount)
  scene.add(particleSystem)


  function animate() {
    updateParticleSystem(particleSystem, particleCount)
    renderer.render(scene, camera)
    requestAnimationFrame(animate)
  }

  animate()
}

function updateParticleSystem(particleSystem: THREE.Points, particleCount: number){
  for (let i = 0; i < particleCount; i++) {
    const positions = particleSystem.geometry.attributes.position.array
    if (positions[i * 3 + 1] < -1.5) {
      positions[i * 3 + 1] = Math.random() * 3 + 1
    } else {
      positions[i * 3 + 1] -= 0.01
    }
  }

  particleSystem.geometry.attributes.position.needsUpdate = true
}

function createParticleSystem(particleCount: number){

  const fireTexture = new THREE.TextureLoader()
      .load('/demo/points6/spark1.png')

  const particles = new THREE.BufferGeometry()
  const positions = new Float32Array(particleCount * 3)
  const colors = new Float32Array(particleCount * 3)

  const color = new THREE.Color()


  for (let i = 0; i < particleCount; i++) {
    let pX = Math.random() * 3 - 1.5
    let pY = Math.random() * 3 - 1.5
    let pZ = Math.random() * 3 - 1.5

    positions[i * 3] = pX
    positions[i * 3 + 1] = pY
    positions[i * 3 + 2] = pZ

    color.setHSL((pY + 1) / 2, 1.0, 0.5)
    colors[i * 3] = color.r
    colors[i * 3 + 1] = color.g
    colors[i * 3 + 2] = color.b
  }

  particles.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  particles.setAttribute('color', new THREE.BufferAttribute(colors, 3))

  const particleMaterial = new THREE.PointsMaterial({
    size: 0.2,
    map: fireTexture,
    blending: THREE.AdditiveBlending,
    depthTest: false,
    transparent: true,
    vertexColors: true
  })

  return new THREE.Points(particles, particleMaterial)
}

</script>

<style lang="scss" scoped>
#three-dom {
  width: 100%;
  height: 100%;
}
</style>