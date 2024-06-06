import * as THREE from "three"
import MyGroup from "@/three-widget/MyGroup";

/**
 * @param length?: number 1000
 * @param radius?: number 100
 * @param color?: number 0x666666
 *
 */
interface SimpleSensorOptions {
    length?: number
    radius?: number
    color?: number
}

/**
 * 简易传感器
 */
export default class SimpleSensor extends MyGroup<SimpleSensorOptions> {

    constructor(name: string, options?: SimpleSensorOptions) {

        const defaultOptions: Required<SimpleSensorOptions> = {
            length: 1000,
            radius: 150,
            color: 0x666666,
        }

        super(name, defaultOptions, options)

        this.addBody()
    }

    private addBody(){
        const {length, radius, color} = this.options

        const geo = new THREE.CylinderGeometry(radius, radius, length)
        geo.translate(0, -length/2, 0)
        const mat = new THREE.MeshPhongMaterial({
            color,
            specular: color,
            shininess: 15,
        })

        const entity = new THREE.Mesh(geo, mat)
        this.add(entity)
    }


}