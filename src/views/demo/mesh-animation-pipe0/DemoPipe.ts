import * as THREE from "three"
import gsap from "gsap"
import MyMesh from "@/three-widget/MyMesh"
import {Curve} from "three/src/extras/core/Curve"
import {Vector3} from "three/src/math/Vector3"
import {getTextureLoader} from "@/three-widget/loader/ThreeLoader"

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
    radiusSegments?: number,
    tubularSegments?: number
    curve: Curve<Vector3>,
}

export default class DemoPipe extends MyMesh {

    private readonly flowAnimation: gsap.core.Tween
    private readonly flowTexture: THREE.Texture

    constructor(name: string, options: DemoPipeOptions) {

        const defaultOptions = {
            radius: 70,
            color: 0x777777,
            radiusSegments: 16,
            tubularSegments: 100,
            curve: new THREE.CatmullRomCurve3(),
        }

        const finalOptions: Required<DemoPipeOptions> = Object.assign({}, defaultOptions, options)

        const flowTexture = getTextureLoader().load("/demo/scene-ming/common/pipe/flow.png")

        flowTexture.colorSpace = THREE.SRGBColorSpace
        flowTexture.wrapS = flowTexture.wrapT = THREE.RepeatWrapping
        // finalOptions.curve.getLength() / 1000 获取管道总长度 / 1000, 是贴图横向重复次数, 以确保每条管道贴图样式相同
        flowTexture.repeat.set(finalOptions.curve.getLength() / 1000, 1)
        flowTexture.needsUpdate = true

        const mat = new THREE.MeshPhongMaterial({
            color: finalOptions.color,
            transparent: true,
            side: THREE.DoubleSide,
            specular: finalOptions.color,
            shininess: 15,
            //map: flowTexture
        })
        //mat.needsUpdate = true

        const geo = new THREE.TubeGeometry(finalOptions.curve, finalOptions.tubularSegments, finalOptions.radius, finalOptions.radiusSegments)

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