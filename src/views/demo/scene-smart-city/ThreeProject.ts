import * as THREE from "three"
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls"
import ThreeCore from "@/three-widget/ThreeCore"
import SmartCity from "@/views/demo/scene-smart-city/SmartCity"

export default class ThreeProject extends ThreeCore {

    private readonly orbit: OrbitControls
    private readonly city: SmartCity

    constructor(dom: HTMLElement) {

        super(dom, {
            cameraOptions: {
                fov: 45,
                near: 0.1,
                far: 10000
            }
        })

        this.camera.position.set(1200, 700, 121)
        //this.scene.background = new THREE.Color(0x000000)

        this.orbit = new OrbitControls(this.camera, this.renderer.domElement)

        this.renderer.setClearColor(new THREE.Color('#32373E'), 1)

        // const axesHelper = new THREE.AxesHelper(100)
        // this.scene.add(axesHelper)





        const ambientLight = new THREE.AmbientLight('#b9d5ff', 0.5)
        this.scene.add(ambientLight)

        const directionalLight = new THREE.DirectionalLight(0xffffff, 1)
        directionalLight.position.set(100, 100, 0)
        this.scene.add(directionalLight)


        const city = new SmartCity()
        this.city = city
        this.scene.add(city)

    }


    protected init() {
    }


    protected onRenderer() {
        const delta = this.clock.getDelta()
        this.orbit.update()

        this.city.animate(delta)
    }

}