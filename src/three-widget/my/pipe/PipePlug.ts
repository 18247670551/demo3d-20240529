import * as THREE from "three"
import MyMesh from "@/three-widget/MyMesh"

/**
 * @param pipeRadius
 * @param length 各方向的延伸长度
 * @param color
 */
interface PipePlugOptions{
    pipeRadius?: number
}

/**
 * 管道接头 三通
 */
export default class PipePlug  extends MyMesh {

    constructor(name: string, options?: PipePlugOptions) {
        const defaultOptions: Required<PipePlugOptions> = {
            pipeRadius: 80,
        }

        const allOptions = Object.assign({}, defaultOptions, options)
        const geo = new THREE.SphereGeometry(allOptions.pipeRadius * 2, 32, 16, 0, Math.PI * 2, 0, Math.PI * 0.16)
        geo.center()
        const mat = new THREE.MeshPhongMaterial({color: 0x666666, side: THREE.DoubleSide})
        super(name, geo, mat)
    }

}
