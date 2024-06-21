import * as THREE from "three"
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls"
import ThreeCore from "@/three-widget/ThreeCore"
import Fire from "@/views/demo/demo-fire/Fire";

export default class ThreeProject extends ThreeCore {

    private readonly orbit: OrbitControls
    private fire: Fire

    private readonly params = {
        iTime: {
            value: 0,
        },
    }

    constructor(dom: HTMLElement) {

        super(dom, {
            cameraOptions: {
                fov: 75,
                near: 0.1,
                far: 1000
            },
            rendererOptions: {
                antialias: true,
                alpha: true,
                // 深度缓冲, 解决模型重叠部分不停闪烁问题
                // 这个属性会导致精灵材质会被后面的物体遮挡(不知道什么原理),
                // 传入rendererOptions参数, 将此参数改为 false
                logarithmicDepthBuffer: false
            }
        })

        this.scene.background = new THREE.Color(0x000000)

        this.camera.position.set(0, 0, 60)

        const ambientLight = new THREE.AmbientLight(0xffffff, 2)
        this.scene.add(ambientLight)

        const axesHelper = new THREE.AxesHelper(20)
        this.scene.add(axesHelper)

        this.orbit = new OrbitControls(this.camera, this.renderer.domElement)
        this.orbit.target.y = 30

        this.fire = new Fire({
            width: 40,
            height: 64
        })
        this.scene.add(this.fire)
    }

    protected init() {

    }

    protected onRenderer() {
        const time = this.clock.getElapsedTime()

        this.orbit.update()
        this.fire.update()
    }

}
