<template>
  <div class="page-container m-wh100p m-bg-white0 m-p20">
    <div class="list-wrap m-pos-a">
      <div class="list">
        <div class="item" @click="toWxUserProtocol">
          <el-icon class="img" color="#bbb" :size="130">
            <svg-icon name="protocol"/>
          </el-icon>

          <div class="title">微信用户协议</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {useRouter} from "vue-router"

const router = useRouter()

function toWxUserProtocol() {
  const to = router.resolve({
    name: "微信用户协议"
  })
  window.open(to.href, "_blank", 'width=400, height=800, top=200, left=500, toolbar=no, menubar=no, scrollbars=no, resizable=no, location=no, status=no')
}
</script>

<style scoped lang="scss">
.page-container {
  position: relative;
  overflow: auto;

  .list-wrap {
    width: calc(100% - 40px);

    .list {
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      margin-bottom: 100px;

    .item {
      border: 1px solid #ccc;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      cursor: pointer;
      margin: 20px;

      .img {
        width: 150px;
        height: 150px;
      }

      .title {
        line-height: 2em;
      }
    }
    }
  }
}
</style>