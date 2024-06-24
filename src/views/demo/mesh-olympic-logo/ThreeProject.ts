import * as THREE from "three"
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls"
import ThreeCore from "@/three-widget/ThreeCore"
import OlympicLogo from "@/views/demo/mesh-olympic-logo/OlympicLogo"



export default class ThreeProject extends ThreeCore {

    private readonly orbit: OrbitControls

    constructor(dom: HTMLElement) {

        super(dom, {
            cameraOptions: {
                fov: 45,
                near: 0.1,
                far: 1000
            }
        })

        this.scene.background = new THREE.Color("#eefafb")

        this.camera.position.set(0, 0, 100)

        const ambientLight = new THREE.AmbientLight(0xffffff, 1)
        this.scene.add(ambientLight)

        const light = new THREE.DirectionalLight(0xffffff, 1)
        light.position.set(0, 60, -60)
        light.castShadow = true
        this.scene.add(light)

        const shadowLight = new THREE.DirectionalLight(0xffffff, 3)
        shadowLight.position.set(10, 60, 60)
        shadowLight.castShadow = true
        this.scene.add(shadowLight)


        this.orbit = new OrbitControls(this.camera, this.renderer.domElement)
        this.orbit.target.y = 12
        this.orbit.autoRotate = true

        // const axesHelper = new THREE.AxesHelper(20)
        // this.scene.add(axesHelper)





        const olympicLogo = new OlympicLogo()
        olympicLogo.position.y = 10
        this.scene.add(olympicLogo)

    }

    protected init() {
    }


    protected onRenderer() {
        this.orbit.update()
    }

}