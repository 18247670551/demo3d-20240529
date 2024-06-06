export {}

declare global {

    /**
     * 相机公共参数
     */
    interface CameraOptions {
        near: number // 推荐值 0.1
        far: number // 推荐默认值 1000
    }


    interface PerspectiveCameraOptions extends CameraOptions {
        /** 透视相机专用参数, 人的视场大约是180度, 一般游戏的视场为60度到90度, 推荐默认值45 */
        fov: number
    }


    interface OrthographicCameraOptions extends CameraOptions {
        /** 正交相机专用参数, 控制left, right, top, bottom范围大小, 数越大,显示范围越大 */
        s: number
    }

    /** 轨道控制器参数 */
    interface ControlsOptions {
        enableDamping?: boolean //阻尼(是否有惯性)
        dampingFactor?: number //动态阻尼系数(鼠标拖拽旋转灵敏度)
        enableZoom?: boolean //缩放
        autoRotate?: boolean //自动旋转
        minDistance?: number //设置相机距离原点的最近距离
        maxDistance?: number //设置相机距离原点的最远距离
        enablePan?: boolean //开启右键拖拽
        maxPolarAngle?: number //最大角度
    }

    interface RendererOptions {
        antialias: true, //抗锯齿
        alpha: true,
        logarithmicDepthBuffer: true //深度缓冲, 解决模型重叠部分不停闪烁问题
    }

    interface ThreeBaseOptions {
        cameraOptions: PerspectiveCameraOptions | OrthographicCameraOptions,
        controlsOptions?: ControlsOptions
        rendererOptions?: RendererOptions
    }


}