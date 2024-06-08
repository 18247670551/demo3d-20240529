import * as THREE from "three"
import {Colors} from "@/views/demo/demo-plane2/ThreeProject"


interface AirPlaneOptions {
    colors?: Colors,
}


export default class AirPlane extends THREE.Group {

    private readonly options: Required<AirPlaneOptions>

    readonly propeller: THREE.Mesh

    constructor(options?: AirPlaneOptions) {
        super()

        const defaultOptions: Required<AirPlaneOptions> = {
            colors: {
                red: 0xf25346,
                yellow: 0xedeb27,
                white: 0xd8d0d1,
                brown: 0x59332e,
                pink: 0xF5986E,
                brownDark: 0x23190f,
                blue: 0x68c3c0,
                green: 0x458248,
                purple: 0x551A8B,
                lightgreen: 0x629265,
            }
        }

        this.options = Object.assign({}, defaultOptions, options)

        // 驾驶舱
        this.addCockpit()
        // 机翼
        this.addWing()
        this.addEngine()
        this.addTail()
        // 螺旋桨
        this.propeller = this.addAndGetPropeller()
        this.addWheel()
        this.addSuspension()
    }

    // 驾驶舱
    private addCockpit() {
        const geomCockpit = new THREE.BoxGeometry(80,50,50,1,1,1)
        const matCockpit = new THREE.MeshPhongMaterial({color:this.options.colors.red, flatShading: true})

        const vs = geomCockpit.getAttribute("position")

        vs.setY(4, vs.getY(4) - 10)
        vs.setZ(4, vs.getZ(4) + 20)

        vs.setY(5, vs.getY(5) - 10)
        vs.setZ(5, vs.getZ(5) - 20)

        vs.setY(6, vs.getY(6) + 30)
        vs.setZ(6, vs.getZ(6) + 20)

        vs.setY(7, vs.getY(7) + 30)
        vs.setZ(7, vs.getZ(7) - 20)

        //console.log("geomCockpit.attributes = ", geomCockpit.attributes)

        geomCockpit.setAttribute("position", vs)
        geomCockpit.attributes.position.needsUpdate = true

        //geomCockpit.attributes.toPositions.needsUpdate = true
        //geomCockpit.attributes.oldPositions.needsUpdate = true
        //geomCockpit.attributes.toPositionsDuration.needsUpdate = true

        const cockpit = new THREE.Mesh(geomCockpit, matCockpit)
        cockpit.castShadow = true
        cockpit.receiveShadow = true
        this.add(cockpit)
    }

    private addEngine(){
        const geomEngine = new THREE.BoxGeometry(20,50,50,1,1,1)
        const matEngine = new THREE.MeshPhongMaterial({color: this.options.colors.white, flatShading: true})
        const engine = new THREE.Mesh(geomEngine, matEngine)
        engine.position.x = 40
        engine.castShadow = true
        engine.receiveShadow = true
        this.add(engine)
    }

    private addTail(){
        const geomTailPlane = new THREE.BoxGeometry(15,20,5,1,1,1)
        const matTailPlane = new THREE.MeshPhongMaterial({color: this.options.colors.red, flatShading: true})
        const tailPlane = new THREE.Mesh(geomTailPlane, matTailPlane)
        tailPlane.position.set(-35,25,0)
        tailPlane.castShadow = true
        tailPlane.receiveShadow = true
        this.add(tailPlane)
    }

    // 机翼
    private addWing(){
        const geomSideWing = new THREE.BoxGeometry(40,4,150,1,1,1)
        const matSideWing = new THREE.MeshPhongMaterial({color: this.options.colors.red, flatShading: true})

        const sideWingTop = new THREE.Mesh(geomSideWing, matSideWing)
        const sideWingBottom = new THREE.Mesh(geomSideWing, matSideWing)
        sideWingTop.castShadow = true
        sideWingTop.receiveShadow = true
        sideWingBottom.castShadow = true
        sideWingBottom.receiveShadow = true

        sideWingTop.position.set(20,12,0)
        sideWingBottom.position.set(20,-3,0)
        this.add(sideWingTop)
        this.add(sideWingBottom)
    }

