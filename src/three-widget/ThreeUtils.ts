import * as THREE from "three"
import {Water as Water2} from "three/examples/jsm/objects/Water2"
import {acceleratedRaycast, computeBoundsTree, disposeBoundsTree} from "three-mesh-bvh"
import * as BufferGeometryUtils from 'three/examples/jsm/utils/BufferGeometryUtils.js'
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls"


// 获取两个模型的世界矩阵, 通过invert获取逆矩阵, 通过矩阵相乘获取一个模型相对另一个模型的相对矩阵
export function getReleaseMatrix(model1: THREE.Mesh, model2: THREE.Mesh) {
    model1.updateMatrixWorld()
    model2.updateMatrixWorld()
    // 计算物料相对于夹爪的变换矩阵
    const materialMatrix = new THREE.Matrix4().copy(model2.matrixWorld)
    materialMatrix.premultiply(model1.matrixWorld.clone().invert())
    return materialMatrix
}

export function mergeGroup(cargo: THREE.Group): THREE.Mesh | null {
    const geometries: THREE.BufferGeometry[] = []
    const meshes: THREE.Mesh[] = []
    // @ts-ignore
    cargo.children.map((child: THREE.Mesh) => {
        meshes.push(child)
        child.geometry.deleteAttribute('uv')
        geometries.push(child.geometry.index ? child.geometry.toNonIndexed() : child.geometry.clone())
    })
    for (const [i, g] of geometries.entries()) {
        g.applyMatrix4(meshes[i].matrixWorld)
    }
    const mergedGeometry = BufferGeometryUtils.mergeGeometries(geometries, true)
    // @ts-ignore
    const materials: THREE.Material[] = cargo.children.map((child: THREE.Mesh) => child.material)

    const mergedMesh = new THREE.Mesh(mergedGeometry.clone(), materials)
    mergedMesh.scale.copy(cargo.scale)
    mergedMesh.rotation.copy(cargo.rotation)

    return mergedMesh
}

// 重置UV 是否从中点 还是左上角的点
export const resetUV = (geometry: THREE.BufferGeometry, isCenter = false) => {
    geometry.computeBoundingBox()
    const {min, max} = geometry.boundingBox!
    geometry.deleteAttribute('uv')
    const roomX = max.x - min.x
    const roomY = max.y - min.y

    const positions = geometry.attributes.position
    const positionsCount = positions.count
    const uvArray = new Float32Array(positionsCount * 2)
    for (let i = 0; i < positionsCount * 2; i += 2) {
        uvArray[i] = isCenter ? (positions.getX(i) - (min.x + max.x) / 2) / roomX : (positions.getX(i) - min.x) / roomX
        uvArray[i + 1] = isCenter ? (positions.getY(i) - (min.y + max.y) / 2) / roomY : (positions.getY(i) - min.y) / roomY
    }
    geometry.setAttribute('uv', new THREE.BufferAttribute(uvArray, 2))
}

export const randomUV = (geometry: THREE.BufferGeometry) => {
    const positionsCount = geometry.attributes.position.count
    const uvArray = new Float32Array(positionsCount * 2)
    for (let i = 0; i < positionsCount * 2; i += 2) {
        uvArray[i] = Math.random() * 0.01
        uvArray[i + 1] = Math.random() * 0.01
    }
    geometry.setAttribute('uv', new THREE.BufferAttribute(uvArray, 2))
}

export const setGeometryUVForm = (srcGeometry: THREE.BufferGeometry, toGeometry: THREE.BufferGeometry) => {
    toGeometry.computeBoundingBox()
    const toRoomX = toGeometry.boundingBox!.max.x - toGeometry.boundingBox!.min.x
    const toRoomY = toGeometry.boundingBox!.max.y - toGeometry.boundingBox!.min.y
    toGeometry.deleteAttribute('uv')

    srcGeometry.computeBoundingBox()
    const {max, min} = srcGeometry.boundingBox!
    const roomX = max.x - min.x
    const roomY = max.y - min.y

    const positions = toGeometry.attributes.position
    const positionsCount = toGeometry.attributes.position.count
    const uvArray = new Float32Array(positionsCount * 2)
    for (let i = 0; i < positionsCount * 2; i += 2) {
        uvArray[i] = (positions.getX(i) - min.x) / roomX / (toRoomX / roomX)
        uvArray[i + 1] = (positions.getY(i) - min.y) / roomY / (toRoomY / roomY)
    }
    toGeometry.setAttribute('uv', new THREE.BufferAttribute(uvArray, 2))
}


