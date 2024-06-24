import * as THREE from "three"
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls"
import ThreeCore from "@/three-widget/ThreeCore"
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader"
import {Water} from "three/examples/jsm/objects/Water2"
import {RGBELoader} from "three/examples/jsm/loaders/RGBELoader"
import {getTextureLoader} from "@/three-widget/loader/ThreeLoader"

export default class ThreeProject extends ThreeCore {

    private readonly orbit: OrbitControls

    constructor(dom: HTMLElement) {

        super(dom, {
            cameraOptions: {
                fov: 45,
                near: 0.1,
                far: 30000
            }
        })

        this.camera.position.set(0, 140, 550)

        const ambientLight = new THREE.AmbientLight(0xffffff, 1)
        this.scene.add(ambientLight)

        const directionalLight1 = new THREE.DirectionalLight(0xffffff, 3)
        directionalLight1.position.set(0, 1000, 2000)
        this.scene.add(directionalLight1)

        const directionalLight2 = new THREE.DirectionalLight(0xffffff, 2)
        directionalLight2.position.set(0, 1000, -2000)
        this.scene.add(directionalLight2)

        this.orbit = new OrbitControls(this.camera, this.renderer.domElement)
        this.orbit.target.y = 100
        this.orbit.update()

    }


    protected init() {
        this.addSkyBox()
        this.addIsland()
        this.addWater()
    }


    protected onRenderer() {
        this.orbit.update()
    }

    private addSkyBox() {
        const rgbeLoader = new RGBELoader()
        rgbeLoader.load("/demo/model-island3/animestyled_hdr.hdr", texture => {
            texture.mapping = THREE.EquirectangularReflectionMapping
            this.scene.background = texture
        })
    }

    private addIsland() {
        const loader = new GLTFLoader()
        loader.load("/demo/model-island3/pirate_island.glb", (gltf) => {
            const obj = gltf.scene
            obj.scale.set(10, 10, 10)
            obj.position.y = -25
            this.scene.add(obj)
        })
    }

    private addWater() {
        const circleGeometry = new THREE.CircleGeometry(2000, 30)
        const waterMesh = new Water(circleGeometry, {
            textureWidth: 1024,
            textureHeight: 1024,
            color: 0x00719e,
            flowDirection: new THREE.Vector2(1, 1), //流动方向
            scale: 2,
            flowMap: getTextureLoader().load("/demo/model-island3/Water_1_M_Flow.jpg"),
            normalMap0: getTextureLoader().load("/demo/model-island3/Water_1_M_Normal.jpg"),
            normalMap1: getTextureLoader().load("/demo/model-island3/Water_2_M_Normal.jpg"),
        })
        waterMesh.rotation.x = -Math.PI / 2
        this.scene.add(waterMesh)
    }


}
