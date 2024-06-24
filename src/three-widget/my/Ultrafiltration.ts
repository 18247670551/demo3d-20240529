import * as THREE from 'three'
import MyGroup from "@/three-widget/MyGroup"
import Pipe from "@/three-widget/my/pipe/Pipe"
import PathUtils from "@/three-widget/PathUtils"
import {getTextureLoader} from "@/three-widget/loader/ThreeLoader"


/**
 * @param length
 * @param width
 * @param height
 * @param frameThickness
 * @param frameColor
 * @param bottomThickness
 * @param bottomColor
 */
interface UltrafiltrationOptions {
    length?: number
    width?: number
    height?: number
    frameThickness?: number
    frameColor?: number
    bottomThickness?: number
    bottomColor?: number
    filterElementRadius?: number
    filterElementHeight?: number
    filterElementRowSpace?: number
    filterElementColumnOffsetX?: number
    mainPipeRadius?: number
}

/**
 * 超滤机
 */
export default class Ultrafiltration extends MyGroup<UltrafiltrationOptions> {

    private elementPipeRadius = 40
    private elementPipeRectRadius = 100
    private elementJoinRadius = 50
    //接头 2 和 3 距离主滤管边缘的距离
    private join23OffsetYOfSide = 100

    //主管道由上到下分别为 1: 浓水出口, 2: 产水出口, 3: 产水出口(暂时不用此口), 4: 原水入口

    //主管道1距上表面200
    private join1MainPipeOffsetYOfTop = 200

    //主管道4距下表面200
    private join4MainPipeOffsetYOfBottom = 200

    private join1MainPipe: Pipe | null = null
    private join2MainPipe: Pipe | null = null
    private join4MainPipe: Pipe | null = null


    getJoin1MainPipeY() {
        return this.options.height / 2 - this.join1MainPipeOffsetYOfTop
    }

    getJoin2MainPipeY() {
        return this.options.filterElementHeight / 2 - this.join23OffsetYOfSide
    }

    getJoin3MainPipeY() {
        return -(this.options.filterElementHeight / 2 - this.join23OffsetYOfSide)
    }

    getJoin4MainPipeY() {
        return -(this.options.height / 2 - this.join4MainPipeOffsetYOfBottom)
    }


    constructor(name: string, options?: UltrafiltrationOptions) {
        const defaultOptions: Required<UltrafiltrationOptions> = {
            length: 2000,
            width: 7000,
            height: 3000,
            frameThickness: 80,
            frameColor: 0x777777,
            bottomThickness: 100,
            bottomColor: 0x666666,
            filterElementRadius: 150,
            filterElementHeight: 1500,
            filterElementRowSpace: 600,
            filterElementColumnOffsetX: 1000,
            mainPipeRadius: 80,
        }

        super(name, defaultOptions, options)

        this.addFrame()

        this.addLogo()
        this.addJoin1MainPipe()
        this.addJoin2MainPipe()
        this.addJoin4MainPipe()

        this.addFilterElement()
    }

    private addLogo(){
        const {length, width, height, frameThickness: thickness, frameColor: color} = this.options

        const logoHeight = 1000
        const geo = new THREE.BoxGeometry(width, logoHeight, thickness )

        const texture = getTextureLoader().load("/demo/scene-ming/purity/purity_device_logo.png")
        
        texture.colorSpace = THREE.SRGBColorSpace
        const logoMat = new THREE.MeshPhongMaterial({map: texture, color: 0xFFFFFF, transparent: true, opacity: 1, side: THREE.DoubleSide})
        const grayMat = new THREE.MeshPhongMaterial({color: 0x555555, side: THREE.DoubleSide})
        const mat = new THREE.MeshPhongMaterial({color: 0xEEEEEE, side: THREE.DoubleSide})
        const mats = [
            grayMat,
            grayMat,
            grayMat,
            grayMat,
            logoMat,
            mat,
        ]
        const entity = new THREE.Mesh(geo, mats)
        entity.name = "logo"
        entity.position.y = height/2 + logoHeight/2
        entity.position.x = -length/2 + thickness/2
        entity.rotateY(-Math.PI * 0.5)
        this.add(entity)
    }