export const getBoxInfo = (mesh: THREE.Object3D) => {
    const box3 = new THREE.Box3()
    box3.expandByObject(mesh)
    const size = new THREE.Vector3()
    const center = new THREE.Vector3()
    box3.getCenter(center)
    box3.getSize(size)
    return {size, center}
}

export const toMeshSceneCenter = (mesh: THREE.Object3D) => {
    const {center, size} = getBoxInfo(mesh)
    mesh.position.copy(center.negate().setY(0))
}

// 自适应几何中心, 外面要再包一层
export const adjustGroupCenter = (group: THREE.Group) => {
    const box = new THREE.Box3().setFromObject(group)
    // 计算 Group 的几何中心
    const center = new THREE.Vector3()
    box.getCenter(center)
    // 调整每个子物体的位置，使 Group 的几何中心位于原点
    group.children.forEach((child) => {
        child.position.sub(center)
    })
    // 移动整个 Group 使几何中心对齐
    group.position.copy(center.negate())
}

// 给所有几何体都添加 bvh 库计算
export function initBVH() {
    THREE.Mesh.prototype.raycast = acceleratedRaycast
    THREE.BufferGeometry.prototype.computeBoundsTree = computeBoundsTree
    THREE.BufferGeometry.prototype.disposeBoundsTree = disposeBoundsTree
}

// 要先执行 initBVH()
export const setThreeWater2 = async (mesh: THREE.Mesh) => {
    const loader = new THREE.TextureLoader()
    const waterGeometry = mesh.geometry.clone()
    resetUV(waterGeometry)
    waterGeometry?.computeBoundsTree()
    const tsWater = new Water2(waterGeometry, {
        color: new THREE.Color('#fff'),
        scale: 20,
        flowDirection: new THREE.Vector2(1, 1),
        textureWidth: 1024,
        textureHeight: 1024,
        normalMap0: loader.load("/demo/common/water/Water_1_M_Normal.jpg"),
        normalMap1: loader.load("/demo/common/water/Water_2_M_Normal.jpg"),
    })
    tsWater.material.transparent = true
    tsWater.material.depthWrite = true
    tsWater.material.depthTest = true
    tsWater.material.side = THREE.DoubleSide
    tsWater.material.uniforms.config.value.w = 20
    tsWater.material.uniforms.reflectivity.value = 0.46
    return tsWater
}

/**
 * 锚点重置到中心
 */
export function reAnchorCenter(mesh: THREE.Mesh) {
    const geometry = mesh.geometry
    const position = mesh.position
    geometry.computeBoundingBox()
    const center = new THREE.Vector3()
    geometry.boundingBox!.getCenter(center)
    const m = new THREE.Matrix4()
    m.set(1, 0, 0, center.x - position.x, 0, 1, 0, center.y - position.y, 0, 0, 1, center.z - position.z, 0, 0, 0, 1)
    geometry.center()
    mesh.position.applyMatrix4(m)
}

export function getCenterPoint(list: [{ x: number, y: number }]) {
    const points: THREE.Vector2[] = []
    for (let i = 0; i < list.length; i++) {
        points.push(new THREE.Vector2(list[i].x, list[i].y))
    }

    // 初始化中心点
    const centerPoint = new THREE.Vector2()

    // 计算所有点的总和
    for (let i = 0; i < points.length; i++) {
        centerPoint.add(points[i])
    }

    // 计算平均值
    centerPoint.divideScalar(points.length)

    // 将点转换为相对于中心点的偏移坐标
    for (let i = 0; i < points.length; i++) {
        points[i].sub(centerPoint)
    }

    return {points, centerPoint}
}

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


// 以下函数只做参考, 不推荐使用, 不导出, 只做备份查找参数说明时看


/**
 * 透视相机
 * @param options
 * @param k dom元素长宽比
 */
const createPerspectiveCamera = (options: PerspectiveCameraOptions, k: number) => {

    return new THREE.PerspectiveCamera(
        options.fov,
        k,
        options.near,
        options.far,
    )
}

