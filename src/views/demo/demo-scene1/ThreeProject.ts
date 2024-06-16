import * as THREE from "three"
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls"
import ThreeCore from "@/three-widget/ThreeCore"
import grassPic from "./texture/grass.jpg"
import treePic from "./texture/tree.png"
import roadPic from "./texture/road.jpg"
import {Sky} from "three/examples/jsm/objects/Sky"


export default class ThreeProject extends ThreeCore {

    private readonly orbit: OrbitControls

    constructor(dom: HTMLElement) {

        super(dom, {
            cameraOptions: {
                fov: 45,
                near: 0.1,
                far: 1000
            }
        })

        this.camera.position.set(0, 5, 15)
        this.scene.background = new THREE.Color(0x000000)

        const ambientLight = new THREE.AmbientLight(0xffffff, 1)
        this.scene.add(ambientLight)

        const light = new THREE.DirectionalLight(0xffffff, 1)
        light.position.set(0, 60, -60)
        light.castShadow = true
        this.scene.add(light)

        const shadowLight = new THREE.DirectionalLight(0xffffff, 4)
        shadowLight.position.set(0, 60, 60)
        shadowLight.castShadow = true
        this.scene.add(shadowLight)

        this.renderer.shadowMap.enabled = true

        this.orbit = new OrbitControls(this.camera, this.renderer.domElement)
        this.orbit.target.y = 2

        // const axes = new THREE.AxesHelper(5)
        // this.scene.add(axes)


        const worldWidth = 100
        const worldHeight = 100
        const grassColor = 0xc0ea3b
        const roadWidth = 10

        const grassTexture = this.textureLoader.load(grassPic)
        const roadTexture = this.textureLoader.load(roadPic)


        const grassGeo = new THREE.PlaneGeometry(worldWidth, worldHeight)
        const grassMat = new THREE.MeshLambertMaterial({
            color: grassColor,
            map: grassTexture
        })

        grassMat.map!.wrapS = grassMat.map!.wrapT = THREE.RepeatWrapping
        grassMat.map!.repeat.set(128, 128)

        const grass = new THREE.Mesh(grassGeo, grassMat)
        grass.rotation.x = -Math.PI / 2
        grass.position.y = -0.01
        this.scene.add(grass)

        const roadGeo = new THREE.PlaneGeometry(roadWidth, worldHeight)
        const roadMat = new THREE.MeshPhongMaterial({
            color: 0xffffff,
            map: roadTexture
        })

        roadMat.map!.wrapS = roadMat.map!.wrapT = THREE.RepeatWrapping
        roadMat.map!.repeat.set(1, 16)


        const road = new THREE.Mesh(roadGeo, roadMat)
        road.receiveShadow = true
        road.rotation.x = -Math.PI / 2
        this.scene.add(road)




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
        this.scene.environment = pmremGenerator.fromScene(this.scene).texture


        // 添加树
        const treeMaterial = new THREE.MeshPhysicalMaterial({
            map: new THREE.TextureLoader().load(treePic),
            transparent: true,
            side: THREE.DoubleSide,
            metalness: .2,
            roughness: .8,
            depthTest: true,
            depthWrite: false,
            fog: false,
            reflectivity: 0.1,
        })

        const treeCustomDepthMaterial = new THREE.MeshDepthMaterial({
            depthPacking: THREE.RGBADepthPacking,
            map: new THREE.TextureLoader().load(treePic),
            alphaTest: 0.5
        })

        const treeGeo = new THREE.PlaneGeometry(2, 4)
        treeGeo.translate(0, 2, 0)
        const treePlan1 = new THREE.Mesh(treeGeo)
        treePlan1.material = treeMaterial
        treePlan1.customDepthMaterial = treeCustomDepthMaterial
        const treePlan2 = treePlan1.clone()
        treePlan2.rotation.y += Math.PI/4
        const treePlan3 = treePlan2.clone()
        treePlan3.rotation.y += Math.PI/4
        const treePlan4 = treePlan3.clone()
        treePlan4.rotation.y += Math.PI/4

        const tree = new THREE.Group()
        tree.add(treePlan1, treePlan2, treePlan3, treePlan4)
        tree.position.set(-10, 0, -10)
        this.scene.add(tree)

        // 创建五环
        const cycleGeo = new THREE.TorusGeometry(10, 1, 10, 32)
        const cycleMat1 = new THREE.MeshLambertMaterial({color: 0x0885c2})
        const cycleMat2 = new THREE.MeshLambertMaterial({color: 0xfbb132})
        const cycleMat3 = new THREE.MeshLambertMaterial({color: 0x000000})
        const cycleMat4 = new THREE.MeshLambertMaterial({color: 0x1c8b3c})
        const cycleMat5 = new THREE.MeshLambertMaterial({color: 0xed334e})

        const cycle1 = new THREE.Mesh(cycleGeo, cycleMat1)
        const cycle2 = new THREE.Mesh(cycleGeo, cycleMat2)
        const cycle3 = new THREE.Mesh(cycleGeo, cycleMat3)
        const cycle4 = new THREE.Mesh(cycleGeo, cycleMat4)
        const cycle5 = new THREE.Mesh(cycleGeo, cycleMat5)


        // 以第三个为中间, 向两边延展
        cycle1.position.set(-25, 0, 0)
        cycle2.position.set(-12.5, -10, -0.5)
        cycle3.position.set(0, 0, 0)
        cycle4.position.set(12.5, -10, 0.5)
        cycle5.position.set(25, 0, 0)


        const cycles = new THREE.Group()
        cycles.add(
            cycle1,
            cycle2,
            cycle3,
            cycle4,
            cycle5,
        )
        cycles.scale.set(0.1, 0.1, 0.1)
        cycles.position.y = 5

        this.scene.add(cycles)
    }

    protected init() {
    }


    protected onRenderer() {
        const elapsed = this.clock.getElapsedTime()
        this.orbit.update()
    }

}