    private addFrame() {

        const {length, width, height, frameThickness: thickness, frameColor: color} = this.options

        const halfHeight = height / 2
        const halfWidth = width / 2
        const halfThickness = thickness / 2
        const group = new THREE.Group()

        //挖洞
        const innerWidth = halfWidth - thickness
        const innerHeight = halfHeight - thickness

        const shape = new THREE.Shape()
        shape.moveTo(halfWidth, halfHeight)
        shape.lineTo(halfWidth, -halfHeight)
        shape.lineTo(-halfWidth, -halfHeight)
        shape.lineTo(-halfWidth, halfHeight)
        shape.lineTo(halfWidth, halfHeight)

        const hole = new THREE.Path()
        hole.moveTo(innerWidth, innerHeight)
        hole.lineTo(innerWidth, -innerHeight)
        hole.lineTo(-innerWidth, -innerHeight)
        hole.lineTo(-innerWidth, innerHeight)
        hole.lineTo(innerWidth, innerHeight)

        shape.holes.push(hole)

        const extrudeSettings = {
            steps: 1,
            depth: thickness,
            bevelEnabled: false
        }

        const geo = new THREE.ExtrudeGeometry(shape, extrudeSettings)
        geo.center()
        const mat = new THREE.MeshPhongMaterial({
            color,
            transparent: true,
            opacity: 1,
            side: THREE.DoubleSide,
        })

        const front = new THREE.Mesh(geo, mat)
        front.name = "前框架"
        front.rotateY(Math.PI * 0.5)
        front.position.x = length / 2 - halfThickness
        group.add(front)

        const back = front.clone()
        back.name = "后框架"
        back.position.x = -(length / 2 - halfThickness)
        group.add(back)


        const up = new THREE.Group()

        const itemLength = length - thickness * 2
        const itemGeo = new THREE.BoxGeometry(itemLength, thickness, thickness)
        const item = new THREE.Mesh(itemGeo, mat)
        item.position.z = -(width / 2 - halfThickness)
        up.add(item)
        const itemClone1 = item.clone()
        itemClone1.position.z = width / 2 - halfThickness
        up.add(itemClone1)

        up.position.y = halfHeight - halfThickness
        up.name = "上框架"
        group.add(up)

        const down = up.clone()
        down.position.y = -(halfHeight - halfThickness)
        down.name = "下框架"
        group.add(down)

        this.add(group)
    }

    private addFilterElement() {

        //滤芯列间距, 中间要走主管道, 留1米, 一共两列, 相当于 左排左移500, 右排右移500
        const space = this.options.filterElementColumnOffsetX

        //滤芯行间距
        const js = this.options.filterElementRowSpace
        //滤芯行数
        const jCount = 10

        const leftGroup = new THREE.Group()
        leftGroup.name = "滤芯组-左排"

        for (let j = 0; j < jCount; j++) {
            const element = this.createFilterElement()

            const offsetZ = j * js
            element.position.z = offsetZ
            element.name = `滤芯组-左排${j}`

            const upJoinPipe = this.createJoin2Pipe(this.getJoin2MainPipeY())
            upJoinPipe.position.z = offsetZ
            upJoinPipe.name = `滤芯组-左排${j}侧面上方接头出水管道1`

            const upPipe = this.createJoin1Pipe()
            upPipe.position.z = offsetZ
            upPipe.name = `滤芯组-左排${j}上方接头出水管道1`

            const downPipe = this.createJoin4Pipe()
            downPipe.position.z = offsetZ
            downPipe.name = `滤芯组-左排${j}下方接头出水管道1`

            leftGroup.add(element, upJoinPipe, upPipe, downPipe)
        }

        //移动间距总数的一半(10个物体有9个间距)
        leftGroup.translateZ(-(js * (jCount - 1) / 2))
        //左排左移500
        leftGroup.translateX(-space / 2)


        const rightGroup = new THREE.Group()
        rightGroup.name = "滤芯组-右排"

        for (let j = 0; j < jCount; j++) {
            const element = this.createFilterElement()

            const offsetZ = j * js
            element.position.z = offsetZ
            element.name = `滤芯组-右排${j}`


            const upJoinPipe = this.createJoin2Pipe(this.getJoin2MainPipeY())
            upJoinPipe.position.z = offsetZ
            upJoinPipe.name = `滤芯组-右排${j}侧面上方接头水出水管道1`

            const upPipe = this.createJoin1Pipe()
            upPipe.position.z = offsetZ
            upPipe.name = `滤芯组-右排${j}上方接头出水管道1`


            const downPipe = this.createJoin4Pipe()
            downPipe.position.z = offsetZ
            downPipe.name = `滤芯组-左排${j}下方接头出水管道1`

            rightGroup.add(element, upJoinPipe, upPipe, downPipe)
        }
        rightGroup.rotateY(Math.PI)

        //移动间距总数的一半(10个物体有9个间距)
        rightGroup.translateZ(-(js * (jCount - 1) / 2))
        //右排右移500
        rightGroup.translateX(-space / 2)


        this.add(leftGroup, rightGroup)
    }

