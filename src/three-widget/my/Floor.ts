import * as THREE from "three"
import MyGroup from "@/three-widget/MyGroup"

/**
 * @param length?: number 20000
 * @param width?: number 16000
 * @param material?: THREE.Material THREE.MeshBasicMaterial({color: 0x33a3dc, transparent: true, opacity: 0.5, side: THREE.DoubleSide})
 */
interface FloorOptions {
    length?: number
    width?: number
    material?: THREE.Material
}

export default class Floor extends MyGroup<FloorOptions> {

    constructor(name: string, options?: FloorOptions) {

        const defaultOptions: Required<FloorOptions> = {
            length: 20000,
            width: 16000,
            material: new THREE.MeshBasicMaterial({color: 0x33a3dc, transparent: true, opacity: 0.5, side: THREE.DoubleSide})
        }

        super(name, defaultOptions, options)

        this.addFloor()
    }

    private addFloor() {
        const geometry = new THREE.PlaneGeometry(this.options.length, this.options.width)
        const entity = new THREE.Mesh(geometry, this.options.material)
        entity.rotateX(Math.PI * 0.5)
        this.add(entity)
    }

}
