import * as THREE from "three"
import MyGroup from "@/three-widget/MyGroup"

/**
 * 烟囱
 * @param radius 烟管半径
 * @param height 烟管高
 * @param color 颜色
 */
interface ChimneyOptions {
    radius?: number
    height?: number
    color?: number
    opacity?: number
}

export default class Chimney extends MyGroup<ChimneyOptions> {

    constructor(name: string, options?: ChimneyOptions) {

        const defaultOptions: Required<ChimneyOptions> = {
            radius: 600,
            height: 15000,
            color: 0x666666,
            opacity: 1,
        }

        super(name, defaultOptions, options)

        this.createTube()
        this.addCap()
    }


    private createTube() {
        const {color, opacity, height, radius} = this.options

        const group = new THREE.Group()

        const mat = new THREE.MeshPhongMaterial({
            color,
            transparent: true,
            opacity,
            side: THREE.DoubleSide,
            specular: 0x777777,
            shininess: 15,
        })

        const curvePoints = [
            new THREE.Vector3(0, 0, 0),
            new THREE.Vector3(0, height, 0),
        ]

        const curve = new THREE.CatmullRomCurve3(curvePoints)
        const tubeGeo = new THREE.TubeGeometry(curve, 1, radius, 32)
        const tube = new THREE.Mesh(tubeGeo, mat)
        tube.name = "烟囱筒体"

        group.add(tube)

        this.add(group)
    }

    private addCap() {
        const {color, opacity, height, radius} = this.options

        const mat = new THREE.MeshPhongMaterial({
            color,
            side: THREE.DoubleSide,
            specular: color,
            shininess: 15,
        })

        const group = new THREE.Group()

        //帽子支杆高度
        const extHeight = this.options.radius * 1.5

        const shape1 = new THREE.Shape()
        shape1.arc(500, 0, 10, 0, 2 * Math.PI, false)

        const shape2 = new THREE.Shape()
        shape2.arc(0, 500, 10, 0, 2 * Math.PI, false)

        const shape3 = new THREE.Shape()
        shape3.arc(-500, 0, 10, 0, 2 * Math.PI, false)

        const shape4 = new THREE.Shape()
        shape4.arc(0, -500, 10, 0, 2 * Math.PI, false)

        const extrudeSettings = {
            steps: 2,
            depth: extHeight,
            bevelEnabled: false
        }

        const extGeo = new THREE.ExtrudeGeometry([shape1, shape2, shape3, shape4], extrudeSettings)
        extGeo.rotateX(Math.PI * 0.5)
        extGeo.translate(0, extHeight, 0)
        const extMesh = new THREE.Mesh(extGeo, mat)
        group.add(extMesh)


        const coneGeo = new THREE.ConeGeometry(this.options.radius * 2, this.options.radius, 32, 2, true)
        coneGeo.translate(0, extHeight + 100, 0)
        const cone = new THREE.Mesh(coneGeo, mat)
        group.add(cone)

        //-200 让支杆和烟管有一段重合部分, 美观
        group.position.y = this.options.height - 200
        this.add(group)
    }


}