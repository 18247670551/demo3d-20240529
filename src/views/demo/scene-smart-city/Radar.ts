import * as THREE from 'three'
import {ColorRepresentation} from "three/src/math/Color"
import vertexShader from "./shader/radar/vertexShader.glsl"
import fragmentShader from "./shader/radar/fragmentShader.glsl"

interface RadarOptions {
    radius?: number,
    color?: ColorRepresentation,
    speed?: number,
    opacity?: number,
    angle?: number,
    position?: { x: number, y: number, z: number },
    rotation?: { x: number, y: number, z: number }
}

export default class Radar extends THREE.Mesh{


    constructor(options: RadarOptions) {

        const defaultOptions: Required<RadarOptions> = {
            radius: 50,
            color: "#ffffff",
            speed: 1,
            opacity: 1,
            angle: Math.PI,
            position: {x: 0, y: 0, z: 0},
            rotation: {x: -Math.PI / 2, y: 0, z: 0}
        }

        const finalOptions = Object.assign({}, defaultOptions, options)

        const {radius, speed, opacity, rotation, position, angle, color} = finalOptions

        const width = radius * 2


        const geometry = new THREE.PlaneGeometry(width, width, 1, 1)

        const material = new THREE.ShaderMaterial({
                uniforms: {
                    u_radius: {
                        value: radius
                    },
                    u_speed: {
                        value: speed
                    },
                    u_opacity: {
                        value: opacity
                    },
                    u_width: {
                        value: angle
                    },
                    u_color: {
                        value: new THREE.Color(color)
                    },
                    time: {
                        value: 0
                    }
                },
                transparent: true,
                depthWrite: false,
                side: THREE.DoubleSide,
                vertexShader,
                fragmentShader
            })


        super(geometry, material)

        this.rotation.set(rotation.x, rotation.y, rotation.z)
        this.position.copy(position)

    }

}