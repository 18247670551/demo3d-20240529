import * as THREE from "three"
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls"
import {GUI} from "dat.gui"
import Floor from "@/three-widget/my/Floor"
import Ultrafiltration from "@/three-widget/my/Ultrafiltration"
import PathUtils from "@/three-widget/PathUtils"
import Pipe from "@/three-widget/my/pipe/Pipe"
import StrokeValve from "@/three-widget/my/pipe/StrokeValve"
import Bucket from "@/three-widget/my/Bucket"
import SpriteRectText from "@/three-widget/my/text/SpriteRectText"
import MeteringPump from "@/three-widget/my/pipe/MeteringPump"
import PipeJoinTee from "@/three-widget/my/pipe/PipeJoinTee"
import Pool from "@/three-widget/my/Pool"
import Pump from "@/three-widget/my/Pump"
import FlowMeter from "@/three-widget/my/pipe/FlowMeter"
import PiezoMeter from "@/three-widget/my/pipe/PiezoMeter"
import Tank from "@/three-widget/my/Tank"
import ThreeCore from "@/three-widget/ThreeCore"


export default class ThreeProject extends ThreeCore{

    private readonly orbit: OrbitControls

    /* region 常量区 */
    private floorLength = 20000
    private floorWidth = 16000

    //管道直角转弯的圆角半径
    private pipeRectRadius = 300

    //低空管道高度
    private lowPipeY: number = 600
    //高空管道高度
    private highPipeY: number = 1800

    //所有加药桶的半径
    private bucketRadius = 600

    //酸通路起始点X, 即 酸加药桶X
    private acidPathStartX = -(this.floorLength / 2 - 1000)
    //酸通路中心Z, 即 酸加药桶Z
    private acidPathZ = -(this.floorWidth / 2 - 1000)
    private acidMeteringPumpX = this.acidPathStartX + 1000


    //碱通路起始点X, 即 酸加药桶X
    private sodaPathStartX = this.acidPathStartX
    //碱通路中心Z, 酸通路向z+偏移1.5米
    private sodaPathZ = this.acidPathZ + 1500
    private sodaMeteringPumpX = this.sodaPathStartX + 1000

    //化学通路起始点X, 即 酸加药桶X
    private chemicalPathStartX = this.acidPathStartX
    //化学通路中心Z
    private chemicalPathZ = this.sodaPathZ + 1500
    private chemicalMeteringPumpX = this.acidPathStartX + 1000


    //水泵位置, 产水池 原水池 相同
    private pumpX = -(this.floorLength / 2 - 5000)


    //产水通路起始点X, 即 产水池X
    private purePathStartX = -(this.floorLength / 2 - 1000)
    //Z轴距离化学洗通路5米远
    private purePathZ = this.chemicalPathZ + 5000
    //产水池尺寸
    private purePoolLength = 1500
    private purePoolWidth = 4000
    private purePoolHeight = 2000
    //产水池产水通道1
    private pureChannel1Z = this.purePathZ - this.purePoolWidth / 2 + this.purePoolWidth / 5
    private pureChannel2Z = this.purePathZ + this.purePoolWidth / 5
    //产水池液体颜色(清水 蓝色)
    private purePoolLiquidColor = 0x33a3dc


    //原水通路起始点X, 即 原水池X
    private sewageStartX = -(this.floorLength / 2 - 1000)
    //距离原水通路5米远
    private sewageZ = this.purePathZ + 5000
    //原水池尺寸
    private sewagePoolLength = 1500
    private sewagePoolWidth = 4000
    private sewagePoolHeight = 2000
    //原水池
    private sewageChannel1Z = this.sewageZ - this.sewagePoolWidth / 2 + this.sewagePoolWidth / 5
    private sewageChannel2Z = this.sewageZ + this.sewagePoolWidth / 5
    //原水池液体颜色(清水 蓝色)
    private sewagePoolLiquidColor = 0xd1c7b7


    //超滤机位置
    private filterLength = 2000
    private filterWidth = 7000
    private filterHeight = 3000
    private filterX = this.floorLength / 2 - 2000
    private filterY = this.filterHeight / 2
    private filterZ = 0
    //所有到超滤机的管道都在超滤机左侧2米处调节高低, 再连接到超滤机上
    private pipeOffsetXOfFilter = 2000

    /* endregion */

    /* region three实体区 */
    //酸加药桶
    private acidBucket: Bucket | null = null
    //液位显示
    private acidBucketLevelText: SpriteRectText | null = null
    //管道1
    private acidPathPipe1: Pipe | null = null
    //计量泵
    private acidMeteringPump: MeteringPump | null = null
    //流量显示
    private acidMeteringPumpText: SpriteRectText | null = null

    //碱加药桶
    private sodaBucket: Bucket | null = null
    //液位显示
    private sodaBucketLevelText: SpriteRectText | null = null
    //出口管道1
    private sodaPathPipe1: Pipe | null = null
    private acidAndSodaCommonPathPipe1: Pipe | null = null
    //计量泵
    private sodaMeteringPump: MeteringPump | null = null
    //流量显示
    private sodaMeteringPumpText: SpriteRectText | null = null

    //化学清洗桶
    private chemicalBucket: Bucket | null = null
    //液位显示
    private chemicalBucketLevelText: SpriteRectText | null = null
    //计量泵
    private chemicalMeteringPump: MeteringPump | null = null
    //流量显示
    private chemicalMeteringPumpText: SpriteRectText | null = null

    private chemicalPathPipe1: Pipe | null = null
    private acidAndSodaAndChemicalCommonPathPipe1: Pipe | null = null

    //原水池(污水池)
    private sewagePool: Pool | null = null
    //原水池液位显示
    private sewagePoolLevelText: SpriteRectText | null = null
    //原水泵1
    private sewageChannel1Pump: Pump | null = null
    //原水泵2
    private sewageChannel2Pump: Pump | null = null
    private sewageChannel1LowPipe1: Pipe | null = null
    private sewageChannel2LowPipe1: Pipe | null = null
    private sewageChannel1HighPipe1: Pipe | null = null
    private sewageChannel2HighPipe1: Pipe | null = null
    private sewageChannel1AndChannel2CommonPipe1: Pipe | null = null
    //原水流量计
    private sewageFlowMeter: FlowMeter | null = null
    private sewageFlowMeterText: SpriteRectText | null = null
    //原水压力表
    private sewagePiezoMeter: PiezoMeter | null = null
    private sewagePiezoMeterText: SpriteRectText | null = null
    //原水阀
    private sewageValve: StrokeValve | null = null


