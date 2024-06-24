import * as THREE from "three"
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls"
import ThreeCore from "@/three-widget/ThreeCore"

import mainSphereVertexShader from './shader/mainSphere/vertexShader.glsl'
import mainSphereFragmentShader from './shader/mainSphere/fragmentShader.glsl'
// import noiseVertexShader from './shader/noise/vertexShader.glsl'
// import noiseFragmentShader from './shader/noise/fragmentShader.glsl'
import noiseVertexShader from './shader/noise/vertexShader.glsl'
import noiseFragmentShader from './shader/noise/fragmentShader.glsl'
import ringVertexShader from './shader/ring/vertexShader.glsl'
import ringFragmentShader from './shader/ring/fragmentShader.glsl'


export default class ThreeProject extends ThreeCore {

    private readonly orbit: OrbitControls

    private readonly mainSphere: THREE.Mesh
    private readonly noiseSun: THREE.Mesh
    private readonly cubeCamera: THREE.CubeCamera
    private readonly scene2: THREE.Scene
    private readonly cubeRenderTarget: THREE.WebGLCubeRenderTarget

    constructor(dom: HTMLElement) {

        super(dom, {
            cameraOptions: {
                fov: 45,
                near: 0.1,
                far: 100
            }
        })

        this.scene.background = new THREE.Color(0x000000)

        this.camera.position.set(0, 0, 20)

        this.orbit = new OrbitControls(this.camera, this.renderer.domElement)

        const axesHelper = new THREE.AxesHelper(20)
        this.scene.add(axesHelper)


        const ambientLight = new THREE.AmbientLight(0xffffff, 1)
        this.scene.add(ambientLight)


        const mainSphereGeo = new THREE.SphereGeometry(5.0, 32, 32)

        const mainSphereMat = new THREE.ShaderMaterial({
            vertexShader: mainSphereVertexShader,
            fragmentShader: mainSphereFragmentShader,
            side: THREE.DoubleSide,
            uniforms: {
                uTime: {value: 0},
                uPerlin: {value: null}
            }
        })

        const mainSphere = new THREE.Mesh(mainSphereGeo, mainSphereMat)
        //this.scene.add(mainSphere)
        this.mainSphere = mainSphere


        // 创建一个新的场景，用作cubeCamera渲染目标
        const scene2 = new THREE.Scene()
        const noiseGeo = new THREE.SphereGeometry(5.0, 32, 32)
        const noiseMat = new THREE.ShaderMaterial({
            vertexShader: noiseVertexShader,
            fragmentShader: noiseFragmentShader,
            side: THREE.DoubleSide,
            uniforms: {
                uTime: {value: 0}
            }
        })

        const noiseSun = new THREE.Mesh(noiseGeo, noiseMat)
        this.noiseSun = noiseSun
        scene2.add(noiseSun)
        this.scene2 = scene2
        this.scene.add(scene2)

        const cubeRenderTarget = new THREE.WebGLCubeRenderTarget(128, {
            generateMipmaps: true,
            minFilter: THREE.LinearMipmapLinearFilter
        })
        this.cubeRenderTarget = cubeRenderTarget
        const cubeCamera = new THREE.CubeCamera(1, 100000, cubeRenderTarget)
        scene2.add(cubeCamera)
        this.cubeCamera = cubeCamera


        const ringGeo = new THREE.SphereGeometry(7.0, 32, 32)
        const ringMat = new THREE.ShaderMaterial({
            vertexShader: ringVertexShader,
            fragmentShader: ringFragmentShader,
            side: THREE.BackSide,
            uniforms: {
                uTime: {value: 0},
                uPerlin: {value: null}
            }
        })
        const ring = new THREE.Mesh(ringGeo, ringMat)
        this.scene.add(ring)


    }

    protected init() {
    }


    protected onRenderer() {
        const elapsed = this.clock.getElapsedTime()
        const delta = this.clock.getDelta()
        this.orbit.update()

        this.cubeCamera.update(this.renderer, this.scene2)
        // @ts-ignore
        this.mainSphere.material.uniforms.uTime.value = elapsed
        // @ts-ignore
        this.mainSphere.material.uniforms.uPerlin.value = this.cubeRenderTarget.texture
        // @ts-ignore
        this.noiseSun.material.uniforms.uTime.value = elapsed

    }

}