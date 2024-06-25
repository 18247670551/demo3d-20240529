//vite 使用 svg, vite-plugin-svg-icons 包的注册
import 'virtual:svg-icons-register';
import SvgIcon from "./svg-icon/Index.vue";
import MSpace from "./m-space/Index.vue";
import MPage from "./m-page/Index.vue";
import MTableColIndex from "./m-table-col-index/Index.vue";
import MLabelValue from './m-label-value/Index.vue';
import MHeader from './m-header/Index.vue';
import MLoading from './m-loading/Index.vue';
import MImgLoading from './m-img-loading/Index.vue';
const components = {
    SvgIcon,
    MSpace,
    MPage,
    MTableColIndex,
    MLabelValue,
    MHeader,
    MImgLoading,
    MLoading,
};
export default {
    install(app) {
        Object.keys(components).forEach((key) => {
            app.component(key, components[key]);
        });
    }
};
//# sourceMappingURL=index.js.map