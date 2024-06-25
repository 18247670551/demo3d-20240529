import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GUI } from "dat.gui";
import ThreeCore from "@/three-widget/ThreeCore";
import Fan1 from "@/three-widget/my/Fan1";
import SmokePipe from "@/three-widget/my/SmokePipe";
import Chimney from "@/three-widget/my/Chimney";
import SprayTower from "@/three-widget/my/SprayTower";
import DeodorizeRoom from "@/three-widget/my/DeodorizeRoom";
import Floor from "@/three-widget/my/Floor";
import PathUtils from "@/three-widget/PathUtils";
export default class ThreeProject extends ThreeCore {
    orbit;
    floorLength = 40000;
    floorWidth = 28000;
    waterPipeRadius = 80;
    waterPipeRectRadius = 200;
    smokePipeRadius = 500;
    smokePipeRectRadius = 1000;
    //生物车间
    room;
    squareLength = 6000;
    squareHeight = 6000;
    squareWidth = 8000;
    squareThickness = 80;
    windowHoleRadius = 400;
    inHoleRadius = 500;
    roomX = 3000;
    roomY = 0;
    //喷淋塔
    sprayTower;
    sprayTowerTiersRadius = 1800;
    sprayTowerTierHeight = 2200;
    sprayTowerTiers = 3;
    sprayTowerX = -Math.round(this.floorLength / 2 - 2000);
    //烟囱
    chimney;
    chimneyX = this.floorLength / 2 - 1000;
    chimneyY = 0;
    smokePipe1;
    fan;
    fanX = this.floorLength / 2 - 6000;
    fanY = 1200;
    fanZ = 0;
    fermentRows = 1;
    fermentColumns = 2;
    fermentTiers = 1;
    constructor(dom) {
        super(dom, {
            cameraOptions: {
                fov: 38,
                near: 0.01,
                far: 300000
            }
        });
        this.scene.background = new THREE.Color(0x062469);
        this.camera.position.set(-4000, 20000, 44000);
        const ambientLight = new THREE.AmbientLight(0xffffff, 5);
        this.scene.add(ambientLight);
        const directionalLight1 = new THREE.DirectionalLight(0xffffff, 5);
        directionalLight1.position.set(0, 10000, 20000);
        this.scene.add(directionalLight1);
        const directionalLight2 = new THREE.DirectionalLight(0xffffff, 5);
        directionalLight2.position.set(0, 10000, -20000);
        this.scene.add(directionalLight2);
        this.orbit = new OrbitControls(this.camera, this.renderer.domElement);
        this.orbit.target.y = 6000;
        this.addFloor();
        this.room = this.addAndGetRoom();
        this.sprayTower = this.addAndGetSprayTower();
        this.chimney = this.addAndGetChimney();
        this.addSprayTowerOutPipe();
        this.smokePipe1 = this.addAndGetSmokePipe1();
        this.fan = this.addAngGetFan();
    }
    init() {
        this.addGUI();
    }
    addSprayTowerOutPipe() {
    }
    addFloor() {
        const floor = new Floor("地面", {
            length: this.floorLength,
            width: this.floorWidth,
        });
        //地面下沉1, 减少与地面物体的接触, 会产生闪烁
        floor.position.y = -1;
        this.scene.add(floor);
    }
    addAndGetRoom() {
        const options = {
            rows: this.fermentRows,
            columns: this.fermentColumns,
            tiers: this.fermentTiers,
            squareLength: this.squareLength,
            squareHeight: this.squareHeight,
            squareWidth: this.squareWidth,
            squareThickness: this.squareThickness,
            windowHoleRadius: this.windowHoleRadius,
            inHoleRadius: this.inHoleRadius,
        };
        const room = new DeodorizeRoom("除臭车间", options);
        room.position.x = this.roomX;
        room.position.y = this.roomY;
        this.scene.add(room);
        return room;
    }
    addAndGetSprayTower() {
        const sprayTower = new SprayTower("喷淋塔", {
            tierRadius: this.sprayTowerTiersRadius,
            tierHeight: this.sprayTowerTierHeight,
            tiers: this.sprayTowerTiers,
        });
        sprayTower.position.x = this.sprayTowerX;
        this.scene.add(sprayTower);
        return sprayTower;
    }
    addAndGetChimney() {
        const chimney = new Chimney("烟囱");
        chimney.position.x = this.chimneyX;
        chimney.position.z = this.chimneyY;
        this.scene.add(chimney);
        return chimney;
    }
    addAndGetSmokePipe1() {
        const smokePipeRadius = this.smokePipeRadius;
        const smokePipeRectRadius = this.smokePipeRectRadius;
        const sprayTowerBox = this.sprayTower.getBox();
        const roomBox = this.room.getBox();
        const startX = sprayTowerBox.centerX;
        const startY = sprayTowerBox.maxY;
        const startZ = sprayTowerBox.centerZ;
        const pu = new PathUtils();
        pu.push([startX, startY, startZ]);
        //向上200
        pu.push([pu.last.x, pu.last.y + 200, pu.last.z]);
        //转弯, 由下向右
        pu.pushQuarterArc("Y2X1", smokePipeRectRadius);
        //向右1500
        pu.push([pu.last.x + 1500, pu.last.y, pu.last.z]);
        //转弯, 由左向下
        pu.pushQuarterArc("X2Y2", smokePipeRectRadius);
        //向下, 至离地1000, 留出转弯半径
        pu.push([pu.last.x, 1000 + smokePipeRectRadius, pu.last.z]);
        //转弯, 由上向右
        pu.pushQuarterArc("Y1X1", smokePipeRectRadius);
        //向右, 至车间左侧2000处, 留出转弯半径
        pu.push([roomBox.minX - 2000 - smokePipeRectRadius, pu.last.y, pu.last.z]);
        //转弯, 由左向上
        pu.pushQuarterArc("X2Y1", smokePipeRectRadius);
        const holeY = this.squareHeight / 4 * 3;
        //向上, 至车间高度的3/4处, 即进烟开孔的高度, 留出转弯半径
        pu.push([pu.last.x, holeY - smokePipeRectRadius, pu.last.z]);
        //转弯, 由下向右
        pu.pushQuarterArc("Y2X1", smokePipeRectRadius);
        //向右, 到达车间
        pu.push([roomBox.minX, pu.last.y, pu.last.z]);
        const smokePipe1 = new SmokePipe("生物塔烟雾管道入口", {
            radius: smokePipeRadius,
            points: pu.points,
            scene: this.scene,
            pointsDensity: 5,
            tubularSegments: 128,
            radiusSegments: 32,
        });
        this.scene.add(smokePipe1);
        return smokePipe1;
    }
    addAngGetFan() {
        const fan = new Fan1("风机");
        fan.rotateY(Math.PI * 0.5);
        fan.position.x = this.fanX;
        fan.position.y = this.fanY;
        fan.position.z = this.fanZ;
        this.scene.add(fan);
        return fan;
    }
    onRenderer() {
        this.orbit.update();
    }
    addGUI() {
        const gui = new GUI();
        const smokeFlowFolder = gui.addFolder('烟雾');
        smokeFlowFolder.add(this.smokePipe1, "flow").name("烟雾管道1流动");
        smokeFlowFolder.add(this.smokePipe1, "stop").name("烟雾管道1停止");
        const fanFolder = gui.addFolder('风机');
        fanFolder.add(this.fan, "run").name("风机运行");
        fanFolder.add(this.fan, "stop").name("风机停止");
    }
}
//# sourceMappingURL=ThreeProject.js.map