import * as THREE from "three"
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls"
import ThreeCore from "@/three-widget/ThreeCore"
import vertexShader from "./shader/vertexShader.glsl"
import fragmentShader from "./shader/fragmentShader.glsl"
import {createWallByPath} from "@/utils/wallUtils"


export default class ThreeProject extends ThreeCore {

    private readonly orbit: OrbitControls
    private readonly mat: THREE.ShaderMaterial


    constructor(dom: HTMLElement) {

        super(dom, {
            cameraOptions: {
                fov: 45,
                near: 0.1,
                far: 100000
            }
        })

        this.scene.background = new THREE.Color(0x000000)


        this.camera.position.set(0, 1000, 2000)

        const ambientLight = new THREE.AmbientLight(0xffffff, 0.9)
        this.scene.add(ambientLight)

        this.orbit = new OrbitControls(this.camera, this.renderer.domElement)

        const axes = new THREE.AxesHelper(200)
        this.scene.add(axes)


        const loader = new THREE.TextureLoader()
        const bgTexture = loader.load("/demo/wall/1.png")
        const flowTexture = loader.load("/demo/wall/2.png")

        bgTexture.wrapS = THREE.RepeatWrapping
        flowTexture.wrapS = THREE.RepeatWrapping

        const mat = new THREE.ShaderMaterial({
            uniforms: {
                time: {
                    value: 0,
                },
                bgTexture: {
                    value: bgTexture,
                },
                flowTexture: {
                    value: flowTexture,
                },
            },
            transparent: true,
            depthWrite: false,
            depthTest: false,
            side: THREE.DoubleSide,
            vertexShader: vertexShader,
            fragmentShader: fragmentShader,
        })

        this.mat = mat


        const path = [
            [800, 0, -400],
            [100, 0, 0],
            [600, 0, 500],
            [0, 100, 0],
            [100, 100, 100],
            [-600, 0, 500],
            [-500, 0, -300],
            [800, 0, -400],
        ]
        const wallMesh = createWallByPath(100, path, mat, true)
        this.scene.add(wallMesh)

    }

    protected init() {
    }

    protected onRenderer() {
        this.orbit.update()
        this.mat.uniforms.time.value += 0.01
    }


}