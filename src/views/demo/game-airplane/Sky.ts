import * as THREE from "three"


interface SkyOptions {
    cloudsCount: number,
}


export default class Sky extends THREE.Group {

    private readonly options: Required<SkyOptions>

    constructor(options?: SkyOptions) {
        super()

        const defaultOptions: Required<SkyOptions> = {
            cloudsCount: 25,
        }

        this.options = Object.assign({}, defaultOptions, options)

        const {cloudsCount} = this.options

        this.addClouds(cloudsCount)
    }

    private addClouds(count: number){
        const stepAngle = Math.PI * 2 / count

        for (let i = 0; i < count; i++) {

            const cloud = this.createCloud()

            const angle = stepAngle * i
            // 云与原点的距离
            const cloudHeight = 800 + Math.random() * 200
            cloud.position.y = Math.sin(angle) * cloudHeight
            cloud.position.x = Math.cos(angle) * cloudHeight
            cloud.position.z = -400 - Math.random() * 400

            cloud.rotation.z = angle + Math.PI / 2

            const s = 1 + Math.random() * 2
            cloud.scale.set(s, s, s)

            this.add(cloud)
        }
    }

    private createCloud() {

        const group = new THREE.Group()

        const geom = new THREE.DodecahedronGeometry(20, 0)
        const mat = new THREE.MeshPhongMaterial({
            color: 0xffffff
        })

        const blocks = 3 + Math.floor(Math.random() * 3)

        for (let i = 0; i < blocks; i++) {
            const block = new THREE.Mesh(geom, mat)
            block.position.x = i * 15
            block.position.y = Math.random() * 10
            block.position.z = Math.random() * 10
            block.rotation.z = Math.random() * Math.PI * 2
            block.rotation.y = Math.random() * Math.PI * 2

            const s = .1 + Math.random() * .9
            block.scale.set(s, s, s)

            group.add(block)
        }

        return group
    }


}