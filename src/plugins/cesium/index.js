import * as Cesium from 'cesium';
import { cesiumDefaultToken } from "@/plugins/cesium/token";
import '/public/libs/cesium/Widgets/widgets.css'; // 引入Cesium样式
export default {
    install: (app) => {
        // 指定 cesium.js 包的资源路径, 这里只需配置就可以了, 代码中无需使用, cesium.js包里自动使用 window.CESIUM_BASE_URL 指定的路径
        window.CESIUM_BASE_URL = '/libs/cesium';
        Cesium.Ion.defaultAccessToken = cesiumDefaultToken;
    }
};
//# sourceMappingURL=index.js.map