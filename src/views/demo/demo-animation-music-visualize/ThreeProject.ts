import * as THREE from "three"
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls"
import ThreeCore from "@/three-widget/ThreeCore"


export default class ThreeProject extends ThreeCore {

    private readonly orbit: OrbitControls
    private readonly audioCtx = new AudioContext()
    private readonly analyser = this.audioCtx.createAnalyser()
    private readonly source = this.audioCtx.createBufferSource()

    private readonly STEP = 10
    private readonly CUBE_NUM = Math.ceil(1024 / this.STEP)
    private readonly cubes: THREE.Group

    constructor(dom: HTMLElement) {

        super(dom, {

            // 注意相机参数, 传的 s, 不是 fov , 使用的是正交相机, 透视相机的近大远小在此场景不合适
            cameraOptions: {
                s: 500,
                near: 0.1,
                far: 10000
            }
        })

        this.camera.position.set(0, 0, 800)
        this.scene.background = new THREE.Color(0x000000)

        // const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
        // this.scene.add(ambientLight)

        const pointLight = new THREE.PointLight(0xffffff)
        pointLight.position.set(0, 300, 40)
        this.scene.add(pointLight)

        this.renderer.shadowMap.enabled = true

        this.orbit = new OrbitControls(this.camera, this.renderer.domElement)

        // const axes = new THREE.AxesHelper(100)
        // this.scene.add(axes)


        const cubes = new THREE.Group()

        for (let i = 0; i < this.CUBE_NUM; i++) {
            const geometry = new THREE.BoxGeometry(10, 10, 10)
            const material = new THREE.MeshBasicMaterial({color: "#52d3fa"})
            const cube = new THREE.Mesh(geometry, material)
            cube.translateX((10 + 10) * i)
            cubes.add(cube)
        }
        cubes.translateX(-(10 + 10) * this.CUBE_NUM / 2)

        this.scene.add(cubes)
        this.cubes = cubes

        fetch('/static/music/喀什葛尔胡杨.mp3')
            .then(function (response) {
                if (!response.ok) {
                    throw new Error("HTTP error, status = " + response.status)
                }
                return response.arrayBuffer()
            })
            .then((arrayBuffer) => {
                this.audioCtx.decodeAudioData(arrayBuffer, decodedData => {
                    this.source.buffer = decodedData
                    this.source.connect(this.analyser)
                    this.analyser.connect(this.audioCtx.destination)
                })
            })
            .then(() => {
                this.source.start(0)
            })

    }

    protected init() {
    }

    protected onRenderer() {

        this.orbit.update()

        const {STEP, cubes} = this

        const frequencyData = new Uint8Array(this.analyser.frequencyBinCount)
        this.analyser.getByteFrequencyData(frequencyData)
        const averageFrequencyData = []

        for (let i = 0; i < frequencyData.length; i += STEP) {
            let sum = 0;
            for (let j = i; j < i + STEP; j++) {
                sum += frequencyData[j]
            }
            averageFrequencyData.push(sum / STEP)
        }

        for (let i = 0; i < averageFrequencyData.length; i++) {
            cubes.children[i].scale.y = Math.floor(averageFrequencyData[i] * 0.3)
        }

    }

    protected onDestroy() {
        this.analyser.disconnect()
        this.source.disconnect()
        this.audioCtx.close()
    }

}