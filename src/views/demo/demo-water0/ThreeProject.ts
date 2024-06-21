import * as THREE from "three"
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls"
import ThreeCore from "@/three-widget/ThreeCore"
import {Water} from "three/examples/jsm/objects/Water"
import {getTextureLoader} from "@/three-widget/loader/ThreeLoader"


export default class ThreeProject extends ThreeCore{

    private readonly orbit: OrbitControls


    private readonly water: Water


    constructor(dom: HTMLElement) {

        super(dom, {
            cameraOptions: {
                fov: 75,
                near: 0.1,
                far: 10000
            }
        })

        this.scene.background = new THREE.Color(0x999999)

        this.camera.position.set(100,100,100)

        const ambientLight = new THREE.AmbientLight(0xffffff, 4)
        this.scene.add(ambientLight)

        this.renderer.shadowMap.enabled = true

        this.orbit = new OrbitControls(this.camera, this.renderer.domElement)


        const axesHelper = new THREE.AxesHelper(20)
        this.scene.add(axesHelper)


        this.water = this.addAndGetWater()
    }

    protected init(){}

    protected onRenderer() {
        this.orbit.update()

        this.water.material.uniforms["time"].value += 1.0 / 60.0
    }

    private addAndGetWater(){
        const waterGeometry = new THREE.PlaneGeometry(10000, 10000)
        const texture = getTextureLoader().load('/demo/water0/water_texture0.jpg',  (texture) => {
            texture.wrapS = texture.wrapT = THREE.RepeatWrapping
        })
        const water = new Water(
            waterGeometry,
            {
                textureWidth: 512,
                textureHeight: 512,
                waterNormals: texture,
                sunDirection: new THREE.Vector3(),
                sunColor: 0xffffff,
                waterColor: 0x294f9a,
                distortionScale: 3.7,
            }
        )
        water.rotation.x = - Math.PI / 2
        this.scene.add(water)

        return water
    }

}