/**
 * 正交相机
 * @param options
 * @param k dom元素长宽比
 */
const createOrthographicCamera = (options: OrthographicCameraOptions, k: number) => {

    return new THREE.OrthographicCamera(
        -options.s * k,
        options.s * k,
        options.s,
        -options.s,
        options.near,
        options.far,
    )
}


// 轨道控制器
const createControls = (camera: THREE.Camera, renderer: THREE.Renderer, options?: ControlsOptions) => {
    const controls = new OrbitControls(camera, renderer.domElement)

    const defaultOptions: Required<ControlsOptions> = {
        enableDamping: false, //阻尼(是否有惯性)
        dampingFactor: 0.25, //动态阻尼系数(鼠标拖拽旋转灵敏度)
        enableZoom: true, //缩放
        autoRotate: false, //自动旋转
        autoRotateSpeed: 2, //自动旋转速度
        minDistance: 1, //设置相机距离原点的最近距离
        maxDistance: 80000, //设置相机距离原点的最远距离
        enablePan: false, //开启右键拖拽
        maxPolarAngle: Math.PI / 2, //最大角度
    }

    const finalOptions: Required<ControlsOptions> = Object.assign({}, defaultOptions, options)

    controls.enableDamping = finalOptions.enableDamping
    controls.dampingFactor = finalOptions.dampingFactor
    controls.enableZoom = finalOptions.enableZoom
    controls.autoRotate = finalOptions.autoRotate
    controls.autoRotateSpeed = finalOptions.autoRotateSpeed
    controls.minDistance = finalOptions.minDistance
    controls.maxDistance = finalOptions.maxDistance
    controls.enablePan = finalOptions.enablePan
    controls.maxPolarAngle = finalOptions.maxPolarAngle

    return controls
}




// 渲染器
const createRenderer = (dowWidth: number, domHeight: number) => {
    const renderer = new THREE.WebGLRenderer({
        antialias: true, //抗锯齿
        alpha: true,
        logarithmicDepthBuffer: true //深度缓冲, 解决模型重叠部分不停闪烁问题
    })

    renderer.setSize(dowWidth, domHeight)
    renderer.setPixelRatio(window.devicePixelRatio)

    //renderer.setClearColor(0xff0000, 1)


    //颜色空间, 默认 THREE.SRGBColorSpace
    //renderer.outputColorSpace = THREE.SRGBColorSpace

    renderer.toneMapping = THREE.ReinhardToneMapping //曝光值 默认为2 值为整型 [1 - 2]
    renderer.toneMappingExposure = 1.25  //色调映射曝光度

    renderer.shadowMap.enabled = true // 开启阴影
    renderer.shadowMap.type = THREE.PCFSoftShadowMap //阴影类型（处理运用Shadow Map产生的阴影锯齿）

    return renderer
}





// 环境光
const createAmbientLight = (name: string, color = 0xffffff, intensity = 1) => {
    const light = new THREE.AmbientLight()
    light.name = name
    light.color = new THREE.Color(color)
    light.intensity = intensity //光线强度


    return light
}



// 平行光
const createDirectionalLight = (name: string, color: number, intensity: number) => {
    const light = new THREE.DirectionalLight()
    light.name = name
    light.color = new THREE.Color(color)
    light.intensity = intensity //光线强度



    //有关光源阴影的设置
    light.castShadow = true // 是否投射阴影
    light.shadow.mapSize.width = 2048
    light.shadow.mapSize.height = 2048
    // 阴影范围
    const d = 80
    light.shadow.camera.left = -d
    light.shadow.camera.right = d
    light.shadow.camera.top = d
    light.shadow.camera.bottom = -d
    light.shadow.bias = -0.0005 // 解决条纹阴影的出现
    // 最大可视距和最小可视距
    light.shadow.camera.near = 0.01
    light.shadow.camera.far = 2000




    return light
}


// 点光源
const createPointLight = (name: string, color: number, intensity: number, power = 800, decay = 0.1) => {
    const light = new THREE.PointLight()
    light.name = name
    light.color = new THREE.Color(color)
    light.intensity = intensity //光线强度

    light.power = power // 光功率
    light.decay = decay // 光衰, 点光源专有参数

    return light
}