import * as THREE from "three"
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls"
import ThreeCore from "@/three-widget/ThreeCore"
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader"
import {GUI} from "dat.gui"


export default class ThreeProject extends ThreeCore {

    private readonly orbit: OrbitControls
    private readonly mixers: THREE.AnimationMixer[] = []
    private readonly animations: Record<string, THREE.AnimationAction> = {}
    private guiObj = {
        "摇头": false,
        "跑": false,
    }

    constructor(dom: HTMLElement) {

        super(dom, {
            cameraOptions: {
                fov: 45,
                near: 0.1,
                far: 1000
            }
        })

        this.scene.background = new THREE.Color(0x000000)

        this.camera.position.set(20, 10, 50)

        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
        this.scene.add(ambientLight)

        const light = new THREE.DirectionalLight(0xffffff, 1)
        light.position.set(0, 60, -600)
        light.castShadow = true
        this.scene.add(light)

        const shadowLight = new THREE.DirectionalLight(0xffffff, 2)
        shadowLight.position.set(10, 60, 600)
        shadowLight.castShadow = true
        this.scene.add(shadowLight)

        this.renderer.shadowMap.enabled = true

        this.orbit = new OrbitControls(this.camera, this.renderer.domElement)
        this.orbit.target.y = 15

        // const axesHelper = new THREE.AxesHelper(10)
        // this.scene.add(axesHelper)


        // 添加狐狸模型
        const gltfLoader = new GLTFLoader()
        gltfLoader.load('/demo/model-box/Fox.glb', gltf => {
            gltf.scene.traverse((child: any) => {
                if (child.isMesh) {
                    child.castShadow = true
                    child.material.side = THREE.DoubleSide
                }
            })
            const obj = gltf.scene
            obj.scale.set(.3, .3, .3)
            obj.rotation.y = Math.PI * 0.6
            this.scene.add(obj)


            const mixer = new THREE.AnimationMixer(obj)
            const clip1 = mixer.clipAction(gltf.animations[0])
            this.animations["摇头"] = clip1
            const clip2 = mixer.clipAction(gltf.animations[1])
            this.animations["跑"] = clip2
            clip2.timeScale = 1.6

            this.mixers.push(mixer)
        })

        this.addGUI()
    }

    private addGUI(){
        const gui = new GUI()

        gui.add(this.guiObj, "摇头").onChange((value: boolean) => {
            if(value){
                this.animations["摇头"].play()
            }else{
                this.animations["摇头"].stop()
            }
        })
        gui.add(this.guiObj, "跑").onChange((value: boolean) => {
            if(value){
                this.animations["跑"].play()
            }else{
                this.animations["跑"].stop()
            }
        })
    }


    protected init() {
    }


    protected onRenderer() {
        this.orbit.update()

        this.mixers.forEach(item => item.update(1/60))
    }

}