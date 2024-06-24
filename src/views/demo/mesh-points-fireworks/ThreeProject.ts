import * as THREE from "three"
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls"
import ThreeCore from "@/three-widget/ThreeCore"
import Firework from "@/views/demo/mesh-points-fireworks/Firework"
import * as Three from "three"
import boxVertexShader from './box-shader/vertexShader.glsl'
import boxFragmentShader from './box-shader/fragmentShader.glsl'


export default class ThreeProject extends ThreeCore {

    private readonly orbit: OrbitControls
    private readonly fireworks: THREE.Group
    private box: THREE.Mesh

    constructor(dom: HTMLElement) {

        super(dom, {
            cameraOptions: {
                fov: 75,
                near: 0.1,
                far: 3000
            }
        })

        this.scene.background = new THREE.Color(0x000000)

        this.camera.position.set(0, 0, 3)

        // const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
        // this.scene.add(ambientLight)

        // 色彩映射——在感知光强度方面均匀分布
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping
        // 控制天空的颜色——黑夜
        this.renderer.toneMappingExposure = 0.05

        this.orbit = new OrbitControls(this.camera, this.renderer.domElement)
        this.orbit.target.y = 2

        // const axesHelper = new THREE.AxesHelper(0.5)
        // this.scene.add(axesHelper)

        this.fireworks =  new THREE.Group()
        this.scene.add(this.fireworks)

        window.addEventListener('click', this.createFireworks)

        // 烟花发射筒
        const geometry = new THREE.BoxGeometry(0.08, 0.15, 0.1)
        const BoxMaterial = new THREE.ShaderMaterial({
            uniforms: {
                uColor: {
                    value: new THREE.Color(0x73162392)
                }
            },
            vertexShader: boxVertexShader,
            fragmentShader: boxFragmentShader,
        })
        const box = new THREE.Mesh(geometry, BoxMaterial)
        box.position.y = -0.05
        this.scene.add(box)
        this.box = box
    }

    protected init() {
    }

    protected onRenderer() {
        this.orbit.update()
        this.fireworks.children.forEach(item => (item as Firework).update())
    }


    private createFireworks = () => {
        //随机烟花颜色 hsl(颜色，饱和度，亮度)
        const color = new Three.Color(`hsl(${Math.floor(Math.random() * 360)}, 100%, 80%)`)

        //随机烟花升空后爆炸位置
        const to = {
            x: Math.random() - 0.5,
            y: Math.abs(Math.random() + 1.2),
            z: Math.random() - 0.5
        }

        this.fireworks.add(new Firework(color, {x: 0, y: 0, z: 0}, to))

        // @ts-ignore
        this.box.material.uniforms.uColor.value = color
    }


}
