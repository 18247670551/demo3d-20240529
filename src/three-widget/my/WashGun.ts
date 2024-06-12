import * as THREE from "three"
import MyGroup from "@/three-widget/MyGroup"
import SmokeParticle from "@/three-widget/my/SmokeParticle"

interface WashGunOptions {
    radius?: number
}

type WashGunDefaultOptions = Required<WashGunOptions>


export class WashGun extends MyGroup<WashGunOptions> {

    private readonly particles: SmokeParticle[]
    private timer: NodeJS.Timeout | null = null

    constructor(name: string, options?: WashGunOptions) {

        const defaultOptions: Required<WashGunOptions> = {
            radius: 600,
        }

        super(name, defaultOptions, options)

        this.particles = []
        this.addGun()
    }

    private addGun() {
        const geo = new THREE.CylinderGeometry(50, 30, 140, 16, 3)
        const mat = new THREE.MeshBasicMaterial({color: 0x00b8fc, opacity: 0.7, transparent: true})
        const entity = new THREE.Mesh(geo, mat)
        entity.name = '喷枪'
        this.add(entity)
    }

    private createParticle() {
        const particle = new SmokeParticle()
        particle.name = "喷雾"
        this.add(particle)
        return particle
    }

    private removeParticle(particle: SmokeParticle){
        particle.removeFromParent()
        particle.geometry.dispose()
        const mat = particle.material as THREE.MeshBasicMaterial
        mat.dispose()
    }

    private createParticleAnimation(){
         this.timer = setInterval(() => {
            if (this.particles.length < 100) {
                this.particles.push(this.createParticle())
            }

            this.particles.forEach((particle, index) => {
                particle.update()
            })
        }, 100)
    }

    run() {
        this.createParticleAnimation()
    }

    stop() {
        clearInterval(this.timer!)
        this.particles.forEach((particle, index) => {
            this.particles.splice(index, 1)
            this.removeParticle(particle)
        })
        this.remove(...this.particles)
    }

}
