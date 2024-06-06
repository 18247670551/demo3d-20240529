import * as THREE from "three"
import gsap from 'gsap'
import MyGroup from "@/three-widget/MyGroup"
import * as CSG from "@/three-widget/CSG"

/**
 * 排烟风机
 * @param leafRadius 叶片旋转半径
 * @param leafWidth 叶宽
 * @param leafHeight 叶高
 */
interface Fan3Options {
    leafRadius?: number
    leafWidth?: number
    leafHeight?: number
}

/**
 * 生物车间 主排风管道后的风机
 */
export default class Fan3 extends MyGroup<Fan3Options> {

    private readonly leafGroup: THREE.Group
    private readonly leafAnimation: gsap.core.Tween

    constructor(name: string, options?: Fan3Options) {

        const defaultOptions: Required<Fan3Options> = {
            leafRadius: 460,
            leafWidth: 540,
            leafHeight: 260,
        }

        super(name, defaultOptions, options)

        this.addShell()
        this.leafGroup = this.addAndGetLeaf()
        this.leafAnimation = this.createLeafAnimation()
    }


    private addShell() {

        //外壳圆半径相对 叶轮旋转半径的倍数
        const k = 1.8

        const material = new THREE.MeshPhongMaterial({
            color: 0x666666,
            transparent: true,
            opacity: 0.5,
            side: THREE.DoubleSide,
            specular: 0x666666,
            shininess: 20,
        })

        const radius = this.options.leafRadius * k

        const bodyGeo = new THREE.CylinderGeometry(radius, radius, radius, 32)
        bodyGeo.rotateX(Math.PI * 0.5)
        const body = new THREE.Mesh(bodyGeo, material)

        //出风口
        const outWidth = this.options.leafRadius * 1.5
        const outDepth = this.options.leafRadius * k
        const outHeight = this.options.leafRadius * 3

        const outGeo = new THREE.BoxGeometry(outWidth, outHeight, outDepth, 2)
        const out = new THREE.Mesh(outGeo, material)
        out.position.y = outHeight / 2
        out.position.x = radius - outWidth/2

        const unionOutAndBodyGeo = CSG.calc(body, out, "union")

        const entity = new THREE.Mesh(unionOutAndBodyGeo, material)

        entity.name = "箱体"

        this.add(entity)
    }

    private addAndGetLeaf() {
        const {leafRadius, leafWidth, leafHeight} = this.options

        const group = new THREE.Group()

        const leafMat = new THREE.MeshBasicMaterial({
            color: 0x548af7,
            transparent: false,
            opacity: 1,
            side: THREE.DoubleSide
        })

        const leafGeo = new THREE.BoxGeometry(30, leafHeight, leafWidth)
        leafGeo.translate(0, leafRadius, 0)

        const leaf = new THREE.Mesh(leafGeo, leafMat)
        group.add(leaf)

        for (let i = 1; i < 9; i++) {
            const leafClone = leaf.clone()
            leafClone.rotateZ(Math.PI * 2 / 9 * i)
            group.add(leafClone)
        }

        const mat = new THREE.MeshPhongMaterial({
            color: 0x023177,
            transparent: true,
            opacity: 0.6,
            side: THREE.DoubleSide
        })

        const backPlaneGeo = new THREE.RingGeometry(leafRadius + leafHeight / 2, 60, 32)
        const backPlane = new THREE.Mesh(backPlaneGeo, mat)
        backPlane.translateZ(leafWidth / 2 + 1) //加1是防止模型接触, 接触面会闪烁
        group.add(backPlane)

        const frontPlaneGeo = new THREE.RingGeometry(leafRadius + leafHeight / 2, leafRadius + leafHeight / 2 - leafHeight, 32)
        const frontPlane = new THREE.Mesh(frontPlaneGeo, mat)
        frontPlane.translateZ(-(leafWidth / 2 + 1))
        group.add(frontPlane)

        this.add(group)

        return group
    }


    run(){
        this.leafAnimation.resume()
    }

    stop(){
        this.leafAnimation.pause()
    }


    private createLeafAnimation() {
        return gsap.to(
            this.leafGroup.rotation,
            {
                z: -Math.PI * 2,
                repeat: -1,
                duration: 1,
                ease: "none",
                paused: true
            }
        )
    }


}
