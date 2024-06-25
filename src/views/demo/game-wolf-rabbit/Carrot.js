import * as THREE from "three";
export default class Carrot extends THREE.Group {
    angle = 0;
    body;
    leaf1;
    leaf2;
    constructor() {
        super();
        const greenMat = new THREE.MeshPhongMaterial({
            color: 0x7abf8e,
            shininess: 0,
        });
        const pinkMat = new THREE.MeshPhongMaterial({
            color: 0xdc5f45, //0xb43b29,//0xff5b49,
            shininess: 0,
        });
        const bodyGeom = new THREE.CylinderGeometry(5, 3, 10, 4, 1);
        const vs = bodyGeom.getAttribute("position");
        vs.setY(8, vs.getY(8) + 2);
        vs.setY(9, vs.getY(9) - 3);
        bodyGeom.attributes.position.needsUpdate = true;
        this.body = new THREE.Mesh(bodyGeom, pinkMat);
        const leafGeom = new THREE.BoxGeometry(5, 10, 1, 1);
        const vs1 = bodyGeom.getAttribute("position");
        vs1.setX(2, vs1.getX(2) - 1);
        vs1.setX(3, vs1.getX(3) - 1);
        vs1.setX(6, vs1.getX(6) + 1);
        vs1.setX(7, vs1.getX(7) + 1);
        leafGeom.attributes.position.needsUpdate = true;
        leafGeom.applyMatrix4(new THREE.Matrix4().makeTranslation(0, 5, 0));
        this.leaf1 = new THREE.Mesh(leafGeom, greenMat);
        this.leaf1.position.y = 7;
        this.leaf1.rotation.x = .2;
        this.leaf1.rotation.z = .3;
        this.leaf2 = this.leaf1.clone();
        this.leaf2.scale.set(1, 1.3, 1);
        this.leaf2.position.y = 7;
        this.leaf2.rotation.x = -.2;
        this.leaf2.rotation.z = -.3;
        this.add(this.body);
        this.add(this.leaf1);
        this.add(this.leaf2);
        this.body.traverse((object) => {
            object.castShadow = true;
            object.receiveShadow = true;
        });
    }
}
//# sourceMappingURL=Carrot.js.map