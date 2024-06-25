import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry";
import ThreeCore from "@/three-widget/ThreeCore";
export default class ThreeProject extends ThreeCore {
    dropCount;
    orbit;
    // 先构建一个标准水滴, 后面的水滴全都用此克隆
    drop;
    // 下落的水滴用一个组管理
    drops;
    count = 0;
    constructor(dom, dropCount) {
        super(dom, {
            cameraOptions: {
                fov: 25,
                near: 0.1,
                far: 5000
            }
        });
        this.dropCount = dropCount;
        this.scene.background = new THREE.Color(0x248079); // 蓝色
        this.camera.position.set(-7, 4, 4);
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        this.scene.add(ambientLight);
        const mainLight = new THREE.DirectionalLight(0xffffff, 3);
        mainLight.position.set(200, 200, 200);
        mainLight.castShadow = true;
        this.scene.add(mainLight);
        const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        directionalLight.position.set(-100, 200, 50);
        directionalLight.castShadow = true;
        this.scene.add(directionalLight);
        this.renderer.shadowMap.enabled = true;
        const orbit = new OrbitControls(this.camera, this.renderer.domElement);
        orbit.enableDamping = false; //阻尼(是否有惯性)
        orbit.dampingFactor = 0.25; //动态阻尼系数(鼠标拖拽旋转灵敏度)
        orbit.enableZoom = true; //缩放
        orbit.autoRotate = false; //自动旋转
        orbit.minDistance = 2; //设置相机距离原点的最近距离
        orbit.maxDistance = 10; //设置相机距离原点的最远距离
        orbit.enablePan = false; //开启右键拖拽
        orbit.maxPolarAngle = Math.PI / 2.2; //最大角度
        this.orbit = orbit;
        const grassLandMaterial = new THREE.MeshLambertMaterial({ color: 0xABD66A });
        const riverMaterial = new THREE.MeshLambertMaterial({ color: 0x70B7E3 });
        // 左侧草地
        this.addLeftGrassLand(grassLandMaterial);
        // 左侧草地
        this.addRightGrassLand(grassLandMaterial);
        // 河床
        this.addRiverBed(grassLandMaterial);
        // 河流
        this.addRiver(riverMaterial);
        // 树林
        this.addTrees();
        // 桥
        this.addBridge();
        this.drop = new Drop();
        this.drops = new THREE.Group();
        this.scene.add(this.drops);
    }
    init() { }
    onRenderer() {
        this.fallAnimate();
        this.dropCount.value = this.drops.children.length;
        this.orbit.update();
    }
    addLeftGrassLand(mat) {
        const geo = new THREE.BoxGeometry(2, 0.2, 2);
        const grassLand = new THREE.Mesh(geo, mat);
        grassLand.position.set(-1, 0.1, 0);
        grassLand.receiveShadow = true;
        this.scene.add(grassLand);
        this.scene.add(this.customReceiveShow(grassLand, 0.25));
    }
    addRightGrassLand(mat) {
        const geo = new THREE.BoxGeometry(1, 0.2, 2);
        const grassLand = new THREE.Mesh(geo, mat);
        grassLand.position.set(1.5, 0.1, 0);
        this.scene.add(grassLand);
        this.scene.add(this.customReceiveShow(grassLand, 0.25));
    }
    addRiverBed(mat) {
        const riverBedGeo = new THREE.BoxGeometry(1, 0.05, 2);
        const riverBed = new THREE.Mesh(riverBedGeo, mat);
        riverBed.position.set(0.5, 0.025, 0);
        this.scene.add(riverBed);
    }
    addRiver(mat) {
        const riverGeo = new THREE.BoxGeometry(1, 0.1, 2);
        const river = new THREE.Mesh(riverGeo, mat);
        river.position.set(0.5, 0.1, 0);
        this.scene.add(river);
        this.scene.add(this.customReceiveShow(river, 0.08));
    }
    createTree() {
        const group = new THREE.Group();
        // 树干
        const trunkGeo = new THREE.BoxGeometry(0.15, 0.15, 0.15);
        const trunkMaterial = new THREE.MeshLambertMaterial({ color: 0x9A6169 });
        const trunk = new THREE.Mesh(trunkGeo, trunkMaterial);
        trunk.position.set(0, 0.275, 0);
        trunk.castShadow = true;
        group.add(this.customReceiveShow(trunk, 0.25));
        group.add(trunk);
        // 树叶
        const leavesGeo = new THREE.BoxGeometry(0.25, 0.4, 0.25);
        const leavesMat = new THREE.MeshLambertMaterial({ color: 0x65BB61 });
        const leaves = new THREE.Mesh(leavesGeo, leavesMat);
        leaves.position.set(0, 0.2 + 0.15 + 0.4 / 2, 0);
        leaves.castShadow = true;
        group.add(this.customReceiveShow(leaves, 0.25));
        group.add(leaves);
        return group;
    }
    // 和 createTree() 只有树叶的几何体 leavesGeo 有区别, 变成了圆角立方体 RoundedBoxGeometry
    createRoundTree() {
        const group = new THREE.Group();
        // 树干
        const trunkGeo = new THREE.BoxGeometry(0.15, 0.15, 0.15);
        const trunkMaterial = new THREE.MeshLambertMaterial({ color: 0x9A6169 });
        const trunk = new THREE.Mesh(trunkGeo, trunkMaterial);
        trunk.position.set(0, 0.275, 0);
        trunk.castShadow = true;
        group.add(this.customReceiveShow(trunk, 0.25));
        group.add(trunk);
        // 树叶
        const leavesGeo = new RoundedBoxGeometry(0.4, 0.5, 0.4, 1, 0.5); // 长宽高，圆角半径
        const leavesMat = new THREE.MeshStandardMaterial({ color: 0x65BB61 });
        const leaves = new THREE.Mesh(leavesGeo, leavesMat);
        leaves.position.set(0, 0.2 + 0.15 + 0.4 / 2, 0);
        leaves.castShadow = true;
        group.add(this.customReceiveShow(leaves, 0.25));
        group.add(leaves);
        return group;
    }
    // 和 createTree() 只有树叶的几何体 leavesGeo 有区别, 变成了圆角立方体 RoundedBoxGeometry
    createRoundTree1() {
        const group = new THREE.Group();
        // 树干
        const trunkGeo = new THREE.BoxGeometry(0.15, 0.15, 0.15);
        const trunkMaterial = new THREE.MeshLambertMaterial({ color: 0x9A6169 });
        const trunk = new THREE.Mesh(trunkGeo, trunkMaterial);
        trunk.position.set(0, 0.275, 0);
        trunk.castShadow = true;
        group.add(this.customReceiveShow(trunk, 0.25));
        group.add(trunk);
        // 树叶
        const leavesGeo = new RoundedBoxGeometry(0.3, 0.4, 0.3, 1, 0.05); // 长宽高，圆角半径
        const leavesMat = new THREE.MeshStandardMaterial({ color: 0x65BB61 });
        const leaves = new THREE.Mesh(leavesGeo, leavesMat);
        leaves.position.set(0, 0.2 + 0.15 + 0.4 / 2, 0);
        leaves.castShadow = true;
        group.add(this.customReceiveShow(leaves, 0.25));
        group.add(leaves);
        return group;
    }
    // 和 createTree() 只有树叶的几何体 leavesGeo 有区别, 变成了圆角立方体 RoundedBoxGeometry
    createRoundTree2() {
        const group = new THREE.Group();
        // 树干
        const trunkGeo = new THREE.BoxGeometry(0.15, 0.15, 0.15);
        const trunkMaterial = new THREE.MeshLambertMaterial({ color: 0x9A6169 });
        const trunk = new THREE.Mesh(trunkGeo, trunkMaterial);
        trunk.position.set(0, 0.275, 0);
        trunk.castShadow = true;
        group.add(this.customReceiveShow(trunk, 0.25));
        group.add(trunk);
        // 树叶
        const leavesGeo = new RoundedBoxGeometry(0.4, 0.5, 0.4, 3, 0.5); // 长宽高，圆角半径
        const leavesMat = new THREE.MeshStandardMaterial({ color: 0x65BB61 });
        const leaves = new THREE.Mesh(leavesGeo, leavesMat);
        leaves.position.set(0, 0.2 + 0.15 + 0.4 / 2, 0);
        leaves.castShadow = true;
        group.add(this.customReceiveShow(leaves, 0.25));
        group.add(leaves);
        return group;
    }
    addTrees() {
        // 左侧树
        const tree1 = this.createTree();
        const tree2 = tree1.clone();
        const tree3 = this.createRoundTree2();
        const tree4 = this.createRoundTree1();
        const tree5 = tree1.clone();
        const tree6 = this.createRoundTree();
        const tree7 = tree1.clone();
        const tree8 = this.createRoundTree2();
        const tree9 = tree1.clone();
        // 右侧树
        const tree10 = tree1.clone();
        const tree11 = tree1.clone();
        const tree12 = this.createRoundTree();
        const tree13 = tree1.clone();
        const tree14 = this.createRoundTree1();
        tree1.position.set(-1.75, 0, -.85);
        tree2.position.set(-1.75, 0, -.15);
        tree3.position.set(-1.5, 0, -.5);
        tree4.position.set(-1.5, 0, .4);
        tree5.position.set(-1.25, 0, -.85);
        tree6.position.set(-1.25, 0, .75);
        tree7.position.set(-.75, 0, -.85);
        tree8.position.set(-.75, 0, -.25);
        tree9.position.set(-.25, 0, -.85);
        tree10.position.set(1.25, 0, -.85);
        tree11.position.set(1.25, 0, .75);
        tree12.position.set(1.5, 0, -.5);
        tree13.position.set(1.75, 0, -.85);
        tree14.position.set(1.75, 0, .35);
        this.scene.add(tree1, tree2, tree3, tree4, tree5, tree6, tree7, tree8, tree9, tree10, tree11, tree12, tree13, tree14);
    }
    addBridge() {
        const group = new THREE.Group();
        const woodMaterial = new THREE.MeshLambertMaterial({ color: 0xA98F78 });
        // 立杆
        const poleGeo = new THREE.BoxGeometry(0.04, 0.3, 0.04);
        const pole1 = new THREE.Mesh(poleGeo, woodMaterial);
        pole1.castShadow = true;
        pole1.receiveShadow = true;
        const pole2 = pole1.clone();
        const pole3 = pole1.clone();
        const pole4 = pole1.clone();
        pole1.position.set(-.1, .35, .4);
        pole2.position.set(1.1, .35, .4);
        pole3.position.set(-.1, .35, 0);
        pole4.position.set(1.1, .35, 0);
        group.add(pole1, this.customReceiveShow(pole1, 0.2), pole2, this.customReceiveShow(pole2, 0.2), pole3, this.customReceiveShow(pole3, 0.2), pole4, this.customReceiveShow(pole4, 0.2));
        // 横杆
        const crossBarEgo = new THREE.BoxGeometry(1.2, .04, .04);
        const crossBar1 = new THREE.Mesh(crossBarEgo, woodMaterial);
        crossBar1.castShadow = true;
        crossBar1.receiveShadow = true;
        const crossBar2 = crossBar1.clone();
        crossBar1.position.set(0.5, .42, .4);
        crossBar2.position.set(0.5, .42, 0);
        group.add(crossBar1, this.customReceiveShow(crossBar1, 0.2), crossBar2, this.customReceiveShow(crossBar2, 0.2));
        // 地板
        const blockGeo = new THREE.BoxGeometry(.15, .02, .4);
        const block = new THREE.Mesh(blockGeo, woodMaterial);
        block.castShadow = true;
        block.receiveShadow = true;
        for (let i = 0; i < 6; i++) {
            let temp = block.clone();
            temp.position.set(0.2 * i, .21, .2);
            group.add(temp, this.customReceiveShow(temp, 0.2));
        }
        this.scene.add(group);
    }
    fallAnimate = () => {
        this.count++;
        if (this.count > 1000) {
            this.count = 0;
        }
        if (this.count % 3 == 0) {
            for (let i = 0; i < 5; i++) {
                const temp = this.drop.clone();
                temp.position.set(Math.random(), 0.1, 1 + (Math.random() - .5) * .1);
                this.drops.add(temp);
            }
        }
        this.drops.children.forEach(obj => {
            const drop = obj;
            if (drop.lifespan < 0) {
                this.drops.remove(drop);
            }
            else {
                drop.update();
            }
        });
    };
    // 自定义阴影材质
    customReceiveShow(mesh, opacity) {
        const shadowMat = new THREE.ShadowMaterial({ opacity: opacity });
        const shadow = new THREE.Mesh(mesh.geometry, shadowMat);
        shadow.position.copy(mesh.position);
        shadow.receiveShadow = true;
        return shadow;
    }
}
class Drop extends THREE.Mesh {
    speed = 0;
    lifespan;
    constructor() {
        const geo = new THREE.BoxGeometry(.1, .1, .1);
        const mat = new THREE.MeshLambertMaterial({ color: 0x70B7E3 });
        super(geo, mat);
        this.lifespan = (Math.random() * 50) + 50;
    }
    update() {
        this.speed += .0007;
        this.lifespan--;
        this.position.x += (.5 - this.position.x) / 70;
        this.position.y -= this.speed;
    }
}
//# sourceMappingURL=ThreeProject.js.map