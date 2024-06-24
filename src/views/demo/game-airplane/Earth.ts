import * as THREE from "three"
import {Colors} from "@/views/demo/game-airplane/ThreeProject"


interface EarthOptions {
    earthRadius?: number,
    treesCount?: number,
    flowerCount?: number,
    colors?: Colors,
}


export default class Earth extends THREE.Group {

    private readonly options: Required<EarthOptions>

    constructor(options?: EarthOptions) {
        super()

        const defaultOptions: Required<EarthOptions> = {
            earthRadius: 600,
            treesCount: 300,
            flowerCount: 350,
            colors: {
                red: 0xf25346,
                yellow: 0xedeb27,
                white: 0xd8d0d1,
                brown: 0x59332e,
                pink: 0xF5986E,
                brownDark: 0x23190f,
                blue: 0x68c3c0,
                green: 0x458248,
                purple: 0x551A8B,
                lightgreen: 0x629265,
            }
        }

        this.options = Object.assign({}, defaultOptions, options)

        const {treesCount, flowerCount} = this.options


        this.addEarth()
        this.addTrees(treesCount)
        this.addFlowers(flowerCount)
    }

    private addEarth(){
        const geom = new THREE.CylinderGeometry(this.options.earthRadius, this.options.earthRadius, 1700, 40, 10)
        geom.applyMatrix4(new THREE.Matrix4().makeRotationX(-Math.PI / 2))
        const mat = new THREE.MeshLambertMaterial({
            color: 0x629265,
            flatShading: true
        })

        const mesh = new THREE.Mesh(geom, mat)
        mesh.receiveShadow = true
        this.add(mesh)
    }

    private addTrees(count: number){
        const stepAngle = Math.PI * 2 / count

        for (let i = 0; i < count; i++) {

            const tree = this.createTree()

            const angle = stepAngle * i
            const height = 605
            tree.position.y = Math.sin(angle) * height
            tree.position.x = Math.cos(angle) * height
            tree.position.z = 0 - Math.random() * 600

            tree.rotation.z = angle + (Math.PI / 2) * 3
            tree.rotation.z = Math.atan2(tree.position.y, tree.position.x)-Math.PI/2

            const s = 0.3 + Math.random() * 0.75
            tree.scale.set(s, s, s)

            this.add(tree)
        }
    }

    private addFlowers(count: number){
        const stepAngle = Math.PI * 2 / count
        for (let i = 0; i < count; i++) {

            const flower = this.createFlower()
            const angle = stepAngle * i

            const height = 605
            flower.position.y = Math.sin(angle) * height
            flower.position.x = Math.cos(angle) * height

            flower.rotation.z = angle + (Math.PI / 2) * 3

            flower.position.z = 0 - Math.random() * 600

            const s = .1 + Math.random() * .3
            flower.scale.set(s, s, s)

            this.add(flower)
        }
    }

    private createTree() {

        const group = new THREE.Group

        const leavesMat = new THREE.MeshLambertMaterial({
            color: this.options.colors.green,
            flatShading: true
        })

        const truckGeo = new THREE.BoxGeometry(10, 20, 10)
        const truckMat = new THREE.MeshLambertMaterial({color: this.options.colors.brown})
        const truck = new THREE.Mesh(truckGeo, truckMat)
        truck.castShadow = true
        truck.receiveShadow = true
        group.add(truck)

        const leaves1Geo = new THREE.CylinderGeometry(1, 12 * 3, 12 * 3, 4)
        const leaves1 = new THREE.Mesh(leaves1Geo, leavesMat)
        leaves1.position.y = 20
        leaves1.castShadow = true
        leaves1.receiveShadow = true
        group.add(leaves1)

        const leaves2Geo = new THREE.CylinderGeometry(1, 9 * 3, 9 * 3, 4)
        const leaves2 = new THREE.Mesh(leaves2Geo, leavesMat)
        leaves2.position.y = 40
        leaves2.castShadow = true
        leaves2.receiveShadow = true
        group.add(leaves2)

        const leaves3Geo = new THREE.CylinderGeometry(1, 6 * 3, 6 * 3, 4)
        const leaves3 = new THREE.Mesh(leaves3Geo, leavesMat)
        leaves3.position.y = 55
        leaves3.castShadow = true
        leaves3.receiveShadow = true
        group.add(leaves3)

        group.castShadow = true
        group.receiveShadow = true

        return group
    }

    private createFlower() {

        const group = new THREE.Group

        const geomStem = new THREE.BoxGeometry(5, 50, 5, 1, 1, 1)
        const matStem = new THREE.MeshPhongMaterial({
            color: this.options.colors.green,
            flatShading: true
        })
        const stem = new THREE.Mesh(geomStem, matStem)
        stem.castShadow = false
        stem.receiveShadow = true
        group.add(stem)


        const geomPetalCore = new THREE.BoxGeometry(10, 10, 10, 1, 1, 1)
        const matPetalCore = new THREE.MeshPhongMaterial({
            color: this.options.colors.lightgreen,
            flatShading: true
        })
        const petalCore = new THREE.Mesh(geomPetalCore, matPetalCore)
        petalCore.castShadow = false
        petalCore.receiveShadow = true

        const petalColors = [this.options.colors.red, this.options.colors.yellow, this.options.colors.blue]
        const petalColor = petalColors[Math.floor(Math.random() * 3)]

        const geomPetal = new THREE.BoxGeometry(15, 20, 5, 1, 1, 1)
        const matPetal = new THREE.MeshBasicMaterial({color: petalColor})

        const vs = geomPetal.getAttribute("position")

        vs.setY(5, vs.getY(5) - 4)
        vs.setY(4, vs.getY(4) - 4)
        vs.setY(7, vs.getY(7) + 4)
        vs.setY(6, vs.getY(6) + 4)

        geomPetal.attributes.position.needsUpdate = true

        geomPetal.translate(12.5, 0, 3)

        const petals = []

        for (let i = 0; i < 4; i++) {
            petals[i] = new THREE.Mesh(geomPetal, matPetal)
            petals[i].rotation.z = i * Math.PI / 2
            petals[i].castShadow = true
            petals[i].receiveShadow = true
        }

        petalCore.add(petals[0], petals[1], petals[2], petals[3])
        petalCore.position.y = 25
        petalCore.position.z = 3

        group.add(petalCore)

        return group
    }




}