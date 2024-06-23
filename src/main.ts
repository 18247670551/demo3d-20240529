import {createApp} from 'vue'
import App from './App.vue'
import router from './router'

import ElementPlus from './plugins/element'
import MComponents from './plugins/m-components'
import MStyle from './plugins/m-style'
import Store from './plugins/store'
import InitApp from './plugins/m-init-app'
import Cesium from './plugins/cesium'


const app = createApp(App)

app.use(router)
    .use(ElementPlus)
    .use(MComponents)
    .use(MStyle)
    .use(Store)
    .use(InitApp)
    .use(Cesium)
    .mount('#app')
