import * as THREE from "three"
import MyGroup from "@/three-widget/MyGroup"

/**
 * @param length?: number 2000
 * @param width?: number 1000
 * @param height?: number 4000
 *
 */
interface SimpleCabinetOptions {
    length?: number
    width?: number
    height?: number
    color?: number
}

/**
 * 简易柜
 */
export class SimpleCabinet extends MyGroup<SimpleCabinetOptions> {

    constructor(name: string, options?: SimpleCabinetOptions) {

        const defaultOptions: Required<SimpleCabinetOptions> = {
            length: 3000,
            width: 1000,
            height: 5000,
            color: 0x666666,
        }

        super(name, defaultOptions, options)

        this.addBody()
    }

    private addBody(){
        const {length, height, width, color} = this.options

        const geo = new THREE.BoxGeometry(length, height, width)
        geo.translate(0, height/2, width)
        const mat = new THREE.MeshPhongMaterial({
            color,
            specular: color,
            shininess: 15,
        })

        const entity = new THREE.Mesh(geo, mat)
        this.add(entity)
    }


}