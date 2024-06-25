import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import ThreeCore from "@/three-widget/ThreeCore";
import * as BufferGeometryUtils from "three/examples/jsm/utils/BufferGeometryUtils";
import { GUI } from "dat.gui";
export default class ThreeProject extends ThreeCore {
    orbit;
    mixers = [];
    animations = {};
    constructor(dom) {
        super(dom, {
            cameraOptions: {
                fov: 45,
                near: 0.1,
                far: 10000
            }
        });
        this.camera.position.set(3000, 2000, 5000);
        this.scene.background = new THREE.Color(0x000000);
        const ambientLight = new THREE.AmbientLight(0xffffff, 1);
        this.scene.add(ambientLight);
        const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
        directionalLight.position.set(6000, 3000, -30000);
        directionalLight.castShadow = true;
        this.scene.add(directionalLight);
        const directionalLight2 = new THREE.DirectionalLight(0xffffff, 4);
        directionalLight2.position.set(6000, 3000, 30000);
        directionalLight2.castShadow = true;
        this.scene.add(directionalLight2);
        this.renderer.shadowMap.enabled = true;
        this.orbit = new OrbitControls(this.camera, this.renderer.domElement);
        this.orbit.target.y = 1500;
        // const axesHelper = new THREE.AxesHelper(100)
        // this.scene.add(axesHelper)
        const width = 1200;
        const height = 2000;
        const doorFrameDepth = 200;
        const doorDepth = 100;
        const doorFramePart1Geo = new THREE.BoxGeometry(width + doorFrameDepth * 2, doorFrameDepth, doorFrameDepth);
        doorFramePart1Geo.translate(0, height + doorFrameDepth / 2, 0);
        const doorFramePart2Geo = new THREE.BoxGeometry(doorFrameDepth, height, doorFrameDepth);
        doorFramePart2Geo.translate(-width / 2 - (doorFrameDepth / 2), height / 2, 0);
        const doorFramePart3Geo = new THREE.BoxGeometry(doorFrameDepth, height, doorFrameDepth);
        doorFramePart3Geo.translate(width / 2 + (doorFrameDepth / 2), height / 2, 0);
        // 合并几何体
        const doorFrameGeo = BufferGeometryUtils.mergeGeometries([
            doorFramePart1Geo.toNonIndexed(), // 转换为非索引格式
            doorFramePart2Geo.toNonIndexed(),
            doorFramePart3Geo.toNonIndexed(),
        ]);
        const doorFrameMat = new THREE.MeshStandardMaterial({ color: "#733003" });
        const doorFrame = new THREE.Mesh(doorFrameGeo, doorFrameMat);
        this.scene.add(doorFrame);
        const doorWidth = width - 20;
        const doorHeight = height - 20;
        const doorGeo = new THREE.BoxGeometry(doorWidth, doorHeight, doorDepth);
        doorGeo.translate(doorWidth / 2, doorHeight / 2, 0);
        const doorMat = new THREE.MeshStandardMaterial({ color: "#f39c1c" });
        const door = new THREE.Mesh(doorGeo, doorMat);
        //door.rotation.y = -Math.PI/2 //打开门时的角度
        door.position.x = -doorWidth / 2;
        door.name = "door";
        this.scene.add(door);
        // 制作动画
        // 关键帧轨道
        const rotationTrack = new THREE.KeyframeTrack(
        // 如果动画模型是个组形式, 可以用执行动画的mesh的名字(前提这个mesh必须已经设置过name)来调用: meshName.rotation[y]
        // 如果动画模型是个单mesh, 可以直接写: .rotation[y]
        'door.rotation[y]', [0, 1, 2], // 关键帧时间点, 最大值要是这一组中动画时长最大的那个, 这里最大 3 秒
        [0, -Math.PI / 4, -Math.PI / 2] // 关键帧时间点对应的属性值, 与前一参数数量必须保持一致 mesh 的属性值
        );
        const openAction = new THREE.AnimationClip('open', 
        // 要大于等于所有轨道动画时间最大值, 否则动画播放不完全
        2, [rotationTrack,] // 动画轨道, 同轨道可以放多个动画
        );
        const mixer = new THREE.AnimationMixer(door);
        const openAnimation = mixer.clipAction(openAction);
        openAnimation.setLoop(THREE.LoopOnce, 1); // 只播放一次, 默认为 infinity 循环播放
        //openAnimation.timeScale = 1 // 播放速度, 默认1, 为0时动画暂停, 负数时动画会反向执行
        openAnimation.clampWhenFinished = true; // 动画播放完成后停留
        this.mixers.push(mixer);
        this.animations["开门"] = openAnimation;
        this.addGUI();
    }
    addGUI() {
        const guiParams = {
            "开门": () => {
                if (this.animations["开门"].isRunning()) {
                    console.log("门正忙, 请稍等");
                    return;
                }
                // timeScale 置为 1, 让动画正向播放, .reset() 不会重置 timeScale 为默认值 1, 所以要手动重置
                this.animations["开门"].timeScale = 1;
                // 再次使用动画必须重置,
                this.animations["开门"].reset();
                this.animations["开门"].play();
            },
            "关门": () => {
                if (this.animations["开门"].isRunning()) {
                    console.log("门正忙, 请稍等");
                    return;
                }
                // timeScale 置为 -1, 让动画反向播放
                this.animations["开门"].timeScale = -1;
                // 动画播放完成时, paused 为置为 true, 必须置为 false, 反向动画才会播放
                this.animations["开门"].paused = false;
                this.animations["开门"].play();
            },
        };
        const gui = new GUI();
        gui.add(guiParams, "开门");
        gui.add(guiParams, "关门");
    }
    init() {
    }
    onRenderer() {
        this.orbit.update();
        this.mixers.forEach(mixer => mixer.update(this.clock.getDelta()));
        //this.mixers.forEach(mixer => mixer.update(1 / 60))
    }
}
//# sourceMappingURL=ThreeProject.js.map