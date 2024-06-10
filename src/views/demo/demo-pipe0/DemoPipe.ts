import * as THREE from "three"
import gsap from "gsap"
import MyMesh from "@/three-widget/MyMesh"
import {Curve} from "three/src/extras/core/Curve"
import {Vector3} from "three/src/math/Vector3"

/**
 * radius?: 管道半径
 * color?: 管道半径
 * tubularSegments?: 管道长向细分
 * radiusSegments?: 管道半径细分
 * curve: Curve<Vector3> 管道曲线
 */
interface DemoPipeOptions {
    radius?: number
    color?: number
    tubularSegments?: number
    radiusSegments?: number,
    curve: Curve<Vector3>,
}

export default class DemoPipe extends MyMesh {

    private readonly flowAnimation: gsap.core.Tween
    private readonly flowTexture: THREE.Texture

    constructor(name: string, options: DemoPipeOptions) {

        const defaultOptions = {
            radius: 70,
            color: 0x777777,
            tubularSegments: 100,
            radiusSegments: 16,
            curve: new THREE.CatmullRomCurve3(),
        }

        const allOptions: Required<DemoPipeOptions> = Object.assign({}, defaultOptions, options)

        const flowTexture = new THREE.TextureLoader().load("/demo/my/common/pipe/flow.png")

        flowTexture.colorSpace = THREE.SRGBColorSpace
        flowTexture.wrapS = flowTexture.wrapT = THREE.RepeatWrapping
        // allOptions.curve.getLength() / 1000 获取管道总长度 / 1000, 是贴图横向重复净数, 以确保每条管道贴图样式相同
        flowTexture.repeat.set(allOptions.curve.getLength() / 1000, 1)
        flowTexture.needsUpdate = true

        const mat = new THREE.MeshPhongMaterial({
            color: allOptions.color,
            transparent: true,
            side: THREE.DoubleSide,
            specular: allOptions.color,
            shininess: 15,
            //map: flowTexture
        })
        //mat.needsUpdate = true

        const geo = new THREE.TubeGeometry(allOptions.curve, allOptions.tubularSegments, allOptions.radius, allOptions.radiusSegments)

        super(name, geo, mat)

        this.flowTexture = flowTexture
        this.flowAnimation = this.createFlowAnimation()
    }

    private createFlowAnimation() {
        return gsap.to(
            this.flowTexture.offset,
            {
                x: -3,
                duration: 1,
                ease: "none",
                repeat: -1,
                paused: true
            }
        )
    }

    startFlow() {
        const mat = this.material as THREE.MeshPhongMaterial
        mat.map = this.flowTexture
        this.flowAnimation.resume()
    }

    stopFlow() {
        this.flowAnimation.pause()
        const mat = this.material as THREE.MeshPhongMaterial
        mat.map = null
    }

}