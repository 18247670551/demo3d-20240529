import * as THREE from "three"
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls"
import ThreeCore from "@/three-widget/ThreeCore"
import matcap_0Pic from "./texture/matcap_0.png"
import matcap_2Pic from "./texture/matcap_2.png"
import matcap_3Pic from "./texture/matcap_3.png"
import matcap_4Pic from "./texture/matcap_4.png"
import matcap_5Pic from "./texture/matcap_5.png"
import matcap_6Pic from "./texture/matcap_6.png"
import matcap_7Pic from "./texture/matcap_7.png"



export default class ThreeProject extends ThreeCore {

    private readonly orbit: OrbitControls
    private readonly logoMaterial: THREE.Material

    constructor(dom: HTMLElement) {

        super(dom, {
            cameraOptions: {
                fov: 45,
                near: 0.1,
                far: 1000
            }
        })

        this.scene.background = new THREE.Color(0x000000)

        this.camera.position.set(0, 30, 60)

        const ambientLight = new THREE.AmbientLight(0xffffff, 1)
        this.scene.add(ambientLight)

        const light = new THREE.DirectionalLight(0xffffff, 1)
        light.position.set(0, 60, -60)
        light.castShadow = true
        this.scene.add(light)

        const shadowLight = new THREE.DirectionalLight(0xffffff, 3)
        shadowLight.position.set(10, 60, 60)
        shadowLight.castShadow = true
        this.scene.add(shadowLight)

        this.renderer.shadowMap.enabled = true

        this.orbit = new OrbitControls(this.camera, this.renderer.domElement)
        this.orbit.autoRotate = true
        this.orbit.target.y = 10

        // const axesHelper = new THREE.AxesHelper(20)
        // this.scene.add(axesHelper)


        const textures = [
            this.textureLoader.load(matcap_0Pic),
            this.textureLoader.load(matcap_2Pic),
            this.textureLoader.load(matcap_3Pic),
            this.textureLoader.load(matcap_4Pic),
            this.textureLoader.load(matcap_5Pic),
            this.textureLoader.load(matcap_6Pic),
            this.textureLoader.load(matcap_7Pic),
        ]

        this.logoMaterial = new THREE.MeshMatcapMaterial({
            matcap: textures[0],
            side: THREE.DoubleSide,
        })

        const logo = this.createLogo()
        this.scene.add(logo)

        let i = 0
        setInterval(() => {
            // @ts-ignore
            this.logoMaterial.matcap = textures[i%6]
            i++
        }, 2000)
    }

    private createLogo(){
        const group = new THREE.Group()

        const cone = new THREE.Mesh(new THREE.ConeGeometry(4, 4, 4), this.logoMaterial)
        cone.position.y = 12
        group.add(cone)

        const cylinder = new THREE.Mesh(new THREE.CylinderGeometry(6, 10, 4, 4, 1), this.logoMaterial)
        cylinder.position.y = 6
        group.add(cylinder)

        const cylinder2 = new THREE.Mesh(new THREE.CylinderGeometry(12, 16, 4, 4, 1), this.logoMaterial)
        group.add(cylinder2)

        return group
    }


    protected init() {
    }


    protected onRenderer() {
        const elapsed = this.clock.getElapsedTime()
        this.orbit.update()
    }

}