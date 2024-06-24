import * as THREE from "three"
import {LineGeometry} from "three/examples/jsm/lines/LineGeometry"
import {LineMaterial} from "three/examples/jsm/lines/LineMaterial"
import {Line2} from "three/examples/jsm/lines/Line2"
import gsap from "gsap"
import MyGroup from "@/three-widget/MyGroup"
import {getTextureLoader} from "@/three-widget/loader/ThreeLoader"


/**
 * @param color?: number
 * @param roomLength?: number
 * @param roomWidth?: number
 * @param roomHeight?: number
 * @param floorLength?: number
 * @param floorWidth?: number
 * @param doorWidth?: number
 * @param doorHeight?: number
 * @param inDoorState?: DoorState
 * @param outDoorState?: DoorState
 */
export interface RoomOptions {
    color?: number
    roomLength?: number
    roomWidth?: number
    roomHeight?: number
    floorLength?: number
    floorWidth?: number
    doorWidth?: number
    doorHeight?: number
    inDoorState?: DoorState
    outDoorState?: DoorState
}


class Door extends THREE.Mesh {
    working = false
    state: DoorState = "Close"
    openAnimation: gsap.core.Tween | null = null
    closeAnimation: gsap.core.Tween | null = null
}

export default class Room extends MyGroup<RoomOptions> {

    private readonly inDoor: Door
    private readonly outDoor: Door

    constructor(name: string, options?: RoomOptions) {

        const defaultOptions: Required<RoomOptions> = {
            color: 0x0b689b,
            roomLength: 14000,
            roomWidth: 6000,
            roomHeight: 6000,
            floorLength: 18000,
            floorWidth: 10000,
            doorWidth: 4000,
            doorHeight: 5000,
            inDoorState: "Close",
            outDoorState: "Close",
        }

        super(name, defaultOptions, options)

        this.addFloor()
        this.addWall()
        this.addTop()

        const inDoor = this.createDoor()
        inDoor.position.x = -this.options.roomLength/2
        inDoor.rotateY(Math.PI * 0.5)
        inDoor.name = "入口门"
        inDoor.openAnimation = this.createOpenDoorAnimation(inDoor)
        inDoor.closeAnimation = this.createCloseDoorAnimation(inDoor)
        this.inDoor = inDoor
        this.add(inDoor)

        const outDoor = this.createDoor()
        outDoor.position.x = this.options.roomLength/2
        outDoor.rotateY(Math.PI * -0.5)
        outDoor.name = "出口门"
        outDoor.openAnimation = this.createOpenDoorAnimation(outDoor)
        outDoor.closeAnimation = this.createCloseDoorAnimation(outDoor)
        this.outDoor = outDoor
        this.add(outDoor)
    }


    /**
     * 地面大小 18000X10000, 车间大小14000X6000, 四边各余出2000
     */
    private addFloor() {
        const geometry = new LineGeometry()

        const halfLength = this.options.floorLength/2
        const halfWidth = this.options.floorWidth/2

        const points = [
            halfLength, 0, halfWidth,
            halfLength, 0, -halfWidth,
            -halfLength, 0, -halfWidth,
            -halfLength, 0, halfWidth,
            halfLength, 0, halfWidth,
        ]

        geometry.setPositions(points)

        const material = new LineMaterial({
            color: this.options.color,
            linewidth: 3,
        })

        // 把渲染窗口尺寸分辨率传值给材质LineMaterial的resolution属性, 否则会卡死浏览器
        // resolution属性值会在着色器代码中参与计算
        material.resolution.set(window.innerWidth, window.innerHeight)

        //使用Line2类, 普通线条在webgl下宽度只有1, 其它值无效
        const floor = new Line2(geometry, material)
        floor.name = "地板"
        this.add(floor)
    }


    private addWall() {
        const material = new LineMaterial({
            color: this.options.color,
            linewidth: 3,
            side: THREE.DoubleSide,
        })
        // 把渲染窗口尺寸分辨率传值给材质LineMaterial的resolution属性, 否则会卡死浏览器
        // resolution属性值会在着色器代码中参与计算
        material.resolution.set(window.innerWidth, window.innerHeight)

        //前后墙 注意 roomLength
        const halfWidth = this.options.roomLength / 2
        const height = this.options.roomHeight

        let points = []
        points.push(-halfWidth, 0, 0)
        points.push(halfWidth, 0, 0)
        points.push(halfWidth, height, 0)
        points.push(-halfWidth, height, 0)
        points.push(-halfWidth, 0, 0)

        const lineGeometry = new LineGeometry()
        lineGeometry.setPositions(points)

        const wall1 = new Line2(lineGeometry, material)
        const wall2 = wall1.clone()

        wall1.name = '前墙'
        wall2.name = '后墙'

        wall1.position.z = this.options.roomWidth/2
        wall2.position.z = -this.options.roomWidth/2



        //左右墙
        const halfSideWidth = this.options.roomWidth / 2
        const sideHeight = this.options.roomHeight

        //门距离侧边的距离
        const doorOffsetZ = this.options.roomWidth/2 - this.options.doorWidth/2
        const doorHeight = this.options.doorHeight

        //墙减去门后的形状
        points = []
        points.push(0, 0, halfSideWidth)
        points.push(0, sideHeight, halfSideWidth)
        points.push(0, sideHeight, -halfSideWidth)
        points.push(0, 0, -halfSideWidth)
        points.push(0, 0, -(halfSideWidth - doorOffsetZ))
        points.push(0, doorHeight, -(halfSideWidth - doorOffsetZ))
        points.push(0, doorHeight, halfSideWidth - doorOffsetZ)
        points.push(0, 0, halfSideWidth - doorOffsetZ)
        points.push(0, 0, halfSideWidth)


        const lineGeometry2 = new LineGeometry()
        lineGeometry2.setPositions(points)

        const wall3 = new Line2(lineGeometry2, material)
        const wall4 = wall3.clone()


        wall3.name = '入口墙'
        wall4.name = '出口墙'

        wall3.position.x = -halfWidth
        wall4.position.x = halfWidth

        this.add(wall1, wall2, wall3, wall4)
    }

