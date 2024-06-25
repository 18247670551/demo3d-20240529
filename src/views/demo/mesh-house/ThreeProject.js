import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import ThreeCore from "@/three-widget/ThreeCore";
import grassPic from "@/views/demo/mesh-house/texture/grass.jpg";
import House from "@/views/demo/mesh-house/House";
import { GUI } from "dat.gui";
import { getTextureLoader } from "@/three-widget/loader/ThreeLoader";
export default class ThreeProject extends ThreeCore {
    orbit;
    house;
    loopTime = 10 * 1000; // loopTime: 循环一圈的时间
    constructor(dom) {
        super(dom, {
            cameraOptions: {
                fov: 45,
                near: 0.1,
                far: 1000
            }
        });
        this.camera.position.set(30, 20, 60);
        this.scene.background = new THREE.Color(0x000000);
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        this.scene.add(ambientLight);
        const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        directionalLight.position.set(100, 50, -300);
        directionalLight.castShadow = true;
        this.scene.add(directionalLight);
        const directionalLight2 = new THREE.DirectionalLight(0xffffff, 4);
        directionalLight2.position.set(100, 50, 300);
        directionalLight2.castShadow = true;
        this.scene.add(directionalLight2);
        this.renderer.shadowMap.enabled = true;
        this.orbit = new OrbitControls(this.camera, this.renderer.domElement);
        this.orbit.target.y = 10;
        // const axesHelper = new THREE.AxesHelper(100)
        // this.scene.add(axesHelper)
        this.addGround();
        const house = new House();
        this.house = house;
        this.scene.add(house);
        const raycaster = new THREE.Raycaster();
        const mousePoint = new THREE.Vector2();
        this.renderer.domElement.addEventListener("click", event => {
            mousePoint.x = (event.offsetX / this.renderer.domElement.clientWidth) * 2 - 1;
            mousePoint.y = -(event.offsetY / this.renderer.domElement.clientHeight) * 2 + 1;
            raycaster.setFromCamera(mousePoint, this.camera);
            const intersects = raycaster.intersectObject(house.door, true);
            if (!intersects.length)
                return;
            // 射线只检测了一个房门, 如果点中房门, intersects[0]必然是 house.door, 这里关闭ts检测
            // @ts-ignore
            intersects[0].object.toggle();
        }, false);
        this.addGUI();
    }
    addGUI() {
        const guiParams = {
            "开门": () => this.house.door.open(),
            "关门": () => this.house.door.toggle(),
            "鼠标点击门也可以控制": () => this.house.door.toggle(),
        };
        const gui = new GUI();
        gui.add(guiParams, "开门");
        gui.add(guiParams, "关门");
        gui.add(guiParams, "鼠标点击门也可以控制");
    }
    addGround() {
        const texture = getTextureLoader().load(grassPic);
        texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(10, 10);
        const mesh = new THREE.Mesh(new THREE.CircleGeometry(100, 64), new THREE.MeshLambertMaterial({ color: 0x00ff00, side: THREE.DoubleSide, map: texture }));
        mesh.rotateX(-Math.PI / 2);
        // 地面略向下移动一点, 防止与地面物体接触面闪烁
        mesh.position.y = -0.1;
        this.scene.add(mesh);
    }
    init() {
    }
    onRenderer() {
        this.orbit.update();
        const loopTime = this.loopTime;
        const time = Date.now();
        const per = (time % loopTime) / loopTime; // 计算当前时间进度百分比
    }
}
//# sourceMappingURL=ThreeProject.js.map