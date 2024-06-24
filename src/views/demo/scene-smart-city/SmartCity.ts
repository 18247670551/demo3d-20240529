import * as THREE from "three"
import {getFbxLoader} from "@/three-widget/loader/ThreeLoader"
import Radar from "@/views/demo/scene-smart-city/Radar"
import LightWall from "@/views/demo/scene-smart-city/LightWall"
import FlyLine from "@/views/demo/scene-smart-city/FlyLine"
import buildoutline_vertexShader from "./shader/buildoutline/vertexShader.glsl"
import buildoutline_fragmentShader from "./shader/buildoutline/fragmentShader.glsl"


const radarData = [
    {
        position: {x: 666, y: 1, z: 0},
        radius: 150,
        color: '#ff0062',
        opacity: 0.5,
        speed: 2
    },
    {
        position: {x: -666, y: 1, z: 202},
        radius: 320,
        color: '#efad35',
        opacity: 0.6,
        speed: 1
    }
]

const lightWallData = [
    {
        position: {x: -150, y: 15, z: 100},
        speed: 0.5,
        color: '#efad35',
        opacity: 0.6,
        radius: 420,
        height: 120,
        renderOrder: 5
    },
]
const flyLineData = [
    {
        source: {x: -150, y: 15, z: 100},
        target: {x: -666, y: 25, z: 202},
        range: 120,
        height: 100,
        color: '#efad35',
        speed: 1,
        size: 30
    },
    {
        source: {x: -150, y: 15, z: 100},
        target: {x: 666, y: 22, z: 0},
        height: 300,
        range: 150,
        color: '#ff0000',
        speed: 1,
        size: 40
    }
]

export default class SmartCity extends THREE.Group {

    private isStart = false

    private readonly StartTime = {
        value: 0
    }

    private readonly time = {
        value: 0
    }

    constructor() {

        super()

        // 需要做城市效果的mesh
        const cityArray = ['CITY_UNTRIANGULATED']
        const floorArray = ['LANDMASS']

        getFbxLoader().load("public/demo/scene-smart-city/shanghai.FBX", model => {

            console.log("model = ", model)

            this.add(model)

            model.traverse((child: any) => {
                
                console.log("child = ", child)
                
                // 城市效果
                if (cityArray.includes(child.name)) {
                    // 建筑
                    this.setCityMaterial(child)
                    // 添加包围线条效
                    this.surroundLine(child)
                }
                if (floorArray.includes(child.name)) {
                    this.forMaterial(child.material, mat => {
                        // @ts-ignore
                        mat.color.setStyle("#040912")
                    })
                }
            })
        })


        setTimeout(() => {
            this.isStart = true
            // 加载扫描效果
            radarData.forEach((data) => {
                const radar = new Radar(data)
                // @ts-ignore
                radar.material.uniforms.time = this.time
                radar.position.copy(data.position)
                this.add(radar)
            })
            // 光墙
            lightWallData.forEach((data) => {
                const lightWall = new LightWall(data)
                // @ts-ignore
                lightWall.material.uniforms.time = this.time
                lightWall.position.copy(data.position)
                this.add(lightWall)
            })
            // 飞线
            flyLineData.forEach((data) => {
                const flyLine = new FlyLine(data)
                // @ts-ignore
                flyLine.material.uniforms.time = this.time
                flyLine.renderOrder = 10
                this.add(flyLine)
            })
        }, 1000)


    }


    private createSurroundLineMaterial(min: THREE.Vector3, max: THREE.Vector3) {

        return new THREE.ShaderMaterial({
            transparent: true,
            uniforms: {
                uColor: {
                    value: new THREE.Color("#ffffff")
                },
                uActive: {
                    value: new THREE.Color("#ff0000")
                },
                time: this.time,
                uOpacity: {
                    value: 0.6
                },
                uMin: {
                    value: min,
                },
                uMax: {
                    value: max,
                },
                uRange: {
                    value: 200
                },
                uSpeed: {
                    value: 0.2
                },
                uStartTime: this.StartTime
            },
            vertexShader: buildoutline_vertexShader,
            fragmentShader: buildoutline_fragmentShader
        })
    }


    /**
     * 获取包围线条效果
     */
    private surroundLine(object: THREE.Mesh) {
        // 地图上的 mesh 的线框
        const geometry = new THREE.EdgesGeometry(object.geometry)

        const worldPosition = new THREE.Vector3()

        object.getWorldPosition(worldPosition)

        const {min, max} = object.geometry.boundingBox!

        const material =  this.createSurroundLineMaterial(min, max)

        const line = new THREE.LineSegments(geometry, material)

        line.name = 'surroundLine'

        line.scale.copy(object.scale)
        line.rotation.copy(object.rotation)
        line.position.copy(worldPosition)

        this.add(line)
    }


    private forMaterial(material: THREE.Material | THREE.Material[], callback: (mat: THREE.Material) => void) {
        if (Array.isArray(material)) {
            material.forEach(mat => callback(mat))
        } else {
            callback(material)
        }
    }


