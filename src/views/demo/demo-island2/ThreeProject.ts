import * as THREE from "three"
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls"
import ThreeCore from "@/three-widget/ThreeCore"
import {RGBELoader} from "three/examples/jsm/loaders/RGBELoader"
import {Water} from "three/examples/jsm/objects/Water2"
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader"


export default class ThreeProject extends ThreeCore{

    private readonly orbit: OrbitControls

    constructor(dom: HTMLElement) {

        super(dom, {
            cameraOptions: {
                fov: 75,
                near: 0.1,
                far: 2000
            }
        })

        this.camera.position.set(0, 1, 3)

        const ambientLight = new THREE.AmbientLight(0xffffff, 2)
        this.scene.add(ambientLight)

        this.renderer.shadowMap.enabled = true
        this.orbit = new OrbitControls(this.camera, this.renderer.domElement)
        this.orbit.target.y = 0.4

    }

    protected init(){
        this.addSkyBox()
        this.addWater()
        this.addIsland()
    }

    protected onRenderer() {
        this.orbit.update()

    }


    private addSkyBox(){
        // 创建一个半径为1，经纬度分段数位20的球
        const boxBufferGeometry = new THREE.SphereGeometry(500, 50, 50)
        // 纹理加载器
        const regbeLoader = new RGBELoader()
        regbeLoader.loadAsync('/demo/island2/050.hdr').then(loader => {
            loader.mapping = THREE.EquirectangularReflectionMapping
            this.scene.background = loader
            this.scene.environment = loader
        })
        const cloudLoader = new THREE.TextureLoader()
        const texture = cloudLoader.load('/demo/island2/sky.jpg')
        const cloudMaterial = new THREE.MeshBasicMaterial({
            map: texture
        })
        const mesh = new THREE.Mesh(boxBufferGeometry, cloudMaterial)
        mesh.geometry.scale(1, -1, 1)
        // 将物体加入到场景
        this.scene.add(mesh)

        const videoELem = document.createElement("video")
        videoELem.src = "/demo/island2/sky.mp4"
        videoELem.loop = true
        //创建视频纹理
        window.addEventListener("click", () => {
            if(videoELem.paused){
                videoELem.play()
                cloudMaterial.map = new THREE.VideoTexture(videoELem)
                cloudMaterial.map.needsUpdate = true
                //scene.background = textureLoader
            }
        })
    }

    private addWater(){
        const circleGeometry = new THREE.CircleGeometry(400, 100)
        const textureLoader = new THREE.TextureLoader()
        const water = new Water(circleGeometry, {
            textureWidth: 1024,
            textureHeight: 1024,
            color: 0xeeeeff,
            flowDirection: new THREE.Vector2(1, 1),
            scale: 1,
            flowMap:textureLoader.load("/demo/island2/Water_1_M_Flow.jpg"),
            normalMap0: textureLoader.load("/demo/island2/Water_1_M_Normal.jpg"),
            normalMap1: textureLoader.load("/demo/island2/Water_2_M_Normal.jpg"),
        })
        water.rotation.x = -Math.PI / 2
        this.scene.add(water)
    }

    private addIsland(){
        const loader = new GLTFLoader()
        loader.load('/demo/island2/island.glb', gltf => {
            gltf.scene.position.y = 0.01
            this.scene.add(gltf.scene)
        })
    }


}
