import * as THREE from "three"
import vertexShader from './shader/vertexShader.glsl'
import fragmentShader from './shader/fragmentShader.glsl'

/**
 * num 粒子数
 * size 粒子大小
 * color 粒子颜色{r, g, b, alpha(透明度)}
 * num 粒子数
 */
interface MyPointsOptions {
    num?: number,
    size?: number,
    color?: { r: number, g: number, b: number, a: number },
}


export default class MyPoints extends THREE.Points {

    num: number
    oldPositions: Float32Array
    toPositions: Float32Array
    toPositionDurations: Float32Array

    clock: THREE.Clock = new THREE.Clock(true)
    time = 0

    constructor(options?: MyPointsOptions) {

        const defaultOptions: Required<MyPointsOptions> = {
            num: 10000,
            size: 10,
            color: {r: 100, g: 200, b: 200, a: 1,},
        }

        const finalOptions = Object.assign({}, defaultOptions, options)

        const shaderColor = new Float32Array(4)
        shaderColor[0] = finalOptions.color.r / 255
        shaderColor[1] = finalOptions.color.g / 255
        shaderColor[2] = finalOptions.color.b / 255
        shaderColor[3] = finalOptions.color.a

        const geo = new THREE.BufferGeometry()
        const mat = new THREE.ShaderMaterial({
            vertexShader,
            fragmentShader,
            uniforms: {
                time: {value: 0},
                size: {value: finalOptions.size},
                color: {value: shaderColor},
            },
            // side: 2,
            transparent: true,
            // blending: THREE.AdditiveBlending, // 粒子重叠时加亮
            alphaTest: 0.001,
            depthTest: false,
            depthWrite: false,
        })

        super(geo, mat)

        this.num = finalOptions.num

        this.oldPositions = new Float32Array(this.num * 3)
        this.toPositions = new Float32Array(this.num * 3)
        this.toPositionDurations = new Float32Array(this.num)

        // 本例用 oldPositions 和 toPositions 在片元着色器中计算得出 position, 实际 position 属性用不到, 但必须要初始化一个值, 否则模型不加载
        this.geometry.setAttribute("position", new THREE.BufferAttribute(new Float32Array(this.num * 3), 3))

        this.geometry.setAttribute("oldPosition", new THREE.BufferAttribute(this.oldPositions, 3))
        this.geometry.setAttribute("toPosition", new THREE.BufferAttribute(this.toPositions, 3))
        this.geometry.setAttribute("toPositionDuration", new THREE.BufferAttribute(this.toPositionDurations, 1))
    }

    /**
     * 向某形状变换
     */
    to(array: ArrayLike<number>, duration: { min: number, max: number }) {
        for (let i = 0, realCount = 0; i < this.num; i++, realCount++) {
            //模型的点和生成的点数量未必相等 多的则重合前面的位置
            realCount = realCount % (array.length / 3)
            const i3 = i * 3
            const r3 = realCount * 3

            // 将当前位置保存为旧位置
            this.oldPositions[i3] = this.toPositions[i3]
            this.oldPositions[i3 + 1] = this.toPositions[i3 + 1]
            this.oldPositions[i3 + 2] = this.toPositions[i3 + 2]

            // 设置终点
            this.toPositions[i3] = array[r3]
            this.toPositions[i3 + 1] = array[r3 + 1]
            this.toPositions[i3 + 2] = array[r3 + 2]

            // 设置运动时间
            this.toPositionDurations[i] = duration.min + Math.random() * (duration.max - duration.min)
        }

        // 每次变换时, 要将 this.time 置为当前时间, 以保证变换后, vertexShader 中变换进度百分比计算的时间参数从 0 开始
        // 否则第一次变换以后, 再次变换时, 进度一直保持 100%, 就不会有变换动画
        this.time = this.clock.getElapsedTime()

        this.geometry.attributes.toPosition.needsUpdate = true
        this.geometry.attributes.oldPosition.needsUpdate = true
        this.geometry.attributes.toPositionDuration.needsUpdate = true
    }


    update() {
        const time = this.clock.getElapsedTime() - this.time
        // @ts-ignore 材质确定为 THREE.ShaderMaterial, uniforms 属性一定存在, 也可以 as 转一下消除警告
        this.material.uniforms.time.value = time * 1000
    }

}