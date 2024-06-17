import * as THREE from "three"
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls"
import ThreeCore from "@/three-widget/ThreeCore"
import {Line2} from "three/examples/jsm/lines/Line2";
import {LineGeometry} from "three/examples/jsm/lines/LineGeometry";


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

        this.scene.background = new THREE.Color(0x000000)

        this.camera.position.set(0, 100, 400)

        const ambientLight = new THREE.AmbientLight(0xffffff, 2)
        this.scene.add(ambientLight)


        const directionalLight1 = new THREE.DirectionalLight(0xffffff, 1)
        directionalLight1.position.set(0, 5000, 5000)
        directionalLight1.castShadow = true
        this.scene.add(directionalLight1)

        const directionalLight2 = new THREE.DirectionalLight(0xffffff, 2)
        directionalLight2.position.set(0, 5000, -5000)
        this.scene.add(directionalLight2)


        this.renderer.shadowMap.enabled = true

        this.orbit = new OrbitControls(this.camera, this.renderer.domElement)

        const axes = new THREE.AxesHelper(20)
        this.scene.add(axes)


        // 用 BufferGeometry 自己写一个 BoxGeometry
        // 长度100, 为方便坐标定位, 使用半长度
        const size = 50

        const data: { position: number[], normal: number[], uv: number[] }[] = []

        data.push({position: [size, size, size], normal: [0, 1, 0], uv: [0, 0]})
        data.push({position: [size, size, -size], normal: [0, 1, 0], uv: [1, 0]})
        data.push({position: [-size, size, -size], normal: [0, 1, 0], uv: [1, 1]})
        data.push({position: [-size, size, size], normal: [0, 1, 0], uv: [0, 1]})
        data.push({position: [size, -size, size], normal: [0, 1, 0], uv: [0, 0]})
        data.push({position: [size, -size, -size], normal: [0, 1, 0], uv: [1, 0]})
        data.push({position: [-size, -size, -size], normal: [0, 1, 0], uv: [1, 1]})
        data.push({position: [-size, -size, size], normal: [0, 1, 0], uv: [0, 1]})

        const bufferGeometry = new THREE.BufferGeometry()

        const positions: number[] = []
        const normals: number[] = []
        const uvs: number[] = []
        data.forEach(item => {
            positions.push(item.position[0], item.position[1], item.position[2])
            normals.push(item.normal[0], item.normal[1], item.normal[2])
            uvs.push(item.uv[0], item.uv[1])
        })

        bufferGeometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(positions), 3))
        bufferGeometry.setAttribute("normal", new THREE.BufferAttribute(new Float32Array(normals), 3))
        bufferGeometry.setAttribute('uv', new THREE.BufferAttribute(new Float32Array(uvs), 2))


        // 索引
        const indexs = [
            0, 4, 5,
            0, 5, 1,

            1, 5, 6,
            1, 6, 2,

            2, 6, 7,
            2, 7, 3,

            3, 7, 4,
            3, 4, 0,

            // 0, 2, 3,
            // 0, 1, 2,
            1, 2, 3,
            1, 3, 0,

            4, 7, 6,
            4, 6, 5
        ]
        bufferGeometry.index = new THREE.BufferAttribute(new Uint16Array(indexs), 1)

        // 材质
        const face1Texture = this.textureLoader.load("/demo/geometry-buffer/face1.png")
        const face2Texture = this.textureLoader.load("/demo/geometry-buffer/face2.png")
        const face3Texture = this.textureLoader.load("/demo/geometry-buffer/face3.png")
        const face4Texture = this.textureLoader.load("/demo/geometry-buffer/face4.png")
        const face5Texture = this.textureLoader.load("/demo/geometry-buffer/face5.png")
        const face6Texture = this.textureLoader.load("/demo/geometry-buffer/face6.png")

        const faceMat1 = new THREE.MeshStandardMaterial({map: face1Texture, color: 0xfff000})
        const faceMat2 = new THREE.MeshStandardMaterial({map: face2Texture, color: 0x00ff00})
        const faceMat3 = new THREE.MeshStandardMaterial({map: face3Texture, color: 0x453453})
        const faceMat4 = new THREE.MeshStandardMaterial({map: face4Texture, color: 0x00ffff})
        const faceMat5 = new THREE.MeshStandardMaterial({map: face5Texture, color: 0x0000ff})
        const faceMat6 = new THREE.MeshStandardMaterial({map: face6Texture, transparent: true, opacity: 0.8})
        // const faceMat1 = new THREE.MeshBasicMaterial({map: face1Texture})
        // const faceMat2 = new THREE.MeshBasicMaterial({map: face2Texture})
        // const faceMat3 = new THREE.MeshBasicMaterial({map: face3Texture})
        // const faceMat4 = new THREE.MeshBasicMaterial({map: face4Texture})
        // const faceMat5 = new THREE.MeshBasicMaterial({map: face5Texture})
        // const faceMat6 = new THREE.MeshBasicMaterial({map: face6Texture})

        // 索引(面)与材质关联
        let groups = []
        groups.push({start: 0, count: 6, materialIndex: 0}) // 0-6  index[0,4,5, 0,5,1] 用材质1
        groups.push({start: 6, count: 6, materialIndex: 1}) // 6-12 index[1,5,6, 1,6,2] 用材质2
        groups.push({start: 12, count: 6, materialIndex: 2})
        groups.push({start: 18, count: 6, materialIndex: 3})
        groups.push({start: 24, count: 6, materialIndex: 4})
        groups.push({start: 30, count: 6, materialIndex: 5})

        bufferGeometry.groups = groups

        //bufferGeometry.computeVertexNormals()

        //const box = new THREE.Mesh(bufferGeometry, faceMat1)

        // 本例是网上抄来的, 这里有问题, 只有顶面和底面的贴图能贴上, 侧面四个面四个顶点的uv坐标两两重合, 也就是贴图面积为0, 贴不上图
        const box = new THREE.Mesh(bufferGeometry, [faceMat1, faceMat2, faceMat3, faceMat4, faceMat5, faceMat6])
        this.scene.add(box)



        // 转换模型为线框, 观察自定义三角形情况
        const greenLineMat = new THREE.LineBasicMaterial({color: "green"})
        const lineGeo = new THREE.WireframeGeometry(bufferGeometry)
        const boxLines = new THREE.LineSegments(lineGeo, greenLineMat)
        boxLines.position.x = 150
        this.scene.add(boxLines)



        // mesh模型也可以直接以线框架模式显示, 不需要像上面创建线框, 显示线框的时候是不显示面材质的
        const yellowWireframeMat = new THREE.MeshBasicMaterial({color: "yellow", wireframe:true})
        const boxWireframe = new THREE.Mesh(bufferGeometry, yellowWireframeMat)
        boxWireframe.position.x = -150
        this.scene.add(boxWireframe)

    }

    protected init() {
    }

    protected onRenderer() {
        this.orbit.update()
    }
}