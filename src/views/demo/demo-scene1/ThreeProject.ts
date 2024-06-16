import * as THREE from "three"
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls"
import ThreeCore from "@/three-widget/ThreeCore"
import licensePic from "./texture/license.png"
import grassPic from "./texture/grass.jpg"
import roadPic from "./texture/road.jpg"


export default class ThreeProject extends ThreeCore {

    private readonly orbit: OrbitControls

    constructor(dom: HTMLElement) {

        super(dom, {
            cameraOptions: {
                fov: 45,
                near: 0.1,
                far: 1000
            }
        })

        this.camera.position.set(0, 5, 15)

        const ambientLight = new THREE.AmbientLight(0xffffff, 2)
        this.scene.add(ambientLight)

        const light = new THREE.DirectionalLight(0xffffff, 2)
        light.position.set(0, 60, -60)
        light.castShadow = true
        this.scene.add(light)

        const shadowLight = new THREE.DirectionalLight(0xffffff, 4)
        shadowLight.position.set(600, 60, 60)
        shadowLight.castShadow = true
        this.scene.add(shadowLight)

        this.renderer.shadowMap.enabled = true

        this.orbit = new OrbitControls(this.camera, this.renderer.domElement)
        this.orbit.target.y = 2

        // const axes = new THREE.AxesHelper(5)
        // this.scene.add(axes)




        // 地砖大小
        const worldWidth = 100
        const worldHeight = 100
        const grassColor = 0xc0ea3b
        const roadWidth = 10

        const grassTexture = this.textureLoader.load(grassPic)
        const roadTexture = this.textureLoader.load(roadPic)
        const licenseTexture = this.textureLoader.load(licensePic)


        const grassGeo = new THREE.PlaneGeometry(worldWidth, worldHeight)
        const grassMat = new THREE.MeshLambertMaterial({
            color: grassColor,
            map: grassTexture
        })

        grassMat.map!.wrapS = grassMat.map!.wrapT = THREE.RepeatWrapping
        grassMat.map!.repeat.set(128, 128)

        const grass = new THREE.Mesh(grassGeo, grassMat)
        grass.rotation.x = -Math.PI / 2
        grass.position.y = -0.01
        this.scene.add(grass)

        const roadGeo = new THREE.PlaneGeometry(roadWidth, worldHeight)
        const roadMat = new THREE.MeshPhongMaterial({
            color: 0xffffff,
            map: roadTexture
        })

        roadMat.map!.wrapS = roadMat.map!.wrapT = THREE.RepeatWrapping
        roadMat.map!.repeat.set(1, 16)


        const road = new THREE.Mesh(roadGeo, roadMat)
        road.receiveShadow = true
        road.rotation.x = -Math.PI / 2
        this.scene.add(road)
    }

    protected init() {
    }


    protected onRenderer() {
        const elapsed = this.clock.getElapsedTime()
        this.orbit.update()
    }

}