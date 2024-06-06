import * as THREE from "three"
import MyGroup from "@/three-widget/MyGroup"
import SmokePartical from "@/three-widget/my/SmokePartical"

interface WashGunOptions {
    radius?: number
}

type WashGunDefaultOptions = Required<WashGunOptions>


export class WashGun extends MyGroup<WashGunOptions> {

    private readonly particals: SmokePartical[]
    private timer: NodeJS.Timeout | null = null

    constructor(name: string, options?: WashGunOptions) {

        const defaultOptions: Required<WashGunOptions> = {
            radius: 600,
        }

        super(name, defaultOptions, options)

        this.particals = []
        this.addGun()
    }

    private addGun() {
        const geo = new THREE.CylinderGeometry(50, 30, 140, 16, 3)
        const mat = new THREE.MeshBasicMaterial({color: 0x00b8fc, opacity: 0.7, transparent: true})
        const entity = new THREE.Mesh(geo, mat)
        entity.name = '喷枪'
        this.add(entity)
    }

    private createPartical() {
        const partical = new SmokePartical()
        partical.name = "喷雾"
        this.add(partical)
        return partical
    }

    private removePartical(partical: SmokePartical){
        partical.removeFromParent()
        partical.geometry.dispose()
        const mat = partical.material as THREE.MeshBasicMaterial
        mat.dispose()
    }

    private createParticalAnimation(){
         this.timer = setInterval(() => {
            if (this.particals.length < 100) {
                this.particals.push(this.createPartical())
            }

            this.particals.forEach((partical, index) => {
                partical.update()
            })
        }, 100)
    }

    run() {
        this.createParticalAnimation()
    }

    stop() {
        clearInterval(this.timer!)
        this.particals.forEach((partical, index) => {
            this.particals.splice(index, 1)
            this.removePartical(partical)
        })
        this.remove(...this.particals)
    }

}
