import * as THREE from "three"
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls"
import {LensflareElement, Lensflare} from 'three/examples/jsm/objects/Lensflare'
import {TextureLoader} from "three"
import {Water} from "three/examples/jsm/objects/Water"
import ThreeCore from "@/three-widget/ThreeCore"
import {resetUV} from "@/three-widget/ThreeUtils";
import {getCubeTextureLoader, getTextureLoader} from "@/three-widget/loader/ThreeLoader"


export default class ThreeProject extends ThreeCore {

    private readonly orbit: OrbitControls
    private readonly water: Water

    /** 材质颜色常量 */
    private readonly MATERIAL_COLOR = "rgb(120, 120, 120)"

    /** 上海中心大厦坐标位置 */
    private readonly shanghaiTowerPosition = {x: 25, y: 17, z: -30}

    /** 环球金融中心坐标位置 */
    private readonly globalFinancialCenterPosition = {x: 15, y: 0, z: -30}

    /** 金茂大厦坐标位置 */
    private readonly jinmaoTowerPosition = {x: 18, y: 11, z: -20}

    /** 其他随机建筑物的坐标位置数组 */
    private readonly randomBuildingPositionsArr = [
        {x: -13, y: 0, z: -15},
        {x: -7, y: 0, z: -13},
        {x: -1, y: 0, z: -16},
        {x: -2, y: 0, z: -10},
        {x: -8, y: 0, z: -5},
        {x: 5, y: 0, z: -25},
        {x: -3, y: 0, z: -18},
        {x: -8, y: 0, z: -18},
        {x: -18, y: 0, z: -25},
        {x: -6, y: 0, z: -25},
        {x: -3, y: 0, z: -30},
        {x: -10, y: 0, z: -30},
        {x: -17, y: 0, z: -30},
        {x: -3, y: 0, z: -35},
        {x: -12, y: 0, z: -35},
        {x: -20, y: 0, z: -35},
        {x: -3, y: 0, z: -40},
        {x: -16, y: 0, z: -40},
        {x: 16, y: 0, z: -40},
        {x: 18, y: 0, z: -38},
        {x: 16, y: 0, z: -40},
        {x: 30, y: 0, z: -40},
        {x: 32, y: 0, z: -40},
        {x: 16, y: 0, z: -35},
        {x: 36, y: 0, z: -38},
        {x: 42, y: 0, z: -32},
        {x: 42, y: 0, z: -26},
        {x: 35, y: 0, z: -20},
        {x: 36, y: 0, z: -32},
        {x: 25, y: 0, z: -22},
        {x: 26, y: 0, z: -20},
        {x: 19, y: 0, z: -8},
        {x: 30, y: 0, z: -18},
        {x: 25, y: 0, z: -15},
        {x: 9, y: 0, z: -10},
        {x: 1, y: 0, z: -9},
        {x: 1, y: 0, z: -30},
        {x: 0, y: 0, z: -35},
        {x: 1, y: 0, z: -32},
        {x: 8, y: 0, z: -5},
        {x: 15, y: 0, z: -6},
        {x: 5, y: 0, z: -40},
        {x: 9, y: 0, z: -40}
    ]

    /** 其他随机建筑物的贴图路径数组 */
    private readonly randomBuildingTexturesArr = [
        "/demo/scene-shanghai/build/building1.jpg",
        "/demo/scene-shanghai/build/building2.jpg",
        "/demo/scene-shanghai/build/building3.jpg",
        "/demo/scene-shanghai/build/building4.jpg",
        "/demo/scene-shanghai/build/building5.jpg",
        "/demo/scene-shanghai/build/building6.jpg",
        "/demo/scene-shanghai/build/building7.jpg",
        "/demo/scene-shanghai/build/building8.jpg",
        "/demo/scene-shanghai/build/building9.jpg",
        "/demo/scene-shanghai/build/building10.jpg"
    ]


