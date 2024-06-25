import * as THREE from "three";
import gsap from "gsap";
import MyMesh from "@/three-widget/MyMesh";
import { getTextureLoader } from "@/three-widget/loader/ThreeLoader";
export default class DemoPipe extends MyMesh {
    flowAnimation;
    flowTexture;
    constructor(name, options) {
        const defaultOptions = {
            radius: 70,
            color: 0x777777,
            radiusSegments: 16,
            tubularSegments: 100,
            curve: new THREE.CatmullRomCurve3(),
        };
        const finalOptions = Object.assign({}, defaultOptions, options);
        const flowTexture = getTextureLoader().load("/demo/scene-ming/common/pipe/flow.png");
        flowTexture.colorSpace = THREE.SRGBColorSpace;
        flowTexture.wrapS = flowTexture.wrapT = THREE.RepeatWrapping;
        // finalOptions.curve.getLength() / 1000 获取管道总长度 / 1000, 是贴图横向重复次数, 以确保每条管道贴图样式相同
        flowTexture.repeat.set(finalOptions.curve.getLength() / 1000, 1);
        flowTexture.needsUpdate = true;
        const mat = new THREE.MeshPhongMaterial({
            color: finalOptions.color,
            transparent: true,
            side: THREE.DoubleSide,
            specular: finalOptions.color,
            shininess: 15,
            //map: flowTexture
        });
        //mat.needsUpdate = true
        const geo = new THREE.TubeGeometry(finalOptions.curve, finalOptions.tubularSegments, finalOptions.radius, finalOptions.radiusSegments);
        super(name, geo, mat);
        this.flowTexture = flowTexture;
        this.flowAnimation = this.createFlowAnimation();
    }
    createFlowAnimation() {
        return gsap.to(this.flowTexture.offset, {
            x: -3,
            duration: 1,
            ease: "none",
            repeat: -1,
            paused: true
        });
    }
    startFlow() {
        const mat = this.material;
        mat.map = this.flowTexture;
        this.flowAnimation.resume();
    }
    stopFlow() {
        this.flowAnimation.pause();
        const mat = this.material;
        mat.map = null;
    }
}
//# sourceMappingURL=DemoPipe.js.map