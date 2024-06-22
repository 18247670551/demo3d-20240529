import * as THREE from "three"


export default class MyGroup<T> extends THREE.Group{

    readonly MyGroup = "MyGroup"

    readonly options: Required<T>

    /**
     * @param name 强制自己都给对象起名字, 方便调试
     * @param defaultOptions 模型参数 所有字段
     * @param customOptions 用户参数
     */
    constructor(name: string, defaultOptions: Required<T>, customOptions?: T) {
        super()
        this.name = name
        this.options = Object.assign(defaultOptions, customOptions)
    }

    getBox(){
        // 更新模型的世界矩阵
        this.updateMatrixWorld()
        // 获取模型的包围盒
        const box = new THREE.Box3().setFromObject(this)

        return {
            minX: box.min.x,
            maxX: box.max.x,
            minY: box.min.y,
            maxY: box.max.y,
            minZ: box.min.z,
            maxZ: box.max.z,
            xLength: box.max.x - box.min.x,
            yLength: box.max.y - box.min.y,
            zLength: box.max.z - box.min.z,
            // 数轴上任意两点中心点公式 = a + (b - a)/2
            centerX: box.min.x + (box.max.x - box.min.x)/2,
            centerY: box.min.y + (box.max.y - box.min.y)/2,
            centerZ: box.min.z + (box.max.z - box.min.z)/2
        }
    }

}