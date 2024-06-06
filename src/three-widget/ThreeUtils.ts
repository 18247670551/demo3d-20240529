import * as THREE from "three"

export function isMesh(obj: unknown): obj is THREE.Mesh {
    return (typeof obj === "object" && obj !== null && "isMesh" in obj)
}

export function isLight(obj: unknown): obj is THREE.Light {
    return obj instanceof THREE.Light
}

export function disposeGroup (group: THREE.Group) {
    // 释放 几何体 和 材质
    const clearCache = (item: any) => {
        item.geometry.dispose()
        item.material.dispose()
    }

    // 递归释放物体下的 几何体 和 材质
    const removeObj = (obj: any) => {
        let arr = obj.children.filter((x: any) => x)
        arr.forEach((item: any) => {
            if (item.children.length) {
                removeObj(item)
            } else {
                clearCache(item)
                item.clear()
            }
        })
        obj.clear()
        arr = null
    }
    group.removeFromParent()
    removeObj(group)
}

/**
 * 通过 x,y,z 指定旋转中心
 * @param x
 * @param y
 * @param z
 * @param o3d 要旋转的对象
 */
export function changePivot (o3d: THREE.Object3D, x: number, y: number, z: number) {
    let wrapper = new THREE.Object3D()
    wrapper.position.set(x, y, z)
    wrapper.add(o3d)
    o3d.position.set(-x, -y, -z)
    return wrapper
}


// 不要这样使用, GLTFLoader 是可以指定查找路径的, 如果一个地址设置了公共查找路径, 在其他地方没有注意到, 会找不到文件, 又不好查报错原因
// const textureLoader= new THREE.TextureLoader()
// const audioLoader= new THREE.AudioLoader()
// const gltfLoader= new GLTFLoader()
//
// export function getGLTFLoader(){
//     return gltfLoader
// }
//
// export function getTextureLoader(){
//     return textureLoader
// }
//
// export function getAudioLoader(){
//     return audioLoader
// }


// /**
//  * 透视相机
//  * @param options
//  * @param k dom元素长宽比
//  */
// export const createPerspectiveCamera = (options: PerspectiveCameraOptions, k: number) => {
//
//     return new THREE.PerspectiveCamera(
//         options.fov,
//         k,
//         options.near,
//         options.far,
//     )
// }
//
// /**
//  * 正交相机
//  * @param options
//  * @param k dom元素长宽比
//  */
// export const createOrthographicCamera = (options: OrthographicCameraOptions, k: number) => {
//
//     return new THREE.OrthographicCamera(
//         -options.s * k,
//         options.s * k,
//         options.s,
//         -options.s,
//         options.near,
//         options.far,
//     )
// }



/*
const DefaultControlsOptions: ControlsOptions = {
    enableDamping: false, //阻尼(是否有惯性)
    dampingFactor: 0.25, //动态阻尼系数(鼠标拖拽旋转灵敏度)
    enableZoom: true, //缩放
    autoRotate: false, //自动旋转
    minDistance: 1, //设置相机距离原点的最近距离
    maxDistance: 80000, //设置相机距离原点的最远距离
    enablePan: false, //开启右键拖拽
    maxPolarAngle: Math.PI / 2.2, //最大角度
}
 */
// // 轨道控制器
// export const createControls = (camera: THREE.Camera, renderer: THREE.Renderer, options?: ControlsOptions) => {
//     const controls = new OrbitControls(camera, renderer.domElement)
//
//     const allControlsOptions: ControlsOptions = {
//         enableDamping: false, //阻尼(是否有惯性)
//         dampingFactor: 0.25, //动态阻尼系数(鼠标拖拽旋转灵敏度)
//         enableZoom: true, //缩放
//         autoRotate: false, //自动旋转
//         minDistance: 1, //设置相机距离原点的最近距离
//         maxDistance: 80000, //设置相机距离原点的最远距离
//         enablePan: false, //开启右键拖拽
//         maxPolarAngle: Math.PI / 2.2, //最大角度
//     }
//
//     // @ts-ignore
//     const op: Required<ControlsOptions> = Object.assign({}, allControlsOptions, options)
//
//     controls.enableDamping = op.enableDamping
//     controls.dampingFactor = op.dampingFactor
//     controls.enableZoom = op.enableZoom
//     controls.autoRotate = op.autoRotate
//     controls.minDistance = op.minDistance
//     controls.maxDistance = op.maxDistance
//     controls.enablePan = op.enablePan
//     controls.maxPolarAngle = op.maxPolarAngle
//
//     return controls
// }




// // 渲染器
// export const createRenderer = (dowWidth: number, domHeight: number) => {
//     const renderer = new THREE.WebGLRenderer({
//         antialias: true, //抗锯齿
//         alpha: true,
//         logarithmicDepthBuffer: true //深度缓冲, 解决模型重叠部分不停闪烁问题
//     })
//
//     renderer.setSize(dowWidth, domHeight)
//     renderer.setPixelRatio(window.devicePixelRatio)
//     //renderer.setClearColor(0xff0000, 1)
//
//     // 是否使用物理上正确的光照模式, 默认为 true
//     // 光照强度受光源距离影响, 以项目光源距离计算, 开启时, 光照强度(intensity)需乘以3-5倍(不开启时为1, 开启后为5)
//     //renderer.physicallyCorrectLights = true
//
//     // 颜色空间, 默认为 THREE.SRGBColorSpace
//     //renderer.outputColorSpace = THREE.SRGBColorSpace
//
//     //renderer.toneMapping = THREE.ReinhardToneMapping //曝光值 默认为2 值为整型 [1 - 2]
//     //renderer.toneMappingExposure = 1.25  //色调映射曝光度
//
//     //renderer.shadowMap.enabled = true // 开启阴影
//     //renderer.shadowMap.type = THREE.PCFSoftShadowMap //阴影类型（处理运用Shadow Map产生的阴影锯齿）
//
//     return renderer
// }





// 环境光
// export const createAmbientLight = (name: string, color = 0xffffff, intensity = 1) => {
//     const light = new THREE.AmbientLight()
//
//     light.color = new THREE.Color(color)
//     light.intensity = intensity // 光线强度
//
//     light.name = name
//     return light
// }

// 有关光源阴影的设置
// light.castShadow = true // 是否投射阴影
// light.shadow.mapSize.width = 2048
// light.shadow.mapSize.height = 2048
// // 阴影范围
// const d = 80
// light.shadow.camera.left = -d
// light.shadow.camera.right = d
// light.shadow.camera.top = d
// light.shadow.camera.bottom = -d
// light.shadow.bias = -0.0005 // 解决条纹阴影的出现
// // 最大可视距和最小可视距
// light.shadow.camera.near = 0.01
// light.shadow.camera.far = 2000

// // 平行光
// export const createDirectionalLight = (name: string, color: number, intensity: number) => {
//     const light = new THREE.DirectionalLight()
//
//     light.color = new THREE.Color(color)
//     light.intensity = intensity
//
//     light.name = name
//     return light
// }
//
//
// // 点光源
// export const createPointLight = (name: string, color: number, intensity: number, power = 800, decay = 0.1) => {
//     const light = new THREE.PointLight()
//
//     light.color = new THREE.Color(color)
//     light.intensity = intensity
//
//     light.power = power // 光功率
//     light.decay = decay // 光的衰减指数
//
//     light.name = name
//     return light
// }
