import * as THREE from "three"
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls"
import ThreeCore from "@/three-widget/ThreeCore"
import vertexShader from "./shader/vertexShader.glsl"
import fragmentShader from "./shader/fragmentShader.glsl"
import {GUI} from "dat.gui"


export default class ThreeProject extends ThreeCore {

    private readonly orbit: OrbitControls
    private readonly shadeMaterial: THREE.ShaderMaterial

    private readonly params = {
        uWaresFrequency: 20,
        uScale: 0.1,
        uNoiseFrequency: 40,
        uNoiseScale: 2,
        uXzScale: 2,
        uLowColor: 0x000000,
        uHighColor: 0xffffff,
        uOpacity: 0.5,
    }


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


        // const ambientLight = new THREE.AmbientLight(0xffffff, 2)
        // this.scene.add(ambientLight)

        const shadeMaterial = new THREE.ShaderMaterial({
            vertexShader,
            fragmentShader,
            side: THREE.DoubleSide,
            uniforms: {
                uTime: {
                    value: 0
                },
                uWaresFrequency: {
                    value: this.params.uWaresFrequency
                },
                uScale: {
                    value: this.params.uScale
                },
                uNoiseFrequency: {
                    value: this.params.uNoiseFrequency
                },
                uNoiseScale: {
                    value: this.params.uNoiseScale
                },
                uXzScale: {
                    value: this.params.uXzScale
                },
                uLowColor: {
                    value: new THREE.Color(this.params.uLowColor)
                },
                uHighColor: {
                    value: new THREE.Color(this.params.uHighColor)
                },
                uOpacity: {
                    value: this.params.uOpacity
                }
            },
            transparent: true
        })


        this.shadeMaterial = shadeMaterial

        const plane = new THREE.Mesh(new THREE.PlaneGeometry(2, 2, 128, 128), shadeMaterial)
        this.scene.add(plane)

        this.addGUI()
    }

    private addGUI() {

        const gui = new GUI()

        gui.add(this.params, 'uWaresFrequency').min(1).max(50).step(0.1).onChange(val => {
            this.shadeMaterial.uniforms.uWaresFrequency.value = val
        })
        gui.add(this.params, 'uScale').min(0).max(0.2).step(0.01).onChange(val => {
            this.shadeMaterial.uniforms.uScale.value = val
        })
        gui.add(this.params, 'uNoiseFrequency').min(0).max(100).step(0.1).onChange(val => {
            this.shadeMaterial.uniforms.uNoiseFrequency.value = val
        })
        gui.add(this.params, 'uNoiseScale').min(0).max(5).step(0.01).onChange(val => {
            this.shadeMaterial.uniforms.uNoiseScale.value = val
        })
        gui.add(this.params, 'uXzScale').min(1).max(5).step(0.01).onChange(val => {
            this.shadeMaterial.uniforms.uXzScale.value = val
        })
        gui.addColor(this.params, 'uLowColor').onFinishChange(val => {
            this.shadeMaterial.uniforms.uLowColor.value = new THREE.Color(val)
        })
        gui.addColor(this.params, 'uHighColor').onFinishChange(val => {
            this.shadeMaterial.uniforms.uHighColor.value = new THREE.Color(val)
        })
        gui.add(this.params, 'uOpacity').min(0).max(1).onChange(val => {
            this.shadeMaterial.uniforms.uOpacity.value = val
        })
    }

    protected init() {
    }

    protected onRenderer() {
        const elapsed = this.clock.getElapsedTime()
        this.orbit.update()
        this.shadeMaterial.uniforms.uTime.value = elapsed
    }


}