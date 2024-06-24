import * as THREE from "three"
import gsap from "gsap"
import MyMesh from "@/three-widget/MyMesh"
import {getTextureLoader} from "@/three-widget/loader/ThreeLoader"

/**
 * @param pipeRadius?: number
 * @param pipeColor?: number
 * @param flowTexture?: THREE.Texture,
 * @param tubularSegments?: number
 * @param radiusSegments?: number,
 * @param closed?: boolean,
 * @param points: number[][],
 */
export interface PipeOptions {
    radius?: number
    color?: number
    flowTexture?: THREE.Texture,
    tubularSegments?: number
    radiusSegments?: number,
    closed?: boolean,
    points: number[][],
}


export default class Pipe extends MyMesh {

    private readonly flowAnimation: gsap.core.Tween
    private readonly options: Required<PipeOptions>

    constructor(name: string, options: PipeOptions) {

        const flowTexture = getTextureLoader().load("/demo/scene-ming/pipe/pipe_flow.png")
        
        flowTexture.colorSpace = THREE.SRGBColorSpace
        flowTexture.wrapS = flowTexture.wrapT = THREE.RepeatWrapping
        flowTexture.needsUpdate = true

        const defaultOptions: Required<PipeOptions> = {
            radius: 70,
            color: 0x777777,
            flowTexture: flowTexture,
            tubularSegments: 64,
            radiusSegments: 32,
            closed: false,
            points: []
        }

        const innerOptions: Required<PipeOptions> = Object.assign({}, defaultOptions, options)

        const {tubularSegments, radiusSegments, radius, color, closed, points, } = innerOptions

        const pathPoints: THREE.Vector3[] = []

        const pipeLength = Pipe.pointsToVector3Array(points, pathPoints)

        const curve = new THREE.CatmullRomCurve3(pathPoints)

        const mat = new THREE.MeshPhongMaterial({
            color: innerOptions.color,
            transparent: true,
            side: THREE.DoubleSide,
            specular: innerOptions.color,
            shininess: 15,
        })
        mat.needsUpdate = true

        const geo = new THREE.TubeGeometry(curve, tubularSegments, radius, radiusSegments, closed)

        innerOptions.flowTexture.repeat.set(Pipe.calcRepeatX(pipeLength), 1)

        super(name, geo, mat)

        this.options = innerOptions

        this.flowAnimation = this.createFlowAnimation()
    }

    /**
     * 计算管道材质 x轴重复次数
     * @param pipeLength
     */
    private static calcRepeatX(pipeLength: number) {
        return pipeLength / 1000
    }

    /**
     * 因为需要返回管道总长度, 所以 THREE.Vector3[] 不采用返回值方式, 做参数传进来, 返回值是计算的管道总长度
     * @param points
     * @param pathPoints
     */
    private static pointsToVector3Array(points: number[][], pathPoints: THREE.Vector3[]) {

        let pipeLength = 0

        let currentX = 0, currentY = 0, currentZ = 0
        let tempX = 0, tempY = 0, tempZ = 0

        for (let i = 0; i < points.length; i++) {
            currentX = points[i][0]
            currentY = points[i][1]
            currentZ = points[i][2]

            pathPoints.push(new THREE.Vector3(currentX, currentY, currentZ))

            if (i != 0) {
                pipeLength += Math.abs(currentX - tempX) + Math.abs(currentY - tempY) + Math.abs(currentZ - tempZ)
            }

            tempX = currentX
            tempY = currentY
            tempZ = currentZ
        }

        return pipeLength
    }

    private createFlowAnimation() {
        return gsap.to(
            this.options.flowTexture.offset,
            {
                x: -3,
                duration: 1,
                ease: "none",
                repeat: -1,
                paused: true,
                // 没有设置 texture.needsUpdate = true 材质动画也会刷新
                // onUpdate: () => {
                //     this.texture.needsUpdate = true
                // }
            }
        )
    }

    flow() {
        const mat = this.material as THREE.MeshPhongMaterial
        mat.dispose()
        mat.color = new THREE.Color(0x999999)
        mat.map = this.options.flowTexture
        this.flowAnimation.resume()
    }

    stop() {
        this.flowAnimation.pause()
        const mat = this.material as THREE.MeshPhongMaterial
        mat.color = new THREE.Color(this.options.color)
        mat.dispose()
        mat.map = null
    }

}