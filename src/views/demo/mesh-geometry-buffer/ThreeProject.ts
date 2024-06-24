import * as THREE from "three"
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls"
import ThreeCore from "@/three-widget/ThreeCore"
import {getTextureLoader} from "@/three-widget/loader/ThreeLoader"
import face1Pic from "/public/demo/mesh-geometry-buffer/face1.png"
import face2Pic from "/public/demo/mesh-geometry-buffer/face2.png"
import face3Pic from "/public/demo/mesh-geometry-buffer/face3.png"
import face4Pic from "/public/demo/mesh-geometry-buffer/face4.png"
import face5Pic from "/public/demo/mesh-geometry-buffer/face5.png"
import face6Pic from "/public/demo/mesh-geometry-buffer/face6.png"


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

        const axesHelper = new THREE.AxesHelper(20)
        this.scene.add(axesHelper)


        // 用 BufferGeometry 自己写一个 长宽高都为100 的 BoxGeometry
        const bufferGeometry = new THREE.BufferGeometry()

        const positions: number[] = [
            50, 50, 50,
            50, 50, -50,
            50, -50, 50,
            50, -50, -50,
            -50, 50, -50,
            -50, 50, 50,
            -50, -50, -50,
            -50, -50, 50,
            -50, 50, -50,
            50, 50, -50,
            -50, 50, 50,
            50, 50, 50,
            -50, -50, 50,
            50, -50, 50,
            -50, -50, -50,
            50, -50, -50,
            -50, 50, 50,
            50, 50, 50,
            -50, -50, 50,
            50, -50, 50,
            50, 50, -50,
            -50, 50, -50,
            50, -50, -50,
            -50, -50, -50
        ]
        const normals: number[] = [
            1, 0, 0,
            1, 0, 0,
            1, 0, 0,
            1, 0, 0,
            -1, 0, 0,
            -1, 0, 0,
            -1, 0, 0,
            -1, 0, 0,
            0, 1, 0,
            0, 1, 0,
            0, 1, 0,
            0, 1, 0,
            0, -1, 0,
            0, -1, 0,
            0, -1, 0,
            0, -1, 0,
            0, 0, 1,
            0, 0, 1,
            0, 0, 1,
            0, 0, 1,
            0, 0, -1,
            0, 0, -1,
            0, 0, -1,
            0, 0, -1
        ]
        const uvs: number[] = [
            0, 1,
            1, 1,
            0, 0,
            1, 0,
            0, 1,
            1, 1,
            0, 0,
            1, 0,
            0, 1,
            1, 1,
            0, 0,
            1, 0,
            0, 1,
            1, 1,
            0, 0,
            1, 0,
            0, 1,
            1, 1,
            0, 0,
            1, 0,
            0, 1,
            1, 1,
            0, 0,
            1, 0
        ]
        const indexs = [
            0, 2, 1,
            2, 3, 1,
            4, 6, 5,
            6, 7, 5,
            8, 10, 9,
            10, 11, 9,
            12, 14, 13,
            14, 15, 13,
            16, 18, 17,
            18, 19, 17,
            20, 22, 21,
            22, 23, 21
        ]


        bufferGeometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(positions), 3))
        bufferGeometry.index = new THREE.BufferAttribute(new Uint16Array(indexs), 1)
        bufferGeometry.setAttribute("normal", new THREE.BufferAttribute(new Float32Array(normals), 3))
        bufferGeometry.setAttribute('uv', new THREE.BufferAttribute(new Float32Array(uvs), 2))

        const face1Texture = getTextureLoader().load(face1Pic)
        const face2Texture = getTextureLoader().load(face2Pic)
        const face3Texture = getTextureLoader().load(face3Pic)
        const face4Texture = getTextureLoader().load(face4Pic)
        const face5Texture = getTextureLoader().load(face5Pic)
        const face6Texture = getTextureLoader().load(face6Pic)

        const faceMat1 = new THREE.MeshStandardMaterial({map: face1Texture, color: "#ff0000"})
        const faceMat2 = new THREE.MeshStandardMaterial({map: face2Texture, color: "#00ff00"})
        const faceMat3 = new THREE.MeshStandardMaterial({map: face3Texture, color: "#ffffff"})
        const faceMat4 = new THREE.MeshStandardMaterial({map: face4Texture, color: "#ffff00"})
        const faceMat5 = new THREE.MeshStandardMaterial({map: face5Texture, color: "#00ffff"})
        const faceMat6 = new THREE.MeshStandardMaterial({map: face6Texture, color: "#ff00ff"})

        // 索引(面)与材质关联
        let groups = []
        groups.push({start: 0, count: 6, materialIndex: 0}) // 0-6  index[0,4,5, 0,5,1] 用材质1
        groups.push({start: 6, count: 6, materialIndex: 1}) // 6-12 index[1,5,6, 1,6,2] 用材质2
        groups.push({start: 12, count: 6, materialIndex: 2})
        groups.push({start: 18, count: 6, materialIndex: 3})
        groups.push({start: 24, count: 6, materialIndex: 4})
        groups.push({start: 30, count: 6, materialIndex: 5})

        bufferGeometry.groups = groups

        const bufferMesh = new THREE.Mesh(bufferGeometry, [faceMat1, faceMat2, faceMat3, faceMat4, faceMat5, faceMat6])
        this.scene.add(bufferMesh)


        // 转换模型为线框, 观察自定义三角形情况
        const greenLineMat = new THREE.LineBasicMaterial({color: "green"})
        const lineGeo = new THREE.WireframeGeometry(bufferGeometry)
        const boxLines = new THREE.LineSegments(lineGeo, greenLineMat)
        boxLines.position.x = 150
        this.scene.add(boxLines)


        // mesh模型也可以直接以线框架模式显示, 不需要像上面创建线框, 显示线框的时候是不显示面材质的
        const yellowWireframeMat = new THREE.MeshBasicMaterial({color: "yellow", wireframe: true})
        const boxWireframe = new THREE.Mesh(bufferGeometry, yellowWireframeMat)
        boxWireframe.position.x = -150
        this.scene.add(boxWireframe)


        // 可以把系统自带的 THREE.BoxGeometry 显示出来, 并打印 与 自己写的做对比
        // const boxGeo = new THREE.BoxGeometry(100, 100, 100)
        // const boxMat = new THREE.MeshBasicMaterial({color: "red", wireframe: true})
        // const box = new THREE.Mesh(boxGeo, boxMat)
        // box.position.x = -150
        // box.position.z = 150
        // this.scene.add(box)

    }

    protected init() {
    }

    protected onRenderer() {
        this.orbit.update()
    }
}