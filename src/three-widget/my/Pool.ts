import * as THREE from "three"
import gsap from "gsap"
import MyGroup from "@/three-widget/MyGroup"
import * as CSG from "@/three-widget/CSG"
import {getTextureLoader} from "@/three-widget/loader/ThreeLoader"

/**
 * @param length?: number 1500
 * @param width?: number 4000
 * @param height?: number 2000
 * @param wallThickness?: number
 * @param wallColor?: number
 * @param liquidColor?: number
 * @param defaultLevel?: number
 *
 */
interface PoolOptions {
    length?: number
    width?: number
    height?: number
    wallThickness?: number
    wallColor?: number
    liquidColor?: number
    defaultLevel?: number
}

/**
 * 水池
 */
export default class Pool extends MyGroup<PoolOptions> {

    private readonly liquid: THREE.Mesh
    private readonly levelChangeAnimation: gsap.core.Tween

    constructor(name: string, options?: PoolOptions) {

        const defaultOptions: Required<PoolOptions> = {
            length: 1500,
            width: 4000,
            height: 2000,
            wallThickness: 100,
            wallColor: 0x0372A2,
            liquidColor: 0x009ad6,
            defaultLevel: 0.5,
        }

        super(name, defaultOptions, options)

        this.addPool()

        this.liquid = this.addAndGetLiquid()
        this.add(this.liquid)

        this.levelChangeAnimation = this.createLevelChangeAnimation()
        this.setLevel(this.options.defaultLevel)
    }

    private addPool() {

        const {length, height, width, wallThickness} = this.options

        //内部
        const iw = length - wallThickness * 2
        const ih = height - wallThickness * 2
        const id = width - wallThickness * 2

        const mat = new THREE.MeshPhongMaterial({
            color: this.options.wallColor,
            transparent: true,
            opacity: 0.6,
            specular: 'grey',
            shininess: 15,
        })

        const outGeo = new THREE.BoxGeometry(length, height, width)
        const out = new THREE.Mesh(outGeo, mat)

        const innerGeo = new THREE.BoxGeometry(iw, ih, id)
        const inner = new THREE.Mesh(innerGeo, mat)
        inner.position.y = this.options.wallThickness

        const geo = CSG.calc(out, inner, "subtract")
        const entity = new THREE.Mesh(geo, mat)
        entity.name = "容器"
        entity.position.y = height / 2
        entity.renderOrder = 1

        this.add(entity)
    }

    private addAndGetLiquid() {

        const {length, height, width, wallThickness, liquidColor} = this.options

        const w = length - wallThickness * 2
        //为了让水位满时与水槽顶重合, 高度只加一个壁厚
        const h = height - wallThickness
        const d = width - wallThickness * 2

        const geo = new THREE.BoxGeometry(w, h, d)
        geo.translate(0, h / 2, 0)

        //液体水面材质
        const texture = getTextureLoader().load("/demo/scene-ming/common/pool/river.jpg")
        
        texture.colorSpace = THREE.SRGBColorSpace
        let waterPlaneMat = new THREE.MeshStandardMaterial({
            color: liquidColor,
            transparent: true,
            opacity: 0.9
        })
        waterPlaneMat.map = texture
        waterPlaneMat.bumpMap = texture
        waterPlaneMat.roughnessMap = texture
        waterPlaneMat.bumpScale = 0.01
        waterPlaneMat.metalness = 0.1
        waterPlaneMat.roughness = 0.7

        //液体其它三个面材质
        const basicMat = new THREE.MeshBasicMaterial({color: liquidColor})

        const materials = [
            basicMat,//右面
            basicMat,//左面
            waterPlaneMat,//上面
            basicMat,//底面
            basicMat,//前面
            basicMat,//后面
        ]

        const entity = new THREE.Mesh(geo, materials)
        entity.name = "液体"
        entity.position.y = wallThickness
        return entity
    }

    private createLevelChangeAnimation() {
        return gsap.to(
            this.liquid.scale,
            {
                y: 1,
                duration: 0.5
            }
        )
    }

    /**
     * 设置液位
     */
    setLevel(level: number) {
        this.levelChangeAnimation.resetTo("y", level)
        this.levelChangeAnimation.restart()
    }

}
