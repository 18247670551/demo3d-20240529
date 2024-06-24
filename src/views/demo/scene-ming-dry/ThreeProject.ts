import * as THREE from "three"
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls"
import {GUI} from "dat.gui"
import Room from "@/three-widget/my/Room"
import Truck from "@/three-widget/my/Truck"
import HeatingFan from "@/three-widget/my/HeatingFan"
import CirculatingFan from "@/three-widget/my/CirculatingFan"
import PlaneText from "@/three-widget/my/text/PlaneText"
import SpriteText from "@/three-widget/my/text/SpriteText"
import ThreeCore from "@/three-widget/ThreeCore"


export default class ThreeProject extends ThreeCore{

    private readonly orbit: OrbitControls

    private readonly room: Room
    private readonly truck: Truck
    private readonly heatingFan1: HeatingFan
    private readonly heatingFan2: HeatingFan
    private readonly heatingFan3: HeatingFan
    private readonly heatingFan4: HeatingFan
    private readonly heatingFan5: HeatingFan
    private readonly heatingFan6: HeatingFan

    private readonly circulatingFan1: CirculatingFan
    private readonly circulatingFan2: CirculatingFan
    private readonly circulatingFan3: CirculatingFan
    private readonly circulatingFan4: CirculatingFan
    private readonly circulatingFan5: CirculatingFan
    private readonly circulatingFan6: CirculatingFan
    private readonly circulatingFan7: CirculatingFan
    private readonly circulatingFan8: CirculatingFan


    private readonly temperature1: PlaneText
    private readonly temperature2: PlaneText
    private readonly temperature3: PlaneText
    private readonly temperature4: PlaneText
    private readonly temperature5: PlaneText
    private readonly temperature6: PlaneText
    private readonly temperature7: SpriteText
    private readonly temperature8: SpriteText

    private readonly humidity1: SpriteText
    private readonly humidity2: SpriteText


    constructor(dom: HTMLElement) {

        super(dom, {
            cameraOptions: {
                s: 6000,
                near: 0.1,
                far: 300000
            }
        })

        this.scene.background = new THREE.Color(0x062469)

        this.camera.position.set(-6000, 20000, 50000)


        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
        this.scene.add(ambientLight)


        this.orbit = new OrbitControls(this.camera, this.renderer.domElement)
        this.orbit.target.y = 3000
        this.orbit.update()


        const room = new Room("烘干车间")
        this.scene.add(room)
        this.room = room


        const truck = new Truck("汽车")
        this.truck = truck
        this.scene.add(truck)

        const heatingFans = this.addHeatingFan()
        this.heatingFan1 = heatingFans[0]
        this.heatingFan2 = heatingFans[1]
        this.heatingFan3 = heatingFans[2]
        this.heatingFan4 = heatingFans[3]
        this.heatingFan5 = heatingFans[4]
        this.heatingFan6 = heatingFans[5]

        const circulatingFans = this.addCirculatingFan()
        this.circulatingFan1 = circulatingFans[0]
        this.circulatingFan2 = circulatingFans[1]
        this.circulatingFan3 = circulatingFans[2]
        this.circulatingFan4 = circulatingFans[3]
        this.circulatingFan5 = circulatingFans[4]
        this.circulatingFan6 = circulatingFans[5]
        this.circulatingFan7 = circulatingFans[6]
        this.circulatingFan8 = circulatingFans[7]

        const temperatures = this.addAndGetTemperatures()
        this.temperature1 = temperatures[0] as PlaneText
        this.temperature2 = temperatures[1] as PlaneText
        this.temperature3 = temperatures[2] as PlaneText
        this.temperature4 = temperatures[3] as PlaneText
        this.temperature5 = temperatures[4] as PlaneText
        this.temperature6 = temperatures[5] as PlaneText
        this.temperature7 = temperatures[6] as SpriteText
        this.temperature8 = temperatures[7] as SpriteText

        const humiditys = this.addAndGetHumiditys()
        this.humidity1 = humiditys[0]
        this.humidity2 = humiditys[1]

    }

