import * as THREE from "three"
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls"
import ThreeCore from "@/three-widget/ThreeCore"
import stormPic from "./texture/storm.jpg"
import metalPic from "./texture/metal.png"


export default class ThreeProject extends ThreeCore {

    private readonly orbit: OrbitControls
    private readonly tunnel: THREE.Mesh
    private readonly stormTexture: THREE.Texture

    constructor(dom: HTMLElement) {

        super(dom, {
            cameraOptions: {
                fov: 45,
                near: 0.1,
                far: 10000
            }
        })

        this.camera.position.set(0, 0, 500)
        this.scene.background = new THREE.Color(0x000000)

        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
        this.scene.add(ambientLight)

        const pointLight = new THREE.PointLight(0xffffff)
        pointLight.position.set(0, 0, 500)
        this.scene.add(pointLight)

        this.renderer.shadowMap.enabled = true

        this.orbit = new OrbitControls(this.camera, this.renderer.domElement)

        // const axesHelper = new THREE.AxesHelper(100)
        // this.scene.add(axesHelper)


        // 时空通道
        const stormTexture = this.textureLoader.load(stormPic)
        stormTexture.wrapS = stormTexture.wrapT = THREE.RepeatWrapping
        stormTexture.repeat.set(1, 2)
        this.stormTexture = stormTexture


        const stormGeo = new THREE.CylinderGeometry(30, 50, 1000, 32, 32, true)
        const stormMat = new THREE.MeshPhongMaterial({
            transparent: true,
            //map: stormTexture,
            alphaMap: stormTexture,
            side: THREE.BackSide
        })

        const tunnel = new THREE.Mesh(stormGeo, stormMat)
        tunnel.rotation.x = -Math.PI / 2
        this.scene.add(tunnel)
        this.tunnel = tunnel


        // 时光机平台
        const metalTexture = this.textureLoader.load(metalPic)
        metalTexture.wrapS = metalTexture.wrapT = THREE.RepeatWrapping
        metalTexture.repeat.set(10, 10)

        const plane = new THREE.Mesh(
            new THREE.BoxGeometry(30, 2, 30),
            new THREE.MeshPhongMaterial({map: metalTexture})
        )

        plane.position.z = 460
        plane.position.y = -20
        this.scene.add(plane)
    }

    protected init() {
    }


    private H = 0

    protected onRenderer() {
        this.orbit.update()

        this.H += 0.002
        if (this.H > 1) {
            this.H = 0
        }

        // @ts-ignore
        // setHSL 色相、饱和度、明度
        // this.tunnel.material.color.setHSL(this.H, 0.5, 0.5)
        this.tunnel.material.color.setHSL(this.H, Math.random(), Math.random())
        this.tunnel.rotation.y += 0.008
        this.stormTexture.offset.y += 0.008
    }

}