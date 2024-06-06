import * as THREE from "three"
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls"
import ThreeCore from "@/three-widget/ThreeCore"


export default class ThreeProject extends ThreeCore {

    private readonly orbit: OrbitControls


    constructor(dom: HTMLElement, fieldDistanceDom: HTMLElement, gameOverDom: HTMLElement) {

        super(dom, {
            cameraOptions: {
                fov: 45,
                near: 0.01,
                far: 1000
            }
        })


        const ambientLight = new THREE.AmbientLight(0xffffff, 0.9)
        this.scene.add(ambientLight)

        this.orbit = new OrbitControls(this.camera, this.renderer.domElement)

        const axes = new THREE.AxesHelper(200)
        this.scene.add(axes)
    }

    protected init() {
    }

    protected onRenderer() {
        this.orbit.update()
    }

}