    constructor(dom: HTMLElement) {

        super(dom, {
            cameraOptions: {
                fov: 45,
                near: 0.1,
                far: 1000
            }
        })

        this.camera.position.set(0, 30, 90)


        const ambientLight = new THREE.AmbientLight(0xffffff, 1)
        this.scene.add(ambientLight)


        const sunLight = new THREE.PointLight(0xffffff, 10)
        sunLight.name = '点光源1'
        sunLight.position.set(50, 50, 0)
        sunLight.castShadow = true
        sunLight.shadow.bias = 0.005
        sunLight.shadow.mapSize.width = 512
        sunLight.shadow.mapSize.height = 512
        sunLight.decay = 0.1
        this.scene.add(sunLight)


        this.renderer.shadowMap.enabled = true
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap


        this.orbit = new OrbitControls(this.camera, this.renderer.domElement)
        this.orbit.target.y = 20
        this.orbit.update()


        const lensflareTexture0 = new TextureLoader().load('/demo/scene-shanghai/lensflare/lensflare0.png')
        const lensflareTexture3 = new TextureLoader().load('/demo/scene-shanghai/lensflare/lensflare3.png')
        // 六边形
        const lensflareTextureHexAngle = new TextureLoader().load('/demo/scene-shanghai/lensflare/hexangle.png')
        const lensflare = new Lensflare()
        // 通过不同光晕贴图的大小创造出炫光的效果
        // 太阳本身
        lensflare.addElement(new LensflareElement(lensflareTexture0, 200, 0, new THREE.Color(0xf4a135)))

        // 光晕1, 最小
        lensflare.addElement(new LensflareElement(lensflareTexture3, 25, 0.14, new THREE.Color(0xf4a135)))
        // 光晕2, 稍大
        lensflare.addElement(new LensflareElement(lensflareTextureHexAngle, 40, 0.18, new THREE.Color(0xddf4a135)))
        // 光晕3, 更大
        lensflare.addElement(new LensflareElement(lensflareTexture3, 60, 0.20, new THREE.Color(0xf4a135)))
        // 光晕4, 比最小大
        lensflare.addElement(new LensflareElement(lensflareTextureHexAngle, 30, 0.22, new THREE.Color(0xddf4a135)))
        // 光晕5, 跟太阳同材质的最小光点
        lensflare.addElement(new LensflareElement(lensflareTexture0, 20, 0.23, new THREE.Color(0xddf4a135)))
        // 将光晕放置在点光源位置
        sunLight.add(lensflare)


        this.addGroundFront()
        this.addGroundBehind()

        // 东方明珠
        this.addOrientalPearl()

        // 上海中心大厦(歪楼)
        this.addShanghaiTower()

        // 上海环球中心(三角楼), 计算法向量有问题, 不能处理光照
        this.addGlobalFinancialCenter()

        // 金茂大厦
        this.addJinmaoTower()

        // 其他随机建筑
        this.addBuilding()

        this.water = this.addAndGetWater()

        this.addSky()
    }

    protected init() {
    }

    private addSky() {
        getCubeTextureLoader().setPath('/demo/scene-shanghai/skybox/').load(
            ['left.jpg', 'right.jpg', 'top.jpg', 'bottom.jpg', 'front.jpg', 'back.jpg'],
            texture => {
                this.scene.background = texture
            })
    }

    private addAndGetWater() {
        const waterGeometry = new THREE.PlaneGeometry(10000, 10000)
        const waterTexture = getTextureLoader().load('/demo/scene-shanghai/waternormals.jpg', texture => {
            texture.wrapS = texture.wrapT = THREE.RepeatWrapping
        })
        const water = new Water(
            waterGeometry,
            {
                textureWidth: 512,
                textureHeight: 512,
                waterNormals: waterTexture,
                sunDirection: new THREE.Vector3(),
                sunColor: 0xffffff,
                waterColor: 0x294f9a,
                distortionScale: 3.7,
            }
        )
        water.rotation.x = -Math.PI / 2
        water.position.y = -2
        water.receiveShadow = true
        this.scene.add(water)

        return water
    }

    protected onRenderer() {
        this.orbit.update()

        this.water.material.uniforms["time"].value += 1.0 / 60.0
    }

    private addGroundFront() {
        const shape = new THREE.Shape()
        shape.moveTo(50, 0)
        shape.lineTo(-25, 0)
        shape.quadraticCurveTo(-10, 107, 50, 15) // 二次曲线

        const extrudeGeometry = new THREE.ExtrudeGeometry(shape, {
            depth: 3,
            steps: 2,
            bevelThickness: 0,
            bevelSize: 1
        })

        const material = new THREE.MeshLambertMaterial({color: "#666"})

        const mesh = new THREE.Mesh(extrudeGeometry, material)

        mesh.receiveShadow = true
        mesh.rotation.x = Math.PI / 2 // 地面旋转90度
        mesh.position.set(0, 0, -50)
        this.scene.add(mesh)
    }

    private addGroundBehind() {
        const shape = new THREE.Shape()
        shape.moveTo(45, 100)
        shape.lineTo(50, 100)
        shape.lineTo(50, 0)
        shape.lineTo(-50, 0)
        shape.lineTo(-50, 60)
        shape.bezierCurveTo(5, 15, 15, 5, 45, 100)

        const extrudeGeometry = new THREE.ExtrudeGeometry(shape, {
            depth: 3,
            steps: 2,
            bevelThickness: 0,
            bevelSize: 1
        })

        const material = new THREE.MeshLambertMaterial({color: "gray"})

        const mesh = new THREE.Mesh(extrudeGeometry, material)

        mesh.receiveShadow = true
        mesh.rotation.x = Math.PI + Math.PI / 2 // 地面旋转180度
        mesh.rotation.y = Math.PI // 地面旋转180度

        mesh.position.set(0, 0, 50)
        this.scene.add(mesh)
    }

