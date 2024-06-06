import SvgIcon from "./svg-icon/Index.vue"
import MSpace from "./m-space/Index.vue"
import MPage from "./m-page/Index.vue"
import MTableColIndex from "./m-table-col-index/Index.vue"
import MLabelValue from './m-label-value/Index.vue'
import MHeader from './m-header/Index.vue'
import MImgLoading from './m-img-loading/Index.vue'
import MLoading from './m-loading/Index.vue'

/**
 * 以插件方式注册全局组件时, 需要给自定义组件做全局声明, 否则 idea 报黄线警告
 * 如果直接在 main.ts 里使用的 app.component('svg-icon', SvgIcon), 则不需要做全局声明
 */
export {}

declare module 'vue'{
    export interface GlobalComponents{
        SvgIcon: typeof SvgIcon,
        MSpace: typeof MSpace,
        MPage: typeof MPage,
        MTableColIndex: typeof MTableColIndex,
        MLabelValue: typeof MLabelValue,
        MHeader: typeof MHeader,
        MImgLoading: typeof MImgLoading,
        MLoading: typeof MLoading,
    }
}