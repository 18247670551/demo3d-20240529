import * as THREE from "three"
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls"
import ThreeCore from "@/three-widget/ThreeCore"
import point1Pic from "./texture/point1.png"
import point2Pic from "./texture/point2.png"
import point3Pic from "./texture/point3.png"
import point4Pic from "./texture/point4.png"
import magicPic from "./texture/magic.png"
import guangyunPic from "./texture/guangyun.png"


export default class ThreeProject extends ThreeCore {

    private readonly orbit: OrbitControls
    private readonly circles: THREE.Mesh[] = []
    private readonly particles: THREE.Points[] = []
    private readonly arounds: THREE.Mesh[] = []
    private readonly arounds2: THREE.Mesh[] = []

    private readonly circleRotateSpeed = 0.02
    private readonly aroundRotateSpeed = 0.01
    private readonly pointFloatSpeed = 0.01
    private readonly height = 2

    constructor(dom: HTMLElement) {

        super(dom, {
            cameraOptions: {
                fov: 45,
                near: 0.001,
                far: 100
            }
        })

        this.camera.position.set(0, 2, 4)
        this.scene.background = new THREE.Color(0x000000)

        const ambientLight = new THREE.AmbientLight(0xffffff, 1)
        this.scene.add(ambientLight)

        const directionalLight = new THREE.DirectionalLight(0xffffff, 2)
        directionalLight.position.set(60, 30, -30)
        directionalLight.castShadow = true
        this.scene.add(directionalLight)

        const directionalLight2 = new THREE.DirectionalLight(0xffffff, 4)
        directionalLight2.position.set(60, 30, 30)
        directionalLight2.castShadow = true
        this.scene.add(directionalLight2)

        this.renderer.shadowMap.enabled = true

        this.orbit = new OrbitControls(this.camera, this.renderer.domElement)
        this.orbit.minDistance = 0.001
        this.orbit.target.y = 1

        const axes = new THREE.AxesHelper(10)
        this.scene.add(axes)


        const segment = 32
        const circleRadius = 1
        const aroundRadius = 0.5
        const aroundScaleOffset = 0.01
        const height = 2
        const pointRangeRadius = 0.8
        const pointMinSize = 0.04
        const pointMaxSize = 0.15


        const point1Texture = this.textureLoader.load(point1Pic)
        const point2Texture = this.textureLoader.load(point2Pic)
        const point3Texture = this.textureLoader.load(point3Pic)
        const point4Texture = this.textureLoader.load(point4Pic)
        const magicTexture = this.textureLoader.load(magicPic)
        const guangyunTexture = this.textureLoader.load(guangyunPic)

        const pointTextures = [
            point1Texture,
            point2Texture,
            point3Texture,
            point4Texture,
        ]


        const group = new THREE.Group()


        const circleGeo = new THREE.CircleGeometry(circleRadius, segment)
        const circleMat = new THREE.MeshBasicMaterial({
            map: magicTexture,
            transparent: true,
            side: THREE.DoubleSide,
            depthWrite: false
        })
        const circle = new THREE.Mesh(circleGeo, circleMat)
        circle.rotateX(-Math.PI / 2)
        this.circles.push(circle)
        group.add(circle)

        const aroundGeo = this.getCylinderGeo(aroundRadius, height)
        const aroundMat = new THREE.MeshBasicMaterial({
            map: guangyunTexture,
            transparent: true,
            side: THREE.DoubleSide,
            wireframe: false,
            depthWrite: false
        })
        const around = new THREE.Mesh(aroundGeo, aroundMat)
        this.arounds.push(around)
        group.add(around)

        const around2 = around.clone()
        around2.userData.aroundScaleOffset = aroundScaleOffset
        around2.userData._type = around2._type
        group.add(around2)
        this.arounds2.push(around2)


        for (let j = 0; j < 10; j++) {
            for (let i = 0; i < pointTextures.length; i++) {
                const sprite = this.getPoints(pointRangeRadius, height, pointTextures[i], pointMinSize, pointMaxSize, this.pointFloatSpeed)
                this.particles.push(sprite)
                group.add(sprite)
            }
        }

        this.scene.add(group)


    }

