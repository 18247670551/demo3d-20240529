import * as THREE from "three"
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls"
import ThreeCore from "@/three-widget/ThreeCore"
import vertexShader from './shader/vertexShader.glsl'
import fragmentShader from './shader/fragmentShader.glsl'
import {getTextureLoader} from "@/three-widget/loader/ThreeLoader";


export default class ThreeProject extends ThreeCore {

    private readonly orbit: OrbitControls
    private readonly material: THREE.ShaderMaterial

    constructor(dom: HTMLElement) {

        super(dom, {
            cameraOptions: {
                fov: 75,
                near: 0.1,
                far: 1000
            }
        })

        this.scene.background = new THREE.Color(0x000000)

        this.camera.position.set(0, 0, 10)

        const ambientLight = new THREE.AmbientLight(0xffffff, 4)
        this.scene.add(ambientLight)

        this.orbit = new OrbitControls(this.camera, this.renderer.domElement)

        this.material = this.addPointsAndGetMaterial()
    }

    protected init() {

    }

    protected onRenderer() {
        const time = this.clock.getElapsedTime()
        this.orbit.update()

        this.material.uniforms.uTime.value = time
    }

    private addPointsAndGetMaterial() {

        const params = {
            count: 10000,
            size: 0.3,
            radius: 10,
            branch: 4,
            color: '#ff6030',
            rotateScale: 0.3,
            endColor: '#1b3984'
        }

        const texture = getTextureLoader().load('/demo/points4/1.png')
        const texture1 = getTextureLoader().load('/demo/points4/2.png')
        const texture2 = getTextureLoader().load('/demo/points4/3.png')

        const geometry = new THREE.BufferGeometry()

        const positions = new Float32Array(params.count * 3)
        const colors = new Float32Array(params.count * 3)
        const imgIndex = new Float32Array(params.count)

        const centerColor = new THREE.Color(params.color)
        const endColor = new THREE.Color(params.endColor)

        for (let i = 0; i < params.count; i++) {
            //当前的点应该在哪一条分支的角度上
            const branchAngel = (i % params.branch) * ((2 * Math.PI) / params.branch)
            //当前点距离圆心的距离
            const distance = Math.random() * params.radius * Math.pow(Math.random(), 3)
            const current = i * 3
            const randomX = Math.pow(Math.random() * 2 - 1, 3) * (params.radius - distance) / 5
            const randomY = Math.pow(Math.random() * 2 - 1, 3) * (params.radius - distance) / 5
            const randomZ = Math.pow(Math.random() * 2 - 1, 3) * (params.radius - distance) / 5

            //全在x轴上
            positions[current] = Math.cos(branchAngel + distance * params.rotateScale) * distance + randomX
            positions[current + 1] = randomY
            positions[current + 2] = Math.sin(branchAngel + distance * params.rotateScale) * distance + randomZ
            //混合颜色，形成渐变:lerp()
            const mixColor = centerColor.clone()
            mixColor.lerp(endColor, distance / params.radius)
            colors[current] = mixColor.r
            colors[current + 1] = mixColor.g
            colors[current + 2] = mixColor.b

            //根据索引值设置不同的图案
            imgIndex[current] = current % 3
        }
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
        geometry.setAttribute('imgIndex', new THREE.BufferAttribute(imgIndex, 1))

        const material = new THREE.ShaderMaterial({
            vertexShader: vertexShader,
            fragmentShader: fragmentShader,
            transparent: true,
            vertexColors: true,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
            uniforms: {
                uTexture: {
                    value: texture
                },
                uTexture1: {
                    value: texture1
                },
                uTexture2: {
                    value: texture2
                },
                uTime: {
                    value: 0
                },
                uColor: {
                    value: params.color
                }
            }
        })

        const points = new THREE.Points(geometry, material)

        this.scene.add(points)

        return material
    }

}
