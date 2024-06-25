import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import ThreeCore from "@/three-widget/ThreeCore";
import { getDracoGltfLoader } from "@/three-widget/loader/ThreeLoader";
export default class ThreeProject extends ThreeCore {
    orbit;
    constructor(dom) {
        super(dom, {
            cameraOptions: {
                fov: 45,
                near: 0.1,
                far: 100000
            }
        });
        this.scene.background = new THREE.Color(0x000000);
        this.camera.position.set(-10, 20, 30);
        const ambientLight = new THREE.AmbientLight(0xffffff, 4);
        this.scene.add(ambientLight);
        const light = new THREE.DirectionalLight(0xffffff, 0.1);
        light.position.set(100, 60, -600);
        light.castShadow = true;
        this.scene.add(light);
        const shadowLight = new THREE.DirectionalLight(0xffffff, 4);
        shadowLight.position.set(100, 60, 600);
        shadowLight.castShadow = true;
        this.scene.add(shadowLight);
        this.renderer.shadowMap.enabled = true;
        this.orbit = new OrbitControls(this.camera, this.renderer.domElement);
        //this.orbit.target.y = 10
        // const axesHelper = new THREE.AxesHelper(10)
        // this.scene.add(axesHelper)
        getDracoGltfLoader().load("public/demo/model-football-field/football-field.glb", gltf => {
            console.log("gltf = ", gltf);
            this.scene.add(gltf.scene);
        });
    }
    init() {
    }
    onRenderer() {
        this.orbit.update();
    }
}
//# sourceMappingURL=ThreeProject.js.map