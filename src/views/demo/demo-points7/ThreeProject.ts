import * as THREE from "three"
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls"
import ThreeCore from "@/three-widget/ThreeCore"
import MyPoints from "./MyPoints"


export default class ThreeProject extends ThreeCore {

    private readonly orbit: OrbitControls
    private readonly pointsControl: MyPoints

    constructor(dom: HTMLElement) {

        super(dom, {
            cameraOptions: {
                fov: 75,
                near: 0.1,
                far: 10000
            }
        })

        this.scene.background = new THREE.Color(0x000000)

        this.camera.position.set(0, 200, 400)

        const ambientLight = new THREE.AmbientLight(0xffffff, 4)
        this.scene.add(ambientLight)

        this.orbit = new OrbitControls(this.camera, this.renderer.domElement)

        const axesHelper = new THREE.AxesHelper(20)
        this.scene.add(axesHelper)

        const pointsControl = new MyPoints({
            num: 10000,
            size: 10,
            color: {r: 100, g: 200, b: 200, a: 1,},
        })
        this.scene.add(pointsControl)
        this.pointsControl = pointsControl

        this.change()
        setInterval(this.change.bind(this), 5000)
    }

    protected init() {
    }

    private change(){
        const BoxGeometry = new THREE.BoxGeometry(200, 300, 100, 50, 50, 50)
        // 胶囊几何体
        const CapsuleGeometry = new THREE.CapsuleGeometry(200, 200, 100, 50)
        const CircleGeometry = new THREE.CircleGeometry(200, 20, 100, 50)
        // 圆锥体几何体
        const ConeGeometry = new THREE.ConeGeometry(300, 200, 32, 10, false, 50, 50)
        // 圆柱体几何形状
        const CylinderGeometry = new THREE.CylinderGeometry(150, 200, 100, 50, 50, true, 50)
        // 十二面体几何
        const DodecahedronGeometry = new THREE.DodecahedronGeometry(200, 5)
        // 二十面体几何
        const IcosahedronGeometry = new THREE.IcosahedronGeometry(100, 3)
        // 八面体几何
        const OctahedronGeometry = new THREE.OctahedronGeometry(100, 20)
        const PlaneGeometry = new THREE.PlaneGeometry(200, 200, 100, 50)
        const RingGeometry = new THREE.RingGeometry(200, 200, 100, 50, 50, 50)
        const SphereGeometry = new THREE.SphereGeometry(200, 200, 50, 50, 50, 50, 50)
        // 四面体几何
        const TetrahedronGeometry = new THREE.TetrahedronGeometry(200, 200)
        const TorusGeometry = new THREE.TorusGeometry(200, 200, 100, 50, 50)

        const geos = [
            BoxGeometry,
            CapsuleGeometry,
            CircleGeometry,
            ConeGeometry,
            CylinderGeometry,
            DodecahedronGeometry,
            IcosahedronGeometry,
            OctahedronGeometry,
            PlaneGeometry,
            RingGeometry,
            SphereGeometry,
            TetrahedronGeometry,
            TorusGeometry,
        ]

        this.pointsControl.to(geos[THREE.MathUtils.randInt(0, 12)].attributes.position.array, { min: 1000, max: 4000 })
    }

    protected onRenderer() {
        const time = this.clock.getElapsedTime()
        this.orbit.update()

        this.pointsControl.update()
    }

}