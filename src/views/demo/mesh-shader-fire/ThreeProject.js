import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import ThreeCore from "@/three-widget/ThreeCore";
import vertexShader from "./shader/vertexShader.glsl";
import fragmentShader from "./shader/fragmentShader.glsl";
export default class ThreeProject extends ThreeCore {
    orbit;
    material;
    constructor(dom) {
        super(dom, {
            cameraOptions: {
                fov: 45,
                near: 0.1,
                far: 10000
            }
        });
        this.scene.background = new THREE.Color(0x000000);
        this.camera.position.set(0, 0, 2);
        this.renderer.shadowMap.enabled = true;
        this.orbit = new OrbitControls(this.camera, this.renderer.domElement);
        // const axesHelper = new THREE.AxesHelper(0.1)
        // this.scene.add(axesHelper)
        const geometry = new THREE.PlaneGeometry(1, 1);
        const material = new THREE.ShaderMaterial({
            uniforms: {
                iTime: { value: 0 },
            },
            fragmentShader,
            vertexShader,
            side: THREE.DoubleSide,
            transparent: true,
        });
        this.material = material;
        const mesh = new THREE.Mesh(geometry, material);
        this.scene.add(mesh);
    }
    init() {
    }
    onRenderer() {
        const elapsed = this.clock.getElapsedTime();
        this.orbit.update();
        //this.material.uniforms.iTime.value += 0.01
        this.material.uniforms.iTime.value = elapsed;
    }
}
//# sourceMappingURL=ThreeProject.js.map