import * as THREE from "three"
import {gsap} from "gsap"

export default class BonusParticles extends THREE.Group {


    constructor() {
        super()

        const greenMat = new THREE.MeshPhongMaterial({
            color: 0x7abf8e,
            shininess: 0,
        })

        const pinkMat = new THREE.MeshPhongMaterial({
            color: 0xdc5f45,//0xb43b29,//0xff5b49,
            shininess: 0,
        })

        const bigParticleGeom = new THREE.BoxGeometry(10, 10, 10, 1)
        const smallParticleGeom = new THREE.BoxGeometry(5, 5, 5, 1)
        for (let i = 0; i < 10; i++) {
            const partPink = new THREE.Mesh(bigParticleGeom, pinkMat)
            const partGreen = new THREE.Mesh(smallParticleGeom, greenMat)
            partGreen.scale.set(.5, .5, .5)
            this.add(partPink)
            this.add(partGreen)
        }
    }

    explose() {

        console.log("粒子爆炸")

        const explosionSpeed = .5

        this.children.reverse().forEach(item => {
            const tx = -50 + Math.random() * 100
            const ty = -50 + Math.random() * 100
            const tz = -50 + Math.random() * 100

            item.position.set(0, 0, 0)
            item.scale.set(1, 1, 1)
            item.visible = true

            const s = explosionSpeed + Math.random() * .5

            gsap.to(item.position,
                {
                    x: tx,
                    y: ty,
                    z: tz,
                    duration: s
                    //ease: Power4.easeOut,
                },
            )
            gsap.to(item.scale,
                {
                    x: .01,
                    y: .01,
                    z: .01,
                    duration: s,
                    //ease: Power4.easeOut,
                    onComplete: () => {
                        item.visible = false
                    }
                })
        })
    }


}