    // 东方明珠
    private addOrientalPearl() {
        const orientalPearl = new THREE.Object3D()

        // 1. 底部圆台 2个圆柱
        const bottom = new THREE.Object3D()

        // 圆台1
        const cylinder1_geometry = new THREE.CylinderGeometry(2, 2, 0.38, 30)
        const cylinder1_material = new THREE.MeshPhongMaterial({color: this.MATERIAL_COLOR})
        const cylinder1 = new THREE.Mesh(cylinder1_geometry, cylinder1_material)
        cylinder1.castShadow = true
        cylinder1.receiveShadow = true

        // 圆台2
        const cylinder2_geometry = new THREE.CylinderGeometry(1.8, 1.8, 0.2, 30)
        const cylinder2_material = new THREE.MeshPhongMaterial({color: this.MATERIAL_COLOR})
        const cylinder2 = new THREE.Mesh(cylinder2_geometry, cylinder2_material)
        cylinder2.position.y = 0.28
        cylinder2.castShadow = true
        cylinder2.receiveShadow = true

        // 底部小斜体圆柱1
        const little_bottom_cylinder1_geometry = new THREE.CylinderGeometry(0.15, 0.15, 3, 30)
        const little_bottom_cylinder1_material = new THREE.MeshPhongMaterial({color: this.MATERIAL_COLOR})
        const little_bottom_cylinder1 = new THREE.Mesh(little_bottom_cylinder1_geometry, little_bottom_cylinder1_material)
        little_bottom_cylinder1.position.set(1.1, 1, 0.5)
        little_bottom_cylinder1.rotation.set((Math.PI / 2) * 1.15, (Math.PI / 5.5) * 1.5, (-Math.PI / 2.5) * 1.1)

        // 底部小斜体圆柱2
        const little_bottom_cylinder2_geometry = new THREE.CylinderGeometry(0.15, 0.15, 3, 30)
        const little_bottom_cylinder2_material = new THREE.MeshPhongMaterial({color: this.MATERIAL_COLOR})
        const little_bottom_cylinder2 = new THREE.Mesh(little_bottom_cylinder2_geometry, little_bottom_cylinder2_material)
        little_bottom_cylinder2.position.set(-0.05, 1, -1.35)
        little_bottom_cylinder2.rotation.set((Math.PI / 2) * 1.47, -(Math.PI / 5.5) * 1.35, (Math.PI / 2.5) * 0.05)

        // 底部小斜体圆柱3
        const little_bottom_cylinder3_geometry = new THREE.CylinderGeometry(0.15, 0.15, 3, 30)
        const little_bottom_cylinder3_material = new THREE.MeshPhongMaterial({color: this.MATERIAL_COLOR})
        const little_bottom_cylinder3 = new THREE.Mesh(little_bottom_cylinder3_geometry, little_bottom_cylinder3_material)
        little_bottom_cylinder3.position.set(-1, 1, 0.8)
        little_bottom_cylinder3.rotation.set(-(Math.PI / 2) * 1.25, (Math.PI / 5.5), -(Math.PI / 3.5) * 0.9)

        // 底部支柱
        const bottom_cylinder = this.getBottomCylinder()
        bottom.add(
            cylinder1,
            cylinder2,
            bottom_cylinder,
            little_bottom_cylinder1,
            little_bottom_cylinder2,
            little_bottom_cylinder3
        )

        // 2. 中间部分 三个圆柱 + 圆球
        const body = new THREE.Object3D()

        // 圆柱1
        const body_cylinder1_geometry = new THREE.CylinderGeometry(0.35, 0.35, 15, 30)
        const body_cylinder1_material = new THREE.MeshPhongMaterial({color: this.MATERIAL_COLOR})
        const body_cylinder1 = new THREE.Mesh(body_cylinder1_geometry, body_cylinder1_material)
        body_cylinder1.position.set(0, 7, 0.8)

        // 圆柱2
        const body_cylinder2_geometry = new THREE.CylinderGeometry(0.35, 0.35, 15, 30)
        const body_cylinder2_material = new THREE.MeshPhongMaterial({color: this.MATERIAL_COLOR})
        const body_cylinder2 = new THREE.Mesh(body_cylinder2_geometry, body_cylinder2_material)
        body_cylinder2.position.set(0.7, 7, -0.5)

        // 圆柱3
        const body_cylinder3_geometry = new THREE.CylinderGeometry(0.35, 0.35, 15, 30)
        const body_cylinder3_material = new THREE.MeshPhongMaterial({color: this.MATERIAL_COLOR})
        const body_cylinder3 = new THREE.Mesh(body_cylinder3_geometry, body_cylinder3_material)
        body_cylinder3.position.set(-0.7, 7, -0.45)

        // 圆环
        const torus1 = this.getTorus(0.8, 0.2, 16, 10, 2)
        const torus2 = this.getTorus(0.8, 0.2, 16, 10, 7.5)
        const torus3 = this.getTorus(0.8, 0.2, 16, 10, 8.6)
        const torus4 = this.getTorus(0.8, 0.2, 16, 10, 9.7)
        const torus5 = this.getTorus(0.8, 0.2, 16, 10, 10.8)
        const torus6 = this.getTorus(0.8, 0.2, 16, 10, 11.9)
        const torus7 = this.getTorus(0.8, 0.2, 16, 10, 13)

        // 大球
        const sphere_big_geometry = new THREE.SphereGeometry(2, 32, 32)
        const sphere_big_material = new THREE.MeshPhongMaterial({color: this.MATERIAL_COLOR})
        const sphere_big = new THREE.Mesh(sphere_big_geometry, sphere_big_material)
        sphere_big.position.y = 5

        // 中球
        const sphere_middle_geometry = new THREE.SphereGeometry(1.5, 32, 32)
        const sphere_middle_material = new THREE.MeshPhongMaterial({color: this.MATERIAL_COLOR})
        const sphere_middle = new THREE.Mesh(sphere_middle_geometry, sphere_middle_material)
        sphere_middle.position.y = 15

        body.add(body_cylinder1)
        body.add(body_cylinder2)
        body.add(body_cylinder3)
        body.add(torus1)
        body.add(torus2)
        body.add(torus3)
        body.add(torus4)
        body.add(torus5)
        body.add(torus6)
        body.add(torus7)
        body.add(sphere_big)
        body.add(sphere_middle)

        // 顶部
        const head = new THREE.Object3D()
        // 顶部圆柱1
        const head_cylinder1_geometry = new THREE.CylinderGeometry(0.3, 0.3, 2.5, 5)
        const head_cylinder1_material = new THREE.MeshPhongMaterial({color: this.MATERIAL_COLOR})
        const head_cylinder1 = new THREE.Mesh(head_cylinder1_geometry, head_cylinder1_material)
        head_cylinder1.position.y = 17.5

        // 顶部球1
        const head_sphere_geometry = new THREE.SphereGeometry(0.6, 32, 32)
        const head_sphere_material = new THREE.MeshPhongMaterial({color: this.MATERIAL_COLOR})
        const head_sphere = new THREE.Mesh(head_sphere_geometry, head_sphere_material)
        head_sphere.position.y = 19

        // 顶部圆柱2
        const head_cylinder2_geometry = new THREE.CylinderGeometry(0.25, 0.2, 3, 5)
        const head_cylinder2_material = new THREE.MeshPhongMaterial({color: this.MATERIAL_COLOR})
        const head_cylinder2 = new THREE.Mesh(head_cylinder2_geometry, head_cylinder2_material)
        head_cylinder2.position.y = 20

        const head_torus1 = this.getTorus(0.15, 0.15, 16, 10, 21.5)

        // 顶部圆柱3
        const head_cylinder3_geometry = new THREE.CylinderGeometry(0.15, 0.15, 2, 10)
        const head_cylinder3_material = new THREE.MeshPhongMaterial({color: this.MATERIAL_COLOR})
        const head_cylinder3 = new THREE.Mesh(head_cylinder3_geometry, head_cylinder3_material)
        head_cylinder3.position.y = 22.5
        const head_torus2 = this.getTorus(0.13, 0.13, 16, 10, 23.5)

        // 顶部圆柱4
        const head_cylinder4_geometry = new THREE.CylinderGeometry(0.1, 0.1, 3, 10)
        const head_cylinder4_material = new THREE.MeshPhongMaterial({color: this.MATERIAL_COLOR})
        const head_cylinder4 = new THREE.Mesh(head_cylinder4_geometry, head_cylinder4_material)
        head_cylinder4.position.y = 25

        head.add(head_sphere, head_torus1, head_torus2, head_cylinder4)
        head.add(head_cylinder1, head_cylinder2, head_cylinder3)

        orientalPearl.add(bottom)
        orientalPearl.add(body)
        orientalPearl.add(head)
        orientalPearl.castShadow = true
        orientalPearl.receiveShadow = true

        this.scene.add(orientalPearl)
    }

