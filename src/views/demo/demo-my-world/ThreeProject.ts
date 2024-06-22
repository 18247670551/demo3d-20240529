import * as THREE from "three"
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls"
import ThreeCore from "@/three-widget/ThreeCore"
import {ImprovedNoise} from "three/examples/jsm/math/ImprovedNoise"
import {mergeGeometries} from 'three/examples/jsm/utils/BufferGeometryUtils.js'
import {RGBELoader} from "three/examples/jsm/loaders/RGBELoader"
import grass_png from '/demo/my-world/textures/blocks/grass.png'
import {getTextureLoader} from "@/three-widget/loader/ThreeLoader"

export default class ThreeProject extends ThreeCore {

    private readonly directionalLight1: THREE.DirectionalLight
    private readonly directionalLight2: THREE.DirectionalLight
    private readonly pointLight1: THREE.PointLight

    private readonly orbit: OrbitControls

    constructor(dom: HTMLElement) {

        super(dom, {
            cameraOptions: {
                fov: 75,
                near: 0.1,
                far: 50000
            }
        })

        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
        this.scene.add(ambientLight)

        this.directionalLight1 = new THREE.DirectionalLight(0xffffff, 1)
        this.directionalLight1.name = '平行光源1'
        this.directionalLight1.position.set(0, 5000, 5000)
        this.directionalLight1.castShadow = true
        this.scene.add(this.directionalLight1)

        this.directionalLight2 = new THREE.DirectionalLight(0xffffff, 1)
        this.directionalLight2.name = '平行光源2'
        this.directionalLight2.position.set(0, 5000, -5000)
        this.directionalLight1.castShadow = true
        this.scene.add(this.directionalLight2)

        this.pointLight1 = new THREE.PointLight(0xffffff, 1)
        this.pointLight1.name = '点光源1'
        this.pointLight1.position.set(0, 5000, 5000)
        this.pointLight1.decay = 0.1
        this.scene.add(this.pointLight1)

        this.camera.position.set(4000, 1500, 2000)


        this.renderer.shadowMap.enabled = true

        this.orbit = new OrbitControls(this.camera, this.renderer.domElement)
        this.orbit.maxPolarAngle = Math.PI / 2 //垂直旋转的角度的上限，范围是0到Math.PI
        this.orbit.target.y = 1000

        const axesHelper = new THREE.AxesHelper(20)
        this.scene.add(axesHelper)

    }

    protected init() {
        this.addSkyBox()
        this.createMap()
    }

    protected onRenderer() {
        this.orbit.update()
    }

    private addSkyBox() {
        const rgbeLoader = new RGBELoader().setPath("/demo/island3/")
        rgbeLoader.load("animestyled_hdr.hdr", texture => {
            texture.mapping = THREE.EquirectangularReflectionMapping
            this.scene.background = texture
        })
    }


