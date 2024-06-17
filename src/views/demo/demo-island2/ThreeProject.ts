import * as THREE from "three"
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls"
import ThreeCore from "@/three-widget/ThreeCore"
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader"
import {Water} from "three/examples/jsm/objects/Water"
import {Lensflare, LensflareElement} from "three/examples/jsm/objects/Lensflare"
import {Sky} from "three/examples/jsm/objects/Sky"
import vertexShader from "./shader/rainbow/vertexShader.glsl"
import fragmentShader from "./shader/rainbow/fragmentShader.glsl"
import {GUI} from "dat.gui";

export default class ThreeProject extends ThreeCore {

    private readonly orbit: OrbitControls
    private readonly mixers: THREE.AnimationMixer[] = []
    private readonly water: Water

    private bird: THREE.Object3D | null = null
    // 鸟飞行轨迹
    private birdPath: THREE.CatmullRomCurve3
    private birdPathLine: THREE.Line
    // 鸟飞行速度
    private birdVelocity = 0.001
    // 鸟飞行进度 0 - 1
    private progress = 0

    constructor(dom: HTMLElement) {

        super(dom, {
            cameraOptions: {
                fov: 55,
                near: 1,
                far: 20000
            }
        })

        this.camera.position.set(0, 50, 170)

        const ambientLight = new THREE.AmbientLight(0xffffff, 1)
        this.scene.add(ambientLight)

        const directionalLight1 = new THREE.DirectionalLight(0xffffff, 1)
        directionalLight1.position.set(100, 100, 100)
        this.scene.add(directionalLight1)

        const pointLight = new THREE.PointLight(0xffffff, 1.2)
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

        this.renderer.toneMappingExposure = 1.25  //色调映射曝光度

        const orbit = new OrbitControls(this.camera, this.renderer.domElement)
        orbit.enableDamping = true
        orbit.enablePan = false
        orbit.maxPolarAngle = 1.5
        orbit.minDistance = 50
        orbit.maxDistance = 1200
        orbit.target.set(0, 30, 0)
        this.orbit = orbit

        // const axes = new THREE.AxesHelper(100)
        // this.scene.add(axes)


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
        const skyOptions = {
            turbidity: 1, //浑浊度
            rayleigh: 2, //阳光散射，黄昏效果的程度, 视觉效果就是傍晚晚霞的红光的深度
            mieCoefficient: 0.005, //散射系数, 太阳对比度，清晰度
            mieDirectionalG: 0.7, //定向散射值
            elevation: 3, //太阳高度
            azimuth: 180, //太阳水平方向位置
        }
        const sky = new Sky()
        sky.scale.setScalar(10000)


        const phi = THREE.MathUtils.degToRad(90 - skyOptions.elevation)
        const theta = THREE.MathUtils.degToRad(skyOptions.azimuth)
        const sun = new THREE.Vector3()
        sun.setFromSphericalCoords(1, phi, theta)

        const skyUniforms = sky.material.uniforms
        skyUniforms['turbidity'].value = skyOptions.turbidity
        skyUniforms['rayleigh'].value = skyOptions.rayleigh
        skyUniforms['mieCoefficient'].value = skyOptions.mieCoefficient
        skyUniforms['mieDirectionalG'].value = skyOptions.mieDirectionalG
        skyUniforms['sunPosition'].value.copy(sun)
        water.material.uniforms['sunDirection'].value.copy(sun).normalize()

        const pmremGenerator = new THREE.PMREMGenerator(this.renderer)
        this.scene.environment = pmremGenerator.fromScene(sky as any as THREE.Scene).texture

        this.scene.add(sky)



        // 虹
        const material = new THREE.ShaderMaterial({
            side: THREE.DoubleSide,
            uniforms: {},
            vertexShader: vertexShader,
            fragmentShader: fragmentShader,
            transparent: true,
            opacity: 0.2,
        })
        const geometry = new THREE.TorusGeometry(300, 15, 32, 64)
        const torus = new THREE.Mesh(geometry, material)
        torus.position.set(0, -50, -300)
        this.scene.add(torus)


        const manager = new THREE.LoadingManager()
        manager.onProgress = async (url, loaded, total) => {
            if (Math.floor(loaded / total * 100) === 100) {
                //this.setState({ loadingProcess: Math.floor(loaded / total * 100) })
            } else {
                //this.setState({ loadingProcess: Math.floor(loaded / total * 100) })
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

        // 下面给鸟飞行路径加了实体化预览, 加了标志点, 按颜色调试路径更方便
        const pathPointPositions = [
            new THREE.Vector3(0, 50, -100), // 红
            new THREE.Vector3(100, 70, -150), // 绿
            new THREE.Vector3(150, 50, 0), // 蓝
            new THREE.Vector3(0, 60, 60), // 黄
            new THREE.Vector3(-150, 80, 40), // 棕
            new THREE.Vector3(-200, 70, -50), // 粉
        ]

        // 鸟飞行路径
        const birdPath = new THREE.CatmullRomCurve3(pathPointPositions, true,)
        this.birdPath = birdPath

        // 鸟飞行路径实体化预览
        const birdPathGeo = new THREE.BufferGeometry()
        birdPathGeo.setFromPoints(birdPath.getSpacedPoints(1000))
        const birdPathMat = new THREE.LineBasicMaterial({color: 0x00ff00, linewidth: 10})
        const birdPathLine = new THREE.Line(birdPathGeo, birdPathMat)
        this.birdPathLine = birdPathLine
        this.birdPathLine.visible = false
        this.scene.add(birdPathLine)

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
        birdPathLine.add(pathPoints)


        // 鸟
        loader.load("/demo/island2/flamingo.glb", gltf => {
            const bird = gltf.scene.children[0]
            bird.scale.set(0.2, 0.2, 0.2)

            //bird.position.set(-100, 80, -100)
            // 直接把鸟放在飞行路径上第一个点
            bird.position.copy(birdPath.getPointAt(0))

            bird.castShadow = true
            this.scene.add(bird)
            this.bird = bird

            const bird2 = bird.clone()
            bird2.position.set(100, 70, -100)
            this.scene.add(bird2)

            const mixer = new THREE.AnimationMixer(bird)
            mixer.clipAction(gltf.animations[0]).setDuration(1.2).play()
            this.mixers.push(mixer)

            const mixer2 = new THREE.AnimationMixer(bird2)
            mixer2.clipAction(gltf.animations[0]).setDuration(1.8).play()
            this.mixers.push(mixer2)
        })

        this.addGUI()

    }

    // 让模型沿着运动轨迹移动
    private birdUpdate() {
        if (this.progress <= 1 - this.birdVelocity) {
            // 用当前点和目标点计算出鸟头朝向
            const current = this.birdPath.getPointAt(this.progress)
            const target = this.birdPath.getPointAt(this.progress + this.birdVelocity)

            this.bird!.position.set(current.x, current.y, current.z)

            const mtx = new THREE.Matrix4()
            mtx.lookAt(target, this.bird!.position, this.bird!.up)
            // THREE.Euler 参数值跟模型默认朝向有关, 如果出现模型倒跑侧跑, 调整XYZ轴顺序,
            // 模型默认朝向Z轴正方向的, 不需要 mtx.multiply() 这步旋转角度
            // 其它情况, 会导致出现倒着跑或侧着跑的现象,
            // 尝试调整旋转角度, 模型默认朝向X轴正方向的, 参数为 new THREE.Euler(0, -Math.PI / 2, 0, 'XYZ')
            // 建议做模型时, 让模型默认朝向为Z轴正方向
            //mtx.multiply(new THREE.Matrix4().makeRotationFromEuler(new THREE.Euler(0, 0, 0, 'XYZ')))


            const rotation = new THREE.Quaternion().setFromRotationMatrix(mtx)
            this.bird!.quaternion.slerp(rotation, 0.2)

            this.progress += this.birdVelocity
        } else {
            this.progress = 0
        }
    }

    private addGUI() {
        const gui = new GUI()
        gui.add(this.birdPathLine, "visible").name("飞行轨迹")
    }


    protected init() {

    }


    protected onRenderer() {
        this.orbit.update()

        this.mixers.forEach(item => {
            item.update(1 / 60)
        })

        // 让场景略微上下晃动
        this.camera.position.y += Math.sin(this.clock.getElapsedTime()) / 40

        this.water.material.uniforms.time.value += 1 / 60

        // 鸟飞行路径
        if (this.bird) {
            this.birdUpdate()
        }

    }

}
