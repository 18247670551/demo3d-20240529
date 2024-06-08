import {AdditiveBlending, BufferAttribute, BufferGeometry, Material, Points,} from "three"
import * as THREE from "three"
import {fragmentShader, vertexShader} from "@/views/demo/demo-points6/shaders"


export default class PointsControl {
    numberOfPoints: number
    positions: Float32Array
    particles: Points<BufferGeometry, Material>
    particlesMaterial: THREE.ShaderMaterial
    particlesGeometry: BufferGeometry
    toPositions: Float32Array
    toPositionsDuration: Float32Array
    oldPositions: Float32Array

    /**
     * 粒子控制器
     * @param {number} numberOfPoints 数量必须大于所有模型中最大的点数量 不然显示不全
     */
    constructor(numberOfPoints: number) {
        this.numberOfPoints = numberOfPoints
        this.particlesGeometry = new BufferGeometry()
        //顶点着色器的坐标
        this.positions = new Float32Array(numberOfPoints * 3)
        //顶点着色器的变更前的坐标
        this.oldPositions = new Float32Array(numberOfPoints * 3)
        //顶点着色器要前往的目标位置
        this.toPositions = new Float32Array(this.numberOfPoints * 3)
        //顶点着色器要前往的目标位置的时间
        this.toPositionsDuration = new Float32Array(this.numberOfPoints)
        this.particlesGeometry.setAttribute("position", new BufferAttribute(this.positions, 3))
        this.particlesGeometry.setAttribute("oldPositions", new BufferAttribute(this.oldPositions, 3))
        this.particlesGeometry.setAttribute("toPositions", new BufferAttribute(this.toPositions, 3))
        this.particlesGeometry.setAttribute("toPositionsDuration", new BufferAttribute(this.toPositionsDuration, 1))

        this.particlesMaterial = new THREE.ShaderMaterial({
            uniforms: {
                time: { value: 0 },
                //弥补自定义shader没有PointsMaterial材质的size属性
                size: { value: 8 },
            },
            blending: AdditiveBlending,
            // side: 2,
            transparent: true,
            // blending: THREE.AdditiveBlending,
            vertexShader,
            fragmentShader,
            alphaTest: 0.001,
            depthTest: false,
            depthWrite: false,
        })

        this.particles = new Points(this.particlesGeometry, this.particlesMaterial)
        this.init()
    }

    /**
     * 初始化粒子系统 随机方形排布
     */
    init(range: number = 1000) {
        for (let i = 0; i < this.numberOfPoints; i++) {
            const i3 = i * 3
            const x = (0.5 - Math.random()) * range
            const y = (0.5 - Math.random()) * range
            const z = (0.5 - Math.random()) * range
            this.positions[i3] = x
            this.positions[i3 + 1] = y
            this.positions[i3 + 2] = z
            this.oldPositions[i3] = x
            this.oldPositions[i3 + 1] = y
            this.oldPositions[i3 + 2] = z
        }
        this.particlesGeometry.attributes.position.needsUpdate = true
    }

    /**
     * 向某形状变换
     */
    to(array: ArrayLike<number>, duration: { min: number, max: number }) {

        for (let i = 0, realCount = 0; i < this.numberOfPoints; i++, realCount++) {
            //模型的点和生成的点数量未必相等 多的则重合前面的位置
            realCount = realCount % (array.length/3)
            const i3 = i * 3
            const r3 = realCount * 3
            //设置给顶点着色器
            //保存起点
            this.oldPositions[i3] = this.positions[i3]
            this.oldPositions[i3 + 1] = this.positions[i3 + 1]
            this.oldPositions[i3 + 2] = this.positions[i3 + 2]
            //设置终点
            this.toPositions[i3] = array[r3]
            this.toPositions[i3 + 1] = array[r3 + 1]
            this.toPositions[i3 + 2] = array[r3 + 2]
            //设置运动时间
            this.toPositionsDuration[i] = duration.min + Math.random() * (duration.max - duration.min)
        }

        this.particlesGeometry.attributes.position.needsUpdate = true
        this.particlesGeometry.attributes.toPositions.needsUpdate = true
        this.particlesGeometry.attributes.oldPositions.needsUpdate = true
        this.particlesGeometry.attributes.toPositionsDuration.needsUpdate = true
    }


    update(time: number) {
        this.particlesMaterial.uniforms.time.value = time
    }

}