import * as THREE from "three"
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls"
import ThreeCore from "@/three-widget/ThreeCore"
import Chimney from "@/three-widget/my/Chimney"
import DeodorizeRoom from "@/three-widget/my/DeodorizeRoom"
import Floor from "@/three-widget/my/Floor"
import PathUtils from "@/three-widget/PathUtils"
import SimplePump from "@/three-widget/my/SimplePump"
import SpriteRectText from "@/three-widget/my/text/SpriteRectText"
import SimpleValve from "@/three-widget/my/pipe/SimpleValve"
import Pipe from "@/three-widget/my/pipe/Pipe"
import SimplePipe from "@/three-widget/my/pipe/SimplePipe"
import Fan3 from "@/three-widget/my/Fan3"
import SimplePumpBase from "@/three-widget/my/SimplePumpBase"
import PipePlug from "@/three-widget/my/pipe/PipePlug"
import {LineGeometry} from "three/examples/jsm/lines/LineGeometry"
import {Line2} from "three/examples/jsm/lines/Line2"
import {LineMaterial} from "three/examples/jsm/lines/LineMaterial"
import PlaneRectText from "@/three-widget/my/text/PlaneRectText"
import SimpleSensor from "@/three-widget/my/SimpleSensor"
import FlowMeter from "@/three-widget/my/pipe/FlowMeter"
import PiezoMeter from "@/three-widget/my/pipe/PiezoMeter"


export default class ThreeProject extends ThreeCore {

    private readonly orbit: OrbitControls

    /* region 常量 */
    private floorLength = 40000
    private floorWidth = 28000

    private waterPipeR = 70
    private waterPipeRectR = 200

    private waterPipeOffsetSquareTop = 500


    private mainSmokePipeR = 500
    private mainSmokePipeRectR = 800
    private channelSmokePipeR = 400
    private channelSmokePipeRectR = 600
    private mainSmokePipeOffsetXOfRoom = 2500
    private mainOutSmokePipeOffsetYOfRoom = 1200
    private mainOutSmokePipeOffsetYOfFloor = 1000

    private roomOptions = {
        squareLength: 8000,
        squareHeight: 5000,
        squareWidth: 12000,
        squareThickness: 80,
        windowHoleRadius: 400,
        inHoleRadius: this.channelSmokePipeR,
        rows: 1,
        columns: 3,
        tiers: 2,
        wallColor: 0x6aab73,
        wallOpacity: 0.9,
        topColor: 0x6aab73,
        topOpacity: 0.5, //todo 应该为0.5, 调试方便暂设0
        logo: true,
    }
    private roomOffsetFloorMinX = 4000

    private fanOffsetZ0 = 2000
    private fanOffsetXOfMainOutSmokePipe = 2000

    private pumpBaseLength = 1800
    private pumpBaseHeight = 1000
    private pumpBaseWidth = 800

    private cabinetOffsetXOfFloorMaxX = -5000
    private cabinetX = this.floorLength / 2 + this.cabinetOffsetXOfFloorMaxX
    private cabinetZ = 5000


    /* endregion */

    /* region three实体 */
    private room: DeodorizeRoom | null = null
    private mainInSmokePipe: SimplePipe | null = null
    private mainOutSmokePipe: SimplePipe | null = null
    private tier1InPipe: SimplePipe | null = null
    private tier2InPipe: SimplePipe | null = null

    private smokeInFlowMeter: FlowMeter | null = null
    private smokeInFlowMeterText: SpriteRectText | null = null

    private smokeInPiezoMeter: PiezoMeter | null = null
    private smokeInPiezoMeterText: SpriteRectText | null = null


    private outChannel1Pipe: SimplePipe | null = null
    private outChannel2Pipe: SimplePipe | null = null
    private fan1: Fan3 | null = null
    private fan2: Fan3 | null = null
    private mainOutSmokePipe2: SimplePipe | null = null
    private chimney: Chimney | null = null

    private beforeWash1Pump: SimplePump | null = null
    private beforeWash2Pump: SimplePump | null = null

    private ferment1Pump: SimplePump | null = null
    private ferment2Pump: SimplePump | null = null
    private ferment3Pump: SimplePump | null = null
    private ferment4Pump: SimplePump | null = null

    private waterValve: SimpleValve | null = null

    //液位显示
    private liquidLevelSensorText: PlaneRectText | null = null
    //温度显示
    private temperatureSensorText: PlaneRectText | null = null
    //ph显示
    private phSensorText: PlaneRectText | null = null
    //电导率显示
    private conductivitySensorText: PlaneRectText | null = null
    //风机频率显示
    private fanFrequencyText: SpriteRectText | null = null

    /* endregion */

