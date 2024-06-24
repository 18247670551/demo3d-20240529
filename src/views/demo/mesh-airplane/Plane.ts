import * as THREE from 'three'
import MyGroup from "@/three-widget/MyGroup"
import MyMesh from "@/three-widget/MyMesh"

/**
 * 飞机
 *
 * @param bodyMaterial 机身材质
 * @param bladeMaterial 螺旋桨材质
 * @param speed 飞行秒速度
 * @param bladeSpeed 螺旋桨秒转速
 * @param position 初始位置
 */
interface PlaneOptions{
    bodyMaterial?: THREE.Material,
    bladeMaterial?: THREE.Material,
    bladeSpeed?: number,
    speed?: number,
    position?: {x: number, y: number, z: number}
}

export default class Plane extends MyGroup<PlaneOptions>{

    private readonly blade: THREE.Group

    constructor(name: string, options?: PlaneOptions) {

        const grayMat = new THREE.MeshPhongMaterial({color: 0x777777})
        const blackMat = new THREE.MeshPhongMaterial({color: 0x000000})

        const defaultOptions: Required<PlaneOptions> = {
            bodyMaterial: grayMat,
            bladeMaterial: blackMat,
            bladeSpeed: 720, //螺旋桨每秒2圈
            speed: 2000, //飞机向前每秒飞2米
            position: {x: 0, y: 0, z: 0}
        }

        super(name, defaultOptions, options)

        const body = this.createBody()
        const blade = this.createBlade()

        // body上没有动画不需要做成属性对象, blade上有螺旋桨旋转动画, 需要做成属性对象
        this.blade = blade

        this.add(body, blade)

        this.rotation.x = Math.PI / 2
        this.rotation.z = -Math.PI / 2

        const {x, y, z} = this.options.position
        this.position.set(x, y, z)
    }


    private createBody(){
        const group = new THREE.Group()

        const mat1 = this.options.bodyMaterial
        const mat2 = this.options.bladeMaterial

        //机身
        const planeBodyGeo = new THREE.CylinderGeometry(800, 500, 3000, 10)
        //尾部
        const planeTailGeo = new THREE.CylinderGeometry(500, 100, 1200, 10)
        //尾翼
        const planeTailWingGeo = new THREE.BoxGeometry(3000, 150, 500)
        //机身前端方形
        const planeFrontGeo = new THREE.BoxGeometry(1000, 1000, 1000)
        //转子尖头
        const planeRotorTipGeo = new THREE.CylinderGeometry( 50, 200, 200 );
        //转子轴
        const planeRotorAxleGeo = new THREE.CylinderGeometry(50, 50, 400, 10)
        //机翼
        const wing1Geo = new THREE.BoxGeometry(100, 1500, 6000)
        const wing2Geo = new THREE.BoxGeometry(100, 1500, 6000)
        //机翼立撑
        const pin1Geo = new THREE.BoxGeometry(200, 200, 1620)
        const pin2Geo = new THREE.BoxGeometry(200, 200, 1620)


        const pin1 = new MyMesh("机翼立撑1", pin1Geo, mat2)
        const pin2 = new MyMesh("机翼立撑2", pin2Geo, mat2)


        const wing1 = new MyMesh("机翼1", wing1Geo, mat1)
        const wing2 = new MyMesh("机翼2", wing2Geo, mat1)

        const planeRotorAxle = new MyMesh("螺旋桨轴", planeRotorAxleGeo, mat1)
        const planeRotorTip = new MyMesh("螺旋桨前端帽", planeRotorTipGeo, mat1)

        const planeFront = new MyMesh("机体头部方形", planeFrontGeo, mat1)

        const planeBody = new MyMesh("机身", planeBodyGeo, mat1)
        const planeTail = new MyMesh("机体尾巴", planeTailGeo, mat1)
        const planeTailWing = new MyMesh("尾翼", planeTailWingGeo, mat1)

        planeFront.position.y = 1500
        planeRotorAxle.position.y = 2100
        planeRotorTip.position.y = 2400

        wing1.rotation.y = 0.5 * Math.PI
        wing2.rotation.y = 0.5 * Math.PI
        wing2.position.z = -1500

        pin1.position.x = -2200
        pin1.position.z = -750

        pin2.position.x = 2200
        pin2.position.z = -750

        planeTail.position.y = -2100
        planeTailWing.position.y = -2000
        planeTailWing.rotation.x = 0.5 * Math.PI


        group.add(wing1)
        group.add(wing2)
        group.add(planeBody)
        group.add(planeFront)
        group.add(planeRotorTip)
        group.add(planeRotorAxle)
        group.add(pin1)
        group.add(pin2)
        group.add(planeTail)
        group.add(planeTailWing)

        group.name = "机身"

        return group
    }


    private createBlade(){
        const group = new THREE.Group()

        const mat2 = this.options.bladeMaterial

        const bladeGeo = new THREE.BoxGeometry(4000, 200, 500)

        const planeRotorBlade = new MyMesh("螺旋桨叶", bladeGeo, mat2)
        const planeRotorBlade2 = planeRotorBlade.clone()

        planeRotorBlade2.rotation.y = Math.PI * 0.4

        group.position.y = 2150

        group.name = "螺旋桨组合"
        group.add(planeRotorBlade, planeRotorBlade2)

        return group
    }

    /**
     * 必须使用箭头函数, 此函数会在本类外部调用, 如果不用箭头函数, 函数内this指向错误, 使用箭头函数来保持this为本类对象
     * @param delta 每两帧画面间隔时间, 乘以每秒速度则是每两帧画面间隔应该移动的距离
     */
    flyAnimate = (delta: number) => {
        this.position.x += this.options.speed * delta
        this.blade.rotation.y += Math.PI / 180 * this.options.bladeSpeed * delta
    }


}