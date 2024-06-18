import * as THREE from "three"
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls"
import ThreeCore from "@/three-widget/ThreeCore"


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
            new THREE.Vector3(20, 10, 30),
            new THREE.Vector3(10, 4, 20),
        ]

        const line1 = new THREE.LineCurve3(v3s[0], v3s[1])
        const line2 = new THREE.LineCurve3(v3s[1], v3s[2])

        const line1Points = line1.getPoints(100).slice(0, 80)
        const line2Points = line2.getPoints(100).slice(20)

        const curve1 = new THREE.QuadraticBezierCurve3(line1Points[79], v3s[1], line2Points[0])

        const curve1Points = curve1.getPoints(100)

        const geometry = new THREE.BufferGeometry()
        geometry.setFromPoints([...line1Points, ...curve1Points, ...line2Points])

        const line = new THREE.Line(
            geometry,
            new THREE.LineBasicMaterial()
        )

        this.scene.add(line)

    }


    protected init() {
    }


    protected onRenderer() {
        this.orbit.update()
    }

}