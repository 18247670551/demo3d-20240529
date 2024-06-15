<template>
  <canvas class="canvas-dom m-wh100p" ref="canvasDomRef"/>
</template>

<script setup lang="ts">
import {onMounted, onUnmounted, ref} from "vue"

const canvasDomRef = ref()
const partials: any[] = []

onMounted(() => {

  const canvas = canvasDomRef.value
  const width = canvas.clientWidth
  const height = canvas.clientHeight
  const newWidth = canvas.width = width * devicePixelRatio
  const newHeight = canvas.height = height * devicePixelRatio

  const ctx = canvas.getContext("2d")!

  ctx.fillStyle = 'rgba(0,0,0,0)'
  ctx.fillRect(0, 0, newWidth, newHeight)

  const text = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'

  const x = newWidth / 2
  const y = newHeight

  const num = 100
  render()

  function fade() {
    ctx.fillStyle = 'rgba(0,0,0,0.1)'
    ctx.fillRect(0, 0, newWidth, newHeight)
  }

  function render() {
    fade()
    partials.push({
      x: x,
      y: y,
      color: [155, 100, 50, 0.8],
      font: text.charAt(Math.floor(Math.random() * 26)),
      xSpeed: (Math.random() * 20) - 10, ySpeed: (Math.random() * 10) - 10
    })

    for (let i = 0; i < partials.length; i++) {
      const h = partials[i].color[0];
      const s = partials[i].color[1] + '%'
      const l = partials[i].color[2] + '%'
      const a = partials[i].color[3];
      const hsla = `hsla(${h},${s},${l},${a})`;
      ctx.font = '10px 微软雅黑'
      ctx.fillStyle = hsla;
      ctx.fillText(partials[i].font, partials[i].x, partials[i].y);
      partials[i].x += partials[i].xSpeed
      partials[i].y += partials[i].ySpeed

      partials[i].y *= 0.98
      partials[i].color[0] += 1 // 色调
      partials[i].color[2] *= 0.99  // 亮度
      if (partials[i].color[0] > 253) {
        partials[i].color[2] = 100 // 亮度
        partials[i].color[3] = 1 // 透明
      }
    }

    if (partials.length > num) {
      partials.shift()
    }

    requestAnimationFrame(render)
  }

})

</script>

<style lang="scss" scoped>
#canvas-dom {
  width: 100%;
  height: 100%;
}
</style>