import * as THREE from "three"
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls"
import ThreeCore from "@/three-widget/ThreeCore"


//顶点着色器
//import vertexShader from './shader/vertex.glsl'
//片元着色器
//import fragmentShader from './shader/fragment.glsl'

// 注意: glsl文件在ts里不能像上面使用 import 导入, 语法错误, 把文件中内容以字符串读进来, 或者直接复制到ts文件中
const vertexShader = `
precision lowp float;
attribute float imgIndex;
varying float vImgIndex;
varying vec2 vUv;
uniform float uTime;
varying vec3 vColor;
void main(){
    vec4 modelPosition = modelMatrix * vec4(position,1.0);

    //获取顶点的角度
    float angle = atan(modelPosition.x,modelPosition.z);
    //获取顶点到中心的距离
    float distanceToCenter = length(modelPosition.xz);
    //根据顶点到中心的距离，设置旋转偏移的度数
    float angleOffset = 1.0 / distanceToCenter * uTime;
    //目前旋转的度数
    angle += angleOffset;
    modelPosition.x = cos(angle)*distanceToCenter;
    modelPosition.z = cos(angle)*distanceToCenter;

    vec4 viewPosition = viewMatrix * modelPosition;
    gl_Position = projectionMatrix * viewPosition;


    //1.设置点大小
    // gl_PointSize = 80.0;
    //根据viewPosition的z坐标决定是否远离摄像机
    gl_PointSize = 100.0 /-viewPosition.z;
    vImgIndex = imgIndex;
    vColor = color;
}
`

const fragmentShader = `
precision lowp float;
varying vec2 vUv;
//5.纹理
uniform sampler2D uTexture;
uniform sampler2D uTexture1;
uniform sampler2D uTexture2;

varying float vImgIndex;
varying vec3 vColor;

void main(){
   //2.vUv不能用，用gl_PointCoord
   // gl_FragColor = vec4(gl_PointCoord,0.0,1.0);

   //3.渐变圆
   // float strength = distance(gl_PointCoord,vec2(0.5));
   // strength *= 2.0;
   // strength = 1.0 - strength;
   // gl_FragColor = vec4(strength);

   //4.圆形点
   // float strength = 1.0 - distance(gl_PointCoord,vec2(0.5));
   // strength = step(0.5,strength);
   // gl_FragColor = vec4(strength);

   //5.根据纹理设置图案
   // vec4 textureColor = texture2D(uTexture,gl_PointCoord);
   // gl_FragColor = vec4(textureColor);

   //6.根据点的位置设置渐变
   // vec4 textureColor = texture2D(uTexture,gl_PointCoord);
   // gl_FragColor = vec4(gl_PointCoord,1.0,textureColor.r);

   //7.根据index判断使用哪个texture
   vec4 textureColor;
   if(vImgIndex==0.0){
      textureColor = texture2D(uTexture,gl_PointCoord);
   }else if(vImgIndex==1.0){
      textureColor = texture2D(uTexture1,gl_PointCoord);
   }else{
      textureColor = texture2D(uTexture2,gl_PointCoord);
   }
   gl_FragColor = vec4(vColor,textureColor.r);
}
`

export default class ThreeProject extends ThreeCore {

    private readonly orbit: OrbitControls
    private readonly material: THREE.ShaderMaterial

    constructor(dom: HTMLElement) {

        super(dom, {
            cameraOptions: {
                fov: 75,
                near: 0.1,
                far: 1000
            }
        })

        this.scene.background = new THREE.Color(0x000000)

        this.camera.position.set(0, 0, 10)

        const ambientLight = new THREE.AmbientLight(0xffffff, 4)
        this.scene.add(ambientLight)

        this.orbit = new OrbitControls(this.camera, this.renderer.domElement)

        this.material = this.addPointsAndGetMaterial()
    }

    protected init() {

    }

    protected onRenderer() {
        const time = this.clock.getElapsedTime()
        this.orbit.update()

        this.material.uniforms.uTime.value = time
    }

    private addPointsAndGetMaterial() {

        const params = {
            count: 10000,
            size: 0.3,
            radius: 10,
            branch: 4,
            color: '#ff6030',
            rotateScale: 0.3,
            endColor: '#1b3984'
        }

        const textureLoader = new THREE.TextureLoader()
        const texture = textureLoader.load('/demo/points4/1.png')
        const texture1 = textureLoader.load('/demo/points4/2.png')
        const texture2 = textureLoader.load('/demo/points4/3.png')

        const geometry = new THREE.BufferGeometry()

        const positions = new Float32Array(params.count * 3)
        const colors = new Float32Array(params.count * 3)
        const imgIndex = new Float32Array(params.count)

        const centerColor = new THREE.Color(params.color)
        const endColor = new THREE.Color(params.endColor)

        for (let i = 0; i < params.count; i++) {
            //当前的点应该在哪一条分支的角度上
            const branchAngel = (i % params.branch) * ((2 * Math.PI) / params.branch)
            //当前点距离圆心的距离
            const distance = Math.random() * params.radius * Math.pow(Math.random(), 3)
            const current = i * 3
            const randomX = Math.pow(Math.random() * 2 - 1, 3) * (params.radius - distance) / 5
            const randomY = Math.pow(Math.random() * 2 - 1, 3) * (params.radius - distance) / 5
            const randomZ = Math.pow(Math.random() * 2 - 1, 3) * (params.radius - distance) / 5

            //全在x轴上
            positions[current] = Math.cos(branchAngel + distance * params.rotateScale) * distance + randomX
            positions[current + 1] = 0 + randomY
            positions[current + 2] = Math.sin(branchAngel + distance * params.rotateScale) * distance + randomZ
            //混合颜色，形成渐变:lerp()
            const mixColor = centerColor.clone()
            mixColor.lerp(endColor, distance / params.radius)
            colors[current] = mixColor.r
            colors[current + 1] = mixColor.g
            colors[current + 2] = mixColor.b

            //根据索引值设置不同的图案
            imgIndex[current] = current % 3
        }
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
        geometry.setAttribute('imgIndex', new THREE.BufferAttribute(imgIndex, 1))

        //设置点材质
        const material = new THREE.ShaderMaterial({
            vertexShader: vertexShader,
            fragmentShader: fragmentShader,
            transparent: true,
            vertexColors: true,
            //集中的地方更加亮
            blending: THREE.AdditiveBlending,
            //解决外面的挡住里面的
            depthWrite: false,
            uniforms: {
                uTexture: {
                    value: texture
                },
                uTexture1: {
                    value: texture1
                },
                uTexture2: {
                    value: texture2
                },
                uTime: {
                    value: 0
                },
                uColor: {
                    value: params.color
                }
            }
        })
        const points = new THREE.Points(geometry, material)

        this.scene.add(points)

        return material
    }

}
