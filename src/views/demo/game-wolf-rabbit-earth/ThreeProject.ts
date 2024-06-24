import * as THREE from "three"
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls"
import ThreeCore from "@/three-widget/ThreeCore"
import BonusParticles from "@/views/demo/game-wolf-rabbit/BonusParticles"
import Earth from "@/views/demo/game-airplane/Earth"


export default class ThreeProject extends ThreeCore {

    private readonly orbit: OrbitControls
    private readonly earth: Earth
    private readonly bonusParticles: BonusParticles
    private readonly earthRadius = 200

    constructor(dom: HTMLElement) {

        super(dom, {
            cameraOptions: {
                fov: 45,
                near: 1,
                far: 10000
            }
        })

        this.camera.position.set(0, 400, 800)
        this.scene.background = new THREE.Color(0x999999)

        const ambientLight = new THREE.AmbientLight(0xffffff, 1)
        this.scene.add(ambientLight)

        const directionalLight1 = new THREE.DirectionalLight(0xffffff, 4)
        directionalLight1.position.set(0, 1000, 1000)
        directionalLight1.castShadow = true
        this.scene.add(directionalLight1)

        const directionalLight2 = new THREE.DirectionalLight(0xffffff, 2)
        directionalLight2.position.set(0, 1000, -1000)
        directionalLight2.castShadow = true
        this.scene.add(directionalLight2)

        this.renderer.shadowMap.enabled = true

        this.orbit = new OrbitControls(this.camera, this.renderer.domElement)
        this.orbit.target.y = 200

        this.earth = this.addAndGetEarth(this.earthRadius)
        this.addTrees(this.earthRadius)
        this.bonusParticles = this.addAndGetBonusParticles()
        this.bonusParticles.position.y = 250
    }


    protected init() {
        setTimeout(() => {
            this.bonusParticles.explose()
        }, 3000)
    }

    protected onRenderer() {
        this.orbit.update()
    }

    private addAndGetBonusParticles() {
        const bonusParticles = new BonusParticles()
        this.scene.add(bonusParticles)
        return bonusParticles
    }

    private addAndGetEarth(earthRadius: number){
        const earth = new Earth({earthRadius})
        this.scene.add(earth)
        return earth
    }

    private addTrees(earthRadius: number) {
        const nTrees = 100
        const trees = new THREE.Group()

        for (let i = 0; i < nTrees; i++) {
            const phi = i * (Math.PI * 2) / nTrees
            let theta = Math.PI / 2
            //theta += .25 + Math.random()*.3
            theta += (Math.random() > .05) ? .25 + Math.random() * .3 : -.35 - Math.random() * .1

            const tree = this.createTree()
            tree.position.x = Math.sin(theta) * Math.cos(phi) * earthRadius
            tree.position.y = Math.sin(theta) * Math.sin(phi) * (earthRadius - 10)
            tree.position.z = Math.cos(theta) * earthRadius

            const vec = tree.position.clone()
            const axis = new THREE.Vector3(0, 1, 0)
            tree.quaternion.setFromUnitVectors(axis, vec.clone().normalize())
            trees.add(tree)
        }
        this.scene.add(trees)
    }

    private createTree() {

        const blackMat = new THREE.MeshPhongMaterial({
            color: 0x100707,
        })

        const brownMat = new THREE.MeshPhongMaterial({
            color: 0xb44b39,
            shininess: 0,
        })

        const greenMat = new THREE.MeshPhongMaterial({
            color: 0x7abf8e,
            shininess: 0,
        })

        const pinkMat = new THREE.MeshPhongMaterial({
            color: 0xdc5f45,//0xb43b29,//0xff5b49,
            shininess: 0,
        })

        const lightBrownMat = new THREE.MeshPhongMaterial({
            color: 0xe07a57,
        })

        const whiteMat = new THREE.MeshPhongMaterial({
            color: 0xa49789,
        })
        const skinMat = new THREE.MeshPhongMaterial({
            color: 0xff9ea5,
        })



        const truncHeight = 50 + Math.random() * 150
        const topRadius = 1 + Math.random() * 5
        const bottomRadius = 5 + Math.random() * 5
        const mats = [blackMat, brownMat, pinkMat, whiteMat, greenMat, lightBrownMat, pinkMat]
        const matTrunc = blackMat;//mats[Math.floor(Math.random()*mats.length)]
        const nhSegments = 3;//Math.ceil(2 + Math.random()*6)
        const nvSegments = 3;//Math.ceil(2 + Math.random()*6)
        const geom = new THREE.CylinderGeometry(topRadius, bottomRadius, truncHeight, nhSegments, nvSegments)
        geom.applyMatrix4(new THREE.Matrix4().makeTranslation(0, truncHeight / 2, 0))

        const mesh = new THREE.Mesh(geom, matTrunc)
        mesh.castShadow = true

        const vs = geom.getAttribute("position")

        for (let i = 0; i < vs.count; i++) {
            const noise = Math.random()
            let x = vs.getX(i)
            let y = vs.getY(i)
            let z = vs.getZ(i)
            x += -noise + Math.random() * noise * 2
            y += -noise + Math.random() * noise * 2
            z += -noise + Math.random() * noise * 2

            vs.setXYZ(i, x, y, z)
            geom.computeVertexNormals()

            // FRUITS
            if (Math.random() > .7) {
                const size = Math.random() * 3
                const fruitGeometry = new THREE.BoxGeometry(size, size, size, 1)
                const matFruit = mats[Math.floor(Math.random() * mats.length)]
                const fruit = new THREE.Mesh(fruitGeometry, matFruit)
                fruit.position.x = x
                fruit.position.y = y + 3
                fruit.position.z = z
                fruit.rotation.x = Math.random() * Math.PI
                fruit.rotation.y = Math.random() * Math.PI

                mesh.add(fruit)
            }

            // BRANCHES
            if (Math.random() > .5 && y > 10 && y < truncHeight - 10) {
                const h = 3 + Math.random() * 5
                const thickness = .2 + Math.random()

                const branchGeometry = new THREE.CylinderGeometry(thickness / 2, thickness, h, 3, 1)
                branchGeometry.applyMatrix4(new THREE.Matrix4().makeTranslation(0, h / 2, 0))
                const branch = new THREE.Mesh(branchGeometry, matTrunc)
                branch.position.x = x
                branch.position.y = y
                branch.position.z = z

                const vec = new THREE.Vector3(x, 2, z)
                const axis = new THREE.Vector3(0, 1, 0)
                branch.quaternion.setFromUnitVectors(axis, vec.clone().normalize())

                mesh.add(branch)
            }
        }

        return mesh
    }

}
