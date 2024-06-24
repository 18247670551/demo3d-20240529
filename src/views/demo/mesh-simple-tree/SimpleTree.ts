import * as THREE from "three"
import {getTextureLoader} from "@/three-widget/loader/ThreeLoader"
import treePic from "./texture/tree.png"


export default class SimpleTree extends THREE.Group{

    constructor(options: {width: number, height: number}){

        super()

        const {width, height} = options

        const treeMaterial = new THREE.MeshPhysicalMaterial({
            map: getTextureLoader().load(treePic),
            transparent: true,
            side: THREE.DoubleSide,
            metalness: .2,
            roughness: .8,
            depthTest: true,
            depthWrite: false,
            fog: false,
            reflectivity: 0.1,
        })

        const treeCustomDepthMaterial = new THREE.MeshDepthMaterial({
            depthPacking: THREE.RGBADepthPacking,
            map: getTextureLoader().load(treePic),
            alphaTest: 0.5
        })

        const treeGeo = new THREE.PlaneGeometry(width, height)
        treeGeo.translate(0, height/2, 0)

        const treePlan1 = new THREE.Mesh(treeGeo)
        treePlan1.material = treeMaterial
        treePlan1.customDepthMaterial = treeCustomDepthMaterial

        const treePlan2 = treePlan1.clone()
        treePlan2.rotation.y += Math.PI / 4
        const treePlan3 = treePlan2.clone()
        treePlan3.rotation.y += Math.PI / 4
        const treePlan4 = treePlan3.clone()
        treePlan4.rotation.y += Math.PI / 4

        this.add(treePlan1, treePlan2, treePlan3, treePlan4)
    }

}