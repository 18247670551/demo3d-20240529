import * as THREE from "three"
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls"
import ThreeCore from "@/three-widget/ThreeCore"
import grassPic from "./texture/grass.jpg"
import roofPic from "./texture/roof.jpg"
import brick1_1Pic from "./texture/brick/brick1_1.jpg"
import brick1_2Pic from "./texture/brick/brick1_2.jpg"
import door_alphaPic from "@/views/demo/demo-texture-door/texture/door/alpha.jpg"
import door_ambientOcclusionPic from "@/views/demo/demo-texture-door/texture/door/ambientOcclusion.jpg"
import door_colorPic from "@/views/demo/demo-texture-door/texture/door/color.jpg"
import door_heightPic from "@/views/demo/demo-texture-door/texture/door/height.jpg"
import door_metalnessPic from "@/views/demo/demo-texture-door/texture/door/metalness.jpg"
import door_normalPic from "@/views/demo/demo-texture-door/texture/door/normal.jpg"
import door_roughnessPic from "@/views/demo/demo-texture-door/texture/door/roughness.jpg"
import {getTextureLoader} from "@/three-widget/loader/ThreeLoader"

export default class ThreeProject extends ThreeCore {

    private readonly orbit: OrbitControls
    private readonly ghost1: THREE.PointLight
    private readonly ghost2: THREE.PointLight
    private readonly ghost3: THREE.PointLight
    private readonly ghost4: THREE.PointLight


