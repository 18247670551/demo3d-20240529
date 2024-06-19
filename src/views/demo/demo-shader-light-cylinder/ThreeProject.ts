import * as THREE from "three"
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls"
import ThreeCore from "@/three-widget/ThreeCore"
import vertexShader from "./shader/vertexShader.glsl"
import fragmentShader from "./shader/fragmentShader.glsl"


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


        this.camera.position.set(0, 1000, 3000)

        const ambientLight = new THREE.AmbientLight(0xffffff, 2)
        this.scene.add(ambientLight)

        this.orbit = new OrbitControls(this.camera, this.renderer.domElement)
        this.orbit.target.y = 500

        const axes = new THREE.AxesHelper(1000)
        this.scene.add(axes)


        const radius = 1000
        const height = 1000
        const segment = 32


        const topPos: number[] = []
        const bottomPos: number[] = []
        const faces: number[] = []

        const angleOffset = (Math.PI * 2) / segment

        for (let i = 0; i < segment; i++) {

            let x = Math.cos(angleOffset * i) * radius
            let z = Math.sin(angleOffset * i) * radius

            topPos.push(x, height, z)
            bottomPos.push(x, 0, z)

            if (i != segment - 1) {
                faces.push(i + segment + 1, i, i + segment)
                faces.push(i, i + segment + 1, i + 1)
            } else {
                faces.push(segment, i, i + segment)
                faces.push(i, segment, 0)
            }

        }
        const positions = bottomPos.concat(topPos)

        const geo = new THREE.BufferGeometry()

        geo.setIndex(new THREE.BufferAttribute(new Uint16Array(faces), 1))

        geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(positions), 3))


        const color = new THREE.Color("#00ffff")
        const mat = new THREE.ShaderMaterial({
            uniforms: {
                targetColor: {value: new THREE.Vector3(color.r, color.g, color.b)},
                height: {value: height},
            },
            vertexShader,
            fragmentShader,
            side: THREE.DoubleSide,
            transparent: true,
            depthWrite: false,
            //depthTest:false,

            //wireframe: true,
        })


        const mesh = new THREE.Mesh(geo, mat)
        mesh.renderOrder = 9999
        this.scene.add(mesh)

    }

    protected init() {
    }

    protected onRenderer() {
        this.orbit.update()
    }


}