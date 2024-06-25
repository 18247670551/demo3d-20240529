import * as THREE from "three";
export default class Sun extends THREE.Mesh {
    options;
    constructor(options) {
        const defaultOptions = {};
        const finalOptions = Object.assign({}, defaultOptions, options);
        const sunGeom = new THREE.SphereGeometry(400, 20, 10);
        const sunMat = new THREE.MeshPhongMaterial({
            color: 0xedeb27,
            flatShading: true
        });
        super(sunGeom, sunMat);
        this.options = finalOptions;
        //this.applyMatrix(new THREE.Matrix4().makeRotationX(-Math.PI/2))
        this.castShadow = false;
        this.receiveShadow = false;
        this.scale.set(1, 1, .3);
        this.position.set(0, -30, -850);
    }
}
//# sourceMappingURL=Sun.js.map