    constructor(dom: HTMLElement) {

        super(dom, {
            cameraOptions: {
                fov: 38,
                near: 0.01,
                far: 300000
            }
        })

        this.scene.background = new THREE.Color(0x062469)

        this.camera.position.set(-4000, 20000, 44000)

        const ambientLight = new THREE.AmbientLight(0xffffff, 3)
        this.scene.add(ambientLight)

        const directionalLight1 = new THREE.DirectionalLight(0xffffff, 5)
        directionalLight1.position.set(0, 10000, 20000)
        this.scene.add(directionalLight1)

        const directionalLight2 = new THREE.DirectionalLight(0xffffff, 4)
        directionalLight2.position.set(0, 10000, -20000)
        this.scene.add(directionalLight2)

        this.orbit = new OrbitControls(this.camera, this.renderer.domElement)

        this.orbit.target.y = 6000
        this.orbit.update()

        this.addFloor()
        this.room = this.addAndGetRoom()
        this.addSmokeInPath()
        this.addSmokeOutPath()
        this.addPumps()
        this.addSensors()
    }

    protected init() {
    }


    private addFloor() {
        const floor = new Floor("地面", {
            length: this.floorLength,
            width: this.floorWidth,
        })
        //地面下沉1, 减少与地面物体的接触, 会产生闪烁
        floor.position.y = -1
        this.scene.add(floor)
    }

    private addAndGetRoom() {
        const room = new DeodorizeRoom("除臭车间", this.roomOptions)
        const box = room.getBox()
        room.position.x = -((this.floorLength - box.xLength) / 2 - this.roomOffsetFloorMinX)
        this.scene.add(room)
        return room
    }


    private addSmokeInPath() {
        const roomBox = this.room!.getBox()

        const tier1HoleY = this.roomOptions.squareHeight - this.roomOptions.squareHeight / 4
        const tier2HoleY = this.roomOptions.squareHeight * this.roomOptions.tiers - this.roomOptions.squareHeight / 4

        //主进气管道在车间左侧2.5米
        const mainPipeX = roomBox.minX - this.mainSmokePipeOffsetXOfRoom
        const mainPipeY = tier1HoleY
        //主管道Z起点在车间后侧2米
        const mainPipeStartZ = roomBox.minZ - 2000
        //主管道Z终点比车间中间大 1000
        const mainPipeEndZ = roomBox.centerZ + 1000


        const mainInSmokePath = new PathUtils()
        mainInSmokePath.push([mainPipeX, mainPipeY, mainPipeStartZ])
        //终点超出车间中点1米
        mainInSmokePath.push([mainInSmokePath.last.x, mainInSmokePath.last.y, mainPipeEndZ])
        const pipe = new SimplePipe("主进气管道", {
            points: mainInSmokePath.points,
            radius: this.mainSmokePipeR,
            tubularSegments: 1,
            opacity: 1,
        })
        this.mainInSmokePipe = pipe
        this.scene.add(pipe)


        //添加管道尽头的堵头, 参数是试出来的
        const plug = new PipePlug("堵头", {pipeRadius: this.mainSmokePipeR})
        plug.position.x = pipe.curveEnd.x
        plug.position.y = pipe.curveEnd.y
        plug.position.z = pipe.curveEnd.z - 100

        plug.rotateY(Math.PI)
        plug.rotateX(Math.PI * 0.5)
        this.scene.add(plug)


        const smokeInFlowMeter = new FlowMeter("风量", {horizontalRadius: this.mainSmokePipeR})
        smokeInFlowMeter.rotateY(Math.PI * -0.5)
        smokeInFlowMeter.position.x = mainPipeX
        smokeInFlowMeter.position.y = mainPipeY
        smokeInFlowMeter.position.z = -5000
        this.scene.add(smokeInFlowMeter)
        this.smokeInFlowMeter = smokeInFlowMeter

        const smokeInFlowMeterText = new SpriteRectText("风量显示", "流量: %s m³/h", " N/A ")
        smokeInFlowMeterText.position.x = smokeInFlowMeter.position.x
        smokeInFlowMeterText.position.y = smokeInFlowMeter.position.y + 1600
        smokeInFlowMeterText.position.z = smokeInFlowMeter.position.z
        this.smokeInFlowMeterText = smokeInFlowMeterText
        this.scene.add(smokeInFlowMeterText)


        const smokeInPiezoMeter = new PiezoMeter("风压", {horizontalRadius: this.mainSmokePipeR})
        smokeInPiezoMeter.rotateY(Math.PI * -0.5)
        smokeInPiezoMeter.position.x = mainPipeX
        smokeInPiezoMeter.position.y = mainPipeY
        smokeInPiezoMeter.position.z = -3000
        this.scene.add(smokeInPiezoMeter)
        this.smokeInPiezoMeter = smokeInPiezoMeter

        const smokeInPiezoMeterText = new SpriteRectText("风压显示", "压力: %s bar", " N/A ")
        smokeInPiezoMeterText.position.x = smokeInPiezoMeter.position.x
        smokeInPiezoMeterText.position.y = smokeInPiezoMeter.position.y + 1600
        smokeInPiezoMeterText.position.z = smokeInPiezoMeter.position.z
        this.smokeInPiezoMeterText = smokeInPiezoMeterText
        this.scene.add(smokeInPiezoMeterText)


        const tier1InPath = new PathUtils()
        tier1InPath.push([mainPipeX, mainPipeY, roomBox.centerZ])
        //到车间左侧墙
        //todo z坐标要减去DeodorizeRoom中侧墙的厚度, 是 z坐标要减去DeodorizeRoom中侧墙的厚度 类墙体位置计算问题, 后续再修正
        //tier1InPath.push([roomBox.minX, tier1InPath.last.y, tier1InPath.last.z - 40])
        tier1InPath.push([roomBox.minX, tier1InPath.last.y, 0])
        const tier1InPipe = new SimplePipe("一层进气管道", {
            points: tier1InPath.points,
            radius: this.channelSmokePipeR,
            tubularSegments: 1,
            opacity: 1,
        })
        this.tier1InPipe = tier1InPipe
        this.scene.add(tier1InPipe)


        const tier2InPath = new PathUtils()
        tier2InPath.push([mainPipeX, mainPipeY, roomBox.centerZ])
        tier2InPath.push([tier2InPath.last.x, tier2HoleY - this.channelSmokePipeRectR, tier2InPath.last.z])
        //转弯, 由下向右
        tier2InPath.pushQuarterArc("Y2X1", this.channelSmokePipeRectR)
        //到车间左侧墙
        //todo z坐标要减去DeodorizeRoom中侧墙的厚度, 是 z坐标要减去DeodorizeRoom中侧墙的厚度 类墙体位置计算问题, 后续再修正
        //tier2InPath.push([roomBox.minX, tier2HoleY, tier2InPath.last.z - 40])
        tier2InPath.push([roomBox.minX, tier2HoleY, 0])
        const tier2InPipe = new SimplePipe("二层进气管道", {
            points: tier2InPath.points,
            radius: this.channelSmokePipeR,
            opacity: 1,
        })
        this.tier2InPipe = tier2InPipe
        this.scene.add(tier2InPipe)
    }

