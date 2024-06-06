import * as THREE from "three"
import {LatheGeometry} from "three"
import MyGroup from "@/three-widget/MyGroup"


/**
 * @param bodyHeight 罐体高
 * @param xRadius 罐体㮋圆长轴
 * @param yRadius 罐体㮋圆短轴
 */
interface TankOptions {
    bodyHeight?: number
    xRadius?: number
    yRadius?: number
    joinRadius?: number
    color?: number
}


/**
 * 储气罐
 */
export default class Tank extends MyGroup<TankOptions> {

    /**
     * 出气口高度
     */
    readonly joinY: number

    constructor(name: string, options?: TankOptions) {

        const defaultOptions: Required<TankOptions> = {
            bodyHeight: 3000,
            xRadius: 800,
            yRadius: 500,
            joinRadius: 80,
            color: 0x666666,
        }

        super(name, defaultOptions, options)

        this.joinY = this.addBody()
    }

    private addBody() {

        const joinY = 600

        const bodyHeight = this.options.bodyHeight
        const xRadius = this.options.xRadius
        const yRadius = this.options.yRadius

        const group = new THREE.Group
        const {color} = this.options

        const garyMat = new THREE.MeshPhongMaterial({
            color,
            specular: color,
            shininess: 15,
        })

        const points = new THREE.EllipseCurve(
            0,
            yRadius,
            xRadius,
            yRadius,
            Math.PI * 1.5,
            0,
            false,
            0
        ).getPoints(50)

        points.push(new THREE.Vector2(xRadius, bodyHeight - yRadius * 2))

        const arcPoints = new THREE.EllipseCurve(
            0,
            points[points.length - 1].y,
            xRadius,
            yRadius,
            0,
            Math.PI * 0.5,
            false,
            0
        ).getPoints(50)

        points.push(...arcPoints)

        const geometry = new LatheGeometry(points, 50, 0, Math.PI * 2)

        geometry.translate(0, joinY, 0)
        const mesh = new THREE.Mesh(geometry, garyMat)
        mesh.name = "罐体"
        group.add(mesh)
        this.add(mesh)

        const legHeight = 1000

        const legGeo = new THREE.CylinderGeometry(70, 50, legHeight, 32, 1)
        legGeo.rotateZ(Math.PI * 0.05)
        legGeo.translate(xRadius * 0.8, legHeight / 2 + 100, 0)
        const leg1 = new THREE.Mesh(legGeo, garyMat)
        leg1.rotateY(Math.PI / 3)
        this.add(leg1)

        const leg2 = leg1.clone()
        leg2.rotateY(Math.PI / 3 * 2)
        this.add(leg2)

        const leg3 = leg1.clone()
        leg3.rotateY(Math.PI / 3 * 4)
        this.add(leg3)


        const joinRadius = this.options.joinRadius
        const joinGeo = new THREE.CylinderGeometry(joinRadius, joinRadius, 200, 16)
        const join = new THREE.Mesh(joinGeo, garyMat)
        join.position.y = joinY
        this.add(join)

        return joinY
    }

}