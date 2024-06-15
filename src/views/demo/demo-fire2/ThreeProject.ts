import * as THREE from "three"
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls"
import ThreeCore from "@/three-widget/ThreeCore"
import vertexShader from "./shader/vertexShader.glsl"
import fragmentShader from "./shader/fragmentShader.glsl"


export default class ThreeProject extends ThreeCore {

    private readonly orbit: OrbitControls

    private readonly material: THREE.ShaderMaterial

    constructor(dom: HTMLElement) {

        super(dom, {
            cameraOptions: {
                fov: 45,
                near: 0.1,
                far: 10000
            }
        })

        this.scene.background = new THREE.Color(0x000000)

        this.camera.position.set(0, 0, 2)

        this.renderer.shadowMap.enabled = true

        this.orbit = new OrbitControls(this.camera, this.renderer.domElement)

        // const axes = new THREE.AxesHelper(0.1)
        // this.scene.add(axes)


        const geometry = new THREE.PlaneGeometry(1, 1)

        const material = new THREE.ShaderMaterial({
            uniforms: {
                iTime: { value: 0 },
                iResolution: { value: new THREE.Vector3(1, 1, 1) },
                iMouse: { value: new THREE.Vector2(0.0, 0.0) },
            },
            fragmentShader: fragmentShader,
            vertexShader: vertexShader,
            side: THREE.DoubleSide,
            transparent: true,
        })
        this.material = material

        const mesh = new THREE.Mesh(geometry, material)
        this.scene.add(mesh)
    }

    protected init() {
    }

    protected onRenderer() {
        const elapsed = this.clock.getElapsedTime()
        this.orbit.update()

        this.material.uniforms.iTime.value += 0.01
    }

}