    // 上海中心大厦
    private addShanghaiTower() {

        const _geometry = new THREE.CylinderGeometry(2, 3, 18, 7, 50)

        // 正弦函数规律性的改变顶点坐标的x轴和z轴
        const vs = _geometry.getAttribute("position")
        for (let i = 0; i < vs.count; i++) {
            let x = vs.getX(i)
            let y = vs.getY(i)
            let z = vs.getZ(i)

            x += Math.sin((y + i) * 0.01)

            // 斜塔尖
            if (y >= 8.5) {
                y -= (x * 0.2)
            }

            z += Math.sin((y + i) * 0.015)
            vs.setXYZ(i, x, y, z)
        }

        _geometry.attributes.position.needsUpdate = true

        resetUV(_geometry)


        // todo 这里有bug 几何体在上面顶点偏移操作变形后, 材质贴图匹配不上
        const texture = getTextureLoader().load("/demo/scene-shanghai/build/building5.jpg")
        texture.colorSpace = THREE.SRGBColorSpace
        texture.wrapS = texture.wrapT = THREE.RepeatWrapping
        texture.repeat.set(2, 9)

        const _material = new THREE.MeshPhongMaterial({color: this.MATERIAL_COLOR, map: texture})

        const tower = new THREE.Mesh(_geometry, _material)
        tower.position.copy(this.shanghaiTowerPosition)
        tower.scale.set(1, 2, 0.5)
        tower.castShadow = true
        tower.receiveShadow = true

        this.scene.add(tower)
    }

