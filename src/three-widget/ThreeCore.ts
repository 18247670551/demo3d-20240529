import * as THREE from "three"
import Stats from "three/examples/jsm/libs/stats.module"


export default abstract class ThreeCore {

    protected readonly dom: HTMLElement
    protected readonly scene: THREE.Scene
    protected camera: THREE.PerspectiveCamera | THREE.OrthographicCamera
    protected readonly defaultCamera: THREE.PerspectiveCamera | THREE.OrthographicCamera
    protected readonly renderer: THREE.WebGLRenderer

    protected readonly clock: THREE.Clock
    protected readonly options: ThreeBaseOptions

    protected readonly stats: Stats

    // 要执行动画的对象集合, 子类可以把自己的动画写进 onRender 也可以 this.addAnimate() 添加到父类动画集合里
    private readonly animates: Record<string, Function>

    protected constructor(dom: HTMLElement, options: ThreeBaseOptions) {

        this.dom = dom
        this.options = options

        this.scene = new THREE.Scene()
        this.clock = new THREE.Clock()
        this.animates = {}

        const k = dom.clientWidth / dom.clientHeight

        if ("fov" in options.cameraOptions) {
            this.defaultCamera = new THREE.PerspectiveCamera(
                options.cameraOptions.fov,
                k,
                options.cameraOptions.near,
                options.cameraOptions.far,
            )
        } else {
            const s = options.cameraOptions.s
            this.defaultCamera = new THREE.OrthographicCamera(
                -s * k,
                s * k,
                s,
                -s,
                options.cameraOptions.near,
                options.cameraOptions.far,
            )
        }

        this.camera = this.defaultCamera
        this.scene.add(this.camera)

        const rendererOptions = {
            // 抗锯齿
            antialias: true,
            alpha: true,
            // 深度缓冲, 解决模型重叠部分不停闪烁问题
            // 这个属性会导致精灵材质会被后面的物体遮挡(不知道什么原理),
            // 只能出现问题的时候, 在那个场景 new ThreeCore继承类的时候, 传入rendererOptions参数, 将此参数改为 false
            logarithmicDepthBuffer: true
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

    // 子类必须覆写
    protected abstract init(): void
    // 提供给子类覆写
    protected onRenderer() {}
    // 提供给子类覆写
    protected onDestroy() {}



    private animate(){
        this.renderer.setAnimationLoop(() => {
            this.onRenderer()
            this.stats.update()

            // 执行动画
            for (const key in this.animates) {
                this.animates[key](this.clock.getDelta())
            }

            this.renderer.render(this.scene, this.camera)
        })
    }

    protected addAnimate(name: string, func: Function) {
        this.animates[name] = func
    }

    protected removeAnimate(name: string) {
        delete this.animates[name]
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

        this.renderer.setAnimationLoop(null)
        this.renderer.renderLists.dispose()
        this.renderer.dispose()
        this.renderer.forceContextLoss()
        this.renderer.domElement.innerHTML = ""

        this.scene.clear()

        THREE.Cache.clear()
    }

}