import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import ThreeCore from "@/three-widget/ThreeCore";
import vertexShader from "./shader/vertexShader.glsl";
import fragmentShader from "./shader/fragmentShader.glsl";
import { getTextureLoader } from "@/three-widget/loader/ThreeLoader";
import flagPic from "./texture/flag.webp";
export default class ThreeProject extends ThreeCore {
    orbit;
    shadeMaterial;
    params = {
        uWaresFrequency: 20,
        uScale: 0.1,
        uNoiseFrequency: 40,
        uNoiseScale: 2,
        uXzScale: 2,
        uLowColor: 0x000000,
        uHighColor: 0xffffff,
        uOpacity: 0.5,
    };
    constructor(dom) {
        super(dom, {
            cameraOptions: {
                fov: 45,
                near: 0.1,
                far: 100
            }
        });
        this.scene.background = new THREE.Color(0x000000);
        this.camera.position.set(0, 0, 3);
        this.orbit = new OrbitControls(this.camera, this.renderer.domElement);
        // const axesHelper = new THREE.AxesHelper(0.1)
        // this.scene.add(axesHelper)
        // const ambientLight = new THREE.AmbientLight(0xffffff, 2)
        // this.scene.add(ambientLight)
        const texture = getTextureLoader().load(flagPic);
        const shadeMaterial = new THREE.ShaderMaterial({
            vertexShader,
            fragmentShader,
            side: THREE.DoubleSide,
            uniforms: {
                uTime: {
                    value: 0
                },
                uTexture: {
                    value: texture
                }
            }
        });
        this.shadeMaterial = shadeMaterial;
        const plane = new THREE.Mesh(new THREE.PlaneGeometry(2, 1, 128, 128), shadeMaterial);
        this.scene.add(plane);
    }
    init() {
    }
    onRenderer() {
        const elapsed = this.clock.getElapsedTime();
        this.orbit.update();
        this.shadeMaterial.uniforms.uTime.value = elapsed;
    }
}
//# sourceMappingURL=ThreeProject.js.map