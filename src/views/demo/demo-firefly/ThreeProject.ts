import * as THREE from "three"
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls"
import {GUI} from "three/examples/jsm/libs/lil-gui.module.min"
import ThreeCore from "@/three-widget/ThreeCore"


export default class ThreeProject extends ThreeCore{

    private readonly orbit: OrbitControls

    private readonly fireFlyLight: THREE.PointLight
    private readonly fireFly: THREE.Mesh

    constructor(dom: HTMLElement) {

        super(dom, {
            cameraOptions: {
                fov: 75,
                near: 0.1,
                far: 1000
            }
        })

        this.scene.background = new THREE.Color(0x111111)

        this.camera.position.set(-7, 4, 4)

        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
        this.scene.add(ambientLight)

        this.renderer.shadowMap.enabled = true

        this.orbit = new OrbitControls(this.camera, this.renderer.domElement)


        const axesHelper = new THREE.AxesHelper(20)
        this.scene.add(axesHelper)



        this.addBigBall()
        this.addPlane()
        this.fireFlyLight = this.addAndGetFireFlyLight()
        this.fireFly = this.addAndGetFireFly()

        this.addGUI()
    }

    protected init(){}

    protected onRenderer() {
        this.orbit.update()
        this.flyAnimate()
    }

    // 跳动飞行的小球
    private addAndGetFireFly() {
        const fireFly = new THREE.Mesh(
            new THREE.SphereGeometry(0.3),
            new THREE.MeshBasicMaterial({color: 0x00ffff})
        )

        fireFly.position.set(3, 3, 3)
        fireFly.add(this.fireFlyLight)
        this.scene.add(fireFly)
        return fireFly
    }


    // 大球
    private addBigBall() {
        const standardMaterial = new THREE.MeshStandardMaterial()
        const ball = new THREE.Mesh(new THREE.SphereGeometry(1), standardMaterial)
        ball.castShadow = true

        this.scene.add(ball)
    }

    // 平面
    private addPlane() {
        const mat = new THREE.MeshStandardMaterial()
        const geo = new THREE.PlaneGeometry(50, 50)
        const plane = new THREE.Mesh(geo, mat)
        plane.rotation.x = -Math.PI / 2
        plane.position.y = -1
        plane.receiveShadow = true

        this.scene.add(plane)
    }

    // 跳动飞行的小球上的点光源
    private addAndGetFireFlyLight() {
        const light = new THREE.PointLight(0x00ffff, 100)
        light.decay = 3 // 沿着光照距离的衰减量 默认值2
        light.distance = 0 // 光源照射的最大距离 默认0无限远
        light.castShadow = true
        light.shadow.radius = 1 // 阴影模糊度
        light.shadow.mapSize.set(512, 512) // 阴影分辨率 默认512
        this.scene.add(light)
        return light
    }


    private addGUI() {
        const gui = new GUI()
        gui.add(this.fireFlyLight, "decay", 0, 10).step(0.1).name("萤火虫光源光衰")
    }


    private flyAnimate() {
        const time = this.clock.getElapsedTime()

        this.fireFly.position.x = Math.sin(time) * 3
        this.fireFly.position.z = Math.cos(time) * 3
        this.fireFly.position.y = 2 + Math.sin(time * 5)
    }

}
