import * as THREE from "three"
import gsap from "gsap"
import MyGroup from "@/three-widget/MyGroup";


/**
 * @param trackLength?: number
 * @param trackWidth?: number
 * @param gantryWidth?: number
 * @param gantryHeight?: number
 * @param gantryFrameWidth?: number
 * @param gantryFrameDepth?: number
 * @param animationDuration?: number
 */
export interface TruckBodyWashOptions {
    trackLength?: number
    trackWidth?: number
    gantryWidth?: number
    gantryHeight?: number
    gantryFrameWidth?: number
    gantryFrameDepth?: number
    animationDuration?: number
}


export default class TruckBodyWash extends MyGroup<TruckBodyWashOptions> {

    private readonly frame: THREE.Mesh

    private readonly animation: gsap.core.Tween

    private isRun = false

    getIsRun() {
        return this.isRun
    }

    constructor(name: string, options?: TruckBodyWashOptions) {

        const defaultOptions: Required<TruckBodyWashOptions> = {
            trackLength: 10000,
            trackWidth: 200,
            gantryWidth: 4000,
            gantryHeight: 4000,
            gantryFrameWidth: 200,
            gantryFrameDepth: 200,
            animationDuration: 10,
        }

        super(name, defaultOptions, options)

        this.addTrack()
        this.frame = this.addAndGetFrame()
        this.animation = this.createAnimation()
    }

    private addAndGetFrame() {

        const shape = new THREE.Shape()

        // 为方便修改尺寸, 全用静态属性
        // shape.moveTo(-(2000 / 2 + 100), 0)
        // shape.lineTo(-(2000 / 2 + 100), 4000)
        // shape.lineTo((2000 / 2 + 100), 4000)
        // shape.lineTo((2000 / 2 + 100), 0)
        // shape.lineTo((2000 / 2 - 100), 0)
        // shape.lineTo((2000 / 2 - 100), 4000 - 200)
        // shape.lineTo(-(2000 / 2 - 100), 4000 - 200)
        // shape.lineTo(-(2000 / 2 - 100), 0)
        // shape.lineTo(-(2000 / 2 + 100), 0)

        const width = this.options.gantryWidth
        const halfWidth = width / 2
        const height = this.options.gantryHeight
        const frameWidth = this.options.gantryFrameWidth
        const halfFrameWidth = frameWidth / 2

        // 画出龙门架侧面图形
        shape.moveTo(-(halfWidth + halfFrameWidth), 0)
        shape.lineTo(-(halfWidth + halfFrameWidth), height)
        shape.lineTo((halfWidth + halfFrameWidth), height)
        shape.lineTo((halfWidth + halfFrameWidth), 0)
        shape.lineTo((halfWidth - halfFrameWidth), 0)
        shape.lineTo((halfWidth - halfFrameWidth), height - frameWidth)
        shape.lineTo(-(halfWidth - halfFrameWidth), height - frameWidth)
        shape.lineTo(-(halfWidth - halfFrameWidth), 0)
        shape.lineTo(-(halfWidth + halfFrameWidth), 0)

        // 用龙门架侧面图形  挤出几何体生成 mesh
        const extrudeSettings = {
            steps: 2,
            depth: this.options.gantryFrameDepth,
            bevelEnabled: false,
            bevelThickness: 1,
            bevelSize: 1,
            bevelOffset: 0,
            bevelSegments: 1
        }

        const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings)
        const materials = [
            new THREE.MeshBasicMaterial({color: 0x00b8fc, opacity: 0.5, transparent: true}),//左面
            new THREE.MeshBasicMaterial({color: 0xFFFFFF, opacity: 0.5, transparent: true}),//右面
        ]
        const mesh = new THREE.Mesh(geometry, materials)
        mesh.rotateY(Math.PI * 0.5)

        mesh.name = "框体"
        mesh.position.x = -this.options.trackLength / 2

        this.add(mesh)

        return mesh
    }

    private createAnimation() {
        return gsap.fromTo(
            this.frame.position,
            {
                x: this.options.trackLength / -2,
            },
            {
                x: this.options.trackLength / 2,
                duration: this.options.animationDuration,
                ease: "none",
                yoyo: true,
                repeat: -1,
                paused: true, // 动画创建出来时暂停
                onStart: () => {
                    this.isRun = true
                },
                onComplete: () => {
                    this.isRun = false
                }
            }
        )
    }


    private addTrack() {
        //两条轨道分别位于门龙架两侧脚下, 即Z位置等于龙门架宽度的一半
        const track1 = this.createTrack()
        const track2 = track1.clone()

        track1.name = "轨道1"
        track2.name = "轨道2"

        track1.position.z = this.options.gantryWidth / 2
        track2.position.z = this.options.gantryWidth / -2

        this.add(track1, track2)
    }

    private createTrack() {
        const geometry = new THREE.BoxGeometry(this.options.trackLength, 10, this.options.trackWidth)
        const material = new THREE.MeshBasicMaterial({color: 0x00b8fc, opacity: 0.1, transparent: true})
        return new THREE.Mesh(geometry, material)
    }

    run() {
        if (this.isRun) {
            return
        }

        this.animation.resume()
    }

    stop() {
        if (!this.isRun) {
            return
        }

        this.animation.pause()
    }


}