    //产水池(净化水)
    private purePool: Pool | null = null
    //产水池液位显示
    private purePoolLevelText: SpriteRectText | null = null
    //反洗泵1
    private washChannel1Pump: Pump | null = null
    //反洗泵2
    private washChannel2Pump: Pump | null = null
    private washChannel1LowPipe1: Pipe | null = null
    private washChannel2LowPipe1: Pipe | null = null
    private washChannel1HighPipe1: Pipe | null = null
    private washChannel2HighPipe1: Pipe | null = null
    private washChannel1AndChannel2CommonPipe1: Pipe | null = null
    //产水管道
    private outPurePipe: Pipe | null = null
    //反洗阀
    private washValve: StrokeValve | null = null
    //产水阀
    private filterOutValve: StrokeValve | null = null
    //产水压力表
    private filterOutPiezoMeter: PiezoMeter | null = null
    private filterOutPiezoMeterText: SpriteRectText | null = null


    //超滤器
    private filter: Ultrafiltration | null = null
    //超滤上排主管道
    private filterUpDrainPipe: Pipe | null = null
    //超滤上排阀
    private filterUpDrainValve: StrokeValve | null = null
    //超滤下排主管道
    private filterDownDrainPipe: Pipe | null = null
    //超滤下排阀
    private filterDownDrainValve: StrokeValve | null = null
    //超滤反洗主管道
    private filterWashMainPipe: Pipe | null = null
    //超滤超滤产水主管道
    private filterPureOutPipe: Pipe | null = null
    private airTank: Tank | null = null
    private airTankX = 3000
    private airTankZ = -(this.floorWidth / 2 - 1500)
    //超滤气洗主管道
    private filterAirWashMainPipe: Pipe | null = null
    private filterAirWasPipe: Pipe | null = null
    //超滤气洗阀
    private airWashValve: StrokeValve | null = null

    /* endregion */


    constructor(dom: HTMLElement) {

        super(dom, {
            cameraOptions: {
                fov: 45,
                near: 0.1,
                far: 300000
            }
        })


        this.scene.background = new THREE.Color(0x062469)

        this.camera.position.set(-6000, 10000, 20000)


        const ambientLight = new THREE.AmbientLight(0xffffff, 3)
        this.scene.add(ambientLight)

        const directionalLight1 = new THREE.DirectionalLight(0xffffff, 5)
        directionalLight1.position.set(0, 10000, 20000)
        this.scene.add(directionalLight1)

        const directionalLight2 = new THREE.DirectionalLight(0xffffff, 4)
        directionalLight2.position.set(0, 10000, -20000)
        this.scene.add(directionalLight2)

        this.orbit = new OrbitControls(this.camera, this.renderer.domElement)

        this.addFloor()
        this.addFilter()

        this.addAcidPath()
        this.addSodaPath()
        this.addChemicalPath()

        this.addAirWashPath()

        this.addPurePath()
        this.addSewagePath()
    }

    protected init(){
        this.addGUI()
    }

    protected onRenderer() {
        this.orbit.update()
    }

    addFloor() {
        const floor = new Floor("地面", {
            length: this.floorLength,
            width: this.floorWidth,
        })
        //地面下沉1, 减少与地面物体的接触产生闪烁
        floor.position.y = -1
        this.scene.add(floor)
    }

    addAcidPath() {
        //固定此通路 x, z 坐标
        const x = this.acidPathStartX
        const z = this.acidPathZ

        // 红色桶
        const bucket = new Bucket("酸加药桶", {
            radius: this.bucketRadius,
            flankColor: 0xed1941,
            topColor: 0xef5b9c,
            bottomColor: 0xef5b9c,
        })

        bucket.position.x = x
        bucket.position.z = z
        this.acidBucket = bucket
        this.scene.add(bucket)

        const bucketBox = bucket.getBox()

        const st = new SpriteRectText("酸加药桶液位显示", "液位: %s m", " N/A ")
        st.position.x = bucketBox.centerX
        st.position.y = bucketBox.maxY + 400
        st.position.z = bucketBox.minZ
        this.acidBucketLevelText = st
        this.scene.add(st)


        const path1 = new PathUtils()
        // -200 让管理伸入桶内
        path1.push([bucketBox.maxX - 200, this.highPipeY, z])
        //直管, 向右, 长度10米, 留出拐弯半径
        path1.push([path1.last.x + 10000 - this.pipeRectRadius, path1.last.y, path1.last.z])
        //转弯, 由右向前
        path1.pushQuarterArc("X2Z1", this.pipeRectRadius)
        //直管, 向前, 到碱通路Z
        path1.push([path1.last.x, path1.last.y, this.sodaPathZ])

        const pipe1 = new Pipe("酸洗管道1", {points: path1.points})
        this.scene.add(pipe1)
        this.acidPathPipe1 = pipe1

        const meteringPump = new MeteringPump("酸计量泵")
        meteringPump.position.x = this.acidMeteringPumpX
        meteringPump.position.y = this.highPipeY
        meteringPump.position.z = z
        this.acidMeteringPump = meteringPump
        this.scene.add(meteringPump)

        const meteringPumpBox = meteringPump.getBox()

        const meteringPumpText = new SpriteRectText("酸计量泵流量显示", "流量: %s m³/h", " N/A ")
        meteringPumpText.position.x = meteringPumpBox.centerX + 600
        meteringPumpText.position.y = meteringPumpBox.maxY + 200
        meteringPumpText.position.z = meteringPumpBox.minZ
        this.acidMeteringPumpText = meteringPumpText
        this.scene.add(meteringPumpText)
    }


