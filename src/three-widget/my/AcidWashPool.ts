import * as THREE from "three"
import gsap from "gsap"
import MyGroup from "@/three-widget/MyGroup";


/**
 * @param length 水池长
 * @param width 水池宽
 * @param height 水池高
 * @param wallThickness 墙的厚度
 * @param defaultLevel
 */
interface AcidWashPoolOptions{
    length?: number
    width?: number
    height?: number
    wallThickness?: number
    wallColor?: number
    liquidColor?: number
    defaultLevel?: number
}


/**
 * 除臭系统酸洗药搅拌池
 */
export default class AcidWashPool extends MyGroup<AcidWashPoolOptions>{

    private readonly liquid: THREE.Mesh
    private readonly levelChangeAnimation: gsap.core.Tween

    constructor(name: string, options?: AcidWashPoolOptions) {

        const defaultOptions: Required<AcidWashPoolOptions> = {
            length: 2000,
            width: 5000,
            height: 2000,
            wallThickness: 400,
            wallColor: 0x666666,
            liquidColor: 0x009ad6,
            defaultLevel: 0.5,
        }

        super(name, defaultOptions, options)

        this.liquid = this.addAndGetLiquid()
        this.addPool()

        this.levelChangeAnimation = this.createLevelChangeAnimation()
        this.setLevel(this.options.defaultLevel)
    }

    private addPool() {
        const w = this.options.length
        const h = this.options.height
        const d = this.options.width

        const mat = new THREE.MeshPhongMaterial({
            color: this.options.wallColor,
            transparent: true,
            opacity: 0.5,
        })

        const mat1 = new THREE.MeshPhongMaterial({
            color: this.options.wallColor,
            transparent: true,
            opacity: 0.7,
        })

        const materials = [
            mat1,//右面
            mat1,//左面
            mat1,//上面
            mat1,//底面
            mat,//前面
            mat1,//后面
        ]

        const geo = new THREE.BoxGeometry(w, h, d)
        geo.translate(0, h/2, 0)
        const entity = new THREE.Mesh(geo, materials)
        entity.name = "水池"

        entity.renderOrder = 1

        this.add(entity)
    }

    private addAndGetLiquid() {

        const w = this.options.length - this.options.wallThickness * 2
        const d = this.options.width - this.options.wallThickness * 2
        const h = this.options.height - this.options.wallThickness * 2

        const geo = new THREE.BoxGeometry(w, h, d)
        geo.translate(0, h/2 + this.options.wallThickness, 0)

        const mat = new THREE.MeshPhongMaterial({
            color: this.options.liquidColor,
            transparent: true,
            opacity: 0.5,
        })

        const mat1 = new THREE.MeshPhongMaterial({
            color: this.options.liquidColor,
            transparent: true,
            opacity: 0.7,
        })

        const materials = [
            mat1,//右面
            mat1,//左面
            mat1,//上面
            mat1,//底面
            mat,//前面
            mat1,//后面
        ]

        const entity = new THREE.Mesh(geo, materials)
        entity.name = "液体"

        this.add(entity)

        return entity
    }

    private createLevelChangeAnimation() {
        return gsap.to(
            this.liquid.scale,
            {
                y: 1,
                duration: 0.5,
                paused: false,
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