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
                far: 1000
            }
        });
        this.scene.background = new THREE.Color(0x062469); // 深蓝色
        this.camera.position.set(400, 300, -400);
        const ambientLight = new THREE.AmbientLight(0xffffff, 4);
        this.scene.add(ambientLight);
        this.orbit = new OrbitControls(this.camera, this.renderer.domElement);
        this.orbit.autoRotate = true;
        this.orbit.target.y = 100;
        this.orbit.update();
    }
    init() {
        this.load();
    }
    async load() {
        getDracoGltfLoader().load("/demo/model-csmart/csmart_darco.glb", (gltf) => {
            const obj = gltf.scene;
            this.scene.add(obj);
        });
    }
    onRenderer() {
        this.orbit.update();
    }
}
//# sourceMappingURL=ThreeProject.js.map