import * as THREE from "three"
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls"
import ThreeCore from "@/three-widget/ThreeCore"
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader"
import {Water} from "three/examples/jsm/objects/Water"
import {Lensflare, LensflareElement} from "three/examples/jsm/objects/Lensflare"
import {Sky} from "three/examples/jsm/objects/Sky"
import vertexShader from "./shader/rainbow/vertexShader.glsl"
import fragmentShader from "./shader/rainbow/fragmentShader.glsl"

export default class ThreeProject extends ThreeCore {

    private readonly orbit: OrbitControls
    private readonly mixers: THREE.AnimationMixer[] = []
    private readonly water: Water

    constructor(dom: HTMLElement) {

        super(dom, {
            cameraOptions: {
                fov: 55,
                near: 1,
                far: 20000
            }
        })

        this.camera.position.set(0, 50, 170)

        const ambientLight = new THREE.AmbientLight(0xffffff, 0.8)
        this.scene.add(ambientLight)

        const directionalLight1 = new THREE.DirectionalLight(0xffffff, 1)
        directionalLight1.color.setHSL(.1, 1, .95)
        directionalLight1.position.set(-1, 1.75, 1)
        directionalLight1.position.multiplyScalar(30)
        this.scene.add(directionalLight1)


        const pointLight = new THREE.PointLight(0xffffff, 1.2, 2000)
        pointLight.color.setHSL(.995, .5, .9)
        pointLight.position.set(0, 45, -2000)

        // 镜头光晕
        const textureFlare0 = this.textureLoader.load("/demo/island2/lensflare0.png")
        const textureFlare1 = this.textureLoader.load("/demo/island2/lensflare1.png")
        const lensflare = new Lensflare()

        lensflare.addElement(new LensflareElement(textureFlare0, 600, 0, pointLight.color))
        lensflare.addElement(new LensflareElement(textureFlare1, 60, .6))
        lensflare.addElement(new LensflareElement(textureFlare1, 70, .7))
        lensflare.addElement(new LensflareElement(textureFlare1, 120, .9))
        lensflare.addElement(new LensflareElement(textureFlare1, 70, 1))
        pointLight.add(lensflare)

        this.scene.add(pointLight)

        const orbit = new OrbitControls(this.camera, this.renderer.domElement)
        orbit.enableDamping = true
        orbit.enablePan = false
        orbit.maxPolarAngle = 1.5
        orbit.minDistance = 50
        orbit.maxDistance = 1200
        orbit.target.set(0, 30, 0)
        this.orbit = orbit


        // 海
        const waterTexture = this.textureLoader.load('/demo/island2/waternormals.jpg', texture => {
            texture.wrapS = texture.wrapT = THREE.RepeatWrapping
        })
        const waterGeometry = new THREE.PlaneGeometry(10000, 10000)
        const water = new Water(waterGeometry, {
            textureWidth: 512,
            textureHeight: 512,
            waterNormals: waterTexture,
            sunDirection: new THREE.Vector3(),
            sunColor: 0xffffff,
            waterColor: 0x0072ff,
            distortionScale: 4,
            fog: this.scene.fog !== undefined
        });
        water.rotation.x = -Math.PI / 2
        this.scene.add(water)
        this.water = water


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
        water.material.uniforms['sunDirection'].value.copy(sun).normalize()
        this.scene.environment = pmremGenerator.fromScene(this.scene).texture

        // 虹
        const material = new THREE.ShaderMaterial({
            side: THREE.DoubleSide,
            transparent: true,
            uniforms: {},
            vertexShader: vertexShader,
            fragmentShader: fragmentShader
        })
        const geometry = new THREE.TorusGeometry(260, 14, 32, 64)
        const torus = new THREE.Mesh(geometry, material)
        //torus.opacity = .1 // todo
        torus.position.set(0, -50, -400)
        this.scene.add(torus)


        const manager = new THREE.LoadingManager()
        manager.onProgress = async (url, loaded, total) => {
            if (Math.floor(loaded / total * 100) === 100) {
                //this.setState({ loadingProcess: Math.floor(loaded / total * 100) });
            } else {
                //this.setState({ loadingProcess: Math.floor(loaded / total * 100) });
            }
        }

        // 岛
        const loader = new GLTFLoader(manager)
        loader.load("/demo/island2/island.glb", gltf => {
            gltf.scene.traverse((child: any) => {
                if (child.isMesh) {
                    child.material.metalness = .4
                    child.material.roughness = .6
                }
            })
            gltf.scene.position.set(0, -2, 0)
            gltf.scene.scale.set(33, 33, 33)
            this.scene.add(gltf.scene)
        })


        // 鸟
        loader.load("/demo/island2/flamingo.glb", gltf => {
            const mesh = gltf.scene.children[0]
            mesh.scale.set(.35, .35, .35)
            mesh.position.set(-100, 80, -100)
            mesh.rotation.y = -Math.PI / 3
            mesh.castShadow = true
            this.scene.add(mesh)

            const bird2 = mesh.clone()
            bird2.position.set(150, 90, -300)
            this.scene.add(bird2)

            const mixer = new THREE.AnimationMixer(mesh)
            mixer.clipAction(gltf.animations[0]).setDuration(1.2).play()
            this.mixers.push(mixer)

            const mixer2 = new THREE.AnimationMixer(bird2)
            mixer2.clipAction(gltf.animations[0]).setDuration(1.8).play()
            this.mixers.push(mixer2)
        });



    }


    protected init() {

    }


    protected onRenderer() {
        const delta = this.clock.getDelta()

        this.orbit.update()

        this.water.material.uniforms.time.value += 1 / 60

        this.mixers.forEach(item => {
            item.update(delta)
        })

        this.camera.position.y += Math.sin(this.clock.getElapsedTime()) / 30
    }

}