    addSodaPath() {
        //固定此通路 x, z 坐标
        const x = this.sodaPathStartX
        const z = this.sodaPathZ

        // 黄色桶
        const bucket = new Bucket("碱加药桶", {
            radius: this.bucketRadius,
            flankColor: 0xCCCC00,
            topColor: 0xFFFF00,
            bottomColor: 0xFFFF00,
        })

        bucket.position.x = x
        bucket.position.z = z
        this.sodaBucket = bucket
        this.scene.add(bucket)

        const bucketBox = bucket.getBox()

        const levelText = new SpriteRectText("碱加药桶液位显示", "液位: %s m", " N/A ")
        levelText.position.x = bucketBox.centerX
        levelText.position.y = bucketBox.maxY + 400
        levelText.position.z = bucketBox.minZ
        this.sodaBucketLevelText = levelText
        this.scene.add(levelText)


        const path = new PathUtils()
        // -200 让管理伸入桶内
        path.push([bucketBox.maxX - 200, this.highPipeY, z])
        //第一段, 直管, 向右, 固定长度10米
        const pipe1part1 = 10000
        path.push([path.last.x + pipe1part1, path.last.y, path.last.z])

        const pipe1 = new Pipe("碱洗管道1", {points: path.points})
        this.scene.add(pipe1)
        this.sodaPathPipe1 = pipe1

        const meteringPump = new MeteringPump("碱计量泵")
        meteringPump.position.x = this.sodaMeteringPumpX
        meteringPump.position.y = this.highPipeY
        meteringPump.position.z = z
        this.sodaMeteringPump = meteringPump
        this.scene.add(meteringPump)


        const meteringPumpBox = meteringPump.getBox()

        const meteringPumpText = new SpriteRectText("碱计量泵流量显示", "流量: %s m³/h", " N/A ")
        meteringPumpText.position.x = meteringPumpBox.centerX + 600
        meteringPumpText.position.y = meteringPumpBox.maxY + 200
        meteringPumpText.position.z = meteringPumpBox.minZ
        this.sodaMeteringPumpText = meteringPumpText
        this.scene.add(meteringPumpText)


        const tee = new PipeJoinTee("酸洗碱洗交叉三通")
        tee.position.x = path.last.x
        tee.position.y = path.last.y
        tee.position.z = z
        tee.rotateX(Math.PI * 0.5)
        tee.rotateZ(Math.PI * 0.5)
        this.scene.add(tee)


        const path2 = new PathUtils()
        //第一段, 直管, 向前, 起点以第一管段的末端为起来
        path2.push([path.last.x, path.last.y, path.last.z])
        path2.push([path2.last.x, path2.last.y, this.chemicalPathZ])

        const acidAndSodaCommonPathPipe1 = new Pipe("酸洗碱洗公共管道1", {points: path2.points})
        this.acidAndSodaCommonPathPipe1 = acidAndSodaCommonPathPipe1
        this.scene.add(acidAndSodaCommonPathPipe1)
    }


    addChemicalPath() {
        //固定此通路 x, z 坐标
        const x = this.chemicalPathStartX
        const z = this.chemicalPathZ

        // 白色桶
        const bucket = new Bucket("化学清洗桶", {
            radius: this.bucketRadius,
            flankColor: 0xCCCCCC,
            topColor: 0xFFFFFF,
            bottomColor: 0xFFFFFF,
        })

        bucket.position.x = x
        bucket.position.z = z
        this.chemicalBucket = bucket
        this.scene.add(bucket)

        const bucketBox = bucket.getBox()


        const levelText = new SpriteRectText("化学加药桶液位显示", "液位: %s m", " N/A ")
        levelText.position.x = bucketBox.centerX
        levelText.position.y = bucketBox.maxY + 400
        levelText.position.z = bucketBox.minZ
        this.chemicalBucketLevelText = levelText
        this.scene.add(levelText)

        const path1 = new PathUtils()
        // -200 让管理伸入桶内
        path1.push([bucketBox.maxX - 200, this.highPipeY, z])
        //第一段, 直管, 向右, 固定长度10米
        const pipe1part1 = 10000
        path1.push([path1.last.x + pipe1part1, path1.last.y, path1.last.z])


        const pipe1 = new Pipe("化学清洗管道1", {points: path1.points})
        this.scene.add(pipe1)
        this.chemicalPathPipe1 = pipe1


        const tee = new PipeJoinTee("碱洗化学洗交叉三通")
        tee.position.x = path1.last.x
        tee.position.y = path1.last.y
        tee.position.z = z
        tee.rotateX(Math.PI * 0.5)
        tee.rotateZ(Math.PI * 0.5)
        this.scene.add(tee)


        const meteringPump = new MeteringPump("化学计量泵")
        meteringPump.position.x = this.chemicalMeteringPumpX
        meteringPump.position.y = this.highPipeY
        meteringPump.position.z = z
        this.chemicalMeteringPump = meteringPump
        this.scene.add(meteringPump)

        const meteringPumpBox = meteringPump.getBox()

        const meteringPumpText = new SpriteRectText("化学计量泵流量显示", "流量: %s m³/h", " N/A ")
        meteringPumpText.position.x = meteringPumpBox.centerX + 600
        meteringPumpText.position.y = meteringPumpBox.maxY + 200
        meteringPumpText.position.z = meteringPumpBox.minZ
        this.chemicalMeteringPumpText = meteringPumpText
        this.scene.add(meteringPumpText)


        const path2 = new PathUtils()
        //第一段, 直管, 向前, 以第一管段的末端为起点, 终点汇入产水池通道1
        path2.push([path1.last.x, path1.last.y, path1.last.z])
        path2.push([path2.last.x, path2.last.y, this.pureChannel1Z])

        const sodaAndChemicalCommonPathPipe1 = new Pipe("酸洗碱洗化学洗公共管道1", {points: path2.points})
        this.scene.add(sodaAndChemicalCommonPathPipe1)
        this.acidAndSodaAndChemicalCommonPathPipe1 = sodaAndChemicalCommonPathPipe1
    }

    addAirWashPath() {
        const pipeRectRadius = this.pipeRectRadius

        const tank = new Tank("储气罐")
        tank.position.x = this.airTankX
        tank.position.z = this.airTankZ
        this.airTank = tank
        this.scene.add(tank)

        const filterBox = this.filter!.getBox()
        

        const pipeY = this.filter!.getJoin4MainPipeY() + this.filterHeight / 2

        const pu = new PathUtils()
        pu.push([tank.position.x, tank.joinY, tank.position.z])
        pu.push([pu.last.x, pipeY + pipeRectRadius, pu.last.z])
        //转弯, 由上向右
        pu.pushQuarterArc("Y1X1", pipeRectRadius)
        //直管, 向右, 到超滤机下方主管道
        pu.push([this.filterX - pipeRectRadius, pu.last.y, pu.last.z])
        //转弯, 由左向前
        pu.pushQuarterArc("X2Z1", pipeRectRadius)
        //直管, 向前, 到超滤机
        pu.push([pu.last.x, pu.last.y, filterBox.minZ])

        const filterAirWasPipe = new Pipe("超滤气洗管道", {points: pu.points})
        this.filterAirWasPipe = filterAirWasPipe
        this.scene.add(filterAirWasPipe)

        // 气洗阀
        const airWashValve = new StrokeValve("超滤下排阀")
        //位置改到气罐后面, 在全景下更容易看到
        airWashValve.position.x = this.airTankX + 2000
        airWashValve.position.y = pipeY
        airWashValve.position.z = this.airTankZ
        this.airWashValve = airWashValve
        this.scene.add(airWashValve)
    }



