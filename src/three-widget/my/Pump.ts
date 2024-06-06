import * as THREE from "three"
import gsap from "gsap"
import MyGroup from "@/three-widget/MyGroup";

interface PumpOptions {
    baseLength?: number
    baseWidth?: number
    baseHeight?: number
    motorLength?: number
    motorRadius?: number
    height?: number
    motorShellColor?: number
    motorShellOpacity?: number
}


/**
 * 水泵
 */
export default class Pump extends MyGroup<PumpOptions> {

    private rotor: THREE.Group

    readonly outJoinOffsetXOfMaxX: number

    private coilAnimation: gsap.core.Tween

    constructor(name: string, options?: PumpOptions) {

        const defaultOptions: Required<PumpOptions> = {
            baseLength: 2000,
            baseWidth: 900,
            baseHeight: 200,
            motorLength: 1400,
            motorRadius: 400,
            height: 10000,
            motorShellColor: 0x023177,
            motorShellOpacity: 0.5,
        }

        super(name, defaultOptions, options)

        this.addBase()
        this.rotor = this.addMotorAndGetRotor()
        this.outJoinOffsetXOfMaxX = this.addJoinAndGetOutJoinX()
        this.coilAnimation = this.createCoilAnimation()
    }

    private addBase() {
        const {baseLength, baseWidth, baseHeight, motorShellOpacity} = this.options

        const geo = new THREE.BoxGeometry(baseLength, baseHeight, baseWidth)
        const mat = new THREE.MeshPhongMaterial({color: 0x666666})
        const entity = new THREE.Mesh(geo, mat)
        entity.name = "底座"
        entity.position.y = baseHeight/2
        this.add(entity)
    }

    private addMotorAndGetRotor() {

        const {motorLength, motorRadius, motorShellColor, motorShellOpacity} = this.options

        const grayMat = new THREE.MeshPhongMaterial({color: 0x666666})

        const group = new THREE.Group

        const shellGeo = new THREE.CylinderGeometry(motorRadius, motorRadius, motorLength, 32)
        const shellMat = new THREE.MeshPhongMaterial({
            color: motorShellColor,
            transparent: true,
            opacity: motorShellOpacity,
        })
        const shell = new THREE.Mesh(shellGeo, shellMat)
        shell.name = "电机壳"
        group.add(shell)


        const rotor = new THREE.Group()
        rotor.name = "转子"

        const axleRadius = 40
        const axleLength = motorLength + 200 //轴比机壳长出50

        const axleGeo = new THREE.CylinderGeometry(axleRadius, axleRadius, axleLength, 16)
        const axle = new THREE.Mesh(axleGeo, grayMat)
        //axle.rotateX(Math.PI * 0.5)
        axle.position.y = 200
        axle.name = "转子轴"
        rotor.add(axle)

        //转子内芯长度
        const innerLength = motorLength * 0.8
        //转子内芯半径
        const innerRadius = motorRadius * 0.7

        const innerGeo = new THREE.CylinderGeometry(innerRadius, innerRadius, innerLength, 32)
        const inner = new THREE.Mesh(innerGeo, grayMat)
        inner.name = "转子内芯"
        rotor.add(inner)

        const coil = new THREE.Group()

        //转子线圈长度
        const coilLength = motorLength * 0.7
        //转子线圈半径
        const coilRadius = motorRadius * 0.85
        //转子线圈弧度
        const coilRadian = Math.PI * 2 / 6 / 6 * 4

        const shape = new THREE.Shape()
        shape.moveTo(innerRadius, 0)
        shape.lineTo(coilRadius, 0)
        shape.absarc(0, 0, coilRadius, 0, coilRadian, false)
        shape.absarc(0, 0, innerRadius, coilRadian, 0, true)

        const extrudeSettings = {
            depth: coilLength,
            bevelEnabled: false,
            bevelSegments: 9,
            steps: 2,
            bevelSize: 0,
            bevelThickness: 0
        }

        const extMat = [
            new THREE.MeshPhongMaterial({color: '#FF6666', side: THREE.DoubleSide}),
            new THREE.MeshPhongMaterial({color: '#FF1111', side: THREE.DoubleSide}),
        ]

        const extGeo = new THREE.ExtrudeGeometry(shape, extrudeSettings)
        const extMesh1 = new THREE.Mesh(extGeo, extMat)

        const extMesh2 = extMesh1.clone()
        const extMesh3 = extMesh1.clone()
        const extMesh4 = extMesh1.clone()
        const extMesh5 = extMesh1.clone()
        const extMesh6 = extMesh1.clone()

        extMesh2.rotateZ(Math.PI * 2 / 6)
        extMesh3.rotateZ(Math.PI * 2 / 6 * 2)
        extMesh4.rotateZ(Math.PI * 2 / 6 * 3)
        extMesh5.rotateZ(Math.PI * 2 / 6 * 4)
        extMesh6.rotateZ(Math.PI * 2 / 6 * 5)

        coil.add(extMesh1, extMesh2, extMesh3, extMesh4, extMesh5, extMesh6)
        coil.rotateX(Math.PI * 0.5)
        coil.position.y = coilLength/2
        rotor.add(coil)

        group.add(rotor)

        group.rotateZ(Math.PI * 0.5)
        group.position.y = motorRadius + 200
        group.position.x = (2000 - motorLength)/2

        this.add(group)

        return rotor

    }

    private addJoinAndGetOutJoinX() {
        const {baseLength, baseWidth, baseHeight, motorShellOpacity, motorRadius, motorShellColor} = this.options
        
        const group = new THREE.Group()

        const mat = new THREE.MeshPhongMaterial({
            color: motorShellColor,
            specular: motorShellColor,
            shininess: 15,
        })

        //大圆盘 腔体
        const cavityRadius = 300
        const cavityLength = 300
        const cavityGeo = new THREE.CylinderGeometry(cavityRadius, cavityRadius, cavityLength, 32)
        const cavity = new THREE.Mesh(cavityGeo, mat)
        cavity.rotateZ(Math.PI * 0.5)
        group.add(cavity)

        //竖向管 出水管
        const outJoinRadius = 80
        const outJoinLength = 500
        const outJoinGeo = new THREE.CylinderGeometry(outJoinRadius, outJoinRadius, outJoinLength, 32)
        const outJoin = new THREE.Mesh(outJoinGeo, mat)
        outJoin.position.y = 300
        group.add(outJoin)

        //横向管 进水管
        const inJoinRadius = 80
        const inJoinLength = 500
        const inJoinGeo = new THREE.CylinderGeometry(inJoinRadius, inJoinRadius, inJoinLength, 32)
        const inJoin = new THREE.Mesh(inJoinGeo, mat)
        inJoin.rotateZ(Math.PI * 0.5)
        inJoin.position.x = -cavityLength/2
        group.add(inJoin)

        //接头位于距离左侧边缘 八分之一处
        group.position.x = -(baseLength/2 - baseLength/2/4)
        group.position.y = baseHeight + motorRadius

        this.add(group)

        //因为左侧进水接头长于底坐, 所以从右侧算, 即: 接头位于距离底座右侧的 八分之七处
        return baseLength - baseLength/2/4
    }

    run() {
        this.coilAnimation.resume()
    }

    stop() {
        this.coilAnimation.pause()
    }

    createCoilAnimation() {
        return gsap.to(
            this.rotor.rotation,
            {
                y: Math.PI * 4,
                duration: 1,
                repeat: -1,
                ease: "none",
                paused: true,
            }
        )
    }

}
