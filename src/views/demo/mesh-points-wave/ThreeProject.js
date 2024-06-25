import * as THREE from "three";
import ThreeCore from "@/three-widget/ThreeCore";
import * as BufferGeometryUtils from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { BufferAttribute } from "three";
import vertexShader from "./shader/vertexShader.glsl";
import fragmentShader from "./shader/fragmentShader.glsl";
export default class ThreeProject extends ThreeCore {
    material;
    constructor(dom) {
        super(dom, {
            cameraOptions: {
                fov: 75,
                near: 0.1,
                far: 1000
            }
        });
        this.scene.background = new THREE.Color(0x000000);
        this.camera.position.set(0, 150, 1000);
        const ambientLight = new THREE.AmbientLight(0xffffff, 4);
        this.scene.add(ambientLight);
        const material = new THREE.ShaderMaterial({
            uniforms: {
                time: {
                    value: 0
                }
            },
            vertexShader,
            fragmentShader
        });
        this.material = material;
        let bufferGeometry = new THREE.BufferGeometry();
        bufferGeometry.setAttribute('position', new BufferAttribute(new Float32Array(), 3));
        for (let i = 0; i < 39; i++) {
            for (let j = 0; j < 39; j++) {
                let sphereGeometry = new THREE.SphereGeometry(2, 15, 10);
                sphereGeometry.translate(i * 50 - 950, 0, j * 50 - 950); //这里我们使用Geometry的translate方法将间隔调成50
                // 因为 上面创建的 bufferGeometry 没有 normal 和 uv 属性, 而 sphereGeometry 是有的, 合并时, 会报没有属性, 合并错误, 那就在这把 sphereGeometry 的这两个属性删除掉
                sphereGeometry.deleteAttribute("normal");
                sphereGeometry.deleteAttribute("uv");
                bufferGeometry = BufferGeometryUtils.mergeGeometries([
                    bufferGeometry,
                    sphereGeometry.toNonIndexed() // 转换为非索引格式
                ]);
            }
        }
        const total = bufferGeometry.attributes.position.count;
        const every = total / 39 / 39;
        const centers = new Float32Array(total * 3);
        //将中心点保存到centers中
        for (let i = 0; i < 39; i++) {
            for (let j = 0; j < 39; j++) {
                for (let k = 0; k < every; k++) {
                    centers[(i * 39 * every + j * every + k) * 3] = i * 50 - 950;
                    centers[(i * 39 * every + j * every + k) * 3 + 1] = 0;
                    centers[(i * 39 * every + j * every + k) * 3 + 2] = j * 50 - 950;
                }
            }
        }
        bufferGeometry.setAttribute('centers', new THREE.BufferAttribute(centers, 3));
        const points = new THREE.Mesh(bufferGeometry, material);
        this.scene.add(points);
    }
    init() {
    }
    onRenderer() {
        this.material.uniforms.time.value = this.clock.getElapsedTime();
    }
}
//# sourceMappingURL=ThreeProject.js.map