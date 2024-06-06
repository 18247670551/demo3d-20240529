import * as THREE from "three"
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls"
import ThreeCore from "@/three-widget/ThreeCore"

export default class ThreeProject extends ThreeCore {

    private readonly orbit: OrbitControls

    private readonly curve: THREE.CatmullRomCurve3
    private readonly fireFly: THREE.Mesh
    private pos = 1

    constructor(dom: HTMLElement) {

        super(dom, {
            cameraOptions: {
                fov: 45,
                near: 1,
                far: 1000
            }
        })

        this.camera.position.set(0, 30, 30)
        this.scene.background = new THREE.Color(0x111111)

        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
        this.scene.add(ambientLight)

        this.renderer.shadowMap.enabled = true

        this.orbit = new OrbitControls(this.camera, this.renderer.domElement)

        const axes = new THREE.AxesHelper(20)
        this.scene.add(axes)

        this.curve = this.getCurve()

        this.fireFly = this.addAndGetFireFlyLight()
    }


    protected init() {
        this.addBigBall()
        this.addCurveObj()
        this.addPlane()
    }

    private getCurve() {
        return new THREE.CatmullRomCurve3([
                //起点
                new THREE.Vector3(-10, 0, 10),
                //中间节点
                new THREE.Vector3(-5, 10, -10),
                new THREE.Vector3(2, 5, -5),
                //终点
                new THREE.Vector3(10, 0, 10),
            ],
            true,
        )
    }

    private addAndGetFireFlyLight() {

        const geo = new THREE.SphereGeometry(0.5, 50, 50)
        const mat = new THREE.MeshLambertMaterial({color: 0x00ffff, emissive: 0x00ffff})
        const flayBall = new THREE.Mesh(geo, mat)

        const light = new THREE.PointLight(0x00ffff, 40)
        light.decay = 2 // 沿着光照距离的衰减量 默认值2
        light.distance = 0 // 光源照射的最大距离 默认0无限远
        light.castShadow = true
        light.shadow.radius = 1 // 阴影模糊度
        light.shadow.mapSize.set(512, 512) // 阴影分辨率 默认512
        flayBall.add(light)

        this.scene.add(flayBall)
        flayBall.position.copy(this.curve.getPoint(0))

        return flayBall
    }

    private addBigBall() {
        const geo = new THREE.SphereGeometry(5, 100, 100)
        const mat = new THREE.MeshPhongMaterial({color: 0xffff00})
        const ball = new THREE.Mesh(geo, mat)
        ball.castShadow = true

        this.scene.add(ball)
    }

    // 平面
    private addPlane() {
        const mat = new THREE.MeshStandardMaterial()
        const geo = new THREE.PlaneGeometry(50, 50)
        const plane = new THREE.Mesh(geo, mat)
        plane.rotation.x = -Math.PI / 2
        plane.position.y = -2
        plane.receiveShadow = true

        this.scene.add(plane)
    }

    private addCurveObj() {
        const geo = new THREE.BufferGeometry()
        geo.setFromPoints(this.curve.getSpacedPoints(100))
        const mat = new THREE.LineBasicMaterial({color: new THREE.Color().setHSL(Math.random(), 0.5, 0.5)})
        const curveObject = new THREE.Line(geo, mat)
        this.scene.add(curveObject)
    }


    protected onRenderer() {
        this.orbit.update()

        if (this.pos < 1) {
            this.fireFly.position.copy(this.curve!.getPointAt(this.pos))
            this.pos += 0.001
        } else {
            this.pos = 0
        }
    }


}
