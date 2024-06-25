import * as THREE from "three";
import ThreeCore from "@/three-widget/ThreeCore";
import MyPoints from "./MyPoints";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry";
export default class ThreeProject extends ThreeCore {
    pointsControl;
    constructor(dom) {
        super(dom, {
            cameraOptions: {
                fov: 75,
                near: 0.001,
                far: 10000
            }
        });
        this.scene.background = new THREE.Color(0x000000);
        this.camera.position.set(0, 0, 150);
        const ambientLight = new THREE.AmbientLight(0xffffff, 4);
        this.scene.add(ambientLight);
        const pointsControl = new MyPoints({
            num: 10000,
            size: 10,
            color: { r: 100, g: 200, b: 200, a: 1, },
        });
        this.scene.add(pointsControl);
        this.pointsControl = pointsControl;
        this.startCountdown();
    }
    async startCountdown() {
        const loader = new FontLoader();
        const font = await loader.loadAsync('/static/font/helvetiker_bold.typeface.json');
        const geos = [];
        for (let i = 0; i <= 9; i++) {
            geos[i] = this.getNumberGeo(font, i + "");
        }
        let i = 9;
        setInterval(() => {
            this.pointsControl.to(geos[i].attributes.position.array, { min: 100, max: 1500 });
            i--;
            if (i < 0) {
                i = 9;
            }
        }, 2000);
    }
    getNumberGeo(font, text) {
        const geometry = new TextGeometry(text, {
            font: font,
            size: 100,
            curveSegments: 12,
            bevelEnabled: true,
            bevelThickness: 10,
            bevelSize: 8,
            bevelSegments: 5
        });
        geometry.center();
        return geometry;
    }
    init() {
    }
    onRenderer() {
        this.pointsControl.update();
    }
}
//# sourceMappingURL=ThreeProject.js.map