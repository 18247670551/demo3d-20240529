import {createApp} from 'vue'
import App from './App.vue'
import router from './router'

import ElementPlus from './plugins/element'
import MComponents from './plugins/m-components'
import MStyle from './plugins/m-style'
import Store from './plugins/store'
// 自定义初始化插件, 执行了将 localStorage 里的 user, token 加载到 pina的store里, 用来判断用户是否登录
import InitApp from './plugins/m-init-app'
import Events from "@/three-widget/events"

// 初始化事件总线
Events.getStance().init()

const app = createApp(App)

app.use(router)
    .use(ElementPlus)
    .use(MComponents)
    .use(MStyle)
    .use(Store)
    .use(InitApp)
    .mount('#app')