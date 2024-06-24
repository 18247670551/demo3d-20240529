import * as THREE from "three"

export default class Earth extends THREE.Group {

    constructor(radius: number) {
        super()
        const floorShadow = new THREE.Mesh(new THREE.SphereGeometry(radius, 50, 50), new THREE.MeshPhongMaterial({
            color: 0x7abf8e,
            specular: 0x000000,
            shininess: 1,
            transparent: true,
            opacity: .5
        }))
        floorShadow.receiveShadow = true

        const floorGrass = new THREE.Mesh(new THREE.SphereGeometry(radius - .5, 50, 50), new THREE.MeshBasicMaterial({
            color: 0x7abf8e
        }))
        floorGrass.receiveShadow = false

        this.add(floorShadow)
        this.add(floorGrass)
    }


}