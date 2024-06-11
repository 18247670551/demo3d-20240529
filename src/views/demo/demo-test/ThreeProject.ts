import * as THREE from "three"
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls"
import ThreeCore from "@/three-widget/ThreeCore"


export default class ThreeProject extends ThreeCore {

    private readonly orbit: OrbitControls


    constructor(dom: HTMLElement) {

        super(dom, {
            cameraOptions: {
                fov: 45,
                near: 0.01,
                far: 1000
            }
        })

        this.scene.background = new THREE.Color(0x000000)


        this.camera.position.set(0, 0, 500)

        const ambientLight = new THREE.AmbientLight(0xffffff, 0.9)
        this.scene.add(ambientLight)

        this.orbit = new OrbitControls(this.camera, this.renderer.domElement)

        const axes = new THREE.AxesHelper(200)
        this.scene.add(axes)



        const geo = new THREE.BoxGeometry(100, 100, 100, 50, 50)

        const vs = geo.getAttribute("position")
        //vs.setXYZ(10, 150, 150, 150)
        vs.setX(10, 150)
        vs.setY(10, 150)
        vs.setZ(10, 150)
        //vs.setXYZ(20, -150, -150, -150)


        const mat1 = new THREE.MeshBasicMaterial({color: "red"})
        const mat2 = new THREE.MeshBasicMaterial({color: "yellow"})
        const mat3 = new THREE.MeshBasicMaterial({color: "green"})
        const mat4 = new THREE.MeshBasicMaterial({color: "blue"})
        const mat5 = new THREE.MeshBasicMaterial({color: "brown"})
        const mat6 = new THREE.MeshBasicMaterial({color: "pink"})


        const testBox = new THREE.Mesh(geo, [mat1, mat2, mat3, mat4, mat5, mat6])

        this.scene.add(testBox)



    }

    protected init() {
    }

    protected onRenderer() {
        this.orbit.update()
    }

}
