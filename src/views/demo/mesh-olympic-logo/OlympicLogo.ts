import * as THREE from "three"

export default class OlympicLogo extends THREE.Group{

    constructor(){

        super()

        const cycleGeo = new THREE.TorusGeometry(10, 1, 10, 32)
        const cycleMat1 = new THREE.MeshLambertMaterial({color: "#0885c2"})
        const cycleMat2 = new THREE.MeshLambertMaterial({color: "#fbb132"})
        const cycleMat3 = new THREE.MeshLambertMaterial({color: "#000000"})
        const cycleMat4 = new THREE.MeshLambertMaterial({color: "#1c8b3c"})
        const cycleMat5 = new THREE.MeshLambertMaterial({color: "#dd0625"})

        const cycle1 = new THREE.Mesh(cycleGeo, cycleMat1)
        const cycle2 = new THREE.Mesh(cycleGeo, cycleMat2)
        const cycle3 = new THREE.Mesh(cycleGeo, cycleMat3)
        const cycle4 = new THREE.Mesh(cycleGeo, cycleMat4)
        const cycle5 = new THREE.Mesh(cycleGeo, cycleMat5)


        // 以第三个为中间, 向两边延展
        cycle1.position.set(-25, 0, 0)
        cycle2.position.set(-12.5, -10, -0.5)
        cycle3.position.set(0, 0, 0)
        cycle4.position.set(12.5, -10, 0.5)
        cycle5.position.set(25, 0, 0)

        this.add(
            cycle1,
            cycle2,
            cycle3,
            cycle4,
            cycle5,
        )
    }

}