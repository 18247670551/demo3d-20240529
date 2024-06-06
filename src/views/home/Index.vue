<template>
  <el-container class="m-wh100p">

    <el-aside width="220px" class="m-h100p" style="background: #304156">
      <el-scrollbar>
        <el-menu
            :unique-opened="true"
            background-color="#304156"
            text-color="#bfcbd9"
            active-text-color="#409eff"
            router>
          <div class="m-h60 m-flex-row m-flex-c" style="background: #242f42">
            <svg-icon name="iot" fill="#FFFFFF" class="m-w26 m-h26"/>
            <span class="m-ml10 m-font16 m-text-white0">ThreejsDemo</span>
          </div>

          <el-menu-item index="/index">
            <el-icon :size="18">
              <svg-icon name="home_fill"/>
            </el-icon>
            <span>首页</span>
          </el-menu-item>

          <!-- :index="l1.name" index属性值必须唯一, 否则点击菜单时, 会造成所有的子菜单打开 -->
          <el-sub-menu
              :index="l1.name"
              v-for="l1 in menus"
              :key="l1.name">
            <template #title>
              <el-icon :size="18">
                <svg-icon :name="l1.icon"/>
              </el-icon>
              <span>{{ l1.name }}</span>
            </template>
            <el-menu-item :index="l2.path" v-for="l2 in l1.children">
              <el-icon :size="18">
                <svg-icon :name="l2.icon"/>
              </el-icon>
              <span>{{ l2.name }}</span>
            </el-menu-item>
          </el-sub-menu>

        </el-menu>
      </el-scrollbar>
    </el-aside>

    <el-container>

      <el-header class="m-flex-row m-flex-vc m-flex-jc-between">
        <!-- region 面包屑 -->
        <el-breadcrumb separator="/">
          <el-breadcrumb-item v-for="(item,index) in routeMatched" :key="index">
            <span v-if="routeMeta?.parentName && index>0">{{ routeMeta?.parentName }}</span>
            <span v-if="index===routeMatched.length-1">{{ item.name }}</span>
            <span v-else>{{ item.name }}</span>
          </el-breadcrumb-item>
        </el-breadcrumb>
        <!-- endregion 面包屑 -->

        <!-- region 用户头像 -->
        <el-dropdown class="m-cursor-pointer">
          <div class="m-flex-row m-flex-vc">
            <el-avatar shape="square" :size="32" :src="userAvatar" @error="() => true">
              <img class='' src="/static/images/avatar.jpg" alt="avatar"/>
            </el-avatar>

            <span class="m-max-m60 m-mh10 m-font16 m-single-text-ellipsis">{{ userName }}</span>

            <el-icon>
              <arrow-down/>
            </el-icon>
          </div>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item>
                <span @click="$router.push({name:'个人中心'})">用户中心</span>
              </el-dropdown-item>

              <el-dropdown-item divided>
                <el-popconfirm
                    title="确定要退出吗?"
                    @confirm="logout"
                    cancel-button-type="info">
                  <template #reference>
                    安全退出
                  </template>
                </el-popconfirm>
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
        <!-- endregion 用户头像 -->

      </el-header>

      <el-main class="m-bg-page">
        <router-view/>
      </el-main>

      <el-footer class="m-h40 m-ph20 m-flex-row m-flex-jc-end m-flex-vc">
        <span class="m-font14 m-mr10">Copyright © 2022 xxxx科技有限公司 版权所有</span>
        <a class="m-font14" href="https://xxxx.com" target="_blank">https://xxxx.com</a>
      </el-footer>

    </el-container>

  </el-container>
</template>

<script setup lang="ts">
import {onMounted, ref, watch} from 'vue'
import {RouteLocationMatched, RouteLocationNormalizedLoaded, RouteMeta, useRoute, useRouter} from 'vue-router'
import * as userApi from '@/api/userApi'
import {ElMessage} from "element-plus"
import menus from '../../router/menus'
import {ArrowDown} from "@element-plus/icons-vue"
import {useUserStore} from '@/store/userStore'


const route: RouteLocationNormalizedLoaded = useRoute()
const router = useRouter()
const routeMeta = ref<RouteMeta | null>(null)

const routeMatched = ref<RouteLocationMatched[]>([])

const userName = ref<string | null>(null)
const userAvatar = ref<string | null>(null)

let userStore: any

onMounted(() => {
  userStore = useUserStore()
  userName.value = userStore.getUserName()!
  userAvatar.value = userStore.getUserAvatar()!
})

const initBreadcrumbList = () => {
  routeMatched.value = route.matched
  routeMeta.value = route.meta
}

watch(
    route,
    () => {
      initBreadcrumbList()
    },
    {deep: true, immediate: true}
)


function logout() {
  // userApi.logout()
  //     .then()
  //     .catch(({msg}) => ElMessage.error(msg))
  //     .finally(() => {
  //       router.replace({name: '登录'})
  //       userStore.clearLogin()
  //     })

  router.replace({name: '登录'})
  userStore.clearLogin()
}
</script>