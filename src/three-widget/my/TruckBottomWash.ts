import * as THREE from "three"
import gsap from "gsap"
import MyGroup from "@/three-widget/MyGroup"
import {getTextureLoader} from "@/three-widget/loader/ThreeLoader"

/**
 * @param trackLength?: number
 * @param trackWidth?: number
 * @param gantryWidth?: number
 * @param gantryHeight?: number
 * @param gantryFrameWidth?: number
 * @param gantryFrameDepth?: number
 * @param animationDuration?: number
 */
export interface TruckBottomWashOptions {
    trackLength?: number
    trackWidth?: number
    carWheelRadius?: number
    carWheelDepth?: number
    carLength?: number
    carWidth?: number
    carHeight?: number
    animationDuration?: number,
    wheelSpeed?: number
}


export default class TruckBottomWash extends MyGroup<TruckBottomWashOptions> {

    private readonly car: THREE.Group

    private carAnimation: gsap.core.Tween | null = null

    private wheel1Animation: gsap.core.Tween | null = null
    private wheel2Animation: gsap.core.Tween | null = null
    private wheel3Animation: gsap.core.Tween | null = null
    private wheel4Animation: gsap.core.Tween | null = null

    private isRight = true
    private wheelRotationTarget = Math.PI * -2

    constructor(name: string, options?: TruckBottomWashOptions) {

        const defaultOptions: Required<TruckBottomWashOptions> = {
            trackLength: 10000,
            trackWidth: 600,
            carWheelRadius: 80,
            carWheelDepth: 40,
            carLength: 500,
            carWidth: 500,
            carHeight: 200,
            animationDuration: 10,
            wheelSpeed: 2,
        }

        super(name, defaultOptions, options)


        this.addTrack()
        this.car = this.addAndGetCar()
        this.carAnimation = this.createCarAnimation()
    }

    private addTrack() {
        const geometry = new THREE.BoxGeometry(this.options.trackLength, 10, this.options.trackWidth)

        const material = new THREE.MeshBasicMaterial({color: 0x00b8fc, opacity: 0.1, transparent: true})
        const mesh = new THREE.Mesh(geometry, material)
        mesh.name = '轨道'
        this.add(mesh)
    }

    private addAndGetCar() {
        const group = new THREE.Group()

        const width = this.options.carLength
        const height = this.options.carHeight
        const depth = this.options.carWidth

        const geometry = new THREE.BoxGeometry(width, height, depth)
        const material = new THREE.MeshBasicMaterial({color: 0x00b8fc, opacity: 0.5, transparent: true})
        const body = new THREE.Mesh(geometry, material)
        body.name = '小车车身'
        body.position.y = height / 2 + this.options.carWheelRadius

        const wheel1 = this.createWheel()
        wheel1.rotateX(Math.PI * 0.5)
        const wheel2 = wheel1.clone()
        const wheel3 = wheel1.clone()
        const wheel4 = wheel1.clone()

        wheel1.name = "轮子1"
        wheel2.name = "轮子2"
        wheel3.name = "轮子3"
        wheel4.name = "轮子4"

        wheel1.position.set(-(width / 2 - 100), height / 2, depth / 2)
        wheel2.position.set(-(width / 2 - 100), height / 2, -depth / 2)
        wheel3.position.set((width / 2 - 100), height / 2, depth / 2)
        wheel4.position.set((width / 2 - 100), height / 2, -depth / 2)

        group.add(
            body,
            wheel1,
            wheel2,
            wheel3,
            wheel4,
        )

        this.wheel1Animation = this.createWheelAnimation(wheel1)
        this.wheel2Animation = this.createWheelAnimation(wheel2)
        this.wheel3Animation = this.createWheelAnimation(wheel3)
        this.wheel4Animation = this.createWheelAnimation(wheel4)

        group.name = "小车"
        group.position.x = -this.options.trackLength / 2
        this.add(group)

        return group
    }

    private createWheel() {

        const wheelTexture = getTextureLoader().load("/demo/scene-ming/wash/wheel.png")
        
        wheelTexture.colorSpace = THREE.SRGBColorSpace

        const wheelMaterial = new THREE.MeshBasicMaterial({
            map: wheelTexture,
            transparent: true,
            opacity: 1
        })


        const tyreTexture = getTextureLoader().load("/demo/scene-ming/wash/tyre_0.png")
        
        tyreTexture.colorSpace = THREE.SRGBColorSpace

        tyreTexture.wrapS = tyreTexture.wrapT = THREE.RepeatWrapping
        tyreTexture.repeat.set(14, 1)

        const tyreMaterial = new THREE.MeshBasicMaterial({
            map: tyreTexture,
            transparent: true,
            opacity: 1
        })

        const wheelRadius = this.options.carWheelRadius
        const wheelDepth = this.options.carWheelDepth

        const geometry = new THREE.CylinderGeometry(wheelRadius, wheelRadius, wheelDepth, 16)

        return new THREE.Mesh(geometry, [tyreMaterial, wheelMaterial, wheelMaterial])
    }

    createCarAnimation() {

        const left = -(this.options.trackLength - this.options.carLength) / 2
        const right = (this.options.trackLength - this.options.carLength) / 2

        return gsap.fromTo(
            this.car.position,
            {
                x: left,
            },
            {
                x: right,
                duration: this.options.animationDuration,
                repeat: -1,
                paused: true,
                ease: "none",
                yoyo: true,
                onRepeat: () => {
                    //当反向运行时, 需要更改车轮旋转方向
                    this.isRight = !this.isRight
                    this.wheelRotationTarget = this.isRight ? Math.PI * -2 : Math.PI * 2
                    this.wheel1Animation?.resetTo("y", this.wheelRotationTarget)
                    this.wheel2Animation?.resetTo("y", this.wheelRotationTarget)
                    this.wheel3Animation?.resetTo("y", this.wheelRotationTarget)
                    this.wheel4Animation?.resetTo("y", this.wheelRotationTarget)
                }
            }
        )
    }

    private createWheelAnimation(mesh: THREE.Mesh) {
        return gsap
            .fromTo(
                mesh.rotation,
                {
                    y: 0,
                },
                {
                    y: -Math.PI * 2,
                    duration: 1 / this.options.wheelSpeed,
                    ease: "none",
                    repeat: -1,
                    paused: true,
                },
            )
    }

    run() {
        this.carAnimation?.resume()
        this.wheel1Animation?.resume()
        this.wheel2Animation?.resume()
        this.wheel3Animation?.resume()
        this.wheel4Animation?.resume()
    }

    stop() {
        this.carAnimation?.pause()
        this.wheel1Animation?.pause()
        this.wheel2Animation?.pause()
        this.wheel3Animation?.pause()
        this.wheel4Animation?.pause()
    }

}