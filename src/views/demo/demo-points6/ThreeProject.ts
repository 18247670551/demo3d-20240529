import * as THREE from "three"
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls"
import ThreeCore from "@/three-widget/ThreeCore"
import PointsControl from "@/views/demo/demo-points6/PointsControl"

export default class ThreeProject extends ThreeCore {

    private readonly orbit: OrbitControls
    private readonly pointsControl: PointsControl

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

        const axes = new THREE.AxesHelper(20)
        this.scene.add(axes)

        const pointsControl = new PointsControl(10000)
        this.scene.add(pointsControl.particles)

        this.pointsControl = pointsControl
    }

    protected init() {
        const sphereGeometry = new THREE.SphereGeometry(200, 50, 50)
        this.pointsControl.to(sphereGeometry.attributes.position.array, { min: 1000, max: 5000 })
    }

    /**
     * 不能这样使用, 只有第一次有组合动画
     */
    private async test(){
        setInterval(this.change.bind(this), 6000)
    }

    private change(){
        const PlaneGeometry = new THREE.PlaneGeometry(200, 200, 50)
        const CylinderGeometry = new THREE.CylinderGeometry(140, 200, 150)
        const BoxGeometry = new THREE.BoxGeometry(300, 200, 150)
        const RingGeometry = new THREE.RingGeometry(150, 200, 150)
        const TorusGeometry = new THREE.TorusGeometry(50, 200, 150)
        const SphereGeometry = new THREE.SphereGeometry(200, 50, 50)

        const geos = [PlaneGeometry, CylinderGeometry, BoxGeometry, RingGeometry, TorusGeometry, SphereGeometry]

        this.pointsControl.to(geos[THREE.MathUtils.randInt(0, 5)].attributes.position.array, { min: 1000, max: 3000 })
    }

    protected onRenderer() {
        const time = this.clock.getElapsedTime()
        this.orbit.update()

        this.pointsControl.update(time * 1000)
    }

}
