import * as THREE from "three"
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls"
import ThreeCore from "@/three-widget/ThreeCore"
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader"
import {DRACOLoader} from "three/examples/jsm/loaders/DRACOLoader"
import grass_side from 'public/demo/case-cover/all-demo.png'
import {gsap} from "gsap"
import BonusParticles from "@/views/demo/demo-wolf-rabbit-失败/BonusParticles"
import Hero from "@/views/demo/demo-wolf-rabbit-失败/Hero"
import Carrot from "@/views/demo/demo-wolf-rabbit-失败/Carrot"
import Monster from "@/views/demo/demo-wolf-rabbit-失败/Monster"
import Hedgehog from "@/views/demo/demo-wolf-rabbit-失败/Hedgehog"

const fieldOfView = 50
const nearPlane = 1
const farPlane = 2000
let shadowLight
const delta = 0
const floorRadius = 200

let distance = 0
let level = 1
let levelInterval = 0
const levelUpdateFreq = 3000
let speed = 6
const initSpeed = 5
const maxSpeed = 48
const monsterPos = .65
const monsterPosTarget = .65
let floorRotation = 0
const collisionObstacle = 10
const collisionBonus = 20
const cameraPosGame = 160
const cameraPosGameOver = 260
const monsterAcceleration = 0.004
const malusClearColor = 0xb44b39
const malusClearAlpha = 0
const audio = new Audio('/demo/rabbit-game/Antonio-Vivaldi-Summer_01.mp3')
let fieldGameOver = 0

// Materials
const blackMat = new THREE.MeshPhongMaterial({
    color: 0x100707,
})

const brownMat = new THREE.MeshPhongMaterial({
    color: 0xb44b39,
    shininess: 0,
})

const greenMat = new THREE.MeshPhongMaterial({
    color: 0x7abf8e,
    shininess: 0,
})

const pinkMat = new THREE.MeshPhongMaterial({
    color: 0xdc5f45,//0xb43b29,//0xff5b49,
    shininess: 0,
})

const lightBrownMat = new THREE.MeshPhongMaterial({
    color: 0xe07a57,
})

const whiteMat = new THREE.MeshPhongMaterial({
    color: 0xa49789,
})
const skinMat = new THREE.MeshPhongMaterial({
    color: 0xff9ea5,
})

export default class ThreeProject extends ThreeCore {

    private readonly orbit: OrbitControls
    private delta = 0
    private gameStatus = "play"
    private runningCycle = 0
    private bonusParticles: BonusParticles
    private hero: Hero
    private floor: THREE.Group
    private carrot: Carrot
    private monster: Monster
    private hedgehog: Hedgehog
    private monsterPosTarget = 0
    private monsterPos = 0
    private fieldDistanceDom: HTMLElement
    private gameOverDom: HTMLElement

    constructor(dom: HTMLElement, fieldDistanceDom: HTMLElement, gameOverDom: HTMLElement) {

        super(dom, {
            cameraOptions: {
                fov: fieldOfView,
                near: nearPlane,
                far: farPlane
            }
        })

        this.fieldDistanceDom = fieldDistanceDom
        this.gameOverDom = gameOverDom

        this.scene.fog = new THREE.Fog(0xd6eae6, 160, 350)

        this.camera.position.set(0, 30, cameraPosGame)
        this.camera.lookAt(0, 30, 0)

        const ambientLight = new THREE.AmbientLight(0xffffff, 0.9)
        this.scene.add(ambientLight)

        const shadowLight = new THREE.DirectionalLight(0xffffff, 1)
        shadowLight.position.set(-30, 40, 20)
        shadowLight.castShadow = true
        shadowLight.shadow.camera.left = -400
        shadowLight.shadow.camera.right = 400
        shadowLight.shadow.camera.top = 400
        shadowLight.shadow.camera.bottom = -400
        shadowLight.shadow.camera.near = 1
        shadowLight.shadow.camera.far = 2000
        shadowLight.shadow.mapSize.width = shadowLight.shadow.mapSize.height = 2048
        this.scene.add(shadowLight)

        // const directionalLight2 = new THREE.DirectionalLight(0xffffff, 4)
        // directionalLight2.position.set(0, 1000, -2000)
        // this.scene.add(directionalLight2)

        this.renderer.setClearColor(malusClearColor, malusClearAlpha)

        this.orbit = new OrbitControls(this.camera, this.renderer.domElement)

        const axes = new THREE.AxesHelper(200)
        this.scene.add(axes)

        document.addEventListener('mousedown', this.handleMouseDown.bind(this), false)
        document.addEventListener('touchend', this.handleMouseDown.bind(this), false)



        this.floor = this.addAndGetFloor()
        this.carrot = this.addAndGetCarrot()
        this.carrot.position.y = 50

        this.monster = this.addAndGetMonster()
        this.hero = this.addAndGetHero()
        this.hedgehog = this.addAndGetHedgehog()
        this.bonusParticles = this.addAndGetBonusParticles()
    }

