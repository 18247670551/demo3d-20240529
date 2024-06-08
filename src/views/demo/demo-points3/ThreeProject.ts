import * as THREE from "three"
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls"
import ThreeCore from "@/three-widget/ThreeCore"


export default class ThreeProject extends ThreeCore {

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

        this.camera.position.set(0, 10, 6)

        const ambientLight = new THREE.AmbientLight(0xffffff, 4)
        this.scene.add(ambientLight)

        this.renderer.shadowMap.enabled = true

        this.orbit = new OrbitControls(this.camera, this.renderer.domElement)
    }

    protected init() {
        this.addPoints()
    }

    protected onRenderer() {
        this.orbit.update()
    }

    private addPoints() {

        const params = {
            count: 10000,
            size: 0.1,
            radius: 7, //银河系半径
            branch: 5, //旋臂数量
            rotateScale: 0.4, //旋臂弯曲度 0-1, 越大越弯
            color: "#ff6030",
            endColor: "#1b3984",
        }

        const geo = new THREE.BufferGeometry()
        const positions = new Float32Array(params.count * 3)
        const colors = new Float32Array(params.count * 3)

        for (let i = 0; i < params.count; i++) {
            // 当前的点应该在哪一条分支的角度上
            const branchAngel = (i % params.branch) * ((2 * Math.PI) / params.branch)
            // 当前点距离圆心的距离
            const distance = Math.random() * params.radius * Math.pow(Math.random(), 3)

            const randomX = (Math.pow(Math.random() * 2 - 1, 3) * (params.radius - distance)) / 5
            const randomY = (Math.pow(Math.random() * 2 - 1, 3) * (params.radius - distance)) / 5
            const randomZ = (Math.pow(Math.random() * 2 - 1, 3) * (params.radius - distance)) / 5

            positions[i * 3] = Math.cos(branchAngel + distance * params.rotateScale) * distance + randomX
            positions[i * 3 + 1] = randomY
            positions[i * 3 + 2] = Math.sin(branchAngel + distance * params.rotateScale) * distance + randomZ

            // 混合颜色，形成渐变色
            const mixColor = new THREE.Color(params.color)
            mixColor.lerp(new THREE.Color(params.endColor), distance / params.radius)

            colors[i * 3] = mixColor.r
            colors[i * 3 + 1] = mixColor.g
            colors[i * 3 + 2] = mixColor.b
        }

        geo.setAttribute("position", new THREE.BufferAttribute(positions, 3))
        geo.setAttribute("color", new THREE.BufferAttribute(colors, 3))


        const texture = new THREE.TextureLoader().load('/demo/points3/smoke1.png')
        const pointsMat = new THREE.PointsMaterial({
            map: texture,
            alphaMap: texture,
            depthWrite: false, // 叠加时使用
            blending: THREE.AdditiveBlending, // 例子重合后颜色叠加
            vertexColors: true,
            transparent: true, // 允许透明
            size: params.size,
            sizeAttenuation: true // 相机深度而衰减
        })

        const points = new THREE.Points(geo, pointsMat)
        this.scene.add(points)

        return points
    }

}
