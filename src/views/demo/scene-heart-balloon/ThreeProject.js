import * as THREE from "three";
import { CSS2DObject } from "three/examples/jsm/renderers/CSS2DRenderer";
import ThreeCore from "@/three-widget/ThreeCore";
export default class ThreeProject extends ThreeCore {
    balloonCount;
    // 先构建一个标准气球, 后面的气球全都用此克隆
    balloon;
    // 上升的气球用一个组管理
    balloons;
    count = 0;
    //readonly label: CSS2DObject
    constructor(dom, balloonCount) {
        super(dom, {
            cameraOptions: {
                fov: 45,
                near: 0.1,
                far: 100
            }
        });
        this.balloonCount = balloonCount;
        this.scene.background = new THREE.Color(0x00ffff); // 天蓝色
        this.camera.position.set(15, 7.5, 30);
        const ambientLight = new THREE.AmbientLight(0xffffff, 2);
        this.scene.add(ambientLight);
        const backLight = new THREE.DirectionalLight(0xffffff, 1.1);
        backLight.position.set(3, 2, 4);
        backLight.castShadow = true;
        this.scene.add(backLight);
        this.balloon = new Balloon();
        this.balloons = new THREE.Group();
        this.scene.add(this.balloons);
        /*
            使用 css2DObject 添加2D标签的方式, 此方式会生成一个跟three一样大的绝对定位的dom, 当resize时会产生滚动条
            此方式不好控制, 不使用此方式, 改成从外部传入一个ref值, 在外部创建div, 内部只动态更新这个ref值
         */
        // this.label = this.createAndGetBalloonCountLabel()
        // this.scene.add(this.label)
        //
        // const css2DRenderer = new CSS2DRenderer()
        // css2DRenderer.setSize(dom.clientWidth, dom.clientHeight)
        // css2DRenderer.domElement.style.position = 'absolute'
        // css2DRenderer.domElement.style.top = '0px'
        // css2DRenderer.domElement.style.left = '0px'
        // css2DRenderer.render(this.scene, this.camera)
        // this.dom.appendChild(css2DRenderer.domElement)
        //this.orbit = new OrbitControls(this.camera, this.dom)
        //this.orbit.target = new THREE.Vector3(0, 0, 0);//控制焦点
    }
    createAndGetBalloonCountLabel() {
        const label = new CSS2DObject(document.createElement('div'));
        // 设层级
        label.layers.set(0);
        label.center.set(0, 0);
        // class需要是全局的
        label.element.className = 'balloon-count-label';
        // label.element.style.position = 'absolute'
        // label.element.style.top = '-1000px'
        // label.element.style.left = '-300px'
        // label.element.textContent = ''
        // label.element.style.width = '300px'
        // label.element.style.height = '100px'
        // label.element.style.textAlign = 'center'
        // label.element.style.lineHeight = '100px'
        // label.element.style.fontSize = '40px'
        // label.element.style.color = 'red'
        // label.element.style.background = 'blue'
        return label;
    }
    balloonUpAnimate = () => {
        this.count++;
        if (this.count > 1000) {
            this.count = 0;
        }
        if (this.count % 10 == 0) {
            const temp = this.balloon.clone();
            temp.position.set(Math.random() * 30, Math.random() * -40, Math.random() * 20);
            this.balloons.add(temp);
        }
        this.balloons.children.forEach(obj => {
            const balloon = obj;
            if (balloon.lifespan < 0) {
                this.balloons.remove(balloon);
            }
            else {
                balloon.update();
            }
        });
    };
    init() { }
    onRenderer() {
        this.balloonUpAnimate();
        //this.label.element.textContent = "气球数量: " + this.balloons.children.length
        this.balloonCount.value = this.balloons.children.length;
    }
}
class Balloon extends THREE.Mesh {
    lifespan = 600;
    constructor() {
        let x = 0, y = 0;
        const heart = new THREE.Shape();
        heart.moveTo(x + 0.5, y + 0.5);
        heart.bezierCurveTo(x + 0.5, y + 0.5, x + 0.4, y, x, y);
        heart.bezierCurveTo(x - 0.6, y, x - 0.6, y + 0.7, x - 0.6, y + 0.7);
        heart.bezierCurveTo(x - 0.6, y + 1.1, x - 0.3, y + 1.54, x + 0.5, y + 1.9);
        heart.bezierCurveTo(x + 1.2, y + 1.54, x + 1.6, y + 1.1, x + 1.6, y + 0.7);
        heart.bezierCurveTo(x + 1.6, y + 0.7, x + 1.6, y, x + 1, y);
        heart.bezierCurveTo(x + 0.7, y, x + 0.5, y + 0.5, x + 0.5, y + 0.5);
        const geo = new THREE.ExtrudeGeometry(heart, {
            steps: 2,
            depth: 0.4,
            bevelEnabled: true,
            bevelThickness: 0.1,
            bevelSize: 0.3,
            bevelOffset: 0,
            bevelSegments: 15
        });
        const mat = new THREE.MeshPhongMaterial({ color: 0xff899a });
        super(geo, mat);
        this.rotation.z = Math.PI;
    }
    update() {
        this.lifespan--;
        this.position.y = (this.position.y + 0.05) % 30;
    }
}
//# sourceMappingURL=ThreeProject.js.map