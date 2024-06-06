import * as THREE from "three"
import gsap from "gsap"
import MyGroup from "@/three-widget/MyGroup";

/**
 * 水桶
 *
 * 红色桶: flankColor = 0xed1941  topColor = 0xef5b9c<br>
 * 黄色桶: flankColor = 0xCCCC00  topColor = 0xFFFF00<br>
 * 白色桶: flankColor = 0xCCCCCC  topColor = 0xFFFFFF<br>
 * @param radius?: number 桶半径 600
 * @param height?: number 桶高 2000
 * @param thickness?: number 桶壁厚 60
 * @param flankColor?: number 侧面(圆弧面)颜色
 * @param topColor?: number 顶面颜色
 * @param bottomColor?: number 底面颜色
 * @param defaultLevel?: number 初始液位
 * @param liquidTopColor?: number 液体顶部颜色
 * @param liquidFlankColor?: number 液体侧面(圆弧面)颜色
 *
 */
interface BucketOptions {
    radius?: number
    height?: number
    thickness?: number
    flankColor?: number
    topColor?: number
    bottomColor?: number
    defaultLevel?: number
    liquidTopColor?: number
    liquidFlankColor?: number
}

/**
 * 桶, 默认黄色
 */
export default class Bucket extends MyGroup<BucketOptions> {

    private readonly liquid: THREE.Mesh
    private readonly levelChangeAnimation: gsap.core.Tween

    constructor(name: string, options?: BucketOptions) {

        const defaultOptions: Required<BucketOptions> = {
            radius: 600,
            height: 2000,
            thickness: 60,
            flankColor: 0xCCCC00,
            topColor: 0xFFFF00,
            bottomColor: 0xFFFF00,
            liquidTopColor: 0xCCCCCC,
            liquidFlankColor: 0x999999,
            defaultLevel: 0.5,
        }

        super(name, defaultOptions, options)

        this.addBucket()
        this.liquid = this.addAndGetLiquid()

        this.levelChangeAnimation = this.createLevelChangeAnimation()
        this.setLevel(this.options.defaultLevel)
    }

    private addBucket() {
        const geo = new THREE.CylinderGeometry(this.options.radius, this.options.radius, this.options.height, 32)
        geo.translate(0, this.options.height / 2, 0)

        const materials = [
            new THREE.MeshBasicMaterial({
                color: this.options.flankColor,
                transparent: true,
                opacity: 0.6,
            }),//侧面
            new THREE.MeshBasicMaterial({
                color: this.options.topColor,
                transparent: true,
                opacity: 0.6,
            }),//顶面
            new THREE.MeshBasicMaterial({
                color: this.options.bottomColor,
                transparent: true,
                opacity: 0.6,
            }),//底面, 不透明
        ]

        const entity = new THREE.Mesh(geo, materials)

        entity.renderOrder = 1

        entity.name = "桶体"
        this.add(entity)
    }

    private addAndGetLiquid() {

        const wallThickness = this.options.thickness

        //液体比桶略小
        const radius = this.options.radius - wallThickness * 2
        const height = this.options.height - wallThickness * 4

        const geometry = new THREE.CylinderGeometry(radius, radius, height, 32)

        geometry.translate(0, height / 2 + wallThickness*2, 0)

        const materials = [
            new THREE.MeshBasicMaterial({
                color: this.options.liquidFlankColor,
                transparent: true,
                opacity: 0.8,
            }),//侧面
            new THREE.MeshBasicMaterial({
                color: this.options.liquidTopColor,
                transparent: true,
                opacity: 0.9,
            }),//顶面
            new THREE.MeshBasicMaterial({
                color: this.options.liquidFlankColor,
                transparent: true,
                opacity: 0.9,
            }),//底面, 不透明
        ]

        const entity = new THREE.Mesh(geometry, materials)
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

    setLevel(level: number) {
        this.levelChangeAnimation.resetTo("y", level)
        this.levelChangeAnimation.restart()
    }

}
