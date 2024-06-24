import * as THREE from "three"
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls"
import ThreeCore from "@/three-widget/ThreeCore"
import vertexShader from "./shader/vertexShader.glsl"
import fragmentShader from "./shader/fragmentShader.glsl"
import {getTextureLoader} from "@/three-widget/loader/ThreeLoader"


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
        
        this.orbit = new OrbitControls(this.camera, this.renderer.domElement)

        // const axesHelper = new THREE.AxesHelper(0.1)
        // this.scene.add(axesHelper)

        
        

        const texture = getTextureLoader().load("public/demo/mesh-shader-wave1/img.png")

        const shadeMaterial = new THREE.RawShaderMaterial({
            uniforms: {
                uTime: {value: 0},
                uTexture: {value: texture},
            },
            vertexShader,
            fragmentShader,
            // wireframe:true,
            side: THREE.DoubleSide,
        })
        this.shadeMaterial = shadeMaterial

        const plane = new THREE.Mesh(new THREE.PlaneGeometry(2, 2, 128, 128), shadeMaterial)
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