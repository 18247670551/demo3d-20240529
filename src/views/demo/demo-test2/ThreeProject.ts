import * as THREE from "three"
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls"
import ThreeCore from "@/three-widget/ThreeCore"


export default class ThreeProject extends ThreeCore {

    private readonly orbit: OrbitControls
    private readonly curve: THREE.CatmullRomCurve3
    private readonly f18: THREE.Mesh

    private loopTime = 10 * 1000 // loopTime: 循环一圈的时间
    private i = 0

    constructor(dom: HTMLElement) {

        super(dom, {
            cameraOptions: {
                fov: 45,
                near: 0.1,
                far: 100000
            }
        })

        this.scene.background = new THREE.Color(0x000000)

        this.camera.position.set(0, 10000, 20000)

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

        // const axesHelper = new THREE.AxesHelper(10)
        // this.scene.add(axesHelper)


        const curve = new THREE.CatmullRomCurve3([
            new THREE.Vector3(-1000, -5000, -5000),
            new THREE.Vector3(1000, -5000, 0),
            new THREE.Vector3(1800, 800, 1000),
            new THREE.Vector3(800, 5000, 5000),
            new THREE.Vector3(0, 0, 10000)
        ])
        this.curve = curve
        const points = curve.getPoints(100)
        const geometry = new THREE.BufferGeometry()
        geometry.setFromPoints(points)
        const material = new THREE.LineBasicMaterial({
            color: "#4488ff"
        })
        const line = new THREE.Line(geometry, material)
        this.scene.add(line)

        //管道体
        const tubeGeometry = new THREE.TubeGeometry(curve, 100, 500, 30)
        const tubeMesh = new THREE.Mesh(tubeGeometry, new THREE.MeshBasicMaterial({
            color: "#00aa00",
            side: THREE.DoubleSide,
            wireframe: true
        }))
        this.scene.add(tubeMesh)

        const f18 = new THREE.Mesh(new THREE.BoxGeometry(800, 200, 400), new THREE.MeshBasicMaterial({color: 0xff0000}))
        this.f18 = f18
        this.scene.add(f18)

    }

    protected changeLookAt(t: number) {
        // 当前点在线条上的位置
        const position = this.curve.getPointAt(t)
        const nPos = new THREE.Vector3(position.x, position.y - 100, position.z)
        this.f18.position.copy(nPos)
        // 返回点t在曲线上位置切线向量
        const tangent = this.curve.getTangentAt(t)
        // 位置向量和切线向量相加即为所需朝向的点向量
        const lookAtVec = tangent.add(nPos)
        this.f18.lookAt(lookAtVec)

        if (t > 0.03) {
            const pos = this.curve.getPointAt(t - 0.03)
            this.camera.position.copy(pos)
            this.camera.lookAt(position)
        }
    }


    protected init() {
    }


    protected onRenderer() {
        this.orbit.update()

        let time = Date.now();
        let t = (time % this.loopTime) / this.loopTime // 计算当前时间进度百分比
        setTimeout(() => {
            this.changeLookAt(t)
        }, 2000)

    }

}