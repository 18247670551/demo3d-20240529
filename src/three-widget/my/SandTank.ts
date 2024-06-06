import * as THREE from "three"
import {LatheGeometry} from "three"
import MyGroup from "@/three-widget/MyGroup"
import PathUtils from "@/three-widget/PathUtils";
import Pipe from "@/three-widget/my/pipe/Pipe";


/**
 * @param bodyHeight 罐体高
 * @param xRadius 罐体㮋圆长轴
 * @param yRadius 罐体㮋圆短轴
 */
interface SandTankOptions {
    bodyHeight?: number
    legHeight?: number
    xRadius?: number
    yRadius?: number
    joinRadius?: number
    bodyColor?: number
    joinColor?: number
}


/**
 * 储气罐
 */
export default class SandTank extends MyGroup<SandTankOptions> {

    private joinLength = 400

    /**
     * 出气口高度
     */
    readonly joinsPosition = {
        inJoinPosition : {x: 0, y: 0, z: 0},
        outJoinPosition : {x: 0, y: 0, z: 0},
        washInJoinPosition : {x: 0, y: 0, z: 0},
        washUpDrainJoinPosition : {x: 0, y: 0, z: 0},
        washDownDrainJoinPosition : {x: 0, y: 0, z: 0},
    }

    constructor(name: string, options?: SandTankOptions) {

        const defaultOptions: Required<SandTankOptions> = {
            bodyHeight: 3000,
            legHeight: 600,
            xRadius: 1000,
            yRadius: 600,
            joinRadius: 90,
            bodyColor: 0x0246A9,
            joinColor: 0x023177,
        }

        super(name, defaultOptions, options)

        this.addBody()
        this.addLegs()
        this.addJoins()
    }

    private addBody() {
        const {bodyHeight, legHeight, xRadius, yRadius, joinRadius, bodyColor, joinColor} = this.options

        const group = new THREE.Group

        const garyMat = new THREE.MeshPhongMaterial({
            color: bodyColor,
            specular: bodyColor,
            shininess: 15,
        })

        const points = new THREE.EllipseCurve(
            0,
            yRadius,
            xRadius,
            yRadius,
            Math.PI * 1.5,
            0,
            false,
            0
        ).getPoints(50)

        points.push(new THREE.Vector2(xRadius, bodyHeight - yRadius * 2))

        const arcPoints = new THREE.EllipseCurve(
            0,
            points[points.length - 1].y,
            xRadius,
            yRadius,
            0,
            Math.PI * 0.5,
            false,
            0
        ).getPoints(50)

        points.push(...arcPoints)

        const geometry = new LatheGeometry(points, 50, 0, Math.PI * 2)

        const mesh = new THREE.Mesh(geometry, garyMat)
        mesh.name = "罐体"
        mesh.position.y = legHeight
        group.add(mesh)
        this.add(mesh)
    }

    addLegs(){
        const {bodyHeight, legHeight, xRadius, yRadius, joinRadius, bodyColor, joinColor} = this.options

        const garyMat = new THREE.MeshPhongMaterial({
            color: bodyColor,
            specular: bodyColor,
            shininess: 15,
        })

        //腿长1米, 因罐体底部是圆形, 为了保证腿跟罐体接触, 腿做成双倍长度, 其中一倍长度与罐体重合
        const legGeo = new THREE.CylinderGeometry(80, 80, legHeight * 2, 32, 1)
        legGeo.translate(xRadius * 0.8, legHeight, 0)
        const leg1 = new THREE.Mesh(legGeo, garyMat)
        leg1.rotateY(Math.PI / 3)
        this.add(leg1)

        const leg2 = leg1.clone()
        leg2.rotateY(Math.PI / 3 * 2)
        this.add(leg2)

        const leg3 = leg1.clone()
        leg3.rotateY(Math.PI / 3 * 4)
        this.add(leg3)
    }

