import * as THREE from "three"
import {Water as Water2} from "three/examples/jsm/objects/Water2"
import {acceleratedRaycast, computeBoundsTree, disposeBoundsTree} from "three-mesh-bvh"
import * as BufferGeometryUtils from 'three/examples/jsm/utils/BufferGeometryUtils.js'

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
 * @param {Object3D} mesh
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
