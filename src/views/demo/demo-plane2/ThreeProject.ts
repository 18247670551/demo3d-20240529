import * as THREE from "three"
import ThreeCore from "@/three-widget/ThreeCore"
import Earth from "@/views/demo/demo-plane2/Earth"
import Sky from "@/views/demo/demo-plane2/Sky"
import Sun from "@/views/demo/demo-plane2/Sun"
import AirPlane from "@/views/demo/demo-plane2/AirPlane"

export type Colors = {
    red: number,
    yellow: number,
    white: number,
    brown: number,
    pink: number,
    brownDark: number,
    blue: number,
    green: number,
    purple: number,
    lightgreen: number,
}

const colors: Colors = {
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


export default class ThreeProject extends ThreeCore {

    private offsetY = -600
    private mousePos = {x: 0, y: 0}

    private readonly earth: Earth
    private readonly sky: Sky
    private readonly airplane: AirPlane

    constructor(dom: HTMLElement) {

        super(dom, {
            cameraOptions: {
                fov: 60,
                near: 0.1,
                far: 10000
            }
        })

        this.scene.fog = new THREE.Fog(0xf7d9aa, 100, 1000)

        this.camera.position.set(0, 150, 100)

        const hemisphereLight = new THREE.HemisphereLight(0xaaaaaa, 0x000000, 3)
        this.scene.add(hemisphereLight)

        const light = new THREE.DirectionalLight(0xffffff, 2)
        light.position.set(0, 600, -600)

        light.castShadow = true
        this.scene.add(light)

        const shadowLight = new THREE.DirectionalLight(0xffffff, 4)
        shadowLight.position.set(600, 600, 600)

        shadowLight.castShadow = true
        this.scene.add(shadowLight)


        this.renderer.shadowMap.enabled = true
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap


        const earth = new Earth()
        earth.position.y = this.offsetY
        this.earth = earth
        this.scene.add(earth)

        const sun = new Sun()
        sun.scale.set(1, 1, 0.3)
        sun.position.set(0, -30, -850)
        this.scene.add(sun)


        const sky = new Sky()
        sky.position.y = this.offsetY
        this.sky = sky
        this.scene.add(sky)


        const airplane = new AirPlane({colors})
        airplane.scale.set(.35, .35, .35)
        airplane.position.set(-40, 110, -250)
        this.airplane = airplane
        this.scene.add(airplane)

        document.addEventListener('mousemove', this.handleMouseMove.bind(this), false)
    }

    private handleMouseMove(event: any) {
        const tx = -1 + (event.clientX / this.dom.clientWidth) * 2
        const ty = 1 - (event.clientY / this.dom.clientHeight) * 2
        this.mousePos = {x: tx, y: ty}
    }

    protected init() {
    }

    protected onRenderer() {
        this.sky.rotation.z += .003
        this.earth.rotation.z += .005
        this.updatePlane()
    }

    private normalize(v: number, vMin: number, vMax: number, tMin: number, tMax: number) {
        const nv = Math.max(Math.min(v, vMax), vMin)
        const dv = vMax - vMin
        const pc = (nv - vMin) / dv
        const dt = tMax - tMin
        const tv = tMin + (pc * dt)
        return tv
    }

    private updatePlane() {

        const targetY = this.normalize(this.mousePos.y, -.75, .75, 50, 190)
        const targetX = this.normalize(this.mousePos.x, -.75, .75, -100, -20)


        this.airplane.position.x += (targetX - this.airplane.position.x) * 0.05
        this.airplane.position.y += (targetY - this.airplane.position.y) * 0.05

        this.airplane.rotation.x = (this.airplane.position.y - targetY) * 0.0064
        this.airplane.rotation.y = (this.airplane.position.x - targetX) * 0.0064
        this.airplane.rotation.z = (targetY - this.airplane.position.y) * 0.0128

        this.airplane.propeller.rotation.x += 0.3;
    }


}
