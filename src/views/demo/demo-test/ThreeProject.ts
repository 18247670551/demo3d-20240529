import * as THREE from "three"
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls"
import ThreeCore from "@/three-widget/ThreeCore"

export default class ThreeProject extends ThreeCore {

    private readonly orbit: OrbitControls

    //private readonly material: THREE.ShaderMaterial

    constructor(dom: HTMLElement) {

        super(dom, {
            cameraOptions: {
                fov: 45,
                near: 0.1,
                far: 1000
            }
        })

        this.scene.background = new THREE.Color(0x000000)


        this.camera.position.set(0, 5, 10)

        const ambientLight = new THREE.AmbientLight(0xffffff, 2)
        this.scene.add(ambientLight)

        const light = new THREE.DirectionalLight(0xffffff, 2)
        light.position.set(0, 60, -60)
        light.castShadow = true

        const shadowLight = new THREE.DirectionalLight(0xffffff, 4)
        shadowLight.position.set(600, 60, 60)
        shadowLight.castShadow = true

        this.renderer.shadowMap.enabled = true

        this.orbit = new OrbitControls(this.camera, this.renderer.domElement)
        this.orbit.target.y = 2

        const axes = new THREE.AxesHelper(5)
        this.scene.add(axes)

    }

    protected init() {
    }


    protected onRenderer() {
        //const elapsed = this.clock.getElapsedTime()
        this.orbit.update()

    }

}