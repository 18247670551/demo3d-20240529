import * as THREE from "three"
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls"
import ThreeCore from "@/three-widget/ThreeCore"
import grassPic from "./texture/grass.jpg"
import treePic from "./texture/tree.png"
import roadPic from "./texture/road.jpg"
import {Sky} from "three/examples/jsm/objects/Sky"
import Truck from "@/three-widget/my/Truck"


export default class ThreeProject extends ThreeCore {

    private readonly orbit: OrbitControls

    private car: Truck

    private carPath: THREE.CatmullRomCurve3
    private carPathLine: THREE.Line
    private carVelocity = 0.001
    private progress = 0

    constructor(dom: HTMLElement) {

        super(dom, {
            cameraOptions: {
                fov: 45,
                near: 0.1,
                far: 10000
            }
        })

        this.camera.position.set(0, 100, 300)
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

        // const axes = new THREE.AxesHelper(5)
        // this.scene.add(axes)


        const worldWidth = 1000
        const worldHeight = 1000
        const grassColor = 0xc0ea3b
        const roadWidth = 10

        const grassTexture = this.textureLoader.load(grassPic)
        const roadTexture = this.textureLoader.load(roadPic)


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


        // 添加树
        const treeMaterial = new THREE.MeshPhysicalMaterial({
            map: new THREE.TextureLoader().load(treePic),
            transparent: true,
            side: THREE.DoubleSide,
            metalness: .2,
            roughness: .8,
            depthTest: true,
            depthWrite: false,
            fog: false,
            reflectivity: 0.1,
        })

        const treeCustomDepthMaterial = new THREE.MeshDepthMaterial({
            depthPacking: THREE.RGBADepthPacking,
            map: new THREE.TextureLoader().load(treePic),
            alphaTest: 0.5
        })

        const treeGeo = new THREE.PlaneGeometry(2, 4)
        treeGeo.translate(0, 2, 0)
        const treePlan1 = new THREE.Mesh(treeGeo)
        treePlan1.material = treeMaterial
        treePlan1.customDepthMaterial = treeCustomDepthMaterial
        const treePlan2 = treePlan1.clone()
        treePlan2.rotation.y += Math.PI / 4
        const treePlan3 = treePlan2.clone()
        treePlan3.rotation.y += Math.PI / 4
        const treePlan4 = treePlan3.clone()
        treePlan4.rotation.y += Math.PI / 4

        const tree = new THREE.Group()
        tree.add(treePlan1, treePlan2, treePlan3, treePlan4)
        tree.position.set(-10, 0, -10)
        this.scene.add(tree)

        // 创建五环
        const cycleGeo = new THREE.TorusGeometry(10, 1, 10, 32)
        const cycleMat1 = new THREE.MeshLambertMaterial({color: 0x0885c2})
        const cycleMat2 = new THREE.MeshLambertMaterial({color: 0xfbb132})
        const cycleMat3 = new THREE.MeshLambertMaterial({color: 0x000000})
        const cycleMat4 = new THREE.MeshLambertMaterial({color: 0x1c8b3c})
        const cycleMat5 = new THREE.MeshLambertMaterial({color: 0xed334e})

        const cycle1 = new THREE.Mesh(cycleGeo, cycleMat1)
        const cycle2 = new THREE.Mesh(cycleGeo, cycleMat2)
        const cycle3 = new THREE.Mesh(cycleGeo, cycleMat3)
        const cycle4 = new THREE.Mesh(cycleGeo, cycleMat4)
        const cycle5 = new THREE.Mesh(cycleGeo, cycleMat5)


        // 以第三个为中间, 向两边延展
        cycle1.position.set(-25, 0, 0)
        cycle2.position.set(-12.5, -10, -0.5)
        cycle3.position.set(0, 0, 0)
        cycle4.position.set(12.5, -10, 0.5)
        cycle5.position.set(25, 0, 0)


        const cycles = new THREE.Group()
        cycles.add(
            cycle1,
            cycle2,
            cycle3,
            cycle4,
            cycle5,
        )
        cycles.scale.set(0.1, 0.1, 0.1)
        cycles.position.y = 5

        this.scene.add(cycles)


        // 下面路径加了实体化预览, 加了标志点, 按颜色调试路径更方便
        const pathPointPositions = [
            new THREE.Vector3(0, 0.1, -100), // 红
            new THREE.Vector3(100, 0.1, -150), // 绿
            new THREE.Vector3(150, 0.1, 0), // 蓝
            new THREE.Vector3(0, 0.1, 60), // 黄
            new THREE.Vector3(-150, 0.1, 40), // 棕
            new THREE.Vector3(-200, 0.1, -50), // 粉
        ]

        // 路径
        const carPath = new THREE.CatmullRomCurve3(pathPointPositions, true,)
        this.carPath = carPath

        // 路径实体化预览
        const carPathGeo = new THREE.BufferGeometry()
        carPathGeo.setFromPoints(carPath.getSpacedPoints(1000))
        const carPathMat = new THREE.LineBasicMaterial({color: 0x00ff00, linewidth: 10})
        const carPathLine = new THREE.Line(carPathGeo, carPathMat)
        this.carPathLine = carPathLine
        //this.carPathLine.visible = false
        this.scene.add(carPathLine)

        const pathPointGeo = new THREE.SphereGeometry(2)
        const pathPointMat1 = new THREE.MeshBasicMaterial({color: 'red'})
        const pathPointMat2 = new THREE.MeshBasicMaterial({color: 'green'})
        const pathPointMat3 = new THREE.MeshBasicMaterial({color: 'blue'})
        const pathPointMat4 = new THREE.MeshBasicMaterial({color: 'yellow'})
        const pathPointMat5 = new THREE.MeshBasicMaterial({color: 'brown'})
        const pathPointMat6 = new THREE.MeshBasicMaterial({color: 'pink'})

        const pathPoint1 = new THREE.Mesh(pathPointGeo, pathPointMat1)
        const pathPoint2 = new THREE.Mesh(pathPointGeo, pathPointMat2)
        const pathPoint3 = new THREE.Mesh(pathPointGeo, pathPointMat3)
        const pathPoint4 = new THREE.Mesh(pathPointGeo, pathPointMat4)
        const pathPoint5 = new THREE.Mesh(pathPointGeo, pathPointMat5)
        const pathPoint6 = new THREE.Mesh(pathPointGeo, pathPointMat6)

        pathPoint1.position.copy(pathPointPositions[0])
        pathPoint2.position.copy(pathPointPositions[1])
        pathPoint3.position.copy(pathPointPositions[2])
        pathPoint4.position.copy(pathPointPositions[3])
        pathPoint5.position.copy(pathPointPositions[4])
        pathPoint6.position.copy(pathPointPositions[5])

        const pathPoints = new THREE.Group()
        pathPoints.add(
            pathPoint1,
            pathPoint2,
            pathPoint3,
            pathPoint4,
            pathPoint5,
            pathPoint6,
        )
        carPathLine.add(pathPoints)


        const car = new Truck("车")
        car.scale.set(0.002, 0.002, 0.002)
        car.position.copy(carPath.getPointAt(0))
        this.scene.add(car)
        this.car = car


    }


