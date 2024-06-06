import * as THREE from "three"
import BasePipeJoin, {MyBasePipeJoinOptions} from "./BasePipeJoin"

/**
 * @param radius
 * @param height
 * @param state
 */
interface MeteringPumpOptions extends MyBasePipeJoinOptions{
    motorRadius?: number
    motorHeight?: number
    state?: PumpState
}

/**
 * 计量泵
 */
export default class MeteringPump extends BasePipeJoin {

    private readonly motor: THREE.Mesh

    private colors: Record<PumpState, number[]> = {
        "Run": [0x00FF00, 0x44CC44],
        "Stop": [0x00a6ac, 0x008792],
        "Error": [0xFF0000, 0xFF3333]
    }

    constructor(name: string, options?: MeteringPumpOptions) {

        const defaultOptions: Required<MeteringPumpOptions> = {
            horizontalLength: 500,
            horizontalRadius: 100,
            horizontalColor: 0x023177,
            verticalLength: 300,
            verticalRadius: 50,
            verticalColor: 0x666666,
            motorRadius: 200,
            motorHeight: 800,
            state: "Stop",
        }

        const innerOptions = Object.assign({}, defaultOptions, options)

        super(name, innerOptions)

        this.motor = this.addAndGetMotor()
    }

    private addAndGetMotor() {

        const {motorRadius, motorHeight, state} = <Required<MeteringPumpOptions>>this.options

        const colors = this.colors[state]

        const motorMat = [
            new THREE.MeshBasicMaterial({
                color: colors[0],
                opacity: 1,
            }),
            new THREE.MeshBasicMaterial({
                color: colors[1],
                opacity: 1,
            }),
            new THREE.MeshBasicMaterial({
                color: colors[1],
                opacity: 1,
            }),
        ]

        const geo = new THREE.CylinderGeometry(
            motorRadius,
            motorRadius,
            motorHeight,
            32,
            1,
            false,
        )
        const entity = new THREE.Mesh(geo, motorMat)
        entity.position.y = this.joinOffsetY + motorHeight / 2
        this.add(entity)
        return entity
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
        const motorMat = <THREE.MeshBasicMaterial[]>this.motor.material
        motorMat[0].color.set(this.colors[state][0])
        motorMat[1].color.set(this.colors[state][1])
    }

}
