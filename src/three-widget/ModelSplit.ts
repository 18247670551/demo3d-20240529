import * as THREE from 'three'

type ModelSplitMesh = THREE.Mesh & { _splitSrcPos: THREE.Vector3, _splitSpeed: {x: number, y: number, z: number} }

/**
 * 使用方法：
 * 1、调用setSplitModel函数将要拆分的模型传入预处理
 * 然后两种控制爆炸方式
 * （1）实时更新
 *      调用startSplit()/quitSplit()函数开始爆炸/恢复
 *      需要在three的animate函数中调用update函数
 * （2）滑动条
 *      调用setValue函数把滑动条的值传入
 */
export default class ModelSplit {

    isQuit: boolean = false
    meshList: ModelSplitMesh[] = []
    running = false
    targetSplitValue = 0
    currentSplitValue = 0
    offset = 1

    splitScale = 1 //影响拆分距离，就是mesh的包围盒中心与爆炸中心的距离的倍率
    splitSpeed = 100//影响拆分速度，反比例

    constructor() {

    }

    setSplitModel(model: THREE.Scene | THREE.Object3D | THREE.Group) {

        this.quit()

        //计算模型整体包围盒中心作为爆炸中心
        model.updateMatrixWorld()
        const box = new THREE.Box3().expandByObject(model)
        const center = box.getCenter(new THREE.Vector3())
        model.traverse(child => {
            if (child.type == "Mesh") {
                const mesh = child as ModelSplitMesh
                //分别计算每个mesh的包围盒中心，其与爆炸中心连线作为爆炸方向
                let subBox = new THREE.Box3().expandByObject(mesh)
                let meshCenter = subBox.getCenter(new THREE.Vector3())
                mesh._splitSrcPos = mesh.getWorldPosition(new THREE.Vector3())

                //这里计算各个轴向分速度，这样可以使用滑动条控制进度
                mesh._splitSpeed = {
                    x: (meshCenter.x - center.x) * this.splitScale / this.splitSpeed,
                    y: (meshCenter.y - center.y) * this.splitScale / this.splitSpeed,
                    z: (meshCenter.z - center.z) * this.splitScale / this.splitSpeed,
                }
                this.meshList.push(mesh)
            }
        })
        this.currentSplitValue = 0
        this.targetSplitValue = 0
        this.running = false
    }

    /**
     * 开始爆炸
     */
    startSplit() {
        this.targetSplitValue = this.splitSpeed
        this.currentSplitValue = 0
        this.offset = 1
        this.running = true
        this.isQuit = false
    }

    /**
     * 开始反向爆炸（还原）
     */
    quitSplit() {
        this.targetSplitValue = 0
        this.currentSplitValue = this.splitSpeed
        this.offset = -1
        this.running = true
        this.isQuit = true
    }

    /**
     * 退出拆分时还原
     */
    quit() {
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
        if (this.running && this.meshList.length > 0) {

            if (this.currentSplitValue != this.targetSplitValue) {
                this.currentSplitValue += this.offset
            }

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

            if (this.currentSplitValue == this.targetSplitValue) {
                this.running = false

                if (this.isQuit) {
                    this.quit()
                    this.isQuit = false
                }
            }
        }
    }




    // 此函数和本类无关, 只是写在这做备份查询
    // threejs中可以获取两个模型的世界矩阵，通过invert获取逆矩阵，通过矩阵相乘获取一个模型相对另一个模型的相对矩阵
    getReleaseMatrix(model1: THREE.Mesh, model2: THREE.Mesh) {
        model1.updateMatrixWorld()
        model2.updateMatrixWorld()
        // 计算物料相对于夹爪的变换矩阵
        const materialMatrix = new THREE.Matrix4().copy(model2.matrixWorld)
        materialMatrix.premultiply(model1.matrixWorld.clone().invert())
        return materialMatrix
    }


}