    /**
     * 产水池通路
     */
    private addPurePath() {
        //固定此通路 x, z 坐标
        const x = this.purePathStartX
        const z = this.purePathZ

        const pipeRectRadius = this.pipeRectRadius

        //水泵位置
        const pumpX = this.pumpX
        //三通位置
        const highTeeX = this.pumpX + 2000

        //产水池 液体颜色(清水 蓝色)
        const liquidColor = this.purePoolLiquidColor

        const pool = new Pool("产水池", {
            width: this.purePoolWidth,
            height: this.purePoolHeight,
            length: this.purePoolLength,
            liquidColor,
        })
        pool.position.x = x
        pool.position.z = z
        this.purePool = pool
        this.scene.add(pool)

        const poolBox = pool.getBox()

        const purePoolLevelText = new SpriteRectText("产水池液位显示", "液位: %s m", " N/A ")
        purePoolLevelText.position.x = poolBox.centerX
        purePoolLevelText.position.y = poolBox.maxY + 400
        purePoolLevelText.position.z = poolBox.minZ
        this.purePoolLevelText = purePoolLevelText
        this.scene.add(purePoolLevelText)


        //反洗1
        const channel1Z = this.pureChannel1Z
        //反洗2
        const channel2Z = this.pureChannel2Z

        const channel1Pump = new Pump("反洗泵1")
        channel1Pump.position.x = pumpX
        channel1Pump.position.z = channel1Z
        this.washChannel1Pump = channel1Pump
        this.scene.add(channel1Pump)

        //todo
        channel1Pump.run()


        const channel2Pump = new Pump("反洗泵2")
        channel2Pump.position.x = pumpX
        channel2Pump.position.z = channel2Z
        this.washChannel2Pump = channel2Pump
        this.scene.add(channel2Pump)

        //todo
        channel2Pump.run()

        const channel1PumpBox = channel1Pump.getBox()

        const channel1Pipe1 = new PathUtils()
        // -200 让管理伸入池内
        channel1Pipe1.push([poolBox.maxX - 200, this.lowPipeY, this.pureChannel1Z])
        //直管, 向右, 终点为水泵最小X
        channel1Pipe1.push([channel1PumpBox.minX, channel1Pipe1.last.y, channel1Pipe1.last.z])

        const Channel1LowPipe1 = new Pipe("超滤反洗1低空管道1", {points: channel1Pipe1.points})
        this.washChannel1LowPipe1 = Channel1LowPipe1
        this.scene.add(Channel1LowPipe1)


        const channel1Pipe2 = new PathUtils()
        //起点x 为水泵出口处
        channel1Pipe2.push([channel1PumpBox.maxX - channel1Pump.outJoinOffsetXOfMaxX, channel1PumpBox.maxY, this.pureChannel1Z])
        //直管, 向上, 到达高度管道, 留出拐弯半径
        channel1Pipe2.push([channel1Pipe2.last.x, this.highPipeY - pipeRectRadius, channel1Pipe2.last.z])
        //转弯, 由下向右
        channel1Pipe2.pushQuarterArc("Y2X1", pipeRectRadius)
        //直管, 向右到与channel2交汇位置
        channel1Pipe2.push([highTeeX, channel1Pipe2.last.y, channel1Pipe2.last.z])

        const channel1HighPipe1 = new Pipe("超滤反洗2高空管道1", {points: channel1Pipe2.points})
        this.scene.add(channel1HighPipe1)
        this.washChannel1HighPipe1 = channel1HighPipe1



        const pu3 = new PathUtils()
        // -200 让管理伸入池内
        pu3.push([poolBox.maxX - 200, this.lowPipeY, channel2Z])
        //第一段, 直管, 向右, 终点为水泵最小X
        pu3.push([channel1PumpBox.minX, pu3.last.y, pu3.last.z])

        const channel2LowPipe1 = new Pipe("反洗2低空管道1", {points: pu3.points})
        this.scene.add(channel2LowPipe1)
        this.washChannel2LowPipe1 = channel2LowPipe1


        const pu4 = new PathUtils()
        //起点x 为水泵出口处, x y 和channel1相同
        pu4.push([channel1PumpBox.maxX - channel1Pump.outJoinOffsetXOfMaxX, channel1PumpBox.maxY, channel2Z])
        //第一段, 直管, 向上, 到达高度管道, 留出拐弯半径
        pu4.push([pu4.last.x, this.highPipeY - pipeRectRadius, pu4.last.z])
        //第一段直管转弯, 由下向右 == Y2X1
        pu4.pushQuarterArc("Y2X1", pipeRectRadius)
        //第二段, 直管, 向右, 到与channel1交汇位置, 留出拐弯半径
        pu4.push([highTeeX - pipeRectRadius, pu4.last.y, pu4.last.z])
        //第二段直管转弯, 由左向后 == X2Z2
        pu4.pushQuarterArc("X2Z2", pipeRectRadius)
        //第三段, 直管, 向后, 汇入channel1
        pu4.push([pu4.last.x, pu4.last.y, channel1Z])

        const channel2HighPipe1 = new Pipe("反洗2高空管道1", {points: pu4.points})
        this.scene.add(channel2HighPipe1)
        this.washChannel2HighPipe1 = channel2HighPipe1

        const tee = new PipeJoinTee("反洗1与反洗2交叉三通")
        tee.position.x = channel1Pipe2.last.x
        tee.position.y = this.highPipeY
        tee.position.z = channel1Z
        tee.rotateX(Math.PI * 0.5)
        this.scene.add(tee)

        const filterBox = this.filter!.getBox()

        const pu5 = new PathUtils()
        //起点x 为水泵出口处, x y 和channel1相同
        pu5.push([channel1Pipe2.last.x, channel1Pipe2.last.y, channel1Pipe2.last.z])
        //第一段, 直管, 向右, 到达超滤机前调整管道高度
        pu5.push([filterBox.minX - this.pipeOffsetXOfFilter - pipeRectRadius, channel1Pipe2.last.y, channel1Pipe2.last.z])
        //第一段直管转弯, 由左向下
        pu5.pushQuarterArc("X2Y2", pipeRectRadius)
        //第二段, 直管, 向下, 到达超滤机下方主管道高度, 留出转弯半径
        pu5.push([pu5.last.x, this.filter!.getJoin4MainPipeY() + this.filterHeight / 2 + pipeRectRadius, pu5.last.z])
        //第二段直管转弯, 由下向后
        pu5.pushQuarterArc("Y1Z2", pipeRectRadius)
        //第三段, 直管, 向后, 到达超滤机后方0.5米, 留出转弯半径
        pu5.push([pu5.last.x, pu5.last.y, filterBox.minZ - 500 + pipeRectRadius])
        //第三段直管转弯, 由前向右
        pu5.pushQuarterArc("Z1X1", pipeRectRadius)
        //第四段, 直管, 向右, 到达超滤机调整管道高度
        pu5.push([filterBox.minX - pipeRectRadius, pu5.last.y, pu5.last.z])
        //第四段直管转弯, 由左向上
        pu5.pushQuarterArc("X2Y1", pipeRectRadius)
        //第五段, 直管, 向上, 到达超滤机上方主管道
        pu5.push([pu5.last.x, this.filter!.getJoin1MainPipeY() + this.filterHeight / 2 - pipeRectRadius, pu5.last.z])
        //第五段直管转弯, 由下向右
        pu5.pushQuarterArc("Y2X1", pipeRectRadius)
        //第六段, 直管, 向右, 到达超滤机上高主管道
        pu5.push([this.filter!.position.x - pipeRectRadius, pu5.last.y, pu5.last.z])
        //第六段直管转弯, 由左向前
        pu5.pushQuarterArc("X2Z1", pipeRectRadius)
        //第七段, 直管, 连接到超滤机上
        pu5.push([pu5.last.x, pu5.last.y, filterBox.maxZ])

        const washChannel1AndChannel2CommonPipe1 = new Pipe("反洗1与反洗2公共管道1", {
            points: pu5.points,
            tubularSegments: 256
        })
        this.scene.add(washChannel1AndChannel2CommonPipe1)
        this.washChannel1AndChannel2CommonPipe1 = washChannel1AndChannel2CommonPipe1


        const filterWashValve = new StrokeValve("反洗阀")
        filterWashValve.position.x = 0
        filterWashValve.position.y = this.highPipeY
        filterWashValve.position.z = channel1Z
        this.scene.add(filterWashValve)
        this.washValve = filterWashValve


        const pu6 = new PathUtils()
        //起点 超滤机中部上方主管道, 偏向里1.5米(离反洗管道1米)
        pu6.push([this.filter!.position.x, this.filter!.getJoin2MainPipeY() + this.filterHeight / 2, filterBox.minZ])
        pu6.push([pu6.last.x, pu6.last.y, filterBox.minZ - 1500 + pipeRectRadius])
        pu6.pushQuarterArc("Z1X2", pipeRectRadius)
        //第一段, 直管, 向左, 到达超滤机前调整管道高度的地方, 再减1米(离反洗管道1米), 留出转弯半径
        pu6.push([filterBox.minX - this.pipeOffsetXOfFilter - 1000 + pipeRectRadius, pu6.last.y, pu6.last.z])
        //第一段直管转弯, 由右向下 == X1Y2
        pu6.pushQuarterArc("X1Y2", pipeRectRadius)
        //第二段, 直管, 向下, 到达超滤机下方主管道高度, 留出转弯半径
        pu6.push([pu6.last.x, this.filter!.getJoin4MainPipeY() + this.filterHeight / 2 + pipeRectRadius, pu6.last.z])
        //第二段直管转弯, 由上向前 == Y1Z1
        pu6.pushQuarterArc("Y1Z1", pipeRectRadius)
        //第三段, 直管, 向前, 到达化学洗通路前2米, 留出转弯半径
        pu6.push([pu6.last.x, pu6.last.y, this.chemicalPathZ + 2000 - pipeRectRadius])
        //第三段直管转弯, 由后向左 == Z2X2
        pu6.pushQuarterArc("Z2X2", pipeRectRadius)
        //第四段, 直管, 向左, 到达产水池, 留出转弯半径
        pu6.push([this.purePathStartX + pipeRectRadius, pu6.last.y, pu6.last.z])
        //第四段直管转弯, 由左向上 == X1Y1
        pu6.pushQuarterArc("X1Y1", pipeRectRadius)
        //第五段, 直管, 向上, 到达产水池顶部-200, 要减去两个拐弯半径
        pu6.push([pu6.last.x, this.purePoolHeight - 200 - pipeRectRadius, pu6.last.z])
        //第五段直管转弯, 由下向前 == Y2Z1
        pu6.pushQuarterArc("Y2Z1", pipeRectRadius)
        //第六段, 直管, 向前, 到达产水池
        pu6.push([pu6.last.x, pu6.last.y, this.purePathZ - this.purePoolWidth / 2])

        const filterPureOutPipe = new Pipe("产水管道", {points: pu6.points, tubularSegments: 256})
        this.scene.add(filterPureOutPipe)
        this.outPurePipe = filterPureOutPipe


        const filterOutValve = new StrokeValve("产水阀")
        filterOutValve.position.x = filterBox.minX - 2000
        filterOutValve.position.y = this.filter!.getJoin2MainPipeY() + this.filterHeight / 2
        filterOutValve.position.z = filterBox.minZ - 1500
        this.filterOutValve = filterOutValve
        this.scene.add(filterOutValve)

        const filterOutPiezoMeter = new PiezoMeter("产水压力表")
        filterOutPiezoMeter.position.x = filterBox.minX - 600
        filterOutPiezoMeter.position.y = this.filter!.getJoin2MainPipeY() + this.filterHeight / 2
        filterOutPiezoMeter.position.z = filterBox.minZ - 1500
        this.filterOutPiezoMeter = filterOutPiezoMeter
        this.scene.add(filterOutPiezoMeter)

        const filterOutPiezoMeterText = new SpriteRectText("产水压力表显示", "压力: %s bar", " N/A ")
        filterOutPiezoMeterText.position.x = filterOutPiezoMeter.position.x
        filterOutPiezoMeterText.position.y = filterOutPiezoMeter.position.y + 1050
        filterOutPiezoMeterText.position.z = filterOutPiezoMeter.position.z
        this.filterOutPiezoMeterText = filterOutPiezoMeterText
        this.scene.add(filterOutPiezoMeterText)

    }

