import * as THREE from "three";
import firesVertexShader from './fires-shader/vertexShader.glsl';
import firesFragmentShader from './fires-shader/fragmentShader.glsl';
import ballVertexShader from './ball-shader/vertexShader.glsl';
import ballFragmentShader from './ball-shader/fragmentShader.glsl';
export default class Firework extends THREE.Group {
    clock = new THREE.Clock();
    color;
    ballMaterial;
    ball;
    firesMaterial;
    fires;
    constructor(color, from, to) {
        super();
        this.color = color;
        // 创建烟花发射球
        const ballGeometry = new THREE.BufferGeometry();
        const fromPositions = new Float32Array(3);
        fromPositions[0] = from.x;
        fromPositions[1] = from.y;
        fromPositions[2] = from.z;
        ballGeometry.setAttribute('position', new THREE.BufferAttribute(fromPositions, 3));
        const distances = new Float32Array(3);
        distances[0] = to.x - from.x;
        distances[1] = to.y - from.y;
        distances[2] = to.z - from.z;
        ballGeometry.setAttribute('aDistance', new THREE.BufferAttribute(distances, 3));
        const ballMaterial = new THREE.ShaderMaterial({
            vertexShader: ballVertexShader,
            fragmentShader: ballFragmentShader,
            transparent: true,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
            uniforms: {
                uTime: {
                    value: 0
                },
                uSize: {
                    value: 20
                },
                uColor: {
                    value: this.color
                }
            }
        });
        this.ballMaterial = ballMaterial;
        const ball = new THREE.Points(ballGeometry, ballMaterial);
        this.add(ball);
        this.ball = ball;
        // 创建爆炸火花
        // 爆炸火花数量 180 - 200个
        const firesCount = 180 + Math.floor(Math.random() * 200);
        const firesGeometry = new THREE.BufferGeometry();
        // 火花的起点, 实际值是发射球的终点
        const fireFromPositions = new Float32Array(firesCount * 3);
        // 火花的终点
        const fireToPositions = new Float32Array(firesCount * 3);
        const aScales = new Float32Array(firesCount);
        for (let i = 0; i < firesCount; i++) {
            fireFromPositions[i * 3] = to.x;
            fireFromPositions[i * 3 + 1] = to.y;
            fireFromPositions[i * 3 + 2] = to.z;
            // 每个火花发射角度
            const theta = Math.random() * 2 * Math.PI; //θ
            const phi = Math.random() * 2 * Math.PI; //φ
            const r = Math.random();
            fireToPositions[i * 3] = r * Math.sin(theta) + r * Math.sin(phi);
            fireToPositions[i * 3 + 1] = r * Math.cos(theta) + r * Math.cos(phi);
            fireToPositions[i * 3 + 2] = r * Math.sin(theta) + r * Math.cos(phi);
            // 火花随机大小
            aScales[i] = Math.random();
        }
        firesGeometry.setAttribute('position', new THREE.BufferAttribute(fireFromPositions, 3));
        firesGeometry.setAttribute('aToPosition', new THREE.BufferAttribute(fireToPositions, 3));
        firesGeometry.setAttribute('aScale', new THREE.BufferAttribute(aScales, 1));
        const firesMaterial = new THREE.ShaderMaterial({
            vertexShader: firesVertexShader,
            fragmentShader: firesFragmentShader,
            transparent: true,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
            uniforms: {
                uTime: {
                    value: 0
                },
                uSize: {
                    value: 0
                },
                uColor: {
                    value: this.color
                }
            }
        });
        this.firesMaterial = firesMaterial;
        this.fires = new THREE.Points(firesGeometry, firesMaterial);
        this.add(this.fires);
    }
    update() {
        const elapsedTime = this.clock.getElapsedTime();
        // 烟花生命周期为5秒, 升天1秒, 小于1秒时刷新烟花球位置, 大于1秒释放烟花球资源, 生成爆炸火花, 大于5秒释放火花资源
        if (elapsedTime < 1) {
            this.ballMaterial.uniforms.uTime.value = elapsedTime;
            this.ballMaterial.uniforms.uSize.value = 20;
        }
        else {
            const time = elapsedTime - 1;
            // 先让烟花视觉上消失
            this.ballMaterial.uniforms.uSize.value = 0;
            // 烟花视觉从内存中清除
            this.removeSource(this.ball);
            // 爆炸火花显示
            this.firesMaterial.uniforms.uSize.value = 20;
            this.firesMaterial.uniforms.uTime.value = time;
            if (time > 5) {
                // 爆炸火花从内存中清除
                this.removeSource(this.fires);
                // 本类group对象从内存中清除
                this.parent?.remove(this);
            }
        }
    }
    removeSource(src) {
        src.clear();
        src.geometry.dispose();
        const material = src.material;
        material.dispose();
        src.parent?.remove(src);
    }
}
//# sourceMappingURL=Firework.js.map