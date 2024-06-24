import gsap from 'gsap'
import * as THREE from 'three'
import {random} from "lodash"
import MyGroup from "@/three-widget/MyGroup"
import {getTextureLoader} from "@/three-widget/loader/ThreeLoader"

/**
 * @param dropScopeRadius 下落区域半径
 * @param dropDensity 下落密度(同时下落多少个)
 * @param dropSize 下落物体的尺寸(将随机大小为 0.5到2倍大小)
 * @param speed 下落物体的速度
 */
interface WaterFallOptions {
    maxDropHeight?: number
    dropScopeRadius?: number
    dropDensity?: number
    dropSize?: number
    speed?: number
}

export default class Rain extends MyGroup<WaterFallOptions> {

    static RainPoint = class extends THREE.Sprite {
        life = 100
        currentSpeed = 1
        size: number
        radius: number

        constructor(size: number, radius: number) {

            const texture = getTextureLoader().load('/demo/scene-ming/common/rain.png')
            
            texture.colorSpace = THREE.SRGBColorSpace

            const mat = new THREE.SpriteMaterial({
                map: texture,
                transparent: true,
                opacity: 0.7,
            })

            super(mat)
            this.renderOrder = 1

            this.size = size
            this.radius = radius

            this.init()
        }

        init() {
            this.visible = true
            this.currentSpeed = 0
            this.life = random(50, 100)
            const scaleSize = random(this.size/2, this.size*2)
            this.scale.set(scaleSize, scaleSize, scaleSize)
            const point = this.randomXY(this.radius)
            this.position.set(
                point[0],
                0,
                point[1],
            )
        }


        /**
         * 在二维圆内生成随机点
         * @param r
         */
        private randomXY(r: number) {
            const a = random(-360, 360)
            const radius = random(0,  r)
            const x = radius * Math.cos(a)
            const y = radius * Math.sin(a)
            return [x, y]
        }

    }

    private readonly drops: InstanceType<typeof Rain.RainPoint>[]

    private readonly dropAnimation: gsap.core.Tween

    constructor(name: string, options?: WaterFallOptions) {

        const defaultOptions: Required<WaterFallOptions> = {
            maxDropHeight: 6000,
            dropScopeRadius: 5000,
            dropDensity: 100,
            dropSize: 100,
            speed: 5,
        }

        super(name, defaultOptions, options)

        this.drops = []
        this.dropAnimation = this.createDropAnimation()
    }

    private createDropAnimation() {
        const settings = {
            progress: 0.01,
        }

        return gsap.to(settings, {
            progress: 1,
            duration: 10,
            repeat: -1,
            paused: true,
            onUpdate: () => {
                if (this.drops.length < this.options.dropDensity) {
                    const drop: InstanceType<typeof Rain.RainPoint> = new Rain.RainPoint(this.options.dropSize, this.options.dropScopeRadius)
                    this.drops.push(drop)
                    this.add(drop)
                }
                this.update()
            }
        })
    }


    private update() {
        this.drops.forEach(item => {
            if (item.life <= 0 || item.position.y < -this.options.maxDropHeight) {
                item.init()
            } else {
                item.currentSpeed += this.options.speed
                item.life--
                item.position.y -= item.currentSpeed
            }
        })
    }

    run(){
        this.dropAnimation.resume()
    }

    stop(){
        this.dropAnimation.pause()
        this.drops.forEach(item => {
            item.material.dispose()
            item.geometry.dispose()
            item.removeFromParent()
        })
        this.drops.length = 0
    }

}


