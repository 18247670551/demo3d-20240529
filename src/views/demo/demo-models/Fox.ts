import * as THREE from "three"


const redFurMat = new THREE.MeshPhongMaterial({color:0xd8d0d1, flatShading: true})

export default class Fox extends THREE.Group {


    private readonly head = new THREE.Group()

    constructor() {
        super()

        this.addBody()
        this.addHead()
        this.addChest()
        this.addLegs()
        this.addTail()

    }


    private addBody(){
        const geomBody = new THREE.BoxGeometry(100,50,50,1,1,1)
        const body = new THREE.Mesh(geomBody, redFurMat)
        body.castShadow = true
        body.receiveShadow = true
        this.add(body)
    }

    private addHead(){
        const geomHead = new THREE.BoxGeometry(40,55,50,1,1,1)
        const head = new THREE.Mesh(geomHead, redFurMat)
        head.position.set(80, 35, 0)
        head.castShadow = true
        head.receiveShadow = true


        this.headAddEar()
        this.headAddSnout()


        this.add(head)
    }

    // 胸
    private addChest(){
        const geomChest = new THREE.BoxGeometry(50,60,70,1,1,1)
        const chest = new THREE.Mesh(geomChest, redFurMat)
        chest.position.x = 60
        chest.castShadow = true
        chest.receiveShadow = true
        this.add(chest)
    }

    // 鼻子
    private headAddSnout(){
        const geomSnout = new THREE.BoxGeometry(40,30,30,1,1,1)
        const snout = new THREE.Mesh(geomSnout, redFurMat)

        const vs = geomSnout.getAttribute("position")

        vs.setY(0, vs.getY(0) - 5)
        vs.setZ(0, vs.getZ(0) + 5)

        vs.setY(1, vs.getY(1) - 5)
        vs.setZ(1, vs.getZ(1) - 5)

        vs.setY(2, vs.getY(2) + 5)
        vs.setZ(2, vs.getZ(2) + 5)

        vs.setY(3, vs.getY(3) + 5)
        vs.setZ(3, vs.getZ(3) - 5)

        geomSnout.attributes.position.needsUpdate = true

        snout.castShadow = true
        snout.receiveShadow = true
        snout.position.set(30,0,0)
        this.head.add(snout)

        const geomNose = new THREE.BoxGeometry(10,15,20,1,1,1)
        const matNose = new THREE.MeshPhongMaterial({color:"read", flatShading: true})
        const nose = new THREE.Mesh(geomNose, matNose);
        nose.position.set(55,0,0);
        this.head.add(nose)
    }

    // 耳朵
    private headAddEar(){
        const geomEar = new THREE.BoxGeometry(10,40,30,1,1,1)
        const earL = new THREE.Mesh(geomEar, redFurMat)
        earL.position.set(-10,40,-18)
        earL.rotation.x=-Math.PI/10

        this.head.add(earL)

        const vs = geomEar.getAttribute("position")

        vs.setZ(1, vs.getZ(1) + 5)
        vs.setZ(4, vs.getZ(4) + 5)
        vs.setZ(0, vs.getZ(0) - 5)
        vs.setZ(5, vs.getZ(5) - 5)

        geomEar.attributes.position.needsUpdate = true

        const geomEarTipL = new THREE.BoxGeometry(10,10,20,1,1,1)
        const matEarTip = new THREE.MeshPhongMaterial({color:"yellow", flatShading: true})
        const earTipL = new THREE.Mesh(geomEarTipL, matEarTip)
        earTipL.position.set(0,25,0)
        earL.add(earTipL)

        const earR = earL.clone()
        earR.position.z = -earL.position.z
        earR.rotation.x = -	earL.rotation.x

        this.head.add(earR)
    }

    private addTail(){
        const geomTail = new THREE.BoxGeometry(80,40,40,2,1,1)


        const vs = geomTail.getAttribute("position")

        vs.setY(4, vs.getY(4) - 10)
        vs.setZ(4, vs.getZ(4) + 10)

        vs.setY(5, vs.getY(5) - 10)
        vs.setZ(5, vs.getZ(5) - 10)

        vs.setY(6, vs.getY(6) + 10)
        vs.setZ(6, vs.getZ(6) + 10)

        vs.setY(7, vs.getY(7) + 10)
        vs.setZ(7, vs.getZ(7) - 10)

        geomTail.attributes.position.needsUpdate = true


        const tail = new THREE.Mesh(geomTail, redFurMat)
        tail.castShadow = true
        tail.receiveShadow = true


        const geomTailTip = new THREE.BoxGeometry(20,40,40,1,1,1)
        const matTailTip = new THREE.MeshPhongMaterial({color:0xd8d0d1, flatShading: true})
        const tailTip = new THREE.Mesh(geomTailTip, matTailTip)
        tailTip.position.set(80,0,0)
        tailTip.castShadow = true
        tailTip.receiveShadow = true
        tail.add(tailTip)
        tail.position.set(-40,10,0)
        geomTail.translate(40,0,0)
        geomTailTip.translate(10,0,0)
        tail.rotation.z = Math.PI/1.5

        this.add(tail)
    }

    private addLegs(){
        const geomLeg = new THREE.BoxGeometry(20,60,20,1,1,1)
        const legFR = new THREE.Mesh(geomLeg, redFurMat)
        legFR.castShadow = true
        legFR.receiveShadow = true

        const geomFeet = new THREE.BoxGeometry(20,20,20,1,1,1)
        const matFeet = new THREE.MeshPhongMaterial({color:0xd8d0d1, flatShading: true})
        const feet = new THREE.Mesh(geomFeet, matFeet)
        feet.position.set(0,0,0)
        feet.castShadow = true
        feet.receiveShadow = true
        legFR.add(feet)
        legFR.position.set(70,-12,25)
        geomLeg.translate(0,40,0)
        geomFeet.translate(0,80,0)
        legFR.rotation.z = 16
        this.add(legFR)

        const legFL = legFR.clone()
        legFL.position.z = -legFR.position.z
        legFL.rotation.z = -legFR.rotation.z
        this.add(legFL)

        const legBR = legFR.clone()
        legBR.position.x = -(legFR.position.x)+50
        legBR.rotation.z = -legFR.rotation.z
        this.add(legBR)

        const legBL = legFL.clone()
        legBL.position.x = -(legFL.position.x)+50
        legBL.rotation.z = -legFL.rotation.z
        this.add(legBL)
    }


}