    private createMap() {

        const worldWidth = 256
        const worldDepth = 256
        // 单个方块单元尺寸
        const grassBlockUnit = 100

        // 创建基础方格, 为了省资源, 并未使用6个面的完整立方体,
        // 标准方格实际只用了5个面, 底面未使用到, 所以只创建5个面, 合并成一个几何体
        // uv数组的8个数字中,
        // 第2和第4,即索引1和3为0.5时, 代表使用贴图的下半部分
        // 第6和第8,即索引5和7为0.5时, 代表使用贴图的上半部分
        // 基本方格的顶面(草地的地面)使用贴图上半部分, 其他面(草地的侧面)都使用下半部分

        // 也可以使用 new THREE.InstancedMesh() 标准网格模型, 大量重复模型时用这个, threejs渲染时有优化

        //左边
        const nxGeometry = new THREE.PlaneGeometry(grassBlockUnit, grassBlockUnit)
        nxGeometry.attributes.uv.array[1] = 0.5
        nxGeometry.attributes.uv.array[3] = 0.5
        nxGeometry.rotateY(-Math.PI / 2)
        nxGeometry.translate(-grassBlockUnit/2, 0, 0)
        // 右边
        const pxGeometry = new THREE.PlaneGeometry(grassBlockUnit, grassBlockUnit)
        pxGeometry.attributes.uv.array[1] = 0.5
        pxGeometry.attributes.uv.array[3] = 0.5
        pxGeometry.rotateY(Math.PI / 2)
        pxGeometry.translate(grassBlockUnit/2, 0, 0)
        //上面
        const pyGeometry = new THREE.PlaneGeometry(grassBlockUnit, grassBlockUnit)
        pyGeometry.attributes.uv.array[5] = 0.5
        pyGeometry.attributes.uv.array[7] = 0.5
        pyGeometry.rotateX(-Math.PI / 2)
        pyGeometry.translate(0, grassBlockUnit/2, 0)
        //前面
        const pzGeometry = new THREE.PlaneGeometry(grassBlockUnit, grassBlockUnit)
        pzGeometry.attributes.uv.array[1] = 0.5
        pzGeometry.attributes.uv.array[3] = 0.5
        pzGeometry.translate(0, 0, grassBlockUnit/2)
        //后面
        const nzGeometry = new THREE.PlaneGeometry(grassBlockUnit, grassBlockUnit)
        nzGeometry.attributes.uv.array[1] = 0.5
        nzGeometry.attributes.uv.array[3] = 0.5
        nzGeometry.rotateY(Math.PI)
        nzGeometry.translate(0, 0, -grassBlockUnit/2)

        const height = this.generateHeight(grassBlockUnit, worldWidth, worldDepth)

        function getY(x: number, z: number) {
            return (height[x + z * worldWidth] * 0.2) | 0
        }

        const matrix = new THREE.Matrix4()
        const geometries = []
        for (let z = 0; z < worldDepth; z++) {
            for (let x = 0; x < worldWidth; x++) {
                let h = getY(x, z)
                matrix.makeTranslation(
                    x * grassBlockUnit - worldWidth/2 * grassBlockUnit,
                    h * grassBlockUnit,
                    z * grassBlockUnit - worldDepth/2 * grassBlockUnit
                )
                let px = getY(x + 1, z)
                let nx = getY(x - 1, z)
                let pz = getY(x, z + 1)
                let nz = getY(x, z - 1)
                geometries.push(pyGeometry.clone().applyMatrix4(matrix))
                if ((px !== h && px !== h + 1) || x === 0) {
                    geometries.push(pxGeometry.clone().applyMatrix4(matrix))
                }
                if ((nx !== h && nx !== h + 1) || x === worldWidth - 1) {
                    geometries.push(nxGeometry.clone().applyMatrix4(matrix))
                }
                if ((pz !== h && pz !== h + 1) || z === worldDepth - 1) {
                    geometries.push(pzGeometry.clone().applyMatrix4(matrix))
                }
                if ((nz !== h && nz !== h + 1) || z === 0) {
                    geometries.push(nzGeometry.clone().applyMatrix4(matrix))
                }
            }
        }

        const geometry = mergeGeometries(geometries)
        geometry.computeBoundingSphere()
        const texture = getTextureLoader().load(grass_png)
        texture.magFilter = THREE.NearestFilter

        const mat = new THREE.MeshStandardMaterial({
            map: texture, 
            side: THREE.DoubleSide
        })
        const mesh = new THREE.Mesh(geometry, mat)
        mesh.castShadow = true
        mesh.receiveShadow = true
        this.scene.add(mesh)
    }

    private generateHeight(grassBlockUnit: number, width: number, height: number) {
        const data = []
        const perlin = new ImprovedNoise()
        const size = width * height
        let quality = 2
        const z = Math.random() * grassBlockUnit
        for (let j = 0; j < 4; j++) {
            if (j === 0) {
                for (let i = 0; i < size; i++) {
                    data[i] = 0
                }
            }
            for (let i = 0; i < size; i++) {
                let x = i % width
                let y = (i / width) | 0
                data[i] += perlin.noise(x / quality, y / quality, z) * quality
            }
            quality *= 4
        }
        return data
    }


}
