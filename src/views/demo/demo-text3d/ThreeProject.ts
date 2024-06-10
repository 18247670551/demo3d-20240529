import * as THREE from "three"
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls"
import ThreeCore from "@/three-widget/ThreeCore"
import {Font, FontLoader} from "three/examples/jsm/loaders/FontLoader"
import {TextGeometry} from "three/examples/jsm/geometries/TextGeometry"


export default class ThreeProject extends ThreeCore {

    private readonly orbit: OrbitControls

    constructor(dom: HTMLElement) {

        super(dom, {
            cameraOptions: {
                fov: 75,
                near: 0.1,
                far: 10000
            }
        })

        this.scene.background = new THREE.Color(0x000000)

        this.camera.position.set(0, 1200, 0)

        const ambientLight = new THREE.AmbientLight(0xffffff, 4)
        this.scene.add(ambientLight)

        this.orbit = new OrbitControls(this.camera, this.renderer.domElement)

        const axes = new THREE.AxesHelper(20)
        this.scene.add(axes)


        const loader = new FontLoader()

        const LoveYou = "" +
            "I can love you for four days.\n" +
            "Spring Summer Autumn Winter.\n" +
            "Maybe three days.\n" +
            "Yesterday Today Tomorrow.\n" +
            "How about two days？\n" +
            "Day and night.\n" +
            "One day is enough.\n" +
            "Every day.\n"

        const 将进酒 = "" +
            "君不见黄河之水天上来，奔流到海不复回。\n" +
            "君不见高堂明镜悲白发，朝如青丝暮成雪。\n" +
            "人生得意须尽欢，莫使金樽空对月。\n" +
            "天生我材必有用，千金散尽还复来。\n" +
            "烹羊宰牛且为乐，会须一饮三百杯。\n" +
            "岑夫子，丹丘生，将进酒，君莫停。\n" +
            "与君歌一曲，请君为我侧耳听。\n" +
            "钟鼓馔玉不足贵，但愿长醉不愿醒。\n" +
            "古来圣贤皆寂寞，惟有饮者留其名。\n" +
            "陈王昔时宴平乐，斗酒十千恣欢谑。\n" +
            "主人何为言少钱，径须沽取对君酌。\n" +
            "五花马，千金裘，\n" +
            "呼儿将出换美酒，与尔同销万古愁。\n"

        loader.load('/static/font/helvetiker_regular.typeface.json', (font) => {

            const geometry = new TextGeometry(LoveYou, {
                font: font,
                size: 100,
                curveSegments: 12,
                bevelEnabled: true,
                bevelThickness: 10,
                bevelSize: 8,
                bevelSegments: 5
            })

            geometry.center()
            geometry.rotateX(-Math.PI/2)

            const txtMater = new THREE.MeshNormalMaterial({
                flatShading: true,
                transparent: true,
                opacity: 0.9
            })
            const txtMesh = new THREE.Mesh(geometry, txtMater)
            //txtMesh.position.set(-2, 2.3, -0.4);
            this.scene.add(txtMesh)
        })
    }

    protected init() {
    }

    protected onRenderer() {

        this.orbit.update()
    }

}