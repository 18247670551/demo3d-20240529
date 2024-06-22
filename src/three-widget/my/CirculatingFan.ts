import * as THREE from "three"
import gsap from "gsap"
import MyGroup from "@/three-widget/MyGroup"
import {getTextureLoader} from "@/three-widget/loader/ThreeLoader"

/**
 * 循环风机
 * @param boxColor?: number
 * @param boxRadius?: number
 * @param boxHeight?: number
 * @param leafRadius?: number
 * @param leafSpeed?: number 每秒几转
 */
export interface HeatingFanOptions {
    boxColor?: number
    boxRadius?: number
    boxHeight?: number
    leafRadius?: number
    leafSpeed?: number
}

export default class CirculatingFan extends MyGroup<HeatingFanOptions> {

    private isRun = false
    private readonly leaf: THREE.Mesh
    private readonly leafAnimation: gsap.core.Tween

    constructor(name: string, options?: HeatingFanOptions) {

        const defaultOptions: Required<HeatingFanOptions> = {
            boxColor: 0x0b689b,
            boxRadius: 450,
            boxHeight: 320,
            leafRadius: 320,
            leafSpeed: 2,
        }

        super(name, defaultOptions, options)

        this.addBox()
        this.leaf = this.addAndGetLeaf()
        this.leafAnimation = this.createLeafAnimation()
        this.position.y = this.options.boxHeight/2
    }

    private addBox() {
        const {boxRadius, boxHeight, boxColor} = this.options
        const geometry = new THREE.CylinderGeometry(boxRadius, boxRadius, boxHeight, 32)
        const edges = new THREE.EdgesGeometry(geometry)
        let material = new THREE.LineBasicMaterial({color: boxColor})
        const line = new THREE.LineSegments(edges, material)
        line.name = '外壳'
        this.add(line)
    }

    private addAndGetLeaf() {
        const geometry = new THREE.CircleGeometry(this.options.leafRadius, 30)
        const texture = getTextureLoader().load("/demo/my/dry/fanLeaf_blue.png")
        
        texture.colorSpace = THREE.SRGBColorSpace

        const material = new THREE.MeshBasicMaterial({
            map: texture,
            side: THREE.DoubleSide,
            opacity: 1.0,
            transparent: true,
        })

        const entity = new THREE.Mesh(geometry, material)
        entity.rotateX(Math.PI * 0.5)
        entity.name = "叶片"
        this.add(entity)
        return entity
    }

    private createLeafAnimation() {
        return gsap.to(
            this.leaf.rotation,
            {
                z: Math.PI * 2,
                duration: 1/this.options.leafSpeed,
                ease: "none",
                repeat: -1,
                paused: true
            }
        )
    }

    run() {
        if (this.isRun) {
            //console.log(this.name + "已在工作中")
            return
        }

        this.leafAnimation.resume()
        this.isRun = true
    }

    stop() {
        if (!this.isRun) {
            //console.log(this.name + "未运行")
            return
        }

        this.leafAnimation.pause()
        this.isRun = false
    }

}
