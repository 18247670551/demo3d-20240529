import * as THREE from "three"
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls"
import ThreeCore from "@/three-widget/ThreeCore"
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader"
import {Water} from "three/examples/jsm/objects/Water"
import {Lensflare, LensflareElement} from "three/examples/jsm/objects/Lensflare"
import {Sky} from "three/examples/jsm/objects/Sky"
import vertexShader from "./shader/rainbow/vertexShader.glsl"
import fragmentShader from "./shader/rainbow/fragmentShader.glsl"
import {GUI} from "dat.gui"
import {TransformControls} from "three/examples/jsm/controls/TransformControls"
import {getTextureLoader} from "@/three-widget/loader/ThreeLoader"

export default class ThreeProject extends ThreeCore {

    private readonly orbit: OrbitControls

    private readonly mixers: THREE.AnimationMixer[] = []
    private readonly water: Water

    private bird: THREE.Object3D | null = null

    // 鸟飞行轨迹
    private birdPath: THREE.CatmullRomCurve3
    private birdPathLine: THREE.Line
    // 轨迹锚点
    private birdPathLineAnchorPoints: THREE.Mesh[]

    private guiParams = {
        birdPathPreview: false,
    }


    private readonly birdPathPoints = [
        new THREE.Vector3(0, 50, -100), // 红
        new THREE.Vector3(100, 70, -150), // 绿
        new THREE.Vector3(150, 50, 0), // 蓝
        new THREE.Vector3(0, 60, 60), // 黄
        new THREE.Vector3(-150, 80, 40), // 棕
        new THREE.Vector3(-200, 70, -50), // 粉
    ]

    private loopTime = 10 * 1000 // 循环一圈的时间


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
        const textureFlare0 = getTextureLoader().load("/demo/island2/lensflare0.png")
        const textureFlare1 = getTextureLoader().load("/demo/island2/lensflare1.png")
        const lensflare = new Lensflare()

        lensflare.addElement(new LensflareElement(textureFlare0, 600, 0, pointLight.color))
        lensflare.addElement(new LensflareElement(textureFlare1, 60, .6))
        lensflare.addElement(new LensflareElement(textureFlare1, 70, .7))
        lensflare.addElement(new LensflareElement(textureFlare1, 120, .9))
        lensflare.addElement(new LensflareElement(textureFlare1, 70, 1))
        pointLight.add(lensflare)

        this.scene.add(pointLight)

        this.renderer.shadowMap.enabled = true
        this.renderer.toneMappingExposure = 1.25  //色调映射曝光度

        const orbit = new OrbitControls(this.camera, this.renderer.domElement)
        orbit.enableDamping = true
        orbit.enablePan = false
        orbit.maxPolarAngle = 1.5
        orbit.minDistance = 50
        orbit.maxDistance = 1200
        orbit.target.set(0, 30, 0)
        this.orbit = orbit

        // const axesHelper = new THREE.AxesHelper(100)
        // this.scene.add(axesHelper)


        // 海
        this.water = this.createWater()
        this.scene.add(this.water)



        // 天空
        const skyOptions = {
            turbidity: 1, //浑浊度
            rayleigh: 2, //阳光散射，黄昏效果的程度, 视觉效果就是傍晚晚霞的红光的深度
            mieCoefficient: 0.005, //散射系数, 太阳对比度，清晰度
            mieDirectionalG: 0.7, //定向散射值
            elevation: 3, //太阳高度
            azimuth: 180, //太阳水平方向位置
        }
        const {sky, sun} = this.createSky(skyOptions)
        this.scene.add(sky)

        // 把太阳矢量传给水面
        this.water.material.uniforms['sunDirection'].value.copy(sun).normalize()

        const pmremGenerator = new THREE.PMREMGenerator(this.renderer)
        this.scene.environment = pmremGenerator.fromScene(sky as any as THREE.Scene).texture




        // 彩虹
        const rainBow = this.createRainbow()
        rainBow.position.set(0, -50, -300)
        this.scene.add(rainBow)



        this.addIsland()


        // 下面给鸟飞行路径加了实体化预览, 加了标志点, 按颜色调试路径更方便
        const {anchorPoints, curve, curveLine} = this.createBirdPath()

        this.birdPathLineAnchorPoints = anchorPoints
        this.scene.add(...anchorPoints)

        this.birdPath = curve

        this.birdPathLine = curveLine
        this.scene.add(curveLine)


        this.addBird()

        this.addGUI()



