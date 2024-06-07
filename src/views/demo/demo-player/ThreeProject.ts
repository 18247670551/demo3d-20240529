import * as THREE from "three"
import ThreeCore from "@/three-widget/ThreeCore"
import {Octree} from "three/examples/jsm/math/Octree"
import {Capsule} from "three/examples/jsm/math/Capsule"
import {OctreeHelper} from "three/examples/jsm/helpers/OctreeHelper.js";

export default class ThreeProject extends ThreeCore {

    private deltaTime = 0
    // 默认摄像机为前置摄像机, 跟随人物
    private backCamera: THREE.Camera
    // 当前使用的摄像机
    private activeCamera: THREE.Camera

    // 重力
    private gravity = -9.8
    // 物理世界
    private worldOctree: Octree
    // 人物胶囊
    private capsule: THREE.Mesh
    // 人物胶囊的碰撞体(椭球下焦点, 椭球焦点, 半径) 胶囊1.7米高, 半径为0.35
    private playerCollider = new Capsule(
        new THREE.Vector3(0, 0.35, 0),
        new THREE.Vector3(0, 1.35, 0),
        0.35
    )

    // 玩家是否在地面上
    private playerOnFloor = false
    // 玩家的速度
    private playerVelocity = new THREE.Vector3(0, 0, 0)
    // 方向向量
    private playerDirection = new THREE.Vector3(0, 0, 0)
    // 键盘按下事件
    private keyStates = {
        "KeyW": false,
        "KeyA": false,
        "KeyS": false,
        "KeyD": false,
        "Space": false,
        "isDown": false,
    }

    constructor(dom: HTMLElement) {

        super(dom, {
            cameraOptions: {
                fov: 75,
                near: 0.001,
                far: 1000
            }
        })

        this.scene.background = new THREE.Color(0x88ccee)
        this.scene.fog = new THREE.Fog(0x88ccee, 0, 50)

        this.activeCamera = this.camera

        this.camera.position.set(0, 5, 10)

        // 默认摄像头为前置摄像头, 此为后置摄像头
        const backCamera = new THREE.PerspectiveCamera(
            75,
            dom.clientWidth / dom.clientHeight,
            0.001,
            1000
        )
        backCamera.position.set(0, 5, -10)
        this.backCamera = backCamera


        //const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
        //this.scene.add(ambientLight)

        // 添加半球光源
        const hemisphereLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 1)
        this.scene.add(hemisphereLight)


        this.renderer.shadowMap.enabled = true
        this.renderer.shadowMap.type = THREE.VSMShadowMap
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping


        // 创建一个平面
        const planeGeometry = new THREE.PlaneGeometry(40, 40, 1, 1)
        const planeMaterial = new THREE.MeshBasicMaterial({
            color: 0xffffff,
            side: THREE.DoubleSide,
        })
        const plane = new THREE.Mesh(planeGeometry, planeMaterial)
        plane.receiveShadow = true
        plane.rotation.x = -Math.PI / 2


        // 创建立方体叠楼梯
        for (let i = 0; i < 10; i++) {
            const boxGeometry = new THREE.BoxGeometry(1, 1, 0.15)
            const boxMaterial = new THREE.MeshBasicMaterial({color: 0x00ff00})
            const box = new THREE.Mesh(boxGeometry, boxMaterial)
            box.position.y = 0.15 + i * 0.15
            box.position.z = i * 0.3
            plane.add(box)
        }


        // 1.创建一个octree空间-用于碰撞检测
        const group = new THREE.Group()
        group.add(plane)
        this.scene.add(group)
        const worldOctree = new Octree()
        worldOctree.fromGraphNode(group)
        this.worldOctree = worldOctree


        // 创建一个octreeHelper
        //const octreeHelper = new OctreeHelper(worldOctree)
        //this.scene.add(octreeHelper)


        // 创建一个平面
        const capsuleBodyGeometry = new THREE.PlaneGeometry(1, 0.5, 1)
        const capsuleBodyMaterial = new THREE.MeshBasicMaterial({
            color: 0x0000ff,
            side: THREE.DoubleSide,
        })
        const capsuleBody = new THREE.Mesh(capsuleBodyGeometry, capsuleBodyMaterial)
        capsuleBody.position.set(0, 0.5, 0)



        // 创建人物胶囊
        const capsuleGeometry = new THREE.CapsuleGeometry(0.35, 1, 32)
        const capsuleMaterial = new THREE.MeshBasicMaterial({
            color: 0xffff00,
            side: THREE.DoubleSide,
        })
        const capsule = new THREE.Mesh(capsuleGeometry, capsuleMaterial)
        capsule.position.set(0, 0.85, 0)
        this.capsule = capsule

        // 将相机作为胶囊的子元素，就可以实现跟随
        this.camera.position.set(0, 2, -5)
        this.camera.lookAt(capsule.position)
        backCamera.position.set(0, 2, 5)
        backCamera.lookAt(capsule.position)
        // 控制旋转上下的空3d对象
        const capsuleBodyControl = new THREE.Object3D()
        capsuleBodyControl.add(this.camera)
        capsuleBodyControl.add(backCamera)
        capsule.add(capsuleBodyControl)

        capsule.add(this.camera)
        capsule.add(capsuleBody)

        this.scene.add(capsule)


