import * as THREE from "three"
import {LatheGeometry} from "three"
import MyGroup from "@/three-widget/MyGroup"

/**
 * @param tierRadius 层半径
 * @param tierHeight 屋高
 * @param tiers 屋数
 * @param color 塔颜色
 * @param joinRadius 接口半径
 */
interface SprayTowerOptions {
    tierRadius?: number
    tierHeight?: number
    tiers?: number
    wallThickness?: number
    color?: number
    joinRadius?: number
}

export default class SprayTower extends MyGroup<SprayTowerOptions>  {

    constructor(name: string, options?: SprayTowerOptions) {

        const defaultOptions: Required<SprayTowerOptions> = {
            tierRadius: 1800,
            tierHeight: 2200,
            tiers: 3,
            wallThickness: 10,
            color: 0x666666,
            joinRadius: 500
        }

        super(name, defaultOptions, options)

        this.addTier()
        this.addJoin()
    }

    private addTier() {
        const group = new THREE.Group()

        for (let i = 0; i < this.options.tiers; i++) {
            const tier = this.createTier()
            tier.position.y = this.options.tierHeight * i
            group.add(tier)
        }
        this.add(group)
    }


    private createTier() {

        const {tierRadius, tiers, tierHeight, joinRadius, color, wallThickness} = this.options

        const shape = new THREE.Shape()

        shape.arc(0, 0, tierRadius, 0, 2 * Math.PI, false)

        const hole = new THREE.Path()
        hole.arc(0, 0, tierRadius - wallThickness * 2, 0, 2 * Math.PI, false)

        shape.holes.push(hole)

        const extrudeSettings = {
            curveSegments: 64,
            steps: 2,
            depth: tierHeight,
            bevelEnabled: false,
        }

        const wallGeo = new THREE.ExtrudeGeometry(shape, extrudeSettings)
        const wallWat = new THREE.MeshPhongMaterial({
            color,
            transparent: true,
            opacity: 0.5,
            side: THREE.DoubleSide,
            depthWrite: false,
            specular: color,
            shininess: 15,
        })
        const wallMesh = new THREE.Mesh(wallGeo, wallWat)
        wallMesh.rotateX(Math.PI * -0.5)
        return wallMesh
    }


    private addJoin() {
        const {tierRadius, tiers, tierHeight, joinRadius, color, wallThickness} = this.options

        const wat = new THREE.MeshPhongMaterial({
            color,
            transparent: true,
            opacity: 0.7,
            side: THREE.DoubleSide,
            specular: color,
            shininess: 15,
        })

        const R = tierRadius
        const r = joinRadius

        const joinHeight = 300

        const points = [
            [R, 0],
            [r, R / 2],
            [r, R / 2 + joinHeight],
            [r + 100, R / 2 + joinHeight],
            [r + 100, R / 2 + joinHeight + 100],
            [r, R / 2 + joinHeight + 100],
        ]

        const v2s = points.map(it => new THREE.Vector2(...it))

        const geometry = new LatheGeometry(v2s, 50, 0, Math.PI * 2)
        const mesh = new THREE.Mesh(geometry, wat)
        mesh.name = "接口"
        mesh.position.y = tierHeight * tiers
        this.add(mesh)
    }

}