    protected init(){
        this.addGUI()
    }

    protected onRenderer() {
        //this.orbit.update()
    }


    private addGUI() {

        const gui = new GUI()

        const roomFolder = gui.addFolder('车间控制')
        roomFolder.add(this.room, "openInDoor").name("入口门开")
        roomFolder.add(this.room, "closeInDoor").name("入口门关")
        roomFolder.add(this.room, "openOutDoor").name("出口门开")
        roomFolder.add(this.room, "closeOutDoor").name("出口门关")


        const truckFolder = gui.addFolder('汽车控制')
        truckFolder.add(this.truck, "setLeft").name("置于入口")
        truckFolder.add(this.truck, "setInner").name("置于车间")
        truckFolder.add(this.truck, "setRight").name("置于出口")
        truckFolder.add(this.truck, "runInRoom").name("进入车间")
        truckFolder.add(this.truck, "runOutRoom").name("离开车间")


        const heatingFanFolder = gui.addFolder('加热风机控制')
        heatingFanFolder.add(this.heatingFan1, "run").name("加热风机1运行")
        heatingFanFolder.add(this.heatingFan2, "run").name("加热风机2运行")
        heatingFanFolder.add(this.heatingFan3, "run").name("加热风机3运行")
        heatingFanFolder.add(this.heatingFan4, "run").name("加热风机4运行")
        heatingFanFolder.add(this.heatingFan5, "run").name("加热风机5运行")
        heatingFanFolder.add(this.heatingFan6, "run").name("加热风机6运行")
        heatingFanFolder.add(this.heatingFan1, "stop").name("加热风机1停止")
        heatingFanFolder.add(this.heatingFan2, "stop").name("加热风机2停止")
        heatingFanFolder.add(this.heatingFan3, "stop").name("加热风机3停止")
        heatingFanFolder.add(this.heatingFan4, "stop").name("加热风机4停止")
        heatingFanFolder.add(this.heatingFan5, "stop").name("加热风机5停止")
        heatingFanFolder.add(this.heatingFan6, "stop").name("加热风机6停止")


        const circulatingFanFolder = gui.addFolder('循环风机控制')
        circulatingFanFolder.add(this.circulatingFan1, "run").name("循环风机1运行")
        circulatingFanFolder.add(this.circulatingFan2, "run").name("循环风机2运行")
        circulatingFanFolder.add(this.circulatingFan3, "run").name("循环风机3运行")
        circulatingFanFolder.add(this.circulatingFan4, "run").name("循环风机4运行")
        circulatingFanFolder.add(this.circulatingFan5, "run").name("循环风机5运行")
        circulatingFanFolder.add(this.circulatingFan6, "run").name("循环风机6运行")
        circulatingFanFolder.add(this.circulatingFan7, "run").name("循环风机7运行")
        circulatingFanFolder.add(this.circulatingFan8, "run").name("循环风机8运行")
        circulatingFanFolder.add(this.circulatingFan1, "stop").name("循环风机1停止")
        circulatingFanFolder.add(this.circulatingFan2, "stop").name("循环风机2停止")
        circulatingFanFolder.add(this.circulatingFan3, "stop").name("循环风机3停止")
        circulatingFanFolder.add(this.circulatingFan4, "stop").name("循环风机4停止")
        circulatingFanFolder.add(this.circulatingFan5, "stop").name("循环风机5停止")
        circulatingFanFolder.add(this.circulatingFan6, "stop").name("循环风机6停止")
        circulatingFanFolder.add(this.circulatingFan7, "stop").name("循环风机7停止")
        circulatingFanFolder.add(this.circulatingFan8, "stop").name("循环风机8停止")
    }

