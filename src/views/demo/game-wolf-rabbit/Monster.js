import * as THREE from 'three';
import { gsap } from "gsap";
const initSpeed = 5;
const speed = 6;
const maxSpeed = 48;
export default class Wolf extends THREE.Group {
    gameStatus = "";
    runningCycle = 0;
    body;
    rabbitHolder;
    head;
    torso;
    mouth;
    tongue;
    nose;
    eyeL;
    eyeR;
    iris;
    earL;
    earR;
    tail;
    pawFL;
    pawFR;
    pawBL;
    pawBR;
    constructor() {
        super();
        const blackMat = new THREE.MeshPhongMaterial({
            color: 0x100707,
        });
        const pinkMat = new THREE.MeshPhongMaterial({
            color: 0xdc5f45, //0xb43b29,//0xff5b49,
            shininess: 0,
        });
        const whiteMat = new THREE.MeshPhongMaterial({
            color: 0xa49789,
        });
        this.runningCycle = 0;
        this.body = new THREE.Group();
        const torsoGeom = new THREE.BoxGeometry(15, 15, 20, 1);
        this.torso = new THREE.Mesh(torsoGeom, blackMat);
        const headGeom = new THREE.BoxGeometry(20, 20, 40, 1);
        headGeom.applyMatrix4(new THREE.Matrix4().makeTranslation(0, 0, 20));
        this.head = new THREE.Mesh(headGeom, blackMat);
        this.head.position.z = 12;
        this.head.position.y = 2;
        const mouthGeom = new THREE.BoxGeometry(10, 4, 20, 1);
        mouthGeom.applyMatrix4(new THREE.Matrix4().makeTranslation(0, -2, 10));
        this.mouth = new THREE.Mesh(mouthGeom, blackMat);
        this.mouth.position.y = -8;
        this.mouth.rotation.x = .4;
        this.mouth.position.z = 4;
        this.rabbitHolder = new THREE.Group();
        this.rabbitHolder.position.z = 20;
        this.mouth.add(this.rabbitHolder);
        const toothGeom = new THREE.BoxGeometry(2, 2, 1, 1);
        const vs = toothGeom.getAttribute("position");
        vs.setX(0, vs.getX(0) - 1);
        vs.setX(1, vs.getX(1) - 1);
        vs.setX(4, vs.getX(4) + 1);
        vs.setX(5, vs.getX(5) + 1);
        toothGeom.attributes.position.needsUpdate = true;
        for (let i = 0; i < 3; i++) {
            const toothf = new THREE.Mesh(toothGeom, whiteMat);
            toothf.position.x = -2.8 + i * 2.5;
            toothf.position.y = 1;
            toothf.position.z = 19;
            const toothl = new THREE.Mesh(toothGeom, whiteMat);
            toothl.rotation.y = Math.PI / 2;
            toothl.position.z = 12 + i * 2.5;
            toothl.position.y = 1;
            toothl.position.x = 4;
            const toothr = toothl.clone();
            toothl.position.x = -4;
            this.mouth.add(toothf);
            this.mouth.add(toothl);
            this.mouth.add(toothr);
        }
        const tongueGeometry = new THREE.BoxGeometry(6, 1, 14);
        tongueGeometry.applyMatrix4(new THREE.Matrix4().makeTranslation(0, 0, 7));
        this.tongue = new THREE.Mesh(tongueGeometry, pinkMat);
        this.tongue.position.z = 2;
        this.tongue.rotation.x = -.2;
        this.mouth.add(this.tongue);
        const noseGeom = new THREE.BoxGeometry(4, 4, 4, 1);
        this.nose = new THREE.Mesh(noseGeom, pinkMat);
        this.nose.position.z = 39.5;
        this.nose.position.y = 9;
        this.head.add(this.nose);
        this.head.add(this.mouth);
        const eyeGeom = new THREE.BoxGeometry(2, 3, 3);
        this.eyeL = new THREE.Mesh(eyeGeom, whiteMat);
        this.eyeL.position.x = 10;
        this.eyeL.position.z = 5;
        this.eyeL.position.y = 5;
        this.eyeL.castShadow = true;
        this.head.add(this.eyeL);
        const irisGeom = new THREE.BoxGeometry(.6, 1, 1);
        this.iris = new THREE.Mesh(irisGeom, blackMat);
        this.iris.position.x = 1.2;
        this.iris.position.y = -1;
        this.iris.position.z = 1;
        this.eyeL.add(this.iris);
        this.eyeR = this.eyeL.clone();
        this.eyeR.children[0].position.x = -this.iris.position.x;
        this.eyeR.position.x = -this.eyeL.position.x;
        this.head.add(this.eyeR);
        const earGeom = new THREE.BoxGeometry(8, 6, 2, 1);
        const vs1 = toothGeom.getAttribute("position");
        vs1.setX(0, vs1.getX(0) - 4);
        vs1.setZ(0, vs1.getZ(0) - 2);
        vs1.setX(1, vs1.getX(1) - 4);
        vs1.setX(4, vs1.getX(4) + 4);
        vs1.setX(5, vs1.getX(5) + 4);
        vs1.setZ(5, vs1.getZ(5) - 2);
        toothGeom.attributes.position.needsUpdate = true;
        earGeom.applyMatrix4(new THREE.Matrix4().makeTranslation(0, 3, 0));
        this.earL = new THREE.Mesh(earGeom, blackMat);
        this.earL.position.x = 6;
        this.earL.position.z = 1;
        this.earL.position.y = 10;
        this.earL.castShadow = true;
        this.head.add(this.earL);
        this.earR = this.earL.clone();
        this.earR.position.x = -this.earL.position.x;
        this.earR.rotation.z = -this.earL.rotation.z;
        this.head.add(this.earR);
        const tailGeom = new THREE.CylinderGeometry(5, 2, 20, 4, 1);
        tailGeom.applyMatrix4(new THREE.Matrix4().makeTranslation(0, 10, 0));
        tailGeom.applyMatrix4(new THREE.Matrix4().makeRotationX(-Math.PI / 2));
        tailGeom.applyMatrix4(new THREE.Matrix4().makeRotationZ(Math.PI / 4));
        this.tail = new THREE.Mesh(tailGeom, blackMat);
        this.tail.position.z = -10;
        this.tail.position.y = 4;
        this.torso.add(this.tail);
        const pawGeom = new THREE.CylinderGeometry(1.5, 0, 10);
        pawGeom.applyMatrix4(new THREE.Matrix4().makeTranslation(0, -5, 0));
        this.pawFL = new THREE.Mesh(pawGeom, blackMat);
        this.pawFL.position.y = -7.5;
        this.pawFL.position.z = 8.5;
        this.pawFL.position.x = 5.5;
        this.torso.add(this.pawFL);
        this.pawFR = this.pawFL.clone();
        this.pawFR.position.x = -this.pawFL.position.x;
        this.torso.add(this.pawFR);
        this.pawBR = this.pawFR.clone();
        this.pawBR.position.z = -this.pawFL.position.z;
        this.torso.add(this.pawBR);
        this.pawBL = this.pawBR.clone();
        this.pawBL.position.x = this.pawFL.position.x;
        this.torso.add(this.pawBL);
        this.add(this.body);
        this.torso.add(this.head);
        this.body.add(this.torso);
        this.torso.castShadow = true;
        this.head.castShadow = true;
        this.pawFL.castShadow = true;
        this.pawFR.castShadow = true;
        this.pawBL.castShadow = true;
        this.pawBR.castShadow = true;
        this.body.rotation.y = Math.PI / 2;
    }
    run = (delta) => {
        console.log("delta = ", delta);
        const s = Math.min(speed, maxSpeed);
        this.runningCycle += delta * s * .7;
        this.runningCycle = this.runningCycle % (Math.PI * 2);
        const t = this.runningCycle;
        this.pawFR.rotation.x = Math.sin(t) * Math.PI / 4;
        this.pawFR.position.y = -5.5 - Math.sin(t);
        this.pawFR.position.z = 7.5 + Math.cos(t);
        this.pawFL.rotation.x = Math.sin(t + .4) * Math.PI / 4;
        this.pawFL.position.y = -5.5 - Math.sin(t + .4);
        this.pawFL.position.z = 7.5 + Math.cos(t + .4);
        this.pawBL.rotation.x = Math.sin(t + 2) * Math.PI / 4;
        this.pawBL.position.y = -5.5 - Math.sin(t + 3.8);
        this.pawBL.position.z = -7.5 + Math.cos(t + 3.8);
        this.pawBR.rotation.x = Math.sin(t + 2.4) * Math.PI / 4;
        this.pawBR.position.y = -5.5 - Math.sin(t + 3.4);
        this.pawBR.position.z = -7.5 + Math.cos(t + 3.4);
        this.torso.rotation.x = Math.sin(t) * Math.PI / 8;
        this.torso.position.y = 3 - Math.sin(t + Math.PI / 2) * 3;
        //this.head.position.y = 5-Math.sin(t+Math.PI/2)*2
        this.head.rotation.x = -.1 + Math.sin(-t - 1) * .4;
        this.mouth.rotation.x = .2 + Math.sin(t + Math.PI + .3) * .4;
        this.tail.rotation.x = .2 + Math.sin(t - Math.PI / 2);
        this.eyeR.scale.y = .5 + Math.sin(t + Math.PI) * .5;
    };
    nod = () => {
        const sp = 1 + Math.random() * 2;
        // HEAD
        const tHeadRotY = -Math.PI / 3 + Math.random() * .5;
        const tHeadRotX = Math.PI / 3 - .2 + Math.random() * .4;
        gsap.to(this.head.rotation, {
            x: tHeadRotX,
            y: tHeadRotY,
            duration: sp,
            ease: "Power4.easeInOut",
            onComplete: () => {
                this.nod();
            }
        });
        // TAIL
        const tTailRotY = -Math.PI / 4;
        gsap.to(this.tail.rotation, {
            y: tTailRotY,
            duration: sp / 8,
            ease: "Power1.easeInOut",
            yoyo: true,
            repeat: 8
        });
        // EYES
        gsap.to([this.eyeR.scale, this.eyeL.scale], {
            y: 0,
            duration: sp / 20,
            ease: "Power1.easeInOut",
            yoyo: true,
            repeat: 1
        });
    };
    sit = () => {
        const sp = 1.2;
        const ease = "Power4.easeOut";
        gsap.to(this.torso.rotation, {
            x: -1.3,
            duration: sp,
            ease
        });
        gsap.to(this.torso.position, sp, {
            y: -5,
            duration: sp,
            ease,
            onComplete: () => {
                this.nod();
                // todo
                this.gameStatus = "readyToReplay";
            }
        });
        gsap.to(this.head.rotation, {
            x: Math.PI / 3,
            y: -Math.PI / 3,
            duration: sp,
            ease
        });
        gsap.to(this.tail.rotation, {
            x: 2,
            y: Math.PI / 4,
            duration: sp,
            ease
        });
        gsap.to(this.pawBL.rotation, {
            x: -.1,
            duration: sp,
            ease
        });
        gsap.to(this.pawBR.rotation, {
            x: -.1,
            duration: sp,
            ease
        });
        gsap.to(this.pawFL.rotation, {
            x: 1,
            duration: sp,
            ease
        });
        gsap.to(this.pawFR.rotation, {
            x: 1,
            duration: sp,
            ease
        });
        gsap.to(this.mouth.rotation, {
            x: .3,
            duration: sp,
            ease
        });
        gsap.to(this.eyeL.scale, {
            y: 1,
            duration: sp,
            ease
        });
        gsap.to(this.eyeR.scale, {
            y: 1,
            duration: sp,
            ease
        });
        //TweenMax.to(this.body.rotation, sp, {y:Math.PI/4})
    };
}
//# sourceMappingURL=Monster.js.map