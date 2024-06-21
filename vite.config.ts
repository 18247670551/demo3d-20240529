import vue from '@vitejs/plugin-vue'
import {loadEnv, defineConfig, ConfigEnv, UserConfig} from "vite"
import {createSvgIconsPlugin} from 'vite-plugin-svg-icons'
import path from "path"
import viteCompression from "vite-plugin-compression"
import {viteMockServe} from 'vite-plugin-mock'
import glsl from "vite-plugin-glsl"



export default defineConfig(({mode, command}: ConfigEnv): UserConfig => {

    //__dirname 执行js文件所在的目录绝对地址——目录
    //process.cwd() 执行node命令的绝对地址——目录
    //__filename 执行js文件所在的绝对地址——文件路径
    //process.cwd()和__dirname可能相同

    const envDir = path.resolve(__dirname, "_env")
    const srcDir = path.resolve(__dirname, "src")
    const env = loadEnv(mode, envDir)

    const isServe = command === "serve"
    const isBuild = command === "build"
    const sourcemap = isServe || !!process.env.VSCODE_DEBUG

    return {
        // 动态设置全局变量，用于编译时使用的全局常量
        define: {
            IS_BUILD: isBuild // 用于渲染进程判断当前是否为打包环境
        },
        envDir,
        base: './',
        resolve: {
            alias: {
                '@': srcDir,
                '@api': path.resolve(__dirname, "src/api"),
            },
            // 导入时想要省略的扩展名列表
            extensions: ['.js', '.ts', '.json', '.vue'],
        },

        // dist文件预览 npm run preview
        preview: {
            port: 60000,
            host: 'localhost',
            open: true,
        },

        plugins: [
            vue(),

            // ts引入threejs 着色器 *glsl 文件的插件
            glsl(),

            // mock插件
            // viteMockServe({
            //     // 这里一定要写绝对路径'/src/mock/', 写相对路径'./mock/'找不到文件, 也就找不到mock接口
            //     // 注意: 找不到mock接口, get请求会报成功, post请求会报404
            //     mockPath: '/src/mock/', //模拟接口文件路径, 会自动检测路径下的所有文件
            //     logger: true, //是否在控制台显示请求日志
            //     enable: true, //设置是否启用本地mock文件
            // }),

            viteMockServe({
                mockPath: 'src/mock/', // mock文件所在文件夹
                localEnabled: true,
                prodEnabled: true,
                watchFiles: true, // 监听mock文件变化
                logger: true,
            }),

            createSvgIconsPlugin({
                // 指定需要缓存的图标文件夹
                iconDirs: [
                    // 项目自身的 svg图标
                    path.resolve(__dirname, './public/static/svgs'),
                    path.resolve(__dirname, 'src/assets/svgs'),
                ],
                // 指定symbolId格式
                symbolId: 'svg-[name]',
                svgoOptions: {
                    // 删除一些填充的属性
                    plugins: [
                        {
                            name: "removeAttrs",
                            params: { attrs: ["class", "data-name", "fill", "stroke"] },
                        },
                        // 删除样式标签
                        "removeStyleElement",
                    ],
                },
            }),

            //代码压缩
            viteCompression({
                verbose: true, // 默认即可
                disable: true, // 是否禁用压缩, 默认禁, 开启压缩需配置nginx支持
                deleteOriginFile: true, // 删除源文件
                threshold: 10240, // 压缩前最小文件大小
                algorithm: "gzip", // 压缩算法
                ext: ".gz", // 文件类型
            }),

            // "unplugin-icons": "^0.16.1",
            // "unplugin-vue-components": "^0.24.1",
            // AutoImport({
            //     resolvers: [
            //         ElementPlusResolver({
            //             importStyle: "sass",
            //         }),
            //         // 自动导入图标组件
            //         IconsResolver({
            //             prefix: "Icon",
            //         }),
            //     ],
            //     dts: path.resolve(__dirname, "types/auto-imports.d.ts"),
            // }),

            // Components({
            //     resolvers: [
            //         // 自动注册图标组件
            //         IconsResolver({
            //             enabledCollections: ["ep"], // @iconify-json/ep 是 Element Plus 的图标库
            //         }),
            //         ElementPlusResolver({
            //             importStyle: "sass",
            //         }),
            //     ],
            //     dts: path.resolve(__dirname, "types/components.d.ts"),
            // }),
            // Icons({
            //     autoInstall: true,
            // }),
        ],

        // css: {
        //     // CSS 预处理器
        //     preprocessorOptions: {
        //         scss: {
        //             javascriptEnabled: true,
        //             additionalData: `@use "@/assets/styles/variables.scss" as *;`,
        //         },
        //     },
        // },


        server: {
            //是否自动打开浏览器
            open: true,
            host: true,
            port: 65510,
            // 端口是否是严格模式, 严格模式下端口号被占用vite会退出
            strictPort: false,
            // 为开发服务器配置CORS, 默认启用并允许任何源
            cors: true,
            // proxy: {
            //     '^/api': {
            //         target: env.VITE_BASE_URL,
            //         changeOrigin: true,
            //         rewrite: (path) => path.replace(/^\/api/, '/mock')
            //     },
            // }
        }
    }
})