    private addAndGetTemperatures() {
        const t1 = new PlaneText("温度1", {iconPath: "/demo/scene-ming/dry/temperature.png"})
        const t2 = new PlaneText("温度2", {iconPath: "/demo/scene-ming/dry/temperature.png"})
        const t3 = new PlaneText("温度3", {iconPath: "/demo/scene-ming/dry/temperature.png"})
        const t4 = new PlaneText("温度4", {iconPath: "/demo/scene-ming/dry/temperature.png"})
        const t5 = new PlaneText("温度5", {iconPath: "/demo/scene-ming/dry/temperature.png"})
        const t6 = new PlaneText("温度6", {iconPath: "/demo/scene-ming/dry/temperature.png"})
        const t7 = new SpriteText("温度7", {iconPath: "/demo/scene-ming/dry/temperature.png"})
        const t8 = new SpriteText("温度8", {iconPath: "/demo/scene-ming/dry/temperature.png"})


        const {roomLength, roomWidth, roomHeight} = this.room.options

        //风扇位置在偏移中心点的总长度的3/4处
        const left = -roomLength / 2 * 0.75
        const right = roomLength / 2 * 0.75
        const front = roomWidth / 2
        const back = -roomWidth / 2

        const halfHeight = roomHeight / 2

        t1.position.x = left
        t1.position.z = front
        t1.position.y = halfHeight

        t2.position.x = 0
        t2.position.z = front
        t2.position.y = halfHeight

        t3.position.x = right
        t3.position.z = front
        t3.position.y = halfHeight

        t4.position.x = left
        t4.position.z = back
        t4.position.y = halfHeight
        t4.rotateY(Math.PI)

        t5.position.x = 0
        t5.position.z = back
        t5.position.y = halfHeight
        t5.rotateY(Math.PI)

        t6.position.x = right
        t6.position.z = back
        t6.position.y = halfHeight
        t6.rotateY(Math.PI)

        t7.position.x = left * 0.5
        t7.position.z = 0
        t7.position.y = roomHeight * 0.62

        t8.position.x = right * 0.5
        t8.position.z = 0
        t8.position.y = roomHeight * 0.62


        this.scene.add(
            t1,
            t2,
            t3,
            t4,
            t5,
            t6,
            t7,
            t8,
        )

        return [
            t1,
            t2,
            t3,
            t4,
            t5,
            t6,
            t7,
            t8,
        ]

    }


    private addAndGetHumiditys() {

        const h1 = new SpriteText("湿度1", {iconPath: "/demo/scene-ming/dry/humidity.png"})
        const h2 = new SpriteText("湿度2", {iconPath: "/demo/scene-ming/dry/humidity.png"})


        const {roomLength, roomWidth, roomHeight} = this.room!.options

        //风扇位置在偏移中心点的总长度的3/4处
        const left = -roomLength / 2 * 0.75
        const right = roomLength / 2 * 0.75


        h1.position.x = left * 0.7
        h1.position.z = 0
        h1.position.y = roomHeight * 0.75

        h2.position.x = right * 0.7
        h2.position.z = 0
        h2.position.y = roomHeight * 0.75

        this.scene.add(
            h1,
            h2,
        )

        return [
            h1,
            h2,
        ]

    }

    private addHeatingFan() {

        const heatingFan1 = new HeatingFan('加热风机1')
        const heatingFan2 = new HeatingFan('加热风机2')
        const heatingFan3 = new HeatingFan('加热风机3')
        const heatingFan4 = new HeatingFan('加热风机4')
        const heatingFan5 = new HeatingFan('加热风机5')
        const heatingFan6 = new HeatingFan('加热风机6')

        const {roomLength, roomWidth} = this.room!.options

        const {boxLength: fanLength, boxWidth: fanWidth,} = heatingFan1.options

        //风扇位置在偏移中心点的总长度的3/4处
        const left = -roomLength / 2 * 0.75
        const right = roomLength / 2 * 0.75
        const front = (roomWidth - fanWidth) / 2
        const back = -(roomWidth - fanWidth) / 2

        heatingFan1.position.x = left
        heatingFan1.position.z = front

        heatingFan2.position.x = 0
        heatingFan2.position.z = front

        heatingFan3.position.x = right
        heatingFan3.position.z = front

        heatingFan4.position.x = left
        heatingFan4.position.z = back

        heatingFan5.position.x = 0
        heatingFan5.position.z = back

        heatingFan6.position.x = right
        heatingFan6.position.z = back

        this.scene.add(
            heatingFan1,
            heatingFan2,
            heatingFan3,
            heatingFan4,
            heatingFan5,
            heatingFan6,
        )

        return [
            heatingFan1,
            heatingFan2,
            heatingFan3,
            heatingFan4,
            heatingFan5,
            heatingFan6,
        ]

    }

