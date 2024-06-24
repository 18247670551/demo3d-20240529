import * as THREE from 'three'
import {gsap} from "gsap"


export default class Hero extends THREE.Group {

    private runningCycle = 0
    private speed = 6

    private body: THREE.Group
    private torso: THREE.Mesh
    private mouth: THREE.Mesh
    private head: THREE.Mesh
    private earL: THREE.Mesh
    private earR: THREE.Mesh
    private eyeL: THREE.Mesh
    private eyeR: THREE.Mesh
    private tail: THREE.Mesh
    private pawFL: THREE.Mesh
    private pawFR: THREE.Mesh
    private pawBL: THREE.Mesh
    private pawBR: THREE.Mesh
    private iris: THREE.Mesh

    constructor() {
        super()

        const blackMat = new THREE.MeshPhongMaterial({
            color: 0x100707,
        })

        const brownMat = new THREE.MeshPhongMaterial({
            color: 0xb44b39,
            shininess: 0,
        })

        const pinkMat = new THREE.MeshPhongMaterial({
            color: 0xdc5f45,//0xb43b29,//0xff5b49,
            shininess: 0,
        })

        const lightBrownMat = new THREE.MeshPhongMaterial({
            color: 0xe07a57,
        })

        const whiteMat = new THREE.MeshPhongMaterial({
            color: 0xa49789,
        })

        const body = new THREE.Group()
        this.add(body)
        this.body = body

        // 躯体
        const torsoGeom = new THREE.BoxGeometry(7, 7, 10, 1)
        const torso = new THREE.Mesh(torsoGeom, brownMat)
        torso.position.z = 0
        torso.position.y = 7
        torso.castShadow = true
        body.add(torso)
        this.torso = torso

        const pantsGeom = new THREE.BoxGeometry(9, 9, 5, 1)
        const pants = new THREE.Mesh(pantsGeom, whiteMat)
        pants.position.z = -3
        pants.position.y = 0
        pants.castShadow = true
        torso.add(pants)

        const tailGeom = new THREE.BoxGeometry(3, 3, 3, 1)
        tailGeom.applyMatrix4(new THREE.Matrix4().makeTranslation(0, 0, -2))
        const tail = new THREE.Mesh(tailGeom, lightBrownMat)
        tail.position.z = -4
        tail.position.y = 5
        tail.castShadow = true
        torso.rotation.x = -Math.PI / 8
        torso.add(tail)
        this.tail = tail

        const headGeom = new THREE.BoxGeometry(10, 10, 13, 1)
        headGeom.applyMatrix4(new THREE.Matrix4().makeTranslation(0, 0, 7.5))
        const head = new THREE.Mesh(headGeom, brownMat)
        head.position.y = 11
        head.position.z = 2
        head.castShadow = true
        body.add(head)
        this.head = head

        const cheekGeom = new THREE.BoxGeometry(1, 4, 4, 1)
        const cheekR = new THREE.Mesh(cheekGeom, pinkMat)
        cheekR.position.x = -5
        cheekR.position.z = 7
        cheekR.position.y = -2.5
        cheekR.castShadow = true
        head.add(cheekR)

        const cheekL = cheekR.clone()
        cheekL.position.x = -cheekR.position.x
        head.add(cheekL)


        const noseGeom = new THREE.BoxGeometry(6, 6, 3, 1)
        const nose = new THREE.Mesh(noseGeom, lightBrownMat)
        nose.position.z = 13.5
        nose.position.y = 2.6
        nose.castShadow = true
        head.add(nose)

        const mouthGeom = new THREE.BoxGeometry(4, 2, 4, 1)
        mouthGeom.applyMatrix4(new THREE.Matrix4().makeTranslation(0, 0, 3))
        mouthGeom.applyMatrix4(new THREE.Matrix4().makeRotationX(Math.PI / 12))
        const mouth = new THREE.Mesh(mouthGeom, brownMat)
        mouth.position.y = -4
        mouth.position.z = 8
        mouth.castShadow = true
        head.add(mouth)
        this.mouth = mouth


        const pawFGeom = new THREE.BoxGeometry(3, 3, 3, 1)
        const pawFR = new THREE.Mesh(pawFGeom, lightBrownMat)
        pawFR.position.x = -2
        pawFR.position.y = 1.5
        pawFR.position.z = 6
        pawFR.castShadow = true
        body.add(pawFR)
        this.pawFR = pawFR

        const pawFL = pawFR.clone()
        pawFL.position.x = -pawFR.position.x
        pawFL.castShadow = true
        body.add(pawFL)
        this.pawFL = pawFL

        const pawBGeom = new THREE.BoxGeometry(3, 3, 6, 1)
        const pawBL = new THREE.Mesh(pawBGeom, lightBrownMat)
        pawBL.position.y = 1.5
        pawBL.position.z = 0
        pawBL.position.x = 5
        pawBL.castShadow = true
        body.add(pawBL)
        this.pawBL = pawBL

        const pawBR = pawBL.clone()
        pawBR.position.x = -pawBL.position.x
        pawBR.castShadow = true
        body.add(pawBR)
        this.pawBR = pawBR

        const earGeom = new THREE.BoxGeometry(7, 18, 2, 1)
        const vs = earGeom.getAttribute("position")

        // 新版js修改顶点位置后, 面会出问题, 对不齐, 会有空隙
        vs.setX(2, vs.getX(2) - 2)
        vs.setZ(2, vs.getZ(2) - 0.5)

        vs.setX(3, vs.getX(3) - 2)
        vs.setZ(3, vs.getZ(3) + 0.5)

        vs.setX(6, vs.getX(6) + 2)
        vs.setZ(6, vs.getZ(6) + 0.5)

        vs.setX(7, vs.getX(7) + 2)
        vs.setZ(7, vs.getZ(7) - 0.5)

        earGeom.applyMatrix4(new THREE.Matrix4().makeTranslation(0, 9, 0))
        earGeom.attributes.position.needsUpdate = true

        const earL = new THREE.Mesh(earGeom, brownMat)
        earL.position.x = 2
        earL.position.z = 2.5
        earL.position.y = 5
        earL.rotation.z = -Math.PI / 12
        earL.castShadow = true
        head.add(earL)
        this.earL = earL

        const earR = earL.clone()
        earR.position.x = -earL.position.x
        earR.rotation.z = -earL.rotation.z
        earR.castShadow = true
        head.add(earR)
        this.earR = earR

        const eyeGeom = new THREE.BoxGeometry(2, 4, 4)

        const eyeL = new THREE.Mesh(eyeGeom, whiteMat)
        eyeL.position.x = 5
        eyeL.position.z = 5.5
        eyeL.position.y = 2.9
        eyeL.castShadow = true
        head.add(eyeL)
        this.eyeL = eyeL

        const irisGeom = new THREE.BoxGeometry(.6, 2, 2)

        const iris = new THREE.Mesh(irisGeom, blackMat)
        iris.position.x = 1.2
        iris.position.y = 1
        iris.position.z = 1
        eyeL.add(iris)
        this.iris = iris

        const eyeR = eyeL.clone()
        eyeR.children[0].position.x = -iris.position.x
        this.eyeR = eyeR

        eyeR.position.x = -eyeL.position.x
        head.add(eyeR)

        body.traverse((object) => {
            object.castShadow = true
            object.receiveShadow = true
        })
    }

