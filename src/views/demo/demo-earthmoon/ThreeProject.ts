import * as THREE from "three"
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls"
import ThreeCore from "@/three-widget/ThreeCore"


export default class ThreeProject extends ThreeCore {

    private readonly orbit: OrbitControls
    private readonly earth: THREE.Mesh
    private readonly moon: THREE.Mesh
    private readonly clouds: THREE.Mesh
    private readonly curve: THREE.EllipseCurve


    private earthRadius = 10 // 月球公转半径
    private earthLoopTime = 15 * 1000 // 地球自转一圈的时间

    private cloudsLoopRadius = 11 // 云层半径
    private cloudsLoopXTime = 24 * 1000 // 云层 X轴 转一圈
    private cloudsLoopYTime = 30 * 1000 // 云层 Y轴 转一圈

    private moonLoopTime = 20 * 1000 // 月球公转
    private moonRadius = 4 // 月球公转半径
    private moonLoopRadius = 40 // 月球公转半径


    constructor(dom: HTMLElement) {

        super(dom, {
            cameraOptions: {
                fov: 75,
                near: 0.1,
                far: 1000
            }
        })

        // 星空背景色
        this.scene.background = new THREE.Color(0x030311)

        this.camera.position.set(0, 20, 50)

        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
        this.scene.add(ambientLight)

        const directionalLight1 = new THREE.DirectionalLight(0xffffff, 2)
        directionalLight1.position.set(0, 50, 50)
        this.scene.add(directionalLight1)

        this.orbit = new OrbitControls(this.camera, this.renderer.domElement)
        this.orbit.autoRotate = true
        this.orbit.autoRotateSpeed = 0.3


        const starsCount = 500
        const positions = []
        for (let i = 0; i < starsCount; i++) {
            positions[i * 3] = Math.random() * 200 - 100
            positions[i * 3 + 1] = Math.random() * 200 - 100
            positions[i * 3 + 2] = Math.random() * 200 - 100
        }

        const starGeo = new THREE.BufferGeometry()
        starGeo.setAttribute("position", new THREE.BufferAttribute(new Float32Array(positions), 3))
        starGeo.attributes.position.needsUpdate = true

        const starMat = new THREE.PointsMaterial({
            size: 0.5,
            sizeAttenuation: true,   //尺寸衰减
            color: 0x4d76cf,
            transparent: true,
            opacity: 1,
            map: this.textureLoader.load("/demo/earthmoon/circle.png")
        })

        const stars = new THREE.Points(starGeo, starMat)
        this.scene.add(stars)


        const earth = new THREE.Mesh(
            new THREE.SphereGeometry(this.earthRadius, 64, 64),
            new THREE.MeshStandardMaterial({
                map: this.textureLoader.load('/demo/earthmoon/earth_basic.jpeg'),
                normalMap: this.textureLoader.load('/demo/earthmoon/earth_normal.jpeg'),
                roughnessMap: this.textureLoader.load('/demo/earthmoon/earth_rough.jpeg'),
                normalScale: new THREE.Vector2(10, 10),
                metalness: .1
            })
        )
        earth.rotation.y = -Math.PI
        this.scene.add(earth)
        this.earth = earth


        const clouds = new THREE.Mesh(new THREE.SphereGeometry(this.cloudsLoopRadius, 64, 64), new THREE.MeshLambertMaterial({
            alphaMap: this.textureLoader.load('/demo/earthmoon/clouds.jpeg'),
            transparent: true,
            opacity: .4,
            depthTest: true
        }))
        this.scene.add(clouds)
        this.clouds = clouds


        const moon = new THREE.Mesh(new THREE.SphereGeometry(this.moonRadius, 32, 32), new THREE.MeshStandardMaterial({
            map: this.textureLoader.load('/demo/earthmoon/moon_basic.jpeg'),
            normalMap: this.textureLoader.load('/demo/earthmoon/moon_normal.jpeg'),
            roughnessMap: this.textureLoader.load('/demo/earthmoon/moon_roughness.jpeg'),
            normalScale: new THREE.Vector2(10, 10),
            metalness: .1
        }))
        moon.position.set(2, 0, 0)
        moon.scale.set(0.5, 0.5, 0.5)
        this.scene.add(moon)
        this.moon = moon

        // 月球轨道
        this.curve = new THREE.EllipseCurve(0, 0, this.moonLoopRadius, this.moonLoopRadius, 0, 2 * Math.PI, true, 0)

    }

    init() {
    }

    onRenderer() {
        this.orbit.update()

        const time = Date.now()

        this.earth.rotation.y = Math.PI * 2 * ((time % this.earthLoopTime) / this.earthLoopTime)
        this.clouds.rotation.x = Math.PI * 2 * ((time % this.cloudsLoopXTime) / this.cloudsLoopXTime)
        this.clouds.rotation.y = Math.PI * 2 * ((time % this.cloudsLoopYTime) / this.cloudsLoopYTime)

        const temp = this.curve.getPointAt((time % this.moonLoopTime) / this.moonLoopTime)
        this.moon.position.set(temp.x, 0, temp.y)

    }

}
