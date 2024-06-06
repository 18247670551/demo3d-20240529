# vite 加载 svg

除引入组件外, 还需要

1. 安装包:

```npm
    npm i vite-plugin-svg-icons
    
    // 加载svg文件时需要路径工具, 只安装, 没有调用代码
    npm i fast-glob
```

2. 在 `main.ts` 中引入:

```ts
import 'virtual:svg-icons-register'
```
- 本教程使用插件方式引入 svg-icon 图标, 是在 `src/plugins/m-components/index.ts` 下引入的

3. 在 `vite.config.ts` 中加入:

```ts
plugins: [
    
    createSvgIconsPlugin({
        // 指定需要缓存的图标文件夹
        iconDirs: [
            path.resolve(__dirname, './public/static/svgs'),
            path.resolve(__dirname, 'src/assets/svgs'),
        ],
        // 指定symbolId格式
        symbolId: 'svg-[name]',
        // 禁用压缩
        svgoOptions: false,
    })
        
}
```

4. 全局引入, 在 `main.ts` 中加入: , 本项目使用了插件加载方式
```ts
app.component('svg-icon', SvgIcon)
```
- 本教程使用插件方式, 在 `mc.d.ts` 中做了全局类型声明, 使用的时候无需再写组件引入

# 注意:

1. 用 fill属性 控制颜色(需要 svg代码本身不能有fill属性)
```html
<svg-icon name="user_fill" fill="#8ECCFF" class="m-w20 m-h20"/>
```

2. svg-icon 直接写class时, class中颜色属性不生效, 当 svg-icon 被 <el-icon></el-icon> 包裹时, svg-icon 的 class class中颜色属性生效, 还可以 size 控制图标大小
```html
<el-icon :size="28">
  <svg-icon name="add_user" class="m-ml10 m-text-red"/>
</el-icon>
```

3. 当 fill属性 和 class 同时有颜色时, fill属性生效