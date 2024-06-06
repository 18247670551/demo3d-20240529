/// <reference types="vite/client" />

declare module "*.vue" {
    import { DefineComponent } from "vue"
    const component: DefineComponent<{}, {}, any>
    export default component
}

// declare module "@"


/** 定义全局变 */
// 当前是否为打包状态
declare const IS_BUILD: boolean

interface ImportMetaEnv{
    readonly VITE_BASE_URL: string,
}