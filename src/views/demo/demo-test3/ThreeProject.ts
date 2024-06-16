import * as THREE from "three"
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls"
import ThreeCore from "@/three-widget/ThreeCore"
import vertexShader from "./shader/vertexShader.glsl"
import fragmentShader from "./shader/fragmentShader.glsl"
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader"


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

        this.scene.background = new THREE.Color(0x00ff00)

        this.camera.position.set(0, 5, 15)

        const ambientLight = new THREE.AmbientLight(0xffffff, 6)
        this.scene.add(ambientLight)

        const light = new THREE.DirectionalLight(0xffffff, 12)
        light.position.set(0, 60, -60)
        light.castShadow = true
        this.scene.add(light)

        const shadowLight = new THREE.DirectionalLight(0xffffff, 14)
        shadowLight.position.set(600, 60, 60)
        shadowLight.castShadow = true
        this.scene.add(shadowLight)

        this.renderer.shadowMap.enabled = true

        this.orbit = new OrbitControls(this.camera, this.renderer.domElement)
        this.orbit.target.y = 2

        const axes = new THREE.AxesHelper(5)
        this.scene.add(axes)



        // 模型加载进度管理
        const manager = new THREE.LoadingManager()
        manager.onStart = (url, loaded, total) => {}
        manager.onLoad = () => {}
        manager.onProgress = async(url, loaded, total) => {

            const progress = Math.floor(loaded / total * 100)

            if (progress === 100) {
               console.log("加载完成")
            } else {
                console.log("progress = ", progress)
            }
        }

        const loader = new GLTFLoader(manager)

        // 植物细胞
        loader.load("/demo/cell/plant_cell.glb", ({scene: obj}) => {

            console.log("obj = ", obj)

            obj.traverse((child) => {
                if (child.isMesh) {
                    child.material.metalness = 1
                    child.material.roughness = 0
                }
            })

            obj.scale.set(10, 10, 10)

            this.scene.add(obj)
        })
        // // 动物细胞
        // loader.load(AnimalCellModel, function (mesh) {
        //     mesh.scene.traverse(function (child) {
        //         if (child.isMesh) {
        //             child.material.metalness = 1;
        //             child.material.roughness = 0;
        //         }
        //     });
        //     mesh.scene.position.set(0, -8, 0);
        //     mesh.scene.scale.set(120, 120, 120);
        //     _this.animalCell = mesh.scene;
        //     _this.animalGroup.add(mesh.scene);
        // });


    }

    protected init() {
    }


    protected onRenderer() {
        const elapsed = this.clock.getElapsedTime()
        this.orbit.update()

        //this.watersMaterial.uniforms.uTime.value = elapsed
    }

}