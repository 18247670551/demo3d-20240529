import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import ThreeCore from "@/three-widget/ThreeCore";
import { TransformControls } from "three/examples/jsm/controls/TransformControls";
export default class ThreeProject extends ThreeCore {
    orbit;
    car;
    curve;
    loopTime = 10 * 1000; // loopTime: 循环一圈的时间
    constructor(dom) {
        super(dom, {
            cameraOptions: {
                fov: 45,
                near: 0.1,
                far: 100
            }
        });
        this.camera.position.set(0, 2, 4);
        this.scene.background = new THREE.Color(0x000000);
        const ambientLight = new THREE.AmbientLight(0xffffff, 1);
        this.scene.add(ambientLight);
        this.renderer.shadowMap.enabled = true;
        this.orbit = new OrbitControls(this.camera, this.renderer.domElement);
        // const axesHelper = new THREE.AxesHelper(3)
        // this.scene.add(axesHelper)
        const gridHelper = new THREE.GridHelper(3);
        this.scene.add(gridHelper);
        const pointsPositions = [
            { x: 1, y: 1, z: -1 },
            { x: 1, y: 0, z: 1 },
            { x: -1, y: 0, z: 1 },
            { x: -1, y: 0, z: -1 }
        ];
        const cubes = pointsPositions.map(p => this.createCube(p));
        this.scene.add(...cubes);
        const curve = new THREE.CatmullRomCurve3(cubes.map(cube => cube.position), true, "chordal" //曲线类型
        );
        this.curve = curve;
        const curveLine = new THREE.LineLoop(new THREE.BufferGeometry().setFromPoints(curve.getPoints(100)), new THREE.LineBasicMaterial({ color: "#00ff00" }));
        this.scene.add(curveLine);
        const car = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.06, 0.15), [
            new THREE.MeshBasicMaterial({ color: "#ffff00" }),
            new THREE.MeshBasicMaterial({ color: "#ffff00" }),
            new THREE.MeshBasicMaterial({ color: "#ff0000" }),
            new THREE.MeshBasicMaterial({ color: "#ff0000" }),
            new THREE.MeshBasicMaterial({ color: "#285188" }),
            new THREE.MeshBasicMaterial({ color: "#0000ff" }),
        ]);
        this.car = car;
        this.scene.add(car);
        // 添加可编辑轨道能力
        const control = new TransformControls(this.camera, this.renderer.domElement);
        this.scene.add(control);
        const rayCaster = new THREE.Raycaster();
        const mouse = new THREE.Vector2();
        // 修改曲线后同步修改实体线条
        control.addEventListener('dragging-changed', (event) => {
            // 需要先关闭轨道控制器, 否则控制混乱
            this.orbit.enabled = !event.value;
            if (!event.value) {
                const points = curve.getPoints(50);
                curveLine.geometry.setFromPoints(points);
            }
        });
        this.renderer.domElement.addEventListener('click', (event) => {
            // 取消默认的右键菜单等功能
            event.preventDefault();
            mouse.x = (event.offsetX / this.renderer.domElement.clientWidth) * 2 - 1;
            mouse.y = -(event.offsetY / this.renderer.domElement.clientHeight) * 2 + 1;
            // 更新射线投射器的起点和方向
            rayCaster.setFromCamera(mouse, this.camera);
            // 射线与模型相交的情况
            const intersects = rayCaster.intersectObjects(cubes);
            if (intersects.length) {
                const target = intersects[0].object;
                control.attach(target); // 绑定controls和方块
            }
            else {
                control.detach();
            }
        }, false);
    }
    createCube(position) {
        const geometry = new THREE.BoxGeometry(0.05, 0.05, 0.05);
        const material = new THREE.MeshBasicMaterial({ color: "#ffffff" });
        const cube = new THREE.Mesh(geometry, material);
        cube.position.copy(position);
        return cube;
    }
    // per 0-1, 是要取的点在线条上的百分比位置
    changePosition(per) {
        const position = this.curve.getPointAt(per);
        this.car.position.copy(position);
    }
    changeLookAt(per) {
        const tangent = this.curve.getTangentAt(per);
        const lookAtVec = tangent.add(this.car.position); // 位置向量和切线向量相加即为所需朝向的点向量
        this.car.lookAt(lookAtVec);
    }
    init() {
    }
    onRenderer() {
        this.orbit.update();
        const loopTime = this.loopTime;
        const time = Date.now();
        const per = (time % loopTime) / loopTime; // 计算当前时间进度百分比
        this.changePosition(per);
        this.changeLookAt(per);
    }
}
//# sourceMappingURL=ThreeProject.js.map