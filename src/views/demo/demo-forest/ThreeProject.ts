import * as THREE from "three"
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls"
import ThreeCore from "@/three-widget/ThreeCore"


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
        const loader = new THREE.CubeTextureLoader()
        loader.setPath('/demo/forest/skybox/').load(
            ['left.jpg', 'right.jpg', 'top.jpg', 'bottom.jpg', 'front.jpg', 'back.jpg'],
            texture => {
                this.scene.background = texture
            })
    }

    private addGround() {
        const planeGeometry = new THREE.PlaneGeometry(3000, 3000)
        const texture = this.textureLoader.load("/demo/forest/grass.jpg")
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
        const tree1Mat = new THREE.SpriteMaterial({
            transparent: true,
            color: 0x929f40,
            map: this.textureLoader.load("/demo/forest/tree1.png")
        })

        const tree2Mat = new THREE.SpriteMaterial({
            transparent: true,
            color: 0xe1e091,
            map: this.textureLoader.load("/demo/forest/tree2.png")
        })

        const tree3Mat = new THREE.SpriteMaterial({
            transparent: true,
            color: 0x00cc22,
            map: this.textureLoader.load("/demo/forest/tree3.png")
        })

        const tree4Mat = new THREE.SpriteMaterial({
            transparent: true,
            color: 0xe14172,
            map: this.textureLoader.load("/demo/forest/tree4.png")
        })

        const tree5Mat = new THREE.SpriteMaterial({
            transparent: true,
            color: 0xe19363,
            map: this.textureLoader.load("/demo/forest/tree5.png")
        })

        const group = new THREE.Group()

        let random = 0

        for (let i = 0; i < 500; i++) {

            random = THREE.MathUtils.randInt(0, 9)

            let tree

            switch (random) {
                case 0:
                    tree = new THREE.Sprite(tree1Mat)
                    break;
                case 1:
                    tree = new THREE.Sprite(tree1Mat)
                    break;
                case 2:
                    tree = new THREE.Sprite(tree2Mat)
                    break;
                case 3:
                    tree = new THREE.Sprite(tree2Mat)
                    break;
                case 4:
                    tree = new THREE.Sprite(tree3Mat)
                    break;
                case 5:
                    tree = new THREE.Sprite(tree4Mat)
                    break;
                case 6:
                    tree = new THREE.Sprite(tree5Mat)
                    break;
                case 7:
                    tree = new THREE.Sprite(tree1Mat)
                    break;
                case 8:
                    tree = new THREE.Sprite(tree2Mat)
                    break;
                case 9:
                    tree = new THREE.Sprite(tree3Mat)
                    break;
                default:
                    throw new Error("不可能到达的错误")
            }

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
