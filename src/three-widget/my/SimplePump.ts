import * as THREE from 'three'
import MyGroup from "@/three-widget/MyGroup";

/**
 * @param radius
 * @param height
 */
export interface SimplePumpOptions {
    radius?: number
    height?: number
}


/**
 * 简易水泵
 * <br>
 * 在一些空间非常拥挤的地方, 水泵使用此简易模型, 只是一个圆柱体, 带红绿变色动画, 绿色工作, 红色故障, 灰色停止
 */
export default class SimplePump extends MyGroup<SimplePumpOptions> {

    private readonly motor: THREE.Mesh

    private state : PumpState= "Stop"

    getState(){
        return this.state
    }

    private colors: Record<PumpState, number[]> = {
        "Run": [0x00FF00, 0x33FF33],
        "Stop": [0x666666, 0x777777],
        "Error": [0xFF0000, 0xFF3333]
    }

    constructor(name: string, options?: SimplePumpOptions) {

        const defaultOptions: Required<SimplePumpOptions> = {
            radius: 150,
            height: 400,
        }

        super(name, defaultOptions, options)

        this.motor = this.addAndGetMotor()
    }

    private addAndGetMotor() {

        const {radius, height} = <Required<SimplePumpOptions>>this.options

        const colors = this.colors[this.state]

        const motorMat = [
            new THREE.MeshPhongMaterial({
                color: colors[0],
                transparent: true,
                opacity: 1,
                specular: colors[0],
                shininess: 20,

            }),
            new THREE.MeshPhongMaterial({
                color: colors[1],
                transparent: true,
                opacity: 1,
                specular: colors[1],
                shininess: 20,
            }),
            new THREE.MeshPhongMaterial({
                color: colors[1],
                transparent: true,
                opacity: 1,
                specular: colors[1],
                shininess: 20,
            }),
        ]

        const geo = new THREE.CylinderGeometry(
            radius,
            radius,
            height,
            32,
            1,
            false,
        )
        const motor = new THREE.Mesh(geo, motorMat)

        this.add(motor)
        return motor
    }

    run() {
        this.setState("Run")
    }

    stop() {
        this.setState("Stop")
    }

    error() {
        this.setState("Error")
    }


    private setState(state: PumpState) {
        this.state = state

        const motorMat = <THREE.MeshPhongMaterial[]>this.motor.material

        motorMat[0].color.set(this.colors[state][0])
        motorMat[1].color.set(this.colors[state][1])
    }

}