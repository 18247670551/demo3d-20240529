import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'
import gsap from 'gsap'
//顶点着色器
import basicVertexShader from '../shader/basic/vertex.glsl'
//片元着色器
import basicFragmentShader from '../shader/basic/fragment.glsl'
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import FireWork from './firework'

//目标：孔明灯
const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 300)
camera.position.set(0, 0, 20)
scene.add(camera)

//1.创建纹理加载器对象——加载hdr环境图
const rgbeLoader = new RGBELoader()
rgbeLoader.loadAsync('./assets/2k.hdr').then(texture => {
    texture.mapping = THREE.EquirectangularReflectionMapping;
    scene.background = texture;
    scene.environment = texture
})

// 2.顶点着色器材质——注意要设置两面
var shaderMaterial = new THREE.ShaderMaterial({
    vertexShader: basicVertexShader,
    fragmentShader: basicFragmentShader,
    side: THREE.DoubleSide,
});

const renderer = new THREE.WebGLRenderer();
//3.色彩映射——在感知光强度方面均匀分布
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
// render.toneMapping = THREE.LinearToneMapping;
// render.toneMapping = THREE.ReinhardToneMapping;
// render.toneMapping = THREE.CineonToneMapping;
//4.控制天空的颜色——黑夜
renderer.toneMappingExposure = 0.05;

//5.加载孔明灯
const gltfLoader = new GLTFLoader()
let LightBox = null
gltfLoader.load('./assets/model/flyLight.glb', (gltf) => {
    //加载(0,0,0)的孔明灯
    // scene.add(gltf.scene)
    console.log(gltf);
    LightBox = gltf.scene.children[0];
    LightBox.material = shaderMaterial;

    for (let i = 0; i < 150; i++) {
        let flyLight = gltf.scene.clone(true)
        let x = (Math.random() - 0.5) * 300
        let z = (Math.random() - 0.5) * 300
        let y = Math.random() * 60 + 25
        flyLight.position.set(x, y, z)
        gsap.to(flyLight.rotation, {
            y: 2 * Math.PI,
            duration: 10 + Math.random() * 30,
            repeat: -1
        })
        gsap.to(flyLight.position, {
            x: "+=" + Math.random(),
            y: "+=" + Math.random() * 20,
            duration: 5 + Math.random() * 10,
            yoyo: true,
            repeat: -1
        })
        scene.add(flyLight)
    }
})
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

//轨道控制器
const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true
//6.设置轨道自动旋转
controls.autoRotate = true
controls.autoRotateSpeed = 0.1
// controls.maxPolarAngle = (Math.PI / 4) * 3
// controls.minPolarAngle = (Math.PI / 4) * 3

const axesHelper = new THREE.AxesHelper(5)
scene.add(axesHelper)

//管理烟花
let fireworks = []
function render() {
    //7.轨道改变的时候要update
    controls.update()

    fireworks.forEach(item=>{
        item.update()
    })

    renderer.render(scene, camera)
    requestAnimationFrame(render)
}
render()



//设置创建烟花函数
let createFireworks = ()=>{
    //hsl(颜色，饱和度，亮度)
    let color = `hsl(${Math.floor(Math.random()*360)},100%,80%)`
    let position = {
        x:(Math.random() -0.5)*40,
        z:-(Math.random() -0.5)*40,
        y:7 + Math.random() * 25
    }

    //随机生成颜色和烟花的位置
    let firework = new FireWork(color,position)
    firework.addScene(scene,camera)
    fireworks.push(firework)
};
//监听点击事件
window.addEventListener('click',createFireworks)