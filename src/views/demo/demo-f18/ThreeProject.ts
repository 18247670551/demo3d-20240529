import * as THREE from "three"
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls"
import ThreeCore from "@/three-widget/ThreeCore"
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader"

export default class ThreeProject extends ThreeCore {

    private readonly orbit: OrbitControls
    private f18: THREE.Group | null = null

    constructor(dom: HTMLElement) {

        super(dom, {
            cameraOptions: {
                fov: 45,
                near: 1,
                far: 30000
            }
        })

        this.camera.position.set(0, 1000, 2000)
        this.scene.background = new THREE.Color(0x062469) // 深蓝色

        const ambientLight = new THREE.AmbientLight(0xffffff, 5)
        this.scene.add(ambientLight)

        const directionalLight1 = new THREE.DirectionalLight(0xffffff, 5)
        directionalLight1.position.set(0, 10000, 20000)
        this.scene.add(directionalLight1)

        const directionalLight2 = new THREE.DirectionalLight(0xffffff, 4)
        directionalLight2.position.set(0, 10000, -20000)
        this.scene.add(directionalLight2)

        this.orbit = new OrbitControls(this.camera, this.renderer.domElement)
        this.orbit.target.y = 200
        this.orbit.update()
    }


    protected init() {
        this.addF18()
    }

    protected onRenderer() {
        this.orbit.update()
    }

    private async addF18() {

        const gltfLoader = new GLTFLoader()

        const f18_explodeTask = gltfLoader.loadAsync("/demo/f18/f18_explode.glb")
        const f18_v13Task = gltfLoader.loadAsync("/demo/f18/f18_v13.glb")

        Promise.all([f18_explodeTask, f18_v13Task])
            .then(([f18_explode_gltf, f18_v13_gltf]) => {
                const group = new THREE.Group()
                const f18_v13 = f18_v13_gltf.scene
                const f18_explode = f18_explode_gltf.scene
                group.add(f18_v13, f18_explode)
                group.scale.set(1000, 1000, 1000)
                group.rotation.y = Math.PI / 2
                this.scene.add(group)
                this.f18 = group
            })
    }


}
