import * as THREE from "three"
import ThreeCore from "@/three-widget/ThreeCore"
import vertexShader from './shader/vertexShader.glsl'
import fragmentShader from './shader/fragmentShader.glsl'
import {getTextureLoader} from "@/three-widget/loader/ThreeLoader"


export default class ThreeProject extends ThreeCore {

    private mat: THREE.ShaderMaterial
    // 创建一个鼠标位置对象, 用于传给 shader
    private mouse = new THREE.Vector2()

    constructor(dom: HTMLElement) {

        super(dom, {
            cameraOptions: {
                fov: 90,
                near: 0.01,
                far: 1000
            }
        })

        this.camera.position.set(0, 0, 5)

        const ambientLight = new THREE.AmbientLight(0xffffff, 0.9)
        this.scene.add(ambientLight)

        const texture = getTextureLoader().load("/demo/mesh-photo3d/photo.jpg")
        const depthTexture = getTextureLoader().load("/demo/mesh-photo3d/photo_depth.png")



        const geo = new THREE.PlaneGeometry(19.2, 12.8)

        const mat = new THREE.ShaderMaterial({
            uniforms: {
                uTime: {value: 0},
                uTexture: {value: texture},
                uDepthTexture: {value: depthTexture},
                uMouse: {value: this.mouse}
            },
            vertexShader,
            fragmentShader,
        })
        this.mat = mat
        const mesh = new THREE.Mesh(geo, mat)
        this.scene.add(mesh)

        window.addEventListener("mousemove", (event) => {
            this.mouse.x = (event.clientX / dom.clientWidth) * 2 - 1
            this.mouse.y = -(event.clientY / dom.clientHeight) * 2 + 1
        })

    }

    protected init() {
        this.mat.uniforms.uMouse.value = this.mouse
    }

    protected onRenderer() {

    }

}