    /**
     * 上主管道, 所有滤芯的上出口集合主管道, 一般是浓水出水
     * <br>管道走向: 从前向后
     */
    private addJoin1MainPipe() {
        const pu = new PathUtils()
        const x = 0
        const y = this.getJoin1MainPipeY()
        const z = this.options.width / 2
        const mainPipeRadius = this.options.mainPipeRadius
        pu.push([x, y, z])
        pu.push([x, y, -z])
        const mainPipe = new Pipe("上出口主管道", {radius: mainPipeRadius, points: pu.points})
        this.join1MainPipe = mainPipe
        this.add(mainPipe)
        return mainPipe
    }


    /**
     * 下主管道, 所有滤芯的上出口集合主管道, 一般是原水进水
     * <br>管道走向: 从前向后
     */
    private addJoin4MainPipe() {
        const pu = new PathUtils()
        const x = 0
        const y = this.getJoin4MainPipeY()
        const z = this.options.width / 2
        const mainPipeRadius = this.options.mainPipeRadius
        pu.push([x, y, z])
        pu.push([x, y, -z])
        const mainPipe = new Pipe("下出口主管道", {radius: mainPipeRadius, points: pu.points})
        this.join4MainPipe = mainPipe
        this.add(mainPipe)
        return mainPipe
    }

    /**
     * 所有滤芯的侧面上出口集合主管道, 一般是产水出水
     * <br>管道走向: 从前向后
     */
    private addJoin2MainPipe() {
        const pu = new PathUtils()
        const x = 0
        const y = this.getJoin2MainPipeY()
        const z = this.options.width / 2
        const mainPipeRadius = this.options.mainPipeRadius
        pu.push([x, y, z])
        pu.push([x, y, -z])
        const mainPipe = new Pipe("侧面上出口主管道", {radius: mainPipeRadius, points: pu.points})
        this.join2MainPipe = mainPipe
        this.add(mainPipe)
        return mainPipe
    }


    //创建滤芯正上方管道, 一般是浓水出水口
    private createJoin1Pipe() {

        const pipeRadius = this.elementPipeRadius
        const pipeRectRadius = this.elementPipeRectRadius
        const mainPipeRadius = this.options.mainPipeRadius

        const pu = new PathUtils()
        const x = 0
        const y = this.options.filterElementHeight / 2
        const z = 0

        pu.push([x, y, z])
        //第一段, 直管, 垂直向上, 到达上方主管道y位置, 留出转弯半径
        pu.push([pu.last.x, this.getJoin1MainPipeY() - pipeRectRadius, pu.last.z])
        //第一段直管转弯, 由左向上 == X2Y1
        pu.pushQuarterArc("Y2X1", pipeRectRadius)
        //第二段直管, 向右, 到主管道上
        pu.push([(this.options.filterElementColumnOffsetX / 2 - mainPipeRadius * 0.8), pu.last.y, pu.last.z])

        return new Pipe("滤芯上方接头管道", {points: pu.points, radius: pipeRadius})
    }

    //创建滤芯正下方管道, 一般是原水入口
    private createJoin4Pipe() {

        const pipeRadius = this.elementPipeRadius
        const pipeRectRadius = this.elementPipeRectRadius
        const mainPipeRadius = this.options.mainPipeRadius

        const pu = new PathUtils()
        const x = 0
        const y = -this.options.filterElementHeight / 2
        const z = 0

        pu.push([x, y, z])
        //第一段, 直管, 垂直向下, 到达下方主管道y位置, 留出转弯半径
        pu.push([pu.last.x, this.getJoin4MainPipeY() + pipeRectRadius, pu.last.z])
        //第一段直管转弯, 由上向后 == Y1X1
        pu.pushQuarterArc("Y1X1", pipeRectRadius)
        //第二段直管, 向右, 到主管道上
        pu.push([(this.options.filterElementColumnOffsetX/2 - mainPipeRadius * 0.8), pu.last.y, pu.last.z])

        return new Pipe("滤芯下方接头管道", {points: pu.points, radius: pipeRadius})
    }


