import * as THREE from "three"
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls"
import ThreeCore from "@/three-widget/ThreeCore"
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader"
import {GUI} from "dat.gui"
import {MeshoptDecoder} from "three/examples/jsm/libs/meshopt_decoder.module"
import {getTextureLoader} from "@/three-widget/loader/ThreeLoader"


import matcap_0Pic from "./texture/matcap_0.png"
import matcap_2Pic from "./texture/matcap_2.png"
import matcap_3Pic from "./texture/matcap_3.png"
import matcap_4Pic from "./texture/matcap_4.png"
import matcap_5Pic from "./texture/matcap_5.png"
import matcap_6Pic from "./texture/matcap_6.png"
import matcap_7Pic from "./texture/matcap_7.png"



export default class ThreeProject extends ThreeCore {

    private readonly orbit: OrbitControls
    private readonly plane: THREE.Mesh

    constructor(dom: HTMLElement) {

        super(dom, {
            cameraOptions: {
                fov: 45,
                near: 0.1,
                far: 3000
            }
        })

        this.scene.background = new THREE.Color(0x000000)

        this.camera.position.set(0, 30, 80)

        // 不能加环境光, 否则车身上就有杂阴影
        //const ambientLight = new THREE.AmbientLight(0xffffff, 1)
        //this.scene.add(ambientLight)

        this.renderer.shadowMap.enabled = true

        this.orbit = new OrbitControls(this.camera, this.renderer.domElement)
        this.orbit.target.y = 10
        this.orbit.autoRotate = true

        // const axesHelper = new THREE.AxesHelper(10)
        // this.scene.add(axesHelper)


        // 展台
        const planeGeo = new THREE.CylinderGeometry(34, 34, 5, 64, 1)
        planeGeo.translate(0, -2.5, 0)
        const planeMat = new THREE.MeshMatcapMaterial({
            matcap: getTextureLoader().load(matcap_4Pic),
            color: 0xffffff
        })
        const plane = new THREE.Mesh(planeGeo, planeMat)
        plane.receiveShadow = true
        this.plane = plane
        this.scene.add(plane)


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


        // 模型加载进度管理
        const manager = new THREE.LoadingManager()
        manager.onStart = (url, loaded, total) => {
        }
        manager.onLoad = () => {
        }
        manager.onProgress = async (url, loaded, total) => {

            const progress = Math.floor(loaded / total * 100)

            if (progress === 100) {
                console.log("加载完成")
            } else {
                console.log("progress = ", progress)
            }
        }

        const loader = new GLTFLoader(manager)
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
        })

        this.addGUI()

    }

    private addGUI() {
        const gui = new GUI()
        gui.add(this.plane, "visible").name("展台")
    }


    protected init() {
    }


    protected onRenderer() {
        this.orbit.update()
    }

}