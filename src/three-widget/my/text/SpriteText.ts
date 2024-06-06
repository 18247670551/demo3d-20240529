import * as THREE from "three"
import MyGroup from "@/three-widget/MyGroup";


/**
 * @param iconWidth?: number
 * @param iconHeight?: number
 * @param iconPath: string
 * @param space: string 文字和图标的间隔
 * @param textWidth?: number
 * @param textHeight?: number
 * @param textFontSize?: number
 */
export interface SpriteTextOptions {
    iconWidth?: number
    iconHeight?: number
    iconPath: string
    space?: number
    textWidth?: number
    textHeight?: number
    fontSize?: number
    fontColor?: string
    defaultText?: string
}

export default class SpriteText extends MyGroup<SpriteTextOptions> {

    private readonly canvasTexture: THREE.CanvasTexture
    private readonly ctx: CanvasRenderingContext2D

    constructor(name: string, options?: SpriteTextOptions) {

        const defaultOptions: Required<SpriteTextOptions> = {
            iconWidth: 400,
            iconHeight: 400,
            iconPath: "",
            space: 80,
            textWidth: 1000,
            textHeight: 260,
            fontSize: 240,
            fontColor: "#ffc50d",
            defaultText: " N/A ",
        }

        super(name, defaultOptions, options)

        const {
            iconWidth,
            iconHeight,
            textWidth,
            textHeight,
            fontSize,
            fontColor,
            space,
            iconPath,
            defaultText,
        } = this.options

        //宽度肯定是文字比图标宽, 总宽度以文字宽为准
        const width = textWidth
        const height = iconHeight + space + textHeight

        //icon的起始绘制x点 = (总宽度-图标宽度)/2
        const iconX = (width - iconWidth)/2

        const canvas = document.createElement("canvas")
        canvas.width = width
        canvas.height = height

        const canvasTexture = new THREE.CanvasTexture(canvas)
        canvasTexture.needsUpdate = true
        this.canvasTexture = canvasTexture

        this.ctx = canvas.getContext('2d')!
        const img = new Image()
        img.src = iconPath

        img.onload = () => {
            this.ctx.drawImage(img, iconX, 0, iconWidth, iconHeight)

            this.ctx.fillStyle = fontColor
            this.ctx.font = `bold ${fontSize}px 微软雅黑`
            this.ctx.textBaseline = "top"
            this.ctx.textAlign = "center"
            this.ctx.fillText(defaultText, width/2, iconHeight + space)

            const material = new THREE.SpriteMaterial({
                map: this.canvasTexture,
                transparent: true,
                opacity: 1,
            })

            const sprite = new THREE.Sprite(material)
            sprite.scale.set(width, height, 1)
            this.add(sprite)
        }
    }

    setValue(value: string) {
        const {iconHeight, textWidth, textHeight, space} = this.options

        this.ctx.clearRect(0, iconHeight + space, textWidth, textHeight)
        this.ctx.fillText(value, textWidth/2, iconHeight + space)
        this.canvasTexture.needsUpdate = true
    }

}
