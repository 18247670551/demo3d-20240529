import * as THREE from "three";
import MyGroup from "@/three-widget/MyGroup";
import SmokeParticle from "@/three-widget/my/SmokeParticle";
export default class WashGun extends MyGroup {
    particles;
    timer = null;
    constructor(name, options) {
        const defaultOptions = {
            radius: 600,
        };
        super(name, defaultOptions, options);
        this.particles = [];
        this.addGun();
    }
    addGun() {
        const geo = new THREE.CylinderGeometry(50, 30, 140, 16, 3);
        const mat = new THREE.MeshBasicMaterial({ color: 0x00b8fc, opacity: 0.7, transparent: true });
        const entity = new THREE.Mesh(geo, mat);
        entity.name = '喷枪';
        this.add(entity);
    }
    createParticle() {
        const particle = new SmokeParticle();
        particle.name = "喷雾";
        this.add(particle);
        return particle;
    }
    removeParticle(particle) {
        particle.removeFromParent();
        particle.geometry.dispose();
        const mat = particle.material;
        mat.dispose();
    }
    createParticleAnimation() {
        this.timer = setInterval(() => {
            if (this.particles.length < 100) {
                this.particles.push(this.createParticle());
            }
            this.particles.forEach((particle, index) => {
                particle.update();
            });
        }, 100);
    }
    run() {
        this.createParticleAnimation();
    }
    stop() {
        clearInterval(this.timer);
        this.particles.forEach((particle, index) => {
            this.particles.splice(index, 1);
            this.removeParticle(particle);
        });
        this.remove(...this.particles);
    }
}
//# sourceMappingURL=WashGun.js.map