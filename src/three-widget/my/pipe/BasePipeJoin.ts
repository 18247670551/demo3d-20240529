import * as THREE from "three"
import MyGroup from "@/three-widget/MyGroup";

/**
 * @param horizontalLength?: number
 * @param horizontalRadius?: number
 * @param horizontalColor?: number
 * @param verticalLength?: number
 * @param verticalRadius?: number
 * @param verticalColor?: number
 */
export interface MyBasePipeJoinOptions {
    horizontalLength?: number
    horizontalRadius?: number
    horizontalColor?: number
    verticalLength?: number
    verticalRadius?: number
    verticalColor?: number
}


export default class BasePipeJoin extends MyGroup<MyBasePipeJoinOptions> {

    //子类使用此接头高度来控制仪表盘Y
    readonly joinOffsetY: number

    constructor(name: string, options?: MyBasePipeJoinOptions) {

        const defaultOptions: Required<MyBasePipeJoinOptions> = {
            horizontalLength: 500,
            horizontalRadius: 70,
            horizontalColor: 0x409EFF,
            verticalLength: 200,
            verticalRadius: 50,
            verticalColor: 0x666666,
        }

        super(name, defaultOptions, options)
        this.joinOffsetY = this.addJoinAndGetTopX()
    }

    /**
     * 组件接在管道上的接头
     */
    protected addJoinAndGetTopX() {
        const group = new THREE.Group()

        const {horizontalLength, horizontalRadius, verticalLength, verticalRadius, verticalColor, horizontalColor } = this.options

        //水平管
        const horizontalGeo = new THREE.CylinderGeometry(horizontalRadius * 1.1, horizontalRadius * 1.1, horizontalLength, 32)
        const horizontalMat = new THREE.MeshPhongMaterial({
            color: horizontalColor,
            specular: horizontalColor,
            shininess: 30,
        })

        const horizontalEntity = new THREE.Mesh(horizontalGeo, horizontalMat)

        horizontalEntity.rotateZ(Math.PI * 0.5)
        group.add(horizontalEntity)


        //垂直管
        const verticalGeo = new THREE.CylinderGeometry(verticalRadius, verticalRadius, verticalLength, 32)
        const verticalMat = new THREE.MeshPhongMaterial({
            color: verticalColor,
            specular: verticalColor,
            shininess: 20,
        })
        const verticalEntity = new THREE.Mesh(verticalGeo, verticalMat)

        verticalEntity.position.y = horizontalRadius + verticalLength / 2
        group.add(verticalEntity)

        this.add(group)
        return horizontalRadius + verticalLength
    }


}