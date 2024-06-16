import * as THREE from "three"
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls"
import ThreeCore from "@/three-widget/ThreeCore"
import vertexShader from "./shader/vertexShader.glsl"
import fragmentShader from "./shader/fragmentShader.glsl"

export default class ThreeProject extends ThreeCore {

    private readonly orbit: OrbitControls

    private readonly watersMaterial: THREE.ShaderMaterial

    constructor(dom: HTMLElement) {

        super(dom, {
            cameraOptions: {
                fov: 45,
                near: 0.1,
                far: 1000
            }
        })

        this.scene.background = new THREE.Color(0x000000)


        this.camera.position.set(0, 5, 15)

        const ambientLight = new THREE.AmbientLight(0xffffff, 2)
        this.scene.add(ambientLight)

        const light = new THREE.DirectionalLight(0xffffff, 2)
        light.position.set(0, 60, -60)
        light.castShadow = true
        this.scene.add(light)

        const shadowLight = new THREE.DirectionalLight(0xffffff, 4)
        shadowLight.position.set(600, 60, 60)
        shadowLight.castShadow = true
        this.scene.add(shadowLight)

        this.renderer.shadowMap.enabled = true

        this.orbit = new OrbitControls(this.camera, this.renderer.domElement)
        this.orbit.target.y = 2

        const axes = new THREE.AxesHelper(5)
        this.scene.add(axes)




        // 水雾数量 2000
        const watersCount = 2000

        const watersGeometry = new THREE.BufferGeometry()

        const positions = new Float32Array(watersCount * 3)
        //const toPositions = new Float32Array(watersCount * 3)
        const toPositions = new Float32Array(watersCount * 3)

        // const to = {
        //     x: Math.random() - 0.5,
        //     y: Math.abs(Math.random() + 1.2),
        //     z: Math.random() - 0.5
        // }

        for (let i = 0; i < watersCount; i++) {

            positions[i * 3] = 0
            positions[i * 3 + 1] = 0
            positions[i * 3 + 2] = 0

            // 每个水点发射角度
            const theta = Math.random() * 30 //θ
            const phi = Math.random() * 30 //φ
            const r = 5
            // toPositions[i * 3] = r * Math.sin(theta) + r * Math.sin(phi)
            // toPositions[i * 3 + 1] = r * Math.cos(theta) + r * Math.cos(phi)
            // toPositions[i * 3 + 2] = r * Math.sin(theta) + r * Math.cos(phi)
            toPositions[i * 3] = r * Math.sin(theta) + r * Math.sin(phi)
            toPositions[i * 3 + 1] = r * Math.cos(theta) + r * Math.cos(phi)
            toPositions[i * 3 + 2] = r * Math.sin(theta) + r * Math.cos(phi)
        }

        watersGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
        watersGeometry.setAttribute('aToPosition', new THREE.BufferAttribute(toPositions, 3))

        const watersMaterial = new THREE.ShaderMaterial({
            vertexShader,
            fragmentShader,
            transparent: true,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
            uniforms: {
                uTime: {
                    value: 0
                },
            }
        })
        this.watersMaterial = watersMaterial

        const waters = new THREE.Points(watersGeometry, watersMaterial)
        this.scene.add(waters)
    }

    protected init() {
    }


    protected onRenderer() {
        const elapsed = this.clock.getElapsedTime()
        this.orbit.update()

        this.watersMaterial.uniforms.uTime.value = elapsed
    }

}