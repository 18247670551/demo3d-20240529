import * as THREE from 'three'
import gsap from "gsap"
import MyGroup from "@/three-widget/MyGroup"


interface MixerOptions {
    motorRadius?: number
    motorHeight?: number
    axleHeight?: number
    axleRadius?: number
    state?: PumpState
}

type PumpState = "Run" | "Stop" | "Error"


/**
 * 搅拌机
 */
export default class Mixer extends MyGroup<MixerOptions> {

    private readonly motor: THREE.Mesh
    private readonly leaf: THREE.Group

    private readonly runAnimation: gsap.core.Tween

    private colors: Record<PumpState, number[]> = {
        "Run": [0x00FF00, 0x33FF33],
        "Stop": [0x555555, 0x777777],
        "Error": [0xFF0000, 0xFF3333]
    }

    constructor(name: string, options?: MixerOptions) {

        const defaultOptions: Required<MixerOptions> = {
            motorRadius: 300,
            motorHeight: 800,
            axleHeight: 2500,
            axleRadius: 50,
            state: "Stop",
        }

        super(name, defaultOptions, options)

        this.motor = this.addAndGetMotor()
        this.leaf = this.addAndGetLeaf()

        this.runAnimation = this.createRunAnimation()

        this.setState("Stop")
    }

    private addAndGetMotor() {
        const mat = [
            new THREE.MeshPhongMaterial({
                color: this.colors.Stop[0],
            }),
            new THREE.MeshPhongMaterial({
                color: this.colors.Stop[1],
            }),
        ]

        const {motorRadius, motorHeight, state} = this.options

        const geo = new THREE.CylinderGeometry(motorRadius, motorRadius, motorHeight, 32, 1)
        const motor = new THREE.Mesh(geo, mat)
        motor.position.y = motorHeight
        this.add(motor)

        return motor
    }

    private addAndGetLeaf() {

        const {motorRadius, motorHeight, state, axleHeight, axleRadius} = this.options

        const leafWidth = motorRadius * 6
        const leafHeight = 50
        const leafDepth = 200

        const group = new THREE.Group()

        const axleMat = new THREE.MeshPhongMaterial({
            color: 0x666666,
        })
        const axleGeo = new THREE.CylinderGeometry(axleRadius, axleRadius, axleHeight)
        const axle = new THREE.Mesh(axleGeo, axleMat)

        const leafMat = new THREE.MeshPhongMaterial({
            color: 0x2f79ef,
        })

        const leafGeo = new THREE.BoxGeometry(leafWidth, leafHeight, leafDepth)
        const leaf = new THREE.Mesh(leafGeo, leafMat)
        leaf.position.y = -axleHeight/2
        const leaf2 = leaf.clone()
        leaf.rotateX(Math.PI * 0.1)
        leaf2.rotateY(Math.PI * 0.5)
        leaf2.rotateX(Math.PI * 0.1)


        group.add(leaf, leaf2, axle)
        group.position.y = -axleHeight/2 + motorHeight/2

        this.add(group)
        return group
    }

    run() {
        this.setState("Run")
        this.runAnimation.resume()
    }

    stop() {
        this.setState("Stop")
        this.runAnimation.pause()
    }

    error() {
        this.setState("Error")
    }


    private setState(state: PumpState) {

        this.motor.material = [
            new THREE.MeshPhongMaterial({
                color: this.colors[state][0],
            }),
            new THREE.MeshPhongMaterial({
                color: this.colors[state][1],
            }),
        ]
    }

    private createRunAnimation() {
        return gsap.to(
            this.leaf.rotation,
            {
                y: Math.PI * 2,
                duration: 2,
                repeat: -1,
                ease: 'none',
                paused: true
            }
        )
    }

}