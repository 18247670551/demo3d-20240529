import * as THREE from 'three'
import {ColorRepresentation} from "three/src/math/Color"
import vertexShader from "./shader/flyline/vertexShader.glsl"
import fragmentShader from "./shader/flyline/fragmentShader.glsl"

interface FlyLineOptions {
    source?: { x: number, y: number, z: number },
    target?: { x: number, y: number, z: number },
    height?: number,
    color?: ColorRepresentation,
    size?: number,
    range?: number,
}

export default class FlyLine extends THREE.Points {


    constructor(options: FlyLineOptions) {

        const defaultOptions: Required<FlyLineOptions> = {
            source: {x: 0, y: 0, z: 0},
            target: {x: 0, y: 0, z: 0},
            color: "#52d3fa",
            height: 100,
            size: 0.5,
            range: .1,
        }

        const finalOptions = Object.assign({}, defaultOptions, options)

        const {source, target, height, color, size, range} = finalOptions

        const _source = new THREE.Vector3(source.x, source.y, source.z)
        const _target = new THREE.Vector3(target.x, target.y, target.z)
        const _center = _target.clone().lerp(_source, 0.5)
        _center.y += height

        const curve = new THREE.QuadraticBezierCurve3(_source, _center, _target)


        const pointsCount = 1000
        const positions = new Float32Array(1000 * 3)
        const indexs= new Float32Array(pointsCount)
        const nums = new Float32Array(pointsCount)

        const points = curve.getPoints(pointsCount)

        // 粒子位置计算
        points.forEach((point, i) => {
            const index = i / (pointsCount - 1)
            positions[i*3] = point.x
            positions[i*3 + 1] = point.y
            positions[i*3 + 2] = point.z
            indexs[i] = index
            nums[i] = i
        })

        const geometry = new THREE.BufferGeometry()
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
        geometry.setAttribute('index', new THREE.BufferAttribute(indexs, 1))
        geometry.setAttribute('current', new THREE.BufferAttribute(nums, 1))

        const material = new THREE.ShaderMaterial({
            transparent: true,
            depthWrite: false,
            depthTest: false,
            blending: THREE.AdditiveBlending,
            uniforms: {
                uColor: {
                    value: new THREE.Color(color)
                },
                uRange: {
                    value: range || 100
                },
                uSize: {
                    value: size
                },
                uTotal: {
                    value: pointsCount
                },
                time: {
                    value: 0
                }
            },
            vertexShader,
            fragmentShader
        })


        super(geometry, material)

    }

}