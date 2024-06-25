import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import ThreeCore from "@/three-widget/ThreeCore";
import { getTextureLoader } from "@/three-widget/loader/ThreeLoader";
export default class ThreeProject extends ThreeCore {
    orbit;
    points1;
    points2;
    points3;
    constructor(dom) {
        super(dom, {
            cameraOptions: {
                fov: 75,
                near: 0.1,
                far: 10000
            }
        });
        this.scene.background = new THREE.Color(0x000000);
        this.camera.position.set(0, 0, 40);
        const ambientLight = new THREE.AmbientLight(0xffffff, 4);
        this.scene.add(ambientLight);
        this.renderer.shadowMap.enabled = true;
        this.orbit = new OrbitControls(this.camera, this.renderer.domElement);
        // const axesHelper = new THREE.AxesHelper(20)
        // this.scene.add(axesHelper)
        this.points1 = this.addAndGetPoints("public/demo/mesh-points-snow/雪花-03.png", 10000);
        this.points2 = this.addAndGetPoints("public/demo/mesh-points-snow/smoke1.png", 10000);
        this.points3 = this.addAndGetPoints("public/demo/mesh-points-snow/smoke1.png", 10000);
    }
    init() {
    }
    onRenderer() {
        this.orbit.update();
        const time = this.clock.getElapsedTime();
        this.points1.rotation.x = time * 0.3;
        this.points2.rotation.x = time * 0.5;
        this.points2.rotation.y = time * 0.4;
        this.points3.rotation.x = time * 0.2;
        this.points3.rotation.y = time * 0.2;
    }
    addAndGetPoints(texturePath, count, size = 0.5) {
        const geo = new THREE.BufferGeometry();
        const positions = new Float32Array(count * 3);
        const colors = new Float32Array(count * 3);
        for (let i = 0; i < count * 3; i++) {
            positions[i] = (Math.random() - 0.5) * 100;
            colors[i] = Math.random();
        }
        geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
        geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
        const texture = getTextureLoader().load(texturePath);
        const pointsMat = new THREE.PointsMaterial({
            map: texture,
            alphaMap: texture,
            depthWrite: false, // 叠加时使用
            blending: THREE.AdditiveBlending, // 例子重合后颜色叠加
            vertexColors: true,
            transparent: true, // 允许透明
            size: 0.5,
            color: 0xfff000,
            sizeAttenuation: true // 相机深度而衰减
        });
        const points = new THREE.Points(geo, pointsMat);
        this.scene.add(points);
        return points;
    }
}
//# sourceMappingURL=ThreeProject.js.map