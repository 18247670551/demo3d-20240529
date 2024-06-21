import * as THREE from "three"
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls"
import ThreeCore from "@/three-widget/ThreeCore"
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader"
import {DRACOLoader} from "three/examples/jsm/loaders/DRACOLoader"
import {OBJLoader} from "three/examples/jsm/loaders/OBJLoader";

export default class ThreeProject extends ThreeCore {

    private readonly orbit: OrbitControls

    constructor(dom: HTMLElement) {

        super(dom, {
            cameraOptions: {
                fov: 45,
                near: 0.1,
                far: 30000
            }
        })

        this.camera.position.set(0, 2000, 5000)
        this.scene.background = new THREE.Color(0x062469) // 深蓝色

        const ambientLight = new THREE.AmbientLight(0xffffff, 4)
        this.scene.add(ambientLight)

        const directionalLight1 = new THREE.DirectionalLight(0xffffff, 5)
        directionalLight1.position.set(0, 1000, 2000)
        this.scene.add(directionalLight1)

        const directionalLight2 = new THREE.DirectionalLight(0xffffff, 4)
        directionalLight2.position.set(0, 1000, -2000)
        this.scene.add(directionalLight2)

        this.orbit = new OrbitControls(this.camera, this.renderer.domElement)
        this.orbit.target.y = 1000
        this.orbit.update()

        const axesHelper = new THREE.AxesHelper(200)
        this.scene.add(axesHelper)



        // glb压缩模型加载器
        const dracoLoader = new DRACOLoader()
        dracoLoader.setDecoderPath("/draco/")
        const dracoGltfLoader = new GLTFLoader()
        dracoGltfLoader.setDRACOLoader(dracoLoader)

        // glb模型加载器
        const gltfLoader = new GLTFLoader()

        // obj模型加载器
        const objLoader = new OBJLoader()



        // 压缩模型在这里
        dracoGltfLoader.load("/demo/park/无标题.glb", (gltf) => {
            const obj = gltf.scene
            obj.scale.set(20, 20, 20)
            this.scene.add(obj)
        })

        dracoGltfLoader.load("/demo/飘浮的房子/House-c.glb", (gltf) => {
            const obj = gltf.scene
            obj.scale.set(50, 50, 50)
            obj.position.set(2000, 1000, 0)
            this.scene.add(obj)
        })











        // 非压缩模型在这里
        gltfLoader.load("/demo/飘浮的房子/Parrot鹦鹉.glb", (gltf) => {
            const obj = gltf.scene
            obj.scale.set(10, 10, 10)
            obj.position.set(-2000, 1000, 0)
            this.scene.add(obj)
        })


        gltfLoader.load("/demo/池塘公园/fish.glb", (gltf) => {
            const obj = gltf.scene
            obj.scale.set(500, 500, 500)
            obj.position.set(-1000, 1000, 0)
            this.scene.add(obj)

        })


        gltfLoader.load("/demo/池塘公园/forest.glb", (gltf) => {
            const obj = gltf.scene
            obj.scale.set(100, 100, 100)
            obj.position.set(-3000, 0, 0)
            this.scene.add(obj)
        })


        gltfLoader.load("/demo/空间站/spacestation-1.glb", (gltf) => {
            const obj = gltf.scene
            obj.scale.set(800, 800, 800)
            obj.position.set(-5500, 0, -3000)
            this.scene.add(obj)
        })
        gltfLoader.load("/demo/空间站/spacestation-2.glb", (gltf) => {
            const obj = gltf.scene
            obj.scale.set(800, 800, 800)
            obj.position.set(-5500, 0, -3000)
            this.scene.add(obj)

        })
        gltfLoader.load("/demo/空间站/spacestation-3.glb", (gltf) => {
            const obj = gltf.scene
            obj.scale.set(800, 800, 800)
            obj.position.set(-5500, 0, -3000)
            this.scene.add(obj)
        })
        gltfLoader.load("/demo/空间站/spacestation-4.glb", (gltf) => {
            const obj = gltf.scene
            obj.scale.set(800, 800, 800)
            obj.position.set(-5500, 0, -3000)
            this.scene.add(obj)
        })
        gltfLoader.load("/demo/空间站/spacestation-5.glb", (gltf) => {
            const obj = gltf.scene
            obj.scale.set(800, 800, 800)
            obj.position.set(-5500, 0, -3000)
            this.scene.add(obj)
        })

        gltfLoader.load("/demo/夜晚的星空/book.glb", (gltf) => {
            const obj = gltf.scene
            obj.scale.set(800, 800, 800)
            obj.position.set(-3500, -1000, -3000)
            this.scene.add(obj)
        })












        objLoader.load("/demo/夜晚的星空/wood-pylon.obj", (obj) => {
            obj.rotation.z = Math.PI
            obj.scale.set(10,10,10)
            obj.position.set(3000, 1000, 1000)
            obj.frustumCulled = false
            this.scene.add(obj)
        })

        objLoader.load("/demo/夜晚的星空/barque.obj", (obj) => {
            obj.scale.set(10,10,10)
            obj.position.set(1, 1, 1)
            obj.position.set(3000, 1000, 1000)
            this.scene.add(obj)
        })


    }


    protected init() {

    }


    protected onRenderer() {
        this.orbit.update()
    }


}
