import * as THREE from "three"
import {random} from "lodash"
import gsap from "gsap"
import MyGroup from "@/three-widget/MyGroup"
import {disposeGroup} from "@/three-widget/ThreeUtils"

/**
 * @param radius 管道半径
 * @param color 管道颜色
 * @param pointsPath 管道路径点二维数组
 * @param radiusSegments 管道圆分段数
 * @param tubularSegments 管道路径分段数
 * @param pointsDensity 烟雾密度
 * @param scene 场景, 必传, 类内烟雾动画要用
 */
interface SmokePipeOptions {
    radius?: number
    color?: number
    radiusSegments?: number
    tubularSegments?: number
    pointsDensity?: number
    points: number[][]
    scene: THREE.Scene
}

export default class SmokePipe extends MyGroup<SmokePipeOptions> {

    private readonly sprite: THREE.Sprite

    private curve: THREE.CatmullRomCurve3 | null = null

    private flowAnimation: gsap.core.Tween

    constructor(name: string, options: SmokePipeOptions) {

        const defaultOptions: Required<Omit<SmokePipeOptions, "points" | "scene">> = {
            radiusSegments: 32,
            tubularSegments: 128,
            radius: 500,
            color: 0x666666,
            pointsDensity: 8,
        }

        // @ts-ignore
        super(name, defaultOptions, options)

        this.sprite = this.createSmokePointSprite()

        this.addPipe()

        this.flowAnimation = this.createFlowAnimation()
    }

    private createSmokePointSprite() {
        const texture = getTextureLoader().load('/demo/my/wash/smoke1.png')
        
        texture.colorSpace = THREE.SRGBColorSpace

        const spriteMat = new THREE.SpriteMaterial({
            map: texture,
            color: 0xCCCCCC,
            transparent: true,
            opacity: 0.3,
        })

        return new THREE.Sprite(spriteMat)
    }

    flow() {
        this.flowAnimation.resume()
    }

    stop() {
        this.flowAnimation.pause()
    }


    private createFlowAnimation() {

        const settings = {
            progress: 0
        }

        return gsap.to(
            settings,
            {
                progress: 1,
                duration: 10,
                ease: "none",
                paused: true,
                repeat: -1,
                onUpdate: () => {
                    // 加个判断, 否则动画创建时会播放一次
                    if (settings.progress > 0.01) {
                        const group = this.createSpriteGroup()
                        this.options.scene?.add(group)
                        this.createSingleSpriteGroupFlowAnimation(group, this.curve!).play()
                    }
                }
            }
        )
    }


    private addPipe() {
        const {points, radius, pointsDensity, tubularSegments, color, scene, radiusSegments } = this.options
        this.curve = new THREE.CatmullRomCurve3(points.map(item => new THREE.Vector3(...item)))

        const geo = new THREE.TubeGeometry(this.curve, tubularSegments, radius, radiusSegments, false)
        const mat = new THREE.MeshPhongMaterial({
            color,
            transparent: true,
            opacity: 0.3,
            side: THREE.BackSide,
        })
        const entity = new THREE.Mesh(geo, mat)

        this.add(entity)
    }

    private createSpriteGroup() {
        const group = new THREE.Group

        for (let i = 0; i < this.options.pointsDensity; i++) {
            const spriteClone = this.sprite.clone()
            const point = this.randomVector3ByRadius(this.options.radius * 0.7)
            spriteClone.position.copy(point)
            spriteClone.scale.set(400, 300, 350)
            group.add(spriteClone)
        }
        group.renderOrder = 1
        group.visible = false
        return group
    }


    private createSingleSpriteGroupFlowAnimation(group: THREE.Group, curve: THREE.CatmullRomCurve3) {

        const settings = {
            progress: 0
        }

        const self = gsap.to(
            settings,
            {
                progress: 1,
                duration: 5,
                ease: "none",
                paused: true,
                onStart: () => {
                    group.visible = true
                },
                onUpdate: () => {
                    if (settings.progress >= 1) {
                        disposeGroup(group)
                        group.removeFromParent()
                        self.kill()
                    }

                    const point = new THREE.Vector3()
                    curve.getPointAt(settings.progress, point)

                    // 更新 group 位置, 形成烟雾流动效果
                    group.position.copy(point)

                    // 动画加强, 让烟雾在转变处流动时, 有转向效果
                    const nextPoint = new THREE.Vector3()

                    const step = 0.1

                    if ((1 - settings.progress) > step) {
                        curve.getPointAt(settings.progress + step, nextPoint)

                        //目标移动时的朝向偏移
                        let offsetAngle = 0
                        let mtx = new THREE.Matrix4()
                        mtx.lookAt(point, nextPoint, group.up)
                        mtx.multiply(new THREE.Matrix4().makeRotationFromEuler(new THREE.Euler(0, offsetAngle, 0)))
                        //计算出需要进行旋转的四元数值
                        const toRot = new THREE.Quaternion().setFromRotationMatrix(mtx)
                        group.quaternion.slerp(toRot, 0.2)
                    }
                }
            }
        )

        return self
    }


    /**
     * 在圆内随机生成三维坐标
     */
    private randomVector3ByRadius(r: number) {
        const a = random(-360, 360)
        const radius = random(0, r)
        const y = radius * Math.cos(a)
        const z = radius * Math.sin(a)

        return new THREE.Vector3(0, y, z)
    }

}