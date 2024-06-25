import { useUserStore } from "@/store/userStore";
import Events from "@/three-widget/events";
export default {
    install: (_) => {
        // 初始化 userStore
        useUserStore().init();
        // 初始化事件总线
        Events.getStance().init();
    }
};
//# sourceMappingURL=index.js.map