import * as THREE from "three"
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls"
import ThreeCore from "@/three-widget/ThreeCore"
import {createCurvePoints} from "@/utils/myUtils"


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

        this.camera.position.set(0, 10, 50)

        const ambientLight = new THREE.AmbientLight(0xffffff, 10)
        this.scene.add(ambientLight)

        const light = new THREE.DirectionalLight(0xffffff, 2)
        light.position.set(0, 60, -600)
        light.castShadow = true
        this.scene.add(light)

        const shadowLight = new THREE.DirectionalLight(0xffffff, 5)
        shadowLight.position.set(10, 60, 600)
        shadowLight.castShadow = true
        this.scene.add(shadowLight)

        this.renderer.shadowMap.enabled = true

        this.orbit = new OrbitControls(this.camera, this.renderer.domElement)
        //this.orbit.target.y = 10

        // const axes = new THREE.AxesHelper(10)
        // this.scene.add(axes)

        const v3s = [
            new THREE.Vector3(0, 0, 0),
            new THREE.Vector3(0, 0, 30),
        ]

        const geometry = new THREE.BufferGeometry()
        geometry.setFromPoints(createCurvePoints(v3s))

        const line = new THREE.Line(
            geometry,
            new THREE.LineBasicMaterial()
        )

        this.scene.add(line)

    }

    
    private createLine(startV3: THREE.Vector3, endV3: THREE.Vector3){



    }


    protected init() {
    }


    protected onRenderer() {
        this.orbit.update()
    }

}