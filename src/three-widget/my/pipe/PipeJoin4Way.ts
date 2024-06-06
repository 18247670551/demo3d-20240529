import * as THREE from "three"
import MyGroup from "@/three-widget/MyGroup";

/**
 * @param pipeRadius
 * @param length 各方向的延伸长度
 * @param color
 */
interface PipJoin4WayOptions{
    pipeRadius?: number
    length?: number
    color?: number
}

/**
 * 管道接头 四通(左, 前, 上, 下)
 * 目前只有云浮净水, 原水池两通道水路汇合再分成两路进砂罐进水 和 砂罐反选进水
 */
export default class PipJoin4Way  extends MyGroup<PipJoin4WayOptions> {

    constructor(name: string, options?: PipJoin4WayOptions) {

        const defaultOptions: Required<PipJoin4WayOptions> = {
            pipeRadius: 80,
            length: 300,
            color: 0x666666,
        }

        super(name, defaultOptions, options)

        this.addBody()
    }

    private addBody(){

        const {color, length, pipeRadius} = this.options

        const material = new THREE.MeshPhongMaterial({
            color,
            specular: color,
            shininess: 15,
        })

        //竖向管(上 和 下), 两个方向, 所以高度为 length * 2
        const verGeo = new THREE.CylinderGeometry(pipeRadius, pipeRadius, length * 2, 16)
        const ver = new THREE.Mesh(verGeo, material)
        this.add(ver)

        //左
        const leftGeo = new THREE.CylinderGeometry(pipeRadius, pipeRadius, length, 16)
        leftGeo.translate(0, length/2, 0)
        const left = new THREE.Mesh(leftGeo, material)
        left.rotateZ(Math.PI * 0.5)
        this.add(left)

        //前
        const frontGeo = new THREE.CylinderGeometry(pipeRadius, pipeRadius, length, 16)
        frontGeo.translate(0, length/2, 0)
        const front = new THREE.Mesh(frontGeo, material)
        front.rotateX(Math.PI * 0.5)
        this.add(front)

    }

}
