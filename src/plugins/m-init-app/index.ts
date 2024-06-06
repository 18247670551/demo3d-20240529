import type {App} from "vue"
import {useUserStore} from "@/store/userStore"

export default {
    install: (_: App) => {
        useUserStore().init()
    }
}