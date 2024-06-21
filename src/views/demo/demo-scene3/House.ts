import * as THREE from "three"
import ground8Pic from "./texture/ground8.jpg"
import wallPic from "./texture/wall.webp"
import topPic from "./texture/top.jpg"
import wood2Pic from "./texture/wood2.jpg"
import gsap from "gsap"
import {getTextureLoader} from "@/three-widget/loader/ThreeLoader"


interface HouseOptions {
    length: number,
    width: number,
    height: number,
    wallDepth: number,
}

export default class House extends THREE.Group {

    private options: Required<HouseOptions>
    private textureLoader = new THREE.TextureLoader()

    door: any

    constructor(options?: HouseOptions) {
        super()

        const defaultHouseOptions = {
            length: 10,
            width: 20,
            height: 4,
            wallDepth: 0.2,
        }


        this.options = Object.assign({}, defaultHouseOptions, options)

        const {width, height, length, wallDepth} = this.options

        // 为保证整个房子尺寸是希望的尺寸, 地板长宽需要减2个(侧墙厚度一半)
        const floorGeo = new THREE.BoxGeometry(length - wallDepth, wallDepth, width)
        floorGeo.translate(0, wallDepth / 2, 0)

        const ground8Texture = getTextureLoader().load(ground8Pic)
        ground8Texture.wrapS = ground8Texture.wrapT = THREE.RepeatWrapping
        //ground8Texture.repeat.set(6, 1)
        const floorMat = new THREE.MeshLambertMaterial({color: 0xcccccc, map: ground8Texture})
        const floor = new THREE.Mesh(floorGeo, floorMat)
        floor.name = "地板"
        this.add(floor)




        const leftAndRightWallTexture = getTextureLoader().load(wallPic)
        leftAndRightWallTexture.wrapS = leftAndRightWallTexture.wrapT = THREE.RepeatWrapping
        leftAndRightWallTexture.repeat.set(6, 1)

        const leftAndRightWallMat = [
            new THREE.MeshLambertMaterial({color: 0xeeeeee, map: leftAndRightWallTexture}),
            new THREE.MeshLambertMaterial({color: 0xeeeeee, map: leftAndRightWallTexture}),
            new THREE.MeshLambertMaterial({color: 0xeeeeee, map: leftAndRightWallTexture}),
            new THREE.MeshLambertMaterial({color: 0xeeeeee, map: leftAndRightWallTexture}),
            new THREE.MeshLambertMaterial({color: 0xeeeeee, map: leftAndRightWallTexture}),
            new THREE.MeshLambertMaterial({color: 0xeeeeee, map: leftAndRightWallTexture}),
            new THREE.MeshLambertMaterial({color: 0xeeeeee, map: leftAndRightWallTexture}),
        ]

        // 左墙
        const leftWallGeo = new THREE.BoxGeometry(wallDepth, height, width)
        leftWallGeo.translate(0, height / 2, 0)
        const lefWall = new THREE.Mesh(leftWallGeo, leftAndRightWallMat)
        lefWall.position.set(-length / 2, 0, 0)
        lefWall.name = "左墙"
        this.add(lefWall)

        // 右墙
        const rightWallGeo = new THREE.BoxGeometry(wallDepth, height, width)
        rightWallGeo.translate(0, height / 2, 0)
        const rightWall = new THREE.Mesh(rightWallGeo, leftAndRightWallMat)
        rightWall.position.set(length / 2, 0, 0)
        rightWall.name = "右墙"
        this.add(rightWall)





        const frontAndBackWallTexture = getTextureLoader().load(wallPic)
        frontAndBackWallTexture.wrapS = frontAndBackWallTexture.wrapT = THREE.RepeatWrapping
        frontAndBackWallTexture.repeat.set(0.3, 0.3)
        const frontAndBackWallMat = new THREE.MeshLambertMaterial({color: 0xeeeeee, map: frontAndBackWallTexture})


        // 后墙
        const backWallShape = new THREE.Shape()
        backWallShape.moveTo(-length / 2 - wallDepth / 2, 0)
        backWallShape.lineTo(-length / 2 - wallDepth / 2, height)
        backWallShape.lineTo(0, height + (length / 2 * Math.tan(Math.PI / 6))) //尖顶斜角30度
        backWallShape.lineTo(length / 2 + wallDepth / 2, height)
        backWallShape.lineTo(length / 2 + wallDepth / 2, 0)
        backWallShape.lineTo(-length / 2 - wallDepth / 2, 0)

        const extrudeSettings = {depth: wallDepth, bevelEnabled: false}

        const backWall = new THREE.Mesh(new THREE.ExtrudeGeometry(backWallShape, extrudeSettings), frontAndBackWallMat)
        // 由于是挤出几何体, 中心是偏向一边的, 所以后墙向Z负轴移动时减 1倍墙厚, 前墙不需要减墙厚, 0.01为微调一个极小值, 避免两物体接触面正好重叠闪烁
        backWall.position.set(0, 0, (-width / 2) - wallDepth - 0.01)
        backWall.name = "后墙"
        this.add(backWall)


        // 前墙, 前墙的形状与后墙一样, 只是多开个门洞
        const doorHoleShape = new THREE.Shape()
        doorHoleShape.moveTo(-1, 0)
        doorHoleShape.lineTo(-1, 2.5)
        doorHoleShape.lineTo(1, 2.5)
        doorHoleShape.lineTo(1, 0)
        doorHoleShape.lineTo(-1, 0)

        backWallShape.holes.push(doorHoleShape)

        const frontWall = new THREE.Mesh(new THREE.ExtrudeGeometry(backWallShape, extrudeSettings), frontAndBackWallMat)
        // 由于是挤出几何体, 中心是偏向一边的, 所以后墙向Z负轴移动时减 1倍墙厚, 前墙不需要减墙厚, 0.01为微调一个极小值, 避免两物体接触面正好重叠闪烁
        frontWall.position.set(0, 0, width / 2 + 0.01)
        frontWall.name = "前墙"
        this.add(frontWall)



        const topTexture = getTextureLoader().load(topPic)
        //topTexture.center.set(0.5, 0.5)
        topTexture.rotation = Math.PI/2
        topTexture.wrapS = topTexture.wrapT = THREE.RepeatWrapping
        topTexture.repeat.set(3, 2)
        const topMat = new THREE.MeshLambertMaterial({color: "#fa7e58", map: topTexture})

        // 左侧房顶
        const leftTopLength = length / 2 * 1.4
        const leftTopWidth = (width + wallDepth * 2) * 1.05
        const leftTopGeo = new THREE.BoxGeometry(leftTopLength, wallDepth, leftTopWidth)
        // 向左平移 且 改变旋转轴
        leftTopGeo.translate(-leftTopLength / 2, 0, 0)
        // 旋转
        leftTopGeo.rotateZ(Math.PI / 6)
        // 向上平移
        leftTopGeo.translate(0, height + (length / 2 * Math.tan(Math.PI / 6)) - 0.01, 0)
        const leftTop = new THREE.Mesh(leftTopGeo, topMat)
        leftTop.name = "左侧房顶"
        this.add(leftTop)


        // 右侧房顶
        const rightTopLength = length / 2 * 1.4
        const rightTopWidth = (width + wallDepth * 2) * 1.05
        const rightTopGeo = new THREE.BoxGeometry(rightTopLength, wallDepth, rightTopWidth)
        // 向右平移 且 改变旋转轴
        rightTopGeo.translate(rightTopLength / 2, 0, 0)
        // 旋转
        rightTopGeo.rotateZ(-Math.PI / 6)
        // 向上平移
        rightTopGeo.translate(0, height + (length / 2 * Math.tan(Math.PI / 6)) - 0.01, 0)
        const rightTop = new THREE.Mesh(rightTopGeo, topMat)
        rightTop.name = "右侧房顶"
        this.add(rightTop)


        // 顶部横条
        const topBarWidth = (width + wallDepth * 2) * 1.05 + 0.02
        const topBarDepth = 0.5
        const topBarGeo = new THREE.BoxGeometry(topBarDepth, topBarDepth, topBarWidth)
        const topBarMat = new THREE.MeshLambertMaterial({color: "#d46645"})
        const topBar = new THREE.Mesh(topBarGeo, topBarMat)
        topBar.position.set(0, height + (length / 2 * Math.tan(Math.PI / 6)), 0)
        topBar.name = "顶部横条"
        this.add(topBar)


        // 门
        this.door = new this.Door()
        this.door.position.set(-1, 0, width / 2 + wallDepth)
        this.add(this.door)


        this.traverse(item => {
            item.castShadow = true
            item.receiveShadow = true
        })

    }


