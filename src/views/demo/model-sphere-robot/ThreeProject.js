import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import ThreeCore from "@/three-widget/ThreeCore";
import { getDracoGltfLoader, getRGBELoader } from "@/three-widget/loader/ThreeLoader";
import { Reflector } from "three/examples/jsm/objects/Reflector";
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
        this.camera.position.set(0, 1.5, 6);
        this.scene.background = new THREE.Color(0x000000);
        this.scene.fog = new THREE.Fog('#262837', 20, 58);
        this.renderer.shadowMap.enabled = true;
        this.orbit = new OrbitControls(this.camera, this.renderer.domElement);
        // const axesHelper = new THREE.AxesHelper(100)
        // this.scene.add(axesHelper)
        const ambientLight = new THREE.AmbientLight('#b9d5ff', 0.2);
        this.scene.add(ambientLight);
        const light1 = new THREE.DirectionalLight(0xffffff, 0.5);
        light1.position.set(0, 10, 10);
        const light2 = new THREE.DirectionalLight(0xffffff, 0.4);
        light1.position.set(0, 10, -10);
        const light3 = new THREE.DirectionalLight(0xffffff, 0.7);
        light1.position.set(10, 10, 10);
        this.scene.add(light1, light2, light3);
        // 创建rgbe加载器
        getRGBELoader().load("/demo/scene-sphere-robot/sky12.hdr", (texture) => {
            texture.mapping = THREE.EquirectangularReflectionMapping;
            this.scene.background = texture;
            this.scene.environment = texture;
        });
        // 添加机器人
        getDracoGltfLoader().load("/demo/scene-sphere-robot/robot.glb", (gltf) => {
            this.scene.add(gltf.scene);
        });
        // 添加光阵
        const video = document.createElement("video");
        video.src = "/demo/scene-sphere-robot/zp2.mp4";
        video.loop = true;
        video.muted = true;
        video.play();
        const videoTexture = new THREE.VideoTexture(video);
        const videoGeoPlane = new THREE.PlaneGeometry(8, 4.5);
        const videoMaterial = new THREE.MeshBasicMaterial({
            map: videoTexture,
            transparent: true,
            side: THREE.DoubleSide,
            alphaMap: videoTexture,
        });
        const videoMesh = new THREE.Mesh(videoGeoPlane, videoMaterial);
        videoMesh.position.set(0, 0.2, 0);
        videoMesh.rotation.set(-Math.PI / 2, 0, 0);
        this.scene.add(videoMesh);
        // 添加镜面反射
        const reflectorGeometry = new THREE.PlaneGeometry(100, 100);
        const reflectorPlane = new Reflector(reflectorGeometry, {
            textureWidth: this.dom.clientWidth,
            textureHeight: this.dom.clientHeight,
            color: 0x332222,
        });
        reflectorPlane.rotation.x = -Math.PI / 2;
        this.scene.add(reflectorPlane);
    }
    init() {
    }
    onRenderer() {
        this.orbit.update();
    }
}
//# sourceMappingURL=ThreeProject.js.map