    private addCirculatingFan() {

        const circulatingFan1 = new CirculatingFan('循环风机1')
        const circulatingFan2 = new CirculatingFan('循环风机2')
        const circulatingFan3 = new CirculatingFan('循环风机3')
        const circulatingFan4 = new CirculatingFan('循环风机4')
        const circulatingFan5 = new CirculatingFan('循环风机5')
        const circulatingFan6 = new CirculatingFan('循环风机6')
        const circulatingFan7 = new CirculatingFan('循环风机7')
        const circulatingFan8 = new CirculatingFan('循环风机8')

        circulatingFan7.rotateX(Math.PI * 0.5)
        circulatingFan8.rotateX(-Math.PI * 0.5)

        const {roomLength, roomWidth,} = this.room!.options

        const {boxRadius: fanWidth} = circulatingFan1.options


        //风扇位置在偏移中心点的总长度的3/4处
        const left = -roomLength / 2 * 0.75
        const right = roomLength / 2 * 0.75
        const front = (roomWidth - fanWidth) / 2
        const back = -(roomWidth - fanWidth) / 2
        const front1 = roomWidth / 2 * 0.7
        const back1 = -roomWidth / 2 * 0.7

        const y = this.room!.options.roomHeight * 0.8

        circulatingFan1.position.x = left
        circulatingFan1.position.z = front1
        circulatingFan1.position.y = y

        circulatingFan2.position.x = 0
        circulatingFan2.position.z = front1
        circulatingFan2.position.y = y

        circulatingFan3.position.x = right
        circulatingFan3.position.z = front1
        circulatingFan3.position.y = y

        circulatingFan4.position.x = left
        circulatingFan4.position.z = back1
        circulatingFan4.position.y = y

        circulatingFan5.position.x = 0
        circulatingFan5.position.z = back1
        circulatingFan5.position.y = y

        circulatingFan6.position.x = right
        circulatingFan6.position.z = back1
        circulatingFan6.position.y = y


        circulatingFan7.position.x = right
        circulatingFan7.position.z = front
        circulatingFan7.position.y = y * 0.85

        circulatingFan8.position.x = left
        circulatingFan8.position.z = back
        circulatingFan8.position.y = y * 0.85

        this.scene.add(
            circulatingFan1,
            circulatingFan2,
            circulatingFan3,
            circulatingFan4,
            circulatingFan5,
            circulatingFan6,
            circulatingFan7,
            circulatingFan8,
        )

        return [
            circulatingFan1,
            circulatingFan2,
            circulatingFan3,
            circulatingFan4,
            circulatingFan5,
            circulatingFan6,
            circulatingFan7,
            circulatingFan8,
        ]
    }







