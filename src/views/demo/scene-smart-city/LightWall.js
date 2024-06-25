import * as THREE from 'three';
import vertexShader from "./shader/lightwall/vertexShader.glsl";
import fragmentShader from "./shader/lightwall/fragmentShader.glsl";
export default class LightWall extends THREE.Mesh {
    constructor(options) {
        const defaultOptions = {
            radius: 420,
            color: "#efad35",
            height: 120,
            opacity: 0.6,
            speed: 0.5,
            renderOrder: 5,
        };
        const finalOptions = Object.assign({}, defaultOptions, options);
        const { radius, speed, opacity, renderOrder, height, color } = finalOptions;
        const geometry = new THREE.CylinderGeometry(radius, radius, height, 32, 1, true);
        geometry.translate(0, height / 2, 0);
        const material = new THREE.ShaderMaterial({
            uniforms: {
                u_height: {
                    value: height
                },
                u_speed: {
                    value: speed || 1
                },
                u_opacity: {
                    value: opacity
                },
                u_color: {
                    value: new THREE.Color(color)
                },
                time: {
                    value: 0
                }
            },
            transparent: true,
            depthWrite: false,
            depthTest: false,
            side: THREE.DoubleSide,
            vertexShader,
            fragmentShader
        });
        const mesh = new THREE.Mesh(geometry, material);
        mesh.renderOrder = renderOrder || 1;
        super(geometry, material);
    }
}
//# sourceMappingURL=LightWall.js.map