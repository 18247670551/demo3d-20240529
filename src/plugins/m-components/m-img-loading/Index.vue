<template>
    <div class="m-component-img-loading"></div>
</template>

<style lang="scss" scoped>
.m-component-img-loading {
  width: 500px;
  height: 500px;
  position: relative;

  &::before {
    width: 100%;
    height: 100%;
    position: absolute;
    content: "";
    background: url(img1.png) no-repeat center center;
    background-size: 100% 100%;
    animation: rotate-animation 5s infinite linear;

  }

  &::after {
    width: 100%;
    height: 100%;
    position: absolute;
    content: "";
    background: url(img2.png) no-repeat center center;
    background-size: 80% 80%;
    animation: rotate-animation-reverse 4s infinite linear;
  }

  @keyframes rotate-animation {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
  @keyframes rotate-animation-reverse {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(-360deg);
    }
  }
}
</style>