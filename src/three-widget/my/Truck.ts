import * as THREE from "three"
import gsap from "gsap"
import {ExtrudeGeometryOptions} from "three"
import MyGroup from "@/three-widget/MyGroup"
import {getTextureLoader} from "@/three-widget/loader/ThreeLoader"

/**
 * @param animationDuration 进入车间动画, 离开车间动画 持续时间
 * @param wheelSpeed 车轮每秒几转 周/秒
 * @param leftPositionX 左侧限位
 * @param innerPositionX 中间位置
 * @param rightPositionX 右侧限位
 */
export interface TruckOptions {
    headLength?: number
    headWidth?: number
    headHeight?: number
    bodyLength?: number
    bodyWidth?: number
    bodyHeight?: number
    animationDuration?: number
    wheelSpeed?: number
    wheelRadius?: number
    wheelDepth?: number
    leftPositionX?: number
    innerPositionX?: number
    rightPositionX?: number
}


export default class Truck extends MyGroup<TruckOptions> {

    private readonly wheel1: THREE.Mesh
    private readonly wheel2: THREE.Mesh
    private readonly wheel3: THREE.Mesh
    private readonly wheel4: THREE.Mesh
    private readonly wheel5: THREE.Mesh
    private readonly wheel6: THREE.Mesh


    private readonly wheel1Animation: gsap.core.Tween
    private readonly wheel2Animation: gsap.core.Tween
    private readonly wheel3Animation: gsap.core.Tween
    private readonly wheel4Animation: gsap.core.Tween
    private readonly wheel5Animation: gsap.core.Tween
    private readonly wheel6Animation: gsap.core.Tween

    private readonly inRoomAnimation: gsap.core.Tween
    private readonly outRoomAnimation: gsap.core.Tween


    private isRun = false
    
    constructor(name: string, options?: TruckOptions) {

        const defaultOptions: Required<TruckOptions> = {
            headLength: 2600,
            headWidth: 2300,
            headHeight: 2300,
            bodyLength: 7000,
            bodyWidth: 2300,
            bodyHeight: 2500,
            animationDuration: 5,
            wheelSpeed: 1,
            wheelRadius: 550,
            wheelDepth: 280,
            leftPositionX: -14000,
            innerPositionX: -1200,
            rightPositionX: 15000,
        }

        super(name, defaultOptions, options)

        this.addHead()
        this.addBody()

        const wheel1 = this.createWheel()
        wheel1.rotateX(Math.PI * 0.5)

        const wheel2 = wheel1.clone()
        const wheel3 = wheel1.clone()
        const wheel4 = wheel1.clone()
        const wheel5 = wheel1.clone()
        const wheel6 = wheel1.clone()

        wheel1.name = "轮子1"
        wheel2.name = "轮子2"
        wheel3.name = "轮子3"
        wheel4.name = "轮子4"
        wheel5.name = "轮子5"
        wheel6.name = "轮子6"

        wheel1.position.set(4600, this.options.wheelRadius, 1060)
        wheel2.position.set(4600, this.options.wheelRadius, -1060)
        wheel3.position.set(1800, this.options.wheelRadius, 1060)
        wheel4.position.set(1800, this.options.wheelRadius, -1060)
        wheel5.position.set(-1800, this.options.wheelRadius, 1060)
        wheel6.position.set(-1800, this.options.wheelRadius, -1060)

        this.wheel1Animation = this.createWheelAnimation(wheel1)
        this.wheel2Animation = this.createWheelAnimation(wheel2)
        this.wheel3Animation = this.createWheelAnimation(wheel3)
        this.wheel4Animation = this.createWheelAnimation(wheel4)
        this.wheel5Animation = this.createWheelAnimation(wheel5)
        this.wheel6Animation = this.createWheelAnimation(wheel6)

        this.wheel1 = wheel1
        this.wheel2 = wheel2
        this.wheel3 = wheel3
        this.wheel4 = wheel4
        this.wheel5 = wheel5
        this.wheel6 = wheel6


        this.add(
            wheel1,
            wheel2,
            wheel3,
            wheel4,
            wheel5,
            wheel6,
        )

        this.setInner()

        this.inRoomAnimation = this.forward(this.options.innerPositionX)
        this.outRoomAnimation = this.forward(this.options.rightPositionX)
    }

