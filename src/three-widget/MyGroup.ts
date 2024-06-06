import * as THREE from "three"


export default class MyGroup<T> extends THREE.Group{

    // 需要遍历场景中所有自己的Group时, 依靠这个tag来找
    readonly myTag = "MyGroup"

    readonly options: Required<T>

    /**
     * @param name 强制自己都给对象起个名字, 方便调试
     * @param defaultOptions 模型所有字段参数, 即 必选非必选都必须有, 如果无参可传, 写一个空对象 {}
     * @param customOptions 用户参数, 即必选字段必定有, 非必选参数可以有也可以没有
     */
    constructor(name: string, defaultOptions: Required<T>, customOptions?: T) {
        super()
        this.name = name
        // @ts-ignore 用户参数覆盖所有参数(默认参数), 即: 用户传参了的使用用户的, 用户没传参的使用默认的
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