    /**
     * 原水池通路
     */
    addSewagePath() {
        const pipeRectRadius = this.pipeRectRadius

        //固定此通路 x, z 坐标
        const x = this.sewageStartX
        const z = this.sewageZ

        //水泵位置
        const pumpX = this.pumpX
        //三通位置
        const highTeeX = this.pumpX + 2000

        //原水池 液体颜色(污水 灰色)
        const liquidColor = this.sewagePoolLiquidColor

        const pool = new Pool("原水池", {
            width: this.sewagePoolWidth,
            height: this.sewagePoolHeight,
            length: this.sewagePoolLength,
            liquidColor,
        })
        pool.position.x = x
        pool.position.z = z
        this.sewagePool = pool
        this.scene.add(pool)

        const poolBox = pool.getBox()

        const levelText = new SpriteRectText("原水池液位显示", "液位: %s m", " N/A ")
        levelText.position.x = poolBox.centerX
        levelText.position.y = poolBox.maxY + 400
        levelText.position.z = poolBox.minZ
        this.sewagePoolLevelText = levelText
        this.scene.add(levelText)

        //原水1
        const channel1Z = this.sewageChannel1Z
        //原水2
        const channel2Z = this.sewageChannel2Z


        const pump1 = new Pump("原水泵1")
        pump1.position.x = pumpX
        pump1.position.z = channel1Z
        this.sewageChannel1Pump = pump1
        this.scene.add(pump1)


        const pump2 = new Pump("原水泵2")
        pump2.position.x = pumpX
        pump2.position.z = channel2Z
        this.sewageChannel2Pump = pump2
        this.scene.add(pump2)


        const pump1Box = pump1.getBox()

        const pu1 = new PathUtils()
        // -200 让管理伸入池内
        pu1.push([poolBox.maxX - 200, this.lowPipeY, channel1Z])
        //第一段, 直管, 向右, 终点为水泵最小X
        pu1.push([pump1Box.minX, pu1.last.y, pu1.last.z])

        const Channel1LowPipe1 = new Pipe("原水1低空管道1", {points: pu1.points})
        this.sewageChannel1LowPipe1 = Channel1LowPipe1
        this.scene.add(Channel1LowPipe1)

        const pu2 = new PathUtils()
        //起点x 为水泵出口处
        pu2.push([pump1Box.maxX - pump1.outJoinOffsetXOfMaxX, pump1Box.maxY, channel1Z])
        //第一段, 直管, 向上, 到达高度管道, 留出拐弯半径
        pu2.push([pu2.last.x, this.highPipeY - pipeRectRadius, pu2.last.z])
        //第一段直管转弯, 由下向右 == Y2X1
        pu2.pushQuarterArc("Y2X1", pipeRectRadius)
        //第二段, 直管, 向右到与channel交汇位置
        pu2.push([highTeeX, pu2.last.y, pu2.last.z])

        const channel1HighPipe1 = new Pipe("原水1高空管道1", {points: pu2.points})
        this.scene.add(channel1HighPipe1)
        this.sewageChannel1HighPipe1 = channel1HighPipe1


        const pu3 = new PathUtils()
        // -200 让管理伸入池内
        pu3.push([poolBox.maxX - 200, this.lowPipeY, channel2Z])
        //第一段, 直管, 向右, 终点为水泵最小X
        pu3.push([pump1Box.minX, pu3.last.y, pu3.last.z])

        const channel2LowPipe1 = new Pipe("原水2低空管道1", {points: pu3.points})
        this.scene.add(channel2LowPipe1)
        this.sewageChannel2LowPipe1 = channel2LowPipe1


        const pu4 = new PathUtils()
        //起点x 为水泵出口处, x y 和channel1相同
        pu4.push([pump1Box.maxX - pump1.outJoinOffsetXOfMaxX, pump1Box.maxY, channel2Z])
        //第一段, 直管, 向上, 到达高度管道, 留出拐弯半径
        pu4.push([pu4.last.x, this.highPipeY - pipeRectRadius, pu4.last.z])
        //第一段直管转弯, 由下向右 == Y2X1
        pu4.pushQuarterArc("Y2X1", pipeRectRadius)
        //第二段, 直管, 向右, 到与channel1交汇位置, 留出拐弯半径
        pu4.push([highTeeX - pipeRectRadius, pu4.last.y, pu4.last.z])
        //第二段直管转弯, 由左向后 == X2Z2
        pu4.pushQuarterArc("X2Z2", pipeRectRadius)
        //第三段, 直管, 向后, 汇入channel1
        pu4.push([pu4.last.x, pu4.last.y, channel1Z])

        const channel2HighPipe1 = new Pipe("原水2高空管道1", {points: pu4.points})
        this.scene.add(channel2HighPipe1)
        this.sewageChannel2HighPipe1 = channel2HighPipe1

        const tee = new PipeJoinTee("原水1与原水2交叉三通")
        tee.position.x = pu2.last.x
        tee.position.y = this.highPipeY
        tee.position.z = channel1Z
        tee.rotateX(Math.PI * 0.5)
        this.scene.add(tee)

        const filterBox = this.filter!.getBox()

        const pu5 = new PathUtils()
        //起点x 为水泵出口处, x y 和channel1相同
        pu5.push([pu2.last.x, pu2.last.y, pu2.last.z])
        //第一段, 直管, 向右, 到达超滤机前调整管道高度
        pu5.push([filterBox.minX - this.pipeOffsetXOfFilter - pipeRectRadius, pu2.last.y, pu2.last.z])
        //第一段直管转弯, 由左向下 == X2Y2
        pu5.pushQuarterArc("X2Y2", pipeRectRadius)
        //第二段, 直管, 向下, 到达超滤机下方主管道高度, 留出转弯半径
        pu5.push([pu5.last.x, this.filter!.getJoin4MainPipeY() + this.filterHeight / 2 + pipeRectRadius, pu5.last.z])
        //第二段直管转弯, 由下向右 == Y1X1
        pu5.pushQuarterArc("Y1X1", pipeRectRadius)
        //第三段, 直管, 向右, 到达超滤机下方主管道
        pu5.push([this.filterX, pu5.last.y, pu5.last.z])

        const sewageChannel1AndChannel2CommonPipe1 = new Pipe("原水1与原水2公共管道1", {
            points: pu5.points,
            tubularSegments: 256
        })
        this.scene.add(sewageChannel1AndChannel2CommonPipe1)
        this.sewageChannel1AndChannel2CommonPipe1 = sewageChannel1AndChannel2CommonPipe1

        const sewageFlowMeter = new FlowMeter("原水流量计")
        sewageFlowMeter.position.x = -2000
        sewageFlowMeter.position.y = this.highPipeY
        sewageFlowMeter.position.z = channel1Z
        this.scene.add(sewageFlowMeter)
        this.sewageFlowMeter = sewageFlowMeter

        const sewageFlowMeterText = new SpriteRectText("原水流量计显示", "流量: %s m³/h", " N/A ")
        sewageFlowMeterText.position.x = sewageFlowMeter.position.x
        sewageFlowMeterText.position.y = sewageFlowMeter.position.y + 1100
        sewageFlowMeterText.position.z = sewageFlowMeter.position.z
        this.sewageFlowMeterText = sewageFlowMeterText
        this.scene.add(sewageFlowMeterText)


        const sewagePiezoMeter = new PiezoMeter("原水压力表")
        sewagePiezoMeter.position.x = 0
        sewagePiezoMeter.position.y = this.highPipeY
        sewagePiezoMeter.position.z = channel1Z
        this.scene.add(sewagePiezoMeter)
        this.sewagePiezoMeter = sewagePiezoMeter

        const sewagePiezoMeterText = new SpriteRectText("原水压力表显示", "压力: %s bar", " N/A ")
        sewagePiezoMeterText.position.x = sewagePiezoMeter.position.x
        sewagePiezoMeterText.position.y = sewagePiezoMeter.position.y + 1050
        sewagePiezoMeterText.position.z = sewagePiezoMeter.position.z
        this.sewagePiezoMeterText = sewagePiezoMeterText
        this.scene.add(sewagePiezoMeterText)


        const sewageValve = new StrokeValve("原水阀")
        sewageValve.position.x = 2000
        sewageValve.position.y = this.highPipeY
        sewageValve.position.z = channel1Z
        this.scene.add(sewageValve)
        this.sewageValve = sewageValve
    }
    
    

