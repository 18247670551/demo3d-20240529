import * as THREE from "three"
import ThreeCore from "@/three-widget/ThreeCore"
import vertexShader from "./shader/vertexShader.glsl"
import fragmentShader from "./shader/fragmentShader.glsl"
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";

export default class ThreeProject extends ThreeCore {

    private orbit: OrbitControls
    private material: THREE.ShaderMaterial

    constructor(dom: HTMLElement) {

        super(dom, {
            cameraOptions: {
                fov: 75,
                near: 0.1,
                far: 1000
            }
        })

        this.scene.background = new THREE.Color(0x000000)

        this.camera.position.set(0, 0, 100)

        const ambientLight = new THREE.AmbientLight(0xffffff, 4)
        this.scene.add(ambientLight)

        this.orbit = new OrbitControls(this.camera, this.renderer.domElement)

        const uniforms = {
            time: { value: 1 },
            iResolution: { value: new THREE.Vector2(300, 300) },
            iMouse: { value: new THREE.Vector3(0, 0, 0) },
        }

        const material = new THREE.ShaderMaterial({
            uniforms,
            vertexShader,
            fragmentShader,
            transparent: true,
            side: THREE.DoubleSide
        })
        this.material = material

        const plane = new THREE.Mesh(new THREE.PlaneGeometry(100, 100, 20, 20), material)

        this.scene.add(plane)
    }


    protected init() {
    }

    protected onRenderer() {
        this.material.uniforms.time.value = this.clock.getElapsedTime()

        this.orbit.update()
    }

}