    private addSmokeOutPath() {
        const roomBox = this.room!.getBox()

        const tier1HoleY = this.roomOptions.squareHeight - this.roomOptions.squareHeight / 4
        const tier2HoleY = this.roomOptions.squareHeight * this.roomOptions.tiers - this.roomOptions.squareHeight / 4


        //主排气管道在车间右侧2.5米
        const mainPipeX = roomBox.maxX + this.mainSmokePipeOffsetXOfRoom
        const mainPipeY = this.mainOutSmokePipeOffsetYOfFloor

        const channel1Z = roomBox.centerZ + this.fanOffsetZ0
        const channel2Z = roomBox.centerZ - this.fanOffsetZ0
        const mainPipeStartZ = channel1Z + 1000
        const mainPipeEndZ = channel2Z - 1000


        const mainOutSmokePath = new PathUtils()
        mainOutSmokePath.push([mainPipeX, mainPipeY, mainPipeStartZ])
        //终点超出车间中点1米
        mainOutSmokePath.push([mainOutSmokePath.last.x, mainOutSmokePath.last.y, mainPipeEndZ])
        const mainOutSmokePipe = new SimplePipe("主排气管道", {
            points: mainOutSmokePath.points,
            radius: this.mainSmokePipeR,
            tubularSegments: 1,
            opacity: 1,
        })
        this.mainOutSmokePipe = mainOutSmokePipe
        this.scene.add(mainOutSmokePipe)

        //添加管道起点堵头, 堵头是圆内凹, 半径为 管半径的2位
        const plug1 = new PipePlug("堵头", {pipeRadius: this.mainSmokePipeR})
        plug1.position.x = mainOutSmokePipe.curveStart.x
        plug1.position.y = mainOutSmokePipe.curveStart.y
        plug1.position.z = mainOutSmokePipe.curveStart.z - 100

        plug1.rotateY(Math.PI)
        plug1.rotateX(Math.PI * 0.5)
        this.scene.add(plug1)

        const plug2 = plug1.clone()
        plug2.position.x = mainOutSmokePipe.curveEnd.x
        plug2.position.y = mainOutSmokePipe.curveEnd.y
        plug2.position.z = mainOutSmokePipe.curveEnd.z + 100
        plug2.rotateZ(Math.PI)
        this.scene.add(plug2)


        const tier1InPath = new PathUtils()
        //todo z坐标要减去DeodorizeRoom中侧墙的厚度, 是 z坐标要减去DeodorizeRoom中侧墙的厚度 类墙体位置计算问题, 后续再修正
        tier1InPath.push([roomBox.maxX, tier1HoleY, roomBox.centerZ - 40])
        tier1InPath.push([mainPipeX, tier1InPath.last.y, tier1InPath.last.z])
        const tier1InPipe = new SimplePipe("一层进气管道", {
            points: tier1InPath.points,
            radius: this.channelSmokePipeR,
            tubularSegments: 1,
            opacity: 1,
        })
        this.tier1InPipe = tier1InPipe
        this.scene.add(tier1InPipe)


        const tier2InPath = new PathUtils()
        //todo z坐标要减去DeodorizeRoom中侧墙的厚度, 是 z坐标要减去DeodorizeRoom中侧墙的厚度 类墙体位置计算问题, 后续再修正
        tier2InPath.push([roomBox.maxX, tier2HoleY, roomBox.centerZ - 40])
        tier2InPath.push([mainPipeX - this.channelSmokePipeRectR, tier2InPath.last.y, tier2InPath.last.z])
        //转弯, 由左向下
        tier2InPath.pushQuarterArc("X2Y2", this.channelSmokePipeRectR)
        tier2InPath.push([tier2InPath.last.x, this.mainOutSmokePipeOffsetYOfFloor, tier2InPath.last.z])
        const tier2InPipe = new SimplePipe("二层进气管道", {
            points: tier2InPath.points,
            radius: this.channelSmokePipeR,
            opacity: 1,
        })
        this.tier2InPipe = tier2InPipe
        this.scene.add(tier2InPipe)


        const fanX = mainPipeX + this.fanOffsetXOfMainOutSmokePipe

        const fan1 = new Fan3("风机1")
        fan1.rotateY(Math.PI * 0.5)
        fan1.position.x = fanX
        fan1.position.y = mainPipeY
        fan1.position.z = channel1Z
        this.fan1 = fan1
        this.scene.add(fan1)


        const fan2 = new Fan3("风机2")
        fan2.rotateY(Math.PI * 0.5)
        fan2.position.x = fanX
        fan2.position.y = mainPipeY
        fan2.position.z = channel2Z
        this.fan2 = fan2
        this.scene.add(fan2)


        const fan1Box = fan1.getBox()

        const outChannel1Path = new PathUtils()
        outChannel1Path.push([mainPipeX, mainPipeY, channel1Z])
        outChannel1Path.push([fan1Box.minX, outChannel1Path.last.y, outChannel1Path.last.z])
        const outChannel1Pipe = new SimplePipe("排气支路1道道1", {
            points: outChannel1Path.points,
            radius: this.channelSmokePipeR,
            tubularSegments: 1,
            opacity: 1,
        })
        this.outChannel1Pipe = outChannel1Pipe
        this.scene.add(outChannel1Pipe)

        const outChannel2Path = new PathUtils()
        outChannel2Path.push([mainPipeX, mainPipeY, channel2Z])
        outChannel2Path.push([fan1Box.minX, outChannel2Path.last.y, outChannel2Path.last.z])
        const outChannel2Pipe = new SimplePipe("排气支路2道道1", {
            points: outChannel2Path.points,
            radius: this.channelSmokePipeR,
            tubularSegments: 1,
            opacity: 1,
        })
        this.outChannel2Pipe = outChannel2Pipe
        this.scene.add(outChannel2Pipe)


        const mainOutSmokePipe2StartZ = channel1Z + 500


        const chimneyX = fanX + 5000
        const chimneyZ = channel2Z - 2000

        // 主排气管道2
        const mainOutSmokePath2 = new PathUtils()
        // todo channel1FanBox 的Y值获取不正确, 先临时使用固定值, 后期再查找问题
        //mainOutSmokePath2.push([fanX, channel1FanBox.maxY + this.mainSmokePipeR, mainOutSmokePipe2StartZ])
        mainOutSmokePath2.push([fanX, 2600, mainOutSmokePipe2StartZ])
        mainOutSmokePath2.push([mainOutSmokePath2.last.x, mainOutSmokePath2.last.y, chimneyZ + this.mainSmokePipeRectR])
        mainOutSmokePath2.pushQuarterArc("Z1X1", this.mainSmokePipeRectR)
        mainOutSmokePath2.push([chimneyX, mainOutSmokePath2.last.y, mainOutSmokePath2.last.z])
        const mainOutSmokePipe2 = new SimplePipe("主排气管道2", {
            points: mainOutSmokePath2.points,
            radius: this.mainSmokePipeR,
            tubularSegments: 64,
            opacity: 1,
        })
        this.mainOutSmokePipe2 = mainOutSmokePipe2
        this.scene.add(mainOutSmokePipe2)

        //添加管道尽头的堵头, 参数是试出来的
        const plug = new PipePlug("堵头", {pipeRadius: this.mainSmokePipeR})
        plug.position.x = mainOutSmokePipe2.curveStart.x
        plug.position.y = mainOutSmokePipe2.curveStart.y
        plug.position.z = mainOutSmokePipe2.curveStart.z - 100

        plug.rotateY(Math.PI)
        plug.rotateX(Math.PI * 0.5)
        this.scene.add(plug)

        const chimney = new Chimney("烟囱")
        chimney.position.x = chimneyX
        chimney.position.z = chimneyZ
        this.chimney = chimney
        this.scene.add(chimney)

    }

