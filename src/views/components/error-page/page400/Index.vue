<template>
  <div class="page">
    <div class="signs">
      <div class="body">
        <div class="content">
          页 面 施 工 中
        </div>
      </div>
      <div class="leg"></div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.page{
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  .signs{
    width: 500px;
    transform-style: preserve-3d;
    transform-origin: bottom;
    animation: stand-up 1s;

    .body{
      width: 100%;
      //background: linear-gradient(-45deg, #fcd824 25%, #252525 0, #252525 50%, #fcd824 0, #fcd824 75%, #252525 0);
      background-image: linear-gradient(-45deg, #fcd824 0%, #fcd824 25%, #252525 25%, #252525 50%, #fcd824 50%, #fcd824 75%, #252525 75%, #252525 100%);
      background-size: 100px 100px;
      padding: 20px;

      .content{
        width: 100%;
        color: white;
        background: #1296db;
        font-size: 44px;
        font-weight: 1000;
        line-height: 150px;
        text-align: center;
        border: 8px solid #eee;
      }
    }
    .leg{
      height: 150px;
      border-left: 20px solid #aaa;
      border-right: 20px solid #aaa;
    }
  }

  @keyframes stand-up {
    0%{
      transform: rotateX(90deg);
    }
    100%{
      transform: rotateX(0);
    }
  }
}
</style>
<script setup lang="ts">
</script>