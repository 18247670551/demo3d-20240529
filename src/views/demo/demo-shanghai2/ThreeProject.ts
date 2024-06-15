import * as THREE from "three"
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls"
import ThreeCore from "@/three-widget/ThreeCore"
import MyLoader from "@/three-widget/loader/MyLoader"


export default class ThreeProject extends ThreeCore{

    private readonly orbit: OrbitControls

    constructor(dom: HTMLElement) {

        super(dom, {
            cameraOptions: {
                fov: 45,
                near: 0.1,
                far: 100000
            }
        })

        this.scene.background = new THREE.Color(0x111111)

        this.camera.position.set(0, 2500, 7000)

        const ambientLight = new THREE.AmbientLight(0xffffff, 3)
        this.scene.add(ambientLight)

        this.orbit = new OrbitControls(this.camera, this.renderer.domElement)
        this.orbit.target.y = -1000
    }

    init(){
        this.load()
    }

    // 有发送加载进度事件, 在 Index.vue 中接收了
    async load(){
        const loader = new MyLoader()
        const { scene } = await loader.loadGLTF("/demo/shanghai2/shanghai2.glb")
        if(scene){
            scene.scale.set(1000, 1000, 1000)

            this.scene.add(scene)
        }else{
            console.log("未找到模型")
        }
    }

    onRenderer() {
        this.orbit.update()
    }

}