    protected init() {
        this.addTrees()
        setInterval(() => {
            this.hero.hang()
        }, 3000)
    }

    protected onRenderer() {
        this.orbit.update()
        this.delta = this.clock.getDelta()

        if (this.gameStatus == "play") {

            if (this.hero.status == "running") {
                this.hero.run(this.delta)
            }

            this.updateDistance()
            this.updateMonsterPosition()
            this.updateCarrotPosition()
            this.updateFloorRotation()

            this.updateObstaclePosition()
            this.checkCollision()
        }
    }

    private updateObstaclePosition() {
        if (this.hedgehog.status == "flying") return

        // TODO fix this,
        if (floorRotation + this.hedgehog.angle > 2.5) {
            this.hedgehog.angle = -floorRotation + Math.random() * .3
            this.hedgehog.body.rotation.y = Math.random() * Math.PI * 2
        }

        this.hedgehog.rotation.z = floorRotation + this.hedgehog.angle - Math.PI / 2
        this.hedgehog.position.y = -floorRadius + Math.sin(floorRotation + this.hedgehog.angle) * (floorRadius + 3)
        this.hedgehog.position.x = Math.cos(floorRotation + this.hedgehog.angle) * (floorRadius + 3)

    }

    private addAndGetHero() {
        const hero = new Hero()
        this.scene.add(hero)
        hero.rotation.y = Math.PI / 2
        hero.nod()
        return hero
    }

    private addAndGetHedgehog() {
        const hedgehog = new Hedgehog()
        hedgehog.body.rotation.y = -Math.PI / 2
        hedgehog.scale.set(1.1, 1.1, 1.1)
        hedgehog.position.y = floorRadius + 4
        hedgehog.nod()
        this.scene.add(hedgehog)
        return hedgehog
    }

    private addAndGetMonster() {
        const monster = new Monster()
        monster.position.z = 20
        //monster.mesh.scale.set(1.2,1.2,1.2)
        this.scene.add(monster)
        this.updateMonsterPosition()
        return monster
    }

    private updateCarrotPosition = () => {
        this.carrot.rotation.y += delta * 6
        this.carrot.rotation.z = Math.PI / 2 - (floorRotation + this.carrot.angle)
        this.carrot.position.y = -floorRadius + Math.sin(floorRotation + this.carrot.angle) * (floorRadius + 50)
        this.carrot.position.x = Math.cos(floorRotation + this.carrot.angle) * (floorRadius + 50)
    }

    private updateMonsterPosition = () => {
        console.log("this.monster = ", this.monster)
        this.monster.run(this.delta)
        this.monsterPosTarget -= delta * monsterAcceleration
        this.monsterPos += (monsterPosTarget - monsterPos) * delta
        if (monsterPos < .56) {
            this.gameOver()
        }

        const angle = Math.PI * monsterPos
        this.monster.position.y = -floorRadius + Math.sin(angle) * (floorRadius + 12)
        this.monster.position.x = Math.cos(angle) * (floorRadius + 15)
        this.monster.rotation.z = -Math.PI / 2 + angle
    }

    private updateFloorRotation = () => {
        floorRotation += delta * .03 * speed
        floorRotation = floorRotation % (Math.PI * 2)
        this.floor.rotation.z = floorRotation
    }

    private updateLevel = () => {
        if (speed >= maxSpeed) return
        level++
        speed += 2
    }

    private updateDistance = () => {
        distance += delta * speed
        this.fieldDistanceDom.innerHTML = Math.floor(distance / 2).toString()
    }

    private checkCollision = () => {
        const db = this.hero.position.clone().sub(this.carrot.position.clone())
        const dm = this.hero.position.clone().sub(this.hedgehog.position.clone())

        if (db.length() < collisionBonus) {
            this.getBonus()
        }

        if (dm.length() < collisionObstacle && this.hedgehog.status != "flying") {
            this.getMalus()
        }
    }


