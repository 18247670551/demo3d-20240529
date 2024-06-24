import * as THREE from "three"
import {random} from "lodash"
import {getTextureLoader} from "@/three-widget/loader/ThreeLoader"

/**
 * @param life?: number
 * @param range?: number
 * @param center?: [number, number, number]
 * @param speed?: [number, number, number]
 * @param size?: [number]
 * @param scale?: [number]
 */
export interface MyParticleOptions {
    life?: number
    range?: number
    center?: [number, number, number]
    speed?: [number, number, number]
    size?: [number]
    scale?: [number]
}

export default class SmokeParticle extends THREE.Points {

    createTime = 0
    updateTime = 0

    readonly options: Required<MyParticleOptions>

    private readonly currentSize: [number]
    private readonly currentScale: [number]
    private readonly currentOpacity: [number]
    private readonly currentPosition: [number, number, number]
    private readonly currentSpeed: [number, number, number]

    constructor(options?: MyParticleOptions) {

        const geo = new THREE.BufferGeometry()

        geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array([]), 3))
        geo.setAttribute('a_opacity', new THREE.BufferAttribute(new Float32Array([]), 1))
        geo.setAttribute('a_size', new THREE.BufferAttribute(new Float32Array([]), 1))
        geo.setAttribute('a_scale', new THREE.BufferAttribute(new Float32Array([]), 1))

        const mat = SmokeParticle.createMaterial()

        super(geo, mat)

        const defaultOptions: Required<MyParticleOptions> = {
            life: 6000,
            range: 20,
            center: [0, 50, 0],
            speed: [random(-100, 100), random(100, 500), random(-100, 100)],
            size: [1],
            scale: [0.001],
        }

        this.options = Object.assign({}, defaultOptions, options)

        const {range, speed, size, life, scale} = this.options

        const now = Date.now()
        this.createTime = now
        this.updateTime = now
        this.currentSize = [0]
        this.currentScale = [0]
        this.currentOpacity = [0]
        this.currentPosition = [0, 0, 0]

        this.currentSpeed = [speed[0], speed[1], speed[2]]

        this.update()
    }

    update() {
        const now = Date.now()
        const currentLife = now - this.createTime
        const time = now - this.updateTime

        const {range, speed, size, life, scale, center} = this.options

        if (currentLife > life) {
            this.currentSize[0] = size[0]
            this.currentScale[0] = scale[0]
            this.currentOpacity[0] = 0.8

            this.currentPosition[0] = Math.random() * 2 * range + center[0] - range
            this.currentPosition[1] = center[1]
            this.currentPosition[2] = Math.random() * 2 * range + center[0] - range

            this.createTime = now
        } else {

            this.currentScale[0] = 1 + 5 * currentLife / life
            this.currentOpacity[0] = 1 - currentLife / life
            let currentSize = this.currentSize[0] + 2
            if (currentSize > 20) {
                currentSize = this.currentSize[0]
            }
            this.currentSize[0] = currentSize

            this.currentPosition[0] += this.currentSpeed[0] * time / 1000
            this.currentPosition[1] += this.currentSpeed[1] * time / 1000
            this.currentPosition[2] += this.currentSpeed[2] * time / 1000
        }

        this.geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(this.currentPosition), 3))
        this.geometry.setAttribute('a_opacity', new THREE.BufferAttribute(new Float32Array(this.currentOpacity), 1))
        this.geometry.setAttribute('a_size', new THREE.BufferAttribute(new Float32Array(this.currentSize), 1))
        this.geometry.setAttribute('a_scale', new THREE.BufferAttribute(new Float32Array(this.currentScale), 1))

        this.updateTime = now
    }


    static createMaterial() {
        const texture = getTextureLoader().load("/demo/scene-ming-wash/smoke1.png")
        
        texture.colorSpace = THREE.SRGBColorSpace

        const mat = new THREE.PointsMaterial({
            color: '#FFFFFF',
            map: texture,
            transparent: true,
            depthWrite: false,
        })
        // 修正着色器
        mat.onBeforeCompile = function (shader) {
            const vertexShader_attribute =
                `
                    attribute float a_opacity;
                    attribute float a_size;
                    attribute float a_scale;
                    varying float v_opacity;
                    void main() {
                        v_opacity = a_opacity;
                `
            const vertexShader_size =
                `
                    gl_PointSize = a_size * a_scale;
                `
            shader.vertexShader = shader.vertexShader.replace('void main() {', vertexShader_attribute)
            shader.vertexShader = shader.vertexShader.replace('gl_PointSize = size;', vertexShader_size)

            const fragmentShader_varying =
                `
                    varying float v_opacity;
                    void main() {
                `
            const fragmentShader_opacity =
                `
                    gl_FragColor = vec4( outgoingLight, diffuseColor.a * v_opacity );
                `
            shader.fragmentShader = shader.fragmentShader.replace('void main() {', fragmentShader_varying)
            shader.fragmentShader = shader.fragmentShader.replace('gl_FragColor = vec4( outgoingLight, diffuseColor.a );', fragmentShader_opacity)
        }
        return mat
    }

}
