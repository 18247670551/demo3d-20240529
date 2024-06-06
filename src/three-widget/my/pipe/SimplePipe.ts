import * as THREE from "three"
import MyMesh from "@/three-widget/MyMesh"

/**
 * @param radius 默认400
 * @param points
 * @param tubularSegments 默认64, 当管道为直管道时, 可设为 1, 减小渲染负担
 * @param radiusSegments 默认32
 * @param closed 默认false, 要封口管道请不要使用此参数, 另建模型封口, 使用此参数容易导致模型闪烁, 使用此参数时 tubularSegments 需要大于一定值时(例如10), 否则模型可能不显示
 * @param color 默认 0x666666
 * @param opacity 默认0.5
 */
interface SimplePipeOptions {
    color?: number
    opacity?: number
    closed?: boolean
    radius?: number
    tubularSegments?: number
    radiusSegments?: number
    points: number[][]
}

/**
 * 简易管道, 只有管道, 没有流动动画<br>
 * 适用于单独做流动动画的管道, 比如烟雾管道
 */
export default class SimplePipe extends MyMesh {

    readonly curve: THREE.CatmullRomCurve3
    readonly curveStart: THREE.Vector3
    readonly curveEnd: THREE.Vector3
    readonly options: Required<SimplePipeOptions>

    constructor(name: string, options: SimplePipeOptions) {

        const defaultOptions: Required<SimplePipeOptions> = {
            radius: 400,
            color: 0x666666,
            opacity: 1,
            tubularSegments: 64,
            radiusSegments: 32,
            closed: false,
            points: []
        }

        const innerOptions = Object.assign({}, defaultOptions, options)

        const {tubularSegments, radiusSegments, radius, color, closed, points, opacity,} = innerOptions


        const v3s = points.map(item => new THREE.Vector3(...item))

        const curve = new THREE.CatmullRomCurve3(v3s)
        const geo = new THREE.TubeGeometry(curve, tubularSegments, radius, radiusSegments, closed)

        const mat =  new THREE.MeshPhongMaterial({
            color,
            transparent: true,
            opacity,
            side: THREE.DoubleSide,
            specular: color,
            shininess: 15,
        })

        super(name, geo, mat)

        this.options = innerOptions

        this.curve = curve
        this.curveStart = this.curve.points[0]
        this.curveEnd = this.curve.points[this.curve.points.length - 1]
    }

}