    private addPumps() {
        const {pumpBaseLength, pumpBaseHeight, pumpBaseWidth} = this
        const roomBox = this.room!.getBox()


        //水泵大小
        const pumpR = 220
        const pumpH = 600
        const pumpY = pumpBaseHeight

        const baseZ = roomBox.maxZ + this.pumpBaseWidth / 2

        const beforeWashBaseX = roomBox.minX + this.roomOptions.squareLength / 2


        const beforeWashBase = new SimplePumpBase("", {
            length: pumpBaseLength,
            height: pumpBaseHeight,
            width: pumpBaseWidth
        })
        beforeWashBase.position.x = beforeWashBaseX
        beforeWashBase.position.y = pumpBaseHeight / 2
        beforeWashBase.position.z = baseZ
        beforeWashBase.name = "水洗水泵基座"
        this.scene.add(beforeWashBase)

        const beforeWash1X = beforeWashBaseX - pumpBaseLength / 4
        const beforeWash2X = beforeWashBaseX + pumpBaseLength / 4


        const beforeWash1Pump = new SimplePump("预洗1水泵", {radius: pumpR, height: pumpH})
        beforeWash1Pump.position.x = beforeWash1X
        beforeWash1Pump.position.y = pumpY + pumpH / 2
        beforeWash1Pump.position.z = baseZ
        this.beforeWash1Pump = beforeWash1Pump
        this.scene.add(beforeWash1Pump)

        const beforeWash1Path = new PathUtils()
        beforeWash1Path.push([beforeWash1X, pumpH, baseZ])
        beforeWash1Path.push([beforeWash1Path.last.x, this.roomOptions.squareHeight * this.roomOptions.tiers - this.waterPipeOffsetSquareTop - this.waterPipeRectR, beforeWash1Path.last.z])
        beforeWash1Path.pushQuarterArc("Y2Z2", this.waterPipeRectR)
        beforeWash1Path.push([beforeWash1Path.last.x, beforeWash1Path.last.y, roomBox.centerZ])
        const beforeWash1Pipe = new Pipe("预洗1(二层)管道", {points: beforeWash1Path.points, tubularSegments: 120})
        this.scene.add(beforeWash1Pipe)


        const beforeWash2Pump = new SimplePump("预洗2水泵", {radius: pumpR, height: pumpH})
        beforeWash2Pump.position.x = beforeWash2X
        beforeWash2Pump.position.y = pumpY + pumpH / 2
        beforeWash2Pump.position.z = baseZ
        this.beforeWash2Pump = beforeWash2Pump
        this.scene.add(beforeWash2Pump)

        const beforeWash2Path = new PathUtils()
        beforeWash2Path.push([beforeWash2X, pumpH, baseZ])
        beforeWash2Path.push([beforeWash2Path.last.x, this.roomOptions.squareHeight - this.waterPipeOffsetSquareTop - this.waterPipeRectR, beforeWash2Path.last.z])
        beforeWash2Path.pushQuarterArc("Y2Z2", this.waterPipeRectR)
        beforeWash2Path.push([beforeWash2Path.last.x, beforeWash2Path.last.y, roomBox.centerZ])
        const beforeWash2Pipe = new Pipe("预洗2(一层)管道", {points: beforeWash2Path.points, tubularSegments: 120})
        this.scene.add(beforeWash2Pipe)


        const fermentBase1X = roomBox.minX + this.roomOptions.squareLength + this.roomOptions.squareLength / 2
        const fermentBase2X = roomBox.minX + this.roomOptions.squareLength + this.roomOptions.squareLength + this.roomOptions.squareLength / 2

        const ferment1X = fermentBase1X - pumpBaseLength / 4
        const ferment2X = fermentBase1X + pumpBaseLength / 4
        const ferment3X = fermentBase2X - pumpBaseLength / 4
        const ferment4X = fermentBase2X + pumpBaseLength / 4

        const fermentBase1 = new SimplePumpBase("", {
            length: pumpBaseLength,
            height: pumpBaseHeight,
            width: pumpBaseWidth
        })
        fermentBase1.position.x = fermentBase1X
        fermentBase1.position.y = pumpBaseHeight / 2
        fermentBase1.position.z = baseZ
        fermentBase1.name = "生物水泵基座1"
        this.scene.add(fermentBase1)

        const ferment1Pump = new SimplePump("生物水泵1", {radius: pumpR, height: pumpH})
        ferment1Pump.position.x = ferment1X
        ferment1Pump.position.y = pumpY + pumpH / 2
        ferment1Pump.position.z = baseZ
        this.ferment1Pump = ferment1Pump
        this.scene.add(ferment1Pump)

        const fermentPath = new PathUtils()
        fermentPath.push([ferment1X, pumpH, baseZ])
        fermentPath.push([fermentPath.last.x, this.roomOptions.squareHeight * this.roomOptions.tiers - this.waterPipeOffsetSquareTop - this.waterPipeRectR, fermentPath.last.z])
        fermentPath.pushQuarterArc("Y2Z2", this.waterPipeRectR)
        fermentPath.push([fermentPath.last.x, fermentPath.last.y, roomBox.centerZ])
        const fermentPipe = new Pipe("生物1(room1二层)管道", {points: fermentPath.points, tubularSegments: 120})
        this.scene.add(fermentPipe)


        const ferment2Pump = new SimplePump("生物水泵2", {radius: pumpR, height: pumpH})
        ferment2Pump.position.x = ferment2X
        ferment2Pump.position.y = pumpY + pumpH / 2
        ferment2Pump.position.z = baseZ
        this.ferment2Pump = ferment2Pump
        this.scene.add(ferment2Pump)

        const ferment2Path = new PathUtils()
        ferment2Path.push([ferment2X, pumpH, baseZ])
        ferment2Path.push([ferment2Path.last.x, this.roomOptions.squareHeight - this.waterPipeOffsetSquareTop - this.waterPipeRectR, ferment2Path.last.z])
        ferment2Path.pushQuarterArc("Y2Z2", this.waterPipeRectR)
        ferment2Path.push([ferment2Path.last.x, ferment2Path.last.y, roomBox.centerZ])
        const ferment2Pipe = new Pipe("生物2(room1一层)管道", {points: ferment2Path.points, tubularSegments: 120})
        this.scene.add(ferment2Pipe)


        const fermentBase2 = new SimplePumpBase("", {
            length: pumpBaseLength,
            height: pumpBaseHeight,
            width: pumpBaseWidth
        })
        fermentBase2.position.x = fermentBase2X
        fermentBase2.position.y = pumpBaseHeight / 2
        fermentBase2.position.z = baseZ
        fermentBase2.name = "生物水泵基座2"
        this.scene.add(fermentBase2)

        const ferment3Pump = new SimplePump("生物水泵3", {radius: pumpR, height: pumpH})
        ferment3Pump.position.x = fermentBase2X - pumpBaseLength / 4
        ferment3Pump.position.y = pumpY + pumpH / 2
        ferment3Pump.position.z = baseZ
        this.ferment3Pump = ferment3Pump
        this.scene.add(ferment3Pump)

        const ferment3Path = new PathUtils()
        ferment3Path.push([ferment3X, pumpH, baseZ])
        ferment3Path.push([ferment3Path.last.x, this.roomOptions.squareHeight * this.roomOptions.tiers - this.waterPipeOffsetSquareTop - this.waterPipeRectR, ferment3Path.last.z])
        ferment3Path.pushQuarterArc("Y2Z2", this.waterPipeRectR)
        ferment3Path.push([ferment3Path.last.x, ferment3Path.last.y, roomBox.centerZ])
        const ferment3Pipe = new Pipe("生物3(room2二层)管道", {points: ferment3Path.points, tubularSegments: 120})
        this.scene.add(ferment3Pipe)


        const ferment4Pump = new SimplePump("生物水泵4", {radius: pumpR, height: pumpH})
        ferment4Pump.position.x = fermentBase2X + pumpBaseLength / 4
        ferment4Pump.position.y = pumpY + pumpH / 2
        ferment4Pump.position.z = baseZ
        this.ferment4Pump = ferment4Pump
        this.scene.add(ferment4Pump)

        const ferment4Path = new PathUtils()
        ferment4Path.push([ferment4X, pumpH, baseZ])
        ferment4Path.push([ferment4Path.last.x, this.roomOptions.squareHeight - this.waterPipeOffsetSquareTop - this.waterPipeRectR, ferment4Path.last.z])
        ferment4Path.pushQuarterArc("Y2Z2", this.waterPipeRectR)
        ferment4Path.push([ferment4Path.last.x, ferment4Path.last.y, roomBox.centerZ])
        const ferment4Pipe = new Pipe("生物4(room2一层)管道", {points: ferment4Path.points, tubularSegments: 120})
        this.scene.add(ferment4Pipe)


        const waterPipeOffsetYOfFloor = 300
        const waterPipeOffsetZOfRoomMaxZ = 3000
        const waterPipeZ = roomBox.maxZ + waterPipeOffsetZOfRoomMaxZ

        const waterPath = new PathUtils()
        waterPath.push([-this.floorLength / 2, waterPipeOffsetYOfFloor, waterPipeZ])
        waterPath.push([roomBox.maxX, waterPath.last.y, waterPath.last.z])
        const waterPipe = new Pipe("主供水管", {points: waterPath.points})
        this.scene.add(waterPipe)


        const waterValve = new SimpleValve("主供水阀")
        waterValve.rotateZ(Math.PI * 0.5)
        waterValve.position.x = -(this.floorLength / 2 - 3000)
        waterValve.position.y = waterPipeOffsetYOfFloor
        waterValve.position.z = waterPipeZ
        this.scene.add(waterValve)

        const beforeWashWaterPath = new PathUtils()
        beforeWashWaterPath.push([beforeWashBaseX, waterPipeOffsetYOfFloor, waterPipeZ])
        beforeWashWaterPath.push([beforeWashWaterPath.last.x, beforeWashWaterPath.last.y, roomBox.maxZ])
        const beforeWashWaterPipe = new Pipe("预洗供水管", {points: beforeWashWaterPath.points})
        this.scene.add(beforeWashWaterPipe)


        const wash1AndWash2WaterPath = new PathUtils()
        wash1AndWash2WaterPath.push([fermentBase1X, waterPipeOffsetYOfFloor, waterPipeZ])
        wash1AndWash2WaterPath.push([wash1AndWash2WaterPath.last.x, wash1AndWash2WaterPath.last.y, roomBox.maxZ])
        const wash1AndWash2WaterPipe = new Pipe("生物1生物2供水管", {points: wash1AndWash2WaterPath.points})
        this.scene.add(wash1AndWash2WaterPipe)

        const wash3AndWash4WaterPath = new PathUtils()
        wash3AndWash4WaterPath.push([fermentBase2X, waterPipeOffsetYOfFloor, waterPipeZ])
        wash3AndWash4WaterPath.push([wash3AndWash4WaterPath.last.x, wash3AndWash4WaterPath.last.y, roomBox.maxZ])
        const wash3AndWash4WaterPipe = new Pipe("生物3生物4供水管", {points: wash3AndWash4WaterPath.points})
        this.scene.add(wash3AndWash4WaterPipe)

    }

