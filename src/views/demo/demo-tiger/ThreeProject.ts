import * as THREE from "three"
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls"
import ThreeCore from "@/three-widget/ThreeCore"
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader"
import {GUI} from "dat.gui"


export default class ThreeProject extends ThreeCore {

    private readonly orbit: OrbitControls
    private animations: Record<string, THREE.AnimationMixer> = {}
    private guiObj = {
        run: false,
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

        const ambientLight = new THREE.AmbientLight(0xffffff, 10)
        this.scene.add(ambientLight)

        const light = new THREE.DirectionalLight(0xffffff, 2)
        light.position.set(0, 60, -600)
        light.castShadow = true
        this.scene.add(light)

        const shadowLight = new THREE.DirectionalLight(0xffffff, 5)
        shadowLight.position.set(10, 60, 600)
        shadowLight.castShadow = true
        this.scene.add(shadowLight)

        this.renderer.shadowMap.enabled = true

        this.orbit = new OrbitControls(this.camera, this.renderer.domElement)
        this.orbit.target.y = 10

        // const axes = new THREE.AxesHelper(10)
        // this.scene.add(axes)


        // 模型加载进度管理
        const manager = new THREE.LoadingManager()
        manager.onStart = (url, loaded, total) => {}
        manager.onLoad = () => {}
        manager.onProgress = async (url, loaded, total) => {

            const progress = Math.floor(loaded / total * 100)

            if (progress === 100) {
                console.log("加载完成")
            } else {
                console.log("progress = ", progress)
            }
        }

        const loader = new GLTFLoader(manager)
        
        loader.load("/demo/tiger/tiger.gltf", ({scene: obj, animations}) => {
            
            console.log("obj = ", obj)
            console.log("animations = ", animations)

            obj.traverse((child: any) => {
                if (child.isMesh) {
                    child.castShadow = true
                    child.material.metalness = 0
                    child.material.roughness = .8
                    child.material.transparent = true
                    child.material.side = THREE.DoubleSide
                    child.material.color = new THREE.Color(0xffffff)
                }
            })
            obj.rotation.y = -Math.PI/2

            const mixer = new THREE.AnimationMixer(obj)

            const runAction = mixer.clipAction(animations[0])
            runAction.play()
            //runAction.setLoop(THREE.LoopRepeat, 100)
            this.animations.run = mixer

            this.scene.add(obj)
        })

        this.addGUI()
    }


    protected init() {
    }


    protected onRenderer() {
        this.orbit.update()

        if(this.guiObj.run){
            // update 参数是动画更新速度, 默认每秒60次, 值为 1/60, 这个老虎模型跑的速度有点快, 设为 1/120
            this.animations.run?.update(1 / 120)
        }
    }

    private addGUI(){
        const gui = new GUI()

        gui.add(this.guiObj, "run").name("走")
    }

}