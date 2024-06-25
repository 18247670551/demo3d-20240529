import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import ThreeCore from "@/three-widget/ThreeCore";
export default class ThreeProject extends ThreeCore {
    orbit;
    raycaster;
    mouse;
    meshs = [];
    defaultMeshColor = new THREE.Color(0x00ffff);
    currentMeshColor = new THREE.Color(0xff0000);
    currentMesh = null;
    backupMeshColor = null;
    constructor(dom) {
        super(dom, {
            cameraOptions: {
                fov: 45,
                near: 0.1,
                far: 10000
            }
        });
        this.scene.background = new THREE.Color(0x000000);
        this.camera.position.set(0, 50, 100);
        this.orbit = new OrbitControls(this.camera, this.renderer.domElement);
        const axesHelper = new THREE.AxesHelper(10);
        this.scene.add(axesHelper);
        const ambientLight = new THREE.AmbientLight(0xffffff, 1);
        this.scene.add(ambientLight);
        const light = new THREE.DirectionalLight(0xffffff, 1);
        light.position.set(50, 100, -300);
        light.castShadow = true;
        this.scene.add(light);
        const shadowLight = new THREE.DirectionalLight(0xffffff, 4);
        shadowLight.position.set(50, 100, 300);
        shadowLight.castShadow = true;
        this.scene.add(shadowLight);
        const box1 = new THREE.Mesh(new THREE.BoxGeometry(10, 10, 10), new THREE.MeshStandardMaterial({ color: this.defaultMeshColor }));
        box1.name = "盒1";
        box1.position.x = -50;
        const box2 = new THREE.Mesh(new THREE.BoxGeometry(10, 10, 10), new THREE.MeshStandardMaterial({ color: this.defaultMeshColor }));
        box2.name = "盒2";
        box2.position.x = box1.position.x + 20;
        const box3 = new THREE.Mesh(new THREE.BoxGeometry(10, 10, 10), new THREE.MeshStandardMaterial({ color: this.defaultMeshColor }));
        box3.name = "盒3";
        box3.position.x = box1.position.x + 40;
        const box4 = new THREE.Mesh(new THREE.BoxGeometry(10, 10, 10), new THREE.MeshStandardMaterial({ color: this.defaultMeshColor }));
        box4.name = "盒4";
        box4.position.x = box1.position.x + 60;
        const box5 = new THREE.Mesh(new THREE.BoxGeometry(10, 10, 10), new THREE.MeshStandardMaterial({ color: this.defaultMeshColor }));
        box5.name = "盒5";
        box5.position.x = box1.position.x + 80;
        const box6 = new THREE.Mesh(new THREE.BoxGeometry(10, 10, 10), new THREE.MeshStandardMaterial({ color: this.defaultMeshColor }));
        box6.name = "盒6";
        box6.position.x = box1.position.x + 100;
        this.scene.add(box1, box2, box3, box4, box5, box6);
        this.meshs.push(box1, box2, box3, box4, box5, box6);
        this.raycaster = new THREE.Raycaster(); // 光线投射
        this.mouse = new THREE.Vector2(); // 鼠标点击的二维向量
        this.renderer.domElement.addEventListener('click', this.onModelClick.bind(this));
    }
    init() {
    }
    onRenderer() {
        const elapsed = this.clock.getElapsedTime();
        this.orbit.update();
    }
    onModelClick(event) {
        console.log("event = ", event);
        const { mouse, raycaster, camera } = this;
        // 取消默认的右键菜单等功能
        event.preventDefault();
        mouse.x = (event.offsetX / this.renderer.domElement.clientWidth) * 2 - 1;
        mouse.y = -(event.offsetY / this.renderer.domElement.clientHeight) * 2 + 1;
        // 更新射线投射器的起点和方向
        raycaster.setFromCamera(mouse, camera);
        // 射线与模型相交的情况
        const intersects = raycaster.intersectObjects(this.meshs);
        console.log("intersects = ", intersects);
        // 如果没有相交的模型
        if (intersects.length === 0) {
            console.log("没选中任何物体");
            // 清理选中状态
            if (this.currentMesh) {
                // @ts-ignore
                this.currentMesh.material.color = this.backupMeshColor || this.defaultMeshColor;
                this.currentMesh = null;
                this.backupMeshColor = null;
            }
        }
        else {
            // 如果有相交的模型，则选中第一个相交的模型
            const object = intersects[0].object;
            console.log("选中了 ", object.name);
            if (this.currentMesh === object) {
                console.log("与上次选中是同一个, 不做处理");
            }
            else {
                console.log("与上次选中不是同一个");
                // 如果先前选中过物体, 先将原物体颜色还原
                if (this.currentMesh) {
                    // @ts-ignore
                    this.currentMesh.material.color = this.backupMeshColor || this.defaultMeshColor;
                }
                // 更新当前被点击的模型
                this.currentMesh = object;
                // 备份当前模型原本的颜色
                // @ts-ignore
                this.backupMeshColor = object.material.color;
                // 设置选中颜色
                // @ts-ignore
                object.material.color = this.currentMeshColor;
            }
        }
    }
}
//# sourceMappingURL=ThreeProject.js.map