import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import ThreeCore from "@/three-widget/ThreeCore";
import SimpleTree from "./SimpleTree";
export default class ThreeProject extends ThreeCore {
    orbit;
    constructor(dom) {
        super(dom, {
            cameraOptions: {
                fov: 45,
                near: 0.1,
                far: 1000
            }
        });
        this.scene.background = new THREE.Color(0x000000);
        this.camera.position.set(0, 2, 10);
        const ambientLight = new THREE.AmbientLight(0xffffff, 1);
        this.scene.add(ambientLight);
        const light = new THREE.DirectionalLight(0xffffff, 1);
        light.position.set(0, 60, -60);
        light.castShadow = true;
        this.scene.add(light);
        const shadowLight = new THREE.DirectionalLight(0xffffff, 3);
        shadowLight.position.set(10, 60, 60);
        shadowLight.castShadow = true;
        this.scene.add(shadowLight);
        this.renderer.shadowMap.enabled = true;
        this.orbit = new OrbitControls(this.camera, this.renderer.domElement);
        this.orbit.target.y = 2;
        // const axesHelper = new THREE.AxesHelper(20)
        // this.scene.add(axesHelper)
        const tree = new SimpleTree({ width: 2, height: 4 });
        this.scene.add(tree);
    }
    init() {
    }
    onRenderer() {
        this.orbit.update();
    }
}
//# sourceMappingURL=ThreeProject.js.map