    // 上海环球中心
    private addGlobalFinancialCenter() {
        const group = new THREE.Group()

        // 底座
        const bottom = this.getGlobalFinancialCenterBottom()
        group.add(bottom)

        const top = this.getGlobalFinancialCenterTop()
        group.add(top)
        group.position.copy(this.globalFinancialCenterPosition)
        group.scale.set(0.81, 0.81, 0.81)

        this.scene.add(group)
    }


    // 金茂大厦
    private addJinmaoTower() {
        const JinmaoTower = new THREE.Object3D()
        const _geometry = new THREE.BoxGeometry(1, 22, 6)


        const texture = getTextureLoader().load("/demo/scene-shanghai/build/building5.jpg")// 颜色贴图
        texture.colorSpace = THREE.SRGBColorSpace
        texture.wrapS = texture.wrapT = THREE.RepeatWrapping // 水平和竖直方向重复贴图
        texture.repeat.set(0.35, 8)

        const _material = new THREE.MeshPhongMaterial({color: this.MATERIAL_COLOR, map: texture,})

        // 金茂大厦中间骨架
        const cube1 = new THREE.Mesh(_geometry, _material)
        const cube2 = new THREE.Mesh(_geometry, _material)
        cube2.rotation.set(0, Math.PI / 2, 0)

        // 金茂大厦主干
        const towerBody = this.getJinmaoTowerBody()
        // 金茂大厦顶部主体
        const towerTop = this.getJinmaoTowerTop()

        JinmaoTower.add(cube1)
        JinmaoTower.add(cube2)
        JinmaoTower.add(towerBody)
        JinmaoTower.add(towerTop)
        JinmaoTower.receiveShadow = true
        JinmaoTower.position.copy(this.jinmaoTowerPosition)

        this.scene.add(JinmaoTower)
    }

    // 金茂大厦身体主干
    private getJinmaoTowerBody() {
        const towerBody = new THREE.Object3D()
        const _geometry1 = new THREE.BoxGeometry(5, 7, 5)
        const _geometry2 = new THREE.BoxGeometry(4.5, 5.5, 4.5)
        const _geometry3 = new THREE.BoxGeometry(4, 4, 4)
        const _geometry4 = new THREE.BoxGeometry(3.5, 3, 3.5)
        const _geometry5 = new THREE.BoxGeometry(3, 2, 3)
        const _geometry6 = new THREE.BoxGeometry(2.5, 1.5, 2.5)
        const _geometry7 = new THREE.BoxGeometry(2, 1.3, 2)
        const _geometry8 = new THREE.BoxGeometry(1.5, 1, 1.5)

        const texture = getTextureLoader().load("/demo/scene-shanghai/build/JMtowerbody.jpg")// 颜色贴图
        texture.colorSpace = THREE.SRGBColorSpace
        texture.wrapS = texture.wrapT = THREE.RepeatWrapping // 水平和竖直方向重复贴图
        texture.repeat.set(0.5, 1)

        const _material = new THREE.MeshPhongMaterial({color: this.MATERIAL_COLOR, map: texture})

        const cube1 = new THREE.Mesh(_geometry1, _material)
        const cube2 = new THREE.Mesh(_geometry2, _material)
        const cube3 = new THREE.Mesh(_geometry3, _material)
        const cube4 = new THREE.Mesh(_geometry4, _material)
        const cube5 = new THREE.Mesh(_geometry5, _material)
        const cube6 = new THREE.Mesh(_geometry6, _material)
        const cube7 = new THREE.Mesh(_geometry7, _material)
        const cube8 = new THREE.Mesh(_geometry8, _material)
        cube2.position.set(0, 5.5, 0)
        cube3.position.set(0, 9.5, 0)
        cube4.position.set(0, 12.5, 0)
        cube5.position.set(0, 14.5, 0)
        cube6.position.set(0, 16, 0)
        cube7.position.set(0, 17.3, 0)
        cube8.position.set(0, 18.3, 0)

        towerBody.add(cube1)
        towerBody.add(cube2)
        towerBody.add(cube3)
        towerBody.add(cube4)
        towerBody.add(cube5)
        towerBody.add(cube6)
        towerBody.add(cube7)
        towerBody.add(cube8)
        towerBody.position.set(0, -8, 0)
        return towerBody
    }