    run = (delta: number) => {
        const s = Math.min(this.speed)

        this.runningCycle += delta * s * .7
        this.runningCycle = this.runningCycle % (Math.PI * 2)
        const t = this.runningCycle

        const amp = 4
        const disp = .2

        // BODY
        this.body.position.y = 6 + Math.sin(t - Math.PI / 2) * amp
        this.body.rotation.x = .2 + Math.sin(t - Math.PI / 2) * amp * .1

        this.torso.rotation.x = Math.sin(t - Math.PI / 2) * amp * .1
        this.torso.position.y = 7 + Math.sin(t - Math.PI / 2) * amp * .5

        // MOUTH
        this.mouth.rotation.x = Math.PI / 16 + Math.cos(t) * amp * .05

        // HEAD
        this.head.position.z = 2 + Math.sin(t - Math.PI / 2) * amp * .5
        this.head.position.y = 8 + Math.cos(t - Math.PI / 2) * amp * .7
        this.head.rotation.x = -.2 + Math.sin(t + Math.PI) * amp * .1

        // EARS
        this.earL.rotation.x = Math.cos(-Math.PI / 2 + t) * (amp * .2)
        this.earR.rotation.x = Math.cos(-Math.PI / 2 + .2 + t) * (amp * .3)

        // EYES
        this.eyeR.scale.y = this.eyeL.scale.y = .7 + Math.abs(Math.cos(-Math.PI / 4 + t * .5)) * .6

        // TAIL
        this.tail.rotation.x = Math.cos(Math.PI / 2 + t) * amp * .3

        // FRONT RIGHT PAW
        this.pawFR.position.y = 1.5 + Math.sin(t) * amp
        this.pawFR.rotation.x = Math.cos(t) * Math.PI / 4


        this.pawFR.position.z = 6 - Math.cos(t) * amp * 2

        // FRONT LEFT PAW
        this.pawFL.position.y = 1.5 + Math.sin(disp + t) * amp
        this.pawFL.rotation.x = Math.cos(t) * Math.PI / 4


        this.pawFL.position.z = 6 - Math.cos(disp + t) * amp * 2

        // BACK RIGHT PAW
        this.pawBR.position.y = 1.5 + Math.sin(Math.PI + t) * amp
        this.pawBR.rotation.x = Math.cos(t + Math.PI * 1.5) * Math.PI / 3


        this.pawBR.position.z = -Math.cos(Math.PI + t) * amp

        // BACK LEFT PAW
        this.pawBL.position.y = 1.5 + Math.sin(Math.PI + t) * amp
        this.pawBL.rotation.x = Math.cos(t + Math.PI * 1.5) * Math.PI / 3


        this.pawBL.position.z = -Math.cos(Math.PI + t) * amp
    }