    addFilter() {
        const filter = new Ultrafiltration("超滤器", {
            length: this.filterLength,
            width: this.filterWidth,
            height: this.filterHeight,
        })
        filter.position.x = this.filterX
        filter.position.y = this.filterY
        filter.position.z = this.filterZ
        this.filter = filter
        this.scene.add(filter)

        const mainPipeRadius = filter.options.mainPipeRadius

        const filterBox = filter.getBox()

        //上排
        const upDrainX = filter.position.x
        const upDrainY = filter.getJoin1MainPipeY() + this.filterHeight / 2
        const upDrainZ = filterBox.maxZ
        const pu1 = new PathUtils()
        pu1.push([upDrainX, upDrainY, upDrainZ])
        pu1.push([pu1.last.x, pu1.last.y, this.floorWidth / 2])
        const upDrainPipe = new Pipe("超滤上排主管道", {points: pu1.points, radius: mainPipeRadius})
        this.filterUpDrainPipe = upDrainPipe
        this.scene.add(upDrainPipe)

        const upDrainValve = new StrokeValve("超滤上排阀", {
            horizontalRadius: mainPipeRadius + 40
        })
        upDrainValve.position.x = upDrainX
        upDrainValve.position.y = upDrainY
        upDrainValve.position.z = upDrainZ + 2500
        upDrainValve.rotateY(Math.PI * 0.5)
        this.filterUpDrainValve = upDrainValve
        this.scene.add(upDrainValve)

        //下排
        const downDrainX = filter.position.x
        const downDrainY = filter.getJoin4MainPipeY() + this.filterHeight / 2
        const downDrainZ = filterBox.maxZ
        const pu2 = new PathUtils()
        pu2.push([downDrainX, downDrainY, downDrainZ])
        pu2.push([pu2.last.x, pu2.last.y, this.floorWidth / 2])
        const downDrainPipe = new Pipe("超滤下排主管道", {points: pu2.points, radius: mainPipeRadius})
        this.filterDownDrainPipe = downDrainPipe
        this.scene.add(downDrainPipe)

        const downDrainValve = new StrokeValve("超滤下排阀", {
            horizontalRadius: mainPipeRadius + 40
        })
        downDrainValve.position.x = downDrainX
        downDrainValve.position.y = downDrainY
        downDrainValve.position.z = downDrainZ + 2500
        downDrainValve.rotateY(Math.PI * 0.5)
        this.filterDownDrainValve = downDrainValve
        this.scene.add(downDrainValve)
    }


