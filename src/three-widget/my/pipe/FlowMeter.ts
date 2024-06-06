import * as THREE from "three"
import BasePipeJoin, {MyBasePipeJoinOptions} from "@/three-widget/my/pipe/BasePipeJoin"


interface FlowMeterOptions extends MyBasePipeJoinOptions{

}

/**
 * 流量计
 */
export default class FlowMeter extends BasePipeJoin {

    private readonly textureLoader = new THREE.TextureLoader()
    private readonly dial: THREE.Mesh

    constructor(name: string, options?: FlowMeterOptions) {
        const defaultOptions: Required<FlowMeterOptions> = {
            horizontalLength: 500,
            horizontalRadius: 100,
            horizontalColor: 0x023177,
            verticalLength: 300,
            verticalRadius: 50,
            verticalColor: 0x666666,
        }

        const innerOptions = Object.assign({}, defaultOptions, options)

        super(name, innerOptions)

        this.dial = this.addAndGetDial()
    }

    private addAndGetDial(){

        const dialRadius = 250
        const dialWidth = 150

        const texture_front = this.textureLoader.load("/demo/my/common/meter/flowMeter_front.png")
        
        texture_front.colorSpace = THREE.SRGBColorSpace
        
        const materials = new Array<THREE.MeshPhongMaterial>(
            new THREE.MeshPhongMaterial({
                color: 0x999999,
                specular: 0x777777,
                shininess: 15,
            }),//侧面
            new THREE.MeshPhongMaterial({
                color: 0x999999, map: texture_front,
                transparent: true,
                specular: 0x999999,
                shininess: 15,
            }),//顶面, 仪表面
            new THREE.MeshPhongMaterial({
                color: 0x999999,
                specular: 0x777777,
                shininess: 15,
            })
        )

        const geometry = new THREE.CylinderGeometry(dialRadius, dialRadius, dialWidth, 32)
        const entity = new THREE.Mesh(geometry, materials)
        entity.rotateX(Math.PI * 0.5)
        entity.rotateY(Math.PI * 0.5)
        entity.name = "表盘"
        entity.position.y = this.joinOffsetY + dialRadius
        this.add(entity)

        return entity
    }

}