    /**
     * 获取点云效果
     */
    private getPoints(radius: number, height: number, texture: THREE.Texture, pointMinSize: number, pointMaxSize: number, pointFloatSpeed: number) {
        const geometry = new THREE.BufferGeometry()
        const vertices = [0, 0, 0]

        geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3))

        const material = new THREE.PointsMaterial({
            size: Math.random() * (pointMaxSize - pointMinSize) + pointMinSize,
            map: texture,
            blending: THREE.AdditiveBlending,
            depthTest: false,
            transparent: true,
            opacity: 0.2 + Math.random() * 0.8
        })

        const particle = new THREE.Points(geometry, material)
        particle.userData.floatSpeed = 0.001 + Math.random() * pointFloatSpeed
        particle.userData.radius = radius
        particle.position.x = Math.random() * radius * 2 - radius
        particle.position.y = Math.random() * height
        particle.position.z = Math.random() * radius * 2 - radius
        return particle
    }

    /**
     * 获取圆柱几何体
     * @param {*} radius 半径
     * @param {*} height 高度
     * @param {*} segment 分段数
     */
    private getCylinderGeo(radius = 1, height = 1, segment = 32) {
        let bottomPos = []
        const topPos = []
        let bottomUvs = []
        const topUvs = []
        const angleOffset = (Math.PI * 2) / segment
        const uvOffset = 1 / (segment - 1)
        for (let i = 0; i < segment; i++) {
            const x = Math.cos(angleOffset * i) * radius
            const z = Math.sin(angleOffset * i) * radius
            bottomPos.push(x, 0, z)
            bottomUvs.push(i * uvOffset, 0)
            topPos.push(x, height, z)
            topUvs.push(i * uvOffset, 1)
        }
        bottomPos = bottomPos.concat(topPos)
        bottomUvs = bottomUvs.concat(topUvs)

        const face = []

        for (let i = 0; i < segment; i++) {
            if (i != segment - 1) {
                face.push(i + segment + 1, i, i + segment)
                face.push(i, i + segment + 1, i + 1)
            } else {
                face.push(segment, i, i + segment)
                face.push(i, segment, 0)
            }
        }

        const geo = new THREE.BufferGeometry()
        geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(bottomPos), 3))
        geo.setAttribute('uv', new THREE.BufferAttribute(new Float32Array(bottomUvs), 2))
        geo.setIndex(new THREE.BufferAttribute(new Uint16Array(face), 1))
        return geo
    }


    protected init() {
    }


    protected onRenderer() {
        this.orbit.update()
        this.updateCircles()
        this.updateAround()
        this.updatePartical()
    }


    /**
     * 更新传送阵底部的圆
     */
    private updateCircles() {
        for (let i = 0; i < this.circles.length; i++) {
            this.circles[i].rotateZ(this.circleRotateSpeed)
        }
    }

    /**
     * 更新传送阵四周的光壁
     */
    private updateAround() {
        for (let i = 0; i < this.arounds.length; i++) {
            this.arounds[i].rotateY(this.aroundRotateSpeed)
        }
        for (let i = 0; i < this.arounds2.length; i++) {
            this.arounds2[i].rotateY(-this.aroundRotateSpeed)
            if (this.arounds2[i].scale.x < 0.9 || this.arounds2[i].scale.x > 1.4) {
                this.arounds2[i].userData.aroundScaleOffset *= -1
            }
            this.arounds2[i].scale.x -= this.arounds2[i].userData.aroundScaleOffset
            this.arounds2[i].scale.z -= this.arounds2[i].userData.aroundScaleOffset
        }
    }

    /**
     * 更新光点效果
     */
    private updatePartical() {
        for (let i = 0; i < this.particles.length; i++) {
            this.particles[i].position.y += this.particles[i].userData.floatSpeed
            if (this.particles[i].position.y >= this.height) {
                //更新位置，y=0，x，z随机
                this.particles[i].position.y = 0
                this.particles[i].position.x =
                    Math.random() * this.particles[i].userData.radius * 2 - this.particles[i].userData.radius
                this.particles[i].position.z =
                    Math.random() * this.particles[i].userData.radius * 2 - this.particles[i].userData.radius

                //随机上升速度
                this.particles[i].userData.floatSpeed = 0.001 + Math.random() * this.pointFloatSpeed
            }
        }
    }

}