    private addHead() {
        const shape = new THREE.Shape()

        shape.moveTo(0, 0)
        shape.lineTo(0, this.options.headHeight)
        shape.lineTo(1000, this.options.headHeight)
        shape.lineTo(this.options.headLength, this.options.headHeight/2)
        shape.lineTo(this.options.headLength, 0)
        shape.lineTo(0, 0)

        const extrudeSettings: ExtrudeGeometryOptions = {
            steps: 2,
            depth: this.options.bodyWidth,
            bevelEnabled: false,
            bevelThickness: 1,
            bevelSize: 1,
            bevelOffset: 0,
            bevelSegments: 1
        }

        const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings)
        const materials = new Array<THREE.MeshBasicMaterial>(
            new THREE.MeshBasicMaterial({
                color: 0x00b8fc,
                opacity: 0.5,
                transparent: true
            }),
            new THREE.MeshBasicMaterial({
                color: 0x00ff00,
                opacity: 0.5,
                transparent: true
            }),
        )
        const mesh = new THREE.Mesh(geometry, materials)
        mesh.position.set(this.options.bodyLength/2, this.options.wheelRadius, -this.options.headWidth/2)
        mesh.name = '车头'
        this.add(mesh)
    }

    /**
     * 车厢大小: 长7米, 宽2.3米, 高2.5米
     */
    private addBody() {
        const sideTexture = getTextureLoader().load("/demo/scene-ming/common/truck/body_0.jpg")
        
        sideTexture.colorSpace = THREE.SRGBColorSpace

        sideTexture.wrapS = sideTexture.wrapT = THREE.RepeatWrapping
        sideTexture.repeat.set(20, 1)

        const bottomTexture = getTextureLoader().load("/demo/scene-ming/common/truck/bottom_0.png")
        
        bottomTexture.colorSpace = THREE.SRGBColorSpace

        bottomTexture.wrapS = bottomTexture.wrapT = THREE.RepeatWrapping
        bottomTexture.repeat.set(10, 10)

        const geometry = new THREE.BoxGeometry(this.options.bodyLength, this.options.bodyHeight, this.options.bodyWidth)

        const materials = [
            new THREE.MeshBasicMaterial({color: 0x00b8fc, opacity: 0.5, transparent: true}),//右面
            new THREE.MeshBasicMaterial({color: 0x00b8fc, opacity: 0.5, transparent: true}),//左面
            new THREE.MeshBasicMaterial({color: 0xffff00, opacity: 0.5, transparent: true}),//上面
            new THREE.MeshBasicMaterial({color: 0x0000ff, opacity: 0.5, transparent: true}),//底面
            new THREE.MeshBasicMaterial({color: 0x00ffff, opacity: 0.5, transparent: true}),//前面
            new THREE.MeshBasicMaterial({color: 0x00ffff, opacity: 0.5, transparent: true}),//后面
        ]

        // const materials = [
        //     new THREE.MeshBasicMaterial({color: 0x888888}),//右面
        //     new THREE.MeshBasicMaterial({color: 0x888888}),//左面
        //     new THREE.MeshBasicMaterial({color: 0xAAAAAA}),//上面
        //     new THREE.MeshBasicMaterial({map: bottomTexture, color: 0xFFFFFF, transparent: true}),//底面
        //     new THREE.MeshBasicMaterial({map: sideTexture, color: 0xFFFFFF, transparent: true}),//前面
        //     new THREE.MeshBasicMaterial({map: sideTexture, color: 0xFFFFFF, transparent: true}),//后面
        // ]

        const mesh = new THREE.Mesh(geometry, materials)
        mesh.position.y = this.options.bodyHeight/2 + this.options.wheelRadius
        mesh.name = '车厢'
        this.add(mesh)
    }


    private createWheel() {

        const wheelTexture = getTextureLoader().load("/demo/scene-ming/common/truck/wheel.png")
        
        wheelTexture.colorSpace = THREE.SRGBColorSpace

        const wheelMaterial = new THREE.MeshBasicMaterial({
            map: wheelTexture,
            transparent: true,
            opacity: 1
        })


        const tyreTexture = getTextureLoader().load("/demo/scene-ming/common/truck/tyre_0.png")
        
        tyreTexture.colorSpace = THREE.SRGBColorSpace
        tyreTexture.wrapS = tyreTexture.wrapT = THREE.RepeatWrapping
        tyreTexture.repeat.set(14, 1)

        const tyreMaterial = new THREE.MeshBasicMaterial({
            map: tyreTexture,
            transparent: true,
            opacity: 1
        })

        const geometry = new THREE.CylinderGeometry(this.options.wheelRadius, this.options.wheelRadius, this.options.wheelDepth, 32)

        return new THREE.Mesh(geometry, [tyreMaterial, wheelMaterial, wheelMaterial])
    }

    setLeft() {
        this.position.x = this.options.leftPositionX
    }

    setInner() {
        this.position.x = this.options.innerPositionX
    }

    setRight() {
        this.position.x = this.options.rightPositionX
    }

    private forward(x: number) {
        return gsap.to(
            this.position,
            {
                x,
                duration: this.options.animationDuration,
                ease: "none",
                paused: true,
                onStart: () => {
                    this.isRun = true

                    this.wheel1Animation.resume()
                    this.wheel2Animation.resume()
                    this.wheel3Animation.resume()
                    this.wheel4Animation.resume()
                    this.wheel5Animation.resume()
                    this.wheel6Animation.resume()
                },
                onComplete: () => {
                    this.isRun = false

                    this.wheel1Animation.pause()
                    this.wheel2Animation.pause()
                    this.wheel3Animation.pause()
                    this.wheel4Animation.pause()
                    this.wheel5Animation.pause()
                    this.wheel6Animation.pause()
                }
            },
        )
    }

    private createWheelAnimation(mesh: THREE.Mesh) {
        return gsap
            .to(
                mesh.rotation,
                {
                    y: Math.PI * -2,
                    duration: 1/this.options.wheelSpeed,
                    ease: "none",
                    repeat: -1,
                    paused: true,
                },
            )
    }

    runInRoom() {

        if (this.isRun) {
            console.log(this.name + "处于工作中, 请稍候")
            return
        }

        this.setLeft()

        //一次性动画重新执行.restart()
        this.inRoomAnimation.restart()
    }

    runOutRoom() {

        if (this.isRun) {
            console.log(this.name + "处于工作中, 请稍候")
            return
        }

        this.setInner()

        this.outRoomAnimation.restart()
    }

}
