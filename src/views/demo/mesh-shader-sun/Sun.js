import * as THREE from "three";
import mainSphereVertexShader from './shader/mainSphere/vertexShader.glsl';
import mainSphereFragmentShader from './shader/mainSphere/fragmentShader.glsl';
import cubeVertexShader from '@/views/demo/mesh-shader-sun/shader/noise/vertexShader.glsl';
import cubeFragmentShader from '@/views/demo/mesh-shader-sun/shader/noise/fragmentShader.glsl';
export default class Sun extends THREE.Group {
    mainSphere;
    cubeCamera;
    scene2;
    cubeRenderTarget;
    constructor(options) {
        super();
        const defaultOptions = {
            radius: 10,
            widthSegments: 32,
            heightSegments: 32,
        };
        const finalOptions = Object.assign({}, defaultOptions, options);
        const { radius, widthSegments, heightSegments } = finalOptions;
        const mainSphereGeo = new THREE.SphereGeometry(5.0, 32, 32);
        const mainSphereMat = new THREE.ShaderMaterial({
            vertexShader: mainSphereVertexShader,
            fragmentShader: mainSphereFragmentShader,
            side: THREE.DoubleSide,
            uniforms: {
                uTime: { value: 0 },
                uPerlin: { value: null }
            }
        });
        const mainSphere = new THREE.Mesh(mainSphereGeo, mainSphereMat);
        this.add(mainSphere);
        this.mainSphere = mainSphere;
        // 创建一个新的场景，用作cubeCamera渲染目标
        const scene2 = new THREE.Scene();
        const noiseGeo = new THREE.SphereGeometry(5.0, 32, 32);
        const noiseMat = new THREE.ShaderMaterial({
            vertexShader: cubeVertexShader,
            fragmentShader: cubeFragmentShader,
            side: THREE.DoubleSide,
            uniforms: {
                uTime: { value: 0 }
            }
        });
        const noiseSun = new THREE.Mesh(noiseGeo, noiseMat);
        scene2.add(noiseSun);
        this.scene2 = scene2;
        const cubeRenderTarget = new THREE.WebGLCubeRenderTarget(128, {
            generateMipmaps: true,
            minFilter: THREE.LinearMipmapLinearFilter
        });
        this.cubeRenderTarget = cubeRenderTarget;
        const cubeCamera = new THREE.CubeCamera(1, 100000, cubeRenderTarget);
        scene2.add(cubeCamera);
        this.cubeCamera = cubeCamera;
        // const geo = new THREE.SphereGeometry(radius, widthSegments, heightSegments)
        // const mat = new THREE.ShaderMaterial({
        //     vertexShader,
        //     fragmentShader,
        //     uniforms: {
        //         uTime: {value: 0},
        //         uPerlin: {value: null}
        //     }
        // })
    }
    update(renderer, elapsedTime) {
        this.cubeCamera.update(renderer, this.scene2);
        // @ts-ignore
        this.mainSphere.material.uniforms.uPerlin.value = this.cubeRenderTarget.texture;
        //this.material.uniforms.uTime.value = elapsedTime
    }
}
//# sourceMappingURL=Sun.js.map