    private addSensors() {

        const temperatureSensorY = 8000
        const liquidLevelSensorY = 4000
        const phSensorY = 3000
        const conductivitySensorTextY = 2000

        const roomBox = this.room!.getBox()


        /* region 温度 */
        const temperatureSensor = new SimpleSensor("温度")
        temperatureSensor.rotateZ(Math.PI * 0.5)
        temperatureSensor.position.x = roomBox.maxX - (temperatureSensor.options.length * 0.75)
        temperatureSensor.position.y = temperatureSensorY
        temperatureSensor.position.z = roomBox.centerZ + 5000
        this.scene.add(temperatureSensor)

        const temperatureSensorBox = temperatureSensor.getBox()

        const temperatureSensorText = new PlaneRectText("温度显示", {template: "温度: %s °C"})
        temperatureSensorText.rotateY(Math.PI * 0.5)
        temperatureSensorText.position.x = temperatureSensorBox.maxX
        temperatureSensorText.position.y = temperatureSensorY
        temperatureSensorText.position.z = temperatureSensorBox.centerZ - 200
        this.temperatureSensorText = temperatureSensorText
        this.scene.add(temperatureSensorText)
        /* endregion */


        /* region 液位 */
        const liquidLevelSensor = new SimpleSensor("液位")
        liquidLevelSensor.rotateZ(Math.PI * 0.5)
        liquidLevelSensor.position.x = roomBox.maxX - (liquidLevelSensor.options.length * 0.75)
        liquidLevelSensor.position.y = liquidLevelSensorY
        liquidLevelSensor.position.z = roomBox.centerZ + 5000
        this.scene.add(liquidLevelSensor)

        const liquidLevelSensorBox = liquidLevelSensor.getBox()

        const liquidLevelSensorText = new PlaneRectText("液位显示", {template: "液位: %s m"})
        liquidLevelSensorText.rotateY(Math.PI * 0.5)
        liquidLevelSensorText.position.x = liquidLevelSensorBox.maxX
        liquidLevelSensorText.position.y = liquidLevelSensorY
        liquidLevelSensorText.position.z = liquidLevelSensorBox.centerZ - 200
        this.liquidLevelSensorText = liquidLevelSensorText
        this.scene.add(liquidLevelSensorText)
        /* endregion */


        /* region PH */
        const phSensor = new SimpleSensor("PH")
        phSensor.rotateZ(Math.PI * 0.5)
        phSensor.position.x = roomBox.maxX - (phSensor.options.length * 0.75)
        phSensor.position.y = phSensorY
        phSensor.position.z = roomBox.centerZ + 5000
        this.scene.add(phSensor)

        const phSensorBox = phSensor.getBox()

        const phSensorText = new PlaneRectText("PH显示", {template: "PH: %s"})
        phSensorText.rotateY(Math.PI * 0.5)
        phSensorText.position.x = phSensorBox.maxX
        phSensorText.position.y = phSensorY
        phSensorText.position.z = phSensorBox.centerZ - 200
        this.phSensorText = phSensorText
        this.scene.add(phSensorText)
        /* endregion */


        /* region 电导率 */
        const conductivitySensor = new SimpleSensor("电导率")
        conductivitySensor.rotateZ(Math.PI * 0.5)
        conductivitySensor.position.x = roomBox.maxX - (conductivitySensor.options.length * 0.75)
        conductivitySensor.position.y = conductivitySensorTextY
        conductivitySensor.position.z = roomBox.centerZ + 5000
        this.scene.add(conductivitySensor)

        const conductivitySensorBox = conductivitySensor.getBox()

        const conductivitySensorText = new PlaneRectText("电导率显示", {template: "电导率: %s ppm"})
        conductivitySensorText.rotateY(Math.PI * 0.5)
        conductivitySensorText.position.x = conductivitySensorBox.maxX
        conductivitySensorText.position.y = conductivitySensorTextY
        conductivitySensorText.position.z = conductivitySensorBox.centerZ - 200
        this.conductivitySensorText = conductivitySensorText
        this.scene.add(conductivitySensorText)
        /* endregion */


        const fan1Box = this.fan1!.getBox()
        const fan2Box = this.fan2!.getBox()


        const fan1LinePath = new PathUtils()
        fan1LinePath.push([fan1Box.maxX, fan1Box.centerY, fan1Box.centerZ])
        fan1LinePath.push([fan1LinePath.last.x + 1000, fan1LinePath.last.y, fan1LinePath.last.z])
        fan1LinePath.push([fan1LinePath.last.x, fan1LinePath.last.y, 0])
        fan1LinePath.push([fan1LinePath.last.x + 1000, fan1LinePath.last.y, fan1LinePath.last.z])

        const material = new LineMaterial({
            color: 0xffff00,
            linewidth: 4,
        })


        const fan1LineGeo = new LineGeometry()

        const fan1LineArr: number[] = []

        fan1LinePath.points.forEach(item => fan1LineArr.push(...item))
        fan1LineGeo.setPositions(fan1LineArr)


        //材质的分辨率必须设置，要不显示的线宽度不正确
        material.resolution.set(window.innerWidth, window.innerHeight)
        const line1 = new Line2(fan1LineGeo, material)
        this.scene.add(line1)


        const fan2LinePath = new PathUtils()
        fan2LinePath.push([fan2Box.maxX, fan2Box.centerY, fan2Box.centerZ])
        fan2LinePath.push([fan2LinePath.last.x + 1000, fan2LinePath.last.y, fan2LinePath.last.z])
        fan2LinePath.push([fan2LinePath.last.x, fan2LinePath.last.y, 0])

        const fan2LineGeo = new LineGeometry()

        const arr: number[] = []

        fan2LinePath.points.forEach(item => arr.push(...item))
        fan2LineGeo.setPositions(arr)

        //材质的分辨率必须设置，要不显示的线宽度不正确
        material.resolution.set(window.innerWidth, window.innerHeight)
        const line2 = new Line2(fan2LineGeo, material)
        this.scene.add(line2)


        const sphereGeo = new THREE.SphereGeometry(30)

        const sphereMat = new THREE.MeshPhongMaterial({
            color: 0xffff00
        })

        const sphere = new THREE.Mesh(sphereGeo, sphereMat)
        sphere.position.x = fan1LinePath.last.x
        sphere.position.y = fan1LinePath.last.y
        sphere.position.z = fan1LinePath.last.z
        this.scene.add(sphere)


        const fanFrequencyText = new SpriteRectText("风机频率显示", "风机频率: %s hz", " N/A ")
        fanFrequencyText.position.x = fan1LinePath.last.x
        fanFrequencyText.position.y = fan1LinePath.last.y + 300
        fanFrequencyText.position.z = fan1LinePath.last.z
        this.fanFrequencyText = fanFrequencyText
        this.scene.add(fanFrequencyText)
    }






}
