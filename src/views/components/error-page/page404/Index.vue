<template>
  <div class="http404-container">
    <div class="http404">
      <div class="pic-404">
        <img class="pic-404__parent" src="./404.png" alt="img"/>
        <img class="pic-404__child left" src="./404_cloud.png" alt="img"/>
        <img class="pic-404__child mid" src="./404_cloud.png" alt="img"/>
        <img class="pic-404__child right" src="./404_cloud.png" alt="img"/>
      </div>
      <div class="bullshit">
        <div class="bullshit__oops">页面不存在</div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.http404-container {
  background-color: #0f80c7;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  .http404 {

    .pic-404 {
      position: relative;

      &__parent {
        width: 600px;
      }

      &__child {
        position: absolute;

        &.left {
          top: 17px;
          left: 220px;
          width: 80px;
          opacity: 0;
          animation-name: cloudLeft;
          animation-duration: 2s;
          animation-timing-function: linear;
          animation-delay: 1s;
          animation-fill-mode: forwards;
        }

        &.mid {
          top: 10px;
          left: 420px;
          width: 46px;
          opacity: 0;
          animation-name: cloudMid;
          animation-duration: 2s;
          animation-timing-function: linear;
          animation-delay: 1.2s;
          animation-fill-mode: forwards;
        }

        &.right {
          top: 100px;
          left: 500px;
          width: 62px;
          opacity: 0;
          animation-name: cloudRight;
          animation-duration: 2s;
          animation-timing-function: linear;
          animation-delay: 1s;
          animation-fill-mode: forwards;
        }

        @keyframes cloudLeft {
          0% {
            top: 17px;
            left: 220px;
            opacity: 0;
          }

          20% {
            top: 33px;
            left: 188px;
            opacity: 1;
          }

          80% {
            top: 81px;
            left: 92px;
            opacity: 1;
          }

          100% {
            top: 97px;
            left: 60px;
            opacity: 0;
          }
        }

        @keyframes cloudMid {
          0% {
            top: 10px;
            left: 420px;
            opacity: 0;
          }

          20% {
            top: 40px;
            left: 360px;
            opacity: 1;
          }

          70% {
            top: 130px;
            left: 180px;
            opacity: 1;
          }

          100% {
            top: 160px;
            left: 120px;
            opacity: 0;
          }
        }

        @keyframes cloudRight {
          0% {
            top: 100px;
            left: 500px;
            opacity: 0;
          }

          20% {
            top: 120px;
            left: 460px;
            opacity: 1;
          }

          80% {
            top: 180px;
            left: 340px;
            opacity: 1;
          }

          100% {
            top: 200px;
            left: 300px;
            opacity: 0;
          }
        }
      }
    }

    .bullshit {
      &__oops {
        margin-top: 80px;
        font-size: 28px;
        color: white;
        opacity: 0;
        text-align: center;
        animation: slideUp 0.5s forwards;
      }

      @keyframes slideUp {
        0% {
          opacity: 0;
          transform: translateY(60px);
        }

        100% {
          opacity: 1;
          transform: translateY(0);
        }
      }
    }
  }
}
</style>
