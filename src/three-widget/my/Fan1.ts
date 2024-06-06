import * as THREE from "three"
import gsap from 'gsap'
import MyGroup from "@/three-widget/MyGroup"
import * as CSG from "@/three-widget/CSG"

/**
 * 排烟风机
 * @param r 内轮半径
 * @param w 叶宽
 * @param h 叶高
 */
interface Fan1Options {
    r?: number
    w?: number
    h?: number
}


export default class Fan1 extends MyGroup<Fan1Options> {

    private readonly leafGroup: THREE.Group
    private readonly leafAnimation: gsap.core.Tween

    constructor(name: string, options?: Fan1Options) {
        const defaultOptions = {
            r: 600,
            w: 800,
            h: 300,
        }

        super(name, defaultOptions, options)

        this.leafGroup = this.addAndGetLeafGroup()
        this.addShell()
        this.leafAnimation = this.createLeafAnimation()
    }

    private createLeafAnimation() {
        return gsap.to(
            this.leafGroup.rotation,
            {
                z: -Math.PI * 4,
                repeat: -1,
                duration: 1,
                ease: "none",
                paused: true
            }
        )
    }

    private addAndGetLeafGroup() {
        const group = new THREE.Group()

        const leafMat = new THREE.MeshPhongMaterial({
            color: 0x548af7,
            transparent: false,
            opacity: 1,
            side: THREE.DoubleSide
        })

        const leafGeo = new THREE.BoxGeometry(10, this.options.h, this.options.w)
        leafGeo.translate(0, this.options.r, 0)

        const leaf = new THREE.Mesh(leafGeo, leafMat)
        group.add(leaf)

        for (let i = 1; i < 9; i++) {
            const leafClone = leaf.clone()
            leafClone.rotateZ(Math.PI * 2 / 9 * i)
            group.add(leafClone)
        }

        const mat = new THREE.MeshPhongMaterial({
            color: 0x777777,
            transparent: true,
            opacity: 0.6,
            side: THREE.DoubleSide
        })

        const backPlaneGeo = new THREE.RingGeometry(this.options.r + this.options.h / 2, 60, 32)
        const backPlane = new THREE.Mesh(backPlaneGeo, mat)
        backPlane.translateZ(this.options.w / 2 + 10) //加10是防止模型接触, 接触面会闪烁
        group.add(backPlane)

        const frontPlaneGeo = new THREE.RingGeometry(this.options.r + this.options.h / 2, this.options.r + this.options.h / 2 - this.options.h, 32)
        const frontPlane = new THREE.Mesh(frontPlaneGeo, mat)
        frontPlane.translateZ(-this.options.w / 2 + 10)
        group.add(frontPlane)

        this.add(group)

        return group
    }


    private addShell() {
        const group = new THREE.Group()


        const material = new THREE.MeshPhongMaterial({
            color: 0x666666,
            transparent: true,
            opacity: 0.4,
            side: THREE.FrontSide,
            depthTest: false,
        })

        //外壳半径 = 叶轮组半径 * 1.7  即: 叶轮组半径600, 则外壳半径大约1000
        const shellRadius = this.options.r * 1.8

        //外壳厚度 = 叶轮组半径 * 1.25  即: 叶轮组厚800, 则外壳厚1000
        const shellWidth = this.options.w * 1.25


        const bodyGeo = new THREE.CylinderGeometry(shellRadius, shellRadius, shellWidth, 32)
        bodyGeo.rotateX(Math.PI * 0.5)
        const body = new THREE.Mesh(bodyGeo, material)


        //出口接头宽度
        const outWidth = shellWidth / 3 * 2

        const shape = new THREE.Shape()
        shape.moveTo(0, 0)
        shape.lineTo(1800, 800)
        shape.lineTo(1800, 2000)
        shape.lineTo(0, 800)

        const extrudeSettings = {
            steps: 2,
            depth: outWidth,
            bevelEnabled: false
        }

        const outGeo = new THREE.ExtrudeGeometry(shape, extrudeSettings)
        outGeo.translate(shellRadius - 300, -500, -outWidth / 2)
        const out = new THREE.Mesh(outGeo, material)


        const unionOutAndBodyGeo = CSG.calc(body, out, "union")
        const unionOutAndBody = new THREE.Mesh(unionOutAndBodyGeo, material)

        group.add(unionOutAndBody)


        //本项目风机, 暂不需要进气口接头
        // //进气口接头半径
        // const inJoinRadius = 340
        // const inJoinLength = 1000
        //
        //
        // const inGeo = new THREE.CylinderGeometry(inJoinRadius, inJoinRadius, inJoinLength, 32)
        // inGeo.rotateX(Math.PI * 0.5)
        // const inMesh = new THREE.Mesh(inGeo, material)
        // inMesh.position.z = -shellWidth/2
        //
        // group.add(inMesh)


        group.name = "箱体"
        this.add(group)
    }

    run() {
        this.leafAnimation?.resume()
    }

    stop() {
        this.leafAnimation?.pause()
    }


}
