import * as THREE from "three"
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls"
import ThreeCore from "@/three-widget/ThreeCore"
import grassPic from "./texture/grass.jpg"

import roadPic from "./texture/road.jpg"
import {Sky} from "three/examples/jsm/objects/Sky"
import {GUI} from "dat.gui"
import {getGltfLoader, getTextureLoader} from "@/three-widget/loader/ThreeLoader"


export default class ThreeProject extends ThreeCore {

    private readonly orbit: OrbitControls


    private readonly guiObj = {
        curveLine: true,
        carCameraFlow: false,
        orbitFlow: false
    }


    private carCamera: THREE.PerspectiveCamera

    private car: THREE.Group | null = null
    private loopTime = 10 * 1000 // loopTime: 循环一圈的时间

    private curve: THREE.CatmullRomCurve3
    private curveLine: THREE.Line

    constructor(dom: HTMLElement) {

        super(dom, {
            cameraOptions: {
                fov: 45,
                near: 0.1,
                far: 10000
            }
        })

        this.camera.position.set(0, 80, 260)
        this.scene.background = new THREE.Color(0x000000)

        const ambientLight = new THREE.AmbientLight(0xffffff, 1)
        this.scene.add(ambientLight)

        const light = new THREE.DirectionalLight(0xffffff, 1)
        light.position.set(0, 60, -60)
        light.castShadow = true
        this.scene.add(light)

        const shadowLight = new THREE.DirectionalLight(0xffffff, 4)
        shadowLight.position.set(0, 60, 60)
        shadowLight.castShadow = true
        this.scene.add(shadowLight)

        this.renderer.shadowMap.enabled = true

        this.orbit = new OrbitControls(this.camera, this.renderer.domElement)
        this.orbit.target.y = 2

        // const axesHelper = new THREE.AxesHelper(5)
        // this.scene.add(axesHelper)


        const worldWidth = 600
        const worldHeight = 600
        const grassColor = 0xc0ea3b
        const roadWidth = 10

        const grassTexture = getTextureLoader().load(grassPic)
        const roadTexture = getTextureLoader().load(roadPic)


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
        roadMat.map!.repeat.set(1, worldHeight / 30)


        const road = new THREE.Mesh(roadGeo, roadMat)
        road.receiveShadow = true
        road.rotation.x = -Math.PI / 2
        this.scene.add(road)


        // 天空, 必须同时创建太阳, 否则没有效果
        // turbidity 浑浊度
        // rayleigh 视觉效果就是傍晚晚霞的红光的深度
        // luminance 视觉效果整体提亮或变暗
        // mieCoefficient 散射系数
        // mieDirectionalG 定向散射值
        const sky = new Sky()
        sky.scale.setScalar(10000)
        this.scene.add(sky)
        const skyUniforms = sky.material.uniforms
        skyUniforms['turbidity'].value = 20
        skyUniforms['rayleigh'].value = 2
        skyUniforms['mieCoefficient'].value = 0.005
        skyUniforms['mieDirectionalG'].value = 0.5


        // 太阳
        const sun = new THREE.Vector3()
        const pmremGenerator = new THREE.PMREMGenerator(this.renderer)
        const phi = THREE.MathUtils.degToRad(88)
        const theta = THREE.MathUtils.degToRad(170)
        sun.setFromSphericalCoords(1, phi, theta)
        sky.material.uniforms['sunPosition'].value.copy(sun)
        this.scene.environment = pmremGenerator.fromScene(this.scene).texture


        // 下面路径加了实体化预览, 加了锚点, 按颜色调试路径更方便
        const anchorParams = [
            {color: "#ff0000", position: new THREE.Vector3(0, 0.1, -100)},
            {color: "#00ff00", position: new THREE.Vector3(100, 0.1, -150)},
            {color: "#0000ff", position: new THREE.Vector3(150, 0.1, 0)},
            {color: "#ffff00", position: new THREE.Vector3(0, 0.1, 60)},
            {color: "#00ffff", position: new THREE.Vector3(-150, 0.1, 40)},
            {color: "#ff00ff", position: new THREE.Vector3(-200, 0.1, -50)},
        ]

        // 路径
        const curve = new THREE.CatmullRomCurve3(anchorParams.map(param => param.position), true)
        this.curve = curve

        // 路径实体化预览
        const curveGeo = new THREE.BufferGeometry()
        curveGeo.setFromPoints(curve.getSpacedPoints(1000))
        const curveMat = new THREE.LineBasicMaterial({color: 0x00ff00, linewidth: 10})
        const curveLine = new THREE.Line(curveGeo, curveMat)
        this.curveLine = curveLine
        this.scene.add(curveLine)

        const pathPointGeo = new THREE.SphereGeometry(2)

        const anchors = new THREE.Group()

        anchorParams.map(param => {
            const anchor = new THREE.Mesh(
                pathPointGeo,
                new THREE.MeshBasicMaterial({color: param.color})
            )
            anchor.position.copy(param.position)
            anchors.add(anchor)
        })

        curveLine.add(anchors)


        // const car = new THREE.Mesh(
        //     new THREE.BoxGeometry(8, 12, 30),
        //     [
        //         new THREE.MeshLambertMaterial({color: "#ff0000"}),
        //         new THREE.MeshLambertMaterial({color: "#00ff00"}),
        //         new THREE.MeshLambertMaterial({color: "#0000ff"}),
        //         new THREE.MeshLambertMaterial({color: "#ffff00"}),
        //         new THREE.MeshLambertMaterial({color: "#00ffff"}),
        //         new THREE.MeshLambertMaterial({color: "#ff00ff"}),
        //     ]
        // )
        // car.position.copy(curve.getPointAt(0))
        // this.car = car
        // this.scene.add(car)


        const glassMat = new THREE.MeshPhysicalMaterial({
            metalness: 0.0,//玻璃非金属  金属度设置0
            roughness: 0.0,//玻璃表面光滑
            envMapIntensity: 1.0,
            transmission: 1.0,//透射度(透光率)
            ior: 1.5,//折射率
        })

        const wheelMat = new THREE.MeshPhongMaterial({
            color: "#fff8ee",
            specular: "#aff8ef", // 材质的反射色
            shininess: 30 // 材质的光泽程度
        })

        const tireMat = new THREE.MeshLambertMaterial({
            color: "#15181b",
        })

        const bodyMat = new THREE.MeshPhongMaterial({
            color: "#dd0625",
            specular: "#ff0000", // 材质的反射色
            shininess: 50 // 材质的光泽程度
        })


        getGltfLoader().load("public/demo/scene-camera-flow/car.glb", glb => {
            const car = glb.scene

            console.log("car = ", car)

            car.traverse((child: any) => {

                //console.log("child = ", child)

                if (child.isMesh) {
                    if (child.name.includes("wheel")) {
                        child.material = wheelMat
                    } else if (child.name.includes("tire")) {
                        child.material = tireMat
                    } else if (child.name.includes("glass")) {
                        child.material = glassMat
                    } else {
                        child.material = bodyMat
                    }
                }
            })

            car.position.copy(curve.getPointAt(0))
            this.car = car
            this.scene.add(car)
        })


        const carCamera = new THREE.PerspectiveCamera(
            (this.options.cameraOptions as PerspectiveCameraOptions).fov,
            this.dom.clientWidth / this.dom.clientHeight,
            this.options.cameraOptions.near,
            this.options.cameraOptions.far)
        carCamera.position.set(0, 10, 0)
        this.carCamera = carCamera
        this.scene.add(carCamera)


        const carCameraHelper = new THREE.CameraHelper(carCamera)
        this.scene.add(carCameraHelper)


        this.addGUI()
    }


