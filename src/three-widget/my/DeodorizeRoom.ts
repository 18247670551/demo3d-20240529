import * as THREE from "three"
import MyGroup from "@/three-widget/MyGroup"
import {getTextureLoader} from "@/three-widget/loader/ThreeLoader"

/**
 * @param squareLength?: number
 * @param squareHeight?: number
 * @param squareWidth?: number
 * @param squareThickness?: number
 * @param windowHoleRadius?: number 前后侧墙开孔半径(观察窗)
 * @param inHoleRadius?: number 左右侧墙开孔半径(进烟口, 出烟口)
 * @param rows?: number
 * @param columns?: number
 * @param tiers?: number
 * @param wallColor?: number
 * @param wallOpacity?: number
 * @param topColor?: number
 * @param topOpacity?: number
 */
interface DeodorizeChannelOptions {
    squareLength?: number
    squareHeight?: number
    squareWidth?: number
    squareThickness?: number
    windowHoleRadius?: number
    inHoleRadius?: number
    rows?: number
    columns?: number
    tiers?: number
    wallColor?: number
    wallOpacity?: number
    topColor?: number
    topOpacity?: number
    logo?: boolean
}


export default class DeodorizeRoom extends MyGroup<DeodorizeChannelOptions> {

    constructor(name: string, options?: DeodorizeChannelOptions) {

        const defaultOptions: Required<DeodorizeChannelOptions> ={
            squareLength: 4000,
            squareHeight: 3000,
            squareWidth: 3000,
            squareThickness: 80,
            windowHoleRadius: 260,
            inHoleRadius: 320,
            rows: 4,
            columns: 3,
            tiers: 2,
            wallColor: 0xCCCCCC,
            wallOpacity: 0.7,
            topColor: 0x555555,
            topOpacity: 0.4,
            logo: false,
        }

        super(name, defaultOptions, options)

        this.addRoom()
        this.getBox()
        if(this.options.logo){
            this.addLogo()
        }
    }

    private addLogo(){
        const {squareLength, squareThickness: thickness, tiers, squareHeight, squareWidth, columns, rows} = this.options

        const width = squareLength * columns
        const height = 2000

        const geo = new THREE.BoxGeometry(width, height, thickness )

        const texture = getTextureLoader().load("/demo/my/deodorize/deodorize_device_logo.png")
        texture.colorSpace = THREE.SRGBColorSpace
        const logoMat = new THREE.MeshPhongMaterial({map: texture, color: 0xEEEEEE, transparent: true, opacity: 1, side: THREE.DoubleSide})
        const grayMat = new THREE.MeshPhongMaterial({color: 0x555555, transparent: true, opacity: 1, side: THREE.DoubleSide})
        const mat = new THREE.MeshPhongMaterial({color: 0xEEEEEE, transparent: true, opacity: 1, side: THREE.BackSide})
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
        entity.position.y = squareHeight * tiers + height/2
        entity.position.z = (squareWidth * rows)/2
        this.add(entity)
    }


    private addRoom() {
        
        const {
            squareLength,
            squareHeight,
            squareWidth,
            squareThickness,
            rows,
            columns,
            tiers,
        } = this.options
        
        const room = new THREE.Group

        //前排墙
        const frontWall = new THREE.Group()
        //后排墙
        const backWall = new THREE.Group()
        for (let j = 0; j < tiers; j++) {
            for (let i = 0; i < columns; i++) {
                const frontWallSquare = this.createFrontBackWallSquare()
                frontWallSquare.position.x = squareLength * i
                frontWallSquare.position.y = squareHeight * j
                frontWallSquare.position.z = squareWidth * rows / 2
                frontWallSquare.renderOrder = 1
                frontWall.add(frontWallSquare)

                const backWallSquare = this.createFrontBackWallSquare()
                backWallSquare.position.x = squareLength * i
                backWallSquare.position.y = squareHeight * j
                backWallSquare.position.z = -(squareWidth * rows / 2)
                backWall.add(backWallSquare)
            }
        }
        frontWall.translateX(-(squareLength * columns / 2))
        backWall.translateX(-(squareLength * columns / 2))
        room.add(frontWall, backWall)

        //左排墙
        const leftWall = new THREE.Group()
        //右排墙
        const rightWall = new THREE.Group()
        for (let j = 0; j < tiers; j++) {
            for (let i = 0; i < rows; i++) {
                const leftWallSquare = this.createSideWallSquare()
                leftWallSquare.rotateY(Math.PI * 0.5)
                leftWallSquare.position.y = squareHeight * j
                leftWallSquare.position.z = squareWidth * -i
                leftWall.add(leftWallSquare)

                const rightWallSquare = this.createSideWallSquare()
                rightWallSquare.rotateY(Math.PI)
                rightWallSquare.rotateY(Math.PI * 0.5)
                rightWallSquare.position.y = squareHeight * j
                rightWallSquare.position.z = squareWidth * i
                rightWall.add(rightWallSquare)
            }
        }
        leftWall.translateX(-(squareLength * columns / 2 + squareThickness + 2))
        leftWall.translateZ(squareWidth * rows / 2)
        rightWall.translateX(squareLength * columns / 2 + squareThickness + 2)
        rightWall.translateZ(-(squareWidth * rows / 2))
        room.add(leftWall, rightWall)

        //顶盖
        const top = new THREE.Group()
        for (let j = 0; j < rows; j++) {
            for (let i = 0; i < columns; i++) {
                const square = this.createTopSquare()
                square.position.x = squareLength * i
                square.position.y = squareHeight * tiers
                square.position.z = squareWidth * -(j + 1)
                top.add(square)
            }
        }
        top.translateX(-(squareLength * columns / 2))
        top.translateZ(squareWidth * rows / 2)
        room.add(top)


        const width = squareLength * columns
        const height = squareWidth * rows
        const mat = new THREE.MeshBasicMaterial({
            color: 0x33a3dc,
            transparent: true,
            opacity: 0.5,
            side: THREE.DoubleSide
        })
        const geometry = new THREE.PlaneGeometry(width, height)

        //第二层起添加地面
        for (let i = 0; i < tiers; i++) {
            if(i != 0){
                const floor = new THREE.Mesh(geometry, mat)
                floor.rotateX(Math.PI * 0.5)
                floor.position.y = squareHeight * i
                room.add(floor)
            }
        }

        this.add(room)
    }

