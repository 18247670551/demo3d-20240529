import * as THREE from "three"
import ThreeCore from "@/three-widget/ThreeCore"
import {Octree} from "three/examples/jsm/math/Octree"
import {Capsule} from "three/examples/jsm/math/Capsule"

export default class ThreeProject extends ThreeCore {

    private deltaTime = 0



    // 物理世界
    private worldOctree: Octree
    // 重力
    private gravity = -9.8


    // 人物胶囊
    private player: THREE.Mesh
    // 人物胶囊的碰撞体
    private readonly playerCollider: Capsule


    // 玩家是否在地面上
    private playerIsOnGround = false
    // 玩家速度
    private playerVelocity = new THREE.Vector3(0, 0, 0)
    // 玩家方向
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

        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
        this.scene.add(ambientLight)

        const light1 = new THREE.DirectionalLight(0xffffff, 0.5)
        light1.position.set(0, 200, -300)
        light1.castShadow = true
        this.scene.add(light1)

        const shadowLight = new THREE.DirectionalLight(0xffffff, 3)
        shadowLight.position.set(0, 200, 300)
        shadowLight.castShadow = true
        this.scene.add(shadowLight)

        this.renderer.shadowMap.enabled = true
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap
        //this.renderer.toneMapping = THREE.ACESFilmicToneMapping


        // 创建地面
        const ground = new THREE.Mesh(
            new THREE.PlaneGeometry(40, 40, 1, 1),
            new THREE.MeshPhysicalMaterial({color: 0xcccccc})
        )
        ground.castShadow = true
        ground.receiveShadow = true
        ground.rotation.x = -Math.PI / 2
        // 在物理世界添加, 不需要在scene添加了
        //this.scene.add(ground)

        const stepGeometry = new THREE.BoxGeometry(2, 0.15, 1)
        const stepMaterial = new THREE.MeshStandardMaterial({color: 0x00ff00})

        const upStairs = new THREE.Group()
        // 创建立方体叠楼梯
        for (let i = 0; i < 10; i++) {
            const step = new THREE.Mesh(stepGeometry, stepMaterial)
            step.position.y = 0.15 + i * 0.2
            step.position.z = i * 0.4
            step.castShadow = true
            step.receiveShadow = true
            upStairs.add(step)
        }
        // 在物理世界添加, 不需要在scene添加了
        //this.scene.add(upStairs)




        // 创建人物胶囊
        const player = new THREE.Mesh(
            new THREE.CapsuleGeometry(0.35, 1, 32),
            new THREE.MeshStandardMaterial({color: 0xffff00})
        )
        player.castShadow = true
        player.receiveShadow = true
        player.position.set(0, 0.85, 0)
        this.player = player

        // 将相机作为胶囊的子元素，就可以实现跟随
        player.add(this.camera)
        this.camera.position.set(0, 2, -5)
        this.camera.lookAt(player.position)

        // 控制旋转上下的空3d对象
        const capsuleBodyControl = new THREE.Object3D()
        player.add(capsuleBodyControl)

        this.scene.add(player)

        // 人物胶囊的碰撞体  胶囊1.7米高, 半径为0.35
        this.playerCollider = new Capsule(
            // 椭球下焦点
            new THREE.Vector3(0, 0.35, 0),
            // 椭球上焦点
            new THREE.Vector3(0, 1.35, 0),
            // 半径
            0.35
        )




        // 创建物理世界-用于碰撞检测
        const worldOctree = new Octree()

        const group = new THREE.Group()
        // 添加地面
        group.add(ground)
        // 添加楼梯
        group.add(upStairs)


        worldOctree.fromGraphNode(group)

        this.worldOctree = worldOctree
        this.scene.add(group)






        // 多层次细节展示, 在屏幕边缘放置一个圆体用来测试
        // 就是将一个物体拆成多个, 多个重合在一起, 每个细节不一样, 离的远, 显示的数量少, 细节就少, 离的近显示的数量多, 细节就多
        const material = new THREE.MeshBasicMaterial({color: 0xff0000, wireframe: true})
        const lod = new THREE.LOD()
        for (let i = 0; i < 5; i++) {
            const geometry = new THREE.SphereGeometry(2, 22 - i * 5, 22 - i * 5)
            const mesh = new THREE.Mesh(geometry, material)
            lod.addLevel(mesh, i * 5)
        }
        lod.position.set(14, 2, 14)
        this.scene.add(lod)





