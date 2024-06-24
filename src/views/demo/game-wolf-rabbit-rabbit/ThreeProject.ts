import * as THREE from "three"
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls"
import ThreeCore from "@/three-widget/ThreeCore"
import {GUI} from "dat.gui"
import Rabbit from "@/views/demo/game-wolf-rabbit-rabbit/Rabbit"

export default class ThreeProject extends ThreeCore {

    private readonly orbit: OrbitControls

    private readonly rabbit: Rabbit
    protected dela = 0


    constructor(dom: HTMLElement) {

        super(dom, {
            cameraOptions: {
                fov: 45,
                near: 1,
                far: 1000
            }
        })

        this.camera.position.set(0, 30, 80)
        this.scene.background = new THREE.Color(0x111111)

        const ambientLight = new THREE.AmbientLight(0xffffff, 1)
        this.scene.add(ambientLight)

        const directionalLight1 = new THREE.DirectionalLight(0xffffff, 4)
        directionalLight1.position.set(0, 100, 100)
        directionalLight1.castShadow = true
        this.scene.add(directionalLight1)

        const directionalLight2 = new THREE.DirectionalLight(0xffffff, 2)
        directionalLight2.position.set(0, 100, -100)
        directionalLight2.castShadow = true
        this.scene.add(directionalLight2)

        this.renderer.shadowMap.enabled = true

        this.orbit = new OrbitControls(this.camera, this.renderer.domElement)
        this.orbit.target.y = 20

        this.rabbit = this.addAndGetRabbit()
        this.rabbit.rotation.y = Math.PI/2
        this.rabbit.nod()
    }


    protected init() {
        this.addGUI()
    }

    protected onRenderer() {
        this.orbit.update()

        this.dela = this.clock.getDelta()
    }

    private addAndGetRabbit(){
        const rabbit = new Rabbit()
        this.scene.add(rabbit)
        return rabbit
    }

    private runAnimate(){
        this.rabbit.run(this.dela)
    }

    private addGUI(){
        const gui = new GUI()

        const r: Record<string, Function> = {
            "开始跑": () => {
                this.addAnimate("跑", this.runAnimate.bind(this))
            },
            "停止跑": () => {
                this.removeAnimate("跑")
            },
            "跳": () => {
                this.rabbit.jump()
            },
            "死亡": () => {
                this.rabbit.hang()
            },
        }

        for (let key in r) {
            gui.add(r, key)
        }
    }


}
