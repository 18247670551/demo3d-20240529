import * as THREE from "three"
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls"
import ThreeCore from "@/three-widget/ThreeCore"
import {getTextureLoader} from "@/three-widget/loader/ThreeLoader"


export default class ThreeProject extends ThreeCore{

    private readonly orbit: OrbitControls


    constructor(dom: HTMLElement) {

        super(dom, {
            cameraOptions: {
                fov: 75,
                near: 0.1,
                far: 10000
            }
        })

        this.scene.background = new THREE.Color(0x000000)

        this.camera.position.set(0,0,10)

        const ambientLight = new THREE.AmbientLight(0xffffff, 4)
        this.scene.add(ambientLight)

        this.renderer.shadowMap.enabled = true

        this.orbit = new OrbitControls(this.camera, this.renderer.domElement)


        const axesHelper = new THREE.AxesHelper(20)
        this.scene.add(axesHelper)

        const sphereGeo = new THREE.SphereGeometry(5, 50, 50)

        const texture = getTextureLoader().load('/demo/my/wash/smoke1.png')
        const pointsMat = new THREE.PointsMaterial({
            map: texture,
            alphaMap: texture,
            depthWrite: false, // 叠加时使用
            blending: THREE.AdditiveBlending, // 例子重合后颜色叠加
            transparent: true, // 允许透明
            size: 0.1,
            color: 0xfff000,
            sizeAttenuation: true // 相机深度而衰减
        })

        const points = new THREE.Points(sphereGeo, pointsMat)
        this.scene.add(points)

    }

    protected init(){}

    protected onRenderer() {
        this.orbit.update()
    }

}