    // 金茂大厦顶部主体
    private getJinmaoTowerTop() {
        const towerTop = new THREE.Object3D()
        const _geometry1 = new THREE.BoxGeometry(3.8, 0.5, 3.8)
        const _geometry2 = new THREE.BoxGeometry(3, 0.5, 3)
        const _geometry3 = new THREE.BoxGeometry(2.2, 0.5, 2.2)
        const _geometry4 = new THREE.BoxGeometry(1.4, 0.5, 1.4)
        const _cylinderGeometry = new THREE.CylinderGeometry(0.1, 0.5, 5, 3)


        const texture = getTextureLoader().load("/demo/scene-shanghai/build/JMtowertop.jpg")// 颜色贴图
        texture.colorSpace = THREE.SRGBColorSpace
        texture.wrapS = texture.wrapT = THREE.RepeatWrapping // 水平和竖直方向重复贴图
        texture.repeat.set(0.35, 1)

        const _material = new THREE.MeshPhongMaterial({color: this.MATERIAL_COLOR, map: texture,})

        const cube1 = new THREE.Mesh(_geometry1, _material)
        const cube2 = new THREE.Mesh(_geometry2, _material)
        const cube3 = new THREE.Mesh(_geometry3, _material)
        const cube4 = new THREE.Mesh(_geometry4, _material)
        const cylinder = new THREE.Mesh(_cylinderGeometry, _material)

        cube2.position.set(0, 0.5, 0)
        cube3.position.set(0, 1, 0)
        cube4.position.set(0, 1.5, 0)
        cylinder.position.set(0, 2, 0)

        towerTop.add(cube1)
        towerTop.add(cube2)
        towerTop.add(cube3)
        towerTop.add(cube4)
        towerTop.add(cylinder)
        towerTop.position.set(0, 11, 0)
        towerTop.rotation.set(0, Math.PI / 4, 0)
        return towerTop
    }

    // 环球中心 底座
    private getGlobalFinancialCenterBottom() {

        // 创建顶点位置数组
        const vertices = new Float32Array([
            // 底部
            3, 0, 3, // 0
            3, 0, -3, // 1
            -3, 0, 3, // 2
            -3, 0, -3, // 3
            // 中部
            3, 10, 3, // 4
            -3, 10, -3, // 5
            // 上部
            -1.5, 30, 3, // 6
            3, 30, -1.5, // 7
            3, 30, -3, // 8
            1.5, 30, -3, // 9
            -3, 30, 1.5, // 10
            -3, 30, 3 // 11
        ])

        // 三角形顶点顺序
        const indices = new Uint16Array([
            // 底部2个三角形
            0, 1, 2,
            3, 2, 1,
            // 每个面的 3个三角形
            // 1.
            6, 2, 0,
            0, 4, 6,
            11, 2, 6,
            // 2.
            0, 1, 7,
            7, 4, 0,
            8, 7, 1,
            // 3.
            1, 3, 9,
            9, 8, 1,
            3, 5, 9,
            // 4.
            10, 3, 2,
            11, 10, 2,
            10, 5, 3,
            // 顶部4个三角形
            6, 10, 11,
            7, 8, 9,
            6, 7, 10,
            7, 9, 10,
            // 两个剖面 三角形
            7, 6, 4,
            10, 9, 5
        ])

        const geo = new THREE.BufferGeometry()
        geo.setAttribute("position", new THREE.BufferAttribute(vertices, 3))
        geo.setIndex(new THREE.BufferAttribute(indices, 1))
        geo.computeVertexNormals()
        //geo.computeFaceNormals() // todo 计算法向量，会对光照产生影响, 新版本不知道该怎么改

        // 自定义形状贴图贴不上, 这里原作者源码里也没解决
        const texture = getTextureLoader().load("/demo/scene-shanghai/build/JMtowerbody.jpg")
        texture.colorSpace = THREE.SRGBColorSpace
        texture.wrapS = texture.wrapT = THREE.RepeatWrapping
        texture.repeat.set(0.5, 1)

        const mat = new THREE.MeshPhongMaterial({color: "rgb(12,20,30)", map: texture})
        const mesh = new THREE.Mesh(geo, mat)
        mesh.castShadow = true
        mesh.receiveShadow = true
        return mesh
    }

