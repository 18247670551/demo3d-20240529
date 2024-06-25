import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GUI } from "dat.gui";
import Room from "@/three-widget/my/Room";
import Truck from "@/three-widget/my/Truck";
import TruckBodyWash from "@/three-widget/my/TruckBodyWash";
import TruckBottomWash from "@/three-widget/my/TruckBottomWash";
import WashGun from "@/three-widget/my/WashGun";
import ThreeCore from "@/three-widget/ThreeCore";
export default class ThreeProject extends ThreeCore {
    orbit;
    room;
    truck;
    truckBodyWash;
    truckBottomWash;
    topLeftWashGun;
    topMiddleWashGun;
    topRightWashGun;
    constructor(dom) {
        super(dom, {
            cameraOptions: {
                s: 6000,
                near: 0.1,
                far: 300000
            }
        });
        this.scene.background = new THREE.Color(0x062469);
        this.camera.position.set(-6000, 20000, 50000);
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        this.scene.add(ambientLight);
        this.orbit = new OrbitControls(this.camera, this.renderer.domElement);
        this.orbit.target.y = 3000;
        this.orbit.update();
        const room = new Room("烘干车间");
        this.scene.add(room);
        this.room = room;
        const truck = new Truck("汽车");
        this.truck = truck;
        this.scene.add(truck);
        this.truckBodyWash = this.addAndGetTruckBodyWash();
        this.truckBottomWash = this.addTruckBottomWash();
        const guns = this.addAndGetWashGuns();
        this.topLeftWashGun = guns[0];
        this.topMiddleWashGun = guns[1];
        this.topRightWashGun = guns[2];
    }
    init() {
        this.addGUI();
    }
    onRenderer() {
        this.orbit.update();
    }
    addGUI() {
        const gui = new GUI();
        const roomFolder = gui.addFolder('车间控制');
        roomFolder.add(this.room, "openInDoor").name("入口门开");
        roomFolder.add(this.room, "closeInDoor").name("入口门关");
        roomFolder.add(this.room, "openOutDoor").name("出口门开");
        roomFolder.add(this.room, "closeOutDoor").name("出口门关");
        const truckFolder = gui.addFolder('汽车控制');
        truckFolder.add(this.truck, "setLeft").name("置于入口");
        truckFolder.add(this.truck, "setInner").name("置于车间");
        truckFolder.add(this.truck, "setRight").name("置于出口");
        truckFolder.add(this.truck, "runInRoom").name("进入车间");
        truckFolder.add(this.truck, "runOutRoom").name("离开车间");
        const truckBodyWashFolder = gui.addFolder('车身清洗');
        truckBodyWashFolder.add(this.truckBodyWash, "run").name("运行");
        truckBodyWashFolder.add(this.truckBodyWash, "stop").name("停止");
        const truckBottomWashFolder = gui.addFolder('底盘清洗');
        truckBottomWashFolder.add(this.truckBottomWash, "run").name("运行");
        truckBottomWashFolder.add(this.truckBottomWash, "stop").name("停止");
        const washGunFolder = gui.addFolder('喷枪控制');
        washGunFolder.add(this.topLeftWashGun, "run").name("左侧喷枪运行");
        washGunFolder.add(this.topLeftWashGun, "stop").name("左侧喷枪停止");
        washGunFolder.add(this.topMiddleWashGun, "run").name("中间喷枪运行");
        washGunFolder.add(this.topMiddleWashGun, "stop").name("中间喷枪停止");
        washGunFolder.add(this.topRightWashGun, "run").name("右侧喷枪运行");
        washGunFolder.add(this.topRightWashGun, "stop").name("右侧喷枪停止");
    }
    addAndGetTruckBodyWash() {
        const truckBodyWash = new TruckBodyWash("车身清洗");
        this.scene.add(truckBodyWash);
        return truckBodyWash;
    }
    addTruckBottomWash() {
        const truckBottomWash = new TruckBottomWash("底盘清洗");
        this.scene.add(truckBottomWash);
        return truckBottomWash;
    }
    addAndGetWashGuns() {
        const topLeftWashGun = new WashGun("顶部左侧喷枪");
        topLeftWashGun.position.x = -5000;
        topLeftWashGun.position.y = 4600;
        topLeftWashGun.rotateZ(Math.PI * -0.9);
        this.scene.add(topLeftWashGun);
        const topMiddleWashGun = new WashGun("顶部中间喷枪");
        topMiddleWashGun.position.x = 0;
        topMiddleWashGun.position.y = 4600;
        topMiddleWashGun.rotateZ(Math.PI);
        this.scene.add(topMiddleWashGun);
        const topRightWashGun = new WashGun("顶部右侧喷枪");
        topRightWashGun.position.x = 5000;
        topRightWashGun.position.y = 4600;
        topRightWashGun.rotateZ(Math.PI * 0.9);
        this.scene.add(topRightWashGun);
        return [
            topLeftWashGun,
            topMiddleWashGun,
            topRightWashGun,
        ];
    }
    points = {
        "1": (value) => {
            if (value == "0") {
                this.topLeftWashGun?.stop();
            }
            else {
                this.topLeftWashGun?.run();
            }
        },
        "2": (value) => {
            if (value == "0") {
                this.topMiddleWashGun?.stop();
            }
            else {
                this.topMiddleWashGun?.run();
            }
        },
        "3": (value) => {
            if (value == "0") {
                this.topRightWashGun?.stop();
            }
            else {
                this.topRightWashGun?.run();
            }
        },
        "4": (value) => {
            if (value == "0") {
                this.truckBottomWash?.stop();
            }
            else {
                this.truckBottomWash?.run();
            }
        },
        "5": (value) => {
            if (value == "0") {
                this.truckBodyWash?.stop();
            }
            else {
                this.truckBodyWash?.run();
            }
        },
        // "40001": (value: string) => {
        //     useTime.value = secondsToMmss(parseInt(value))
        // },
        // "40010": (value: string) => {
        //     totalUseWater.value = value
        // },
        // "40016": (value: string) => {
        //     todayTimes.value = value
        // },
        // "40019": (value: string) => {
        //     totalTimes.value = value
        // },
        // "40020": (value: string) => {
        //     useWater.value = value
        // },
        // "40022": (value: string) => {
        //     useDisinfectant.value = value
        // }
    };
}
//# sourceMappingURL=ThreeProject.js.map