    //创建滤芯侧面接口水管, join2 join3 只有y不同, 传入y
    private createJoin2Pipe(y: number) {

        //从上产水出水到产水总线上的管段, 只有一段直管, 管长 = 滤芯间距的一半 - 滤芯半径的*0.8 - 总线管道半径*0.8(乘以0.8是为了管道不是正好接触, 是有一部分重叠)
        const pipeRadius = this.elementPipeRadius
        const pipeRectRadius = this.elementPipeRectRadius
        const mainPipeRadius = this.options.mainPipeRadius
        const filterElementRadius = this.options.filterElementRadius

        const startX = -filterElementRadius * 0.8
        const endX = (this.options.filterElementColumnOffsetX / 2) - mainPipeRadius * 0.8

        const points = [
            [startX, y, 0],
            [endX, y, 0],
        ]

        return new Pipe("滤芯产水出水管道", {points: points, radius: pipeRadius})
    }


    //创建滤芯
    private createFilterElement() {
        const {filterElementRadius, filterElementHeight} = this.options

        const group = new THREE.Group()
        group.name = "滤芯"

        const texture = getTextureLoader().load("/demo/scene-ming/purity/purity_filter.png")
        
        texture.colorSpace = THREE.SRGBColorSpace
        texture.wrapS = texture.wrapT = THREE.RepeatWrapping
        texture.repeat.set(1, 1)
        texture.offset.x = Math.PI * 1.19
        const filterMat = new THREE.MeshPhongMaterial({map: texture, color: 0xFFFFFF, transparent: true, opacity: 1})
        const blackMat = new THREE.MeshPhongMaterial({color: 0x111111, side: THREE.DoubleSide})

        const mainGeo = new THREE.CylinderGeometry(filterElementRadius, filterElementRadius, filterElementHeight)
        const main = new THREE.Mesh(mainGeo, filterMat)
        main.name = "主滤管"
        group.add(main)

        const top = new THREE.Group()
        top.name = "顶盖"

        //顶盖底台
        const top1Radius = filterElementRadius + 10, top1Height = 100
        const top1Geo = new THREE.CylinderGeometry(top1Radius, top1Radius, top1Height)
        const top1 = new THREE.Mesh(top1Geo, blackMat)
        top1.position.y = top1Height / 2
        top1.name = "盖子底台"
        top.add(top1)

        //顶盖中台
        const top2Radius = top1Radius + 10, top2Height = 50
        const top2Geo = new THREE.CylinderGeometry(top2Radius, top2Radius, top2Height)
        const top2 = new THREE.Mesh(top2Geo, blackMat)
        top2.position.y = top1Height + top2Height / 2
        top2.name = "盖子中台"
        top.add(top2)

        //顶盖半球
        const top3Radius = filterElementRadius
        const top3Geo = new THREE.SphereGeometry(top3Radius, 32, 8, 0, Math.PI * 2, 0, Math.PI * 0.5)
        const top3 = new THREE.Mesh(top3Geo, blackMat)
        top3.position.y = top1Height + top2Height - top3Radius * 0.3
        top3.name = "盖子半球面"
        top.add(top3)

        //顶盖接头
        const top4Radius = this.elementJoinRadius, top4Height = filterElementRadius
        const top4Geo = new THREE.CylinderGeometry(top4Radius, top4Radius, top4Height)
        const top4 = new THREE.Mesh(top4Geo, blackMat)
        top4.position.y = top1Height + top2Height + top3Radius - top4Height / 2
        top4.name = "盖子接头"
        top.add(top4)

        top.position.y = filterElementHeight / 2
        group.add(top)

        const bottom = top.clone()
        bottom.name = "底盖"
        bottom.position.y = -(filterElementHeight / 2)
        bottom.rotateZ(Math.PI)
        group.add(bottom)

        //产水接头
        const joinRadius = this.elementJoinRadius, joinHeight = 50
        const topJoinGeo = new THREE.CylinderGeometry(joinRadius, joinRadius, joinHeight)
        const topJoin = new THREE.Mesh(topJoinGeo, blackMat)
        topJoin.rotateZ(Math.PI * 0.5)
        topJoin.position.y = this.getJoin2MainPipeY()
        topJoin.position.x = filterElementRadius
        topJoin.name = "上产水接头"
        group.add(topJoin)

        const bottomJoin = topJoin.clone()
        bottomJoin.position.y = this.getJoin3MainPipeY()
        bottomJoin.position.x = filterElementRadius
        bottomJoin.name = "下产水接头"
        group.add(bottomJoin)

        return group
    }


}