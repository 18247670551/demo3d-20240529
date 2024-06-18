import * as THREE from "three"
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls"
import * as CANNON from "cannon-es"
import ThreeCore from "@/three-widget/ThreeCore"


export default class ThreeProject extends ThreeCore {

    private delta = 0

    private readonly orbit: OrbitControls

    private readonly world: CANNON.World
    // 重力9.8, 向下, 与y轴方向相反, 负值
    private readonly gravity = {x: 0, y: -9.8, z: 0}

    private readonly cubes: {
        mesh: THREE.Mesh, // 渲染
        body: CANNON.Body // 物理
    }[] = []


    private hitSound = new Audio("/demo/physics/hit.wav")

    constructor(dom: HTMLElement) {

        super(dom, {
            cameraOptions: {
                fov: 75,
                near: 0.1,
                far: 300
            }
        })

        this.scene.background = new THREE.Color(0x000000)

        this.camera.position.set(5, 10, 20)

        const ambientLight = new THREE.AmbientLight(0xffffff, 0.2)
        this.scene.add(ambientLight)

        const light1 = new THREE.DirectionalLight(0xffffff, 0.3)
        light1.position.set(20, 30, -30)
        light1.castShadow = true
        this.scene.add(light1)

        const light2 = new THREE.DirectionalLight(0xffffff, 1)
        light2.position.set(20, 30, 30)
        light2.castShadow = true
        this.scene.add(light2)



        this.renderer.shadowMap.enabled = true

        this.orbit = new OrbitControls(this.camera, this.renderer.domElement)
        this.orbit.target.y = 4

        const axes = new THREE.AxesHelper(5)
        this.scene.add(axes)

        // 创建物理世界
        const world = new CANNON.World()
        this.world = world

        world.gravity.set(this.gravity.x, this.gravity.y, this.gravity.z)

        // 地面
        const floor = new THREE.Mesh(
            new THREE.PlaneGeometry(20, 20),
            new THREE.MeshStandardMaterial({side: THREE.DoubleSide})
        )
        floor.rotation.x = -Math.PI / 2
        floor.receiveShadow = true
        this.scene.add(floor)

        // 地面对应的物理地面
        const floorShape = new CANNON.Plane()
        const floorBody = new CANNON.Body()
        const floorWorldMat = new CANNON.Material("floor")
        floorBody.material = floorWorldMat
        // 质量为0使物体保持不动
        floorBody.mass = 0
        floorBody.addShape(floorShape)
        // 地面位置
        floorBody.position.set(floor.position.x, floor.position.y, floor.position.z)
        // 旋转地面位置
        floorBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI / 2)
        world.addBody(floorBody)


        const cubWorldMat = new CANNON.Material("cube")

        // 设置2种材质碰撞的参数
        const defaultContactMaterial = new CANNON.ContactMaterial(cubWorldMat, floorWorldMat, {
            friction: 0.2, // 摩擦力
            restitution: 0.6 // 弹性
        })

        // 将材料的关联设置添加到物理世界
        world.addContactMaterial(defaultContactMaterial)

        // 设置世界碰撞的默认材料
        world.defaultContactMaterial = defaultContactMaterial


        window.addEventListener('click', () => {
            this.createCube(cubWorldMat)
        })

    }

    private createCube(material: CANNON.Material) {
        const cubeGeo = new THREE.BoxGeometry(1, 1, 1)
        const cubeMat = new THREE.MeshStandardMaterial()
        const cube = new THREE.Mesh(cubeGeo, cubeMat)
        cube.castShadow = true
        cube.receiveShadow = true

        this.scene.add(cube)

        const cubeShape = new CANNON.Box(new CANNON.Vec3(0.5, 0.5, 0.5))
        const cubeBody = new CANNON.Body({
            shape: cubeShape,
            position: new CANNON.Vec3(0, 0, 0),
            mass: 1, //物理质量
            material: material
        })


        cubeBody.position.y = 10

        cubeBody.applyForce(
            new CANNON.Vec3(1, 0, 0), // 施加力大小和方向
            new CANNON.Vec3(1, 0, 0), // 施加力的位置
        )

        this.world.addBody(cubeBody)

        cubeBody.addEventListener('collide', this.hitEvent)

        this.cubes.push({
            mesh: cube, // 渲染
            body: cubeBody // 物理
        })
    }

    private hitEvent = (e: any) => {
        // 获取碰撞的强度
        const velocityAlongNormal = e.contact.getImpactVelocityAlongNormal()
        if (velocityAlongNormal > 2) {
            // 从0开始播放
            this.hitSound.currentTime = 0
            let volume = velocityAlongNormal / 20
            // 播放音量值0-1, 超过1会报错
            if(volume > 1){
                volume = 1
            }
            this.hitSound.volume = volume
            this.hitSound.play()
        }
    }

    protected init() {
    }

    protected onRenderer() {
        this.delta = this.clock.getDelta()
        this.orbit.update()

        this.physicTick()
    }

    private physicTick(){
        // 更新物理引擎世界的物体
        this.world.step(1/120, this.delta)

        this.cubes.forEach(item => {
            item.mesh.position.copy(item.body.position)
            // 设置渲染的物体跟随物理的物体旋转
            item.mesh.quaternion.copy(item.body.quaternion)
        })
    }

}
