import * as THREE from "three"
import MyGroup from "@/three-widget/MyGroup"
import {getTextureLoader} from "@/three-widget/loader/ThreeLoader"

/**
 * @param iconWidth?: number
 * @param iconHeight?: number
 * @param iconPath: string
 * @param space: string 文字和图标的间隔
 * @param textWidth?: number
 * @param textHeight?: number
 * @param textFontSize?: number
 */
export interface PlaneTextOptions {
    iconWidth?: number
    iconHeight?: number
    iconPath: string
    space?: number
    textWidth?: number
    textHeight?: number
    fontSize?: number
    fontColor?: string
}

export default class PlaneText extends MyGroup<PlaneTextOptions> {

    private readonly canvasTexture: THREE.CanvasTexture
    private readonly ctx: CanvasRenderingContext2D

    constructor(name: string, options?: PlaneTextOptions) {

        const defaultOptions: Required<PlaneTextOptions> = {
            iconWidth: 400,
            iconHeight: 400,
            iconPath: "",
            space: 20,
            textWidth: 1000,
            textHeight: 260,
            fontSize: 240,
            fontColor: "#ffc50d",
        }

        super(name, defaultOptions, options)

        const {iconWidth, iconHeight, textWidth, textHeight, fontSize, fontColor, space, iconPath} = this.options

        // 创建图标
        const iconGeometry = new THREE.PlaneGeometry(iconWidth, iconHeight)
        const iconTexture = getTextureLoader().load(iconPath)
        
        iconTexture.colorSpace = THREE.SRGBColorSpace
        const iconMaterial = new THREE.MeshBasicMaterial({
            map: iconTexture,
            opacity: 1.0,
            transparent: true,
        })

        const iconMesh = new THREE.Mesh(iconGeometry, iconMaterial)
        iconMesh.name = 'icon'
        this.add(iconMesh)

        // 创建文字
        // 文字区域大小 600*240, 文字大小 220px
        // 文字水平垂直居中,
        // 水平居中: this.ctx.textAlign = "center" 配合 .fillText() 参数x为textWidth的一半, 恰好文字居中
        // 垂直居中: 文字基线使用顶部对齐(this.ctx.textBaseline = "top"), 所以垂直居中顶部为0, .fillText() 参数y为0
        const canvas = document.createElement("canvas")
        canvas.width = textWidth
        canvas.height = textHeight
        this.ctx = canvas.getContext('2d')!
        this.ctx.fillStyle = fontColor
        this.ctx.font = `bold ${fontSize}px 微软雅黑`
        this.ctx.textBaseline = "top"
        this.ctx.textAlign = "center"
        this.ctx.fillText(" N/A ", textWidth/2, 0)

        const canvasTexture = new THREE.CanvasTexture(canvas)
        canvasTexture.needsUpdate = true
        this.canvasTexture = canvasTexture

        const valueMaterial = new THREE.MeshBasicMaterial({
            map: canvasTexture,
            opacity: 1.0,
            transparent: true,
        })

        const valueGeometry = new THREE.PlaneGeometry(textWidth, textHeight)
        let valueMesh = new THREE.Mesh(valueGeometry, valueMaterial)
        valueMesh.position.y = -(iconHeight + space)
        valueMesh.name = "value"
        this.add(valueMesh)
    }

    setValue(value: string) {
        const {textWidth, textHeight} = this.options

        this.ctx!.clearRect(0, 0, textWidth, textHeight)
        this.ctx!.fillText(value, textWidth/2, 0)
        this.canvasTexture.needsUpdate = true
    }

}