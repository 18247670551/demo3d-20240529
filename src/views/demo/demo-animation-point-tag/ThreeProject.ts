import * as THREE from "three"
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls"
import ThreeCore from "@/three-widget/ThreeCore"
import PointTag from "../../../../public/demo/point-tag/PointTag"

export default class ThreeProject extends ThreeCore {

    private readonly orbit: OrbitControls
    private readonly tagGroup: THREE.Group

    constructor(dom: HTMLElement) {

        super(dom, {
            cameraOptions: {
                fov: 45,
                near: 0.1,
                far: 10000
            }
        })

        this.camera.position.set(-100, 200, 300)
        this.scene.background = new THREE.Color(0x000000)
        this.renderer.shadowMap.enabled = true

        this.orbit = new OrbitControls(this.camera, this.renderer.domElement)
        this.orbit.target.y = 30

        // const axesHelper = new THREE.AxesHelper(100)
        // this.scene.add(axesHelper)




        const ambientLight = new THREE.AmbientLight(0xffffff, 1)
        this.scene.add(ambientLight)



        const mapWidth = 200
        const mapHeight = 200
        const mapColor = 'rgba(16,115,228,0.5)'

        const mapGeo = new THREE.PlaneGeometry(mapWidth, mapHeight)
        const mapMat = new THREE.MeshLambertMaterial({color: mapColor, side: THREE.DoubleSide})
        const map = new THREE.Mesh(mapGeo, mapMat)
        map.rotateX(-Math.PI / 2)
        this.scene.add(map)



        const tagGroup = new THREE.Group

        for (let i = 0; i < 5; i++) {
            const tag = new PointTag()

            tag.position.set(
                THREE.MathUtils.randFloatSpread(mapWidth),
                0,
                THREE.MathUtils.randFloatSpread(mapHeight),
            )

            tagGroup.add(tag)
        }

        this.tagGroup = tagGroup
        this.scene.add(tagGroup)
    }

    protected onRenderer() {
        this.orbit.update()

        this.tagGroup.children.forEach(tag => (tag as PointTag).update())
    }


    protected init() {}


}