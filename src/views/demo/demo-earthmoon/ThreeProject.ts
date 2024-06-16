import * as THREE from "three"
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls"
import {gsap} from "gsap"
import ThreeCore from "@/three-widget/ThreeCore"


export default class ThreeProject extends ThreeCore{

    private readonly orbit: OrbitControls

    private time = {value: 0}
    readonly moon: THREE.Mesh

    constructor(dom: HTMLElement) {

        super(dom, {
            cameraOptions: {
                fov: 75,
                near: 0.1,
                far: 100000
            }
        })

        // 星空背景色
        this.scene.background = new THREE.Color(0x030311)

        this.camera.position.set(0, 50, 300)

        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6)
        this.scene.add(ambientLight)

        const directionalLight1 = new THREE.DirectionalLight(0xffffff, 2)
        directionalLight1.position.set(0, 500, 500)
        this.scene.add(directionalLight1)


        this.orbit = new OrbitControls(this.camera, this.renderer.domElement)
        this.orbit.autoRotate = true
        this.orbit.autoRotateSpeed = 0.5


        this.addStars()
        this.addEarth()
        this.addMoonRing()
        this.moon = this.addAndGetMoon()


    }

    init(){}

    onRenderer() {
        this.orbit.update()
        this.moonAnimate()
    }

    private addStars() {
        const starsCount = 500
        const positions = []
        for (let i = 0; i < starsCount; i++) {
            positions[i*3] = Math.random() * 800 - 400
            positions[i*3 + 1] = Math.random() * 800 - 400
            positions[i*3 + 2] = Math.random() * 800 - 400
        }

        const geo = new THREE.BufferGeometry()

        geo.setAttribute("position", new THREE.BufferAttribute(new Float32Array(positions), 3))

        const mat = new THREE.PointsMaterial({
            size: 2,
            sizeAttenuation: true,   //尺寸衰减
            color: 0x4d76cf,
            transparent: true,
            opacity: 1,
            map: this.textureLoader.load("/demo/earthmoon/circle.png")
        })

        const stars = new THREE.Points(geo, mat)

        this.scene.add(stars)
    }

    private addEarth() {
        const geo = new THREE.SphereGeometry(50, 32, 32)
        const mat = new THREE.MeshPhongMaterial({
            map: this.textureLoader.load("/demo/earthmoon/earth_atmos.jpg"),
            normalMap: this.textureLoader.load("/demo/earthmoon/earth_normal.jpg"),
            specularMap: this.textureLoader.load("/demo/earthmoon/earth_specular.jpg"),
        })
        const earth = new THREE.Mesh(geo, mat)
        this.scene.add(earth)
    }

    private addMoonRing() {
        const geo = new THREE.RingGeometry(95, 105, 64)

        const texture = this.textureLoader.load("/demo/earthmoon/moon_ring.png")

        const mat = new THREE.MeshBasicMaterial({
            map: texture,
            transparent: true,
            blending: THREE.AdditiveBlending,
            side: THREE.DoubleSide,
            depthWrite: false,
            opacity: 0.5,
        })

        const moonRing = new THREE.Mesh(geo, mat)
        moonRing.rotation.x = -Math.PI / 2
        this.scene.add(moonRing)
    }

    private addAndGetMoon() {
        const geo = new THREE.SphereGeometry(5, 32, 32)
        const tex = this.textureLoader.load('/demo/earthmoon/moon.jpg')
        let mat = new THREE.MeshStandardMaterial({
            map: tex,
            emissive: 0xffffff,
            emissiveMap: tex
        })
        const moon = new THREE.Mesh(geo, mat)
        moon.position.set(100, 0, 0)
        this.scene.add(moon)
        return moon
    }

    moonAnimate = () => {
        gsap.to(this.time, {
            value:1,
            duration: 10,
            repeat:-1,
            ease:'linear',
            onUpdate:() => {
                this.moon.position.x = 100 * Math.cos(this.time.value * Math.PI * 2)
                this.moon.position.z = 100 * Math.sin(this.time.value * Math.PI * 2)
                this.moon.position.y = 0
            }
        })
    }

}
