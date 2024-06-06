import * as THREE from 'three'
import MyGroup from "@/three-widget/MyGroup"

/**
 * @param length
 * @param height
 * @param width
 */
export interface SimplePumpBaseOptions {
    length?: number
    height?: number
    width?: number
}


/**
 * 简易水泵基座
 * <br>
 * 在一些空间非常拥挤的地方, 水泵使用此简易模型, 只是一个长方体
 */
export default class SimplePumpBase extends MyGroup<SimplePumpBaseOptions> {

    constructor(name: string, options?: SimplePumpBaseOptions) {

        const defaultOptions: Required<SimplePumpBaseOptions> = {
            length: 900,
            height: 600,
            width: 500,
        }

        super(name, defaultOptions, options)

        this.addBody()
    }

    private addBody() {
        const {length, height, width} = <Required<SimplePumpBaseOptions>>this.options

        const baseMat = new THREE.MeshPhongMaterial({
            color: 0x666666,
            specular: 0x666666,
            shininess: 20,
        })

        const baseGeo = new THREE.BoxGeometry(length, height, width)
        const base = new THREE.Mesh(baseGeo, baseMat)
        base.name = "水泵基座"
        this.add(base)
    }

}