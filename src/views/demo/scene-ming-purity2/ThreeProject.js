import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import Floor from "@/three-widget/my/Floor";
import Ultrafiltration from "@/three-widget/my/Ultrafiltration";
import PathUtils from "@/three-widget/PathUtils";
import Pipe from "@/three-widget/my/pipe/Pipe";
import StrokeValve from "@/three-widget/my/pipe/StrokeValve";
import Bucket from "@/three-widget/my/Bucket";
import SpriteRectText from "@/three-widget/my/text/SpriteRectText";
import MeteringPump from "@/three-widget/my/pipe/MeteringPump";
import PipeJoinTee from "@/three-widget/my/pipe/PipeJoinTee";
import Pool from "@/three-widget/my/Pool";
import Pump from "@/three-widget/my/Pump";
import FlowMeter from "@/three-widget/my/pipe/FlowMeter";
import PiezoMeter from "@/three-widget/my/pipe/PiezoMeter";
import Tank from "@/three-widget/my/Tank";
import ThreeCore from "@/three-widget/ThreeCore";
import PipJoin4Way from "@/three-widget/my/pipe/PipeJoin4Way";
import SandTank from "@/three-widget/my/SandTank";
export default class ThreeProject extends ThreeCore {
    orbit;
    /* region 常量区 */
    floorLength = 20000;
    floorWidth = 16000;
    //超滤机位置
    filterLength = 2000;
    filterWidth = 7000;
    filterHeight = 3000;
    filterX = this.floorLength / 2 - 2000;
    filterY = this.filterHeight / 2;
    filterZ = 0;
    //所有到超滤机的管道都在超滤机左侧2米处调节高低, 再连接到超滤机上
    pipeOffsetXOfFilter = 2000;
    //所有排污阀距离地板正Z边缘距离
    drainOffsetZOfFloorMax = 2000;
    //低空管道高度
    lowPipeY = 600;
    //高空管道高度
    highPipeY = 1800;
    //管道直角转弯的圆角半径
    pipeRectRadius = 300;
    //加药桶的半径
    bucketRadius = 600;
    //酸通路起始点X, 即 酸加药桶X
    acidPathStartX = -(this.floorLength / 2 - 1000);
    //酸通路中心Z, 即 酸加药桶Z
    acidPathZ = -(this.floorWidth / 2 - 1000);
    acidMeteringPumpX = this.acidPathStartX + 1000;
    //碱通路起始点X, 即 酸加药桶X
    sodaPathStartX = this.acidPathStartX;
    //碱通路中心Z, 酸通路向z+偏移1.5米
    sodaPathZ = this.acidPathZ + 1500;
    sodaMeteringPumpX = this.sodaPathStartX + 1000;
    //水泵位置, 产水池 原水池 相同
    pumpX = -(this.floorLength / 2 - 4000);
    //产水通路起始点X, 即 产水池X
    purePathStartX = -(this.floorLength / 2 - 1000);
    //Z轴距离碱洗通路5米远
    purePathZ = this.sodaPathZ + 5000;
    //产水池尺寸
    purePoolLength = 1500;
    purePoolWidth = 4000;
    purePoolHeight = 2000;
    //产水池产水通道1
    pureChannel1Z = this.purePathZ - this.purePoolWidth / 4;
    pureChannel2Z = this.purePathZ + this.purePoolWidth / 4;
    //产水池液体颜色(清水 蓝色)
    purePoolLiquidColor = 0x33a3dc;
    //原水通路起始点X, 即 原水池X
    sewageStartX = -(this.floorLength / 2 - 1000);
    //距离原水通路5米远
    sewageZ = this.purePathZ + 6000;
    //原水池尺寸
    sewagePoolLength = 1500;
    sewagePoolWidth = 4000;
    sewagePoolHeight = 2000;
    //原水池
    sewageChannel1Z = this.sewageZ - this.sewagePoolWidth / 2 + this.sewagePoolWidth / 5;
    sewageChannel2Z = this.sewageZ + this.sewagePoolWidth / 5;
    //原水池液体颜色(清水 蓝色)
    sewagePoolLiquidColor = 0xd1c7b7;
    sandTankX = this.pumpX + 5000;
    //气罐
    airTank = null;
    airTankX = 2000;
    airTankZ = -(this.floorWidth / 2 - 1500);
    //超滤气洗主管道
    filterAirWashMainPipe = null;
    filterAirWasPipe = null;
    //超滤气洗阀
    airWashValve = null;
    /* endregion 常量区 */
    /* region three实体区 */
    //超滤器
    filter = null;
    filterUpDrainPipe = null;
    filterDownDrainPipe = null;
    filterUpDrainValve = null;
    filterDownDrainValve = null;
    //酸加药桶
    acidBucket = null;
    //液位显示
    acidBucketLevelText = null;
    //管道1
    acidPathPipe1 = null;
    //计量泵
    acidMeteringPump = null;
    //流量显示
    acidMeteringPumpText = null;
    //碱加药桶
    sodaBucket = null;
    //液位显示
    sodaBucketLevelText = null;
    //管道1
    sodaPathPipe1 = null;
    acidAndSodaCommonPathPipe1 = null;
    //计量泵
    sodaMeteringPump = null;
    //流量显示
    sodaMeteringPumpText = null;
    //产水池(净化水)
    purePool = null;
    //产水池液位显示
    purePoolLevelText = null;
    //反洗泵1
    filterWashChannel1Pump = null;
    //反洗泵2
    filterWashChannel2Pump = null;
    filterWashChannel1LowPipe1 = null;
    filterWashChannel2LowPipe1 = null;
    filterWashChannel1HighPipe1 = null;
    filterWashChannel2HighPipe1 = null;
    washChannel1AndWashChannel2CommonPipe1 = null;
    //产水管道
    pureOutPipe = null;
    //反洗阀
    washValve = null;
    //产水阀
    filterOutValve = null;
    //产水压力表
    filterOutPiezoMeter = null;
    filterOutPiezoMeterText = null;
    //原水池(污水池)
    sewagePool = null;
    //原水池液位显示
    sewagePoolLevelText = null;
    //原水泵1
    sewageChannel1Pump = null;
    //原水泵2
    sewageChannel2Pump = null;
    sewageChannel1LowPipe1 = null;
    sewageChannel2LowPipe1 = null;
    sewageChannel1HighPipe1 = null;
    sewageChannel2HighPipe1 = null;
    sandTankInPipe = null;
    sandTankOutPipe1 = null;
    sandTankWashInPipe = null;
    //原水流量计
    sewageFlowMeter = null;
    sewageFlowMeterText = null;
    //砂罐进水压力表
    sandTankInPiezoMeter = null;
    //砂罐进水压力表显示
    sandTankInPiezoMeterText = null;
    //砂罐出水压力表
    sandTankOutPiezoMeter = null;
    //砂罐出水压力表显示
    sandTankOutPiezoMeterText = null;
    //砂罐进水阀
    sewageSandTankInValve = null;
    //砂罐出水阀
    sankTankOutValve = null;
    //砂罐反洗进水阀
    sandTankWashInValve = null;
    //砂罐上排阀
    sankTankUpDrainValve = null;
    //砂罐下排阀
    sankTankDownDrainValve = null;
    //超滤进水压力表
    filterInPiezoMeter = null;
    //超滤进水压力表显示
    filterInPiezoMeterText = null;
    //超滤进水阀
    filterInValve = null;
    /* endregion three实体区 */
    constructor(dom) {
        super(dom, {
            cameraOptions: {
                fov: 45,
                near: 0.1,
                far: 300000
            }
        });
        this.scene.background = new THREE.Color(0x062469);
        this.camera.position.set(-6000, 10000, 20000);
        const ambientLight = new THREE.AmbientLight(0xffffff, 3);
        this.scene.add(ambientLight);
        const directionalLight1 = new THREE.DirectionalLight(0xffffff, 5);
        directionalLight1.position.set(0, 10000, 20000);
        this.scene.add(directionalLight1);
        const directionalLight2 = new THREE.DirectionalLight(0xffffff, 4);
        directionalLight2.position.set(0, 10000, -20000);
        this.scene.add(directionalLight2);
        this.orbit = new OrbitControls(this.camera, this.renderer.domElement);
        this.addFloor();
        this.addFilter();
        this.addAcidPath();
        this.addSodaPath();
        this.addPurePath();
        this.addSewagePath();
        this.addAirWashPath();
    }
    init() {
    }
    onRenderer() {
        this.orbit.update();
    }
    addFloor() {
        const floor = new Floor("地面", {
            length: this.floorLength,
            width: this.floorWidth,
        });
        //地面下沉1, 减少与地面物体的接触产生闪烁
        floor.position.y = -1;
        this.scene.add(floor);
    }
    addFilter() {
        const filter = new Ultrafiltration("超滤器", {
            length: this.filterLength,
            width: this.filterWidth,
            height: this.filterHeight,
        });
        filter.position.x = this.filterX;
        filter.position.y = this.filterY;
        filter.position.z = this.filterZ;
        this.filter = filter;
        this.scene.add(filter);
        const mainPipeRadius = filter.options.mainPipeRadius;
        const filterBox = filter.getBox();
        //上排
        const upDrainX = filter.position.x;
        const upDrainY = filter.getJoin1MainPipeY() + this.filterHeight / 2;
        const upDrainZ = filterBox.maxZ;
        const upDrainPath1 = new PathUtils();
        upDrainPath1.push([upDrainX, upDrainY, upDrainZ]);
        upDrainPath1.push([upDrainPath1.last.x, upDrainPath1.last.y, this.floorWidth / 2]);
        const upDrainPipe = new Pipe("超滤上排主管道", { points: upDrainPath1.points, radius: mainPipeRadius });
        this.filterUpDrainPipe = upDrainPipe;
        this.scene.add(upDrainPipe);
        const upDrainValve = new StrokeValve("超滤上排阀", {
            horizontalRadius: mainPipeRadius + 40
        });
        upDrainValve.position.x = upDrainX;
        upDrainValve.position.y = upDrainY;
        upDrainValve.position.z = this.floorWidth / 2 - this.drainOffsetZOfFloorMax;
        upDrainValve.rotateY(Math.PI * 0.5);
        this.filterUpDrainValve = upDrainValve;
        this.scene.add(upDrainValve);
        //下排
        const downDrainX = filter.position.x;
        const downDrainY = filter.getJoin4MainPipeY() + this.filterHeight / 2;
        const downDrainZ = filterBox.maxZ;
        const downDrainPath1 = new PathUtils();
        downDrainPath1.push([downDrainX, downDrainY, downDrainZ]);
        downDrainPath1.push([downDrainPath1.last.x, downDrainPath1.last.y, this.floorWidth / 2]);
        const downDrainPipe = new Pipe("超滤下排主管道", { points: downDrainPath1.points, radius: mainPipeRadius });
        this.filterDownDrainPipe = downDrainPipe;
        this.scene.add(downDrainPipe);
        const downDrainValve = new StrokeValve("超滤下排阀", {
            horizontalRadius: mainPipeRadius + 40
        });
        downDrainValve.position.x = downDrainX;
        downDrainValve.position.y = downDrainY;
        downDrainValve.position.z = this.floorWidth / 2 - this.drainOffsetZOfFloorMax;
        downDrainValve.rotateY(Math.PI * 0.5);
        this.filterDownDrainValve = downDrainValve;
        this.scene.add(downDrainValve);
    }
    addAcidPath() {
        //固定此通路 x, z 坐标
        const x = this.acidPathStartX;
        const z = this.acidPathZ;
        // 红色桶
        const bucket = new Bucket("酸加药桶", {
            radius: this.bucketRadius,
            flankColor: 0xed1941,
            topColor: 0xef5b9c,
            bottomColor: 0xef5b9c,
        });
        bucket.position.x = x;
        bucket.position.z = z;
        this.acidBucket = bucket;
        this.scene.add(bucket);
        const bucketBox = bucket.getBox();
        // const st = new SpriteRectText("酸加药桶液位显示", "液位: %s m", " N/A ")
        // st.position.x = bucketBox.centerX
        // st.position.y = bucketBox.maxY + 400
        // st.position.z = bucketBox.minZ
        // this.acidBucketLevelText = st
        // this.scene.add(st)
        const path1 = new PathUtils();
        path1.push([bucketBox.maxX, this.highPipeY, z]);
        //直管, 向右, 此管道比较靠近 x 的0点, 则就统一让所有靠近中间的管道都在0点位置上, 留出拐弯半径
        path1.push([0 - this.pipeRectRadius, path1.last.y, path1.last.z]);
        //转弯, 由右向前
        path1.pushQuarterArc("X2Z1", this.pipeRectRadius);
        //直管, 向前, 到碱通路Z
        path1.push([path1.last.x, path1.last.y, this.sodaPathZ]);
        const pipe1 = new Pipe("酸洗管道1", { points: path1.points });
        this.scene.add(pipe1);
        this.acidPathPipe1 = pipe1;
        const meteringPump = new MeteringPump("酸计量泵");
        meteringPump.position.x = this.acidMeteringPumpX;
        meteringPump.position.y = this.highPipeY;
        meteringPump.position.z = z;
        this.acidMeteringPump = meteringPump;
        this.scene.add(meteringPump);
        const meteringPumpBox = meteringPump.getBox();
        const meteringPumpText = new SpriteRectText("酸计量泵流量显示", "流量: %s m³/h", " N/A ");
        meteringPumpText.position.x = meteringPumpBox.centerX;
        meteringPumpText.position.y = meteringPumpBox.maxY + 200;
        meteringPumpText.position.z = meteringPumpBox.minZ;
        this.acidMeteringPumpText = meteringPumpText;
        this.scene.add(meteringPumpText);
    }
    addSodaPath() {
        //固定此通路 x, z 坐标
        const x = this.sodaPathStartX;
        const z = this.sodaPathZ;
        // 黄色桶
        const bucket = new Bucket("碱加药桶", {
            radius: this.bucketRadius,
            flankColor: 0xCCCC00,
            topColor: 0xFFFF00,
            bottomColor: 0xFFFF00,
        });
        bucket.position.x = x;
        bucket.position.z = z;
        this.sodaBucket = bucket;
        this.scene.add(bucket);
        const bucketBox = bucket.getBox();
        // const st = new SpriteRectText("碱加药桶液位显示", "液位: %s m", " N/A ")
        // st.position.x = bucketBox.centerX
        // st.position.y = bucketBox.maxY + 400
        // st.position.z = bucketBox.minZ
        // this.sodaBucketLevelText = st
        // this.scene.add(st)
        const path1 = new PathUtils();
        path1.push([bucketBox.maxX, this.highPipeY, z]);
        //直管, 向右, 此管道比较靠近 x 的0点, 则就统一让所有靠近中间的管道都在0点位置上
        path1.push([0, path1.last.y, path1.last.z]);
        const pipe1 = new Pipe("碱洗管道1", { points: path1.points });
        this.scene.add(pipe1);
        this.sodaPathPipe1 = pipe1;
        const meteringPump = new MeteringPump("碱计量泵");
        meteringPump.position.x = this.sodaMeteringPumpX;
        meteringPump.position.y = this.highPipeY;
        meteringPump.position.z = z;
        this.sodaMeteringPump = meteringPump;
        this.scene.add(meteringPump);
        const meteringPumpBox = meteringPump.getBox();
        const meteringPumpText = new SpriteRectText("碱计量泵流量显示", "流量: %s m³/h", " N/A ");
        meteringPumpText.position.x = meteringPumpBox.centerX;
        meteringPumpText.position.y = meteringPumpBox.maxY + 200;
        meteringPumpText.position.z = meteringPumpBox.minZ;
        this.sodaMeteringPumpText = meteringPumpText;
        this.scene.add(meteringPumpText);
        const tee = new PipeJoinTee("酸洗碱洗交叉三通");
        tee.position.x = path1.last.x;
        tee.position.y = path1.last.y;
        tee.position.z = z;
        tee.rotateX(Math.PI * 0.5);
        tee.rotateZ(Math.PI * 0.5);
        this.scene.add(tee);
        const path2 = new PathUtils();
        //直管, 向前, 以第一管段的末端为起点, 终点汇入产水池通道1
        path2.push([path1.last.x, path1.last.y, path1.last.z]);
        path2.push([path2.last.x, path2.last.y, this.pureChannel1Z]);
        const acidAndSodaCommonPathPipe1 = new Pipe("酸洗碱洗公共管道1", { points: path2.points });
        this.acidAndSodaCommonPathPipe1 = acidAndSodaCommonPathPipe1;
        this.scene.add(acidAndSodaCommonPathPipe1);
    }
    // 产水池通路
    addPurePath() {
        //固定此通路 x, z 坐标
        const x = this.purePathStartX;
        const z = this.purePathZ;
        const pipeRectRadius = this.pipeRectRadius;
        //水泵位置
        const pumpX = this.pumpX;
        //三通位置
        const highTeeX = this.pumpX + 2000;
        //产水池 液体颜色(清水 蓝色)
        const liquidColor = this.purePoolLiquidColor;
        const pool = new Pool("产水池", {
            width: this.purePoolWidth,
            height: this.purePoolHeight,
            length: this.purePoolLength,
            liquidColor,
        });
        pool.position.x = x;
        pool.position.z = z;
        this.purePool = pool;
        this.scene.add(pool);
        const poolBox = pool.getBox();
        const st = new SpriteRectText("产水池液位显示", "液位: %s m", " N/A ");
        st.position.x = poolBox.centerX;
        st.position.y = poolBox.maxY + 300;
        st.position.z = poolBox.minZ;
        this.purePoolLevelText = st;
        this.scene.add(st);
        const channel1Pump = new Pump("超滤反洗泵1");
        channel1Pump.position.x = pumpX;
        channel1Pump.position.z = this.pureChannel1Z;
        this.filterWashChannel1Pump = channel1Pump;
        this.scene.add(channel1Pump);
        //todo
        channel1Pump.run();
        const channel2Pump = new Pump("超滤反洗泵2");
        channel2Pump.position.x = pumpX;
        channel2Pump.position.z = this.pureChannel2Z;
        this.filterWashChannel2Pump = channel2Pump;
        this.scene.add(channel2Pump);
        //todo
        channel2Pump.run();
        const channel1PumpBox = channel1Pump.getBox();
        const c1p1 = new PathUtils();
        c1p1.push([poolBox.maxX, this.lowPipeY, this.pureChannel1Z]);
        //直管, 向右, 终点为水泵最小X
        c1p1.push([channel1PumpBox.minX, c1p1.last.y, c1p1.last.z]);
        const channel1LowPipe1 = new Pipe("超滤反洗1低空管道1", { points: c1p1.points });
        this.scene.add(channel1LowPipe1);
        this.filterWashChannel1LowPipe1 = channel1LowPipe1;
        const c1p2 = new PathUtils();
        //起点x 为水泵出口处
        c1p2.push([channel1PumpBox.maxX - channel1Pump.outJoinOffsetXOfMaxX, channel1PumpBox.maxY, this.pureChannel1Z]);
        //直管, 向上, 到达高度管道, 留出拐弯半径
        c1p2.push([c1p2.last.x, this.highPipeY - pipeRectRadius, c1p2.last.z]);
        //转弯, 由下向右
        c1p2.pushQuarterArc("Y2X1", pipeRectRadius);
        //直管, 向右到与channel2交汇位置
        c1p2.push([highTeeX, c1p2.last.y, c1p2.last.z]);
        const channel1HighPipe1 = new Pipe("超滤反洗2高空管道1", { points: c1p2.points });
        this.scene.add(channel1HighPipe1);
        this.filterWashChannel1HighPipe1 = channel1HighPipe1;
        const c2p1 = new PathUtils();
        c2p1.push([poolBox.maxX, this.lowPipeY, this.pureChannel2Z]);
        //直管, 向右, 终点为水泵最小X
        c2p1.push([channel1PumpBox.minX, c2p1.last.y, c2p1.last.z]);
        const channel2LowPipe1 = new Pipe("超滤反洗2低空管道1", { points: c2p1.points });
        this.scene.add(channel2LowPipe1);
        this.filterWashChannel2LowPipe1 = channel2LowPipe1;
        const c2p2 = new PathUtils();
        //起点x 为水泵出口处, x y 和channel1相同
        c2p2.push([channel1PumpBox.maxX - channel1Pump.outJoinOffsetXOfMaxX, channel1PumpBox.maxY, this.pureChannel2Z]);
        //直管, 向上, 到达高度管道, 留出拐弯半径
        c2p2.push([c2p2.last.x, this.highPipeY - pipeRectRadius, c2p2.last.z]);
        //转弯, 由下向右
        c2p2.pushQuarterArc("Y2X1", pipeRectRadius);
        //直管, 向右, 到与channel1交汇位置, 留出拐弯半径
        c2p2.push([highTeeX - pipeRectRadius, c2p2.last.y, c2p2.last.z]);
        //转弯, 由左向后
        c2p2.pushQuarterArc("X2Z2", pipeRectRadius);
        //直管, 向后, 汇入channel1
        c2p2.push([c2p2.last.x, c2p2.last.y, this.pureChannel1Z]);
        const channel2HighPipe1 = new Pipe("超滤反洗2高空管道1", { points: c2p2.points });
        this.scene.add(channel2HighPipe1);
        this.filterWashChannel2HighPipe1 = channel2HighPipe1;
        const tee = new PipeJoinTee("超滤反洗1与超滤反洗2高空交叉三通");
        tee.position.x = c1p2.last.x;
        tee.position.y = this.highPipeY;
        tee.position.z = this.pureChannel1Z;
        tee.rotateX(Math.PI * 0.5);
        this.scene.add(tee);
        const filterBox = this.filter.getBox();
        const c1c2p1 = new PathUtils();
        //起点x 为水泵出口处, x y 和channel1相同
        c1c2p1.push([c1p2.last.x, c1p2.last.y, c1p2.last.z]);
        //直管, 向右, 到达超滤机前调整管道高度
        c1c2p1.push([filterBox.minX - this.pipeOffsetXOfFilter - pipeRectRadius, c1p2.last.y, c1p2.last.z]);
        //转弯, 由左向下
        c1c2p1.pushQuarterArc("X2Y2", pipeRectRadius);
        //直管, 向下, 到达超滤机下方主管道高度, 留出转弯半径
        c1c2p1.push([c1c2p1.last.x, this.filter.getJoin4MainPipeY() + this.filterHeight / 2 + pipeRectRadius, c1c2p1.last.z]);
        //转弯, 由下向后
        c1c2p1.pushQuarterArc("Y1Z2", pipeRectRadius);
        //直管, 向后, 到达超滤机后方0.5米, 留出转弯半径
        c1c2p1.push([c1c2p1.last.x, c1c2p1.last.y, filterBox.minZ - 500 + pipeRectRadius]);
        //转弯, 由前向右
        c1c2p1.pushQuarterArc("Z1X1", pipeRectRadius);
        //直管, 向右, 到达超滤机调整管道高度
        c1c2p1.push([filterBox.minX - pipeRectRadius, c1c2p1.last.y, c1c2p1.last.z]);
        //转弯, 由左向上
        c1c2p1.pushQuarterArc("X2Y1", pipeRectRadius);
        //直管, 向上, 到达超滤机上方主管道
        c1c2p1.push([c1c2p1.last.x, this.filter.getJoin1MainPipeY() + this.filterHeight / 2 - pipeRectRadius, c1c2p1.last.z]);
        //转弯, 由下向右
        c1c2p1.pushQuarterArc("Y2X1", pipeRectRadius);
        //直管, 向右, 到达超滤机上高主管道
        c1c2p1.push([this.filter.position.x - pipeRectRadius, c1c2p1.last.y, c1c2p1.last.z]);
        //转弯, 由左向前
        c1c2p1.pushQuarterArc("X2Z1", pipeRectRadius);
        //直管, 连接到超滤机上
        c1c2p1.push([c1c2p1.last.x, c1c2p1.last.y, filterBox.maxZ]);
        const c1c2Pipe1 = new Pipe("超滤反洗1与超滤反洗2公共管道1", {
            points: c1c2p1.points,
            tubularSegments: 256
        });
        this.scene.add(c1c2Pipe1);
        this.washChannel1AndWashChannel2CommonPipe1 = c1c2Pipe1;
        const pureOutPath = new PathUtils();
        //起点 超滤机中部上方主管道, 偏向里1.5米(离反洗管道1米)
        pureOutPath.push([this.filter.position.x, this.filter.getJoin2MainPipeY() + this.filterHeight / 2, filterBox.minZ]);
        pureOutPath.push([pureOutPath.last.x, pureOutPath.last.y, filterBox.minZ - 1500 + pipeRectRadius]);
        pureOutPath.pushQuarterArc("Z1X2", pipeRectRadius);
        //直管, 向左, 到达超滤机前调整管道高度的地方, 再减1米(离反洗管道1米), 留出转弯半径
        pureOutPath.push([filterBox.minX - this.pipeOffsetXOfFilter - 1000 + pipeRectRadius, pureOutPath.last.y, pureOutPath.last.z]);
        //转弯, 由右向下
        pureOutPath.pushQuarterArc("X1Y2", pipeRectRadius);
        //直管, 向下, 到达超滤机下方主管道高度, 留出转弯半径
        pureOutPath.push([pureOutPath.last.x, this.filter.getJoin4MainPipeY() + this.filterHeight / 2 + pipeRectRadius, pureOutPath.last.z]);
        //转弯, 由上向前
        pureOutPath.pushQuarterArc("Y1Z1", pipeRectRadius);
        //直管, 向前, 到达产水池后0.5米, 留出转弯半径
        const purePoolBox = this.purePool.getBox();
        pureOutPath.push([pureOutPath.last.x, pureOutPath.last.y, purePoolBox.minZ - 500 - pipeRectRadius]);
        //转弯, 由后向左
        pureOutPath.pushQuarterArc("Z2X2", pipeRectRadius);
        //直管, 向左, 到达产水池, 留出转弯半径
        pureOutPath.push([this.purePathStartX + pipeRectRadius, pureOutPath.last.y, pureOutPath.last.z]);
        //转弯, 由左向上
        pureOutPath.pushQuarterArc("X1Y1", pipeRectRadius);
        //直管, 向上, 到达产水池顶部-200, 要减去两个拐弯半径
        pureOutPath.push([pureOutPath.last.x, this.purePoolHeight - 200 - pipeRectRadius, pureOutPath.last.z]);
        //转弯, 由下向前
        pureOutPath.pushQuarterArc("Y2Z1", pipeRectRadius);
        //直管, 向前, 到达产水池
        pureOutPath.push([pureOutPath.last.x, pureOutPath.last.y, this.purePathZ - this.purePoolWidth / 2]);
        const pureOutPipe = new Pipe("产水管道", { points: pureOutPath.points, tubularSegments: 256 });
        this.scene.add(pureOutPipe);
        this.pureOutPipe = pureOutPipe;
        const filterOutValve = new StrokeValve("超滤出水阀");
        filterOutValve.position.x = filterBox.minX - 2000;
        filterOutValve.position.y = this.filter.getJoin2MainPipeY() + this.filterHeight / 2;
        filterOutValve.position.z = filterBox.minZ - 1500;
        this.filterOutValve = filterOutValve;
        this.scene.add(filterOutValve);
        const filterOutPiezoMeter = new PiezoMeter("超滤出水压力表");
        filterOutPiezoMeter.position.x = filterBox.minX - 600;
        filterOutPiezoMeter.position.y = this.filter.getJoin2MainPipeY() + this.filterHeight / 2;
        filterOutPiezoMeter.position.z = filterBox.minZ - 1500;
        this.filterOutPiezoMeter = filterOutPiezoMeter;
        this.scene.add(filterOutPiezoMeter);
        const filterOutPiezoMeterText = new SpriteRectText("超滤出水压力表显示", "压力: %s bar", " N/A ");
        filterOutPiezoMeterText.position.x = filterOutPiezoMeter.position.x;
        filterOutPiezoMeterText.position.y = filterOutPiezoMeter.position.y + 1050;
        filterOutPiezoMeterText.position.z = filterOutPiezoMeter.position.z;
        this.filterOutPiezoMeterText = filterOutPiezoMeterText;
        this.scene.add(filterOutPiezoMeterText);
    }
    //原水池通路
    addSewagePath() {
        //固定此通路 x, z 坐标
        const x = this.sewageStartX;
        const z = this.sewageZ;
        //水泵位置
        const pumpX = this.pumpX;
        //三通位置
        const highTeeX = this.pumpX + 2000;
        //原水池 液体颜色(污水 灰色)
        const liquidColor = this.sewagePoolLiquidColor;
        const pool = new Pool("原水池", {
            width: this.sewagePoolWidth,
            height: this.sewagePoolHeight,
            length: this.sewagePoolLength,
            liquidColor,
        });
        pool.position.x = x;
        pool.position.z = z;
        this.sewagePool = pool;
        this.scene.add(pool);
        const poolBox = pool.getBox();
        const st = new SpriteRectText("原水池液位显示", "液位: %s m", " N/A ");
        st.position.x = poolBox.centerX;
        st.position.y = poolBox.maxY + 300;
        st.position.z = poolBox.minZ;
        this.sewagePoolLevelText = st;
        this.scene.add(st);
        //原水1
        const channel1Z = this.sewageChannel1Z;
        //原水2
        const channel2Z = this.sewageChannel2Z;
        const channel1Pump = new Pump("原水泵1");
        channel1Pump.position.x = pumpX;
        channel1Pump.position.z = channel1Z;
        this.sewageChannel1Pump = channel1Pump;
        this.scene.add(channel1Pump);
        const channel2Pump = new Pump("原水泵2");
        channel2Pump.position.x = pumpX;
        channel2Pump.position.z = channel2Z;
        this.sewageChannel2Pump = channel2Pump;
        this.scene.add(channel2Pump);
        const pumpBox = channel1Pump.getBox();
        const channel1LowPath1 = new PathUtils();
        channel1LowPath1.push([poolBox.maxX, this.lowPipeY, channel1Z]);
        //直管, 向右, 终点为水泵最小X
        channel1LowPath1.push([pumpBox.minX, channel1LowPath1.last.y, channel1LowPath1.last.z]);
        const Channel1LowPipe1 = new Pipe("原水1低空管道1", { points: channel1LowPath1.points });
        this.scene.add(Channel1LowPipe1);
        this.sewageChannel1LowPipe1 = Channel1LowPipe1;
        const channel1HighPath1 = new PathUtils();
        //起点x 为水泵出口处
        channel1HighPath1.push([pumpBox.maxX - channel1Pump.outJoinOffsetXOfMaxX, pumpBox.maxY, channel1Z]);
        //直管, 向上, 到达高度管道, 留出拐弯半径
        channel1HighPath1.push([channel1HighPath1.last.x, this.highPipeY - this.pipeRectRadius, channel1HighPath1.last.z]);
        //转弯, 由下向右
        channel1HighPath1.pushQuarterArc("Y2X1", this.pipeRectRadius);
        //直管, 向右到与channel交汇位置
        channel1HighPath1.push([highTeeX, channel1HighPath1.last.y, channel1HighPath1.last.z]);
        const channel1HighPipe1 = new Pipe("原水1高空管道1", { points: channel1HighPath1.points });
        this.scene.add(channel1HighPipe1);
        this.sewageChannel1HighPipe1 = channel1HighPipe1;
        const channel2LowPath1 = new PathUtils();
        channel2LowPath1.push([poolBox.maxX, this.lowPipeY, channel2Z]);
        //直管, 向右, 终点为水泵最小X
        channel2LowPath1.push([pumpBox.minX, channel2LowPath1.last.y, channel2LowPath1.last.z]);
        const channel2LowPipe1 = new Pipe("原水2低空管道1", { points: channel2LowPath1.points });
        this.scene.add(channel2LowPipe1);
        this.sewageChannel2LowPipe1 = channel2LowPipe1;
        const channel2HighPath1 = new PathUtils();
        //起点x 为水泵出口处, x y 和channel1相同
        channel2HighPath1.push([pumpBox.maxX - channel1Pump.outJoinOffsetXOfMaxX, pumpBox.maxY, channel2Z]);
        //直管, 向上, 到达高度管道, 留出拐弯半径
        channel2HighPath1.push([channel2HighPath1.last.x, this.highPipeY - this.pipeRectRadius, channel2HighPath1.last.z]);
        //转弯, 由下向右
        channel2HighPath1.pushQuarterArc("Y2X1", this.pipeRectRadius);
        //直管, 向右, 到与channel1交汇位置, 留出拐弯半径
        channel2HighPath1.push([highTeeX - this.pipeRectRadius, channel2HighPath1.last.y, channel2HighPath1.last.z]);
        //转弯, 由左向后
        channel2HighPath1.pushQuarterArc("X2Z2", this.pipeRectRadius);
        //直管, 向后, 汇入channel1
        channel2HighPath1.push([channel2HighPath1.last.x, channel2HighPath1.last.y, channel1Z]);
        const channel2HighPipe1 = new Pipe("原水2高空管道1", { points: channel2HighPath1.points });
        this.scene.add(channel2HighPipe1);
        this.sewageChannel2HighPipe1 = channel2HighPipe1;
        // const channel2ToChannel1Tee = new PipeJoinTee("原水1与原水2交叉三通")
        // channel2ToChannel1Tee.position.x = channel1HighPath1.last.x
        // channel2ToChannel1Tee.position.y = this.highPipeY
        // channel2ToChannel1Tee.position.z = channel1Z
        // channel2ToChannel1Tee.rotateX(Math.PI * 0.5)
        // this.scene.add(channel2ToChannel1Tee)
        const join4Way = new PipJoin4Way("四通");
        join4Way.position.x = channel1HighPath1.last.x;
        join4Way.position.y = this.highPipeY;
        join4Way.position.z = channel1Z;
        this.scene.add(join4Way);
        const sandTank = new SandTank("砂罐");
        //砂罐的z = 通道1的z - 砂罐接头在z上的距离
        sandTank.position.x = this.sandTankX;
        sandTank.position.z = this.sewageChannel1Z - sandTank.joinsPosition.inJoinPosition.z;
        this.scene.add(sandTank);
        const sandTankUpOutPath = new PathUtils();
        sandTankUpOutPath.push([
            sandTank.position.x + sandTank.joinsPosition.washUpDrainJoinPosition.x,
            sandTank.joinsPosition.washUpDrainJoinPosition.y,
            this.sewageChannel1Z,
        ]);
        sandTankUpOutPath.push([
            //sandTankUpOutPath.last.x + 100,
            //比较靠近x轴0点, 则统一使用0点, 留出拐弯半径
            0 - this.pipeRectRadius,
            sandTankUpOutPath.last.y,
            sandTankUpOutPath.last.z
        ]);
        //转弯, 由左向前
        sandTankUpOutPath.pushQuarterArc("X2Z1", this.pipeRectRadius);
        sandTankUpOutPath.push([
            sandTankUpOutPath.last.x,
            sandTankUpOutPath.last.y,
            this.floorWidth / 2
        ]);
        const sandTankUpOutPipe = new Pipe("砂罐上排管道", { points: sandTankUpOutPath.points });
        this.scene.add(sandTankUpOutPipe);
        const upDrainValve = new StrokeValve("砂罐上排阀");
        upDrainValve.position.x = sandTankUpOutPath.last.x;
        upDrainValve.position.y = sandTankUpOutPath.last.y;
        upDrainValve.position.z = this.floorWidth / 2 - this.drainOffsetZOfFloorMax;
        upDrainValve.rotateY(Math.PI * 0.5);
        this.sankTankUpDrainValve = upDrainValve;
        this.scene.add(upDrainValve);
        const sandTankDownOutPath = new PathUtils();
        sandTankDownOutPath.push([
            sandTank.position.x + sandTank.joinsPosition.washDownDrainJoinPosition.x,
            sandTank.joinsPosition.washDownDrainJoinPosition.y,
            this.sewageChannel1Z,
        ]);
        sandTankDownOutPath.push([
            //sandTankDownOutPath.last.x + 100,
            //比较靠近x轴0点, 则统一使用0点, 留出拐弯半径
            0 - this.pipeRectRadius,
            sandTankDownOutPath.last.y,
            sandTankDownOutPath.last.z
        ]);
        //转弯, 由左向前
        sandTankDownOutPath.pushQuarterArc("X2Z1", this.pipeRectRadius);
        sandTankDownOutPath.push([
            sandTankDownOutPath.last.x,
            sandTankDownOutPath.last.y,
            this.floorWidth / 2
        ]);
        const sandTankDownOutPipe = new Pipe("砂罐下排管道", { points: sandTankDownOutPath.points });
        this.scene.add(sandTankDownOutPipe);
        const downDrainValve = new StrokeValve("砂罐下排阀");
        downDrainValve.position.x = sandTankDownOutPath.last.x;
        downDrainValve.position.y = sandTankDownOutPath.last.y;
        downDrainValve.position.z = this.floorWidth / 2 - this.drainOffsetZOfFloorMax;
        downDrainValve.rotateY(Math.PI * 0.5);
        this.sankTankDownDrainValve = downDrainValve;
        this.scene.add(downDrainValve);
        const sandTankInPath = new PathUtils();
        sandTankInPath.push([join4Way.position.x, join4Way.position.y, join4Way.position.z]);
        sandTankInPath.push([sandTankInPath.last.x, sandTank.joinsPosition.inJoinPosition.y - this.pipeRectRadius, sandTankInPath.last.z]);
        //转弯, 由下向右
        sandTankInPath.pushQuarterArc("Y2X1", this.pipeRectRadius);
        sandTankInPath.push([this.sandTankX + sandTank.joinsPosition.inJoinPosition.x, sandTankInPath.last.y, sandTankInPath.last.z]);
        const sandTankInPipe = new Pipe("砂罐进水管道", { points: sandTankInPath.points });
        this.scene.add(sandTankInPipe);
        this.sandTankInPipe = sandTankInPipe;
        const sandTankInPiezoMeter = new PiezoMeter("砂罐进水压力表");
        sandTankInPiezoMeter.position.x = sandTank.position.x + sandTank.joinsPosition.inJoinPosition.x - 2000;
        sandTankInPiezoMeter.position.y = sandTank.joinsPosition.inJoinPosition.y;
        sandTankInPiezoMeter.position.z = channel1Z;
        this.scene.add(sandTankInPiezoMeter);
        this.sandTankInPiezoMeter = sandTankInPiezoMeter;
        const sandTankInPiezoMeterText = new SpriteRectText("砂罐进水压力表显示", "压力: %s bar", " N/A ");
        sandTankInPiezoMeterText.position.x = sandTankInPiezoMeter.position.x;
        sandTankInPiezoMeterText.position.y = sandTankInPiezoMeter.position.y + 1050;
        sandTankInPiezoMeterText.position.z = sandTankInPiezoMeter.position.z;
        this.sandTankInPiezoMeterText = sandTankInPiezoMeterText;
        this.scene.add(sandTankInPiezoMeterText);
        const sewageSandTankInValve = new StrokeValve("砂罐进水阀");
        sewageSandTankInValve.position.x = sandTank.position.x + sandTank.joinsPosition.inJoinPosition.x - 1000;
        sewageSandTankInValve.position.y = sandTank.joinsPosition.inJoinPosition.y;
        sewageSandTankInValve.position.z = channel1Z;
        this.scene.add(sewageSandTankInValve);
        this.sewageSandTankInValve = sewageSandTankInValve;
        const sandTankWashInPath = new PathUtils();
        sandTankWashInPath.push([join4Way.position.x, join4Way.position.y, join4Way.position.z]);
        sandTankWashInPath.push([sandTankWashInPath.last.x, sandTank.joinsPosition.washInJoinPosition.y + this.pipeRectRadius, sandTankWashInPath.last.z]);
        //转弯, 由下向右
        sandTankWashInPath.pushQuarterArc("Y1X1", this.pipeRectRadius);
        sandTankWashInPath.push([this.sandTankX + sandTank.joinsPosition.inJoinPosition.x, sandTankWashInPath.last.y, sandTankWashInPath.last.z]);
        const sandTankWashInPipe = new Pipe("砂罐反洗进水管道", { points: sandTankWashInPath.points });
        this.scene.add(sandTankWashInPipe);
        this.sandTankWashInPipe = sandTankWashInPipe;
        const sewageSandTankWashInValve = new StrokeValve("砂罐反洗进水阀");
        sewageSandTankWashInValve.position.x = sandTank.position.x + sandTank.joinsPosition.washInJoinPosition.x - 1000;
        sewageSandTankWashInValve.position.y = sandTank.joinsPosition.washInJoinPosition.y;
        sewageSandTankWashInValve.position.z = channel1Z;
        this.scene.add(sewageSandTankWashInValve);
        this.sandTankWashInValve = sewageSandTankWashInValve;
        const filterBox = this.filter.getBox();
        const sandTankOutPipeStartX = sandTank.position.x + sandTank.joinsPosition.outJoinPosition.x;
        const sandTankOutPipeY = sandTank.joinsPosition.outJoinPosition.y;
        const sandTankOutPath1 = new PathUtils();
        //以砂罐出水点为起来
        sandTankOutPath1.push([sandTankOutPipeStartX, sandTankOutPipeY, channel1Z]);
        //直管, 向右, 到达超滤机前调整管道高度
        sandTankOutPath1.push([filterBox.minX - this.pipeOffsetXOfFilter - this.pipeRectRadius, sandTankOutPath1.last.y, sandTankOutPath1.last.z]);
        //转弯, 由左向下
        sandTankOutPath1.pushQuarterArc("X2Y2", this.pipeRectRadius);
        //直管, 向下, 到达超滤机下方主管道高度, 留出转弯半径
        sandTankOutPath1.push([sandTankOutPath1.last.x, this.filter.getJoin4MainPipeY() + this.filterHeight / 2 + this.pipeRectRadius, sandTankOutPath1.last.z]);
        //转弯, 由下向右
        sandTankOutPath1.pushQuarterArc("Y1X1", this.pipeRectRadius);
        //直管, 向右, 到达超滤机下方主管道
        sandTankOutPath1.push([this.filterX, sandTankOutPath1.last.y, sandTankOutPath1.last.z]);
        const sandTankOutPipe1 = new Pipe("砂罐出水管道1", {
            points: sandTankOutPath1.points,
            tubularSegments: 256
        });
        this.scene.add(sandTankOutPipe1);
        this.sandTankOutPipe1 = sandTankOutPipe1;
        const sandTankOutPiezoMeter = new PiezoMeter("砂罐出水压力表");
        sandTankOutPiezoMeter.position.x = sandTankOutPipeStartX + 2000;
        sandTankOutPiezoMeter.position.y = sandTankOutPipeY;
        sandTankOutPiezoMeter.position.z = channel1Z;
        this.scene.add(sandTankOutPiezoMeter);
        this.sandTankOutPiezoMeter = sandTankOutPiezoMeter;
        const sandTankOutPiezoMeterText = new SpriteRectText("砂罐出水压力表显示", "压力: %s bar", " N/A ");
        sandTankOutPiezoMeterText.position.x = sandTankOutPiezoMeter.position.x;
        sandTankOutPiezoMeterText.position.y = sandTankOutPiezoMeter.position.y + 1050;
        sandTankOutPiezoMeterText.position.z = sandTankOutPiezoMeter.position.z;
        this.sandTankOutPiezoMeterText = sandTankOutPiezoMeterText;
        this.scene.add(sandTankOutPiezoMeterText);
        const sankTankOutValve = new StrokeValve("砂罐出水阀");
        sankTankOutValve.position.x = sandTankOutPipeStartX + 3000;
        sankTankOutValve.position.y = sandTankOutPipeY;
        sankTankOutValve.position.z = channel1Z;
        this.scene.add(sankTankOutValve);
        this.sankTankOutValve = sankTankOutValve;
        const sewageFlowMeter = new FlowMeter("原水流量计");
        sewageFlowMeter.position.x = sandTankOutPipeStartX + 4500;
        sewageFlowMeter.position.y = sandTankOutPipeY;
        sewageFlowMeter.position.z = channel1Z;
        this.scene.add(sewageFlowMeter);
        this.sewageFlowMeter = sewageFlowMeter;
        const sewageFlowMeterText = new SpriteRectText("原水流量计显示", "流量: %s m³/h", " N/A ");
        sewageFlowMeterText.position.x = sewageFlowMeter.position.x;
        sewageFlowMeterText.position.y = sewageFlowMeter.position.y + 1050;
        sewageFlowMeterText.position.z = sewageFlowMeter.position.z;
        this.sewageFlowMeterText = sewageFlowMeterText;
        this.scene.add(sewageFlowMeterText);
        const filterInPiezoMeter = new PiezoMeter("超滤进水压力表");
        filterInPiezoMeter.position.x = this.filter.position.x - 2000;
        filterInPiezoMeter.position.y = this.filter.getJoin4MainPipeY() + this.filterHeight / 2;
        filterInPiezoMeter.position.z = channel1Z;
        this.scene.add(filterInPiezoMeter);
        this.filterInPiezoMeter = filterInPiezoMeter;
        const filterInPiezoMeterText = new SpriteRectText("超滤进水压力表显示", "压力: %s bar", " N/A ");
        filterInPiezoMeterText.position.x = filterInPiezoMeter.position.x;
        filterInPiezoMeterText.position.y = filterInPiezoMeter.position.y + 1050;
        filterInPiezoMeterText.position.z = filterInPiezoMeter.position.z;
        this.filterInPiezoMeterText = filterInPiezoMeterText;
        this.scene.add(filterInPiezoMeterText);
        const filterInValve = new StrokeValve("超滤进水阀");
        filterInValve.position.x = this.filter.position.x - 1000;
        filterInValve.position.y = this.filter.getJoin4MainPipeY() + this.filterHeight / 2;
        filterInValve.position.z = channel1Z;
        this.filterInValve = filterInValve;
        this.scene.add(filterInValve);
    }
    addAirWashPath() {
        const tank = new Tank("储气罐");
        tank.position.x = this.airTankX;
        tank.position.z = this.airTankZ;
        this.airTank = tank;
        this.scene.add(tank);
        const filterBox = this.filter.getBox();
        const pipeY = this.filter.getJoin4MainPipeY() + this.filterHeight / 2;
        const aitWashPath = new PathUtils();
        aitWashPath.push([tank.position.x, tank.joinY, tank.position.z]);
        aitWashPath.push([aitWashPath.last.x, pipeY + this.pipeRectRadius, aitWashPath.last.z]);
        //转弯, 由上向右
        aitWashPath.pushQuarterArc("Y1X1", this.pipeRectRadius);
        //直管, 向右, 到超滤机下方主管道
        aitWashPath.push([this.filterX - this.pipeRectRadius, aitWashPath.last.y, aitWashPath.last.z]);
        //转弯, 由左向前
        aitWashPath.pushQuarterArc("X2Z1", this.pipeRectRadius);
        //直管, 向前, 到超滤机
        aitWashPath.push([aitWashPath.last.x, aitWashPath.last.y, filterBox.minZ]);
        const filterAirWasPipe = new Pipe("超滤气洗管道", { points: aitWashPath.points });
        this.filterAirWasPipe = filterAirWasPipe;
        this.scene.add(filterAirWasPipe);
        //气洗阀
        const airWashValve = new StrokeValve("超滤下排阀");
        //位置改到气罐后面, 在全景下更容易看到
        airWashValve.position.x = this.airTankX + 3000;
        airWashValve.position.y = pipeY;
        airWashValve.position.z = this.airTankZ;
        this.airWashValve = airWashValve;
        this.scene.add(airWashValve);
    }
    points = {
        "1": value => {
            console.log("砂罐进水阀开 = ", value);
            // if (value == "0") {
            //     this.acidMeteringPump?.stop()
            // } else {
            //     this.acidMeteringPump?.run()
            // }
        },
        "2": value => {
            console.log("砂罐进水阀关 = ", value);
        },
        "3": value => {
            console.log("砂罐出水阀开 = ", value);
        },
        "4": value => {
            console.log("砂罐出水阀关 = ", value);
        },
        "5": value => {
            console.log("砂罐反洗阀开 = ", value);
        },
        "6": value => {
            console.log("砂罐反洗阀关 = ", value);
        },
        "7": value => {
            console.log("砂罐上排阀开 = ", value);
        },
        "8": value => {
            console.log("砂罐上排阀关 = ", value);
        },
        "9": value => {
            console.log("砂罐下排阀开 = ", value);
        },
        "10": value => {
            console.log("砂罐下排阀关 = ", value);
        },
        "11": value => {
            console.log("超滤进水阀开 = ", value);
        },
        "12": value => {
            console.log("超滤进水阀关 = ", value);
        },
        "13": value => {
            console.log("超滤出水阀开 = ", value);
        },
        "14": value => {
            console.log("超滤出水阀关 = ", value);
        },
        "15": value => {
            console.log("超滤出水洗阀开 = ", value);
        },
        "16": value => {
            console.log("超滤出水洗阀关 = ", value);
        },
        "57": value => {
            console.log("云端运行信号 = ", value);
        },
        "58": value => {
            console.log("云端停止信号 = ", value);
        },
        "59": value => {
            console.log("云端一键启动 = ", value);
        },
        "60": value => {
            console.log("云端一键停止 = ", value);
        },
        "61": value => {
            console.log("云端砂罐系统复位 = ", value);
        },
        "62": value => {
            console.log("云端超滤系统复位 = ", value);
        },
        "63": value => {
            console.log("云端故障解除 = ", value);
        },
        "65": value => {
            console.log("超滤上排阀开 = ", value);
        },
        "66": value => {
            console.log("超滤上排阀关 = ", value);
        },
        "67": value => {
            console.log("超滤下排阀开 = ", value);
        },
        "68": value => {
            console.log("超滤下排阀关 = ", value);
        },
        "69": value => {
            console.log("超滤气洗阀关 = ", value);
        },
        "70": value => {
            console.log("超滤气洗阀关 = ", value);
        },
        "71": value => {
            //console.log("原水泵1 = ", value)
            if (value == "0") {
                this.sewageChannel1Pump?.stop();
            }
            else {
                this.sewageChannel1Pump?.run();
            }
        },
        "72": value => {
            if (value == "0") {
                this.sewageChannel2Pump?.stop();
            }
            else {
                this.sewageChannel2Pump?.run();
            }
        },
        "73": value => {
            console.log("变频器开 = ", value);
        },
        "74": value => {
            if (value == "0") {
                this.filterWashChannel1Pump?.stop();
            }
            else {
                this.filterWashChannel1Pump?.run();
            }
        },
        "75": value => {
            if (value == "0") {
                this.filterWashChannel2Pump?.stop();
            }
            else {
                this.filterWashChannel2Pump?.run();
            }
        },
        "76": value => {
            console.log("化学清洗泵 = ", value);
        },
        "77": value => {
            if (value == "0") {
                this.acidMeteringPump?.stop();
            }
            else {
                this.acidMeteringPump?.run();
            }
        },
        "78": value => {
            if (value == "0") {
                this.sodaMeteringPump?.stop();
            }
            else {
                this.sodaMeteringPump?.run();
            }
        },
        "79": value => {
            console.log("故障报警 = ", value);
        },
        "40001": value => {
            this.sewagePoolLevelText?.setValue(value);
        },
        "40003": value => {
            this.purePoolLevelText?.setValue(value);
        },
        "40005": value => {
            this.sandTankInPiezoMeterText?.setValue(value);
        },
        "40007": value => {
            this.sandTankOutPiezoMeterText?.setValue(value);
        },
        "40009": value => {
            this.filterInPiezoMeterText?.setValue(value);
        },
        "40011": value => {
            this.filterOutPiezoMeterText?.setValue(value);
        },
        "40013": value => {
            this.sewageFlowMeterText?.setValue(value);
        },
        "40022": value => {
            console.log("砂罐压差 = ", value);
            //this.purePoolLevelText?.setValue(value)
        },
        "40024": value => {
            console.log("超滤压差 = ", value);
            //this.purePoolLevelText?.setValue(value)
        },
        "40036": value => {
            console.log("砂罐进水阀状态 = ", value);
        },
        "40037": value => {
            console.log("砂罐进水阀状态 = ", value);
        },
        "40038": value => {
            console.log("砂罐进水阀状态 = ", value);
        },
        "40039": value => {
            console.log("砂罐上排阀状态 = ", value);
        },
        "40040": value => {
            console.log("砂罐下排阀状态 = ", value);
        },
        "40041": value => {
            console.log("超滤进水阀状态 = ", value);
        },
        "40042": value => {
            console.log("超滤出水阀状态 = ", value);
        },
        "40043": value => {
            console.log("超滤反洗阀状态 = ", value);
        },
        "40044": value => {
            console.log("超滤上排阀状态 = ", value);
        },
        "40045": value => {
            console.log("超滤下排阀状态 = ", value);
        },
        "40046": value => {
            console.log("超滤进气洗阀状态 = ", value);
        },
        "40049": value => {
            console.log("瞬时流量 = ", value);
        },
        "40051": value => {
            console.log("累计流量 = ", value);
        },
        "40053": value => {
            console.log("频率 = ", value);
        },
    };
}
//# sourceMappingURL=ThreeProject.js.map