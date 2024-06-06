import * as THREE from "three"
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls"
import ThreeCore from "@/three-widget/ThreeCore"
import Hedgehog from "@/views/demo/demo-wolf-rabbit/demo-hedgehog/Hedgehog"

export default class ThreeProject extends ThreeCore {

    private readonly orbit: OrbitControls

    private readonly hedgehog: Hedgehog
    protected dela = 0


    constructor(dom: HTMLElement) {

        super(dom, {
            cameraOptions: {
                fov: 45,
                near: 1,
                far: 1000
            }
        })

        this.camera.position.set(0, 30, 80)
        this.scene.background = new THREE.Color(0x999999)

        const ambientLight = new THREE.AmbientLight(0xffffff, 1)
        this.scene.add(ambientLight)

        const directionalLight1 = new THREE.DirectionalLight(0xffffff, 4)
        directionalLight1.position.set(0, 100, 100)
        directionalLight1.castShadow = true
        this.scene.add(directionalLight1)

        const directionalLight2 = new THREE.DirectionalLight(0xffffff, 2)
        directionalLight2.position.set(0, 100, -100)
        directionalLight2.castShadow = true
        this.scene.add(directionalLight2)

        this.renderer.shadowMap.enabled = true

        this.orbit = new OrbitControls(this.camera, this.renderer.domElement)

        this.hedgehog = this.addAndGetHedgehog()
        this.hedgehog.rotation.y = Math.PI/2
        this.hedgehog.nod()
    }

    protected onRenderer() {
        this.orbit.update()
        this.dela = this.clock.getDelta()
    }

    private addAndGetHedgehog(){
        const hedgehog = new Hedgehog()
        this.scene.add(hedgehog)
        return hedgehog
    }

    protected init(): void {
    }


}
