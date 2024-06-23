import type {App} from "vue"
import {useUserStore} from "@/store/userStore"
import Events from "@/three-widget/events"

export default {
    install: (_: App) => {

        // 初始化 userStore
        useUserStore().init()

        // 初始化事件总线
        Events.getStance().init()

    }
}