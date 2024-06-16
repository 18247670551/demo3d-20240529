import * as THREE from "three"
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls"
import ThreeCore from "@/three-widget/ThreeCore"


export default class ThreeProject extends ThreeCore{

    private readonly orbit: OrbitControls
    private readonly earth: THREE.Mesh
    private readonly moon: THREE.Mesh
    private readonly clouds: THREE.Mesh
    private readonly curve: THREE.EllipseCurve
    private pos = 0

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

        this.camera.position.set(0, 10, 40)

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
            positions[i*3] = Math.random() * 200 - 100
            positions[i*3 + 1] = Math.random() * 200 - 100
            positions[i*3 + 2] = Math.random() * 200 - 100
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
            map: this.textureLoader.load("/demo/earthmoon2/circle.png")
        })

        const stars = new THREE.Points(starGeo, starMat)
        this.scene.add(stars)



        const earth = new THREE.Mesh(new THREE.SphereGeometry(10, 64, 64), new THREE.MeshStandardMaterial({
            map: this.textureLoader.load('/demo/earthmoon2/earth_basic.jpeg'),
            normalMap: this.textureLoader.load('/demo/earthmoon2/earth_normal.jpeg'),
            roughnessMap: this.textureLoader.load('/demo/earthmoon2/earth_rough.jpeg'),
            normalScale: new THREE.Vector2(10, 10),
            metalness: .1
        }))
        earth.rotation.y = -Math.PI
        this.scene.add(earth)
        this.earth = earth



        const clouds = new THREE.Mesh(new THREE.SphereGeometry(10.6, 64, 64), new THREE.MeshLambertMaterial({
            alphaMap: this.textureLoader.load('/demo/earthmoon2/clouds.jpeg'),
            transparent: true,
            opacity: .4,
            depthTest: true
        }))
        this.scene.add(clouds)
        this.clouds = clouds



        const moon = new THREE.Mesh(new THREE.SphereGeometry(2, 32, 32), new THREE.MeshStandardMaterial({
            map: this.textureLoader.load('/demo/earthmoon2/moon_basic.jpeg'),
            normalMap: this.textureLoader.load('/demo/earthmoon2/moon_normal.jpeg'),
            roughnessMap: this.textureLoader.load('/demo/earthmoon2/moon_roughness.jpeg'),
            normalScale: new THREE.Vector2(10, 10),
            metalness: .1
        }))
        moon.position.set(2, 0, 0)
        moon.scale.set(0.5, 0.5, 0.5)
        this.scene.add(moon)
        this.moon = moon

        // 月球轨道
        this.curve = new THREE.EllipseCurve(0,  0, 20, 20, 0,  2 * Math.PI, true, 0)
    }

    init(){}

    onRenderer() {
        const elapsedTime = this.clock.getElapsedTime()
        this.orbit.update()

        this.earth.rotation.y += 0.002
        this.clouds.rotation.y += 0.003
        this.clouds.rotation.x += 0.002

        // 公转
        if (this.pos < 1) {
            this.moon.position.x = this.curve.getPointAt(this.pos).x
            this.moon.position.y = 0
            this.moon.position.z = this.curve.getPointAt(this.pos).y
            this.pos += 0.001
        } else {
            this.pos = 0
        }

    }

}