        // 根据键盘按下的键来更新键盘的状态
        document.addEventListener("keydown", (event) => {
            // @ts-ignore
            this.keyStates[event.code] = true
            this.keyStates.isDown = true
        }, false)

        document.addEventListener("keyup", (event) => {
            // @ts-ignore
            this.keyStates[event.code] = false
            this.keyStates.isDown = false
        }, false)

        document.addEventListener("mousedown", (event) => {
            // 锁定鼠标指针
            document.body.requestPointerLock()
        }, false)

        // 根据鼠标在屏幕移动，来旋转胶囊
        window.addEventListener("mousemove", (event) => {
            // 控制左右的旋转
            player.rotation.y -= event.movementX * 0.003
            // 控制上下的旋转
            capsuleBodyControl.rotation.x += event.movementY * 0.003
            if (capsuleBodyControl.rotation.x > Math.PI / 8) {
                capsuleBodyControl.rotation.x = Math.PI / 8
            } else if (capsuleBodyControl.rotation.x < Math.PI / 8) {
                capsuleBodyControl.rotation.x = -Math.PI / 8
            }
        }, false)

    }



    // 进行碰撞检测
    private playerCollisions = () => {
        const result = this.worldOctree.capsuleIntersect(this.playerCollider)
        this.playerIsOnGround = false
        if (result) {
            this.playerIsOnGround = result.normal.y > 0
            this.playerCollider.translate(result.normal.multiplyScalar(result.depth))
        }
    }

    // 更新玩家的状态
    private updatePlayer = () => {

        let damping = -0.05

        if (this.playerIsOnGround) {
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
        this.playerCollider.getCenter(this.player.position)
        //进行碰撞检测
        this.playerCollisions()
    }

    // 重置玩家状态
    private resetPlayer = () => {
        // 如果掉下去了, 就重置到初始点
        if (this.player.position.y < -20) {
            this.playerCollider.start.set(0, 2.35, 0)
            this.playerCollider.end.set(0, 3.35, 0)
            this.playerCollider.radius = 0.35
            this.playerVelocity.set(0, 0, 0)
            this.playerDirection.set(0, 0, 0)
        }
    }

    // 根据键盘状态更新玩家速度
    private controlPlayer = () => {
        if (this.keyStates["KeyW"]) {
            this.playerDirection.z = 2
            //获取胶囊的正前方
            const capsuleFront = new THREE.Vector3(0, 0, 1)
            this.player.getWorldDirection(capsuleFront)
            //计算玩家的速度
            this.playerVelocity.add(capsuleFront.multiplyScalar(this.deltaTime))
        }
        if (this.keyStates["KeyS"]) {
            this.playerDirection.z = 2
            const capsuleFront = new THREE.Vector3(0, 0, 1)
            this.player.getWorldDirection(capsuleFront)
            this.playerVelocity.add(capsuleFront.multiplyScalar(-this.deltaTime))
        }
        if (this.keyStates["KeyA"]) {
            this.playerDirection.z = 2
            const capsuleFront = new THREE.Vector3(0, 0, 1)
            this.player.getWorldDirection(capsuleFront)
            //侧移的方向 = 正前面的方向和胶囊的正上方求叉积
            capsuleFront.cross(this.player.up)
            this.playerVelocity.add(capsuleFront.multiplyScalar(-this.deltaTime))
        }
        if (this.keyStates["KeyD"]) {
            this.playerDirection.z = 2
            const capsuleFront = new THREE.Vector3(0, 0, 1)
            this.player.getWorldDirection(capsuleFront)
            capsuleFront.cross(this.player.up)
            this.playerVelocity.add(capsuleFront.multiplyScalar(this.deltaTime))
        }
        if (this.keyStates["Space"]) {
            this.playerVelocity.y = 10
        }
    }


    protected init() {

    }

    protected onRenderer() {

        this.deltaTime = this.clock.getDelta()

        this.resetPlayer()
        this.controlPlayer()
        this.updatePlayer()
    }


}
