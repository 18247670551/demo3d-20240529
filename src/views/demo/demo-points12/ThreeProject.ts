import * as THREE from "three"
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls"
import ThreeCore from "@/three-widget/ThreeCore"
import vertexShader from "./shader/vertexShader.glsl"
import fragmentShader from "./shader/fragmentShader.glsl"
import _ from "lodash";


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


        this.camera.position.set(0, 5, 10)

        const ambientLight = new THREE.AmbientLight(0xffffff, 2)
        this.scene.add(ambientLight)

        const light = new THREE.DirectionalLight(0xffffff, 2)
        light.position.set(0, 60, -60)
        light.castShadow = true

        const shadowLight = new THREE.DirectionalLight(0xffffff, 4)
        shadowLight.position.set(600, 60, 60)
        shadowLight.castShadow = true

        this.renderer.shadowMap.enabled = true

        this.orbit = new OrbitControls(this.camera, this.renderer.domElement)
        this.orbit.target.y = 2

        const axes = new THREE.AxesHelper(5)
        this.scene.add(axes)


        const bufferGeometry = new THREE.BufferGeometry()
        const count = 2000
        const positions = new Float32Array(count * 3)
        const endPositions = new Float32Array(count * 3)
        const durations = new Float32Array(count)

        for (let i = 0; i < count; i++) {
            positions[i * 3] = 0
            positions[i * 3 + 1] = 0
            positions[i * 3 + 2] = 0

            const endPosition = this.randomEndPosition(this.randomRange(30), this.randomRange(30), 50)

            endPositions[i * 3] = endPosition[0]
            endPositions[i * 3 + 1] = endPosition[1]
            //endPositions[i * 3 + 2] = endPosition[2]
            endPositions[i * 3 + 2] = 0

            durations[i] = 3000
        }
        bufferGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3))
        bufferGeometry.setAttribute("endPosition", new THREE.BufferAttribute(endPositions, 3))
        bufferGeometry.setAttribute("duration", new THREE.BufferAttribute(durations, 1))
        bufferGeometry.attributes.position.needsUpdate = true
        bufferGeometry.attributes.endPosition.needsUpdate = true
        bufferGeometry.attributes.duration.needsUpdate = true


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

        const points = new THREE.Points(bufferGeometry, material)

        this.scene.add(points)

        // const deg1 = this.randomRange(30)
        // console.log("deg1 = ", deg1)
        //
        // const deg2 = this.randomRange(30)
        // console.log("deg2 = ", deg2)
        //
        //
        // const po = this.randomEndPosition(deg1, deg2, 100)
        //
        // console.log("po = ", po)
    }

    protected init() {
    }

    private time = 0

    protected onRenderer() {

        this.orbit.update()

        const elapsed = this.clock.getElapsedTime()

        const time = elapsed - this.time

        if(time > 3){
            this.time = elapsed
        }

        this.material.uniforms.uTime.value = time * 1000
    }

    private randomRange(range: number){
        return range * Math.sin(_.random(1000, 9999))
    }

    private randomEndPosition(degA: number, degB: number, r: number){
        const x = r * Math.cos(degA) * Math.cos(degB)
        const y = r * Math.cos(degA) * Math.sin(degB)
        const z = r * Math.sin(degA)

        return [x, y, z]
    }

}