    private points: Record<string, (value: string) => void> = {
        "1368834975129944068": (value: string) => {
            if (value == "0") {
                //console.log("加热循环风机停止")
                this.heatingFan1?.stop()
                this.heatingFan2?.stop()
                this.heatingFan3?.stop()
                this.heatingFan4?.stop()
                this.heatingFan5?.stop()
                this.heatingFan6?.stop()
            } else {
                //console.log("加热循环风机运行")
                this.heatingFan1?.run()
                this.heatingFan2?.run()
                this.heatingFan3?.run()
                this.heatingFan4?.run()
                this.heatingFan5?.run()
                this.heatingFan6?.run()
            }
        },
        "1368834975129944069": (value: string) => {
            if (value == "0") {
                //console.log("排湿循环风机停止")
                this.circulatingFan1?.stop()
                this.circulatingFan2?.stop()
                this.circulatingFan3?.stop()
                this.circulatingFan4?.stop()
                this.circulatingFan5?.stop()
                this.circulatingFan6?.stop()
                this.circulatingFan7?.stop()
                this.circulatingFan8?.stop()
            } else {
                //console.log("排湿循环风机运行")
                this.circulatingFan1?.run()
                this.circulatingFan2?.run()
                this.circulatingFan3?.run()
                this.circulatingFan4?.run()
                this.circulatingFan5?.run()
                this.circulatingFan6?.run()
                this.circulatingFan7?.run()
                this.circulatingFan8?.run()
            }
        },
        "1368834975129944070": (value: string) => {
            //console.log("照明自动运行")
        },
        "1368834975129944071": (value: string) => {
            //console.log("一门自动开")
        },
        "1368834975129944072": (value: string) => {
            //console.log("二门自动开")
        },
        "1368834975129944073": (value: string) => {
            //console.log("故障提示")
        },
        "1368834975129944077": (value: string) => {
            //console.log("到达计时温度")
        },
        "1368834975129944078": (value: string) => {
            //console.log("倒计时开始")
        },

        "1368834975129944079": (value: string) => {
            //console.log("延时开闭风机和开门")
        },

        "1368834975129944080": (value: string) => {
            //console.log("轮流加热阶段")
        },

        "1368834975129944082": (value: string) => {
            //console.log("1号温度故障")
        },
        "1368834975129944083": (value: string) => {
            //console.log("2号温度故障")
        },
        "1368834975129944084": (value: string) => {
            //console.log("3号温度故障")
        },
        "1368834975129944085": (value: string) => {
            //console.log("4号温度故障")
        },
        "1368834975129944086": (value: string) => {
            //console.log("5号温度故障")
        },
        "1368834975129944087": (value: string) => {
            //console.log("6号温度故障")
        },
        "1368834975129944088": (value: string) => {
            //console.log("7号温度故障")
        },
        "1368834975129944089": (value: string) => {
            //console.log("8号温度故障")
        },
        "1368834975129944090": (value: string) => {
            //console.log("9号温度故障")
        },
        "1368834975129944091": (value: string) => {
            //console.log("10号温度故障")
        },
        "1368834975129944092": (value: string) => {
            //console.log("温度过高停机")
        },
        "1368834975129944093": (value: string) => {
            //console.log("湿度1故障")
        },
        "1368834975129944094": (value: string) => {
            //console.log("湿度2故障")
        },
        "1368834975129944095": (value: string) => {
            //console.log("柜门急停")
        },
        "1368834975129944096": (value: string) => {
            //console.log("外部急停")
        },
        "1368834975129944097": (value: string) => {
            //console.log("烟雾报警信号")
        },
        "1368834975129944098": (value: string) => {
            //console.log("故障输出")
        },
        "1368834975129944099": (value: string) => {
            //console.log("故障消音")
        },
        "1368834975129944100": (value: string) => {
            //console.log("相序错误")
        },
        "1368834975129944101": (value: string) => {
            //console.log("油位过低")
        },
        "1368834975129944102": (value: string) => {
            //console.log("温度传感器1不显示")
        },
        "58": (value: string) => {
            //console.log("温度传感器2不显示")
        },
        "59": (value: string) => {
            //console.log("温度传感器3不显示")
        },
        "60": (value: string) => {
            //console.log("温度传感器4不显示")
        },
        "61": (value: string) => {
            //console.log("温度传感器5不显示")
        },
        "62": (value: string) => {
            //console.log("温度传感器6不显示")
        },
        "63": (value: string) => {
            //console.log("温度传感器7不显示")
        },
        "64": (value: string) => {
            //console.log("温度传感器8不显示")
        },
        "65": (value: string) => {
            //console.log("运行指示")
        },
        "66": (value: string) => {
            //console.log("停止指示")
        },
        "67": (value: string) => {
            //console.log("系统运行中")
        },
        "81": (value: string) => {
            //console.log("温度传感器9不显示")
        },
        "82": (value: string) => {
            //console.log("温度传感器10不显示")
        },
        "83": (value: string) => {
            //console.log("油位传感器不显示")
        },
        "84": (value: string) => {
            //console.log("湿度传感器1不显示")
        },
        "85": (value: string) => {
            //console.log("湿度传感器2不显示")
        },
        "91": (value: string) => {
            //console.log("触摸屏一键启动")
        },
        "92": (value: string) => {
            //console.log("触摸屏一键停止")
        },
        "93": (value: string) => {
            //console.log("油位过低")
        },
        "94": (value: string) => {
            //console.log("循环风机延时中")
        },
        "95": (value: string) => {
            //console.log("设置系统时间")
        },
        "113": (value: string) => {
            //console.log("温度传感器1切除")
        },
        "114": (value: string) => {
            //console.log("温度传感器2切除")
        },
        "115": (value: string) => {
            //console.log("温度传感器3切除")
        },
        "116": (value: string) => {
            //console.log("温度传感器4切除")
        },
        "117": (value: string) => {
            //console.log("温度传感器5切除")
        },
        "118": (value: string) => {
            //console.log("温度传感器6切除")
        },
        "119": (value: string) => {
            //console.log("温度传感器7切除")
        },
        "120": (value: string) => {
            //console.log("温度传感器8切除")
        },
        "121": (value: string) => {
            //console.log("温度传感器9切除")
        },
        "122": (value: string) => {
            //console.log("温度传感器10切除")
        },
        "123": (value: string) => {
            //console.log("油位传感器切除")
        },
        "124": (value: string) => {
            //console.log("湿度传感器1切除")
        },
        "125": (value: string) => {
            //console.log("湿度传感器2切除")
        },
        "126": (value: string) => {
            //console.log("排湿风机切除")
        },
        "145": (value: string) => {
            //console.log("云端改参")
        },
        "1368834975129944135": (value: string) => {
            //console.log("云端温度1");
            this.temperature1.setValue(value)
        },
        "1368834975129944136": (value: string) => {
            //console.log("云端温度2");
            this.temperature2.setValue(value)
        },
        "1368834975129944137": (value: string) => {
            //console.log("云端温度3");
            this.temperature3.setValue(value)
        },
        "1368834975129944138": (value: string) => {
            //console.log("云端温度4");
            this.temperature4.setValue(value)
        },
        "1368834975129944139": (value: string) => {
            //console.log("云端温度5");
            this.temperature5.setValue(value)
        },
        "1368834975129944140": (value: string) => {
            //console.log("云端温度6");
            this.temperature6.setValue(value)
        },
        "1368834975129944141": (value: string) => {
            //console.log("云端温度7");
            this.temperature7.setValue(value)
        },
        "1368834975129944142": (value: string) => {
            //console.log("云端温度8");
            this.temperature8.setValue(value)
        },
        // "1368834975129944143": (value: string) => {
        //     //console.log("云端温度9")
        // },
        // "1368834975129944144": (value: string) => {
        //     //console.log("云端温度10")
        // },
        "1368834975129944145": (value: string) => {
            //console.log("云端湿度1");
            this.humidity1.setValue(value)
        },
        "1368834975129944146": (value: string) => {
            //console.log("云端湿度2");
            this.humidity2.setValue(value)
        },
        // "1368834975129944147": (value: string) => {
        //     //console.log("云端平均温度")
        //     averageTemperature.value = value
        // },
        // "1368834975129944148": (value: string) => {
        //     //console.log("云端平均湿度")
        //     averageHumidity.value = value
        // },
        // "1368834975129944149": (value: string) => {
        //     //console.log("云端烘干用时")
        //     totalDrySeconds.value = value
        // },
        // "1368834975129944150": (value: string) => {
        //     //console.log("云端烘干次数")
        //     totalTimes.value = value
        // },
        // "1368834975129944151": (value: string) => {
        //     //console.log("云端剩余时间")
        //     remainderSeconds.value = secondsToMmss(parseInt(value))
        // },
        // "1368834975129944152": (value: string) => {
        //     //console.log("云端油位")
        //     remainderFuel.value = value
        // },
    }

}
