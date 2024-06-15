### ts默认不能识别 glsl 文件, 可以用第三包方支持

#### 1. 引入包

```shell

npm i vite-plugin-glsl

```

#### 2. 在 vite 中配置, 在 vite.config.ts 文件中加入插件

```ts
import glsl from "vite-plugin-glsl"

plugins: [

    glsl(),

]
```

#### 3. 配置全局类型识别, 新添加文件 shader.d.ts 内容:
```ts
declare module '*.glsl' {
    const value: string
    export default value
}
```


#### 4. 完成配置, 可以执行引入
```ts
import vertexShader from "./shader/vertexShader.glsl"
import fragmentShader from "./shader/fragmentShader.glsl"
```

