import * as THREE from "three"
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls"
import ThreeCore from "@/three-widget/ThreeCore"
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader"
import Fan, {BtnState, Level, LevelBtn, ShakeBtn} from "@/views/demo/demo-fan/Fan"


export default class ThreeProject extends ThreeCore{

    private readonly orbit: OrbitControls
    private fan: Fan | null = null


    constructor(dom: HTMLElement) {

        super(dom, {
            cameraOptions: {
                fov: 75,
                near: 0.1,
                far: 100
            }
        })

        // 星空背景色
        this.scene.background = new THREE.Color(0x030311)

        this.camera.position.set(0, 0.8, 1.8)

        this.renderer.shadowMap.enabled = true
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap


        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6)
        this.scene.add(ambientLight)

        const directionalLight1 = new THREE.DirectionalLight(0xffffff, 2)
        directionalLight1.position.set(0, 500, 500)
        this.scene.add(directionalLight1)

        const lightPoint = new THREE.HemisphereLight(0xffffff, 0xffffff, 1)
        lightPoint.position.set(0, 500, 0)
        this.scene.add(lightPoint)


        this.orbit = new OrbitControls(this.camera, this.renderer.domElement)
        this.orbit.target = new THREE.Vector3(0, 0.8, 0)
        this.orbit.enableZoom = false
        this.orbit.enablePan = false
        this.orbit.maxPolarAngle = 1.3
        this.orbit.minPolarAngle = 1.3
        this.orbit.update()
    }

    protected init(){
        this.load()
    }

    protected onRenderer() {
        this.orbit.update()
        this.fan?.update()
    }

    private load(){
        new GLTFLoader().load("/demo/fan/fan.glb", gltf => {

            const obj = gltf.scene
            obj.scale.set(0.3, 0.3, 0.3)
            obj.rotation.y = Math.PI
            this.scene.add(obj)

            this.fan = new Fan(gltf)

            const btns: Array<[string, Level]> = [
                ["Btn_1", Level.one],
                ["Btn_2", Level.two],
                ["Btn_3", Level.three],
                ["Btn_4", Level.zero],
            ]
            btns.forEach(([name, level]) => {
                let btn = gltf.scene.getObjectByName(name)
                if (btn) this.fan!.btns.push(new LevelBtn(btn, level))
            })
            let btn = gltf.scene.getObjectByName("Shake")
            if (btn) this.fan.btns.push(new ShakeBtn(btn))
        })

        this.renderer.domElement.addEventListener("pointerdown", (event) => {
            const { offsetX, offsetY } = event
            const x = (offsetX / this.dom.clientWidth) * 2 - 1
            const y = -(offsetY / this.dom.clientHeight) * 2 + 1
            const mousePoint = new THREE.Vector2(x, y)
            const raycaster = new THREE.Raycaster()
            raycaster.setFromCamera(mousePoint, this.camera)
            const intersects = raycaster.intersectObjects(this.scene.children, true)
            if (intersects.length == 0) return
            
            this.fan!.handleClick(intersects)
            this.renderer.domElement.addEventListener("pointerup",
                () => this.fan!.handleClick(intersects, BtnState.up),
                { once: true }
            )
        })
    }

}
