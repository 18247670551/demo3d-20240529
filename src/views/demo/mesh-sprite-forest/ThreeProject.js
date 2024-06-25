import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import ThreeCore from "@/three-widget/ThreeCore";
import { getCubeTextureLoader, getTextureLoader } from "@/three-widget/loader/ThreeLoader";
import tree1Pic from "/public/demo/mesh-sprite-forest/tree1.png";
import tree2Pic from "/public/demo/mesh-sprite-forest/tree2.png";
import tree3Pic from "/public/demo/mesh-sprite-forest/tree3.png";
import tree4Pic from "/public/demo/mesh-sprite-forest/tree4.png";
import tree5Pic from "/public/demo/mesh-sprite-forest/tree5.png";
import tree6Pic from "/public/demo/mesh-sprite-forest/tree6.png";
import tree7Pic from "/public/demo/mesh-sprite-forest/tree7.png";
import cubeLeftPic from "/public/demo/mesh-sprite-forest/skybox/left.jpg";
import cubeRightPic from "/public/demo/mesh-sprite-forest/skybox/right.jpg";
import cubeTopPic from "/public/demo/mesh-sprite-forest/skybox/top.jpg";
import cubeBottomPic from "/public/demo/mesh-sprite-forest/skybox/bottom.jpg";
import cubeFrontPic from "/public/demo/mesh-sprite-forest/skybox/front.jpg";
import cubeBackPic from "/public/demo/mesh-sprite-forest/skybox/back.jpg";
import grassPic from "/public/demo/mesh-sprite-forest/grass.jpg";
export default class ThreeProject extends ThreeCore {
    orbit;
    constructor(dom) {
        super(dom, {
            cameraOptions: {
                fov: 60,
                near: 0.1,
                far: 100000
            }
        });
        this.scene.background = new THREE.Color(0x062469); // 深蓝色
        this.camera.position.set(0, 200, 400);
        const ambientLight = new THREE.AmbientLight(0xffffff, 4);
        this.scene.add(ambientLight);
        this.orbit = new OrbitControls(this.camera, this.renderer.domElement);
        this.orbit.target.y = 100;
        this.orbit.update();
    }
    init() {
        this.addSky();
        this.addGround();
        this.addTrees();
    }
    addSky() {
        getCubeTextureLoader().load([cubeLeftPic, cubeRightPic, cubeTopPic, cubeBottomPic, cubeFrontPic, cubeBackPic], texture => {
            this.scene.background = texture;
        });
    }
    addGround() {
        const planeGeometry = new THREE.PlaneGeometry(3000, 3000);
        const texture = getTextureLoader().load(grassPic);
        texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(60, 60);
        const material = new THREE.MeshBasicMaterial({
            color: 0x14A88A,
            side: THREE.DoubleSide,
            map: texture
        });
        const plane = new THREE.Mesh(planeGeometry, material);
        plane.rotateX(Math.PI / 2);
        this.scene.add(plane);
    }
    addTrees() {
        const matParams = [
            { color: "#929f40", map: tree1Pic },
            { color: "#e1e091", map: tree2Pic },
            { color: "#00cc22", map: tree3Pic },
            { color: "#014301", map: tree4Pic },
            { color: "#e19363", map: tree5Pic },
            { color: "#717e05", map: tree6Pic },
            { color: "#fd693b", map: tree7Pic },
        ];
        const mats = matParams.map(param => new THREE.SpriteMaterial({
            transparent: true,
            color: param.color,
            map: getTextureLoader().load(param.map)
        }));
        const group = new THREE.Group();
        for (let i = 0; i < 500; i++) {
            const tree = new THREE.Sprite(mats[THREE.MathUtils.randInt(0, mats.length - 1)]);
            const x = THREE.MathUtils.randFloatSpread(2000);
            const z = THREE.MathUtils.randFloatSpread(2000);
            tree.position.set(x, 50, z);
            tree.scale.set(100, 100, 1);
            group.add(tree);
        }
        this.scene.add(group);
    }
    onRenderer() {
        this.orbit.update();
    }
}
//# sourceMappingURL=ThreeProject.js.map