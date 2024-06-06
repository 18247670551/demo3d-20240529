### TypeScript 使用 SCSS 全局变量

### scss变量
- variables.scss
```scss
:root {
  --menuBg: #304156;
}

$menuBg: var(--menuBg);
```


1. 创建一个以 .module.scss 结尾的文件

```scss
:export {
  menuBg: $menuBg;
}
```

2. 在 vite.config.ts 中配置 CSS 预处理器

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
```vue
import variables from "@/styles/variables.module.scss"

console.log(variables.menuBg)
```

4. 也可以在在 vue - template 中使用

```html
<div :style="{'background-color': variables.menuBg}"/>
```