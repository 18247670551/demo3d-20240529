import * as THREE from 'three'

type BombMesh = THREE.Mesh & { _splitSrcPos: THREE.Vector3, _splitSpeed: { x: number, y: number, z: number } }

export default class ModelBomb {

    isBomb: boolean = false
    isWorking = false


    targetSplitValue = 0
    currentSplitValue = 0
    offset = 1

    meshList: BombMesh[] = []


    mode: 1 | 2

    splitScale: number //影响拆分距离，就是mesh的包围盒中心与爆炸中心的距离的倍率
    splitSpeed: number //影响拆分速度，反比例


    constructor(mode: 1 | 2 = 2) {

        this.mode = mode

        if (this.mode == 1) {
            this.splitScale = 5
            this.splitSpeed = 100
        } else {
            this.splitScale = 0.3
            this.splitSpeed = 50
        }

    }

    setModel(model: THREE.Object3D | THREE.Group | THREE.Scene) {

        // 如果有爆炸效果, 先恢复原状态
        this.quit()

        //计算模型整体包围盒中心作为爆炸中心
        model.updateMatrixWorld()
        const box = new THREE.Box3().expandByObject(model)

        const maxLength = box.max.clone().distanceTo(box.min)

        let center: THREE.Vector3

        if (this.mode === 1) {
            center = box.getCenter(new THREE.Vector3())
        } else if (this.mode === 2) {
            center = new THREE.Vector3()
            let subBox
            let subCenter
            let count = 0
            model.traverse(node => {
                if (node.type == "Mesh") {
                    //分别计算每个mesh的包围盒中心，其与爆炸中心连线作为爆炸方向
                    subBox = new THREE.Box3().expandByObject(node)
                    subCenter = subBox.getCenter(new THREE.Vector3())
                    center = center.clone().add(subCenter)
                    count++
                }
            })
            center = center.clone().multiplyScalar(1 / count)
        }else {
            // ts 类型收缩, 用来检测 model 改变时, 触发检测报错
            const modelCheck: never = this.mode
        }

        let subBox
        let meshCenter
        let subSpeed: {x: number, y: number, z: number}
        let targetPos
        model.traverse(child => {
            if (child.type == "Mesh") {
                const mesh = child as BombMesh
                //分别计算每个mesh的包围盒中心，其与爆炸中心连线作为爆炸方向
                subBox = new THREE.Box3().expandByObject(mesh)
                meshCenter = subBox.getCenter(new THREE.Vector3())
                mesh._splitSrcPos = mesh.getWorldPosition(new THREE.Vector3())


                if(this.mode === 1){
                    subSpeed = {
                        x:(meshCenter.x-center.x) * this.splitScale / this.splitSpeed,
                        y:(meshCenter.y-center.y) * this.splitScale / this.splitSpeed,
                        z:(meshCenter.z-center.z) * this.splitScale / this.splitSpeed,
                    }
                }else if(this.mode === 2){
                    targetPos = meshCenter.clone().add(meshCenter.clone().sub(center).normalize().multiplyScalar(maxLength))
                    //这里计算各个轴向分速度，这样可以使用滑动条控制进度
                    subSpeed = {
                        x:(targetPos.x - center.x) * this.splitScale / this.splitSpeed,
                        y:(targetPos.y - center.y) * this.splitScale / this.splitSpeed,
                        z:(targetPos.z - center.z) * this.splitScale / this.splitSpeed,
                    }
                }else {
                    // ts 类型收缩, 用来检测 model 改变时, 触发检测报错
                    const modelCheck: never = this.mode
                }

                mesh._splitSpeed = subSpeed
                this.meshList.push(mesh)
            }
        })
        this.currentSplitValue = 0
        this.targetSplitValue = 0
        this.isWorking = false
    }

    /**
     * 开始爆炸
     */
    startBomb() {
        this.targetSplitValue = this.splitSpeed
        this.currentSplitValue = 0
        this.offset = 1
        this.isWorking = true
        this.isBomb = false
    }

    /**
     * 开始反向爆炸（还原）
     */
    quitBomb() {
        this.targetSplitValue = 0
        this.currentSplitValue = this.splitSpeed
        this.offset = -1
        this.isWorking = true
        this.isBomb = true
    }

    /**
     * 退出爆炸时还原
     */
    private quit() {
        if (this.currentSplitValue != 0 && this.meshList.length > 0) {
            for (let i = 0; i < this.meshList.length; i++) {
                let node = this.meshList[i]
                node.position.copy(node._splitSrcPos)
            }
            this.currentSplitValue = 0
            this.targetSplitValue = 0
        }
    }

    /**
     * 如果用滑动条控制时将滑动条的值传入这个函数
     * @param value #[0,1]的值，表示爆炸进度
     */
    setValue(value: number) {

        if (value < 0) value = 0
        if (value > 1) value = 1

        this.currentSplitValue = value * this.splitSpeed

        for (let i = 0; i < this.meshList.length; i++) {
            let node = this.meshList[i]
            let x = node._splitSpeed.x * this.currentSplitValue + node._splitSrcPos.x
            let y = node._splitSpeed.y * this.currentSplitValue + node._splitSrcPos.y
            let z = node._splitSpeed.z * this.currentSplitValue + node._splitSrcPos.z

            const parent = node!.parent!

            parent.updateMatrixWorld()
            const invMat = parent.matrixWorld.clone().invert()
            const pos = new THREE.Vector3(x, y, z).applyMatrix4(invMat)
            node.position.copy(pos)
        }
    }

    /**
     * 更新
     */
    update() {
        if (this.isWorking && this.meshList.length > 0) {

            if (this.currentSplitValue != this.targetSplitValue) {
                this.currentSplitValue += this.offset
            }

            for (let i = 0; i < this.meshList.length; i++) {

                let bombMesh = this.meshList[i]

                let x = bombMesh._splitSpeed.x * this.currentSplitValue + bombMesh._splitSrcPos.x
                let y = bombMesh._splitSpeed.y * this.currentSplitValue + bombMesh._splitSrcPos.y
                let z = bombMesh._splitSpeed.z * this.currentSplitValue + bombMesh._splitSrcPos.z

                const parent = bombMesh!.parent!

                parent.updateMatrixWorld()
                const invMat = parent.matrixWorld.clone().invert()
                const pos = new THREE.Vector3(x, y, z).applyMatrix4(invMat)
                bombMesh.position.copy(pos)
            }

            if (this.currentSplitValue == this.targetSplitValue) {
                this.isWorking = false

                if (this.isBomb) {
                    this.quit()
                    this.isBomb = false
                }
            }
        }
    }

}