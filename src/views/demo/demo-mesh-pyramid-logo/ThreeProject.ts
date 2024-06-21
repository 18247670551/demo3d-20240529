import * as THREE from "three"
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls"
import ThreeCore from "@/three-widget/ThreeCore"
import {getTextureLoader} from "@/three-widget/loader/ThreeLoader"

import PyramidLogo from "./PyramidLogo"

import matcap_0Pic from "./texture/matcap_0.png"
import matcap_2Pic from "./texture/matcap_2.png"
import matcap_3Pic from "./texture/matcap_3.png"
import matcap_4Pic from "./texture/matcap_4.png"
import matcap_5Pic from "./texture/matcap_5.png"
import matcap_6Pic from "./texture/matcap_6.png"
import matcap_7Pic from "./texture/matcap_7.png"



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
        this.orbit.target.y = 7

        // const axesHelper = new THREE.AxesHelper(20)
        // this.scene.add(axesHelper)




        const textures = [
            getTextureLoader().load(matcap_0Pic),
            getTextureLoader().load(matcap_2Pic),
            getTextureLoader().load(matcap_3Pic),
            getTextureLoader().load(matcap_4Pic),
            getTextureLoader().load(matcap_5Pic),
            getTextureLoader().load(matcap_6Pic),
            getTextureLoader().load(matcap_7Pic),
        ]

        const logo = new PyramidLogo()

        this.scene.add(logo)

        let i = 0
        setInterval(() => {
            logo.material.map = textures[i % 6]
            i++
        }, 2000)
    }


    protected init() {
    }

    protected onRenderer() {
        this.orbit.update()
    }

}