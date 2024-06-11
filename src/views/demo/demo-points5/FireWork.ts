import * as Three from "three"
import fireworkFragmentShader from './shader/fireworkFragmentShader.glsl'
import fireworkVertexShader from './shader/fireworkVertexShader.glsl'
import startpointFragmentShader from './shader/startpointFragmentShader.glsl'
import startpointVertexShader from './shader/startpointVertexShader.glsl'

export default class FireWork {

    private color: Three.Color
    private startGeometry: Three.BufferGeometry
    private startMaterial: Three.ShaderMaterial
    private fireworkMaterial: Three.ShaderMaterial
    private fireworkGeometry: Three.BufferGeometry
    private clock: Three.Clock
    startPoint: Three.Points
    fireworks:Three.Points

    constructor(color: Three.Color, from: { x: number, y: number, z: number }, to: { x: number, y: number, z: number }) {
        this.color = color


        // 1, 创建烟花发射球
        this.startGeometry = new Three.BufferGeometry()
        const startPositionArray = new Float32Array(3)
        startPositionArray[0] = from.x
        startPositionArray[1] = from.y
        startPositionArray[2] = from.z
        this.startGeometry.setAttribute('position', new Three.BufferAttribute(startPositionArray, 3))

        const astepArray = new Float32Array(3)
        astepArray[0] = to.x - from.x
        astepArray[1] = to.y - from.y
        astepArray[2] = to.z - from.z
        this.startGeometry.setAttribute('aStep', new Three.BufferAttribute(astepArray, 3))

        this.startMaterial = new Three.ShaderMaterial({
            vertexShader: startpointVertexShader,
            fragmentShader: startpointFragmentShader,
            transparent: true,
            blending: Three.AdditiveBlending,
            depthWrite: false,
            uniforms: {
                uTime: {
                    value: 0
                },
                uSize: {
                    value: 20
                },
                uColor: {
                    value: this.color
                }
            }
        })

        this.startPoint = new Three.Points(this.startGeometry, this.startMaterial)

        // 2, 开始计时
        this.clock = new Three.Clock()

        // 3, 创建爆炸火花
        this.fireworkGeometry = new Three.BufferGeometry()

        // 爆炸火花数量
        const fireworkCount = 180 + Math.floor(Math.random() * 180)

        const positionFirework = new Float32Array(fireworkCount * 3)
        const directionArray = new Float32Array(fireworkCount * 3)
        const scaleFireArray = new Float32Array(fireworkCount)

        for (let i = 0; i < fireworkCount; i++) {
            positionFirework[i * 3] = to.x
            positionFirework[i * 3 + 1] = to.y
            positionFirework[i * 3 + 2] = to.z

            // 每个火花发射角度
            const theta = Math.random() * 2 * Math.PI
            const bata = Math.random() * 2 * Math.PI
            const r = Math.random()
            directionArray[i * 3] = r * Math.sin(theta) + r * Math.sin(bata)
            directionArray[i * 3 + 1] = r * Math.cos(theta) + r * Math.cos(bata)
            directionArray[i * 3 + 2] = r * Math.sin(theta) + r * Math.cos(bata)

            // 火花随机大小
            scaleFireArray[i] = Math.random()
        }

        this.fireworkGeometry.setAttribute('position', new Three.BufferAttribute(positionFirework, 3))
        this.fireworkGeometry.setAttribute('aRandom', new Three.BufferAttribute(directionArray, 3))
        this.fireworkGeometry.setAttribute('aScale', new Three.BufferAttribute(scaleFireArray, 1))

        this.fireworkMaterial = new Three.ShaderMaterial({
            vertexShader: fireworkVertexShader,
            fragmentShader: fireworkFragmentShader,
            transparent: true,
            blending: Three.AdditiveBlending,
            depthWrite: false,
            uniforms: {
                uTime: {
                    value: 0
                },
                uSize: {
                    value: 0
                },
                uColor: {
                    value: this.color
                }
            }
        })
        this.fireworks = new Three.Points(this.fireworkGeometry, this.fireworkMaterial)
    }

    update() {

        const elapsedTime = this.clock.getElapsedTime()

        // 烟花生命周期为 5 秒, 小于1秒的刷新烟花球位置, 大于1秒释放烟花球资源, 生成爆转移目标地址火花, 大于5秒释放火花资源
        if (elapsedTime < 1) {
            this.startMaterial.uniforms.uTime.value = elapsedTime
            this.startMaterial.uniforms.uSize.value = 20
        } else {
            const time = elapsedTime - 1
            // 先让烟花视觉上消失
            this.startMaterial.uniforms.uSize.value = 0
            // 烟花视觉从内存中清除
            this.startPoint.clear()
            this.startGeometry.dispose()
            this.startMaterial.dispose()

            // 爆炸火花显示
            this.fireworkMaterial.uniforms.uSize.value = 20
            this.fireworkMaterial.uniforms.uTime.value = time

            // 爆炸火花从内存中清除
            if (time > 5) {
                this.fireworks.clear()
                this.fireworkGeometry.dispose()
                this.fireworkMaterial.dispose()
            }
        }
    }

}