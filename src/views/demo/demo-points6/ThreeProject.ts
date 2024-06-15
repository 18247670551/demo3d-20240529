import * as THREE from "three"
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls"
import ThreeCore from "@/three-widget/ThreeCore"


export default class ThreeProject extends ThreeCore {

    private readonly orbit: OrbitControls

    private readonly particles: THREE.Points
    private readonly particleCount: number


    constructor(dom: HTMLElement) {

        super(dom, {
            cameraOptions: {
                fov: 75,
                near: 0.1,
                far: 10000
            }
        })

        this.scene.background = new THREE.Color(0x000000)

        this.camera.position.set(0, 2, 6)

        const ambientLight = new THREE.AmbientLight(0xffffff, 4)
        this.scene.add(ambientLight)

        this.orbit = new OrbitControls(this.camera, this.renderer.domElement)
        this.orbit.target.y = 2

        // const axes = new THREE.AxesHelper(2)
        // this.scene.add(axes)

        this.particleCount = 2000

        this.particles = this.createParticles()
        this.scene.add(this.particles)

    }

    protected init() {
    }

    protected onRenderer() {
        this.orbit.update()

        this.updateParticles()
    }

    private updateParticles(){
        for (let i = 0; i < this.particleCount; i++) {
            const positions = this.particles.geometry.attributes.position.array
            if (positions[i * 3 + 1] < -5) {
                positions[i * 3 + 1] = Math.random() * 10 + 5
            } else {
                positions[i * 3 + 1] -= 0.02
            }
        }

        this.particles.geometry.attributes.position.needsUpdate = true
    }

    private createParticles(){

        const texture = this.textureLoader.load('/demo/points6/spark1.png')

        const particles = new THREE.BufferGeometry()
        const positions = new Float32Array(this.particleCount * 3)
        const colors = new Float32Array(this.particleCount * 3)

        const color = new THREE.Color()

        for (let i = 0; i < this.particleCount; i++) {
            let pX = Math.random() * 10 - 5
            let pY = Math.random() * 10 - 5
            let pZ = Math.random() * 10 - 5

            positions[i * 3] = pX
            positions[i * 3 + 1] = pY
            positions[i * 3 + 2] = pZ

            color.setHSL((pY + 1) / 2, 1.0, 0.5)
            colors[i * 3] = color.r
            colors[i * 3 + 1] = color.g
            colors[i * 3 + 2] = color.b
        }

        particles.setAttribute('position', new THREE.BufferAttribute(positions, 3))
        particles.setAttribute('color', new THREE.BufferAttribute(colors, 3))

        const particleMaterial = new THREE.PointsMaterial({
            size: 0.3,
            map: texture,
            blending: THREE.AdditiveBlending,
            depthTest: false,
            transparent: true,
            vertexColors: true
        })

        return new THREE.Points(particles, particleMaterial)
    }

}