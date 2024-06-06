<template>
    <div class="loading">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
    </div>
</template>

<style scoped lang="scss">
.loading {
  width: 32px;
  height: 32px;
  position: relative;
}

.loading > div {
  position: absolute;
  width: 2px;
  height: 10px;
  margin: -5px 2px 2px -1px;
  animation: line-spin-clockwise-fade 1s infinite ease-in-out;
  background-color: #000000;
}

.loading > div:nth-child(1) {
  top: 15%;
  left: 50%;
  transform: rotate(0deg);
  animation-delay: -0.875s;
}

.loading > div:nth-child(2) {
  top: 25.2512626585%;
  left: 74.7487373415%;
  transform: rotate(45deg);
  animation-delay: -0.75s;
}

.loading > div:nth-child(3) {
  top: 50%;
  left: 85%;
  transform: rotate(90deg);
  animation-delay: -0.625s;
}

.loading > div:nth-child(4) {
  top: 74.7487373415%;
  left: 74.7487373415%;
  transform: rotate(135deg);
  animation-delay: -0.5s;
}

.loading > div:nth-child(5) {
  top: 84.9999999974%;
  left: 50.0000000004%;
  transform: rotate(180deg);
  animation-delay: -0.375s;
}

.loading > div:nth-child(6) {
  top: 74.7487369862%;
  left: 25.2512627193%;
  transform: rotate(225deg);
  animation-delay: -0.25s;
}

.loading > div:nth-child(7) {
  top: 49.9999806189%;
  left: 15.0000039834%;
  transform: rotate(270deg);
  animation-delay: -0.125s;
}

.loading > div:nth-child(8) {
  top: 25.2506949798%;
  left: 25.2513989292%;
  transform: rotate(315deg);
  animation-delay: 0s;
}

@keyframes line-spin-clockwise-fade {
  50% {
    opacity: 0.2;
  }

  100% {
    opacity: 1;
  }
}
</style>