    constructor(dom: HTMLElement) {

        super(dom, {
            cameraOptions: {
                fov: 45,
                near: 0.1,
                far: 1000
            }
        })

        //this.camera.position.set(5, 6, 20)
        this.camera.position.set(5, 6, 25)
        this.scene.background = new THREE.Color(0x000000)

        this.scene.fog = new THREE.Fog('#262837', 20, 58)

        this.renderer.shadowMap.enabled = true

        this.orbit = new OrbitControls(this.camera, this.renderer.domElement)
        this.orbit.target.y = 5


        // const axesHelper = new THREE.AxesHelper(100)
        // this.scene.add(axesHelper)



        const ambientLight = new THREE.AmbientLight('#b9d5ff', 0.1)
        this.scene.add(ambientLight)



        const moonLight = new THREE.PointLight("#b9d5ff", 5)
        moonLight.decay = 0.6
        moonLight.position.set(10, 10, -20)

        const moonGeo = new THREE.SphereGeometry(3)
        const moonMat = new THREE.MeshMatcapMaterial({color: "#edcfa3"})
        const moon = new THREE.Mesh(moonGeo, moonMat)
        moon.position.set(20, 15, -30)
        moon.add(moonLight)
        this.scene.add(moon)


        /**
         * 地板
         */
        const floorRadius = 30
        const grassColorTexture = getTextureLoader().load(grassPic, texture => {
            texture.wrapS = texture.wrapT = THREE.RepeatWrapping
            texture.repeat.set(10, 10)
        })


        const floor = new THREE.Mesh(
            new THREE.CircleGeometry(floorRadius),
            new THREE.MeshStandardMaterial({
                color: "#717e05",
                side: THREE.DoubleSide,
                map: grassColorTexture,
                //roughnessMap:grassRoughnessTexture,
                //normalMap:grassNormalTexture,
                //aoMap:grassAomapTexture
            })
        )
        // floor.geometry.setAttribute('uv2', new THREE.Float32BufferAttribute(floor.geometry.attributes.uv.array,2))
        // grassColorTexture.repeat.set(8,8)
        // grassAomapTexture.repeat.set(8,8)
        // grassNormalTexture.repeat.set(8,8)
        // grassRoughnessTexture.repeat.set(8,8)
        // grassAomapTexture.wrapS=THREE.RepeatWrapping
        // grassColorTexture.wrapS=THREE.RepeatWrapping
        // grassNormalTexture.wrapS=THREE.RepeatWrapping
        // grassRoughnessTexture.wrapS=THREE.RepeatWrapping
        //
        // grassAomapTexture.wrapT=THREE.RepeatWrapping
        // grassColorTexture.wrapT=THREE.RepeatWrapping
        // grassNormalTexture.wrapT=THREE.RepeatWrapping
        // grassRoughnessTexture.wrapT=THREE.RepeatWrapping


        floor.rotation.x = -Math.PI * 0.5
        this.scene.add(floor)




        /**
         * 房子
         */
        const houseHeight = 2.5
        const houseWidth = 4
        const roofHeight = 1.5

        const house = new THREE.Group()
        this.scene.add(house)

        const pontLight = new THREE.PointLight('#ff7d46', 1, 15)
        house.add(pontLight)
        pontLight.position.set(0, 2.2, 2.7)

        /**
         * 屋顶
         */
        const roofTexture = getTextureLoader().load(roofPic)
        const roofGeo = new THREE.ConeGeometry(houseWidth / 2 * 1.8, roofHeight, 4)
        roofGeo.translate(0, roofHeight / 2, 0)
        const roofMat = new THREE.MeshStandardMaterial({color: "#fa7e58", map: roofTexture})
        const roof = new THREE.Mesh(roofGeo, roofMat)
        roof.position.y = houseHeight
        roof.rotation.y = Math.PI / 4
        house.add(roof)


        /**
         * 墙
         */
        const wallsColorTexture = getTextureLoader().load(brick1_1Pic)
        const wallsAlphaTexture = getTextureLoader().load(brick1_2Pic)
        wallsColorTexture.wrapT = wallsColorTexture.wrapS = THREE.RepeatWrapping
        wallsColorTexture.repeat.set(2, 2)
        wallsAlphaTexture.wrapT = wallsAlphaTexture.wrapS = THREE.RepeatWrapping
        wallsAlphaTexture.repeat.set(2, 2)
        const wallsGeo = new THREE.BoxGeometry(houseWidth, houseHeight, houseWidth)
        const wallsMat = new THREE.MeshStandardMaterial({
            map: wallsColorTexture,
            transparent: true,
            alphaMap: wallsAlphaTexture, // alpha贴图是一张灰度纹理，用于控制整个表面的不透明度
            //roughnessMap: wallsRoughnessTexture,
            //normalMap: wallsNormalTexture,
            //aoMap: wallsAomapTexture
        })
        const walls = new THREE.Mesh(wallsGeo, wallsMat)
        //walls.geometry.setAttribute('uv2', new THREE.Float32BufferAttribute(walls.geometry.attributes.uv.array, 2))
        walls.position.y = houseHeight / 2
        house.add(walls)


        /**
         * 门
         */
        const door_alphaTexture = getTextureLoader().load(door_alphaPic)
        const door_ambientTexture = getTextureLoader().load(door_ambientOcclusionPic)
        const door_colorTexture = getTextureLoader().load(door_colorPic)
        const door_heightTexture = getTextureLoader().load(door_heightPic)
        const door_metalnessTexture = getTextureLoader().load(door_metalnessPic)
        const door_normalTexture = getTextureLoader().load(door_normalPic)
        const door_roughnessTexture = getTextureLoader().load(door_roughnessPic)

        const door = new THREE.Mesh(
            new THREE.PlaneGeometry(2.2, 2.2, 100, 100),
            new THREE.MeshStandardMaterial({
                map: door_colorTexture, // 颜色贴图
                aoMapIntensity: 0.7,
                alphaMap: door_alphaTexture, // alpha贴图是一张灰度纹理，用于控制整个表面的不透明度
                transparent: true,
                aoMap: door_ambientTexture, // 该纹理的红色通道用作环境遮挡贴图。默认值为null。aoMap需要第二组UV
                side: THREE.DoubleSide,
                metalness: 1,
                metalnessMap: door_metalnessTexture,
                roughness: 1,
                roughnessMap: door_roughnessTexture, // 黑色粗糙，白色光滑
                displacementMap: door_heightTexture,
                displacementScale: 0.1,
                normalMap: door_normalTexture,
            })
        )
        door.position.set(0, 1, houseWidth / 2 + 0.01)
        door.geometry.setAttribute('uv2', new THREE.Float32BufferAttribute(door.geometry.attributes.uv.array, 2))
        house.add(door)


        /**
         * 灌木
         */
        const bushGeometry = new THREE.SphereGeometry(1, 16, 16)
        const bushMaterial = new THREE.MeshStandardMaterial({color: "#89c854"})

        const bush1 = new THREE.Mesh(bushGeometry, bushMaterial)
        bush1.scale.set(0.5, 0.5, 0.5)
        bush1.position.set(1, 0.2, 2.2)

        const bush2 = new THREE.Mesh(bushGeometry, bushMaterial)
        bush2.scale.set(0.25, 0.25, 0.25)
        bush2.position.set(1.6, 0.1, 2.1)

        const bush3 = new THREE.Mesh(bushGeometry, bushMaterial)
        bush3.scale.set(0.4, 0.4, 0.4)
        bush3.position.set(-1, 0.1, 2.2)

        const bush4 = new THREE.Mesh(bushGeometry, bushMaterial)
        bush4.scale.set(0.15, 0.15, 0.15)
        bush4.position.set(-1.2, 0.05, 2.6)

        house.add(bush1, bush2, bush3, bush4)


        /**
         * 墓碑
         */
        const graves = new THREE.Group();
        const graveGeometry = new THREE.BoxGeometry(0.6, 0.8, 0.2)
        const graveMaterial = new THREE.MeshStandardMaterial({color: "#b2b6b1"})
        const grave = new THREE.Mesh(graveGeometry, graveMaterial)
        const graveCount = 150
        for (let i = 0; i < graveCount; i++) {
            const angle = Math.random() * Math.PI * 2
            const radius = 7 + Math.random() * 20
            const item = grave.clone()
            const x = Math.sin(angle) * radius
            const z = Math.cos(angle) * radius
            item.position.set(x, 0.3, z)
            item.rotation.z = (Math.random() - 0.5) * 0.4
            item.rotation.y = (Math.random() - 0.5) * 0.4
            graves.add(item)
        }
        this.scene.add(graves)


        /**
         * 鬼魂
         */
        const ghost1 = new THREE.PointLight("#ff00ff", 1.5)
        const ghost2 = new THREE.PointLight("#00ffff", 1.5)
        const ghost3 = new THREE.PointLight("#ffff00", 1.5)
        const ghost4 = new THREE.PointLight("#36f15b", 1.5)
        this.ghost1 = ghost1
        this.ghost2 = ghost2
        this.ghost3 = ghost3
        this.ghost4 = ghost4
        this.scene.add(ghost1, ghost2, ghost3, ghost4)


        moonLight.castShadow = true
        pontLight.castShadow = true

        walls.receiveShadow = true
        door.receiveShadow = true
        floor.receiveShadow = true


        for (let i = 0; i < graveCount; i++) {
            graves.children[i].castShadow = true
        }

        ghost1.castShadow = true
        ghost2.castShadow = true
        ghost3.castShadow = true
        ghost4.castShadow = true
    }


