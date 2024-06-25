import { createPinia } from "pinia";
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';
export default {
    install: (app) => {
        const pinia = createPinia();
        pinia
            // 使用piniaPluginPersistedstate持久化依赖包后, 再使用 store.$reset() 时会报错, 解决办法: 使用.use()函数重写 $reset 方法
            // 本项目不使用 store 自带的 .$reset(), 全部自定义 reset, 暂时注释
            // .use(({store}) => {
            //     const initialState = JSON.parse(JSON.stringify(store.$state))
            //     store.$reset = () => store.$state = JSON.parse(JSON.stringify(initialState))
            // })
            .use(piniaPluginPersistedstate);
        app.use(pinia);
    }
};
//# sourceMappingURL=index.js.map