    private getMalus() {
        this.hedgehog.status = "flying"
        let tx = (Math.random() > .5) ? -20 - Math.random() * 10 : 20 + Math.random() * 5
        gsap.to(this.hedgehog.position, {
            x: tx,
            y: Math.random() * 50, z: 350,
            duration: 4,
            //ease:Power4.easeOut
        })
        gsap.to(this.hedgehog.rotation, {
            x: Math.PI * 3,
            y: Math.PI * 6,
            z: Math.PI * 3,
            duration: 4,
            ease: Power4.easeOut,
            onComplete: () => {
                this.hedgehog.status = "ready"
                this.hedgehog.body.rotation.y = Math.random() * Math.PI * 2
                this.hedgehog.angle = -floorRotation - Math.random() * .4

                this.hedgehog.angle = this.hedgehog.angle % (Math.PI * 2)
                this.hedgehog.rotation.set(0, 0, 0)
            }
        })
        this.monsterPosTarget -= .04
        gsap.from(this, {
            malusClearAlpha: .5,
            duration: 0.5,
            onUpdate: () => {
                this.renderer.setClearColor(malusClearColor, malusClearAlpha)
            }
        })
    }

    private addAndGetBonusParticles() {
        const bonusParticles = new BonusParticles()
        bonusParticles.visible = false
        this.scene.add(bonusParticles)
        return bonusParticles
    }

    private getBonus() {
        this.bonusParticles.position.copy(this.carrot.position)
        this.bonusParticles.visible = true
        this.bonusParticles.explose()
        this.carrot.angle += Math.PI / 2
        //speed*=.95
        this.monsterPosTarget += .025
    }


    private gameOver() {
        this.gameOverDom.className = "show"
        this.gameStatus = "gameOver"
        this.monster.sit()
        this.hero.hang()
        this.monster.heroHolder.add(this.hero)
        gsap.to(this, {speed: 0, duration: 1})
        gsap.to(this.camera.position, {z: cameraPosGameOver, y: 60, x: -30, duration: 3})
        this.carrot.visible = false
        this.hedgehog.visible = false
        clearInterval(levelInterval)
    }

    private addAndGetCarrot() {
        const carrot = new Carrot()
        this.scene.add(carrot)
        return carrot
    }

    private createTree() {
        const truncHeight = 50 + Math.random() * 150
        const topRadius = 1 + Math.random() * 5
        const bottomRadius = 5 + Math.random() * 5
        const mats = [blackMat, brownMat, pinkMat, whiteMat, greenMat, lightBrownMat, pinkMat]
        const matTrunc = blackMat//mats[Math.floor(Math.random()*mats.length)]
        const nhSegments = 3//Math.ceil(2 + Math.random()*6)
        const nvSegments = 3//Math.ceil(2 + Math.random()*6)
        const geom = new THREE.CylinderGeometry(topRadius, bottomRadius, truncHeight, nhSegments, nvSegments)
        geom.applyMatrix4(new THREE.Matrix4().makeTranslation(0, truncHeight / 2, 0))

        const mesh = new THREE.Mesh(geom, matTrunc)
        mesh.castShadow = true

        const vs = geom.getAttribute("position")

        for (let i = 0; i < vs.count; i++) {
            const noise = Math.random()
            let x = vs.getX(i)
            let y = vs.getY(i)
            let z = vs.getZ(i)
            x += -noise + Math.random() * noise * 2
            y += -noise + Math.random() * noise * 2
            z += -noise + Math.random() * noise * 2

            vs.setXYZ(i, x, y, z)
            geom.computeVertexNormals()

            // FRUITS
            if (Math.random() > .7) {
                const size = Math.random() * 3
                const fruitGeometry = new THREE.BoxGeometry(size, size, size, 1)
                const matFruit = mats[Math.floor(Math.random() * mats.length)]
                const fruit = new THREE.Mesh(fruitGeometry, matFruit)
                fruit.position.x = x
                fruit.position.y = y + 3
                fruit.position.z = z
                fruit.rotation.x = Math.random() * Math.PI
                fruit.rotation.y = Math.random() * Math.PI

                mesh.add(fruit)
            }

            // BRANCHES
            if (Math.random() > .5 && y > 10 && y < truncHeight - 10) {
                const h = 3 + Math.random() * 5
                const thickness = .2 + Math.random()

                const branchGeometry = new THREE.CylinderGeometry(thickness / 2, thickness, h, 3, 1)
                branchGeometry.applyMatrix4(new THREE.Matrix4().makeTranslation(0, h / 2, 0))
                const branch = new THREE.Mesh(branchGeometry, matTrunc)
                branch.position.x = x
                branch.position.y = y
                branch.position.z = z

                const vec = new THREE.Vector3(x, 2, z)
                const axis = new THREE.Vector3(0, 1, 0)
                branch.quaternion.setFromUnitVectors(axis, vec.clone().normalize())


                mesh.add(branch)
            }
        }

        return mesh

    }

