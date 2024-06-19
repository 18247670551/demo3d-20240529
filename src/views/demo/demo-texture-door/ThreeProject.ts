import * as THREE from "three"
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls"
import ThreeCore from "@/three-widget/ThreeCore"
import door_alphaPic from "./texture/alpha.jpg"
import door_ambientOcclusionPic from "./texture/ambientOcclusion.jpg"
import door_colorPic from "./texture/color.jpg"
import door_heightPic from "./texture/height.jpg"
import door_metalnessPic from "./texture/metalness.jpg"
import door_normalPic from "./texture/normal.jpg"
import door_roughnessPic from "./texture/roughness.jpg"


export default class ThreeProject extends ThreeCore {

    private readonly orbit: OrbitControls

    constructor(dom: HTMLElement) {

        super(dom, {
            cameraOptions: {
                fov: 45,
                near: 0.1,
                far: 10000
            }
        })

        this.camera.position.set(0, 0, 3000)
        this.scene.background = new THREE.Color(0x000000)

        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
        this.scene.add(ambientLight)

        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5)
        directionalLight.position.set(6000, 3000, -30000)
        directionalLight.castShadow = true
        this.scene.add(directionalLight)

        const directionalLight2 = new THREE.DirectionalLight(0xffffff, 2)
        directionalLight2.position.set(6000, 3000, 30000)
        directionalLight2.castShadow = true
        this.scene.add(directionalLight2)

        this.renderer.shadowMap.enabled = true

        this.orbit = new OrbitControls(this.camera, this.renderer.domElement)

        // const axes = new THREE.AxesHelper(100)
        // this.scene.add(axes)


        const door_alphaTexture = this.textureLoader.load(door_alphaPic)
        const door_ambientTexture = this.textureLoader.load(door_ambientOcclusionPic)
        const door_colorTexture = this.textureLoader.load(door_colorPic)
        const door_heightTexture = this.textureLoader.load(door_heightPic)
        const door_metalnessTexture = this.textureLoader.load(door_metalnessPic)
        const door_normalTexture = this.textureLoader.load(door_normalPic)
        const door_roughnessTexture = this.textureLoader.load(door_roughnessPic)


        const material = new THREE.MeshStandardMaterial({
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

        const material0 = new THREE.MeshStandardMaterial({
            color: "#e85020",
        })

        const geometry = new THREE.BoxGeometry(1000, 1900, 50)
        geometry.setAttribute("uv2", geometry.getAttribute("uv").clone())

        const uvs = geometry.getAttribute("uv")

        // 因为材质图片 上下左右各有一些无用的空余, 在此调整UV, 去掉多空的空余
        // 图片尺寸1024X1024, 左右各有216像素空, 上下各有48像素空, 为保证图片完全覆盖, 各多取几像素, 计算出UV点的收缩比例
        // 注意: 贴图UV点, 四个点依次是 左上, 右上, 左下, 右下, box的6个面中前面对应 16, 17, 18, 19, 后面对应 20, 21, 22, 23
        const offsetX = 222/1024
        const offsetY = 52/1024


        uvs.setX(16, offsetX)
        uvs.setY(16, 1-offsetY)
        uvs.setX(17, 1-offsetX)
        uvs.setY(17, 1-offsetY)
        uvs.setX(18, offsetX)
        uvs.setY(18, offsetY)
        uvs.setX(19, 1-offsetX)
        uvs.setY(19, offsetY)


        // 门的前面和背面, 门轴在不同侧, todo 这里想调整UV, 1 与 2 调换, 3 与 4 调换, 没起作用, 先不管了
        uvs.setX(20, 1-offsetX)
        uvs.setY(20, 1-offsetY)

        uvs.setX(21, offsetX)
        uvs.setY(21, 1-offsetY)

        uvs.setX(22, 1-offsetX)
        uvs.setY(22, offsetY)

        uvs.setX(23, offsetX)
        uvs.setY(23, offsetY)

        geometry.attributes.uv.needsUpdate = true


        const door = new THREE.Mesh(geometry, [
                material0,
                material0,
                material0,
                material0,
                material,
                // todo 先注释后面的面, 观看前面面的背面效果
                //material,
            ])
        this.scene.add(door)

        // todo 注意查看 uv
        console.log("door = ", door)

    }

    protected init() {
    }


    protected onRenderer() {
        this.orbit.update()
    }

}