    /**
     * 创建顶盖单元格
     * <br>
     * 注意顶盖单元格和侧墙单元格是不一样的, 顶盖单元格大小为 squareWidth X squareWidth
     */
    private createTopSquare() {
        const topGeo = new THREE.BoxGeometry(this.options.squareLength, this.options.squareThickness, this.options.squareWidth)
        topGeo.translate(this.options.squareLength / 2, this.options.squareThickness / 2, this.options.squareWidth / 2)

        const sideTexture = getTextureLoader().load("/demo/my/deodorize/body_0.jpg")
        sideTexture.wrapS = sideTexture.wrapT = THREE.RepeatWrapping
        sideTexture.repeat.set(10, 1)

        const mat = new THREE.MeshPhongMaterial({
            map: sideTexture,
            color: this.options.topColor,
            transparent: true,
            opacity: this.options.topOpacity,
            side: THREE.DoubleSide
        })

        const top = new THREE.Mesh(topGeo, mat)
        top.name = "房顶单元格"
        return top
    }


    /**
     * 前后侧墙单元格
     */
    private createFrontBackWallSquare() {

        const w = this.options.squareLength
        const h = this.options.squareHeight

        const shape = new THREE.Shape()
        shape.moveTo(0, 0)
        shape.lineTo(0, h)
        shape.lineTo(w, h)
        shape.lineTo(w, 0)


        const hole1 = new THREE.Path()
        hole1.arc(w / 4, h - (h / 4), this.options.windowHoleRadius, 0, 2 * Math.PI, false)

        shape.holes.push(hole1)

        const hole2 = new THREE.Path()
        hole2.arc(w / 4, h - (h / 4 + this.options.windowHoleRadius * 4), this.options.windowHoleRadius, 0, 2 * Math.PI, false)

        shape.holes.push(hole2)


        const extrudeSettings = {
            curveSegments: 16,
            steps: 2,
            depth: this.options.squareThickness,
            bevelEnabled: false
        }

        const sideTexture = getTextureLoader().load("/demo/my/deodorize/body_0.jpg")
        sideTexture.wrapS = sideTexture.wrapT = THREE.RepeatWrapping
        sideTexture.repeat.set(0.003, 0.0003)

        const squareGeo = new THREE.ExtrudeGeometry(shape, extrudeSettings)
        const squareWat = new THREE.MeshBasicMaterial({
            map: sideTexture,
            color: this.options.wallColor,
            transparent: true,
            opacity: this.options.wallOpacity,
            side: THREE.DoubleSide
        })

        const squareMesh = new THREE.Mesh(squareGeo, squareWat)
        squareMesh.name = "前后侧墙单元格"

        return squareMesh
    }

    /**
     * 左右侧墙
     * 是否开进出烟口
     */
    private createSideWallSquare(isHole: boolean = true) {

        const w = this.options.squareWidth
        const h = this.options.squareHeight

        const shape = new THREE.Shape()
        shape.moveTo(0, 0)
        shape.lineTo(0, h)
        shape.lineTo(w, h)
        shape.lineTo(w, 0)

        if(isHole){
            const hole1 = new THREE.Path()
            hole1.arc(w / 2, h - (h / 4), this.options.inHoleRadius, 0, 2 * Math.PI, false)

            shape.holes.push(hole1)
        }


        const extrudeSettings = {
            curveSegments: 16,
            steps: 2,
            depth: this.options.squareThickness,
            bevelEnabled: false
        }

        const sideTexture = getTextureLoader().load("/demo/my/deodorize/body_0.jpg")
        sideTexture.wrapS = sideTexture.wrapT = THREE.RepeatWrapping
        sideTexture.repeat.set(0.003, 0.0003)

        const squareGeo = new THREE.ExtrudeGeometry(shape, extrudeSettings)
        const squareWat = new THREE.MeshPhongMaterial({
            map: sideTexture,
            color: this.options.wallColor,
            transparent: true,
            opacity: this.options.wallOpacity,
            side: THREE.DoubleSide
        })

        const squareMesh = new THREE.Mesh(squareGeo, squareWat)
        squareMesh.name = "左右侧墙单元格"

        return squareMesh
    }

}