    jump = ()=> {

        let totalSpeed = 10 / this.speed
        let jumpHeight = 45

        gsap.to(this.earL.rotation, {
            x: this.earL.rotation.x + 0.3,
            duration: totalSpeed,
            ease: "Back.easeOut",
        })
        gsap.to(this.earR.rotation, {
            x: this.earR.rotation.x - 0.3,
            duration: totalSpeed,
            ease: "Back.easeOut",
        })


        gsap.to(this.pawFL.rotation, {
            x: this.pawFL.rotation.x + 0.7,
            duration: totalSpeed,
            ease: "Back.easeOut",
        })
        gsap.to(this.pawFR.rotation, {
            x: this.pawFR.rotation.x - 0.7,
            duration: totalSpeed,
            ease: "Back.easeOut",
        })

        gsap.to(this.pawBL.rotation, {
            x: this.pawBL.rotation.x + 0.7,
            duration: totalSpeed,
            ease: "Back.easeOut",
        })
        gsap.to(this.pawBR.rotation, {
            x: this.pawBR.rotation.x - 0.7,
            duration: totalSpeed,
            ease: "Back.easeOut",
        })

        gsap.to(this.tail.rotation, {
            x: this.tail.rotation.x + 1,
            duration: totalSpeed,
            ease: "Back.easeOut",
        })
        gsap.to(this.mouth.rotation, {
            x: 0.5,
            duration: totalSpeed,
            ease: "Back.easeOut",
        })

        gsap.to(this.position, {
            y: jumpHeight,
            duration: totalSpeed / 2,
            ease: "Power2.easeOut",
        })

        gsap.to(this.position, {
            y: 0,
            duration: totalSpeed / 2,
            ease: "Power4.easeIn",
            delay: totalSpeed / 2,
            onComplete: () => {
                // this.status = "running"
            }
        })
    }


