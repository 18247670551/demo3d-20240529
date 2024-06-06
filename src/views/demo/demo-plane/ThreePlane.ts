import ThreeCore from "@/three-widget/ThreeCore"
import Plane from "@/views/demo/demo-plane/Plane"
import * as THREE from "three"
import {ElMessage} from "element-plus"
import {GUI} from "dat.gui"
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls"

export class ThreePlane extends ThreeCore {

    private readonly plane: Plane

    private planeDefaultPosition = {x: -6000, y: -2000, z: 0}

    private readonly directionalLight1: THREE.DirectionalLight
    private readonly directionalLight2: THREE.DirectionalLight
    private readonly pointLight1: THREE.PointLight
    
    private readonly orbit: OrbitControls

    constructor(dom: HTMLElement, isDev: boolean) {

        super(dom, {
            cameraOptions: {
                fov: 45,
                near: 0.01,
                far: 300000,
            }
        })

        this.scene.background = new THREE.Color(0x00ffff) // 天蓝色
        this.camera.position.set(0, 0, 15000)

        this.orbit = new OrbitControls(this.camera, this.renderer.domElement)


        const ambientLight = new THREE.AmbientLight(0xffffff, 5)
        this.scene.add(ambientLight)


        this.directionalLight1 = new THREE.DirectionalLight(0xffffff, 7)
        this.directionalLight1.name = '平行光源1'
        this.directionalLight1.position.set(0, 5000, 5000)
        this.scene.add(this.directionalLight1)

        this.directionalLight2 = new THREE.DirectionalLight(0xffffff, 2)
        this.directionalLight2.name = '平行光源2'
        this.directionalLight2.position.set(0, 5000, -5000)
        this.scene.add(this.directionalLight2)

        this.pointLight1 =  new THREE.PointLight( 0xffffff, 5)
        this.pointLight1.name = '点光源1'
        this.pointLight1.position.set(0, 5000, 5000)
        this.pointLight1.decay = 0.1
        this.scene.add(this.pointLight1)

        this.plane = new Plane("飞机", {position: this.planeDefaultPosition})
        this.scene.add(this.plane)
    }

    init() {
        this.addGUI()
    }

    onRenderer() {
        this.orbit.update()
    }


    private addGUI() {

        const gui = new GUI()

        const axesHelper = new THREE.AxesHelper(10000)
        axesHelper.name = "坐标系助手"

        const gridHelper = new THREE.GridHelper(20000, 20, 0x2C2C2C, 0x888888)
        gridHelper.name = "网格助手"

        const cameraHelper = new THREE.CameraHelper(this.camera)
        cameraHelper.name = "相机助手"


        const baseRecord: Record<string, Function> = {
            '坐标系助手': () => {
                const isExist = this.scene.getObjectByName('坐标系助手')
                isExist ? this.scene.remove(axesHelper) : this.scene.add(axesHelper)
            },

            '网格助手': () => {
                const isExist = this.scene.getObjectByName('网格助手')
                isExist ? this.scene.remove(gridHelper) : this.scene.add(gridHelper)
            },

            '相机助手': () => {
                const isExist = this.scene.getObjectByName('相机助手')
                isExist ? this.scene.remove(cameraHelper) : this.scene.add(cameraHelper)
            },
        }

        const folder = gui.addFolder("基础场景工具")

        for (let key in baseRecord) {
            folder.add(baseRecord, key).name(key)
        }





        const directionalLight1Helper = new THREE.DirectionalLightHelper(this.directionalLight1, 3000)
        directionalLight1Helper.name = '平行光源1助手'

        const directionalLight2Helper = new THREE.DirectionalLightHelper(this.directionalLight2, 3000)
        directionalLight2Helper.name = '平行光源2助手'

        const pointLight1Helper = new THREE.PointLightHelper(this.pointLight1, 3000)
        pointLight1Helper.name = '点光源1助手'


        const extRecord: Record<string, Function> = {
            "平行光源1": () => {
                const isExist = this.scene.getObjectByName('平行光源1')
                if (isExist) {
                    this.scene.remove(this.directionalLight1)
                    this.scene.remove(directionalLight1Helper)
                } else {
                    this.scene.add(this.directionalLight1)
                }
            },
            "平行光源1助手": () => {
                const isExist0 = this.scene.getObjectByName('平行光源1')
                const isExist = this.scene.getObjectByName('平行光源1助手')
                if (isExist) {
                    this.scene.remove(directionalLight1Helper)
                } else {
                    if (isExist0) {
                        this.scene.add(directionalLight1Helper)
                    } else {
                        ElMessage.error("光源关闭状态, 请先打开光源")
                    }
                }
            },
            
            "平行光源2": () => {
                const isExist = this.scene.getObjectByName('平行光源2')
                if (isExist) {
                    this.scene.remove(this.directionalLight2)
                    this.scene.remove(directionalLight2Helper)
                } else {
                    this.scene.add(this.directionalLight2)
                }
            },
            "平行光源2助手": () => {
                const isExist0 = this.scene.getObjectByName('平行光源2')
                const isExist = this.scene.getObjectByName('平行光源2助手')
                if (isExist) {
                    this.scene.remove(directionalLight2Helper)
                } else {
                    if (isExist0) {
                        this.scene.add(directionalLight2Helper)
                    } else {
                        ElMessage.error("光源关闭状态, 请先打开光源")
                    }
                }
            },

            "点光源1": () => {
                const isExist = this.scene.getObjectByName('点光源1')
                if (isExist) {
                    this.scene.remove(this.pointLight1)
                    this.scene.remove(pointLight1Helper)
                } else {
                    this.scene.add(this.pointLight1!)
                }
            },
            "点光源1助手": () => {
                const isExist0 = this.scene.getObjectByName('点光源1')
                const isExist = this.scene.getObjectByName('点光源1助手')
                if (isExist) {
                    this.scene.remove(pointLight1Helper)
                } else {
                    if (isExist0) {
                        this.scene.add(pointLight1Helper)
                    } else {
                        ElMessage.error("光源关闭状态, 请先打开光源")
                    }
                }
            },
        }
        const extFolder = gui.addFolder('场景工具扩展')

        for (let key in extRecord) {
            extFolder.add(extRecord, key).name(key)
        }


        
        const planeRecord: Record<string, Function> = {
            "重置飞机位置": () => {
                this.plane.position.x = this.planeDefaultPosition.x
            },
            "开始飞": () => {
                this.addAnimate('flyAnimate', this.plane!.flyAnimate)
            },
            "停止飞": () => {
                this.removeAnimate('flyAnimate')
            },
        }

        const planeFolder = gui.addFolder('飞机控制')

        for (let key in planeRecord) {
            planeFolder.add(planeRecord, key).name(key)
        }
    }

}