    /**
     * 创建房顶
     */
    private addTop() {

        //房顶对于房间 每边各长出 1米
        const topLength = this.options.roomLength + 2000
        const halfTopLength = topLength/2
        const topWidth = this.options.roomWidth + 2000
        const halfTopWidth = topWidth/2

        const group = new THREE.Group()

        const points = []

        //房顶弧线半径
        const topLineRadius = 6000

        //创建一段弧线
        const curve = new THREE.EllipseCurve(
            0,
            0,
            topLineRadius,
            topLineRadius,
            Math.PI * 0.25,
            Math.PI * 0.75,
            false,
            0
        )

        //在弧线上取50个点
        const curvePoints = curve.getPoints(50)

        //将弧线的2维点转成3维点
        for (let point of curvePoints) {
            points.push(point.x, point.y, halfTopLength)
        }

        //跳到对侧
        points.push(curvePoints[curvePoints.length - 1].x, curvePoints[curvePoints.length - 1].y, -halfTopLength)

        //对侧弧线
        for (let i = 0; i < curvePoints.length; i++) {
            points.push(curvePoints[curvePoints.length - 1 - i].x, curvePoints[curvePoints.length - 1 - i].y, -halfTopLength)
        }

        //跳回本侧
        points.push(curvePoints[0].x, curvePoints[0].y, halfTopLength)

        const topLineGeometry = new LineGeometry()

        topLineGeometry.setPositions(points)

        const material = new LineMaterial({
            color: this.options.color,
            linewidth: 3,
        })

        //材质的分辨率必须设置，要不显示的线宽度不正确
        material.resolution.set(window.innerWidth, window.innerHeight)
        const outLine = new Line2(topLineGeometry, material)

        //在弧线中心点, 生成一条直接连接两侧弧线, 做为房顶的中间线条
        const middleLineGeometry = new LineGeometry()
        middleLineGeometry.setPositions([curvePoints[25].x, curvePoints[25].y, halfTopLength, curvePoints[25].x, curvePoints[25].y, -halfTopLength])
        const middleLine = new Line2(middleLineGeometry, material)


        outLine.name = '房顶外轮廓线'
        middleLine.name = '房顶中心线'

        group.add(outLine, middleLine)
        group.name = "房顶"

        group.rotateY(Math.PI * 0.5)
        group.position.y = 1000

        this.add(group)
    }


    private createDoor(state: DoorState = "Close"): Door {

        const geometry = new THREE.PlaneGeometry(this.options.doorWidth, this.options.doorHeight, 1, 1)
        geometry.translate(0, -this.options.doorHeight/2, 0)

        const texture = getTextureLoader().load("/demo/scene-ming/common/room/door3.png")
        
        texture.colorSpace = THREE.SRGBColorSpace

        const material = new THREE.MeshBasicMaterial({
            map: texture,
            side: THREE.DoubleSide,
            opacity: 1,
            transparent: true,
        })

        const entity = new Door(geometry, material)
        entity.position.y = this.options.doorHeight
        return entity
    }


    openInDoor() {
        this.openDoor(this.inDoor)
    }

    closeInDoor() {
        this.closeDoor(this.inDoor)
    }

    openOutDoor() {
        this.openDoor(this.outDoor)
    }

    closeOutDoor() {
        this.closeDoor(this.outDoor)
    }

    private createOpenDoorAnimation(door: Door) {
        return gsap.to(
            door.scale,
            {
                y: 0,
                duration: 3,
                ease: "none",
                paused: true,
                onStart: () => {
                    door.working = true
                },
                onComplete: () => {
                    door.working = false
                    door.state = "Open"
                }
            }
        )
    }

    private createCloseDoorAnimation(door: Door) {
        return gsap.to(
            door.scale,
            {
                y: 1,
                duration: 3,
                ease: "none",
                paused: true,
                onStart: () => {
                    door.working = true
                },
                onComplete: () => {
                    door.working = false
                    door.state = "Close"
                }
            }
        )
    }

    private openDoor(door: Door) {

        if (door.state === "Open") {
            console.log(`${door.name}已处于打开状态`)
            return
        }

        if (door.working) {
            console.log(`${door.name}正在工作中, 请稍候`)
            return
        }

        door.openAnimation!.restart()
    }

    private closeDoor(door: Door) {

        if (door.state === "Close") {
            console.log(`${door.name}已处于关闭状态`)
            return
        }

        if (door.working) {
            console.log(`${door.name}正在工作中, 请稍候`)
            return
        }

        door.closeAnimation!.restart()
    }

}