    private addGUI() {




        const gui = new GUI()

        gui.add(this.guiObj, "curveLine").name("显示路径").onChange(value => this.curveLine.visible = value)

        gui.add(this.guiObj, "orbitFlow").name("控制器跟随")

        gui.add(this.guiObj, "carCameraFlow").name("切换相机").onChange(value => {
            if (value) {
                this.camera = this.carCamera
            } else {
                this.camera = this.defaultCamera
            }
        })
    }

    protected init() {
    }


    protected onRenderer() {
        this.orbit.update()

        const loopTime = this.loopTime

        const time = Date.now()
        const per = (time % loopTime) / loopTime // 计算当前时间进度百分比


        if (this.car) {
            // 更新车位置
            const position = this.curve.getPointAt(per)

            if(this.guiObj.orbitFlow){
                // 主相机视角时, 控制器跟随车辆
                this.orbit.target = position
            }


            this.car.position.copy(position)


            // 更新车朝向
            const tangent = this.curve.getTangentAt(per)

            const lookAtVec = tangent.add(position) // 位置向量和切线向量相加即为所需朝向的点向量
            this.car.lookAt(lookAtVec)


            // 更新车顶相机位置
            this.carCamera.position.set(this.car.position.x, this.car.position.y + 8, this.car.position.z)

            let a = per + 0.05
            if (a > 1) {
                a = a - 1
            }

            // 这里相机 lookAt 位置实际是错的, 这样得到的视野和真实世界的情况不一致, 车头向左摆时, 视角却还是右的, 不同步
            // todo 以后再更正
            this.carCamera.lookAt(this.curve.getPointAt(a))
        }


    }

}