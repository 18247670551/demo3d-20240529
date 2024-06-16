import * as THREE from "three"
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls"
import ThreeCore from "@/three-widget/ThreeCore"
import vertexShader from "./shader/vertexShader.glsl"
import fragmentShader from "./shader/fragmentShader.glsl"


export default class ThreeProject extends ThreeCore {

    private readonly orbit: OrbitControls
    private readonly shadeMaterial: THREE.ShaderMaterial


    constructor(dom: HTMLElement) {

        super(dom, {
            cameraOptions: {
                fov: 45,
                near: 0.1,
                far: 100
            }
        })

        this.scene.background = new THREE.Color(0x000000)


        this.camera.position.set(0, 0, 3)

        // const ambientLight = new THREE.AmbientLight(0xffffff, 2)
        // this.scene.add(ambientLight)

        this.orbit = new OrbitControls(this.camera, this.renderer.domElement)

        const axes = new THREE.AxesHelper(0.1)
        this.scene.add(axes)


        const loader = new THREE.TextureLoader()
        const texture = loader.load("public/demo/shader-wave/img.png")

        const shadeMaterial = new THREE.RawShaderMaterial({
            vertexShader,
            fragmentShader,
            // wireframe:true,
            side: THREE.DoubleSide,
            uniforms: {
                uTime: { value: 0 },
                uTexture: { value: texture },
            },
        })
        this.shadeMaterial = shadeMaterial

        const plane = new THREE.Mesh(new THREE.PlaneGeometry(1, 1, 64, 64), shadeMaterial)
        this.scene.add(plane)
    }

    protected init() {
    }

    protected onRenderer() {
        const elapsed = this.clock.getElapsedTime()
        this.orbit.update()
        this.shadeMaterial.uniforms.uTime.value = elapsed
    }


}