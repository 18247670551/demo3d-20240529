import * as THREE from "three"
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls"
import ThreeCore from "@/three-widget/ThreeCore"
import {GUI} from "dat.gui"
import Monster from "@/views/demo/game-wolf-rabbit/wolf/Monster"

export default class ThreeProject extends ThreeCore {

    private readonly orbit: OrbitControls

    private readonly wolf: Monster
    protected dela = 0


    constructor(dom: HTMLElement) {

        super(dom, {
            cameraOptions: {
                fov: 45,
                near: 1,
                far: 1000
            }
        })

        this.camera.position.set(0, 40, 100)
        this.scene.background = new THREE.Color(0x999999)

        const ambientLight = new THREE.AmbientLight(0xffffff, 1)
        this.scene.add(ambientLight)

        const directionalLight1 = new THREE.DirectionalLight(0xffffff, 6)
        directionalLight1.position.set(0, 100, 100)
        directionalLight1.castShadow = true
        this.scene.add(directionalLight1)

        const directionalLight2 = new THREE.DirectionalLight(0xffffff, 3)
        directionalLight2.position.set(0, 100, -100)
        directionalLight2.castShadow = true
        this.scene.add(directionalLight2)

        this.renderer.shadowMap.enabled = true

        this.orbit = new OrbitControls(this.camera, this.renderer.domElement)

        this.wolf = this.addAndGetMonster()
        this.wolf.rotation.y = Math.PI/2
        this.wolf.nod()
    }


    protected init() {
        this.addGUI()
    }

    protected onRenderer() {
        this.orbit.update()

        this.dela = this.clock.getDelta()
    }

    private addAndGetMonster(){
        const wolf = new Monster()
        this.scene.add(wolf)
        return wolf
    }

    private runAnimate(){
        this.wolf.run(this.dela)
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
            "坐": () => {
                this.wolf.sit()
            },
        }

        for (let key in r) {
            gui.add(r, key)
        }
    }


}
