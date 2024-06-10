<template>
  <canvas class="canvas-dom m-wh100p" ref="canvasDomRef"/>
</template>

<script setup lang="ts">
import {onMounted, onUnmounted, ref} from "vue"

const canvasDomRef = ref()


onMounted(() => {

  const canvas = canvasDomRef.value
  const width = canvas.clientWidth
  const height = canvas.clientHeight
  canvas.width = width * devicePixelRatio
  canvas.height = height * devicePixelRatio

  const ctx = canvas.getContext("2d")!

  const particles: Particle[] = []

  function createParticles(x: number, y: number) {
    for (let i = 0; i < 10; i++) {
      const particle = new Particle(ctx, x, y)
      particles.push(particle)
    }
  }

  function animate() {
    ctx.fillStyle = "rgba(0, 0, 0, 0.1)"
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    for (let i = 0; i < particles.length; i++) {
      particles[i].update()
      particles[i].draw()

      if (particles[i].size <= 0.3) {
        particles.splice(i, 1)
        i--
      }
    }

    requestAnimationFrame(animate)
  }

  canvas.addEventListener("mousemove", (e: any) => {
    const {offsetX, offsetY} = e
    createParticles(offsetX, offsetY)
  })

  animate()

})

onUnmounted(() => {

})

class Particle {

  private ctx: any
  private x: number
  private y: number
  size: number
  private speedX: number
  private speedY: number
  private color: string

  constructor(ctx: any, x: number, y: number) {
    this.ctx = ctx
    this.x = x
    this.y = y
    this.size = Math.random() * 10 + 2
    this.speedX = (Math.random() - 0.5) * 5
    this.speedY = (Math.random() - 0.5) * 5
    this.color = `hsl(${Math.random() * 360}, 100%, 50%)`
  }


  update() {
    this.x += this.speedX
    this.y += this.speedY

    if (this.size > 0.2) this.size -= 0.1
  }

  draw() {
    const {ctx} = this
    ctx.fillStyle = this.color
    ctx.beginPath()
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
    ctx.fill()
  }
}

</script>

<style lang="scss" scoped>
#canvas-dom {
  width: 100%;
  height: 100%;
}
</style>