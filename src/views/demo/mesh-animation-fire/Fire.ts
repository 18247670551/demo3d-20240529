import * as THREE from "three"
import {getTextureLoader} from "@/three-widget/loader/ThreeLoader"

/**
 * 宽高比建议 1 : 106
 * width: number,
 * height: number,
 * speed?: number, 关键帧动画切换速度, 默认 0.1
 */
interface FireOptions{
    width: number,
    height: number,
    speed?: number,
}

export default class Fire extends THREE.Group{

    private options: Required<FireOptions>

    // 调节火焰纹理切换速度
    private t = 0
    private num: number = 15
    private texture: THREE.Texture

    constructor(options?: FireOptions) {

        super()

        const defaultOptions: Required<FireOptions> = {
            width: 20,
            height: 32,
            speed: 0.1,
        }

        this.options = Object.assign({}, defaultOptions, options)

        const w: number = this.options.width
        const h: number = this.options.height

        const geometry = new THREE.PlaneGeometry(w, h)
        geometry.translate(0, h / 2, 0)

        const texture = getTextureLoader().load('/demo/mesh-animation-fire/fire.png')
        // 设置纹理重复次数
        texture.repeat.set(1 / this.num, 1)
        this.texture = texture

        const material = new THREE.MeshBasicMaterial({
            map: texture,
            transparent: true,
            opacity: 0.4,
            side: THREE.DoubleSide,
            depthWrite: false
        })

        const mesh = new THREE.Mesh(geometry, material)

        // 四个火焰mesh交叉叠加
        this.add(
            mesh,
            mesh.clone().rotateY(Math.PI / 2),
            mesh.clone().rotateY(Math.PI / 4),
            mesh.clone().rotateY(Math.PI / 4 * 3)
        )
    }

    // 关键帧动画
    update = () => {
        this.t += this.options.speed
        if (this.t > this.num){
            this.t = 0
        }
        // Math.floor(t)取整 保证一帧一帧切换
        this.texture.offset.x = Math.floor(this.t) / this.num
    }


}