    protected init() {
    }


    protected onRenderer() {
        const elapsedTime = this.clock.getElapsedTime()
        this.orbit.update()

        this.ghost1.position.x = Math.cos(elapsedTime) * 2 + 7
        this.ghost1.position.z = Math.sin(elapsedTime) * 2 + 7
        this.ghost1.position.y = Math.sin(elapsedTime * 2) * 2

        this.ghost2.position.x = Math.cos(elapsedTime) * 4 + 10
        this.ghost2.position.z = Math.cos(elapsedTime) * 4 + 10
        this.ghost2.position.y = -Math.sin(elapsedTime * 2) * 2

        const ghost3Angle = -elapsedTime * 0.18
        this.ghost3.position.x = Math.cos(ghost3Angle) * (7 + Math.sin(elapsedTime * 0.32))
        this.ghost3.position.z = Math.sin(ghost3Angle) * (7 + Math.sin(elapsedTime * 0.5))
        this.ghost3.position.y = Math.sin(elapsedTime * 3) + Math.sin(elapsedTime * 2.5)

        this.ghost4.position.x = -(Math.cos(elapsedTime) * 4 + 10)
        this.ghost4.position.z = -(Math.cos(elapsedTime) * 4 + 10)
        this.ghost4.position.y = -Math.sin(elapsedTime * 2) * 2

    }

}