    private setCityMaterial(mesh: THREE.Mesh) {

        mesh.geometry.computeBoundingBox()
        mesh.geometry.computeBoundingSphere()

        const geometry = mesh.geometry

        const {center, radius} = geometry.boundingSphere!
        const {min, max} = geometry.boundingBox!

        const size = new THREE.Vector3(
            max.x - min.x,
            max.y - min.y,
            max.z - min.z
        )

        this.forMaterial(mesh.material, mat => {
            // mat.opacity = 0.6
            //mat.transparent = true
            // @ts-ignore
            mat.color.setStyle("#1B3045")
            // 在编译shader程序之前立即执行的可选回调。此函数使用shader源码作为参数。用于修改内置材质。
            mat.onBeforeCompile = (shader) => {
                shader.uniforms.time = this.time
                shader.uniforms.uStartTime = this.StartTime

                // 中心点
                shader.uniforms.uCenter = {
                    value: center
                }

                // geometry大小
                shader.uniforms.uSize = {
                    value: size
                }

                shader.uniforms.uMin = {
                    value: min
                }

                shader.uniforms.uMax = {
                    value: max
                }

                shader.uniforms.uTopColor = {
                    value: new THREE.Color('#00FF00')
                }

                // 效果开关
                shader.uniforms.uSwitch = {
                    value: new THREE.Vector3(
                        0, // 扩散
                        0, // 左右横扫
                        0 // 向上扫描
                    )
                }
                // 扩散
                shader.uniforms.uDiffusion = {
                    value: new THREE.Vector3(
                        1, // 0 1开关
                        20, // 范围
                        600 // 速度
                    )
                }
                // 扩散中心点
                shader.uniforms.uDiffusionCenter = {
                    value: new THREE.Vector3(
                        0,
                        0,
                        0
                    )
                }

                // 扩散中心点
                shader.uniforms.uFlow = {
                    value: new THREE.Vector3(
                        1, // 0 1开关
                        10, // 范围
                        60 // 速度
                    )
                }

                // 效果颜色
                shader.uniforms.uColor = {
                    value: new THREE.Color("#5588aa")
                }
                // 效果颜色
                shader.uniforms.uFlowColor = {
                    value: new THREE.Color("#BF3EFF")
                }

                // 效果透明度
                shader.uniforms.uOpacity = {
                    value: 1
                }

                // 效果透明度
                shader.uniforms.uRadius = {
                    value: radius
                }

                const vertex= `
                    varying vec4 vPositionMatrix;
                    varying vec3 vPosition;
                    uniform float uStartTime;
                    void main() {
                    vPositionMatrix = projectionMatrix * vec4(position, 1.0);
                    vPosition = position;
                `
                const vertexPosition = `
                    vec3 transformed = vec3(position.x, position.y, position.z * uStartTime);
                `

                shader.vertexShader = shader.vertexShader.replace("void main() {", vertex)
                shader.vertexShader = shader.vertexShader.replace("#include <begin_vertex>", vertexPosition)


                const fragment = `
                    float distanceTo(vec2 src, vec2 dst) {
                        float dx = src.x - dst.x;
                        float dy = src.y - dst.y;
                        float dv = dx * dx + dy * dy;
                        return sqrt(dv);
                    }
                
                    float lerp(float x, float y, float t) {
                        return (1.0 - t) * x + t * y;
                    }
                
                    vec3 getGradientColor(vec3 color1, vec3 color2, float index) {
                        float r = lerp(color1.r, color2.r, index);
                        float g = lerp(color1.g, color2.g, index);
                        float b = lerp(color1.b, color2.b, index);
                        return vec3(r, g, b);
                    }
                
                    varying vec4 vPositionMatrix;
                    varying vec3 vPosition;
                
                    uniform float time;
                    // 扩散参数
                    uniform float uRadius;
                    uniform float uOpacity;
                    // 初始动画参数
                    uniform float uStartTime; 
                
                    uniform vec3 uMin;
                    uniform vec3 uMax;
                    uniform vec3 uSize;
                    uniform vec3 uFlow;
                    uniform vec3 uColor;
                    uniform vec3 uCenter;
                    uniform vec3 uSwitch;
                    uniform vec3 uTopColor;
                    uniform vec3 uFlowColor;
                    uniform vec3 uDiffusion; 
                    uniform vec3 uDiffusionCenter;
                
                    void main() {
                `
                const fragmentColor = `
                    vec3 distColor = outgoingLight;
                    float dstOpacity = diffuseColor.a;
                    
                    float indexMix = vPosition.z / (uSize.z * 0.6);
                    distColor = mix(distColor, uTopColor, indexMix);
                    
                    // 开启扩散波
                    vec2 position2D = vec2(vPosition.x, vPosition.y);
                    if (uDiffusion.x > 0.5) {
                        // 扩散速度
                        float dTime = mod(time * uDiffusion.z, uRadius * 2.0);
                        // 当前的离中心点距离
                        float uLen = distanceTo(position2D, vec2(uCenter.x, uCenter.z));
                
                        // 扩散范围
                        if (uLen < dTime && uLen > dTime - uDiffusion.y) {
                            // 颜色渐变
                            float dIndex = sin((dTime - uLen) / uDiffusion.y * PI);
                            distColor = mix(uColor, distColor, 1.0 - dIndex);
                        }
                    }
                
                    // 流动效果
                    if (uFlow.x > 0.5) {
                        // 扩散速度
                        float dTime = mod(time * uFlow.z, uSize.z); 
                        // 流动范围
                        float topY = vPosition.z + uFlow.y;
                        if (dTime > vPosition.z && dTime < topY) {
                            // 颜色渐变 
                            float dIndex = sin((topY - dTime) / uFlow.y * PI);
                
                            distColor = mix(distColor, uFlowColor,  dIndex); 
                        }
                    }

                    gl_FragColor = vec4(distColor, dstOpacity * uStartTime);
                `
                shader.fragmentShader = shader.fragmentShader.replace("void main() {", fragment)
                shader.fragmentShader = shader.fragmentShader.replace("gl_FragColor = vec4( outgoingLight, diffuseColor.a );", fragmentColor)
            }
        })
    }


    animate = (dt: number) => {
        if (dt > 1) return false

        this.time.value += dt

        // 启动
        if (this.isStart) {
            this.StartTime.value += dt * 0.5
            if (this.StartTime.value >= 1) {
                this.StartTime.value = 1
                this.isStart = false
            }
        }
    }


}