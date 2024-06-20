import * as THREE from "three"
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls"
import ThreeCore from "@/three-widget/ThreeCore"


export default class ThreeProject extends ThreeCore {

    private readonly orbit: OrbitControls
    private readonly audioCtx = new AudioContext()
    private readonly analyser = this.audioCtx.createAnalyser()
    private readonly source = this.audioCtx.createBufferSource()

    private readonly STEP = 50
    private readonly CUBE_NUM = Math.ceil(1024 / this.STEP)
    private readonly cubes :THREE.Group

    constructor(dom: HTMLElement) {

        super(dom, {
            cameraOptions: {
                fov: 45,
                near: 0.1,
                far: 10000
            }
        })

        this.camera.position.set(0, 300, 400)
        //this.scene.background = new THREE.Color(0x000000)

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
            const material = new THREE.MeshPhongMaterial({color: "#52d3fa"})
            const cube = new THREE.Mesh(geometry, material)
            cube.translateX((10 + 10) * i)
            cube.translateY(1)

            cubes.add(cube)
        }
        cubes.translateX(-(10 + 10) * this.CUBE_NUM / 2)

        this.scene.add(cubes)
        this.cubes = cubes


        fetch('/static/music/一路生花.mp3')
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


        // setTimeout(() => {
        //     this.play()
        // }, 5000)

    }

    protected init() {
    }

    protected onRenderer() {

        this.orbit.update()

        const {STEP, cubes} = this

        const frequencyData = new Uint8Array(this.analyser.frequencyBinCount)

        const averageFrequencyData = []

        for (let i = 0; i< frequencyData.length; i += STEP) {
            let sum = 0;
            for(let j = i; j < i + STEP; j++) {
                sum += frequencyData[j]
            }
            averageFrequencyData.push(sum / STEP)
        }

        this.analyser.getByteFrequencyData(frequencyData)

        for (let i = 0; i < averageFrequencyData.length; i++) {
            cubes.children[i].scale.y = Math.floor(averageFrequencyData[i] * 0.4)
        }

        //this.scene.rotateX(0.005)

    }

}