        // 添加可编辑轨道能力
        const control = new TransformControls(this.camera, this.renderer.domElement)
        this.scene.add(control)

        const rayCaster = new THREE.Raycaster()
        const mouse = new THREE.Vector2()

        // 修改曲线后同步修改实体线条
        control.addEventListener('dragging-changed', (event) => {
            // 需要先关闭轨道控制器, 否则控制混乱
            this.orbit.enabled = !event.value
            if (!event.value) {
                const points = curve.getPoints(50)
                curveLine.geometry.setFromPoints(points)
            }
        })

        this.renderer.domElement.addEventListener('click', (event) => {
                // 取消默认的右键菜单等功能
                event.preventDefault()

                mouse.x = (event.offsetX / this.renderer.domElement.clientWidth) * 2 - 1
                mouse.y = -(event.offsetY / this.renderer.domElement.clientHeight) * 2 + 1

                // 更新射线投射器的起点和方向
                rayCaster.setFromCamera(mouse, this.camera)
                // 射线与模型相交的情况
                const intersects = rayCaster.intersectObjects(anchorPoints)

                if (intersects.length) {
                    const target = intersects[0].object
                    control.attach(target) // 绑定controls和方块
                } else {
                    control.detach()
                }
            },
            false
        )

    }

    private addGUI() {
        const gui = new GUI()
        gui.addFolder('飞行轨迹 锚点可编辑')
        gui.add(this.guiParams, "birdPathPreview").name("飞行轨迹").onChange(value => {
            this.birdPathLineAnchorPoints.forEach(anchorPoint => {
                anchorPoint.visible = value
            })
            this.birdPathLine.visible = value
        })
    }

    private createWater(){
        const waterTexture = getTextureLoader().load('/demo/island2/waternormals.jpg', texture => {
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
        return water
    }

    private createSky(skyOptions: any){

        // 天空, 必须同时创建太阳, 否则没有效果
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

        return {sky, sun}
    }

    private createRainbow(){

        const material = new THREE.ShaderMaterial({
            side: THREE.DoubleSide,
            uniforms: {},
            vertexShader: vertexShader,
            fragmentShader: fragmentShader,
            transparent: true,
            opacity: 0.2,
        })

        return new THREE.Mesh(
            new THREE.TorusGeometry(300, 15, 32, 64),
            material
        )
    }


    private addIsland(){
        const loader = new GLTFLoader()
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
    }


    private createBirdPath(){

        const anchorPoints = this.birdPathPoints.map(position => this.createAnchorPoint(position))

        const curve = new THREE.CatmullRomCurve3(
            // 这里参数一定要用 anchorPoints 的 position, 后面会做编辑飞行轨迹, 调整的是anchorPoint的position, 这里需要的是引用的 anchorPoint 的 position, curve才会同时跟着变
            anchorPoints.map(anchorPoint => anchorPoint.position),
            true,
            "chordal" //曲线类型
        )


        const curveLine = new THREE.LineLoop(
            new THREE.BufferGeometry().setFromPoints(curve.getPoints(1000)),
            new THREE.LineBasicMaterial({color: 0x00ff00})
        )
        curveLine.visible = false

        return {anchorPoints, curve, curveLine}
    }


    private addBird(){
        const loader = new GLTFLoader()
        loader.load("/demo/island2/flamingo.glb", gltf => {
            const bird = gltf.scene.children[0]
            bird.scale.set(0.2, 0.2, 0.2)

            //bird.position.set(-100, 80, -100)
            // 直接把鸟放在飞行路径上第一个点
            bird.position.copy(this.birdPath.getPointAt(0))

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
    }



    private createAnchorPoint(position: { x: number, y: number, z: number }) {
        const geometry = new THREE.SphereGeometry(2)
        const material = new THREE.MeshBasicMaterial({color: 0xff0000})
        const anchorPoint = new THREE.Mesh(geometry, material);
        anchorPoint.position.copy(position)
        anchorPoint.visible = false
        return anchorPoint
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



        const loopTime = this.loopTime

        const time = Date.now()
        const per = (time % loopTime) / loopTime // 计算当前时间进度百分比

        if(this.bird){
            const position = this.birdPath.getPointAt(per)
            this.bird!.position.copy(position)

            const tangent = this.birdPath.getTangentAt(per)
            const lookAtVec = tangent.add(position) // 位置向量和切线向量相加即为所需朝向的点向量
            this.bird!.lookAt(lookAtVec)
        }

    }

}
