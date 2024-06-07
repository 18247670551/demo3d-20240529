import * as THREE from "three"
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls"
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader"
import ThreeCore from "@/three-widget/ThreeCore"
import MyLoader from "@/three-widget/loader/MyLoader"
import {DRACOLoader} from "three/examples/jsm/loaders/DRACOLoader";


export default class ThreeProject extends ThreeCore{

    private readonly orbit: OrbitControls

    constructor(dom: HTMLElement) {

        super(dom, {
            cameraOptions: {
                fov: 45,
                near: 0.1,
                far: 1000
            }
        })


        this.scene.background = new THREE.Color(0x062469) // 深蓝色

        this.camera.position.set(400, 300, -400)

        const ambientLight = new THREE.AmbientLight(0xffffff, 4)
        this.scene.add(ambientLight)

        this.orbit = new OrbitControls(this.camera, this.renderer.domElement)
        this.orbit.autoRotate = true
        this.orbit.target.y = 100
        this.orbit.update()
    }

    init(){

        this.load2()

    }

    // 有发送加载进度事件, 在 Index.vue 中接收了
    async load(){
        const loader = new MyLoader()
        const { scene } = await loader.loadGLTF("/demo/csmart/csmart.glb")
        if(scene){
            this.scene.add(scene)
        }else{
            console.log("未找到模型")
        }
    }

    // 有发送加载进度事件, 在 Index.vue 中接收了
    async load2(){
        const dracoLoader = new DRACOLoader()
        dracoLoader.setDecoderPath("/draco/")
        const dracoGltfLoader = new GLTFLoader()
        dracoGltfLoader.setDRACOLoader(dracoLoader)

        dracoGltfLoader.load("/demo/csmart/csmart_darco.glb", (gltf) => {
            const obj = gltf.scene
            this.scene.add(obj)
        })
    }

    load1(){
        const gltfLoader = new GLTFLoader()
        gltfLoader.load("/demo/csmart/csmart.glb", (gltf) => {
           const scene = gltf.scene
           this.scene.add(scene)
        })
    }

    onRenderer() {
        this.orbit.update()
    }

}
