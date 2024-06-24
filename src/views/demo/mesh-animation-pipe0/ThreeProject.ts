import * as THREE from "three"
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls"
import ThreeCore from "@/three-widget/ThreeCore"
import {Curve, Vector3} from "three"
import DemoPipe from "@/views/demo/mesh-animation-pipe0/DemoPipe"
import {GUI} from "dat.gui"

export default class ThreeProject extends ThreeCore {

    private readonly orbit: OrbitControls
    private readonly pipe: DemoPipe

    constructor(dom: HTMLElement) {

        super(dom, {
            cameraOptions: {
                fov: 45,
                near: 0.1,
                far: 30000
            }
        })

        this.scene.background = new THREE.Color(0x00719e) // 天蓝色

        this.camera.position.set(0, 2000, 5000)

        const ambientLight = new THREE.AmbientLight(0xffffff, 5)
        this.scene.add(ambientLight)

        const directionalLight1 = new THREE.DirectionalLight(0xffffff, 4)
        directionalLight1.position.set(0, 10000, 20000)
        this.scene.add(directionalLight1)

        const directionalLight2 = new THREE.DirectionalLight(0xffffff, 8)
        directionalLight2.position.set(0, 10000, -20000)
        this.scene.add(directionalLight2)

        this.orbit = new OrbitControls(this.camera, this.renderer.domElement)
        this.orbit.target.x = 1500
        this.orbit.target.y = 1500
        this.orbit.update()

        const axesHelper = new THREE.AxesHelper(200)
        this.scene.add(axesHelper)

        this.pipe = this.addAndGetPipe()

    }


    protected init() {
        this.addGUI()
    }

    private addGUI(){
        const gui = new GUI()

        gui.add(this.pipe, 'startFlow').name('开始流动')
        gui.add(this.pipe, 'stopFlow').name('停止流动')
    }

    private addAndGetPipe(){

        const p1 = new THREE.Vector3(0, 0, 0,)
        const p2 = new THREE.Vector3(0, 1400, 0,)
        const p3 = new THREE.Vector3(50, 1450, 0,)
        const p4 = new THREE.Vector3(100, 1500, 0,)
        const p5 = new THREE.Vector3(3000, 1500, 0)

        const line1 = new THREE.LineCurve3(p1,p2)
        const curve1 = new THREE.CatmullRomCurve3([p2, p3, p4])
        const line2 = new THREE.LineCurve3(p4,p5)

        const curvePath = new THREE.CurvePath()
        curvePath.curves.push(line1, curve1, line2)

        const pipe = new DemoPipe("管道1", {
            radius: 60,
            color: 0x777777,
            tubularSegments: 200,
            radiusSegments: 16,
            curve: curvePath as Curve<Vector3>,
        })

        this.scene.add(pipe)
        return pipe
    }


    protected onRenderer() {
        this.orbit.update()
    }


}