    private addGUI() {

        const gui = new GUI()

        const acidPathRecord: Record<string, any> = {}

        const acidPathFolder = gui.addFolder('酸通路')

        acidPathRecord["acidBucketLevel"] = 0.5
        acidPathFolder.add(acidPathRecord, 'acidBucketLevel', 0, 1)
            .name('酸罐液位')
            .onChange(value => this.acidBucket?.setLevel(value))


        acidPathRecord["acidPathAllFlow"] = () => {
            this.acidPathPipe1?.flow()
            this.acidAndSodaCommonPathPipe1?.flow()
            this.acidAndSodaAndChemicalCommonPathPipe1?.flow()
        }
        acidPathFolder.add(acidPathRecord, 'acidPathAllFlow')
            .name('全部流动')

        acidPathRecord["acidPathAllStop"] = () => {
            this.acidPathPipe1?.stop()
            this.acidAndSodaCommonPathPipe1?.stop()
            this.acidAndSodaAndChemicalCommonPathPipe1?.stop()
        }
        acidPathFolder.add(acidPathRecord, 'acidPathAllStop')
            .name('全部停止')






        const sodaPathRecord: Record<string, any> = {}

        const sodaPathFolder = gui.addFolder('碱通路')

        sodaPathRecord["sodaBucketLevel"] = 0.5
        sodaPathFolder.add(sodaPathRecord, 'sodaBucketLevel', 0, 1)
            .name('碱罐液位')
            .onChange(value => this.acidBucket?.setLevel(value))


        sodaPathRecord["sodaPathAllFlow"] = () => {
            this.sodaPathPipe1?.flow()
            this.acidAndSodaCommonPathPipe1?.flow()
            this.acidAndSodaAndChemicalCommonPathPipe1?.flow()
        }
        sodaPathFolder.add(sodaPathRecord, 'sodaPathAllFlow')
            .name('全部流动')

        sodaPathRecord["sodaPathAllStop"] = () => {
            this.sodaPathPipe1?.stop()
            this.acidAndSodaCommonPathPipe1?.stop()
            this.acidAndSodaAndChemicalCommonPathPipe1?.stop()
        }
        sodaPathFolder.add(sodaPathRecord, 'sodaPathAllStop')
            .name('全部停止')







        const chemicalPathRecord: Record<string, any> = {}

        const chemicalPathFolder = gui.addFolder('化学通路')

        chemicalPathRecord["chemicalBucketLevel"] = 0.5
        chemicalPathFolder.add(chemicalPathRecord, 'chemicalBucketLevel', 0, 1)
            .name('化学罐液位')
            .onChange(value => this.chemicalBucket?.setLevel(value))


        chemicalPathRecord["chemicalPathAllFlow"] = () => {
            this.chemicalPathPipe1?.flow()
            this.acidAndSodaAndChemicalCommonPathPipe1?.flow()
        }
        chemicalPathFolder.add(chemicalPathRecord, 'chemicalPathAllFlow')
            .name('全部流动')

        chemicalPathRecord["chemicalPathAllStop"] = () => {
            this.chemicalPathPipe1?.stop()
            this.acidAndSodaAndChemicalCommonPathPipe1?.stop()
        }
        chemicalPathFolder.add(chemicalPathRecord, 'chemicalPathAllStop')
            .name('全部停止')







        const purePathRecord: Record<string, any> = {}

        const purePathFolder = gui.addFolder('产水池通路')

        purePathRecord["pureLevel"] = 0.5
        purePathFolder.add(purePathRecord, 'pureLevel', 0, 1)
            .name('产水池液位')
            .onChange(value => this.purePool?.setLevel(value))

        purePathRecord["反洗泵1开"] = () => {
            this.washChannel1Pump?.run()
        }
        purePathRecord["反洗泵1关"] = () => {
            this.washChannel1Pump?.stop()
        }
        purePathFolder.add(purePathRecord, "反洗泵1开")
        purePathFolder.add(purePathRecord, "反洗泵1关")

        purePathRecord["反洗泵2开"] = () => {
            this.washChannel2Pump?.run()
        }
        purePathRecord["反洗泵2关"] = () => {
            this.washChannel2Pump?.stop()
        }
        purePathFolder.add(purePathRecord, "反洗泵2开")
        purePathFolder.add(purePathRecord, "反洗泵2关")






        const sewagePathRecord: Record<string, any> = {}

        const sewagePathFolder = gui.addFolder('原水池通路')

        sewagePathRecord["sewageLevel"] = 0.5
        sewagePathFolder.add(sewagePathRecord, 'sewageLevel', 0, 1)
            .name('原水池液位')
            .onChange(value => this.sewagePool?.setLevel(value))

        sewagePathRecord["原水泵1开"] = () => {
            this.sewageChannel1Pump?.run()
        }
        sewagePathRecord["原水泵1关"] = () => {
            this.sewageChannel1Pump?.stop()
        }
        sewagePathFolder.add(sewagePathRecord, "原水泵1开")
        sewagePathFolder.add(sewagePathRecord, "原水泵1关")

        sewagePathRecord["原水泵2开"] = () => {
            this.sewageChannel2Pump?.run()
        }
        sewagePathRecord["原水泵2关"] = () => {
            this.sewageChannel2Pump?.stop()
        }
        sewagePathFolder.add(sewagePathRecord, "原水泵2开")
        sewagePathFolder.add(sewagePathRecord, "原水泵2关")


    }





