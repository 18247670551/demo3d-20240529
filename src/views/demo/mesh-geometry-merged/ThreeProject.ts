import * as THREE from "three"
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls"
import ThreeCore from "@/three-widget/ThreeCore"
import * as BufferGeometryUtils from 'three/examples/jsm/utils/BufferGeometryUtils.js'


export default class ThreeProject extends ThreeCore {

    private readonly orbit: OrbitControls


    constructor(dom: HTMLElement) {

        super(dom, {
            cameraOptions: {
                fov: 45,
                near: 0.01,
                far: 10000
            }
        })

        this.scene.background = new THREE.Color(0x000000)

        this.camera.position.set(0, 300, 1000)

        const ambientLight = new THREE.AmbientLight(0xffffff, 1)
        this.scene.add(ambientLight)


        const directionalLight1 = new THREE.DirectionalLight(0xffffff, 1)
        directionalLight1.position.set(0, 5000, 5000)
        directionalLight1.castShadow = true
        this.scene.add(directionalLight1)

        const directionalLight2 = new THREE.DirectionalLight(0xffffff, 2)
        directionalLight2.position.set(0, 5000, -5000)
        this.scene.add(directionalLight2)

        this.orbit = new OrbitControls(this.camera, this.renderer.domElement)

        const axesHelper = new THREE.AxesHelper(200)
        this.scene.add(axesHelper)


        // 创建两个几何体
        const geometry1 = new THREE.BoxGeometry(500, 200, 400)
        const geometry2 = new THREE.SphereGeometry(100)

        // 设置几何体位置
        geometry2.translate(300, 200, 200)

        // 合并几何体
        const mergedGeometry = BufferGeometryUtils.mergeGeometries([
            geometry1.toNonIndexed(), // 转换为非索引格式
            geometry2.toNonIndexed()
        ])

        const material = new THREE.MeshStandardMaterial({color: 0xffff00})
        const mesh = new THREE.Mesh(mergedGeometry, material)

        this.scene.add(mesh)
    }

    protected init() {
    }

    protected onRenderer() {
        this.orbit.update()
    }

}