import * as THREE from "three"
import {RoundedBoxGeometry} from "three/examples/jsm/geometries/RoundedBoxGeometry"
import BasePipeJoin, {MyBasePipeJoinOptions} from "@/three-widget/my/pipe/BasePipeJoin"
import {getTextureLoader} from "@/three-widget/loader/ThreeLoader"


interface StrokeValveOptions extends MyBasePipeJoinOptions{
    state?: ValveState
}

/**
 * 行程阀
 */
export default class StrokeValve extends BasePipeJoin {

    private readonly dial: THREE.Mesh

    colors: Record<ValveState, number> = {
        "Open": 0x00FF00,
        "Close": 0xFF0000,
    }

    constructor(name: string, options?: StrokeValveOptions) {

        const defaultOptions: Required<StrokeValveOptions> = {
            horizontalLength: 500,
            horizontalRadius: 100,
            horizontalColor: 0x023177,
            verticalLength: 300,
            verticalRadius: 50,
            verticalColor: 0x777777,
            state: "Close",
        }

        const innerOptions = Object.assign({}, defaultOptions, options)

        super(name, innerOptions)

        this.addMotor()
        this.dial = this.addDialAndGet()
    }

    private addMotor() {

        const garyMat = new THREE.MeshLambertMaterial({
            color: 0x777777,
        })

        const group = new THREE.Group()

        const bottomHeight = 400

        const bottomGeo = new RoundedBoxGeometry(800, bottomHeight, 600, 6, 50)
        const bottom = new THREE.Mesh(bottomGeo, garyMat)
        group.add(bottom)


        const middleHeight = 200

        const middleGeo = new RoundedBoxGeometry(600, middleHeight, 400, 6, 50)
        const middle = new THREE.Mesh(middleGeo, garyMat)
        middle.position.y = bottomHeight / 2
        group.add(middle)


        const meterRadius = 120
        const meterHeight = 20

        const texture_front = getTextureLoader().load("/demo/scene-ming/common/meter/valve.png")
        
        texture_front.colorSpace = THREE.SRGBColorSpace

        const materials = new Array<THREE.MeshLambertMaterial>(
            new THREE.MeshLambertMaterial({
                color: 0xAAAAAA,
            }),//侧面
            new THREE.MeshLambertMaterial({
                color: 0xAAAAAA, map: texture_front,
                transparent: true,
            }),//顶面, 仪表面
            new THREE.MeshLambertMaterial({
                color: 0xAAAAAA,
            })
        )

        const meterGeo = new THREE.CylinderGeometry(meterRadius, meterRadius, meterHeight, 32)
        const meter = new THREE.Mesh(meterGeo, materials)
        meter.rotateY(Math.PI * 0.5)
        meter.position.y = bottomHeight / 2 + middleHeight / 2
        //向左偏移100, 美观
        meter.position.x = -100
        group.add(meter)

        group.name = "电机"
        //上移至接头上表面位置
        group.position.y = this.joinOffsetY + bottomHeight / 2
        this.add(group)
    }

    private addDialAndGet(){
        const bottomHeight = 400
        const {state} = <Required<StrokeValveOptions>>this.options

        const mat = new THREE.MeshLambertMaterial({color: this.colors[state]})
        const geo = new THREE.BoxGeometry(400, 200, 610)
        const entity = new THREE.Mesh(geo, mat)
        entity.position.y = this.joinOffsetY + bottomHeight / 2
        this.add(entity)
        return entity
    }

    open() {
        this.setState("Open")
    }

    close() {
        this.setState("Close")
    }

    private setState(state: ValveState) {
        const dialMat = <THREE.MeshLambertMaterial>this.dial.material
        dialMat.color.set(this.colors[state])
    }

}