    /**
     * 内部类
     */
    Door = class InnerClass extends THREE.Mesh {

        private state: "关" | "开" = "关"
        private busy: boolean = false
        private openDoorAnimate: gsap.core.Tween
        private closeDoorAnimate: gsap.core.Tween

        constructor() {
            const doorLength = 2
            const doorHeight = 2.5
            const doorDepth = 0.2

            const doorGeo = new THREE.BoxGeometry(doorLength, doorHeight, doorDepth)
            doorGeo.translate(doorLength / 2, doorHeight / 2, 0)
            const doorMat = new THREE.MeshStandardMaterial({color: "#fd693b", map: getTextureLoader().load(wood2Pic)})

            super(doorGeo, doorMat)
            this.name = "门"

            this.openDoorAnimate = this.createOpenDoorAnimate()
            this.closeDoorAnimate = this.createCloseDoorAnimate()
        }

        private createOpenDoorAnimate() {
            return gsap.to(
                this.rotation,
                {
                    y: -Math.PI / 2,
                    duration: 1,
                    ease: "none",
                    paused: true,
                    onStart: () => {
                        this.busy = true
                    },
                    onComplete: () => {
                        this.state = "开"
                        this.busy = false
                    }
                }
            )
        }

        private createCloseDoorAnimate() {
            return gsap.to(
                this.rotation,
                {
                    y: 0,
                    duration: 1,
                    ease: "none",
                    paused: true,
                    onStart: () => {
                        this.busy = true
                    },
                    onComplete: () => {
                        this.state = "关"
                        this.busy = false
                    }
                }
            )
        }

        open() {
            if (this.busy) {
                console.log("门正在动作中, 请稍等")
                return
            }

            if (this.state === "开") {
                console.log("门已经处于打开状态")
                return
            }

            // 注意要用 restart 执行, 不能用 play, play 执行一次后, 动画一直处于完成状态, 后面就不会再执行了
            this.openDoorAnimate.restart()
        }

        close() {
            if (this.busy) {
                console.log("门正在动作中, 请稍等")
                return
            }

            if (this.state === "关") {
                console.log("门已经处于关状态")
                return
            }

            // 注意要用 restart 执行, 不能用 play, play 执行一次后, 动画一直处于完成状态, 后面就不会再执行了
            this.closeDoorAnimate.restart()
        }


        toggle() {

            if (this.state === "关") {
                this.open()
            } else {
                this.close()
            }

        }

    }


}