    nod = ()=> {

        const sp = .5 + Math.random()

        // HEAD
        const tHeadRotY = -Math.PI / 6 + Math.random() * Math.PI / 3
        gsap.to(this.head.rotation, {
            y: tHeadRotY,
            duration: sp,
            ease: "Power4.easeInOut",
            onComplete: () => {
                this.nod()
            }
        })


        // EARS
        const tEarLRotX = Math.PI / 4 + Math.random() * Math.PI / 6
        const tEarRRotX = Math.PI / 4 + Math.random() * Math.PI / 6
        gsap.to(this.earL.rotation, {
            x: tEarLRotX,
            duration: sp,
            ease: "Power4.easeInOut",
        })
        gsap.to(this.earR.rotation, {
            x: tEarRRotX,
            duration: sp,
            ease: "Power4.easeInOut",
        })


        // PAWS BACK LEFT
        const tPawBLRot = Math.random() * Math.PI / 2
        const tPawBLY = -4 + Math.random() * 8
        gsap.to(this.pawBL.rotation, {
            x: tPawBLRot,
            duration: sp / 2,
            ease: "Power1.easeInOut",
            yoyo: true,
            repeat: 2
        })
        gsap.to(this.pawBL.rotation, {
            y: tPawBLY,
            duration: sp / 2,
            ease: "Power1.easeInOut",
            yoyo: true,
            repeat: 2
        })


        // PAWS BACK RIGHT
        const tPawBRRot = Math.random() * Math.PI / 2;
        const tPawBRY = -4 + Math.random() * 8;
        gsap.to(this.pawBR.rotation, {
            x: tPawBRRot,
            duration: sp / 2,
            ease: "Power1.easeInOut",
            yoyo: true,
            repeat: 2
        })
        gsap.to(this.pawBR.rotation, {
            y: tPawBRY,
            duration: sp / 2,
            ease: "Power1.easeInOut",
            yoyo: true,
            repeat: 2
        })


        // PAWS FRONT LEFT
        const tPawFLRot = Math.random() * Math.PI / 2
        const tPawFLY = -4 + Math.random() * 8
        gsap.to(this.pawFL.rotation, {
            x: tPawFLRot,
            duration: sp / 2,
            ease: "Power1.easeInOut",
            yoyo: true,
            repeat: 2
        })
        gsap.to(this.pawFL.rotation, {
            y: tPawFLY,
            duration: sp / 2,
            ease: "Power1.easeInOut",
            yoyo: true,
            repeat: 2
        })


        // PAWS FRONT RIGHT
        const tPawFRRot = Math.random() * Math.PI / 2
        const tPawFRY = -4 + Math.random() * 8
        gsap.to(this.pawFR.rotation, {
            x: tPawFRRot,
            duration: sp / 2,
            ease: "Power1.easeInOut",
            yoyo: true,
            repeat: 2
        })
        gsap.to(this.pawFR.rotation, {
            y: tPawFRY,
            duration: sp / 2,
            ease: "Power1.easeInOut",
            yoyo: true,
            repeat: 2
        })


        // MOUTH
        const tMouthRot = Math.random() * Math.PI / 8
        gsap.to(this.mouth.rotation, {
            x: tMouthRot,
            duration: sp,
            ease: "Power1.easeInOut",
        })


        // IRIS
        const tIrisY = -1 + Math.random() * 2;
        const tIrisZ = -1 + Math.random() * 2;
        const iris1 = this.iris;
        const iris2 = this.eyeR.children[0]
        gsap.to([iris1.position, iris2.position], {
            y: tIrisY,
            z: tIrisZ,
            duration: sp,
            ease: "Power1.easeInOut",
        })

        //EYES
        if (Math.random() > .2) {
            gsap.to([this.eyeR.scale, this.eyeL.scale], {
                y: 0,
                duration: sp / 8,
                ease: "Power1.easeInOut",
                yoyo: true,
                repeat: 1
            })
        }

    }

    // 死亡
    hang() {
        console.log("兔子死亡")

        const sp = 1
        const ease = "Power4.easeOut"

        gsap.killTweensOf(this.eyeL.scale)
        gsap.killTweensOf(this.eyeR.scale)

        this.body.rotation.x = 0
        this.torso.rotation.x = 0
        this.body.position.y = 0
        this.torso.position.y = 7

        gsap.to(this.rotation, {
            y: 0,
            duration: sp,
            ease,
        })
        gsap.to(this.rotation, {
            y: -7,
            z: 6,
            duration: sp,
            ease,
        })

        gsap.to(this.head.rotation, {
            x: Math.PI / 6,
            duration: sp,
            ease,
            onComplete: args => {
                this.nod()
            }
        })

        gsap.to([this.earL.rotation, this.earR.rotation], {
            x: Math.PI / 3,
            duration: sp,
            ease,
        })

        gsap.to([this.pawFL.position, this.pawFR.rotation], {
            y: -1,
            z: 3,
            duration: sp,
            ease,
        })

        gsap.to([this.pawBL.position, this.pawBR.rotation], {
            y: -2,
            z: -3,
            duration: sp,
            ease,
        })

        gsap.to([this.eyeL.scale, this.eyeR.rotation], {
            y: 1,
            duration: sp,
            ease,
        })
    }


}