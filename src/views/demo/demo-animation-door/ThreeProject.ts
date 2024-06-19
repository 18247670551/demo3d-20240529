import * as THREE from "three"
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls"
import ThreeCore from "@/three-widget/ThreeCore"
import * as BufferGeometryUtils from "three/examples/jsm/utils/BufferGeometryUtils"
import {GUI} from "dat.gui";


export default class ThreeProject extends ThreeCore {

    private readonly orbit: OrbitControls

    private readonly mixers: THREE.AnimationMixer[] = []

    private readonly animations: Record<string, any> = {}


    constructor(dom: HTMLElement) {

        super(dom, {
            cameraOptions: {
                fov: 45,
                near: 0.1,
                far: 10000
            }
        })

        this.camera.position.set(0, 0, 5000)
        this.scene.background = new THREE.Color(0x000000)

        const ambientLight = new THREE.AmbientLight(0xffffff, 1)
        this.scene.add(ambientLight)

        const directionalLight = new THREE.DirectionalLight(0xffffff, 2)
        directionalLight.position.set(6000, 3000, -30000)
        directionalLight.castShadow = true
        this.scene.add(directionalLight)

        const directionalLight2 = new THREE.DirectionalLight(0xffffff, 4)
        directionalLight2.position.set(6000, 3000, 30000)
        directionalLight2.castShadow = true
        this.scene.add(directionalLight2)

        this.renderer.shadowMap.enabled = true

        this.orbit = new OrbitControls(this.camera, this.renderer.domElement)
        this.orbit.target.y = 1500

        const axes = new THREE.AxesHelper(100)
        this.scene.add(axes)


        const width = 1200
        const height = 2000
        const doorFrameDepth = 200
        const doorDepth = 100

        const doorFramePart1Geo = new THREE.BoxGeometry(width + doorFrameDepth * 2, doorFrameDepth, doorFrameDepth)
        doorFramePart1Geo.translate(0, height + doorFrameDepth / 2, 0)
        const doorFramePart2Geo = new THREE.BoxGeometry(doorFrameDepth, height, doorFrameDepth)
        doorFramePart2Geo.translate(-width / 2 - (doorFrameDepth / 2), height / 2, 0)
        const doorFramePart3Geo = new THREE.BoxGeometry(doorFrameDepth, height, doorFrameDepth)
        doorFramePart3Geo.translate(width / 2 + (doorFrameDepth / 2), height / 2, 0)

        // 合并几何体
        const doorFrameGeo = BufferGeometryUtils.mergeGeometries([
            doorFramePart1Geo.toNonIndexed(), // 转换为非索引格式
            doorFramePart2Geo.toNonIndexed(),
            doorFramePart3Geo.toNonIndexed(),
        ])

        const doorFrameMat = new THREE.MeshStandardMaterial({color: "#733003"})
        const doorFrame = new THREE.Mesh(doorFrameGeo, doorFrameMat)
        this.scene.add(doorFrame)


        const doorWidth = width - 20
        const doorHeight = height - 20
        const doorGeo = new THREE.BoxGeometry(doorWidth, doorHeight, doorDepth)
        doorGeo.translate(doorWidth / 2, doorHeight / 2, 0)
        const doorMat = new THREE.MeshStandardMaterial({color: "#f39c1c"})
        const door = new THREE.Mesh(doorGeo, doorMat)
        //door.rotation.y = -Math.PI/2 //打开门时的角度
        door.position.x = -doorWidth / 2
        door.name = "door"
        this.scene.add(door)





        // 制作动画

        // 关键帧轨道
        const rotationTrack = new THREE.KeyframeTrack(
            // 这个 door.rotation[y] 中 door指的是 mesh 的 name 属性, 即: 模型应该给name赋值, 这里才能取到
            // 或者写 .rotation[y] 不要带名字, 则表示执行此动作的模型本身
            'door.rotation[y]',
            [0, 3],
            [0, -Math.PI / 2]
        )

        const clip = new THREE.AnimationClip(
            'open',
            3,
            // 动画轨道, 同轨道可以放多个动画
            [
                rotationTrack,
            ]
        )

        const mixer = new THREE.AnimationMixer(door)
        const clipAction = mixer.clipAction(clip)
        clipAction.setLoop(THREE.LoopOnce, 1) // 只播放一次, 默认为 infinity 循环播放
        clipAction.timeScale = 1 // 播放速度, 默认1, 为0时动画暂停, 负数时动画会反向执行

        this.mixers.push(mixer)
        this.animations["开门"] = clipAction

        this.addGUI()
    }

    private addGUI(){

        const guiParams = {
            "开门": () => {
                this.animations.timeScale = 1
                this.animations["开门"].play()
            },
            "关门": () => {
                this.animations.timeScale = -1
                this.animations["开门"].play()
            },
        }

        const gui = new GUI()

        gui.add(guiParams, "开门")
        gui.add(guiParams, "关门")




    }


    protected init() {
    }


    protected onRenderer() {
        this.orbit.update()
        //this.mixers.forEach(mixer => mixer.update(this.clock.getDelta()))
        this.mixers.forEach(mixer => mixer.update(1 / 60))
    }

}