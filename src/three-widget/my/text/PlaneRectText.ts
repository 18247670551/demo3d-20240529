import * as THREE from "three"
import {printf} from "@/utils/myUtils"
import MyGroup from "@/three-widget/MyGroup";


/**
 * @param iconWidth?: number
 * @param iconHeight?: number
 * @param iconPath: string
 * @param space: string 文字和边框的间隔
 * @param textWidth?: number
 * @param textHeight?: number
 * @param fontSize?: number
 */
export interface PlaneRectTextOptions {
    backgroundColor?: string
    borderColor?: string
    borderWith?: number
    borderRadius?: number
    space?: number
    fontSize?: number
    fontColor?: string
    template?: string
    defaultValue?: string
}

export default class PlaneRectText extends MyGroup<PlaneRectTextOptions> {

    private readonly canvasTexture: THREE.CanvasTexture
    private readonly canvas: HTMLCanvasElement
    private readonly ctx: CanvasRenderingContext2D
    private readonly plane: THREE.Mesh

    constructor(name: string, options?: PlaneRectTextOptions) {
        const defaultOptions: Required<PlaneRectTextOptions> = {
            backgroundColor: "rgba(0, 0, 0, 0.8)",
            borderColor: "#559ea7",
            borderWith: 20,
            borderRadius: 50,
            space: 80,
            fontSize: 200,
            fontColor: "#ffc50d",
            template: "",
            defaultValue: " N/A ",
        }

        super(name, defaultOptions, options)

        const {borderWith, space, fontSize, template, defaultValue} = this.options

        this.canvas = document.createElement('canvas')
        const ctx = this.canvas.getContext('2d')!
        ctx.font = `bold ${fontSize}px 微软雅黑`
        this.ctx = ctx

        const canvasTexture = new THREE.CanvasTexture(this.canvas)
        canvasTexture.needsUpdate = true
        canvasTexture.wrapS = canvasTexture.wrapT = THREE.RepeatWrapping
        canvasTexture.repeat.set(1, 1)

        this.canvasTexture = canvasTexture

        const textWidth = ctx.measureText(template).width

        const planWidth = textWidth + borderWith * 2 + space * 2
        const planHeight = fontSize + borderWith * 2 + space * 2

        const geo = new THREE.PlaneGeometry(planWidth, planHeight)
        geo.translate(planWidth /2, 0,0)

        const mat = new THREE.MeshBasicMaterial({
            map: canvasTexture,
            transparent: true,
            opacity: 1,
        })

        const plane = new THREE.Mesh(geo, mat)
        this.plane = plane
        this.add(plane)

        this.setValue(defaultValue)
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
            template,
        } = this.options

        const canvas = this.canvas
        this.ctx.font = `bold ${fontSize}px 微软雅黑`

        const mat = <THREE.MeshBasicMaterial>this.plane!.material

        mat.map!.dispose()

        const text = printf(template, value)
        const textWidth = this.measureText(this.ctx, text)

        canvas.width = textWidth + borderWith * 2 + space * 2
        canvas.height = fontSize + borderWith * 2 + space * 2

        const startX = space + borderWith
        const startY = space + borderWith + fontSize * 0.1

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

        mat.map = this.canvasTexture
        this.canvasTexture.needsUpdate = true
    }

    private measureText(ctx: CanvasRenderingContext2D, text: string) {
        return ctx.measureText(text).width
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