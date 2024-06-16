import * as THREE from "three"
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls"
import ThreeCore from "@/three-widget/ThreeCore"
import vertexShader from './shader/vertexShader.glsl'
import fragmentShader from './shader/fragmentShader.glsl'
import {DRACOLoader} from "three/examples/jsm/loaders/DRACOLoader"
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader"
import {SpriteMaterial} from "three"

export default class ThreeProject extends ThreeCore {

    private readonly orbit: OrbitControls
    private sound: THREE.Audio | null = null
    private curvePath: THREE.CatmullRomCurve3 | null = null
    private missile: THREE.Mesh | null = null
    private readonly bombFire: THREE.Sprite

    private readonly params = {
        iTime: {
            value: 0,
        },
    }

    constructor(dom: HTMLElement) {

        super(dom, {
            cameraOptions: {
                fov: 75,
                near: 0.1,
                far: 1000
            },
            rendererOptions: {
                antialias: true,
                alpha: true,
                // 深度缓冲, 解决模型重叠部分不停闪烁问题
                // 这个属性会导致精灵材质会被后面的物体遮挡(不知道什么原理),
                // 传入rendererOptions参数, 将此参数改为 false
                logarithmicDepthBuffer: false
            }
        })

        this.scene.background = new THREE.Color(0x000000)

        this.camera.position.set(0, 5, 10)

        const ambientLight = new THREE.AmbientLight(0xffffff, 2)
        this.scene.add(ambientLight)

        const directionalLight = new THREE.DirectionalLight(0xffffff, 2)
        directionalLight.position.set(1, 10, 1)
        directionalLight.castShadow = true
        this.scene.add(directionalLight)

        const directionalLight2 = new THREE.DirectionalLight(0xffffff, 1)
        directionalLight2.position.set(-1, -1, -1)
        directionalLight2.castShadow = true
        this.scene.add(directionalLight2)


        this.renderer.toneMapping = THREE.ACESFilmicToneMapping
        this.renderer.toneMappingExposure = 1
        this.renderer.shadowMap.enabled = true

        this.orbit = new OrbitControls(this.camera, this.renderer.domElement)


        const dracoLoader = new DRACOLoader()
        dracoLoader.setDecoderPath("/draco/")
        const dracoGltfLoader = new GLTFLoader()
        dracoGltfLoader.setDRACOLoader(dracoLoader)



        dracoGltfLoader.load("/demo/war/ew8.glb", (gltf) => {
            const obj = gltf.scene

            obj.traverse(child => {
                // @ts-ignore
                if (child.isMesh) {
                    child.castShadow = true
                    child.receiveShadow = true
                }
            })

            // 俄罗斯
            const els = obj.children[0] as THREE.Mesh
            // 乌克兰
            const wkl = obj.children[1] as THREE.Mesh
            // 导弹飞行轨迹
            const path = obj.children[2] as THREE.Mesh
            // 导弹飞行
            const missile = obj.children[3] as THREE.Mesh
            this.missile = missile

            this.scene.add(els, wkl, missile)

            // 创建曲线
            const points = [];
            for (let i = path.geometry.attributes.position.count - 1; i >= 0; i--) {
                points.push(
                    new THREE.Vector3(
                        path.geometry.attributes.position.array[i * 3],
                        path.geometry.attributes.position.array[i * 3 + 1],
                        path.geometry.attributes.position.array[i * 3 + 2]
                    )
                )
            }
            this.curvePath = new THREE.CatmullRomCurve3(points)
        })


        const spriteMaterial = new SpriteMaterial({
            color: 0xffffff,
            blending: THREE.AdditiveBlending,
        })
        spriteMaterial.onBeforeCompile = (shader) => {
            shader.uniforms.iResolution = {
                value: new THREE.Vector2(this.dom.clientWidth, this.dom.clientHeight),
            }
            shader.uniforms.iTime = this.params.iTime
            shader.uniforms.iChannel0 = {
                value: this.textureLoader.load("/demo/war/ichannel0.png"),
            }
            shader.uniforms.iChannel1 = {
                value: this.textureLoader.load("/demo/war/ichannel1.png"),
            }
            shader.uniforms.iChannel2 = {
                value: this.textureLoader.load("/demo/war/ichannel2.png"),
            }
            shader.uniforms.iMouse = {value: new THREE.Vector2(0, 0)}
            shader.vertexShader = shader.vertexShader.replace(
                "#include <common>",
                `
                #include <common>
                varying vec2 vUv;
                `
            )
            shader.vertexShader = shader.vertexShader.replace(
                "#include <uv_vertex>",
                `
                #include <uv_vertex>
                vUv = uv;
                `
            )
            // 不要使用这个顶点着色器, 普通顶点着色器使精灵材质失去永远面向你的特性, 要使用上面替换原着色器部分内容的方式
            //shader.vertexShader = vertexShader
            shader.fragmentShader = fragmentShader
        }

        const sprite = new THREE.Sprite(spriteMaterial)
        sprite.position.set(-5.5, 0.8, 0)
        this.bombFire = sprite


        const listener = new THREE.AudioListener()
        const sound = new THREE.Audio(listener)
        const audioLoader = new THREE.AudioLoader()
        audioLoader.load("/demo/war/bomb.mp3", (buffer) => {
            sound.setBuffer(buffer)
            sound.setVolume(0.5)
            // sound.setLoop(true)
            // sound.play()
        })
        this.sound = sound

    }

    protected init() {

    }

    protected onRenderer() {
        const time = this.clock.getElapsedTime()
        this.orbit.update()


        let t = time % 5
        t /= 5

        if (this.curvePath) {
            const point = this.curvePath.getPointAt(t)

            // 通过point设置模型dd位置
            // 获取点的切线
            const tangent = this.curvePath.getTangentAt(t)
            this.missile!.position.set(point.x, point.y, point.z)
            // 设置模型的朝向
            if (t + 0.01 < 1) {
                const point1 = this.curvePath.getPointAt(t + 0.01)
                this.missile!.lookAt(point1)
            }

            if (t > 0.95) {
                this.scene.add(this.bombFire!)
                // 判断声音是否播放，如果没有播放则播放
                if (!this.sound!.isPlaying) {
                    this.sound!.play()
                }
            }
        }
        this.params.iTime.value = t * 10
    }

}
