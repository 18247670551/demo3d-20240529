import * as THREE from "three"
import Stats from "three/examples/jsm/libs/stats.module"


export default abstract class ThreeCore {

    protected readonly dom: HTMLElement
    protected readonly scene: THREE.Scene
    protected readonly camera: THREE.PerspectiveCamera | THREE.OrthographicCamera
    protected readonly renderer: THREE.WebGLRenderer

    protected readonly clock: THREE.Clock
    protected readonly options: ThreeBaseOptions

    protected readonly stats: Stats

    protected readonly textureLoader = new THREE.TextureLoader()

    // 要执行动画的对象集合
    private readonly myAnimates: Record<string, Function>

    protected constructor(dom: HTMLElement, options: ThreeBaseOptions) {

        this.dom = dom
        this.options = options

        this.scene = new THREE.Scene()
        this.clock = new THREE.Clock()
        this.myAnimates = {}

        const k = dom.clientWidth / dom.clientHeight

        if ("fov" in options.cameraOptions) {
            this.camera = new THREE.PerspectiveCamera(
                options.cameraOptions.fov,
                k,
                options.cameraOptions.near,
                options.cameraOptions.far,
            )
        } else {
            const s = options.cameraOptions.s
            this.camera = new THREE.OrthographicCamera(
                -s * k,
                s * k,
                s,
                -s,
                options.cameraOptions.near,
                options.cameraOptions.far,
            )
        }

        this.scene.add(this.camera)

        const rendererOptions = {
            antialias: true, //抗锯齿
            alpha: true,
            logarithmicDepthBuffer: true //深度缓冲, 解决模型重叠部分不停闪烁问题
        }

        const renderer = new THREE.WebGLRenderer(Object.assign({}, rendererOptions, options.rendererOptions))

        renderer.setSize(dom.clientWidth, dom.clientHeight)
        renderer.setPixelRatio(window.devicePixelRatio)
        //renderer.setClearColor(0xff0000, 1)


        // 颜色空间, 默认 THREE.SRGBColorSpace
        //renderer.outputColorSpace = THREE.SRGBColorSpace

        // 曝光值, 只有1和2两个值, 默认2
        //renderer.toneMapping = THREE.ReinhardToneMapping
        // 色调映射曝光度
        //renderer.toneMappingExposure = 1.25

        // 开启阴影
        //renderer.shadowMap.enabled = true
        // 阴影类型（处理运用Shadow Map产生的阴影锯齿）
        //renderer.shadowMap.type = THREE.PCFSoftShadowMap

        dom.appendChild(renderer.domElement)
        this.renderer = renderer

        this.stats = new Stats()
        dom.appendChild(this.stats.dom)

        window.addEventListener("resize", this.onResize, false)

        //利用 setTimeout 宏任务最后执行特性, 使js执行过程要等所有微任务和同步代码执行完再执行, 否则 this.init() 可能会在场景未搭建完毕就执行报错或没有生产对象
        setTimeout(() => {
            this.init()
            this.animate()
        }, 2000)
    }

    protected abstract init(): void

    protected onRenderer() {}

    protected onDestroy() {}



    private animate(){
        this.renderer.setAnimationLoop(() => {
            this.onRenderer()
            this.stats.update()

            // 执行动画
            const delta = this.clock.getDelta()
            for (const key in this.myAnimates) {
                this.myAnimates[key](delta)
            }

            this.renderer.render(this.scene, this.camera)
        })
    }

    protected addAnimate(name: string, func: Function) {
        this.myAnimates[name] = func
    }

    protected removeAnimate(name: string) {
        delete this.myAnimates[name]
    }

    private onResize = () => {
        const width = this.dom.clientWidth
        const height = this.dom.clientHeight

        const k = width / height

        // 更新相机
        if (this.camera instanceof THREE.PerspectiveCamera) {

            this.camera.aspect = k

        } else {

            const s = (this.options.cameraOptions as OrthographicCameraOptions).s

            this.camera.left = -s * k
            this.camera.right = s * k
            this.camera.top = s
            this.camera.bottom = -s
        }

        this.camera.updateProjectionMatrix()

        // 更新renderer
        this.renderer.setSize(width, height)
        this.renderer.setPixelRatio(window.devicePixelRatio)
    }

    destroyed() {
        // 需要手动移除掉 gui, 否则刷新页面时会出现多个gui
        document.querySelector(".dg.main.a")?.remove()

        window.removeEventListener("resize", this.onResize.bind(this))

        this.onDestroy()

        // 取消动画
        this.renderer.setAnimationLoop(null)

        this.renderer.renderLists.dispose()
        this.renderer.dispose()
        this.renderer.forceContextLoss()
        this.renderer.domElement.innerHTML = ""

        this.scene.clear()

        THREE.Cache.clear()
    }

}