        // 多层次细节展示, 在屏幕边缘放置一个圆体用来测试
        // 距离近渲染细, 球体网络线多, 距离远渲染的粗略, 网格线减少, 提高渲染性能
        const material = new THREE.MeshBasicMaterial({
            color: 0xff0000,
            wireframe: true,
        })
        let lod = new THREE.LOD()
        for (let i = 0; i < 5; i++) {
            const geometry = new THREE.SphereGeometry(2, 22 - i * 5, 22 - i * 5)
            const mesh = new THREE.Mesh(geometry, material)
            lod.addLevel(mesh, i * 5)
        }
        lod.position.set(10, 2, 10)
        this.scene.add(lod)


        // 根据键盘按下的键来更新键盘的状态
        document.addEventListener("keydown", (event) => {
                // @ts-ignore
                this.keyStates[event.code] = true
                this.keyStates.isDown = true
            },
            false
        )
        document.addEventListener("keyup", (event) => {
                // @ts-ignore
                this.keyStates[event.code] = false
                this.keyStates.isDown = false
                if (event.code == "KeyV") {
                    this.activeCamera = this.activeCamera === this.camera ? this.camera : backCamera
                }
            },
            false
        )
        document.addEventListener("mousedown", (event) => {
                //锁定鼠标指针
                document.body.requestPointerLock();
            },
            false
        )

        // 根据鼠标在屏幕移动，来旋转胶囊
        window.addEventListener("mousemove", (event) => {
                // 控制左右的旋转
                capsule.rotation.y -= event.movementX * 0.003
                // 控制上下的旋转
                capsuleBodyControl.rotation.x += event.movementY * 0.003
                if (capsuleBodyControl.rotation.x > Math.PI / 8) {
                    capsuleBodyControl.rotation.x = Math.PI / 8
                } else if (capsuleBodyControl.rotation.x < Math.PI / 8) {
                    capsuleBodyControl.rotation.x = -Math.PI / 8
                }
            },
            false
        )

    }


    // 更新玩家的状态
    private updatePlayer = () => {

        let damping = -0.05
        if (this.playerOnFloor) {
            this.playerVelocity.y = 0
            //设置阻力，停下来
            this.keyStates.isDown || this.playerVelocity.addScaledVector(this.playerVelocity, damping)
        } else {
            this.playerVelocity.y += this.gravity * this.deltaTime
        }

        //计算玩家移动的距离
        const playerMoveDistance = this.playerVelocity.clone().multiplyScalar(this.deltaTime)
        this.playerCollider.translate(playerMoveDistance)
        //将胶囊的位置进行设置
        this.playerCollider.getCenter(this.capsule.position)
        //进行碰撞检测
        this.playerCollisions()
    }

    // 重置玩家状态
    private resetPlayer = () => {
        // 如果掉下去了, 就重置到初始点
        if (this.capsule.position.y < -20) {
            this.playerCollider.start.set(0, 2.35, 0);
            this.playerCollider.end.set(0, 3.35, 0);
            this.playerCollider.radius = 0.35;
            this.playerVelocity.set(0, 0, 0);
            this.playerDirection.set(0, 0, 0);
        }
    }

    // 进行碰撞检测
    private playerCollisions = () => {
        const result = this.worldOctree.capsuleIntersect(this.playerCollider)
        this.playerOnFloor = false
        if (result) {
            this.playerOnFloor = result.normal.y > 0;
            this.playerCollider.translate(result.normal.multiplyScalar(result.depth))
        }
    }

    // 根据键盘状态更新玩家速度
    private controlPlayer = () => {
        if (this.keyStates["KeyW"]) {
            this.playerDirection.z = 2
            //获取胶囊的正前方
            const capsuleFront = new THREE.Vector3(0, 0, 1)
            this.capsule.getWorldDirection(capsuleFront)
            //计算玩家的速度
            this.playerVelocity.add(capsuleFront.multiplyScalar(this.deltaTime))
        }
        if (this.keyStates["KeyS"]) {
            this.playerDirection.z = 2
            const capsuleFront = new THREE.Vector3(0, 0, 1)
            this.capsule.getWorldDirection(capsuleFront)
            this.playerVelocity.add(capsuleFront.multiplyScalar(-this.deltaTime))
        }
        if (this.keyStates["KeyA"]) {
            this.playerDirection.z = 2
            const capsuleFront = new THREE.Vector3(0, 0, 1)
            this.capsule.getWorldDirection(capsuleFront)
            //侧方的方向，正前面的方向和胶囊的正上方求叉积，求出侧方的方向
            capsuleFront.cross(this.capsule.up)
            this.playerVelocity.add(capsuleFront.multiplyScalar(-this.deltaTime))
        }
        if (this.keyStates["KeyD"]) {
            this.playerDirection.z = 2
            const capsuleFront = new THREE.Vector3(0, 0, 1)
            this.capsule.getWorldDirection(capsuleFront)
            capsuleFront.cross(this.capsule.up)
            this.playerVelocity.add(capsuleFront.multiplyScalar(this.deltaTime))
        }
        if (this.keyStates["Space"]) {
            this.playerVelocity.y = 15
        }
    }


    protected init() {

    }

    protected onRenderer() {
        this.deltaTime = this.clock.getDelta()
        this.updatePlayer()
        this.controlPlayer()
        this.resetPlayer()
    }


}
