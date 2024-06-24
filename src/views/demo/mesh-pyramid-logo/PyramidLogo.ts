import * as THREE from "three"
import {getTextureLoader} from "@/three-widget/loader/ThreeLoader"

import matcap_0Pic from "./texture/matcap_0.png"


export default class PyramidLogo extends THREE.Group{


    readonly material: THREE.MeshMatcapMaterial

    constructor(){

        super()

        const material = new THREE.MeshMatcapMaterial({
            matcap: getTextureLoader().load(matcap_0Pic),
            side: THREE.DoubleSide,
        })
        this.material = material

        const cone = new THREE.Mesh(new THREE.ConeGeometry(4, 4, 4), material)
        cone.position.y = 12
        this.add(cone)

        const cylinder1 = new THREE.Mesh(new THREE.CylinderGeometry(6, 10, 4, 4, 1), material)
        cylinder1.position.y = 6
        this.add(cylinder1)

        const cylinder2 = new THREE.Mesh(new THREE.CylinderGeometry(12, 16, 4, 4, 1), material)
        this.add(cylinder2)

    }

}