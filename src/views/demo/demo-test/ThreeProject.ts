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
                far: 1000
            }
        })

        this.scene.background = new THREE.Color(0x000000)


        this.camera.position.set(0, 0, 2)

        const ambientLight = new THREE.AmbientLight(0xffffff, 10)
        this.scene.add(ambientLight)

        this.orbit = new OrbitControls(this.camera, this.renderer.domElement)

        const axes = new THREE.AxesHelper(20)
        this.scene.add(axes)


        const bufferGeometry = new THREE.BufferGeometry()
        const count  = 2000
        const positions = new Float32Array(count * 3)

        for(let i = 0; i < count; i++){
            positions[i*3] = 0
            positions[i*3 + 1] = 0
            positions[i*3 + 2] = 0
        }
        bufferGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3))
        bufferGeometry.attributes.position.needsUpdate = true

        const material = new THREE.ShaderMaterial({
            uniforms: {
                uTime: {
                    value: 0
                },
            },
            vertexShader,
            fragmentShader
        })
        this.material = material
        
        console.log("bufferGeometry = ", bufferGeometry)

        const points = new THREE.Points(bufferGeometry, material)

        this.scene.add(points)
    }

    protected init() {
    }

    protected onRenderer() {
        this.orbit.update()

        this.material.uniforms.uTime.value = this.clock.getElapsedTime()
    }
}