import * as THREE from "three"
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls"
import ThreeCore from "@/three-widget/ThreeCore"
import FireWork from "@/views/demo/demo-points5/FireWork"
import * as Three from "three"
import boxVertexShader from './box-shader/vertexShader.glsl'
import boxFragmentShader from './box-shader/fragmentShader.glsl'


export default class ThreeProject extends ThreeCore{

    private readonly orbit: OrbitControls
    private readonly fireworks: FireWork[] = []

    private box: THREE.Mesh

    constructor(dom: HTMLElement) {

        super(dom, {
            cameraOptions: {
                fov: 75,
                near: 0.1,
                far: 300
            }
        })

        this.scene.background = new THREE.Color(0x000000)

        this.camera.position.set(0, 0, 20)

        // const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
        // this.scene.add(ambientLight)

        // 色彩映射——在感知光强度方面均匀分布
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping
        // 控制天空的颜色——黑夜
        this.renderer.toneMappingExposure = 0.05

        this.orbit = new OrbitControls(this.camera, this.renderer.domElement)
        this.orbit.target.y = 12


        const axes = new THREE.AxesHelper(5)
        this.scene.add(axes)

        window.addEventListener('click', this.createFireworks)


        // 烟花发射盘
        const geometry = new THREE.BoxGeometry(2, 1, 1)
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
        //cube.position.y = -1
        this.scene.add(box)
        this.box = box
    }

    protected init(){}

    protected onRenderer() {
        this.orbit.update()

        this.fireworks.forEach(item=>{
            item.update()
        })

    }


    private createFireworks = () => {
        //hsl(颜色，饱和度，亮度)
        let color = new Three.Color(`hsl(${Math.floor(Math.random()*360)},100%,80%)`)
        let position = {
            x:(Math.random() -0.5)*40,
            z:-(Math.random() -0.5)*40,
            y:7 + Math.random() * 25
        }

        //随机生成颜色和烟花的位置
        let firework = new FireWork(color, {x: 0, y: 0, z: 0}, position)
        this.scene.add(firework.startPoint, firework.fireworks)
        this.fireworks.push(firework)

        // @ts-ignore
        this.box.material.uniforms.uColor.value = color
    }


}
