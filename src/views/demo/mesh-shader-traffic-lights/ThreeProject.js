import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import ThreeCore from "@/three-widget/ThreeCore";
import vertexShader from './shader/vertexShader.glsl';
import fragmentShader from './shader/fragmentShader.glsl';
import * as BufferGeometryUtils from "three/examples/jsm/utils/BufferGeometryUtils";
export default class ThreeProject extends ThreeCore {
    orbit;
    shaderMaterial;
    constructor(dom) {
        super(dom, {
            cameraOptions: {
                fov: 45,
                near: 0.1,
                far: 1000
            }
        });
        this.scene.background = new THREE.Color(0x000000);
        this.camera.position.set(0, 0, 100);
        this.orbit = new OrbitControls(this.camera, this.renderer.domElement);
        // const axesHelper = new THREE.AxesHelper(20)
        // this.scene.add(axesHelper)
        // const ambientLight = new THREE.AmbientLight(0xffffff, 1)
        // this.scene.add(ambientLight)
        const shape = new THREE.Shape();
        shape.moveTo(-10, 20);
        shape.absarc(0, 20, 10, Math.PI, Math.PI * 2, true);
        shape.lineTo(10, -20);
        shape.absarc(0, -20, 10, 0, Math.PI, true);
        shape.lineTo(-10, 20);
        const extrudeSettings = {
            steps: 2, //用于沿着挤出样条的深度细分的点的数量，默认值为1
            depth: 5, //挤出的形状的深度，默认值为100
            bevelEnabled: true, //对挤出的形状应用是否斜角，默认值为true
            bevelThickness: 1, //设置原始形状上斜角的厚度。默认值为6
            bevelSize: 1, //斜角与原始形状轮廓之间的延伸距离
            bevelSegments: 10, //斜角的分段层数，默认值为3
            curveSegments: 12, //曲线上点的数量，默认值是12
        };
        const frame = new THREE.ExtrudeGeometry(shape, extrudeSettings);
        const cylinderGeom = new THREE.CylinderGeometry(6, 6, 6, 30, 20);
        const cylinderGeomRed = cylinderGeom.clone();
        const cylinderGeomYellow = cylinderGeom.clone();
        const cylinderGeomGreen = cylinderGeom.clone();
        cylinderGeomRed.applyMatrix4(new THREE.Matrix4().compose(new THREE.Vector3(0, 15, 3.1), new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), Math.PI / 2), new THREE.Vector3(1, 1, 1)));
        cylinderGeomYellow.applyMatrix4(new THREE.Matrix4().compose(new THREE.Vector3(0, 0, 3.1), new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), Math.PI / 2), new THREE.Vector3(1, 1, 1)));
        cylinderGeomGreen.applyMatrix4(new THREE.Matrix4().compose(new THREE.Vector3(0, -15, 3.1), new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), Math.PI / 2), new THREE.Vector3(1, 1, 1)));
        const mergedGeometry = BufferGeometryUtils.mergeGeometries([
            frame.toNonIndexed(), // 转换为非索引格式
            cylinderGeomRed.toNonIndexed(),
            cylinderGeomYellow.toNonIndexed(),
            cylinderGeomGreen.toNonIndexed(),
        ]);
        const shaderMaterial = new THREE.ShaderMaterial({
            vertexShader: vertexShader,
            fragmentShader: fragmentShader,
            side: THREE.DoubleSide,
            uniforms: {
                time: {
                    value: 0.0
                }
            }
        });
        this.shaderMaterial = shaderMaterial;
        const trafficLights = new THREE.Mesh(mergedGeometry, shaderMaterial);
        this.scene.add(trafficLights);
    }
    init() {
    }
    onRenderer() {
        const elapsed = this.clock.getElapsedTime();
        this.orbit.update();
        this.shaderMaterial.uniforms.time.value = elapsed;
    }
}
//# sourceMappingURL=ThreeProject.js.map