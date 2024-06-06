### threejs 加载压缩过的 gltf 文件需要使用 DRACOLoader 解码, 要用到解码文件,
### 文件位置: node_modules的three包下,
### 路径 node_modules/three/examples/jsm/libs/draco

## 由于vite打包并不会打包到解码文件,
## 所以需要自己将这个文件夹复制出来, 放到 public 下, 在解码时配置这个路径

### 示例:
```ts
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader"
import {DRACOLoader} from "three/examples/jsm/loaders/DRACOLoader"

const dracoLoader = new DRACOLoader()
// 配置解码路径, public下的 /draco/
dracoLoader.setDecoderPath("/draco/")
const loader = new GLTFLoader()
loader.setDRACOLoader(dracoLoader)
loader.load("/demo/park/city.glb", (gltf) => {

    console.log("gltf = ", gltf)

    const obj = gltf.scene
    obj.scale.set(20, 20, 20)
    this.scene.add(obj)

})
```
