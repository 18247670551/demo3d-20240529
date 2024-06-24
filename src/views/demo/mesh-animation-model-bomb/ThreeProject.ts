import * as THREE from "three"
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls"
import ThreeCore from "@/three-widget/ThreeCore"
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader"
import {GUI} from "dat.gui"
import {MeshoptDecoder} from "three/examples/jsm/libs/meshopt_decoder.module"
import ModelBomb from "@/three-widget/ModelBomb"


export default class ThreeProject extends ThreeCore {

    private readonly orbit: OrbitControls
    private modelBomb: ModelBomb | null  = null

    constructor(dom: HTMLElement) {

        super(dom, {
            cameraOptions: {
                fov: 45,
                near: 0.1,
                far: 3000
            }
        })

        this.scene.background = new THREE.Color("#edcfa3")

        this.camera.position.set(0, 40, 100)

        // 不能加环境光, 否则车身上就有杂阴影
        //const ambientLight = new THREE.AmbientLight(0xffffff, 1)
        //this.scene.add(ambientLight)

        this.renderer.shadowMap.enabled = true

        this.orbit = new OrbitControls(this.camera, this.renderer.domElement)
        this.orbit.target.y = 30

        // const axesHelper = new THREE.AxesHelper(10)
        // this.scene.add(axesHelper)


        // 顶灯
        const topLight = new THREE.DirectionalLight(0xffffff, 5)
        topLight.castShadow = true
        topLight.position.y = 36
        this.scene.add(topLight)

        // 底灯
        const bottomLight = new THREE.DirectionalLight(0xffffff, 5)
        bottomLight.castShadow = true
        bottomLight.position.y = -10
        this.scene.add(bottomLight)

        // 4个边角灯
        const light1 = new THREE.DirectionalLight(0xffffff, 0.5)
        light1.castShadow = true
        light1.position.set(-27.5, 18, 27.5)
        this.scene.add(light1)

        const light2 = new THREE.DirectionalLight(0xffffff, 0.5)
        light2.castShadow = true
        light2.position.set(27.5, 18, 27.5)
        this.scene.add(light2)

        const light3 = new THREE.DirectionalLight(0xffffff, 0.5)
        light3.castShadow = true
        light3.position.set(-27.5, 18, -27.5)
        this.scene.add(light3)

        const light4 = new THREE.DirectionalLight(0xffffff, 0.5)
        light4.castShadow = true
        light4.position.set(27.5, 18, -27.5)
        this.scene.add(light4)


        const loader = new GLTFLoader()
        loader.setMeshoptDecoder(MeshoptDecoder)

        loader.load("/demo/model-su7/sm_car.gltf", gltf => {
            const obj = gltf.scene
            obj.scale.set(10, 10, 10)
            obj.receiveShadow = true
            this.scene.add(obj)

            obj.traverse((child: any) => {
                if (child.isMesh) {
                    child.receiveShadow = true
                }
            })

            const modelBomb = new ModelBomb(1)
            this.modelBomb = modelBomb
            modelBomb.setModel(obj.children[0])
        })

        this.addGUI()

    }

    private addGUI() {

        const gui = new GUI()

        const guiParams = {
            "爆炸": () => {
                if(!this.modelBomb){
                    console.log("未加载成功, 请刷新页面")
                }else{
                    this.modelBomb.startBomb()
                }
            },
            "还原": () => {
                if(!this.modelBomb){
                    console.log("未加载成功, 请刷新页面")
                }else{
                    this.modelBomb.quitBomb()
                }
            },
            "进度": 0,
        }
        gui.add(guiParams, "爆炸")
        gui.add(guiParams, "还原")
        gui.add(guiParams, "进度", 0, 1).onChange(value => {
            if(!this.modelBomb){
                console.log("未加载成功, 请刷新页面")
            }else{
                this.modelBomb.setValue(value)
            }
        })
    }


    protected init() {
    }


    protected onRenderer() {
        this.orbit.update()

        this.modelBomb?.update()
    }

}