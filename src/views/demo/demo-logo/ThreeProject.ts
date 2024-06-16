import * as THREE from "three"
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls"
import ThreeCore from "@/three-widget/ThreeCore"


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

        this.camera.position.set(10, 30, 60)

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
        this.orbit.target.y = 10

        const axes = new THREE.AxesHelper(30)
        this.scene.add(axes)


        const logo = this.createLogo()
        this.scene.add(logo)
    }

    private createLogo(){
        const group = new THREE.Group()

        const logoMaterial = new THREE.MeshMatcapMaterial({
            matcap: this.textureLoader.load('src/views/demo/demo-test/texture/matcap_0.png'),
            side: THREE.DoubleSide,
        })

        const cone = new THREE.Mesh(new THREE.ConeGeometry(4, 4, 4), logoMaterial)
        cone.position.y = 12
        group.add(cone)

        const cylinder = new THREE.Mesh(new THREE.CylinderGeometry(6, 10, 4, 4, 1), logoMaterial)
        cylinder.position.y = 6
        group.add(cylinder)

        const cylinder2 = new THREE.Mesh(new THREE.CylinderGeometry(12, 16, 4, 4, 1), logoMaterial)
        group.add(cylinder2)

        return group
    }


    protected init() {
    }


    protected onRenderer() {
        const elapsed = this.clock.getElapsedTime()
        this.orbit.update()

        //this.watersMaterial.uniforms.uTime.value = elapsed
    }

}