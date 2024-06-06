import * as THREE from 'three'
import {printf} from "@/utils/myUtils"
import MyGroup from "@/three-widget/MyGroup"



/**
 * @param iconWidth?: number
 * @param iconHeight?: number
 * @param iconPath: string
 * @param space: string 文字和边框的间隔
 * @param textWidth?: number
 * @param textHeight?: number
 * @param fontSize?: number
 */
export interface SpriteRectTextOptions {
    backgroundColor?: string
    borderColor?: string
    borderWith?: number
    borderRadius?: number
    space?: number
    fontSize?: number
    fontColor?: string
}

export default class SpriteRectText extends MyGroup<SpriteRectTextOptions> {

    private readonly canvasTexture: THREE.CanvasTexture
    private readonly canvas: HTMLCanvasElement
    private readonly ctx: CanvasRenderingContext2D
    private readonly sprite: THREE.Sprite
    private readonly template: string

    constructor(name: string, template: string, value: string, options?: SpriteRectTextOptions) {
        const defaultOptions: Required<SpriteRectTextOptions> = {
            backgroundColor: "rgba(0, 0, 0, 0.8)",
            borderColor: "#559ea7",
            borderWith: 20,
            borderRadius: 50,
            space: 80,
            fontSize: 200,
            fontColor: "#ffc50d",
        }

        super(name, defaultOptions, options)
        this.canvas = document.createElement('canvas')
        this.ctx = this.canvas.getContext('2d')!

        const canvasTexture = new THREE.CanvasTexture(this.canvas)
        canvasTexture.needsUpdate = true
        this.canvasTexture = canvasTexture

        const material = new THREE.SpriteMaterial({
            map: canvasTexture,
            color: "#FFFFFF",
            transparent: true,
            opacity: 1,
        })

        this.sprite = new THREE.Sprite(material)
        this.template = template
        this.setValue(value)

        this.add(this.sprite)
    }

    setValue(value: string) {
        const {
            backgroundColor,
            borderWith,
            borderColor,
            space,
            fontSize,
            fontColor,
            borderRadius,
        } = this.options

        const canvas = this.canvas

        this.ctx.font = `bold ${fontSize}px 微软雅黑`

        this.sprite.material.map?.dispose()

        const text = printf(this.template, value)
        const textWidth = this.measureText(this.ctx, text)

        canvas.width = textWidth + borderWith * 2 + space * 2
        canvas.height = fontSize + borderWith * 2 + space * 2

        const startX = borderWith + space
        const startY = borderWith + space + fontSize * 0.1 //因为文字的基线实际并不是正中间, 是偏向上的, 加一个数值补偿一点上方空隙, 让其和下方空隙大约相等

        this.drawRoundRect(this.ctx, {
                borderWidth: borderWith,
                borderColor: borderColor,
                borderRadius: borderRadius,
                backgroundColor: backgroundColor,
                width: canvas.width,
                height: canvas.height,
            })

        this.drawText(this.ctx, text,{
            fontSize: fontSize,
            fontColor: fontColor,
            x: startX,
            y: startY,
        })

        this.sprite.material.map = this.canvasTexture
        this.canvasTexture.needsUpdate = true
        this.sprite.scale.set(canvas.width, canvas.height, 1)
    }

    private drawText(
        ctx: CanvasRenderingContext2D,
        text: string,
        options: {
            fontSize: number,
            fontColor: string,
            x: number,
            y: number,
        }
    ){
        const {fontSize, fontColor, x, y} = options
        ctx.font = `bold ${fontSize}px 微软雅黑`
        ctx.fillStyle = fontColor
        ctx.textBaseline = "top"
        ctx.fillText(text, x, y)
    }


    private measureText(ctx: CanvasRenderingContext2D, text: string) {
        return ctx.measureText(text).width
    }

    private drawRoundRect(
        ctx: CanvasRenderingContext2D,
        options: {
            borderWidth: number,
            borderColor: string,
            borderRadius: number
            backgroundColor: string,
            width: number,
            height: number,
        }
    ) {
        const x = options.borderWidth / 2
        const y = options.borderWidth / 2
        const w = options.width - options.borderWidth
        const h = options.height - options.borderWidth
        const r = options.borderRadius

        ctx.lineWidth = options.borderWidth
        ctx.strokeStyle = options.borderColor
        ctx.fillStyle = options.backgroundColor

        ctx.beginPath()
        ctx.moveTo(x + r, y)
        ctx.lineTo(x + w - r, y)
        ctx.quadraticCurveTo(x + w, y, x + w, y + r)
        ctx.lineTo(x + w, y + h - r)
        ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h)
        ctx.lineTo(x + r, y + h)
        ctx.quadraticCurveTo(x, y + h, x, y + h - r)
        ctx.lineTo(x, y + r)
        ctx.quadraticCurveTo(x, y, x + r, y)
        ctx.closePath()

        ctx.fill()
        ctx.stroke()
    }

}