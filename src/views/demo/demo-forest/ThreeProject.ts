import * as THREE from "three"
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls"
import ThreeCore from "@/three-widget/ThreeCore"
import {getCubeTextureLoader, getTextureLoader} from "@/three-widget/loader/ThreeLoader"


import tree1Pic from "/public/demo/forest/tree1.png"
import tree2Pic from "/public/demo/forest/tree2.png"
import tree3Pic from "/public/demo/forest/tree3.png"
import tree4Pic from "/public/demo/forest/tree4.png"
import tree5Pic from "/public/demo/forest/tree5.png"
import tree6Pic from "/public/demo/forest/tree6.png"
import tree7Pic from "/public/demo/forest/tree7.png"



export default class ThreeProject extends ThreeCore {

    private readonly orbit: OrbitControls

    constructor(dom: HTMLElement) {

        super(dom, {
            cameraOptions: {
                fov: 60,
                near: 0.1,
                far: 100000
            }
        })


        this.scene.background = new THREE.Color(0x062469) // 深蓝色

        this.camera.position.set(0, 200, 400)

        const ambientLight = new THREE.AmbientLight(0xffffff, 4)
        this.scene.add(ambientLight)

        this.orbit = new OrbitControls(this.camera, this.renderer.domElement)
        this.orbit.target.y = 100
        this.orbit.update()

    }

    init() {
        this.addSky()
        this.addGround()
        this.addTrees()
    }

    private addSky() {
        getCubeTextureLoader().setPath('/demo/forest/skybox/').load(
            ['left.jpg', 'right.jpg', 'top.jpg', 'bottom.jpg', 'front.jpg', 'back.jpg'],
            texture => {
                this.scene.background = texture
            })
    }

    private addGround() {
        const planeGeometry = new THREE.PlaneGeometry(3000, 3000)
        const texture = getTextureLoader().load("/demo/forest/grass.jpg")
        texture.wrapS = texture.wrapT = THREE.RepeatWrapping
        texture.repeat.set(60, 60)
        const material = new THREE.MeshBasicMaterial({
            color: 0x14A88A,
            side: THREE.DoubleSide,
            map: texture
        })
        const plane = new THREE.Mesh(planeGeometry, material)
        plane.rotateX(Math.PI / 2)
        this.scene.add(plane)
    }

    private addTrees() {

        const matParams = [
            {color: "#929f40", map: tree1Pic},
            {color: "#e1e091", map: tree2Pic},
            {color: "#00cc22", map: tree3Pic},
            {color: "#014301", map: tree4Pic},
            {color: "#e19363", map: tree5Pic},
            {color: "#717e05", map: tree6Pic},
            {color: "#fd693b", map: tree7Pic},
        ]

        const mats = matParams.map(param =>
            new THREE.SpriteMaterial({
                transparent: true,
                color: param.color,
                map: getTextureLoader().load(param.map)
            })
        )

        const group = new THREE.Group()

        for (let i = 0; i < 500; i++) {

            const tree = new THREE.Sprite(mats[THREE.MathUtils.randInt(0, mats.length - 1)])

            const x = THREE.MathUtils.randFloatSpread(2000)
            const z = THREE.MathUtils.randFloatSpread(2000)
            tree.position.set(x, 50, z)
            tree.scale.set(100, 100, 1)

            group.add(tree)
        }

        this.scene.add(group)
    }

    onRenderer() {
        this.orbit.update()
    }

}