    // 环球中心 顶部三角体底座
    private getGlobalFinancialCenterTop() {
        const group = new THREE.Group()

        const _material = new THREE.MeshPhongMaterial({color: "rgb(12,20,30)"})

        // 顶部左侧圆椎
        const leftTriangularVertices = new Float32Array([
            -3, 30, 1.5, // 6 // 0
            -3, 35, 3, // 1
            -3, 30, 3, // 2
            -1.5, 30, 3, // 3
            -2, 35, 2 // 4
        ])
        const leftTriangularFaces = new Uint16Array([
            1, 2, 3,
            1, 3, 4,
            0, 4, 3,
            1, 4, 0,
            1, 0, 2
        ])
        const leftTriangularGeo = new THREE.BufferGeometry()
        leftTriangularGeo.setAttribute("position", new THREE.BufferAttribute(leftTriangularVertices, 3))
        leftTriangularGeo.setIndex(new THREE.BufferAttribute(leftTriangularFaces, 1))
        // leftTriangularGeo.computeFaceNormals() // todo 计算法向量，会对光照产生影响, 新版本不知道该怎么改
        const leftTriangular = new THREE.Mesh(leftTriangularGeo, _material)
        leftTriangular.castShadow = true
        leftTriangular.receiveShadow = true
        group.add(leftTriangular)


        // 顶部左侧圆椎边的边框
        const leftTriangularGoneVertices = new Float32Array([
            -3, 30, 1.5, // 0
            -2.5, 30, 1, // 1
            -1, 30, 2.5, // 2
            -1.5, 30, 3, // 3
            -2.5, 35, 2.5, // 4
            -2, 35, 2 // 5
        ])
        const leftTriangularGoneFaces = new Uint16Array([
            0, 2, 3,
            0, 1, 2,
            0, 4, 3,
            5, 2, 1,
            4, 3, 2,
            4, 2, 5,
            1, 0, 4,
            4, 5, 1
        ])
        const leftTriangularGnoGeo = new THREE.BoxGeometry()
        leftTriangularGnoGeo.setAttribute("position", new THREE.BufferAttribute(leftTriangularGoneVertices, 3))
        leftTriangularGnoGeo.setIndex(new THREE.BufferAttribute(leftTriangularGoneFaces, 1))
        //leftTriangularGnoGeo.computeFaceNormals() // todo 计算法向量，会对光照产生影响, 新版本不知道该怎么改
        const leftTriangularGno = new THREE.Mesh(leftTriangularGnoGeo, _material)
        leftTriangularGno.castShadow = true
        leftTriangularGno.receiveShadow = true
        group.add(leftTriangularGno)


        // 顶部右侧圆椎
        const rightTriangularVertices = new Float32Array([
            3, 30, -1.5, // 0
            1.5, 30, -3, // 1
            2, 35, -2, // 2
            3, 35, -3, // 3
            3, 30, -3 // 4
        ])
        const rightTriangularFaces = new Uint16Array([
            4, 3, 0,
            3, 2, 0,
            3, 4, 1,
            2, 3, 1,
            0, 2, 1
        ])
        const rightTriangularGeo = new THREE.BoxGeometry()
        rightTriangularGeo.setAttribute("position", new THREE.BufferAttribute(rightTriangularVertices, 3))
        rightTriangularGeo.setIndex(new THREE.BufferAttribute(rightTriangularFaces, 1))
        //rightTriangularGeo.computeFaceNormals() // todo 计算法向量，会对光照产生影响, 新版本不知道该怎么改
        const rightTriangular = new THREE.Mesh(rightTriangularGeo, _material)
        rightTriangular.castShadow = true
        rightTriangular.receiveShadow = true
        group.add(rightTriangular)


        // 顶部右侧圆椎边的边框
        const rightTriangularGoneVertices = new Float32Array([
            3, 30, -1.5, // 0
            1.5, 30, -3, // 1
            2, 35, -2, // 2
            2.5, 35, -2.5, // 3
            2.5, 30, -1, // 4
            1, 30, -2.5 // 5
        ])
        const rightTriangularGoneFaces = new Uint16Array([
            0, 2, 4,
            4, 2, 3,
            1, 2, 3,
            3, 5, 1,
            5, 4, 3,
            4, 0, 1,
            1, 5, 2,
            4, 5, 1,
            5, 2, 3
        ])
        const rightTriangularGnoGeo = new THREE.BufferGeometry()
        rightTriangularGnoGeo.setAttribute("position", new THREE.BufferAttribute(rightTriangularGoneVertices, 3))
        rightTriangularGnoGeo.setIndex(new THREE.BufferAttribute(rightTriangularGoneFaces, 1))
        //rightTriangularGnoGeo.computeFaceNormals() // todo 计算法向量，会对光照产生影响, 新版本不知道该怎么改
        const rightTriangularGno = new THREE.Mesh(rightTriangularGnoGeo, _material)
        rightTriangularGno.castShadow = true
        rightTriangularGno.receiveShadow = true
        group.add(rightTriangularGno)


        // 自定义上边框
        const topGoneGeometry = new THREE.PlaneGeometry(8, 2, 32)
        const topGoneMaterial = new THREE.MeshPhongMaterial({color: "rgb(12,20,30)", side: THREE.DoubleSide})
        const topGone = new THREE.Mesh(topGoneGeometry, topGoneMaterial)

        topGone.position.set(0, 34, 0)
        topGone.rotation.set(0, Math.PI / 4, 0)
        topGone.castShadow = true
        topGone.receiveShadow = true
        group.add(topGone)

        return group
    }


