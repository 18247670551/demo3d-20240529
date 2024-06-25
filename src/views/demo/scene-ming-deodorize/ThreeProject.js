import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GUI } from "dat.gui";
import ThreeCore from "@/three-widget/ThreeCore";
import Chimney from "@/three-widget/my/Chimney";
import SprayTower from "@/three-widget/my/SprayTower";
import DeodorizeRoom from "@/three-widget/my/DeodorizeRoom";
import Floor from "@/three-widget/my/Floor";
import PathUtils from "@/three-widget/PathUtils";
import Rain from "@/three-widget/my/Rain";
import SimplePump from "@/three-widget/my/SimplePump";
import AcidWashPool from "@/three-widget/my/AcidWashPool";
import SpriteRectText from "@/three-widget/my/text/SpriteRectText";
import SimpleValve from "@/three-widget/my/pipe/SimpleValve";
import Pipe from "@/three-widget/my/pipe/Pipe";
import Bucket from "@/three-widget/my/Bucket";
import MeteringPump from "@/three-widget/my/pipe/MeteringPump";
import Mixer from "@/three-widget/my/Mixer";
import SimplePipe from "@/three-widget/my/pipe/SimplePipe";
import StrokeValve from "@/three-widget/my/pipe/StrokeValve";
import Fan3 from "@/three-widget/my/Fan3";
import SimplePumpBase from "@/three-widget/my/SimplePumpBase";
import PipePlug from "@/three-widget/my/pipe/PipePlug";
import { Emitter } from "@/utils/emitter";
export default class ThreeProject extends ThreeCore {
    orbit;
    /* region 常量 */
    floorLength = 40000;
    floorWidth = 28000;
    //生物车间水泵基座
    fermentPumpBaseWidth = 900;
    fermentPumpBaseHeight = 600;
    fermentPumpBaseDepth = 500;
    //生物车间水泵
    fermentPumpRadius = 150;
    fermentPumpHeight = 400;
    mainSmokePipeR = 500;
    mainSmokePipeRectR = 800;
    channelSmokePipeR = 300;
    channelSmokePipeRectR = 600;
    //主排 主进 烟管道 离车间的距离
    mainSmokePipeOffsetXOfRoomMaxX = 2500;
    //主排烟管道2 主排后面接四路风机, 再汇入主排烟管道2, 离车间的距离
    mainSmokeOutPipe2OffsetXOfRoomMaxX = 4500;
    //主排管道, 离地1米, 大约就是可以摆下风机的高度, 不会使风机到地面下
    mainSmokeOutPipeY = 900;
    //主排烟管道2(风机之后, 进入酸洗之前) 离地2.5米
    mainSmokeOutPipe2Y = 2500;
    //酸洗喷淋塔
    acidSprayTower = null;
    sprayTowerWaterFall = null;
    acidSprayTowerOffsetXOfRoomMaxX = 10000;
    acidSprayTowerTierRadius = 1800;
    acidSprayTowerTierHeight = 2200;
    acidSprayTowerTiers = 3;
    //排烟烟囱
    chimney = null;
    chimneyOffsetXOfRoomMaxX = 17000;
    chimneyRadius = 700;
    chimneyHeight = 15000;
    //供水通路公共Z坐标
    waterOffsetZOfRoomMaxZ = 3000;
    waterPipeRectR = 200;
    //主供水泵
    waterPump1 = null;
    waterPump2 = null;
    waterPumpX = this.floorLength / 2 - 1000;
    waterPumpR = 400;
    waterPumpH = 1000;
    waterValveR = 100;
    waterValveH = 150;
    //两个主供水泵汇合的位置
    waterPumpsConvergeX = this.waterPumpX - 2000;
    //酸洗通道公共Z坐标
    acidWashPathZ = 1000;
    //酸洗搅拌池
    acidWashPool = null;
    acidWashPoolLevelText = null;
    acidWashPoolOffsetXOfRoomMaxX = 11000;
    acidPoolWaterInValve = null;
    acidWashPoolLength = 4000;
    acidWashPoolWidth = 2500;
    acidWashPoolHeight = 2500;
    acidWashPoolWallThickness = 200;
    acidWashPoolWallColor = 0x666666;
    //酸洗搅拌池出水水泵
    acidWashPoolOutPump1 = null;
    acidWashPoolOutPump2 = null;
    acidWashPoolOutPumpOffsetXOfRoomMaxX = this.acidWashPoolOffsetXOfRoomMaxX - (this.acidWashPoolLength / 2 + 1000);
    acidPoolOutPump1Pipe = null;
    acidPoolOutPump2Pipe = null;
    //酸洗加药桶
    acidBucket = null;
    acidBucketLevelText = null;
    acidBucketX = this.floorLength / 2 - 2000;
    acidBucketRadius = 600;
    acidBucketHeight = 2000;
    topColor = 0xef5b9c;
    bottomColor = 0xef5b9c;
    flankColor = 0xed1941;
    //酸洗加药桶计量泵
    acidBucketMeteringPump = null;
    acidBucketMeteringPumpText = null;
    acidWashPoolMixer = null;
    /* endregion 常量 */
    /* region 生物车间 */
    room = null;
    fermentRows = 4;
    fermentColumns = 3;
    fermentTiers = 2;
    fermentWallColor = 0x6aab73;
    fermentTopColor = 0x6aab73;
    squareLength = 6000;
    squareHeight = 3500;
    squareWidth = 3000;
    squareThickness = 80;
    channel1Index = 1;
    channel2Index = 2;
    channel3Index = 3;
    channel4Index = 4;
    washIndex = 1;
    beforeIndex = 2;
    fermentIndex = 3;
    /* endregion */
    /* region 进气 */
    mainSmokeInPipe = null;
    channel1In1Pipe = null;
    channel1In2Pipe = null;
    channel2In1Pipe = null;
    channel2In2Pipe = null;
    channel3In1Pipe = null;
    channel3In2Pipe = null;
    channel4In1Pipe = null;
    channel4In2Pipe = null;
    channel1In1Valve = null;
    channel1In2Valve = null;
    channel2In1Valve = null;
    channel2In2Valve = null;
    channel3In1Valve = null;
    channel3In2Valve = null;
    channel4In1Valve = null;
    channel4In2Valve = null;
    /* endregion */
    /* region 排气 */
    mainSmokeOutPipe = null;
    channel1Out1Pipe = null;
    channel1Out2Pipe = null;
    channel2Out1Pipe = null;
    channel2Out2Pipe = null;
    channel3Out1Pipe = null;
    channel3Out2Pipe = null;
    channel4Out1Pipe = null;
    channel4Out2Pipe = null;
    channel1Out1Valve = null;
    channel1Out2Valve = null;
    channel2Out1Valve = null;
    channel2Out2Valve = null;
    channel3Out1Valve = null;
    channel3Out2Valve = null;
    channel4Out1Valve = null;
    channel4Out2Valve = null;
    mainSmokeOutPipe1 = null;
    fan1 = null;
    fan2 = null;
    fan3 = null;
    fan4 = null;
    /* endregion */
    /* region 所有通道的 水泵/管道/阀门 */
    channel1Wash1Pump = null;
    channel1Wash2Pump = null;
    channel1Before1Pump = null;
    channel1Before2Pump = null;
    channel1Ferment1Pump = null;
    channel1Ferment2Pump = null;
    channel1Wash1Pipe = null;
    channel1Wash2Pipe = null;
    channel1Before1Pipe = null;
    channel1Before2Pipe = null;
    channel1Ferment1Pipe = null;
    channel1Ferment2Pipe = null;
    channel1Wash1Valve = null;
    channel1Wash2Valve = null;
    channel1Before1Valve = null;
    channel1Before2Valve = null;
    channel1Ferment1Valve = null;
    channel1Ferment2Valve = null;
    channel1WashBaseWaterInPipe = null;
    channel1WashBaseWaterInValve = null;
    channel1BeforeBaseWaterInPipe = null;
    channel1BeforeBaseWaterInValve = null;
    channel1FermentBaseWaterInPipe = null;
    channel1FermentBaseWaterInValve = null;
    channel2Wash1Pump = null;
    channel2Wash2Pump = null;
    channel2Before1Pump = null;
    channel2Before2Pump = null;
    channel2Ferment1Pump = null;
    channel2Ferment2Pump = null;
    channel2Wash1Pipe = null;
    channel2Wash2Pipe = null;
    channel2Before1Pipe = null;
    channel2Before2Pipe = null;
    channel2Ferment1Pipe = null;
    channel2Ferment2Pipe = null;
    channel2Wash1Valve = null;
    channel2Wash2Valve = null;
    channel2Before1Valve = null;
    channel2Before2Valve = null;
    channel2Ferment1Valve = null;
    channel2Ferment2Valve = null;
    channel2WashBaseWaterInPipe = null;
    channel2WashBaseWaterInValve = null;
    channel2BeforeBaseWaterInPipe = null;
    channel2BeforeBaseWaterInValve = null;
    channel2FermentBaseWaterInPipe = null;
    channel2FermentBaseWaterInValve = null;
    channel3Wash1Pump = null;
    channel3Wash2Pump = null;
    channel3Before1Pump = null;
    channel3Before2Pump = null;
    channel3Ferment1Pump = null;
    channel3Ferment2Pump = null;
    channel3Wash1Pipe = null;
    channel3Wash2Pipe = null;
    channel3Before1Pipe = null;
    channel3Before2Pipe = null;
    channel3Ferment1Pipe = null;
    channel3Ferment2Pipe = null;
    channel3Wash1Valve = null;
    channel3Wash2Valve = null;
    channel3Before1Valve = null;
    channel3Before2Valve = null;
    channel3Ferment1Valve = null;
    channel3Ferment2Valve = null;
    channel3WashBaseWaterInPipe = null;
    channel3WashBaseWaterInValve = null;
    channel3BeforeBaseWaterInPipe = null;
    channel3BeforeBaseWaterInValve = null;
    channel3FermentBaseWaterInPipe = null;
    channel3FermentBaseWaterInValve = null;
    channel4Wash1Pump = null;
    channel4Wash2Pump = null;
    channel4Before1Pump = null;
    channel4Before2Pump = null;
    channel4Ferment1Pump = null;
    channel4Ferment2Pump = null;
    channel4Wash1Pipe = null;
    channel4Wash2Pipe = null;
    channel4Before1Pipe = null;
    channel4Before2Pipe = null;
    channel4Ferment1Pipe = null;
    channel4Ferment2Pipe = null;
    channel4Wash1Valve = null;
    channel4Wash2Valve = null;
    channel4Before1Valve = null;
    channel4Before2Valve = null;
    channel4Ferment1Valve = null;
    channel4Ferment2Valve = null;
    channel4WashBaseWaterInPipe = null;
    channel4WashBaseWaterInValve = null;
    channel4BeforeBaseWaterInPipe = null;
    channel4BeforeBaseWaterInValve = null;
    channel4FermentBaseWaterInPipe = null;
    channel4FermentBaseWaterInValve = null;
    /* endregion */
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
        const ambientLight = new THREE.AmbientLight(0xffffff, 3);
        this.scene.add(ambientLight);
        const directionalLight1 = new THREE.DirectionalLight(0xffffff, 5);
        directionalLight1.position.set(0, 10000, 20000);
        this.scene.add(directionalLight1);
        const directionalLight2 = new THREE.DirectionalLight(0xffffff, 4);
        directionalLight2.position.set(0, 10000, -20000);
        this.scene.add(directionalLight2);
        this.orbit = new OrbitControls(this.camera, this.renderer.domElement);
        this.orbit.target.y = 6000;
        this.addFloor();
        this.room = this.addAndGetRoom();
        this.addDevices();
        this.createWaterPath();
        this.addMainSmokeInPipe();
        //需要先添加主管道 .addMainSmokeInPipe()
        this.addSmokeIn();
        this.addMainSmokeOutPipe();
        //需要先添加主管道 .addMainSmokeOutPipe()
        this.addSmokeOut();
    }
    init() {
        this.addGUI();
        this.emitterOn();
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
            wallColor: this.fermentWallColor,
            topColor: this.fermentTopColor,
            squareLength: this.squareLength,
            squareHeight: this.squareHeight,
            squareWidth: this.squareWidth,
            squareThickness: this.squareThickness,
            logo: true,
        };
        const room = new DeodorizeRoom("除臭车间", options);
        room.position.x = -8000;
        this.scene.add(room);
        return room;
    }
    /**
     * 创建通道房间设备(水洗/预洗/生物 的 所有水泵/管道/阀门)
     */
    createDevices(roomIndex) {
        const roomBox = this.room.getBox();
        const channel1Index = 1;
        const channel2Index = 2;
        const channel3Index = 3;
        const channel4Index = 4;
        const devices = {
            pumps: [],
            pipes: [],
            valves: [],
            baseWaterInPipe: [],
            baseWaterInValve: [],
        };
        const group = new THREE.Group();
        /* region 水泵基座 */
        //水泵基座大小
        const baseW = this.fermentPumpBaseWidth;
        const baseH = this.fermentPumpBaseHeight;
        const baseD = this.fermentPumpBaseDepth;
        //水泵基座间距
        const baseSpace = 300;
        const base1X = -(this.squareLength / 2 - (baseW + baseSpace) * (channel1Index - 1) - baseW / 2);
        const base2X = -(this.squareLength / 2 - (baseW + baseSpace) * (channel2Index - 1) - baseW / 2);
        const base3X = -(this.squareLength / 2 - (baseW + baseSpace) * (channel3Index - 1) - baseW / 2);
        const base4X = -(this.squareLength / 2 - (baseW + baseSpace) * (channel4Index - 1) - baseW / 2);
        const baseY = baseH / 2;
        const base1 = new SimplePumpBase("", { length: baseW, height: baseH, width: baseD });
        base1.position.x = base1X;
        base1.position.y = baseY;
        base1.name = "通道1水洗水泵基座";
        group.add(base1);
        const base2 = new SimplePumpBase("", { length: baseW, height: baseH, width: baseD });
        base2.position.x = base2X;
        base2.position.y = baseY;
        base2.name = "通道2水洗水泵基座";
        group.add(base2);
        const base3 = new SimplePumpBase("", { length: baseW, height: baseH, width: baseD });
        base3.position.x = base3X;
        base3.position.y = baseY;
        base3.name = "通道3水洗水泵基座";
        group.add(base3);
        const base4 = new SimplePumpBase("", { length: baseW, height: baseH, width: baseD });
        base4.position.x = base4X;
        base4.position.y = baseY;
        base4.name = "通道4水洗水泵基座";
        group.add(base4);
        /* endregion */
        /* region 水泵 */
        //水洗水泵大小
        const pumpR = this.fermentPumpRadius;
        const pumpH = this.fermentPumpHeight;
        const pumpY = baseH + pumpH / 2;
        const pumpOptions = { radius: pumpR, height: pumpH };
        const pump1_1X = base1X - 200;
        const pump1_2X = base1X + 200;
        const pump2_1X = base2X - 200;
        const pump2_2X = base2X + 200;
        const pump3_1X = base3X - 200;
        const pump3_2X = base3X + 200;
        const pump4_1X = base4X - 200;
        const pump4_2X = base4X + 200;
        const pump1_1 = new SimplePump("", pumpOptions);
        pump1_1.position.x = pump1_1X;
        pump1_1.position.y = pumpY;
        devices.pumps.push(pump1_1);
        group.add(pump1_1);
        const pump1_2 = new SimplePump("", pumpOptions);
        pump1_2.position.x = pump1_2X;
        pump1_2.position.y = pumpY;
        devices.pumps.push(pump1_2);
        group.add(pump1_2);
        const pump2_1 = new SimplePump("", pumpOptions);
        pump2_1.position.x = pump2_1X;
        pump2_1.position.y = pumpY;
        devices.pumps.push(pump2_1);
        group.add(pump2_1);
        const pump2_2 = new SimplePump("", pumpOptions);
        pump2_2.position.x = pump2_2X;
        pump2_2.position.y = pumpY;
        devices.pumps.push(pump2_2);
        group.add(pump2_2);
        const pump3_1 = new SimplePump("", pumpOptions);
        pump3_1.position.x = pump3_1X;
        pump3_1.position.y = pumpY;
        devices.pumps.push(pump3_1);
        group.add(pump3_1);
        const pump3_2 = new SimplePump("", pumpOptions);
        pump3_2.position.x = pump3_2X;
        pump3_2.position.y = pumpY;
        devices.pumps.push(pump3_2);
        group.add(pump3_2);
        const pump4_1 = new SimplePump("", pumpOptions);
        pump4_1.position.x = pump4_1X;
        pump4_1.position.y = pumpY;
        devices.pumps.push(pump4_1);
        group.add(pump4_1);
        const pump4_2 = new SimplePump("", pumpOptions);
        pump4_2.position.x = pump4_2X;
        pump4_2.position.y = pumpY;
        devices.pumps.push(pump4_2);
        group.add(pump4_2);
        /* endregion */
        /* region 水管 */
        //所有通道水管到第一层的垂直长度统一 = 层高 - 水泵基座高度 - 水泵高度 - 顶部留空高度200
        const tier1Length = this.squareHeight - baseH - pumpH - 200;
        //所有通道水管到第二层垂直长度统一
        const tier2Length = tier1Length + this.squareHeight;
        //通道1所有水管到所在通道的水平水管长度(length2)统1
        const channel1Pipe1_length2 = this.squareWidth / 2 + this.squareWidth * (4 - channel1Index);
        const channel2Pipe1_length2 = this.squareWidth / 2 + this.squareWidth * (4 - channel2Index);
        const channel3Pipe1_length2 = this.squareWidth / 2 + this.squareWidth * (4 - channel3Index);
        const channel4Pipe1_length2 = this.squareWidth / 2 + this.squareWidth * (4 - channel4Index);
        const pipe1_1 = this.createChannelWaterPipe("", tier2Length, channel1Pipe1_length2);
        pipe1_1.position.x = pump1_1.position.x; //等于水泵1的x
        pipe1_1.position.y = baseH; //等于水泵基府高
        devices.pipes.push(pipe1_1);
        group.add(pipe1_1);
        const pipe1_2 = this.createChannelWaterPipe("", tier1Length, channel1Pipe1_length2);
        pipe1_2.position.x = pump1_2.position.x;
        pipe1_2.position.y = baseH;
        devices.pipes.push(pipe1_2);
        group.add(pipe1_2);
        const pipe2_1 = this.createChannelWaterPipe("", tier2Length, channel2Pipe1_length2);
        pipe2_1.position.x = pump2_1.position.x;
        pipe2_1.position.y = baseH;
        devices.pipes.push(pipe2_1);
        group.add(pipe2_1);
        const pipe2_2 = this.createChannelWaterPipe("", tier1Length, channel2Pipe1_length2);
        pipe2_2.position.x = pump2_2.position.x;
        pipe2_2.position.y = baseH;
        devices.pipes.push(pipe2_2);
        group.add(pipe2_2);
        const pipe3_1 = this.createChannelWaterPipe("", tier2Length, channel3Pipe1_length2);
        pipe3_1.position.x = pump3_1.position.x;
        pipe3_1.position.y = baseH;
        devices.pipes.push(pipe3_1);
        group.add(pipe3_1);
        const pipe3_2 = this.createChannelWaterPipe("", tier1Length, channel3Pipe1_length2);
        pipe3_2.position.x = pump3_2.position.x;
        pipe3_2.position.y = baseH;
        devices.pipes.push(pipe3_2);
        group.add(pipe3_2);
        const pipe4_1 = this.createChannelWaterPipe("", tier2Length, channel4Pipe1_length2);
        pipe4_1.position.x = pump4_1.position.x;
        pipe4_1.position.y = baseH;
        devices.pipes.push(pipe4_1);
        group.add(pipe4_1);
        const pipe4_2 = this.createChannelWaterPipe("", tier1Length, channel4Pipe1_length2);
        pipe4_2.position.x = pump4_2.position.x;
        pipe4_2.position.y = baseH;
        devices.pipes.push(pipe4_2);
        group.add(pipe4_2);
        /* endregion */
        /* region 阀门 */
        const valveR = 50;
        const valveH = 100;
        const valveOptions = { radius: valveR, height: valveH };
        //所有阀门高度相等, 离地1600
        const valveY = 1600;
        const valve1_1 = new SimpleValve("", valveOptions);
        valve1_1.position.x = pump1_1.position.x; //等于水泵1的x
        valve1_1.position.y = valveY;
        devices.valves.push(valve1_1);
        group.add(valve1_1);
        const valve1_2 = new SimpleValve("", valveOptions);
        valve1_2.position.x = pump1_2.position.x;
        valve1_2.position.y = valveY;
        devices.valves.push(valve1_2);
        group.add(valve1_2);
        const valve2_1 = new SimpleValve("", valveOptions);
        valve2_1.position.x = pump2_1.position.x;
        valve2_1.position.y = valveY;
        devices.valves.push(valve2_1);
        group.add(valve2_1);
        const valve2_2 = new SimpleValve("", valveOptions);
        valve2_2.position.x = pump2_2.position.x;
        valve2_2.position.y = valveY;
        devices.valves.push(valve2_2);
        group.add(valve2_2);
        const valve3_1 = new SimpleValve("", valveOptions);
        valve3_1.position.x = pump3_1.position.x;
        valve3_1.position.y = valveY;
        devices.valves.push(valve3_1);
        group.add(valve3_1);
        const valve3_2 = new SimpleValve("", valveOptions);
        valve3_2.position.x = pump3_2.position.x;
        valve3_2.position.y = valveY;
        devices.valves.push(valve3_2);
        group.add(valve3_2);
        const valve4_1 = new SimpleValve("", valveOptions);
        valve4_1.position.x = pump4_1.position.x;
        valve4_1.position.y = valveY;
        devices.valves.push(valve4_1);
        group.add(valve4_1);
        const valve4_2 = new SimpleValve("", valveOptions);
        valve4_2.position.x = pump4_2.position.x;
        valve4_2.position.y = valveY;
        devices.valves.push(valve4_2);
        group.add(valve4_2);
        /* endregion */
        /* region 基座进水部分 */
        let pu = new PathUtils();
        pu.push([base1X, this.waterPumpR, this.waterOffsetZOfRoomMaxZ - baseD / 2]);
        pu.push([base1X, this.waterPumpR, 0]);
        const base1WaterInPipe = new Pipe("", {
            points: pu.points,
        });
        devices.baseWaterInPipe.push(base1WaterInPipe);
        group.add(base1WaterInPipe);
        pu = new PathUtils();
        pu.push([base2X, this.waterPumpR, this.waterOffsetZOfRoomMaxZ - baseD / 2]);
        pu.push([base2X, this.waterPumpR, 0]);
        const base2WaterInPipe = new Pipe("", {
            points: pu.points,
        });
        devices.baseWaterInPipe.push(base2WaterInPipe);
        group.add(base2WaterInPipe);
        pu = new PathUtils();
        pu.push([base3X, this.waterPumpR, this.waterOffsetZOfRoomMaxZ - baseD / 2]);
        pu.push([base3X, this.waterPumpR, 0]);
        const base3WaterInPipe = new Pipe("", {
            points: pu.points,
        });
        devices.baseWaterInPipe.push(base3WaterInPipe);
        group.add(base3WaterInPipe);
        pu = new PathUtils();
        pu.push([base4X, this.waterPumpR, this.waterOffsetZOfRoomMaxZ - baseD / 2]);
        pu.push([base4X, this.waterPumpR, 0]);
        const base4WaterInPipe = new Pipe("", {
            points: pu.points,
        });
        devices.baseWaterInPipe.push(base4WaterInPipe);
        group.add(base4WaterInPipe);
        const waterValveR = this.waterValveR;
        const waterValveH = this.waterValveH;
        const waterValveOptions = { radius: waterValveR, height: waterValveH };
        const base1WaterValve = new SimpleValve("", waterValveOptions);
        base1WaterValve.rotateX(Math.PI * 0.5);
        base1WaterValve.position.x = base1X;
        base1WaterValve.position.y = this.waterPumpR;
        base1WaterValve.position.z = this.waterOffsetZOfRoomMaxZ / 2;
        devices.baseWaterInValve.push(base1WaterValve);
        group.add(base1WaterValve);
        const base2WaterValve = new SimpleValve("", waterValveOptions);
        base2WaterValve.rotateX(Math.PI * 0.5);
        base2WaterValve.position.x = base2X;
        base2WaterValve.position.y = this.waterPumpR;
        base2WaterValve.position.z = this.waterOffsetZOfRoomMaxZ / 2;
        devices.baseWaterInValve.push(base2WaterValve);
        group.add(base2WaterValve);
        const base3WaterValve = new SimpleValve("", waterValveOptions);
        base3WaterValve.rotateX(Math.PI * 0.5);
        base3WaterValve.position.x = base3X;
        base3WaterValve.position.y = this.waterPumpR;
        base3WaterValve.position.z = this.waterOffsetZOfRoomMaxZ / 2;
        devices.baseWaterInValve.push(base3WaterValve);
        group.add(base3WaterValve);
        const base4WaterValve = new SimpleValve("", waterValveOptions);
        base4WaterValve.rotateX(Math.PI * 0.5);
        base4WaterValve.position.x = base4X;
        base4WaterValve.position.y = this.waterPumpR;
        base4WaterValve.position.z = this.waterOffsetZOfRoomMaxZ / 2;
        devices.baseWaterInValve.push(base4WaterValve);
        group.add(base4WaterValve);
        /* endregion */
        //向左偏移量 = (单元格长度 * 列数 - 单元格长度 * (列数-1))/2 - 单元格长度/2
        //减去 单元格长度/2 是因为设备组总宽度大约等于单元格宽度, 减去单元格宽度就大约减去了自身宽度的一半, 省去计算自己宽度了
        //采用以 roomBox 来定位的方式, 来自适应当 room 移动时, group跟随移动
        group.position.x = roomBox.minX + this.squareLength * (roomIndex - 1) + this.squareLength / 2 + 200;
        group.position.z = roomBox.maxZ + baseD / 2;
        this.scene.add(group);
        return devices;
    }
    //此方法要求必须先创建主进烟管道
    addChannelSmokeInPipeAndGetComponents(channelIndex) {
        const group = new THREE.Group();
        const components = {
            pipes: [],
            valves: []
        };
        //z值设为0, 最后group用参数 channelIndex 计算z值
        const z = 0;
        const tier1HoleY = this.squareHeight - this.squareHeight / 4;
        const tier2HoleY = this.squareHeight * this.fermentTiers - this.squareHeight / 4;
        //获取车间模型外框
        const roomBox = this.room.getBox();
        //阀门安装位置, 从车间烟入口向外偏移1米
        const valveX = roomBox.minX - 1000;
        //要从管道的 curve 取一个点获取 管道的 x y, 不能直接取 this.mainSmokeInPipe.position.x 因为这个管道是路径带有位置偏移量, 管道的的position x y z 都是0
        const mainSmokeInPipeX = this.mainSmokeInPipe.curve.points[0].x;
        const mainSmokeInPipeY = this.mainSmokeInPipe.curve.points[0].y;
        const mainSmokeInPipeR = this.mainSmokeInPipe.options.radius;
        //管道折弯半径
        const pipeRectR = this.channelSmokePipeRectR;
        const pipeR = this.channelSmokePipeR;
        let pu = new PathUtils();
        let pipePartLength;
        pu.push([mainSmokeInPipeX, mainSmokeInPipeY + mainSmokeInPipeR - pipeR / 2, z]);
        //第一段直管(主管道分支向上部分) 长度 = 第二层开孔高度 - 管道起始y(管道起始y现在已更新到 last.y) - 转弯半径 - 自身半径的一半
        pu.push([pu.last.x, tier2HoleY - pipeRectR, pu.last.z]);
        //第一段直管转弯, 由下向右
        pu.pushQuarterArc("Y2X1", pipeRectR);
        //第二段直管, 向右
        pu.push([roomBox.minX, pu.last.y, pu.last.z]);
        const pipe1 = new SimplePipe("", {
            points: pu.points,
            radius: pipeR,
            tubularSegments: 32,
            opacity: 1,
        });
        components.pipes.push(pipe1);
        group.add(pipe1);
        const valve1 = new StrokeValve("", {
            horizontalLength: pipeR,
            horizontalRadius: pipeR * 1.1,
            horizontalColor: 0x023177,
            verticalLength: 600,
            verticalRadius: 100,
            verticalColor: 0x666666,
        });
        valve1.position.x = valveX;
        valve1.position.y = tier2HoleY;
        valve1.position.z = z;
        components.valves.push(valve1);
        group.add(valve1);
        pu = new PathUtils();
        pu.push([mainSmokeInPipeX + mainSmokeInPipeR - pipeR / 2, mainSmokeInPipeY, z]);
        //第一段直管, 到车间左侧墙
        pu.push([roomBox.minX, pu.last.y, pu.last.z]);
        const pipe2 = new SimplePipe("", {
            points: pu.points,
            radius: pipeR,
            tubularSegments: 1,
            opacity: 1,
        });
        components.pipes.push(pipe2);
        group.add(pipe2);
        const valve2 = new StrokeValve("", {
            horizontalLength: pipeR,
            horizontalRadius: pipeR * 1.1,
            horizontalColor: 0x023177,
            verticalLength: 600,
            verticalRadius: 100,
            verticalColor: 0x666666,
        });
        valve2.position.x = valveX;
        valve2.position.y = mainSmokeInPipeY;
        valve2.position.z = z;
        components.valves.push(valve2);
        group.add(valve2);
        group.position.z = roomBox.minZ + this.squareWidth / this.fermentRows * 2 * ((channelIndex - 1) * 2 + 1);
        this.scene.add(group);
        return components;
    }
    addMainSmokeInPipe() {
        //获取车间模型外框
        const roomBox = this.room.getBox();
        //主管道在车间左侧2.5米
        const offsetX = roomBox.minX - 2500;
        const offsetY = this.squareHeight - this.squareHeight / 4;
        //主管道Z起点在车间后侧2米
        const offsetZ = roomBox.minZ - 2000;
        //主进气管道长度
        const mainInLength = roomBox.zLength + 1000;
        const mainSmokePipeR = this.mainSmokePipeR;
        const pu = new PathUtils();
        pu.push([offsetX, offsetY, offsetZ]);
        //第一段直管
        pu.push([pu.last.x, pu.last.y, pu.last.z + mainInLength]);
        const pipe = new SimplePipe("主进气管道", {
            points: pu.points,
            radius: mainSmokePipeR,
            tubularSegments: 1,
            opacity: 1,
        });
        this.mainSmokeInPipe = pipe;
        this.scene.add(pipe);
        //添加管道尽头的堵头, 参数是试出来的
        const plug = new PipePlug("堵头", { pipeRadius: mainSmokePipeR });
        plug.position.x = pipe.curveEnd.x;
        plug.position.y = pipe.curveEnd.y;
        plug.position.z = pipe.curveEnd.z - 100;
        plug.rotateY(Math.PI);
        plug.rotateX(Math.PI * 0.5);
        this.scene.add(plug);
    }
    addMainSmokeOutPipe() {
        //获取车间模型外框
        const roomBox = this.room.getBox();
        //主管道在车间右侧2.5米
        const mainPipeX = roomBox.maxX + this.mainSmokePipeOffsetXOfRoomMaxX;
        const mainPipeY = this.mainSmokeOutPipeY;
        //每个通道的二层出烟管为避开一层出烟管, 向后转弯再垂直向到主管道的, 最后一个通道的二层出烟管位置已偏移出车间的最大Z点, 为留出位置, 主出烟管向后偏移出一个折弯半径
        const mainPipeZ = roomBox.maxZ - this.channelSmokePipeRectR;
        const mainSmokePipeR = this.mainSmokePipeR;
        const pu = new PathUtils();
        pu.push([mainPipeX, mainPipeY, mainPipeZ]);
        //第一段直管 主排气管道长度 = 车间长度
        pu.push([pu.last.x, pu.last.y, pu.last.z - roomBox.zLength]);
        const pipe = new SimplePipe("主排气管道", {
            points: pu.points,
            radius: mainSmokePipeR,
            tubularSegments: 1,
            opacity: 1,
        });
        this.mainSmokeOutPipe = pipe;
        //添加管道起点堵头, 堵头是圆内凹, 半径为 管半径的2位
        const plug = new PipePlug("堵头", { pipeRadius: mainSmokePipeR });
        plug.position.x = pipe.curveStart.x;
        plug.position.y = pipe.curveStart.y;
        plug.position.z = pipe.curveStart.z - 100;
        plug.rotateY(Math.PI);
        plug.rotateX(Math.PI * 0.5);
        this.scene.add(plug);
        const plug2 = plug.clone();
        plug2.position.x = pipe.curveEnd.x;
        plug2.position.y = pipe.curveEnd.y;
        plug2.position.z = pipe.curveEnd.z + 100;
        plug2.rotateZ(Math.PI);
        this.scene.add(plug2);
        this.scene.add(pipe);
        this.fan1 = this.createAcidWash(1);
        this.fan2 = this.createAcidWash(2);
        this.fan3 = this.createAcidWash(3);
        this.fan4 = this.createAcidWash(4);
        this.addMainSmokeOutPipe1();
    }
    //此方法要求必须先创建主排烟管道
    addChannelSmokeOutPipeAndGetComponents(channelIndex) {
        const group = new THREE.Group();
        const components = {
            pipes: [],
            valves: []
        };
        //获取车间模型外框
        const roomBox = this.room.getBox();
        //所有管道的起始点x一样, 即 room模型中最大x值
        const x = roomBox.maxX;
        //每个管道的z 设为0, 最后group用参数 channelIndex 计算z值
        const z = 0;
        //阀门安装位置, 从车间烟出口向外偏移1米
        const valveX = x + 1000;
        const tier1HoleY = this.squareHeight - this.squareHeight / 4;
        const tier2HoleY = this.squareHeight * this.fermentTiers - this.squareHeight / 4;
        const mainSmokeOutPipeX = this.mainSmokeOutPipe.curveEnd.x;
        //管道折弯半径
        const channelSmokePipeCurveR = this.channelSmokePipeRectR;
        const channelSmokePipeR = this.channelSmokePipeR;
        //第二层的管道
        let pu = new PathUtils();
        pu.push([x, tier2HoleY, z]);
        //第一段直管 向右
        pu.push([mainSmokeOutPipeX - channelSmokePipeCurveR, pu.last.y, pu.last.z]);
        //第一段直管转弯, 由左向后 X2Z2
        pu.pushQuarterArc("X2Z2", channelSmokePipeCurveR);
        //转弯, 由前向下
        pu.pushQuarterArc("Z1Y2", channelSmokePipeCurveR);
        //第二段直管, 垂直向下到主管道
        pu.push([pu.last.x, this.mainSmokeOutPipeY, pu.last.z]);
        const tier2Pipe = new SimplePipe("", {
            points: pu.points,
            radius: channelSmokePipeR,
            opacity: 1,
            tubularSegments: 64,
        });
        components.pipes.push(tier2Pipe);
        group.add(tier2Pipe);
        //第二层的阀门
        const valve1 = new StrokeValve("", {
            horizontalLength: channelSmokePipeR,
            horizontalRadius: channelSmokePipeR * 1.1,
            horizontalColor: 0x023177,
            verticalLength: 600,
            verticalRadius: 100,
            verticalColor: 0x666666,
        });
        valve1.position.x = valveX;
        valve1.position.y = tier2HoleY;
        valve1.position.z = z;
        components.valves.push(valve1);
        group.add(valve1);
        //第一层管道
        pu = new PathUtils();
        pu.push([x, tier1HoleY, z]);
        //第一段直管, 向右
        pu.push([mainSmokeOutPipeX - channelSmokePipeCurveR, pu.last.y, pu.last.z]);
        //转弯, 由左向下
        pu.pushQuarterArc("X2Y2", channelSmokePipeCurveR);
        //第二段直管, 垂直向下到主管道
        pu.push([pu.last.x, this.mainSmokeOutPipeY, pu.last.z]);
        const pipe2 = new SimplePipe("", {
            points: pu.points,
            radius: channelSmokePipeR,
            tubularSegments: 32,
            opacity: 1,
        });
        components.pipes.push(pipe2);
        group.add(pipe2);
        const valve2 = new StrokeValve("", {
            horizontalLength: channelSmokePipeR,
            horizontalRadius: channelSmokePipeR * 1.1,
            horizontalColor: 0x023177,
            verticalLength: 600,
            verticalRadius: 100,
            verticalColor: 0x666666,
        });
        valve2.position.x = valveX;
        valve2.position.y = tier1HoleY;
        valve2.position.z = z;
        components.valves.push(valve2);
        group.add(valve2);
        group.position.z = roomBox.minZ + this.squareWidth / this.fermentRows * 2 * ((channelIndex - 1) * 2 + 1);
        this.scene.add(group);
        return components;
    }
    //主排管道2, 主排1的风机之后, 进入酸洗之前
    addMainSmokeOutPipe1() {
        //获取车间模型外框
        const roomBox = this.room.getBox();
        const acidSprayTowerX = roomBox.maxX + this.acidSprayTowerOffsetXOfRoomMaxX;
        //主管道在车间右侧4.5米
        const mainPipeX = roomBox.maxX + this.mainSmokeOutPipe2OffsetXOfRoomMaxX;
        const mainPipeY = this.mainSmokeOutPipe2Y;
        //向后偏移500, 每个通道的二层出烟管为避开一层向右转弯再垂直向到主管道的, 为给最后一个通道的二层出烟管留出位置, 主出烟管向后偏移通道出烟管的折弯半径
        const mainPipeZ = roomBox.maxZ - this.channelSmokePipeRectR;
        const mainSmokePipeR = this.mainSmokePipeR;
        const mainSmokePipeRectR = this.mainSmokePipeRectR;
        // 主排气管道2, 长度 = 车间长度
        let pu = new PathUtils();
        pu.push([mainPipeX, mainPipeY, mainPipeZ]);
        //第一段直管
        pu.push([pu.last.x, pu.last.y, pu.last.z - roomBox.zLength]);
        //由前向右 Z1X1
        pu.pushQuarterArc("Z1X1", mainSmokePipeRectR);
        //第二段直管, 到达酸洗塔
        pu.push([acidSprayTowerX - this.acidSprayTowerTierRadius + 100, pu.last.y, pu.last.z]);
        const pipe = new SimplePipe("主排气管道", {
            points: pu.points,
            radius: mainSmokePipeR,
            tubularSegments: 64,
            opacity: 1,
        });
        this.mainSmokeOutPipe1 = pipe;
        this.scene.add(pipe);
        //添加管道尽头的堵头, 参数是试出来的
        const plug = new PipePlug("堵头", { pipeRadius: mainSmokePipeR });
        plug.position.x = pipe.curveStart.x;
        plug.position.y = pipe.curveStart.y;
        plug.position.z = pipe.curveStart.z - 100;
        plug.rotateY(Math.PI);
        plug.rotateX(Math.PI * 0.5);
        this.scene.add(plug);
        const sprayTower = new SprayTower("酸洗塔", {
            tierRadius: this.acidSprayTowerTierRadius,
            tierHeight: this.acidSprayTowerTierHeight,
            tiers: this.acidSprayTowerTiers,
            joinRadius: this.mainSmokePipeR
        });
        sprayTower.position.x = acidSprayTowerX;
        sprayTower.position.z = pipe.curveEnd.z;
        this.acidSprayTower = sprayTower;
        this.scene.add(sprayTower);
        const waterFall = new Rain("酸洗塔喷淋", {
            maxDropHeight: this.acidSprayTowerTiers * this.acidSprayTowerTierHeight,
            dropScopeRadius: this.acidSprayTowerTierRadius,
            dropDensity: 200,
            dropSize: 100,
            speed: 10,
        });
        this.scene.add(waterFall);
        waterFall.position.x = sprayTower.position.x;
        waterFall.position.z = sprayTower.position.z;
        waterFall.position.y = this.acidSprayTowerTiers * this.acidSprayTowerTierHeight - 600;
        this.sprayTowerWaterFall = waterFall;
        const chimney = new Chimney("烟囱", {
            radius: this.chimneyRadius,
            height: this.chimneyHeight,
        });
        chimney.position.x = roomBox.maxX + this.chimneyOffsetXOfRoomMaxX;
        chimney.position.z = pipe.curveEnd.z;
        this.scene.add(chimney);
        const sprayTowerBox = sprayTower.getBox();
        pu = new PathUtils();
        pu.push([sprayTowerBox.centerX, sprayTowerBox.maxY, sprayTowerBox.centerZ]);
        //第一段直管, 垂直向上200
        pu.push([pu.last.x, pu.last.y + 200, pu.last.z]);
        //由下向右 Y2Z1
        pu.pushQuarterArc("Y2X1", mainSmokePipeRectR);
        //第二段 直管 向右延伸 罐体的半径长度
        pu.push([pu.last.x + this.acidSprayTowerTierRadius, pu.last.y, pu.last.z]);
        //由左向下 X2Y2
        pu.pushQuarterArc("X2Y2", mainSmokePipeRectR);
        //第三段直管, 垂直向下接近地面
        pu.push([pu.last.x, this.mainSmokePipeRectR * 3, pu.last.z]);
        //由下向右 Y1X1
        pu.pushQuarterArc("Y1X1", mainSmokePipeRectR);
        //第四段直管, 向右到烟囱
        pu.push([roomBox.maxX + this.chimneyOffsetXOfRoomMaxX, pu.last.y, pu.last.z]);
        const lastPipe = new SimplePipe("最后一段管", {
            points: pu.points,
            radius: mainSmokePipeR,
            tubularSegments: 128,
            opacity: 1,
        });
        this.scene.add(lastPipe);
        const acidWashPool = new AcidWashPool("酸洗池", {
            length: this.acidWashPoolLength,
            width: this.acidWashPoolWidth,
            height: this.acidWashPoolHeight,
            wallColor: this.acidWashPoolWallColor,
            wallThickness: this.acidWashPoolWallThickness,
        });
        acidWashPool.position.x = roomBox.maxX + this.acidWashPoolOffsetXOfRoomMaxX;
        acidWashPool.position.z = this.acidWashPathZ;
        this.acidWashPool = acidWashPool;
        this.scene.add(acidWashPool);
        const poolBox = acidWashPool.getBox();
        const acidWashPoolLevelText = new SpriteRectText("酸洗池液位显示", "液位: %s m", " N/A ");
        acidWashPoolLevelText.position.x = poolBox.maxX;
        acidWashPoolLevelText.position.y = poolBox.maxY + 400;
        acidWashPoolLevelText.position.z = poolBox.centerZ;
        this.acidWashPoolLevelText = acidWashPoolLevelText;
        this.scene.add(acidWashPoolLevelText);
        const acidBucket = new Bucket("酸洗加药桶", {
            radius: this.acidBucketRadius,
            height: this.acidBucketHeight,
            topColor: this.topColor,
            bottomColor: this.bottomColor,
            flankColor: this.flankColor,
        });
        acidBucket.position.x = roomBox.maxX + this.acidBucketX;
        acidBucket.position.z = this.acidWashPathZ;
        this.acidBucket = acidBucket;
        this.scene.add(acidBucket);
        const bucketBox = acidBucket.getBox();
        const acidBucketLevelText = new SpriteRectText("酸洗加药桶液位显示", "液位: %s m", " N/A ");
        acidBucketLevelText.position.x = bucketBox.centerX;
        acidBucketLevelText.position.y = bucketBox.maxY + 400;
        acidBucketLevelText.position.z = bucketBox.centerZ;
        this.acidBucketLevelText = acidBucketLevelText;
        this.scene.add(acidBucketLevelText);
        //酸洗管道离地距离
        const acidBucketOutPipeOffsetFloorY = 500;
        const acidWashPoolBox = acidWashPool.getBox();
        const waterPipeRectR = this.waterPipeRectR;
        //主供水管 分支进入酸洗池
        pu = new PathUtils();
        pu.push([this.waterPumpsConvergeX, this.waterPumpR, roomBox.maxZ + this.waterOffsetZOfRoomMaxZ]);
        pu.push([pu.last.x, pu.last.y, this.acidWashPathZ + this.acidWashPoolWidth / 2]);
        //向左转弯进入到酸洗搅拌池上, 由前向左 Z1X2
        pu.pushQuarterArc("Z1X2", waterPipeRectR);
        pu.push([acidWashPoolBox.maxX, pu.last.y, pu.last.z]);
        const acidPoolWaterInPipe = new Pipe("酸洗搅拌池进水管", {
            points: pu.points,
            tubularSegments: 64,
        });
        this.scene.add(acidPoolWaterInPipe);
        const waterValveR = this.waterValveR;
        const waterValveH = this.waterValveH;
        const waterValveOptions = { radius: waterValveR, height: waterValveH };
        const acidPoolWaterInValve = new SimpleValve("酸洗池进水阀", waterValveOptions);
        acidPoolWaterInValve.rotateX(Math.PI * 0.5);
        acidPoolWaterInValve.position.x = this.waterPumpsConvergeX;
        acidPoolWaterInValve.position.y = this.waterPumpR;
        //跟车间所有水泵进水阀位置相同
        acidPoolWaterInValve.position.z = roomBox.maxZ + this.waterOffsetZOfRoomMaxZ / 2;
        this.acidPoolWaterInValve = acidPoolWaterInValve;
        this.scene.add(acidPoolWaterInValve);
        pu = new PathUtils();
        pu.push([acidBucket.position.x - this.acidBucketRadius, acidBucketOutPipeOffsetFloorY, this.acidWashPathZ]);
        pu.push([acidWashPoolBox.maxX, pu.last.y, pu.last.z]);
        const acidBucketToAcidPoolPipe = new Pipe("酸洗加药桶到搅拌池管道", { points: pu.points, tubularSegments: 1 });
        this.scene.add(acidBucketToAcidPoolPipe);
        const acidBucketMeteringPump = new MeteringPump("酸洗加药桶计量泵");
        acidBucketMeteringPump.position.x = acidBucket.position.x - this.acidBucketRadius - 500;
        acidBucketMeteringPump.position.y = acidBucketOutPipeOffsetFloorY;
        acidBucketMeteringPump.position.z = acidBucket.position.z;
        this.acidBucketMeteringPump = acidBucketMeteringPump;
        this.scene.add(acidBucketMeteringPump);
        const acidBucketMeteringPumpBox = acidBucketMeteringPump.getBox();
        const acidBucketMeteringPumpText = new SpriteRectText("酸洗加药桶计量泵流量显示", "流量: %s m³/h", " N/A ");
        acidBucketMeteringPumpText.position.x = acidBucketMeteringPumpBox.minX;
        acidBucketMeteringPumpText.position.y = acidBucketMeteringPumpBox.maxY + 200;
        acidBucketMeteringPumpText.position.z = acidBucketMeteringPumpBox.minZ;
        this.acidBucketMeteringPumpText = acidBucketMeteringPumpText;
        this.scene.add(acidBucketMeteringPumpText);
        const mixer = new Mixer("酸洗搅拌机", { axleHeight: this.acidWashPoolHeight });
        mixer.position.x = acidWashPoolBox.centerX;
        mixer.position.y = this.acidWashPoolHeight;
        mixer.position.z = this.acidWashPathZ;
        this.acidWashPoolMixer = mixer;
        this.scene.add(mixer);
        const acidPoolBox = acidWashPool.getBox();
        const poolPumpRadius = 300;
        const poolPumpHeight = 700;
        const poolPumpX = roomBox.maxX + this.acidWashPoolOutPumpOffsetXOfRoomMaxX;
        const poolPump1 = new SimplePump("酸洗池出水水泵1", {
            radius: poolPumpRadius,
            height: poolPumpHeight
        });
        poolPump1.rotateZ(Math.PI * 0.5);
        poolPump1.position.x = poolPumpX;
        poolPump1.position.y = poolPumpRadius;
        poolPump1.position.z = acidWashPoolBox.centerZ - acidWashPoolBox.zLength / 4;
        this.acidWashPoolOutPump1 = poolPump1;
        this.scene.add(poolPump1);
        const poolPump2 = new SimplePump("酸洗池出水水泵2", {
            radius: poolPumpRadius,
            height: poolPumpHeight
        });
        poolPump2.rotateZ(Math.PI * 0.5);
        //主供水管道要贯穿生物车间所有水泵基座, 所以要加上水泵基座深度的一半
        poolPump2.position.x = poolPumpX;
        poolPump2.position.y = poolPumpRadius;
        poolPump2.position.z = acidWashPoolBox.centerZ + acidWashPoolBox.zLength / 4;
        this.acidWashPoolOutPump2 = poolPump2;
        this.scene.add(poolPump2);
        //酸洗水泵离酸洗左侧距离
        const acidPoolOutPumpPipePart1Length = 2500;
        pu = new PathUtils();
        pu.push([acidWashPoolBox.minX, poolPump1.position.y, poolPump1.position.z]);
        pu.push([acidPoolBox.minX - acidPoolOutPumpPipePart1Length, pu.last.y, pu.last.z]);
        const acidPoolOutPump1Pipe = new Pipe("酸洗池出水水泵1管道", {
            points: pu.points,
            tubularSegments: 1,
        });
        this.acidPoolOutPump1Pipe = acidPoolOutPump1Pipe;
        this.scene.add(acidPoolOutPump1Pipe);
        pu = new PathUtils();
        pu.push([acidWashPoolBox.minX, poolPump2.position.y, poolPump2.position.z]);
        pu.push([acidPoolBox.minX - (acidPoolOutPumpPipePart1Length - waterPipeRectR), poolPumpRadius, poolPump2.position.z]);
        //第一段直管向后转弯, 由右向后 X1Z2
        pu.pushQuarterArc("X1Z2", waterPipeRectR);
        pu.push([pu.last.x, pu.last.y, this.acidSprayTower.position.z + this.acidSprayTowerTierRadius / 2]);
        //第二段直管向右转弯, 由前向右 Z1X1
        pu.pushQuarterArc("Z1X1", waterPipeRectR);
        pu.push([this.acidSprayTower.position.x - this.acidSprayTowerTierRadius + 100, pu.last.y, pu.last.z]);
        //第三段直管向上转弯, 由左向上 X2Y1
        pu.pushQuarterArc("X2Y1", waterPipeRectR);
        pu.push([pu.last.x, this.acidSprayTowerTierHeight * this.acidSprayTowerTiers - 600, pu.last.z]);
        //第四段直管向右转弯, 由下向右 Y2X1
        pu.pushQuarterArc("Y2X1", waterPipeRectR);
        pu.push([pu.last.x + this.acidSprayTowerTierRadius / 2, pu.last.y, pu.last.z]);
        //第五段直管向下转弯, 由左向下 X2Y2
        pu.pushQuarterArc("X2Y2", waterPipeRectR);
        const acidPoolOutPump2Pipe = new Pipe("酸洗池出水水泵2管道", {
            radius: 70,
            color: 0x666666,
            tubularSegments: 512,
            radiusSegments: 32,
            points: pu.points
        });
        this.acidPoolOutPump2Pipe = acidPoolOutPump2Pipe;
        this.scene.add(acidPoolOutPump2Pipe);
    }
    createWaterPath() {
        const roomBox = this.room.getBox();
        const waterPumpR = this.waterPumpR;
        const waterPumpH = this.waterPumpH;
        const waterPumpX = this.waterPumpX;
        const waterPipeRectR = this.waterPipeRectR;
        //两个给水泵的间距
        const waterPumpSpace = 1800;
        const waterPump1 = new SimplePump("给水泵1", {
            radius: waterPumpR,
            height: waterPumpH,
        });
        waterPump1.rotateZ(Math.PI * 0.5);
        waterPump1.position.x = waterPumpX;
        waterPump1.position.y = waterPumpR;
        waterPump1.position.z = roomBox.maxZ + this.waterOffsetZOfRoomMaxZ;
        this.waterPump1 = waterPump1;
        this.scene.add(waterPump1);
        const waterPump2 = new SimplePump("给水泵2", {
            radius: waterPumpR,
            height: waterPumpH
        });
        waterPump2.rotateZ(Math.PI * 0.5);
        waterPump2.position.x = waterPumpX;
        waterPump2.position.y = waterPumpR;
        waterPump2.position.z = waterPump1.position.z + waterPumpSpace;
        this.waterPump2 = waterPump2;
        this.scene.add(waterPump2);
        const pu1 = new PathUtils();
        pu1.push([waterPumpX, waterPumpR, waterPump1.position.z]);
        pu1.push([roomBox.minX, pu1.last.y, pu1.last.z]);
        const water1Pipe = new Pipe("给水泵1出水管", {
            points: pu1.points,
            tubularSegments: 1,
        });
        this.scene.add(water1Pipe);
        const pu2 = new PathUtils();
        pu2.push([waterPumpX, waterPumpR, waterPump2.position.z]);
        pu2.push([this.waterPumpsConvergeX + waterPipeRectR, pu2.last.y, pu2.last.z]);
        //转弯汇到水泵1的管道上, 由右向后 X1Z2
        pu2.pushQuarterArc("X1Z2", waterPipeRectR);
        pu2.push([pu2.last.x, pu2.last.y, waterPump1.position.z]);
        const water2Pipe = new Pipe("给水泵2出水管", {
            points: pu2.points,
            tubularSegments: 64,
        });
        this.scene.add(water2Pipe);
    }
    createAcidWash(index) {
        const group = new THREE.Group();
        //获取车间模型外框
        const roomBox = this.room.getBox();
        const fanX = roomBox.maxX + this.mainSmokeOutPipe2OffsetXOfRoomMaxX;
        const startX = this.mainSmokeOutPipe.curveEnd.x + this.channelSmokePipeR / 2;
        const startY = this.mainSmokeOutPipeY;
        const startZ = 0;
        const pipe1Length = fanX - startX;
        const pu = new PathUtils();
        //添加第一段直管
        pu.push([startX, startY, startZ]);
        pu.push([pu.last.x + pipe1Length, pu.last.y, pu.last.z]);
        const pipe = new SimplePipe("风机1前管道", {
            points: pu.points,
            radius: this.channelSmokePipeR,
        });
        group.add(pipe);
        const fan = new Fan3("风机");
        fan.rotateY(Math.PI * 0.5);
        fan.position.x = startX + pipe1Length;
        fan.position.y = startY;
        group.add(fan);
        group.position.z = roomBox.maxX - (this.squareWidth * (index - 2) + this.mainSmokePipeRectR);
        this.scene.add(group);
        return fan;
    }
    /**
     * 通道水管, 水洗/预洗/生物补水 都是同样的管道
     * @param name
     * @param length1 向上的直管长度
     * @param length2 向右的直管长度
     */
    createChannelWaterPipe(name, length1, length2) {
        const waterPipeRectR = this.waterPipeRectR;
        let pu = new PathUtils();
        pu.push([0, 0, 0]);
        //第一段直管
        pu.push([pu.last.x, pu.last.y + length1, pu.last.z]);
        //由下向后转弯 Y2Z2
        pu.pushQuarterArc("Y2Z2", waterPipeRectR);
        //第二段直管, 向前
        pu.push([pu.last.x, pu.last.y, pu.last.z - length2]);
        return new Pipe(name, {
            points: pu.points,
            radius: 40
        });
    }
    addSmokeIn() {
        const c1 = this.addChannelSmokeInPipeAndGetComponents(this.channel1Index);
        this.channel1In1Pipe = c1.pipes[0];
        this.channel1In1Pipe.name = "通道1进气1管道";
        this.channel1In2Pipe = c1.pipes[1];
        this.channel1In2Pipe.name = "通道1进气2管道";
        this.channel1In1Valve = c1.valves[0];
        this.channel1In1Valve.name = "通道1进气1阀门";
        this.channel1In2Valve = c1.valves[1];
        this.channel1In2Valve.name = "通道1进气2阀门";
        const c2 = this.addChannelSmokeInPipeAndGetComponents(this.channel2Index);
        this.channel2In1Pipe = c2.pipes[0];
        this.channel2In1Pipe.name = "通道2进气1管道";
        this.channel2In2Pipe = c2.pipes[1];
        this.channel2In2Pipe.name = "通道2进气2管道";
        this.channel2In1Valve = c2.valves[0];
        this.channel2In1Valve.name = "通道2进气1阀门";
        this.channel2In2Valve = c2.valves[1];
        this.channel2In2Valve.name = "通道2进气2阀门";
        const c3 = this.addChannelSmokeInPipeAndGetComponents(this.channel3Index);
        this.channel3In1Pipe = c3.pipes[0];
        this.channel3In1Pipe.name = "通道3进气1管道";
        this.channel3In2Pipe = c3.pipes[1];
        this.channel3In2Pipe.name = "通道3进气2管道";
        this.channel3In1Valve = c3.valves[0];
        this.channel3In1Valve.name = "通道3进气1阀门";
        this.channel3In2Valve = c3.valves[1];
        this.channel3In2Valve.name = "通道3进气2阀门";
        const c4 = this.addChannelSmokeInPipeAndGetComponents(this.channel4Index);
        this.channel4In1Pipe = c4.pipes[0];
        this.channel4In1Pipe.name = "通道4进气1管道";
        this.channel4In2Pipe = c4.pipes[1];
        this.channel4In2Pipe.name = "通道4进气2管道";
        this.channel4In1Valve = c4.valves[0];
        this.channel4In1Valve.name = "通道4进气1阀门";
        this.channel4In2Valve = c4.valves[1];
        this.channel4In2Valve.name = "通道4进气2阀门";
    }
    addSmokeOut() {
        const c1 = this.addChannelSmokeOutPipeAndGetComponents(this.channel1Index);
        this.channel1Out1Pipe = c1.pipes[0];
        this.channel1Out1Pipe.name = "通道1排气1管道";
        this.channel1Out2Pipe = c1.pipes[1];
        this.channel1Out2Pipe.name = "通道1排气2管道";
        this.channel1Out1Valve = c1.valves[0];
        this.channel1Out1Valve.name = "通道1排气1阀门";
        this.channel1Out2Valve = c1.valves[1];
        this.channel1Out2Valve.name = "通道1排气2阀门";
        const c2 = this.addChannelSmokeOutPipeAndGetComponents(this.channel2Index);
        this.channel2Out1Pipe = c2.pipes[0];
        this.channel2Out1Pipe.name = "通道2排气1管道";
        this.channel2Out2Pipe = c2.pipes[1];
        this.channel2Out2Pipe.name = "通道2排气2管道";
        this.channel2Out1Valve = c2.valves[0];
        this.channel2Out1Valve.name = "通道2排气1阀门";
        this.channel2Out2Valve = c2.valves[1];
        this.channel2Out2Valve.name = "通道2排气2阀门";
        const c3 = this.addChannelSmokeOutPipeAndGetComponents(this.channel3Index);
        this.channel3Out1Pipe = c3.pipes[0];
        this.channel3Out1Pipe.name = "通道3排气1管道";
        this.channel3Out2Pipe = c3.pipes[1];
        this.channel3Out2Pipe.name = "通道3排气2管道";
        this.channel3Out1Valve = c3.valves[0];
        this.channel3Out1Valve.name = "通道3排气1阀门";
        this.channel3Out2Valve = c3.valves[1];
        this.channel3Out2Valve.name = "通道3排气2阀门";
        const c4 = this.addChannelSmokeOutPipeAndGetComponents(this.channel4Index);
        this.channel4Out1Pipe = c4.pipes[0];
        this.channel4Out1Pipe.name = "通道4排气1管道";
        this.channel4Out2Pipe = c4.pipes[1];
        this.channel4Out2Pipe.name = "通道4排气2管道";
        this.channel4Out1Valve = c4.valves[0];
        this.channel4Out1Valve.name = "通道4排气1阀门";
        this.channel4Out2Valve = c4.valves[1];
        this.channel4Out2Valve.name = "通道4排气2阀门";
    }
    addDevices() {
        const washIndex = 1;
        const beforeIndex = 2;
        const fermentIndex = 3;
        const channel1Devices = this.createDevices(washIndex);
        this.channel1Wash1Pump = channel1Devices.pumps[0];
        this.channel1Wash2Pump = channel1Devices.pumps[1];
        this.channel2Wash1Pump = channel1Devices.pumps[2];
        this.channel2Wash2Pump = channel1Devices.pumps[3];
        this.channel3Wash1Pump = channel1Devices.pumps[4];
        this.channel3Wash2Pump = channel1Devices.pumps[5];
        this.channel4Wash1Pump = channel1Devices.pumps[6];
        this.channel4Wash2Pump = channel1Devices.pumps[7];
        this.channel1Wash1Pipe = channel1Devices.pipes[0];
        this.channel1Wash2Pipe = channel1Devices.pipes[1];
        this.channel2Wash1Pipe = channel1Devices.pipes[2];
        this.channel2Wash2Pipe = channel1Devices.pipes[3];
        this.channel3Wash1Pipe = channel1Devices.pipes[4];
        this.channel3Wash2Pipe = channel1Devices.pipes[5];
        this.channel4Wash1Pipe = channel1Devices.pipes[6];
        this.channel4Wash2Pipe = channel1Devices.pipes[7];
        this.channel1Wash1Valve = channel1Devices.valves[0];
        this.channel1Wash2Valve = channel1Devices.valves[1];
        this.channel2Wash1Valve = channel1Devices.valves[2];
        this.channel2Wash2Valve = channel1Devices.valves[3];
        this.channel3Wash1Valve = channel1Devices.valves[4];
        this.channel3Wash2Valve = channel1Devices.valves[5];
        this.channel4Wash1Valve = channel1Devices.valves[6];
        this.channel4Wash2Valve = channel1Devices.valves[7];
        this.channel1WashBaseWaterInPipe = channel1Devices.baseWaterInPipe[0];
        this.channel2WashBaseWaterInPipe = channel1Devices.baseWaterInPipe[1];
        this.channel3WashBaseWaterInPipe = channel1Devices.baseWaterInPipe[2];
        this.channel4WashBaseWaterInPipe = channel1Devices.baseWaterInPipe[3];
        this.channel1WashBaseWaterInValve = channel1Devices.baseWaterInValve[0];
        this.channel2WashBaseWaterInValve = channel1Devices.baseWaterInValve[1];
        this.channel3WashBaseWaterInValve = channel1Devices.baseWaterInValve[2];
        this.channel4WashBaseWaterInValve = channel1Devices.baseWaterInValve[3];
        const channel2Devices = this.createDevices(beforeIndex);
        this.channel1Before1Pump = channel2Devices.pumps[0];
        this.channel1Before2Pump = channel2Devices.pumps[1];
        this.channel2Before1Pump = channel2Devices.pumps[2];
        this.channel2Before2Pump = channel2Devices.pumps[3];
        this.channel3Before1Pump = channel2Devices.pumps[4];
        this.channel3Before2Pump = channel2Devices.pumps[5];
        this.channel4Before1Pump = channel2Devices.pumps[6];
        this.channel4Before2Pump = channel2Devices.pumps[7];
        this.channel1Before1Pipe = channel2Devices.pipes[0];
        this.channel1Before2Pipe = channel2Devices.pipes[1];
        this.channel2Before1Pipe = channel2Devices.pipes[2];
        this.channel2Before2Pipe = channel2Devices.pipes[3];
        this.channel3Before1Pipe = channel2Devices.pipes[4];
        this.channel3Before2Pipe = channel2Devices.pipes[5];
        this.channel4Before1Pipe = channel2Devices.pipes[6];
        this.channel4Before2Pipe = channel2Devices.pipes[7];
        this.channel1Before1Valve = channel2Devices.valves[0];
        this.channel1Before2Valve = channel2Devices.valves[1];
        this.channel2Before1Valve = channel2Devices.valves[2];
        this.channel2Before2Valve = channel2Devices.valves[3];
        this.channel3Before1Valve = channel2Devices.valves[4];
        this.channel3Before2Valve = channel2Devices.valves[5];
        this.channel4Before1Valve = channel2Devices.valves[6];
        this.channel4Before2Valve = channel2Devices.valves[7];
        this.channel1BeforeBaseWaterInPipe = channel2Devices.baseWaterInPipe[0];
        this.channel2BeforeBaseWaterInPipe = channel2Devices.baseWaterInPipe[1];
        this.channel3BeforeBaseWaterInPipe = channel2Devices.baseWaterInPipe[2];
        this.channel4BeforeBaseWaterInPipe = channel2Devices.baseWaterInPipe[3];
        this.channel1BeforeBaseWaterInValve = channel2Devices.baseWaterInValve[0];
        this.channel2BeforeBaseWaterInValve = channel2Devices.baseWaterInValve[1];
        this.channel3BeforeBaseWaterInValve = channel2Devices.baseWaterInValve[2];
        this.channel4BeforeBaseWaterInValve = channel2Devices.baseWaterInValve[3];
        const channel3Devices = this.createDevices(fermentIndex);
        this.channel1Ferment1Pump = channel3Devices.pumps[0];
        this.channel1Ferment2Pump = channel3Devices.pumps[1];
        this.channel2Ferment1Pump = channel3Devices.pumps[2];
        this.channel2Ferment2Pump = channel3Devices.pumps[3];
        this.channel3Ferment1Pump = channel3Devices.pumps[4];
        this.channel3Ferment2Pump = channel3Devices.pumps[5];
        this.channel4Ferment1Pump = channel3Devices.pumps[6];
        this.channel4Ferment2Pump = channel3Devices.pumps[7];
        this.channel1Ferment1Pipe = channel3Devices.pipes[0];
        this.channel1Ferment2Pipe = channel3Devices.pipes[1];
        this.channel2Ferment1Pipe = channel3Devices.pipes[2];
        this.channel2Ferment2Pipe = channel3Devices.pipes[3];
        this.channel3Ferment1Pipe = channel3Devices.pipes[4];
        this.channel3Ferment2Pipe = channel3Devices.pipes[5];
        this.channel4Ferment1Pipe = channel3Devices.pipes[6];
        this.channel4Ferment2Pipe = channel3Devices.pipes[7];
        this.channel1Ferment1Valve = channel3Devices.valves[0];
        this.channel1Ferment2Valve = channel3Devices.valves[1];
        this.channel2Ferment1Valve = channel3Devices.valves[2];
        this.channel2Ferment2Valve = channel3Devices.valves[3];
        this.channel3Ferment1Valve = channel3Devices.valves[4];
        this.channel3Ferment2Valve = channel3Devices.valves[5];
        this.channel4Ferment1Valve = channel3Devices.valves[6];
        this.channel4Ferment2Valve = channel3Devices.valves[7];
        this.channel1FermentBaseWaterInPipe = channel3Devices.baseWaterInPipe[0];
        this.channel2FermentBaseWaterInPipe = channel3Devices.baseWaterInPipe[1];
        this.channel3FermentBaseWaterInPipe = channel3Devices.baseWaterInPipe[2];
        this.channel4FermentBaseWaterInPipe = channel3Devices.baseWaterInPipe[3];
        this.channel1FermentBaseWaterInValve = channel3Devices.baseWaterInValve[0];
        this.channel2FermentBaseWaterInValve = channel3Devices.baseWaterInValve[1];
        this.channel3FermentBaseWaterInValve = channel3Devices.baseWaterInValve[2];
        this.channel4FermentBaseWaterInValve = channel3Devices.baseWaterInValve[3];
    }
    onRenderer() {
        this.orbit.update();
    }
    addGUI() {
        const gui = new GUI();
        const channel1Record = {
            "水洗1泵运行": () => this.channel1Wash1Pump?.run(),
            "水洗2泵运行": () => this.channel1Wash2Pump?.run(),
            "预洗1泵运行": () => this.channel1Before1Pump?.run(),
            "预洗2泵运行": () => this.channel1Before2Pump?.run(),
            "生物补水1泵运行": () => this.channel1Ferment1Pump?.run(),
            "生物补水2泵运行": () => this.channel1Ferment2Pump?.run(),
            "水洗1阀打开": () => this.channel1Wash1Valve?.open(),
            "水洗2阀打开": () => this.channel1Wash2Valve?.open(),
            "预洗1阀打开": () => this.channel1Before1Valve?.open(),
            "预洗2阀打开": () => this.channel1Before2Valve?.open(),
            "生物补水1阀打开": () => this.channel1Ferment1Valve?.open(),
            "生物补水2阀打开": () => this.channel1Ferment2Valve?.open(),
            "水洗1泵停止": () => this.channel1Wash1Pump?.stop(),
            "水洗2泵停止": () => this.channel1Wash2Pump?.stop(),
            "预洗1泵停止": () => this.channel1Before1Pump?.stop(),
            "预洗2泵停止": () => this.channel1Before2Pump?.stop(),
            "生物补水1泵停止": () => this.channel1Ferment1Pump?.stop(),
            "生物补水2泵停止": () => this.channel1Ferment1Pump?.stop(),
            "水洗1阀关闭": () => this.channel1Wash1Valve?.close(),
            "水洗2阀关闭": () => this.channel1Wash2Valve?.close(),
            "预洗1阀关闭": () => this.channel1Before1Valve?.close(),
            "预洗2阀关闭": () => this.channel1Before2Valve?.close(),
            "生物补水1阀关闭": () => this.channel1Ferment1Valve?.close(),
            "生物补水2阀关闭": () => this.channel1Ferment2Valve?.close(),
        };
        const channel1Folder = gui.addFolder('通道1');
        for (let key in channel1Record) {
            channel1Folder.add(channel1Record, key).name(key);
        }
        const inWaterRecord = {
            "通道1水洗基座进水阀打开": () => this.channel1WashBaseWaterInValve?.open(),
            "通道2水洗基座进水阀打开": () => this.channel2WashBaseWaterInValve?.open(),
            "通道3水洗基座进水阀打开": () => this.channel3WashBaseWaterInValve?.open(),
            "通道4水洗基座进水阀打开": () => this.channel4WashBaseWaterInValve?.open(),
            "通道1水洗基座进水阀关闭": () => this.channel1WashBaseWaterInValve?.close(),
            "通道2水洗基座进水阀关闭": () => this.channel2WashBaseWaterInValve?.close(),
            "通道3水洗基座进水阀关闭": () => this.channel3WashBaseWaterInValve?.close(),
            "通道4水洗基座进水阀关闭": () => this.channel4WashBaseWaterInValve?.close(),
            "通道1预洗基座进水阀打开": () => this.channel1BeforeBaseWaterInValve?.open(),
            "通道2预洗基座进水阀打开": () => this.channel2BeforeBaseWaterInValve?.open(),
            "通道3预洗基座进水阀打开": () => this.channel3BeforeBaseWaterInValve?.open(),
            "通道4预洗基座进水阀打开": () => this.channel4BeforeBaseWaterInValve?.open(),
            "通道1预洗基座进水阀关闭": () => this.channel1BeforeBaseWaterInValve?.close(),
            "通道2预洗基座进水阀关闭": () => this.channel2BeforeBaseWaterInValve?.close(),
            "通道3预洗基座进水阀关闭": () => this.channel3BeforeBaseWaterInValve?.close(),
            "通道4预洗基座进水阀关闭": () => this.channel4BeforeBaseWaterInValve?.close(),
            "通道1生物补水阀打开": () => this.channel1FermentBaseWaterInValve?.open(),
            "通道2生物补水阀打开": () => this.channel2FermentBaseWaterInValve?.open(),
            "通道3生物补水阀打开": () => this.channel3FermentBaseWaterInValve?.open(),
            "通道4生物补水阀打开": () => this.channel4FermentBaseWaterInValve?.open(),
            "通道1生物补水阀关闭": () => this.channel1FermentBaseWaterInValve?.close(),
            "通道2生物补水阀关闭": () => this.channel2FermentBaseWaterInValve?.close(),
            "通道3生物补水阀关闭": () => this.channel3FermentBaseWaterInValve?.close(),
            "通道4生物补水阀关闭": () => this.channel4FermentBaseWaterInValve?.close(),
        };
        const inWaterFolder = gui.addFolder('进水');
        for (let key in inWaterRecord) {
            inWaterFolder.add(inWaterRecord, key).name(key);
        }
        const fanRecord = {
            "风机1运行": () => this.fan1?.run(),
            "风机2运行": () => this.fan2?.run(),
            "风机3运行": () => this.fan3?.run(),
            "风机4运行": () => this.fan4?.run(),
            "风机1停止": () => this.fan1?.stop(),
            "风机2停止": () => this.fan2?.stop(),
            "风机3停止": () => this.fan3?.stop(),
            "风机4停止": () => this.fan4?.stop(),
        };
        const fanFolder = gui.addFolder('风机');
        for (let key in fanRecord) {
            fanFolder.add(fanRecord, key).name(key);
        }
        const acidPathRecord = {
            "搅拌机运行": () => this.acidWashPoolMixer?.run(),
            "搅拌机停止": () => this.acidWashPoolMixer?.stop(),
        };
        const acidPathFolder = gui.addFolder("酸洗通路");
        for (let key in acidPathRecord) {
            acidPathFolder.add(acidPathRecord, key).name(key);
        }
    }
    // 执行数据变化事件
    executePoint(point, value) {
        this.points[point] && this.points[point](value);
    }
    emitterOn() {
        Emitter.instance().on("pointDataChange", this.emitterHandler.bind(this));
    }
    emitterHandler([point, value]) {
        console.log("Emitter on: ", `point = ${point}, value = ${value}`);
        this.executePoint(point, value);
    }
    onDestroy() {
        Emitter.instance().off("pointDataChange", this.emitterHandler);
    }
    points = {
        "1": value => {
            if (value == "0") {
                this.channel1In1Valve?.close();
            }
            else {
                this.channel1In1Valve?.open();
            }
        },
        "2": value => {
            if (value == "0") {
                this.channel1In2Valve?.close();
            }
            else {
                this.channel1In2Valve?.open();
            }
        },
        "3": value => {
            if (value == "0") {
                this.channel2In1Valve?.close();
            }
            else {
                this.channel2In1Valve?.open();
            }
        },
        "4": value => {
            if (value == "0") {
                this.channel2In2Valve?.close();
            }
            else {
                this.channel2In2Valve?.open();
            }
        },
        "5": value => {
            if (value == "0") {
                this.channel3In1Valve?.close();
            }
            else {
                this.channel3In1Valve?.open();
            }
        },
        "6": value => {
            if (value == "0") {
                this.channel3In2Valve?.close();
            }
            else {
                this.channel3In2Valve?.open();
            }
        },
        "7": value => {
            if (value == "0") {
                this.channel4In1Valve?.close();
            }
            else {
                this.channel4In1Valve?.open();
            }
        },
        "8": value => {
            if (value == "0") {
                this.channel4In2Valve?.close();
            }
            else {
                this.channel4In2Valve?.open();
            }
        },
        "9": value => {
            if (value == "0") {
                this.channel1Out1Valve?.close();
            }
            else {
                this.channel1Out1Valve?.open();
            }
        },
        "10": value => {
            if (value == "0") {
                this.channel1Out2Valve?.close();
            }
            else {
                this.channel1Out2Valve?.open();
            }
        },
        "11": value => {
            if (value == "0") {
                this.channel2Out1Valve?.close();
            }
            else {
                this.channel2Out1Valve?.open();
            }
        },
        "12": value => {
            if (value == "0") {
                this.channel2Out2Valve?.close();
            }
            else {
                this.channel2Out2Valve?.open();
            }
        },
        "13": value => {
            if (value == "0") {
                this.channel3Out1Valve?.close();
            }
            else {
                this.channel3Out1Valve?.open();
            }
        },
        "14": value => {
            if (value == "0") {
                this.channel3Out2Valve?.close();
            }
            else {
                this.channel3Out2Valve?.open();
            }
        },
        "15": value => {
            if (value == "0") {
                this.channel4Out1Valve?.close();
            }
            else {
                this.channel4Out1Valve?.open();
            }
        },
        "16": value => {
            if (value == "0") {
                this.channel4Out2Valve?.close();
            }
            else {
                this.channel4Out2Valve?.open();
            }
        },
        "17": value => {
            if (value == "0") {
                this.channel1WashBaseWaterInValve?.close();
            }
            else {
                this.channel1WashBaseWaterInValve?.open();
            }
        },
        "18": value => {
            if (value == "0") {
                this.channel2WashBaseWaterInValve?.close();
            }
            else {
                this.channel2WashBaseWaterInValve?.open();
            }
        },
        "19": value => {
            if (value == "0") {
                this.channel3WashBaseWaterInValve?.close();
            }
            else {
                this.channel3WashBaseWaterInValve?.open();
            }
        },
        "20": value => {
            if (value == "0") {
                this.channel4WashBaseWaterInValve?.close();
            }
            else {
                this.channel4WashBaseWaterInValve?.open();
            }
        },
        "21": value => {
            if (value == "0") {
                this.channel1BeforeBaseWaterInValve?.close();
            }
            else {
                this.channel1BeforeBaseWaterInValve?.open();
            }
        },
        "22": value => {
            if (value == "0") {
                this.channel2BeforeBaseWaterInValve?.close();
            }
            else {
                this.channel2BeforeBaseWaterInValve?.open();
            }
        },
        "23": value => {
            if (value == "0") {
                this.channel3BeforeBaseWaterInValve?.close();
            }
            else {
                this.channel3BeforeBaseWaterInValve?.open();
            }
        },
        "24": value => {
            if (value == "0") {
                this.channel4BeforeBaseWaterInValve?.close();
            }
            else {
                this.channel4BeforeBaseWaterInValve?.open();
            }
        },
        "25": value => {
            if (value == "0") {
                this.channel1FermentBaseWaterInValve?.close();
            }
            else {
                this.channel1FermentBaseWaterInValve?.open();
            }
        },
        "26": value => {
            if (value == "0") {
                this.channel2FermentBaseWaterInValve?.close();
            }
            else {
                this.channel2FermentBaseWaterInValve?.open();
            }
        },
        "27": value => {
            if (value == "0") {
                this.channel3FermentBaseWaterInValve?.close();
            }
            else {
                this.channel3FermentBaseWaterInValve?.open();
            }
        },
        "28": value => {
            if (value == "0") {
                this.channel4FermentBaseWaterInValve?.close();
            }
            else {
                this.channel4FermentBaseWaterInValve?.open();
            }
        },
        "29": value => {
            if (value == "0") {
                this.channel1Wash1Valve?.close();
            }
            else {
                this.channel1Wash1Valve?.open();
            }
        },
        "30": value => {
            if (value == "0") {
                this.channel1Wash2Valve?.close();
            }
            else {
                this.channel1Wash2Valve?.open();
            }
        },
        "31": value => {
            if (value == "0") {
                this.channel2Wash1Valve?.close();
            }
            else {
                this.channel2Wash1Valve?.open();
            }
        },
        "32": value => {
            if (value == "0") {
                this.channel2Wash2Valve?.close();
            }
            else {
                this.channel2Wash2Valve?.open();
            }
        },
        "33": value => {
            if (value == "0") {
                this.channel3Wash1Valve?.close();
            }
            else {
                this.channel3Wash1Valve?.open();
            }
        },
        "34": value => {
            if (value == "0") {
                this.channel3Wash2Valve?.close();
            }
            else {
                this.channel3Wash2Valve?.open();
            }
        },
        "35": value => {
            if (value == "0") {
                this.channel4Wash1Valve?.close();
            }
            else {
                this.channel4Wash1Valve?.open();
            }
        },
        "36": value => {
            if (value == "0") {
                this.channel4Wash2Valve?.close();
            }
            else {
                this.channel4Wash2Valve?.open();
            }
        },
        "37": value => {
            if (value == "0") {
                this.channel1Before1Valve?.close();
            }
            else {
                this.channel1Before1Valve?.open();
            }
        },
        "38": value => {
            if (value == "0") {
                this.channel1Before2Valve?.close();
            }
            else {
                this.channel1Before2Valve?.open();
            }
        },
        "39": value => {
            if (value == "0") {
                this.channel2Before1Valve?.close();
            }
            else {
                this.channel2Before1Valve?.open();
            }
        },
        "40": value => {
            if (value == "0") {
                this.channel2Before2Valve?.close();
            }
            else {
                this.channel2Before2Valve?.open();
            }
        },
        "41": value => {
            if (value == "0") {
                this.channel3Before1Valve?.close();
            }
            else {
                this.channel3Before1Valve?.open();
            }
        },
        "42": value => {
            if (value == "0") {
                this.channel3Before2Valve?.close();
            }
            else {
                this.channel3Before2Valve?.open();
            }
        },
        "43": value => {
            if (value == "0") {
                this.channel4Before1Valve?.close();
            }
            else {
                this.channel4Before1Valve?.open();
            }
        },
        "44": value => {
            if (value == "0") {
                this.channel4Before2Valve?.close();
            }
            else {
                this.channel4Before2Valve?.open();
            }
        },
        "45": value => {
            if (value == "0") {
                this.channel1Ferment1Valve?.close();
            }
            else {
                this.channel1Ferment1Valve?.open();
            }
        },
        "46": value => {
            if (value == "0") {
                this.channel1Ferment2Valve?.close();
            }
            else {
                this.channel1Ferment2Valve?.open();
            }
        },
        "47": value => {
            if (value == "0") {
                this.channel2Ferment1Valve?.close();
            }
            else {
                this.channel2Ferment1Valve?.open();
            }
        },
        "48": value => {
            if (value == "0") {
                this.channel2Ferment2Valve?.close();
            }
            else {
                this.channel2Ferment2Valve?.open();
            }
        },
        "49": value => {
            if (value == "0") {
                this.channel3Ferment1Valve?.close();
            }
            else {
                this.channel3Ferment1Valve?.open();
            }
        },
        "50": value => {
            if (value == "0") {
                this.channel3Ferment2Valve?.close();
            }
            else {
                this.channel3Ferment2Valve?.open();
            }
        },
        "51": value => {
            if (value == "0") {
                this.channel4Ferment1Valve?.close();
            }
            else {
                this.channel4Ferment1Valve?.open();
            }
        },
        "52": value => {
            if (value == "0") {
                this.channel4Ferment2Valve?.close();
            }
            else {
                this.channel4Ferment2Valve?.open();
            }
        },
        "53": value => {
            if (value == "0") {
                this.fan1?.stop();
            }
            else {
                this.fan1?.run();
            }
        },
        "54": value => {
            if (value == "0") {
                this.fan2?.stop();
            }
            else {
                this.fan2?.run();
            }
        },
        "55": value => {
            if (value == "0") {
                this.fan3?.stop();
            }
            else {
                this.fan3?.run();
            }
        },
        "56": value => {
            if (value == "0") {
                this.fan4?.stop();
            }
            else {
                this.fan4?.run();
            }
        },
        "57": value => {
            if (value == "0") {
                this.waterPump1?.stop();
            }
            else {
                this.waterPump1?.run();
            }
        },
        "58": value => {
            if (value == "0") {
                this.waterPump2?.stop();
            }
            else {
                this.waterPump2?.run();
            }
        },
        "59": value => {
            if (value == "0") {
                this.acidPoolWaterInValve?.close();
            }
            else {
                this.acidPoolWaterInValve?.open();
            }
        },
        "60": value => {
            if (value == "0") {
                this.acidBucketMeteringPump?.stop();
            }
            else {
                this.acidBucketMeteringPump?.run();
            }
        },
        "61": value => {
            if (value == "0") {
                this.acidWashPoolMixer?.stop();
            }
            else {
                this.acidWashPoolMixer?.run();
            }
        },
        "62": value => {
            if (value == "0") {
                this.acidWashPoolOutPump1?.stop();
                if (this.acidWashPoolOutPump2?.getState() == "Stop") {
                    this.sprayTowerWaterFall?.stop();
                }
            }
            else {
                this.acidWashPoolOutPump1?.run();
                this.sprayTowerWaterFall?.run();
            }
        },
        "63": value => {
            if (value == "0") {
                this.acidWashPoolOutPump2?.stop();
                if (this.acidWashPoolOutPump1?.getState() == "Stop") {
                    this.sprayTowerWaterFall?.stop();
                }
            }
            else {
                this.acidWashPoolOutPump2?.run();
                this.sprayTowerWaterFall?.run();
            }
        },
        "40001": value => {
            this.acidBucketLevelText?.setValue(value);
        },
        "40002": value => {
            this.acidBucketMeteringPumpText?.setValue(value);
        },
        "40003": value => {
            this.acidWashPoolLevelText?.setValue(value);
        },
    };
}
//# sourceMappingURL=ThreeProject.js.map