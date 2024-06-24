import {GLTF} from "three/examples/jsm/loaders/GLTFLoader"
import * as THREE from "three"
import {gsap} from "gsap"

export enum Level {
    zero = 0,
    one = 1,
    two = 2,
    three = 3,
}

enum State {
    on = 0,
    off = 1,
}

export enum BtnState {
    up = 0,
    down = 1,
}

enum ShakeDir {
    left = -1,
    right = 1,
    wait = 0,
}

class Btn {
    readonly name: string
    protected readonly obj: THREE.Object3D
    state: BtnState = BtnState.up

    constructor(obj: THREE.Object3D) {
        this.obj = obj
        this.name = this.obj.name
        this.up()
    }

    up() {
        this.obj.position.y = 0
        this.state = BtnState.up
    }

    down() {
        this.obj.position.y = -0.03
        this.state = BtnState.down
    }
}

export class LevelBtn extends Btn {
    level: Level

    constructor(obj: THREE.Object3D, level: Level) {
        super(obj)
        this.level = level
    }
}

export class ShakeBtn extends Btn {
    constructor(obj: THREE.Object3D) {
        super(obj)
    }

    up() {
        this.obj.position.y = 2.97
        this.state = BtnState.up
    }

    down() {
        this.obj.position.y = 2.85
        this.state = BtnState.down
    }
}

export default class Fan {
    private readonly obj: GLTF
    readonly btns: Array<Btn> = []

    state: State = State.off

    level: Level = Level.zero
    speed = 0

    shake: boolean = false
    shakeDirection: ShakeDir = ShakeDir.left
    shakeRange: number = Math.PI / 3.5

    constructor(obj: GLTF) {
        this.obj = obj
        const leaf = obj.scene.getObjectByName("Leaf")!
        const leaf2 = leaf.clone()
        const group = new THREE.Group()
        group.name = "Leaf2"
        group.add(leaf2)

        this.obj.scene.add(group)
        leaf.visible = false
    }

    handleClick(intersects: Array<THREE.Intersection>, state: BtnState = BtnState.down) {
        const btns = this.btns.map(btn => btn.name)
        let btn
        for (let intersect of intersects) {
            if (!btns.includes(intersect.object.name)) continue
            btn = this.btns[btns.indexOf(intersect.object.name)]
            break
        }

        if (typeof btn == "undefined") {
            console.log("未点到按钮按钮")
            return
        } else if (btn instanceof ShakeBtn && state == BtnState.down) {
            this.turnShake(btn)
        } else if (btn instanceof LevelBtn && state == BtnState.down) {
            this.turnLevel(btn)
        } else if (btn instanceof LevelBtn && state == BtnState.up && btn.level == Level.zero) {
            this.state = State.off
            btn.up()
        }
    }

    turnLevel(btn: LevelBtn) {
        if (btn.state == BtnState.down) return

        this.btns
            .filter(btn => btn instanceof LevelBtn)
            .forEach(btn => btn.up())
        btn.down()

        if (btn.level != Level.zero) {
            this.state = State.on
        }

        this.level = btn.level
        gsap.to(this, 3, {speed: this.level})
    }

    turnShake(btn: ShakeBtn) {
        if (btn.state == BtnState.up) {
            btn.down()
            this.shake = true
        } else {
            btn.up()
            this.shake = false
        }
    }

    update() {
        const leaf = this.obj.scene.getObjectByName("Leaf2")?.getObjectByName("Leaf")!
        let rotationY = leaf.rotation.y + (Math.PI / 10) * this.speed
        while (rotationY > Math.PI * 2) {
            rotationY -= Math.PI * 2
        }
        leaf.rotation.y = rotationY
        if (!this.shake || this.state == State.off) {
            return
        }
        const head = this.obj.scene.getObjectByName("Head")!
        let rotationZ = head!.rotation.z + (Math.PI / 1000) * this.shakeDirection
        const shake = this.obj.scene.getObjectByName("Shake")!
        const leaf2 = this.obj.scene.getObjectByName("Leaf2")!
        if (Math.abs(rotationZ) > Math.abs(this.shakeRange)) {
            let shakeDir = this.shakeDirection
            setTimeout(() => {
                // 这里逻辑没问题, 经测试, 一次摇头到最外侧只会产生一个setTimeout
                //console.log("产生了一个setTimeout")
                if (shakeDir == ShakeDir.left) this.shakeDirection = ShakeDir.right
                else if (shakeDir == ShakeDir.right) this.shakeDirection = ShakeDir.left
            }, 1000)
            this.shakeDirection = ShakeDir.wait
            rotationZ = (Math.abs(this.shakeRange) * Math.abs(rotationZ)) / rotationZ
        }
        head!.rotation.z = rotationZ
        leaf2!.rotation.y = THREE.MathUtils.degToRad(rotationZ)
        leaf!.rotation.set(leaf!.rotation.x, leaf!.rotation.y, rotationZ, "XZY")
        shake!.rotation.z = rotationZ
    }


}

















