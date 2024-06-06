
# 注意:
1. 样式文件报错, 查看样式中是否使用了 sass变量, 可能是变量未找到, 样式文件需要引入变量文件 @import "../../../m-_variable";
2. sass变量在字符串中需要用 #{} 包裹, egg: height: calc(100% - #{$height}); 否则样式无效 并且无报错
3. 在某此地方 数字 和 字符串相连时不要直接写 #{num}px , 有可能造成数字和字符串中间有空格, 可以写成  unm + 'px'
4. 写变量百分比时, 可写成 $num * 1%

# 微信小程序注意:
在微信小程序中一定不要使用 星号选择器 会报错, 且只报 wxss文件报错, 排查困难



## TypeScript 使用 SCSS 全局变量

### scss变量
1. 全局scss变量 `variables.scss`

```scss
:root {
  --page-bg: #304156;
}

$page-bg: var(--page-bg);
$page-font-size: 14px;
```


2. 创建一个以 .module.scss 结尾的文件 `variables.module.scss`

```scss
:export {
  pageBg: $page-bg;
  pageFontSize: $page-font-size;
}
```

3. 在 vite.config.ts 中配置 CSS 预处理器

```
plugins: {
    css: {
        // CSS 预处理器
        preprocessorOptions: {
            scss: {
                javascriptEnabled: true,
                additionalData: `@use "@/assets/styles/variables.scss" as *;`,
            },
        },
    },
}
```

3. 在 vue - ts 中引入并使用

```ts
import variables from "@/styles/variables.module.scss"

console.log(variables.pageBg)
```

4. 也可以在在 vue - template 中使用

```vue
import variables from "@/styles/variables.module.scss"

<div :style="{'background-color': variables.pageBg}"/>
```