    private points: Record<string, (value: string) => void> = {
        "1": value => {
            if (value == "0") {
                this.acidMeteringPump?.stop()
            } else {
                this.acidMeteringPump?.run()
            }
        },
        "2": value => {
            if (value == "0") {
                this.sodaMeteringPump?.stop()
            } else {
                this.sodaMeteringPump?.run()
            }
        },
        "3": value => {
            if (value == "0") {
                this.chemicalMeteringPump?.stop()
            } else {
                this.chemicalMeteringPump?.run()
            }
        },
        "4": value => {
            if (value == "0") {
                this.sewageChannel1Pump?.stop()
            } else {
                this.sewageChannel1Pump?.run()
            }
        },
        "5": value => {
            if (value == "0") {
                this.sewageChannel2Pump?.stop()
            } else {
                this.sewageChannel2Pump?.run()
            }
        },
        "6": value => {
            if (value == "0") {
                this.washChannel1Pump?.stop()
            } else {
                this.washChannel1Pump?.run()
            }
        },
        "7": value => {
            if (value == "0") {
                this.washChannel2Pump?.stop()
            } else {
                this.washChannel2Pump?.run()
            }
        },
        "8": value => {
            if (value == "0") {
                this.sewageValve?.close()
            } else {
                this.sewageValve?.open()
            }
        },
        "9": value => {
            if (value == "0") {
                this.filterOutValve?.close()
            } else {
                this.filterOutValve?.open()
            }
        },
        "10": value => {
            if (value == "0") {
                this.washValve?.close()
            } else {
                this.washValve?.open()
            }
        },
        "11": value => {
            if (value == "0") {
                this.airWashValve?.close()
            } else {
                this.airWashValve?.open()
            }
        },
        "12": value => {
            if (value == "0") {
                this.filterUpDrainValve?.close()
            } else {
                this.filterUpDrainValve?.open()
            }
        },
        "13": value => {
            if (value == "0") {
                this.filterDownDrainValve?.close()
            } else {
                this.filterDownDrainValve?.open()
            }
        },


        "40001": value => {
            this.acidBucketLevelText?.setValue(value)
        },
        "40002": value => {
            this.sodaBucketLevelText?.setValue(value)
        },
        "40003": value => {
            this.chemicalBucketLevelText?.setValue(value)
        },
        "40004": value => {
            this.acidMeteringPumpText?.setValue(value)
        },
        "40005": value => {
            this.sodaMeteringPumpText?.setValue(value)
        },
        "40006": value => {
            this.chemicalMeteringPumpText?.setValue(value)
        },
        "40007": value => {
            this.sewagePoolLevelText?.setValue(value)
        },
        "40008": value => {
            this.purePoolLevelText?.setValue(value)
        },
        "40009": value => {
            this.sewageFlowMeterText?.setValue(value)
        },
        "40010": value => {
            this.sewagePiezoMeterText?.setValue(value)
        },
        "40011": value => {
            this.filterOutPiezoMeterText?.setValue(value)
        },
    }

}