    private addTrees() {

        const nTrees = 100
        for (let i = 0; i < nTrees; i++) {
            const phi = i * (Math.PI * 2) / nTrees
            let theta = Math.PI / 2
            //theta += .25 + Math.random()*.3
            theta += (Math.random() > .05) ? .25 + Math.random() * .3 : -.35 - Math.random() * .1

            const fir = this.createTree()
            fir.position.x = Math.sin(theta) * Math.cos(phi) * floorRadius
            fir.position.y = Math.sin(theta) * Math.sin(phi) * (floorRadius - 10)
            fir.position.z = Math.cos(theta) * floorRadius

            const vec = fir.position.clone()
            const axis = new THREE.Vector3(0, 1, 0)
            fir.quaternion.setFromUnitVectors(axis, vec.clone().normalize())
            this.floor.add(fir)
        }
    }

    private addAndGetFloor() {
        const floorShadow = new THREE.Mesh(new THREE.SphereGeometry(floorRadius, 50, 50), new THREE.MeshPhongMaterial({
            color: 0x7abf8e,
            specular: 0x000000,
            shininess: 1,
            transparent: true,
            opacity: .5
        }))
        //floorShadow.rotation.x = -Math.PI / 2
        floorShadow.receiveShadow = true

        const floorGrass = new THREE.Mesh(new THREE.SphereGeometry(floorRadius - .5, 50, 50), new THREE.MeshBasicMaterial({
            color: 0x7abf8e
        }))
        //floor.rotation.x = -Math.PI / 2
        floorGrass.receiveShadow = false

        const floor = new THREE.Group()
        floor.position.y = -floorRadius

        floor.add(floorShadow)
        floor.add(floorGrass)
        this.scene.add(floor)

        return floor
    }


    private handleMouseDown() {
        if (this.gameStatus == "play") {
            this.hero.jump()
        } else if (this.gameStatus == "readyToReplay") {
            this.replay()
        }
    }

    private replay() {

        this.gameStatus = "preparingToReplay"

        this.gameOverDom.className = ""

        gsap.killTweensOf(this.monster.pawFL.position)
        gsap.killTweensOf(this.monster.pawFR.position)
        gsap.killTweensOf(this.monster.pawBL.position)
        gsap.killTweensOf(this.monster.pawBR.position)

        gsap.killTweensOf(this.monster.pawFL.rotation)
        gsap.killTweensOf(this.monster.pawFR.rotation)
        gsap.killTweensOf(this.monster.pawBL.rotation)
        gsap.killTweensOf(this.monster.pawBR.rotation)

        gsap.killTweensOf(this.monster.tail.rotation)
        gsap.killTweensOf(this.monster.head.rotation)
        gsap.killTweensOf(this.monster.eyeL.scale)
        gsap.killTweensOf(this.monster.eyeR.scale)

        //gsap.killTweensOf(hero.head.rotation)

        this.monster.tail.rotation.y = 0

        gsap.to(this.camera.position, {
            x: 0,
            z: cameraPosGame,
            y: 30,
            duration: 3,
            //ease:Power4.easeInOut
        })
        gsap.to(this.monster.torso.rotation, {
            x: 0,
            duration: 2,
            //ease:Power4.easeInOut
        })
        gsap.to(this.monster.torso.position, {
            y: 0,
            duration: 2,
            //ease:Power4.easeInOut
        })
        gsap.to(this.monster.pawFL.rotation, {
            x: 0,
            duration: 2,
            //ease:Power4.easeInOut
        })
        gsap.to(this.monster.pawFR.rotation, {
            x: 0,
            duration: 2,
            //ease:Power4.easeInOut
        })
        gsap.to(this.monster.mouth.rotation, {
            x: .5,
            duration: 2,
            //ease:Power4.easeInOut
        })


        gsap.to(this.monster.head.rotation, 2, {y: 0, x: -.3, ease: Power4.easeInOut})

        gsap.to(this.hero.position, 2, {x: 20, ease: Power4.easeInOut})
        gsap.to(this.hero.head.rotation, 2, {x: 0, y: 0, ease: Power4.easeInOut})
        gsap.to(this.monster.mouth.rotation, 2, {x: .2, ease: Power4.easeInOut})
        gsap.to(this.monster.mouth.rotation, 1, {
            x: .4, ease: Power4.easeIn, delay: 1, onComplete: () => {

                this.resetGame()
            }
        })

    }

    private resetGame() {
        this.scene.add(this.hero)
        this.hero.rotation.y = Math.PI / 2
        this.hero.position.y = 0
        this.hero.position.z = 0
        this.hero.position.x = 0

        this.monsterPos = .56
        this.monsterPosTarget = .65
        speed = initSpeed
        level = 0
        distance = 0
        this.carrot.visible = true
        this.hedgehog.visible = true
        this.gameStatus = "play"
        this.hero.status = "running"
        this.hero.nod()
        audio.play()
        this.updateLevel()
        // @ts-ignore
        levelInterval = setInterval(this.updateLevel, levelUpdateFreq)
    }


}