    addJoins(){

        const joinOffsetY = 400
        const rectRadius = 200

        const group = new THREE.Group()

        const {bodyHeight, legHeight, xRadius, yRadius, joinRadius, bodyColor, joinColor} = this.options

        const mat = new THREE.MeshPhongMaterial({
            color: joinColor,
            specular: joinColor,
            shininess: 15,
        })

        const upBodyJoinBaseGeo = new THREE.CylinderGeometry(joinRadius * 1.3, joinRadius * 1.3, 300, 16)
        const upBodyJoinBase = new THREE.Mesh(upBodyJoinBaseGeo, mat)
        upBodyJoinBase.name = "罐体上部接头基座"
        upBodyJoinBase.position.y = bodyHeight
        group.add(upBodyJoinBase)

        //进水接头高度
        const inJoinY = bodyHeight/2 + legHeight + joinOffsetY
        //反选上排出水接头高度
        const washUpDrainJoinY = inJoinY

        const upPath1 = new PathUtils()
        upPath1.push([0, bodyHeight, 0])
        //先做一段直管向上300再拐弯, 美观
        upPath1.push([upPath1.last.x, upPath1.last.y + 200, upPath1.last.z])
        upPath1.pushQuarterArc("Y2Z1", rectRadius)
        upPath1.push([upPath1.last.x, upPath1.last.y, xRadius * 1.2 - rectRadius])
        upPath1.pushQuarterArc("Z2Y2", rectRadius)
        upPath1.push([upPath1.last.x, inJoinY, upPath1.last.z])

        const upPipe1 = new Pipe("上接头管1", {points: upPath1.points, color: joinColor, radius: joinRadius})
        group.add(upPipe1)

        const inJoinGeo = new THREE.CylinderGeometry(joinRadius, joinRadius, this.joinLength, 16)
        inJoinGeo.translate(0, this.joinLength/2, 0)
        const inJoin = new THREE.Mesh(inJoinGeo, mat)
        inJoin.position.y = inJoinY
        inJoin.position.z = upPath1.last.z
        inJoin.rotateZ(Math.PI * 0.5)
        inJoin.name = "进水接头"
        group.add(inJoin)

        const washUpDrainJoinGeo = new THREE.CylinderGeometry(joinRadius, joinRadius, this.joinLength, 16)
        washUpDrainJoinGeo.translate(0, this.joinLength/2, 0)
        const washUpDrainJoin = new THREE.Mesh(washUpDrainJoinGeo, mat)
        washUpDrainJoin.position.y = washUpDrainJoinY
        washUpDrainJoin.position.z = upPath1.last.z
        washUpDrainJoin.rotateZ(-Math.PI * 0.5)
        washUpDrainJoin.name = "反洗上排接头"
        group.add(washUpDrainJoin)




        const downBodyJoinBaseGeo = new THREE.CylinderGeometry(joinRadius * 1.3, joinRadius * 1.3, 300, 16)
        const downBodyJoinBase = new THREE.Mesh(downBodyJoinBaseGeo, mat)
        downBodyJoinBase.name = "罐体下部接头基座"
        downBodyJoinBase.position.y = legHeight
        group.add(downBodyJoinBase)

        //出水接头高度
        const outJoinY = bodyHeight/2 - joinOffsetY
        //反洗进水接头高度
        const washInJoinY = outJoinY
        //反洗下排出水接头高度
        const washDownDrainJoinY = outJoinY - 400

        const downPath1 = new PathUtils()
        downPath1.push([0, legHeight, 0])
        //先做一段直管向下300再拐弯, 美观
        downPath1.push([downPath1.last.x, downPath1.last.y - 200, downPath1.last.z])
        downPath1.pushQuarterArc("Y1Z1", rectRadius)
        downPath1.push([downPath1.last.x, downPath1.last.y, xRadius * 1.2 - rectRadius])
        downPath1.pushQuarterArc("Z2Y1", rectRadius)
        downPath1.push([downPath1.last.x, outJoinY, downPath1.last.z])

        const downPipe1 = new Pipe("下接头管1", {points: downPath1.points, color: joinColor, radius: joinRadius})
        group.add(downPipe1)


        const washInJoinGeo = new THREE.CylinderGeometry(joinRadius, joinRadius, this.joinLength, 16)
        washInJoinGeo.translate(0, this.joinLength/2, 0)
        const washInJoin = new THREE.Mesh(washInJoinGeo, mat)
        washInJoin.position.y = washInJoinY
        washInJoin.position.z = downPath1.last.z
        washInJoin.rotateZ(Math.PI * 0.5)
        washInJoin.name = "反洗进水接头"
        group.add(washInJoin)

        const outJoinGeo = new THREE.CylinderGeometry(joinRadius, joinRadius, this.joinLength, 16)
        outJoinGeo.translate(0, this.joinLength/2, 0)
        const outJoin = new THREE.Mesh(outJoinGeo, mat)
        outJoin.position.y = outJoinY
        outJoin.position.z = downPath1.last.z
        outJoin.rotateZ(-Math.PI * 0.5)
        outJoin.name = "出水接头"
        group.add(outJoin)

        const washDownDrainJoinGeo = new THREE.CylinderGeometry(joinRadius, joinRadius, this.joinLength, 16)
        washDownDrainJoinGeo.translate(0, this.joinLength/2, 0)
        const washDownDrainJoin = new THREE.Mesh(washDownDrainJoinGeo, mat)
        washDownDrainJoin.position.y = washDownDrainJoinY
        washDownDrainJoin.position.z = downPath1.last.z
        washDownDrainJoin.rotateZ(-Math.PI * 0.5)
        washDownDrainJoin.name = "反洗下排接头"
        group.add(washDownDrainJoin)

        this.add(group)

        this.joinsPosition.inJoinPosition.x = upPath1.last.x - this.joinLength
        this.joinsPosition.inJoinPosition.y = upPath1.last.y
        this.joinsPosition.inJoinPosition.z = upPath1.last.z

        this.joinsPosition.outJoinPosition.x = downPath1.last.x + this.joinLength
        this.joinsPosition.outJoinPosition.y = downPath1.last.y
        this.joinsPosition.outJoinPosition.z = downPath1.last.z


        this.joinsPosition.washInJoinPosition.x = downPath1.last.x - this.joinLength
        this.joinsPosition.washInJoinPosition.y = downPath1.last.y
        this.joinsPosition.washInJoinPosition.z = downPath1.last.z

        this.joinsPosition.washUpDrainJoinPosition.x = upPath1.last.x + this.joinLength
        this.joinsPosition.washUpDrainJoinPosition.y = upPath1.last.y
        this.joinsPosition.washUpDrainJoinPosition.z = upPath1.last.z
        
        this.joinsPosition.washDownDrainJoinPosition.x = upPath1.last.x + this.joinLength
        this.joinsPosition.washDownDrainJoinPosition.y = washDownDrainJoinY
        this.joinsPosition.washDownDrainJoinPosition.z = upPath1.last.z
    }

}