import * as THREE from "three"
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls"
import ThreeCore from "@/three-widget/ThreeCore"
import grassPic from "./texture/grass.jpg"
import topPic from "./texture/top.jpg"
import brick1_1Pic from "./texture/brick/brick1_1.jpg"
import brick1_2Pic from "./texture/brick/brick1_2.jpg"
import door_alphaPic from "@/views/demo/demo-texture-door/texture/door/alpha.jpg"
import door_ambientOcclusionPic from "@/views/demo/demo-texture-door/texture/door/ambientOcclusion.jpg"
import door_colorPic from "@/views/demo/demo-texture-door/texture/door/color.jpg"
import door_heightPic from "@/views/demo/demo-texture-door/texture/door/height.jpg"
import door_metalnessPic from "@/views/demo/demo-texture-door/texture/door/metalness.jpg"
import door_normalPic from "@/views/demo/demo-texture-door/texture/door/normal.jpg"
import door_roughnessPic from "@/views/demo/demo-texture-door/texture/door/roughness.jpg"


export default class ThreeProject extends ThreeCore {

    private readonly orbit: OrbitControls
    private readonly ghost1: THREE.PointLight
    private readonly ghost2: THREE.PointLight
    private readonly ghost3: THREE.PointLight


    constructor(dom: HTMLElement) {

        super(dom, {
            cameraOptions: {
                fov: 45,
                near: 0.1,
                far: 1000
            }
        })

        this.camera.position.set(4, 5, 15)
        this.scene.background = new THREE.Color(0x000000)

        //this.scene.fog = new THREE.Fog('#262837', 1, 15)

        const ambientLight = new THREE.AmbientLight('#b9d5ff', 0.1)
        this.scene.add(ambientLight)

        const moonLight = new THREE.DirectionalLight("#b9d5ff", 0.2)
        moonLight.position.set(4, 5, -2)
        this.scene.add(moonLight)


        this.renderer.shadowMap.enabled = true

        this.orbit = new OrbitControls(this.camera, this.renderer.domElement)
        //this.orbit.target.y = 10

        // const axes = new THREE.AxesHelper(100)
        // this.scene.add(axes)


        const houseHeight = 2.5
        const houseWidth = 4
        const roofHeight = 1


        const house = new THREE.Group()
        this.scene.add(house)

        const pontLight = new THREE.PointLight('#ff7d46', 1, 15)
        pontLight.position.set(0, 2.2, 2.7)
        house.add(pontLight)


        /**
         * 屋顶
         */
        const topTexture = this.textureLoader.load(topPic)
        //topTexture.center.set(0.1, 0.1)
        //topTexture.rotation = Math.PI/2
        topTexture.wrapS = topTexture.wrapT = THREE.RepeatWrapping
        //topTexture.repeat.set(3, 2)
        const topMat = new THREE.MeshLambertMaterial({color: "#fa7e58", map: topTexture})

        const roof = new THREE.Mesh(
            new THREE.ConeGeometry(3.5, roofHeight, 4),
            topMat,
            // new THREE.MeshStandardMaterial({
            //     color: '#b35f45',
            // })
        )
        roof.position.y = houseHeight + roofHeight / 2
        roof.rotation.y = Math.PI / 4
        house.add(roof)


        /**
         * 墙
         */
        const wallsColorTexture = this.textureLoader.load(brick1_1Pic)
        const wallsAlphaTexture = this.textureLoader.load(brick1_2Pic)
        wallsColorTexture.wrapT = wallsColorTexture.wrapS = THREE.RepeatWrapping
        wallsColorTexture.repeat.set(2, 2)
        wallsAlphaTexture.wrapT = wallsAlphaTexture.wrapS = THREE.RepeatWrapping
        wallsAlphaTexture.repeat.set(2, 2)
        const walls = new THREE.Mesh(
            new THREE.BoxGeometry(4, 2.5, 4),
            new THREE.MeshStandardMaterial({
                map: wallsColorTexture,
                alphaMap: wallsAlphaTexture, // alpha贴图是一张灰度纹理，用于控制整个表面的不透明度
                //roughnessMap: wallsRoughnessTexture,
                //transparent: true,
                //normalMap: wallsNormalTexture,
                //aoMap: wallsAomapTexture
            })
        )
        //walls.geometry.setAttribute('uv2', new THREE.Float32BufferAttribute(walls.geometry.attributes.uv.array, 2))
        walls.position.y = houseHeight / 2
        house.add(walls)


        /**
         * 门
         */
        const door_alphaTexture = this.textureLoader.load(door_alphaPic)
        const door_ambientTexture = this.textureLoader.load(door_ambientOcclusionPic)
        const door_colorTexture = this.textureLoader.load(door_colorPic)
        const door_heightTexture = this.textureLoader.load(door_heightPic)
        const door_metalnessTexture = this.textureLoader.load(door_metalnessPic)
        const door_normalTexture = this.textureLoader.load(door_normalPic)
        const door_roughnessTexture = this.textureLoader.load(door_roughnessPic)

        const door = new THREE.Mesh(
            new THREE.PlaneGeometry(2.2, 2.2, 100, 100),
            new THREE.MeshStandardMaterial({
                color: "#e85020",
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
         * 鬼魂
         */
        const ghost1 = new THREE.PointLight("#ff00ff", 2, 3)
        const ghost2 = new THREE.PointLight("#00ffff", 2, 3)
        const ghost3 = new THREE.PointLight("#ffff00", 2, 3)
        this.ghost1 = ghost1
        this.ghost2 = ghost2
        this.ghost3 = ghost3
        this.scene.add(ghost1, ghost2, ghost3)


        /**
         * 灌木
         */
        const bushGeometry = new THREE.SphereGeometry(1, 16, 16)
        const bushMaterial = new THREE.MeshStandardMaterial({color: "#89c854"})

        const bush1 = new THREE.Mesh(bushGeometry, bushMaterial)
        bush1.scale.set(0.5, 0.5, 0.5)
        bush1.position.set(0.8, 0.2, 2.2)

        const bush2 = new THREE.Mesh(bushGeometry, bushMaterial)
        bush2.scale.set(0.25, 0.25, 0.25)
        bush2.position.set(1.4, 0.1, 2.1)

        const bush3 = new THREE.Mesh(bushGeometry, bushMaterial)
        bush3.scale.set(0.4, 0.4, 0.4)
        bush3.position.set(-0.8, 0.1, 2.2)

        const bush4 = new THREE.Mesh(bushGeometry, bushMaterial)
        bush4.scale.set(0.15, 0.15, 0.15)
        bush4.position.set(-1, 0.05, 2.6)

        house.add(bush1, bush2, bush3, bush4)


        /**
         * 墓碑
         */
        const graves = new THREE.Group();
        const graveGeometry = new THREE.BoxGeometry(0.6, 0.8, 0.2)
        const graveMaterial = new THREE.MeshStandardMaterial({color: "#b2b6b1"})
        const graveCount = 50
        for (let i = 0; i < graveCount; i++) {
            const angle = Math.random() * Math.PI * 2;
            const radius = 3 + Math.random() * 6
            const grave = new THREE.Mesh(graveGeometry, graveMaterial)
            const x = Math.sin(angle) * radius
            const z = Math.cos(angle) * radius
            grave.position.set(x, 0.3, z)
            grave.rotation.z = (Math.random() - 0.5) * 0.4
            grave.rotation.y = (Math.random() - 0.5) * 0.4
            graves.add(grave)
        }
        this.scene.add(graves)


        /**
         * 地板
         */
        const grassColorTexture = new THREE.TextureLoader().load(grassPic, texture => {
            texture.wrapS = texture.wrapT = THREE.RepeatWrapping
            texture.repeat.set(10, 10)
        })


        const floor = new THREE.Mesh(
            new THREE.PlaneGeometry(20, 20),
            new THREE.MeshStandardMaterial({
                color: 0x00ff00,
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


        floor.rotation.x=-Math.PI*0.5
        this.scene.add(floor)


        moonLight.castShadow = true
        moonLight.shadow.mapSize.width = 1024
        moonLight.shadow.mapSize.height = 1024
        //moonLight.shadow.far = 7


        pontLight.castShadow = true
        pontLight.shadow.mapSize.width = 1024
        pontLight.shadow.mapSize.height = 1024
        //pontLight.shadow.far = 7


        walls.receiveShadow = true
        door.receiveShadow = true
        floor.receiveShadow = true


        for (let i = 0; i < graveCount; i++) {
            graves.children[i].castShadow = true
        }


        ghost1.castShadow = true


        ghost1.shadow.mapSize.width = 1024
        ghost1.shadow.mapSize.height = 1024
        //ghost1.shadow.far = 7

        ghost2.castShadow = true
        ghost2.shadow.mapSize.width = 1024
        ghost2.shadow.mapSize.height = 1024
        //ghost2.shadow.far = 7

        ghost3.castShadow = true
        ghost3.shadow.mapSize.width = 1024
        ghost3.shadow.mapSize.height = 1024
        //ghost3.shadow.far = 7

    }


    protected init() {
    }


    protected onRenderer() {
        const elapsedTime = this.clock.getElapsedTime()
        this.orbit.update()

        this.ghost1.position.x = Math.cos(elapsedTime) * 4
        this.ghost1.position.z = Math.sin(elapsedTime) * 4
        this.ghost1.position.y = Math.sin(elapsedTime * 3) * 3

        this.ghost2.position.x = -Math.cos(elapsedTime) * 3
        this.ghost2.position.z = -Math.sin(elapsedTime) * 3
        this.ghost2.position.y = -Math.sin(elapsedTime * 3) * 3

        const ghost3Angle = -elapsedTime * 0.18
        this.ghost3.position.x = Math.cos(ghost3Angle) * (7 + Math.sin(elapsedTime * 0.32))
        this.ghost3.position.z = Math.sin(ghost3Angle) * (7 + Math.sin(elapsedTime * 0.5))
        this.ghost3.position.y = Math.sin(elapsedTime * 4) + Math.sin(elapsedTime * 2.5)

    }

}