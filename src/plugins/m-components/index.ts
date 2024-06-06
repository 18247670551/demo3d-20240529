import {App, Component} from "vue"
//vite 使用 svg, vite-plugin-svg-icons 包的注册
import 'virtual:svg-icons-register'

import SvgIcon from "./svg-icon/Index.vue"
import MSpace from "./m-space/Index.vue"
import MPage from "./m-page/Index.vue"
import MTableColIndex from "./m-table-col-index/Index.vue"
import MLabelValue from './m-label-value/Index.vue'
import MHeader from './m-header/Index.vue'
import MLoading from './m-loading/Index.vue'
import MImgLoading from './m-img-loading/Index.vue'

const components: Record<string, Component> = {
    SvgIcon,
    MSpace,
    MPage,
    MTableColIndex,
    MLabelValue,
    MHeader,
    MImgLoading,
    MLoading,
}

// 不知为何, 用 import()函数直接导入的方法找不到图标, 先用上面的方式
// const components: Record<string, Component> = {
//     SvgIcon: () => import('@/plugins/m-components/svg-icon/Index.vue'),
//     MSpace: () => import('@/plugins/m-components/m-space/Index.vue'),
//     MPage: () => import('@/plugins/m-components/m-page/Index.vue'),
//     MTableColIndex: () => import('@/plugins/m-components/m-table-col-index/Index.vue'),
//     MLabelValue: () => import('@/plugins/m-components/m-label-value/Index.vue'),
//     MHeader: () => import('@/plugins/m-components/m-header/Index.vue'),
// }

export default {
    install(app: App) {
        Object.keys(components).forEach((key) => {
            app.component(key, components[key])
        })
    }
}