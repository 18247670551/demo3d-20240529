import * as THREE from "three"
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls"
import ThreeCore from "@/three-widget/ThreeCore"
import vertexShader from "./shader/vertexShader.glsl"
import fragmentShader from "./shader/fragmentShader.glsl"


export default class ThreeProject extends ThreeCore {

    private readonly orbit: OrbitControls

    constructor(dom: HTMLElement) {

        super(dom, {
            cameraOptions: {
                fov: 45,
                near: 0.1,
                far: 100000
            }
        })

        this.scene.background = new THREE.Color(0x000000)


        this.camera.position.set(0, 100, 1000)

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