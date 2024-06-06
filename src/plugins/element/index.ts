import zhCn from 'element-plus/es/locale/lang/zh-cn'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import type {App} from "vue"


export default {
    install: (app: App) => {
        app.use(ElementPlus, {locale: zhCn, size: "default"})

         // 全局设置 el-dialog 弹窗空白处不关闭弹窗
        // 默认值为true 即点击空白关闭弹窗, 如需使用点击空白关闭, 可在 el-dialog 标签添加 :close-on-click-modal="true"
        // @ts-ignore
        app._context.components.ElDialog.props.closeOnClickModal.default = false
        //注册所有图标
        for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
            app.component(key, component)
        }
    }
}

