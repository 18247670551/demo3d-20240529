<template>
  <div class="page-login m-wh100p">
    <canvas class="m-wh100p" ref="canvasDomRef"/>

    <div class="login-box m-flex-row">

      <div class="logo m-flex-row m-flex-c m-bg-transparent0">
        <img class="img" src="/static/images/logo.png" alt="logo"/>
      </div>

      <div class="form m-p100 m-flex-col m-flex-c">

        <div class="title">ThreejsDemo</div>

        <el-form
            :model="form"
            :rules="rules"
            class="m-wh100p"
            ref="formRef"
            size="large"
            @keyup.enter="onSubmit">

          <el-form-item prop="phone">
            <el-input v-model.trim="form.phone" placeholder="手机号" maxlength="11">
              <template #prepend>
                <svg-icon name="user_fill" fill="#8ECCFF" class="m-w20 m-h20"/>
              </template>
            </el-input>
          </el-form-item>

          <el-form-item prop="password">
            <el-input v-model.trim="form.password" placeholder="密码" show-password maxlength="20">
              <template #prepend>
                <svg-icon name="lock_fill" fill="#8ECCFF" class="m-w20 m-h20"/>
              </template>
            </el-input>
          </el-form-item>

          <el-form-item/>

          <el-form-item>
            <el-button :loading="loadingSave" class="m-w100p" type="primary" @click="onSubmit">登 录
            </el-button>
          </el-form-item>

        </el-form>
      </div>

    </div>

  </div>
</template>

<style lang="scss" scoped>
.page-login {
  background: radial-gradient(circle, #fff, #1296db); //圆心向外渐变色

  .login-box {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);

    .logo {
      width: 500px;
      height: 500px;
      box-shadow: -1px 5px 10px rgba(0, 0, 0, 0.4);

      img {
        width: 350px;
      }
    }

    .form {
      width: 500px;
      height: 500px;
      box-shadow: 1px 5px 10px rgba(0, 0, 0, 0.4);
      background: #fff;

      :deep(.el-input-group__prepend) {
        padding: 0 10px;
      }

      .title {
        font-size: 26px;
        color: #55b5e5;
        padding-bottom: 10px;
        border-bottom: 1px solid #ccc;
        margin-bottom: 60px;
      }

      .pre-fix-icon {
        width: 1.2em;
        height: 1.2em;
        color: #55b5e5
      }
    }
  }
}

@media screen and (max-width: 900px) {
  .page-login {
    .login-box {
      flex-direction: column;
    }
  }
}
</style>

<script lang="ts" setup>
import * as testApi from "@/api/testApi"
import * as noauthApi from "@/api/noauthApi"
import * as userApi from "@/api/userApi"
import {onMounted, ref} from 'vue'
import {useRouter} from 'vue-router'
import {ElMessage} from 'element-plus'
import {useUserStore} from '@/store/userStore'
// @ts-ignore
import {showLoading, hideLoading} from "@/utils/base"
import {MockLoginPhone, MockLoginPassword} from "@/constants/mock"
import dayjs from "dayjs"
import Particles from "./Particles"

const router = useRouter()

const rules = {
  phone: [{required: true, message: "请输入手机号", trigger: "blur"}],
  password: [{required: true, message: "请输入密码", trigger: "blur"}],
};

const form = ref<LoginUser>({
  phone: MockLoginPhone,
  password: MockLoginPassword,
})

const formRef = ref()
const canvasDomRef = ref()
const loadingSave = ref(false)

onMounted(() => {
  new Particles(canvasDomRef.value)
})

function onSubmit() {
  // 测试, 免验证
  const userStore = useUserStore()
  userStore.setLogin("123", "456")
  userStore.setUser({
    clientType: "web",
    loginTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
    id: "123",
    name: "模拟用户",
    phone: "18999999999",
    avatar: "",
  })
  hideLoading(loadingSave)
  router.replace({name: '首页'})


  // formRef.value.validate((valid: boolean) => {
  //   if (!valid) return
  //
  //   showLoading(loadingSave)
  //
  //   // mock 打包后失效, 本地环境使用 mock 接口, 打包时直接跳转
  //   // 这里写法做演示
  //   if (IS_BUILD) {
  //
  //     const userStore = useUserStore()
  //     userStore.setLogin("123", "456")
  //     userStore.setUser({
  //       clientType: "web",
  //       loginTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
  //       id: "123",
  //       name: "模拟用户",
  //       phone: "18999999999",
  //       avatar: "",
  //     })
  //     hideLoading(loadingSave)
  //     router.replace({name: '首页'})
  //
  //   } else {
  //
  //     // testApi.testGet()
  //     //     .then(() => {
  //     //       console.log("mock /testGet 请求成功")
  //     //     })
  //     //     .catch(({msg}) => ElMessage.error(msg))
  //     //     .finally(() => hideLoading(loadingSave))
  //
  //     noauthApi.login(form.value)
  //         .then(({data: tokenPair}) => {
  //           useUserStore().setLogin(tokenPair.accessToken, tokenPair.refreshToken)
  //
  //           userApi.getUserInfo()
  //               .then(({data: userInfo}) => {
  //                 useUserStore().setUser(userInfo)
  //                 router.replace({name: '首页'})
  //               })
  //               .catch(({msg}) => ElMessage.error(msg))
  //               .finally(() => hideLoading(loadingSave))
  //         })
  //         .catch(({msg}) => {
  //           ElMessage.error(msg)
  //           hideLoading(loadingSave)
  //         })
  //   }
  //
  // })

}

</script>