    private carUpdate() {
        if (this.progress <= 1 - this.carVelocity) {
            // 用当前点和目标点计算出鸟头朝向
            const current = this.carPath.getPointAt(this.progress)
            const target = this.carPath.getPointAt(this.progress + this.carVelocity)

            this.car!.position.set(current.x, current.y, current.z)

            // 因为模型加载进来默认面部是正对Z轴负方向的，所以直接lookAt会导致出现倒着跑的现象，这里用重新设置朝向的方法来解决
            // this.car!.lookAt(target.x, target.y, target.z)

            //以下代码在多段路径时可重复执行
            const mtx = new THREE.Matrix4() //创建一个4维矩阵
            // 注意第一个参数是target, 否则鸟是倒着飞
            mtx.lookAt(target, this.car!.position, this.car!.up)
            mtx.multiply(new THREE.Matrix4().makeRotationFromEuler(new THREE.Euler(0, -Math.PI/2, 0, 'ZYX')))
            // Quaternion 四元数在threejs中用于表示rotation（旋转）
            const rotation = new THREE.Quaternion().setFromRotationMatrix(mtx) //计算出需要进行旋转的四元数值
            this.car!.quaternion.slerp(rotation, 0.2)

            this.progress += this.carVelocity
        } else {
            this.progress = 0
        }
    }


    protected init() {
    }


    protected onRenderer() {
        const elapsed = this.clock.getElapsedTime()
        this.orbit.update()

        this.carUpdate()
    }

}