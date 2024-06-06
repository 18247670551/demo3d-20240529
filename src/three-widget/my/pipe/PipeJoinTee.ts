import * as THREE from "three"
import MyGroup from "@/three-widget/MyGroup";

/**
 * @param pipeRadius
 * @param length 各方向的延伸长度
 * @param color
 */
interface PipeJoinTeeOptions{
    pipeRadius?: number
    length?: number
    color?: number
}


/**
 * 管道接头 三通
 */
export default class PipeJoinTee  extends MyGroup<PipeJoinTeeOptions> {

    readonly height: number

    constructor(name: string, options?: PipeJoinTeeOptions) {
        const defaultOptions: Required<PipeJoinTeeOptions> = {
            pipeRadius: 80,
            length: 300,
            color: 0x666666,
        }

        super(name, defaultOptions, options)

        this.height = this.options.length/2 + this.options.pipeRadius/2

        this.addTee()
    }

    private addTee(){

        const {color} = this.options

        const material = new THREE.MeshPhongMaterial({
            color,
            specular: color,
            shininess: 15,
        })

        //竖向管
        const geometry1 = new THREE.CylinderGeometry(this.options.pipeRadius, this.options.pipeRadius, this.options.length, 32)
        const entity1 = new THREE.Mesh(geometry1, material)
        entity1.position.y = this.options.length/2
        this.add(entity1)

        //横向管, 横向管是两个方向的延伸, 长度为 this.length * 2
        const geometry2 = new THREE.CylinderGeometry(this.options.pipeRadius, this.options.pipeRadius, this.options.length * 2, 32)
        const entity2 = new THREE.Mesh(geometry2, material)
        entity2.rotateZ(Math.PI * 0.5)
        this.add(entity2)

    }

}