    private getBottomCylinder() {
        // 获取底部斜体圆柱
        const object = new THREE.Object3D()

        // 圆柱1
        const bottom_cylinder1_geometry = new THREE.CylinderGeometry(0.2, 0.2, 7, 30)
        const bottom_cylinder1_material = new THREE.MeshPhongMaterial({color: this.MATERIAL_COLOR})
        const bottom_cylinder1 = new THREE.Mesh(bottom_cylinder1_geometry, bottom_cylinder1_material)

        // 圆柱2
        const bottom_cylinder2_geometry = new THREE.CylinderGeometry(0.2, 0.2, 7, 30)
        const bottom_cylinder2_material = new THREE.MeshPhongMaterial({color: this.MATERIAL_COLOR})
        const bottom_cylinder2 = new THREE.Mesh(bottom_cylinder2_geometry, bottom_cylinder2_material)

        // 圆柱3
        const bottom_cylinder3_geometry = new THREE.CylinderGeometry(0.2, 0.2, 7, 30)
        const bottom_cylinder3_material = new THREE.MeshPhongMaterial({color: this.MATERIAL_COLOR})
        const bottom_cylinder3 = new THREE.Mesh(bottom_cylinder3_geometry, bottom_cylinder3_material)

        // 圆柱中间球
        const sphere1 = this.getBottomSphere()
        const sphere2 = this.getBottomSphere()
        const sphere3 = this.getBottomSphere()

        bottom_cylinder1.add(sphere1)
        bottom_cylinder2.add(sphere2)
        bottom_cylinder3.add(sphere3)

        bottom_cylinder1.position.set(2, 2, 1)
        bottom_cylinder1.rotation.set(-(Math.PI / 5.5), Math.PI / 10, Math.PI / 5)

        bottom_cylinder2.position.set(0, 2, -2.5)
        bottom_cylinder2.rotation.set(Math.PI / 4.5, Math.PI / 6, -Math.PI / 1)

        bottom_cylinder3.position.set(-2, 2, 1.5)
        bottom_cylinder3.rotation.set(-Math.PI / 15, Math.PI / 8, (-Math.PI / 10) * 2)

        object.add(bottom_cylinder1, bottom_cylinder2, bottom_cylinder3)
        return object
    }

    private getBottomSphere() {
        const sphere_geometry = new THREE.SphereGeometry(0.32, 32, 32)
        const sphere_material = new THREE.MeshPhongMaterial({color: this.MATERIAL_COLOR})
        return new THREE.Mesh(sphere_geometry, sphere_material)
    }

    private getTorus(radius: number, tube: number, radialSegments: number, tubularSegments: number, potionsY: number) {
        const torus_geometry = new THREE.TorusGeometry(radius, tube, radialSegments, tubularSegments)
        const torus_material = new THREE.MeshPhongMaterial({color: this.MATERIAL_COLOR})
        const torus = new THREE.Mesh(torus_geometry, torus_material)

        torus.rotation.x = Math.PI / 2
        torus.position.y = potionsY
        return torus
    }

    // 其他随机建筑
    private addBuilding() {
        const buildings = new THREE.Group()
        const defaultLength = 16

        for (let i = 0; i < this.randomBuildingPositionsArr.length; i++) {
            const w = Math.random() * 3 + 2 // 随机数(2, 5)
            const d = Math.random() * 3 + 2 // 随机数(2, 5)
            const _h = Math.random() * defaultLength + 2
            const h = _h < 3 ? _h + 3 : _h // 随机数(0, 15.5)
            const geometry = new THREE.BoxGeometry(w, h, d)

            // 贴图随机数下标 textureInd   范围[0, 9]
            const textureInd = Math.floor(Math.random() * 10)

            const texture = new THREE.TextureLoader().load(this.randomBuildingTexturesArr[textureInd])// 颜色贴图
            texture.colorSpace = THREE.SRGBColorSpace
            texture.wrapS = texture.wrapT = THREE.RepeatWrapping // 水平和竖直方向重复贴图
            texture.repeat.set(1, h / 2)

            const material = new THREE.MeshPhongMaterial({color: this.MATERIAL_COLOR, map: texture})

            // 为几何体的每个面进行单独贴图
            const caizhi = [
                new THREE.MeshPhongMaterial({map: texture}),
                new THREE.MeshPhongMaterial({map: texture}),
                new THREE.MeshPhongMaterial({map: texture}),
                material, //底部
                new THREE.MeshPhongMaterial({map: texture}),
                new THREE.MeshPhongMaterial({map: texture})
            ]
            const mesh = new THREE.Mesh(geometry, caizhi)
            mesh.position.set(
                this.randomBuildingPositionsArr[i].x,
                this.randomBuildingPositionsArr[i].y + h / 2,
                this.randomBuildingPositionsArr[i].z
            )
            mesh.castShadow = true
            mesh.receiveShadow = true
            buildings.add(mesh)
        }
        this.scene.add(buildings)
    }


}
