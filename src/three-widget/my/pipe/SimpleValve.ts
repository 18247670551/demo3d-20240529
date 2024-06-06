import * as THREE from 'three'
import MyGroup from "@/three-widget/MyGroup"
import * as CSG from "@/three-widget/CSG"

/**
 * @param radius
 * @param height
 */
export interface SimpleValveOptions {
    radius?: number
    height?: number
}


/**
 * 简易阀门
 * <br>
 * 在一些空间非常拥挤的地方, 无法精细模型, 使用此简易模型, 只是一个圆柱体, 带红绿变色动画, 绿色则工作, 红色则故障, 灰色则正常
 */
export default class SimpleValve extends MyGroup<SimpleValveOptions> {

    private readonly body: THREE.Mesh

    private state: ValveState= "Close"

    private readonly colors: Record<ValveState, number[]> = {
        "Open": [0x00FF00, 0x33FF33],
        "Close": [0x666666, 0x777777],
    }

    constructor(name: string, options?: SimpleValveOptions) {

        const defaultOptions: Required<SimpleValveOptions> = {
            radius: 120,
            height: 240,
        }

        super(name, defaultOptions, options)

        this.body = this.addAndGetBody()
    }

    private addAndGetBody() {

        const colors = this.colors[this.state]

        const mat = [
            new THREE.MeshPhongMaterial({
                color: colors[0],
                specular: colors[0],
                shininess: 20,
            }),
            new THREE.MeshPhongMaterial({
                color: colors[1],
                specular: colors[1],
                shininess: 20,
            }),
        ]

        const downGeo = new THREE.ConeGeometry(this.options.radius * 2, this.options.height * 2, 16)
        const down = new THREE.Mesh(downGeo, mat)
        const up = down.clone()
        up.rotateZ(Math.PI)
        up.position.y = this.options.height / 3

        const geo = CSG.calc(up, down, "union")
        const body = new THREE.Mesh(geo, mat)

        down.geometry.dispose()

        this.add(body)

        return body
    }

    open() {
        this.setState("Open")
    }

    close() {
        this.setState("Close")
    }


    private setState(state: ValveState) {
        this.state = state

        const bodyMat = <THREE.MeshPhongMaterial[]>this.body.material

        bodyMat[0].color.set(this.colors[state][0])
        bodyMat[1].color.set(this.colors[state][1])
    }

}