import * as THREE from "three"
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls"
import ThreeCore from "@/three-widget/ThreeCore"


export default class ThreeProject extends ThreeCore {

    private readonly orbit: OrbitControls


    private readonly points: THREE.Points
    private readonly pointCount = 3000
    private readonly range = 160


    constructor(dom: HTMLElement) {

        super(dom, {
            cameraOptions: {
                fov: 45,
                near: 0.1,
                far: 1000
            }
        })

        this.scene.background = new THREE.Color(0x333333)

        this.camera.position.set(0, 0, 100)

        const ambientLight = new THREE.AmbientLight(0xffffff, 4)
        this.scene.add(ambientLight)

        this.renderer.shadowMap.enabled = true

        this.orbit = new OrbitControls(this.camera, this.renderer.domElement)
        this.orbit.target.y = 40

        const axes = new THREE.AxesHelper(20)
        this.scene.add(axes)


        this.points = this.addAndGerPoints()
    }

    protected init() {
    }

    protected onRenderer() {
        this.orbit.update()

        this.rainAnimation()
    }

    private rainAnimation () {

        const positions = this.points.geometry.attributes.position.array

        // 更新粒子位置
        for (let i = 0; i < this.pointCount; i++) {
            if (positions[i * 3 + 1] < 0) {
                positions[i * 3 + 1] = Math.random() * this.range * 1.5
            } else {
                positions[i * 3 + 1] -= 0.2
            }
        }
        this.points.geometry.attributes.position.needsUpdate = true
    }

    private addAndGerPoints() {
        const textureLoader = new THREE.TextureLoader()
        const loadTexture = textureLoader.load("/demo/rain0/rain.png")
        // 创建几何体
        const geom = new THREE.BufferGeometry()

        const properties = {
            size: {
                name: 'size',
                value: 4,
                min: 0,
                max: 20,
                step: 0.1
            },
            opacity: {
                name: 'opacity',
                value: 0.6,
                min: 0,
                max: 1,
                step: 0.1
            },
            transparent: true,
            sizeAttenuation: true,
            color: '#ccffcc'
        }
        const material = new THREE.PointsMaterial({
            map: loadTexture,
            size: properties.size.value,
            transparent: properties.transparent,
            opacity: properties.opacity.value,
            sizeAttenuation: properties.sizeAttenuation,
            color: properties.color,
            blending: THREE.AdditiveBlending,
            depthTest: false // 解决透明度问题
        })
        const range = this.range
        const positions = new Float32Array(this.pointCount)
        for (let i = 0; i < this.pointCount; i++) {
            positions[i * 3] = Math.random() * range - range / 2
            positions[i * 3 + 1] = Math.random() * range * 1.5
            positions[i * 3 + 2] = Math.random() * range - range / 2
        }
        geom.setAttribute("position", new THREE.BufferAttribute(positions, 3))
        // 创建粒子系统对象
        const points = new THREE.Points(geom, material)

        // 将粒子系统对象添加到场景
        this.scene.add(points)

        return points
    }

}