    // 挡风玻璃
    private addWindshield(){
        const geomWindshield = new THREE.BoxGeometry(3,15,20,1,1,1)
        const matWindshield = new THREE.MeshPhongMaterial({color: this.options.colors.white,transparent:true, opacity:.3, flatShading: true})
        const windshield = new THREE.Mesh(geomWindshield, matWindshield)
        windshield.position.set(5,27,0)

        windshield.castShadow = true
        windshield.receiveShadow = true

        this.add(windshield)
    }

    // 螺旋桨
    private addAndGetPropeller(){

        const geomPropeller = new THREE.BoxGeometry(20,10,10,1,1,1)

        const vs = geomPropeller.getAttribute("position")

        vs.setY(4, vs.getY(4) - 5)
        vs.setZ(4, vs.getZ(4) + 5)

        vs.setY(5, vs.getY(5) - 5)
        vs.setZ(5, vs.getZ(5) - 5)

        vs.setY(6, vs.getY(6) + 5)
        vs.setZ(6, vs.getZ(6) + 5)

        vs.setY(7, vs.getY(7) + 5)
        vs.setZ(7, vs.getZ(7) - 5)

        geomPropeller.setAttribute("position", vs)
        geomPropeller.attributes.position.needsUpdate = true

        const matPropeller = new THREE.MeshPhongMaterial({color: this.options.colors.brown, flatShading: true})

        const propeller = new THREE.Mesh(geomPropeller, matPropeller)


        const geomBlade1 = new THREE.BoxGeometry(1,100,10,1,1,1)
        const geomBlade2 = new THREE.BoxGeometry(1,10,100,1,1,1)
        const matBlade = new THREE.MeshPhongMaterial({color: this.options.colors.brownDark, flatShading: true})

        const blade1 = new THREE.Mesh(geomBlade1, matBlade)
        blade1.position.set(8,0,0)
        blade1.castShadow = true
        blade1.receiveShadow = true

        const blade2 = new THREE.Mesh(geomBlade2, matBlade)
        blade2.position.set(8,0,0)
        blade2.castShadow = true
        blade2.receiveShadow = true



        propeller.add(blade1, blade2)
        propeller.position.set(50,0,0)
        propeller.castShadow = true
        propeller.receiveShadow = true

        this.add(propeller)

        return propeller
    }

    private addWheel(){

        const group = new THREE.Group()

        const wheelProtecGeom = new THREE.BoxGeometry(30,15,10,1,1,1)
        const wheelProtecMat = new THREE.MeshPhongMaterial({color: this.options.colors.white, flatShading: true})
        const wheelProtecR = new THREE.Mesh(wheelProtecGeom,wheelProtecMat)
        wheelProtecR.position.set(25,-20,25)
        group.add(wheelProtecR)

        const wheelTireGeom = new THREE.BoxGeometry(24,24,4)
        const wheelTireMat = new THREE.MeshPhongMaterial({color: this.options.colors.brownDark, flatShading: true})
        const wheelTireR = new THREE.Mesh(wheelTireGeom,wheelTireMat)
        wheelTireR.position.set(25,-28,25)

        const wheelAxisGeom = new THREE.BoxGeometry(10,10,6)
        const wheelAxisMat = new THREE.MeshPhongMaterial({color: this.options.colors.brown, flatShading: true})
        const wheelAxis = new THREE.Mesh(wheelAxisGeom,wheelAxisMat)
        wheelTireR.add(wheelAxis)

        group.add(wheelTireR)

        const wheelProtecL = wheelProtecR.clone()
        wheelProtecL.position.z = -wheelProtecR.position.z
        group.add(wheelProtecL)

        const wheelTireL = wheelTireR.clone()
        wheelTireL.position.z = -wheelTireR.position.z
        group.add(wheelTireL)

        const wheelTireB = wheelTireR.clone()
        wheelTireB.scale.set(.5,.5,.5)
        wheelTireB.position.set(-35,-5,0)
        group.add(wheelTireB)

        this.add(group)
    }


    private addSuspension(){
        const suspensionGeom = new THREE.BoxGeometry(4,20,4)
        suspensionGeom.applyMatrix4(new THREE.Matrix4().makeTranslation(0,10,0))
        const suspensionMat = new THREE.MeshPhongMaterial({color: this.options.colors.red, flatShading: true})
        const suspension = new THREE.Mesh(suspensionGeom,suspensionMat)
        suspension.position.set(-35,-5,0)
        suspension.rotation.z = -.3
        this.add(suspension)
    }



}