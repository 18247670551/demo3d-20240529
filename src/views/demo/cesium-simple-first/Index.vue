<template>
  <div id="cesiumContainer"/>
</template>

<script setup lang="ts">
import {onMounted, onUnmounted} from "vue"
import {cesiumDemo3dToken} from "@/plugins/cesium/token"
import * as Cesium from "cesium"

let viewer: Cesium.Viewer

onMounted(() => {
  initViewer()
})

const initViewer = () => {


  //viewer = new Cesium.Viewer("cesiumContainer", {})

  viewer = new Cesium.Viewer("cesiumContainer", {
    animation: true, //是否创建动画小器件，左下角仪表
    baseLayerPicker: false, //是否显示图层选择器
    fullscreenButton: true, //是否显示全屏按钮
    vrButton: true, // 用于切换 VR 模式的单个按钮小部件。
    geocoder: true, // //是否显示geocoder小器件，右上角查询按钮
    homeButton: true, //是否显示Home按钮
    infoBox: true, //是否显示信息框
    sceneModePicker: true, //是否显示3D/2D选择器
    selectionIndicator: true, //是否显示选取指示器组件
    timeline: true, //是否显示时间轴
    navigationHelpButton: true, //是否显示右上角的帮助按钮
    navigationInstructionsInitiallyVisible: true,
    scene3DOnly: false, //如果设置为true，则所有几何图形以3D模式绘制以节约GPU资源
    shouldAnimate: false, // 初始化是否开始动画
    clockViewModel: undefined, // 一个视图模型，它为用户界面提供 Clock
    selectedImageryProviderViewModel: undefined, // 当前图像图层的显示模型，仅 baseLayerPicker 设为 true 有意义
    selectedTerrainProviderViewModel: undefined, // 当前地形图层的显示模型，仅 baseLayerPicker 设为 true 有意义
    skyBox: new Cesium.SkyBox({
      sources: {
        positiveX: "/demo/cesium-simple-first/skyBox/00h+00.jpg",
        negativeX: "/demo/cesium-simple-first/skyBox/12h+00.jpg",
        positiveY: "/demo/cesium-simple-first/skyBox/06h+00.jpg",
        negativeY: "/demo/cesium-simple-first/skyBox/18h+00.jpg",
        positiveZ: "/demo/cesium-simple-first/skyBox/06h+90.jpg",
        negativeZ: "/demo/cesium-simple-first/skyBox/06h-90.jpg",
      },
    }), //用于渲染星空的SkyBox对象
    skyAtmosphere: new Cesium.SkyAtmosphere(), // 围绕提供的椭球体边缘绘制的大气
    fullscreenElement: document.body, //全屏时渲染的HTML元素,
    useDefaultRenderLoop: true, //如果需要控制渲染循环，则设为true
    targetFrameRate: undefined, //使用默认render loop时的帧率
    showRenderLoopErrors: false, //如果设为true，将在一个HTML面板中显示错误信息
    automaticallyTrackDataSourceClocks: false, //自动追踪最近添加的数据源的时钟设置
    contextOptions: {}, //传递给Scene对象的上下文参数（scene.options）
    sceneMode: Cesium.SceneMode.SCENE3D, //初始场景模式
    mapProjection: new Cesium.WebMercatorProjection(), //地图投影体系
    globe: undefined, // 在场景中渲染的地球仪，包括其地形 ( Globe#terrainProvider ) 和图像图层 ( Globe#imageryLayers )
    orderIndependentTranslucency: true,
    dataSources: new Cesium.DataSourceCollection(), //需要进行可视化的数据源的集合
    projectionPicker: undefined, // 用于在透视和正交投影之间切换的单按钮小部件
    // imageryProviderViewModels: Cesium.createDefaultImageryProviderViewModels(), //图层选择器,可供 BaseLayerPicker 选择的图像图层 ProviderViewModel 数组
    // terrainProviderViewModels: Cesium.createDefaultTerrainProviderViewModels(), //地形选择器,可供 BaseLayerPicker 选择的地形图层 ProviderViewModel 数组
    // imageryProvider: new Cesium.OpenStreetMapImageryProvider({
    //   credit: "",
    //   url: "Custom url",
    // }), //图像图层提供者，仅 baseLayerPicker 设为 false 有意义
    terrainProvider: new Cesium.EllipsoidTerrainProvider(), //地形图层提供者, 仅 baseLayerPicker 设为 false 有意义
  })

  // 去除版权信息
  // @ts-ignore
  viewer.cesiumWidget.creditContainer.style.display = "none"

  // 增加太阳光照
  viewer.scene.globe.enableLighting = true

  // 加载昼夜联动
  loadEarthAtNight()
}


const loadEarthAtNight = () => {

  viewer.clock.shouldAnimate = true
  viewer.scene.globe.enableLighting = true
  viewer.clock.multiplier = 4000 //时间轴速度

  const imageryLayers = viewer.imageryLayers

  const nightLayer = imageryLayers.get(0)
  nightLayer.dayAlpha = 1.0

  const dayLayer = imageryLayers.addImageryProvider(
      new Cesium.IonImageryProvider({
        accessToken: cesiumDemo3dToken,
        server: "demo3d",
      })
  )
  dayLayer.show = true

  imageryLayers.lowerToBottom(dayLayer)
}



onUnmounted(() => {

})

</script>

<style lang="scss" scoped>
#cesiumContainer {
  width: 100%;
  height: 100%;
}
</style>