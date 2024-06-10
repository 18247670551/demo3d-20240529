// @ts-nocheck

const vertexShaderStr =
    `
#define M_PI 3.1415926535897932384626433832795
precision highp float;
attribute vec4 a_position;
attribute vec4 a_color;
uniform float u_time;
uniform float u_size;
uniform float u_speed;
uniform vec3 u_field;
uniform mat4 u_projection;
varying vec4 v_color;
void main() {
  vec3 pos = a_position.xyz;
  pos.y += (
    cos(pos.x / u_field.x * M_PI * 8.0 + u_time * u_speed) +
    sin(pos.z / u_field.z * M_PI * 8.0 + u_time * u_speed)
  ) * u_field.y;
  gl_Position = u_projection * vec4( pos.xyz, a_position.w );
  gl_PointSize = ( u_size / gl_Position.w ) * 100.0;
  v_color = a_color;
}
`
const fragmentShaderStr =
    `
precision highp float;
uniform sampler2D u_texture;
varying vec4 v_color;
void main() {
  gl_FragColor = v_color * texture2D(u_texture, gl_PointCoord);
}
`

const pointSize = 1.5

export default class Particles {

    private count = 0
    private canvas: HTMLCanvasElement
    private gl: WebGLRenderingContext
    private uniforms = {
        size: {type: 'float', value: pointSize},
        field: {type: 'vec3', value: [0, 0, 0]},
        speed: {type: 'float', value: 5},
        time: {
            type: 'float',
            value: 0,
        },
        hasTexture: {
            type: 'int',
            value: 0,
        },
        resolution: {
            type: 'vec2',
            value: [0, 0],
        },
        projection: {
            type: 'mat4',
            value: [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1],
        }
    }


    constructor(canvas: HTMLCanvasElement) {

        this.canvas = canvas

        const gl = canvas.getContext('webgl', {antialias: false})!
        this.gl = gl

        const uniforms = this.uniforms

        const vertexShader = this.createShader(gl.VERTEX_SHADER, vertexShaderStr)!
        const fragmentShader = this.createShader(gl.FRAGMENT_SHADER, fragmentShaderStr)!
        const program = gl.createProgram()!
        gl.attachShader(program, vertexShader)
        gl.attachShader(program, fragmentShader)
        gl.linkProgram(program)
        gl.useProgram(program)

        this.data = {}
        this.buffers = {
            position: {
                size: 3,
                data: [],
            },
            color: {
                size: 4,
                data: [],
            },
        }
        const buffers = (this.data.buffers = {
            position: {
                size: 3,
                data: [],
            },
            color: {
                size: 4,
                data: [],
            },
        })

        Object.keys(buffers).forEach((name) => {
            const buffer = buffers[name]

            const innerBuffer = gl.createBuffer()
            gl.bindBuffer(gl.ARRAY_BUFFER, innerBuffer)

            const index = gl.getAttribLocation(program, 'a_' + name)
            gl.enableVertexAttribArray(index)
            gl.vertexAttribPointer(index, buffer.size, gl.FLOAT, false, 0, 0)

            buffer.buffer = innerBuffer

            Object.defineProperty(this.buffers, name, {
                set: (data) => {
                    buffers[name].data = data

                    const buffers1 = this.data.buffers
                    gl.bindBuffer(gl.ARRAY_BUFFER, buffers1[name].buffer)
                    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW)

                    if (name === 'position') {
                        this.count = buffers.position.data.length / 3
                    }
                },
                get: () => buffers[name].data,
            })
        })


        const uniforms2 = this.data.uniforms = uniforms
        const values = this.uniforms = {}
        Object.keys(uniforms2).forEach((name) => {
            const uniform = uniforms2[name]
            uniform.location = gl.getUniformLocation(program, 'u_' + name)
            Object.defineProperty(values, name, {
                set: (value) => {
                    uniforms2[name].value = value
                    const uniform = this.data.uniforms[name]
                    uniform.value = value
                    switch (uniform.type) {
                        case 'int': {
                            gl.uniform1i(uniform.location, value)
                            break
                        }
                        case 'float': {
                            gl.uniform1f(uniform.location, value)
                            break
                        }
                        case 'vec2': {
                            gl.uniform2f(uniform.location, ...value)
                            break
                        }
                        case 'vec3': {
                            gl.uniform3f(uniform.location, ...value)
                            break
                        }
                        case 'vec4': {
                            gl.uniform4f(uniform.location, ...value)
                            break
                        }
                        case 'mat2': {
                            gl.uniformMatrix2fv(uniform.location, false, value)
                            break
                        }
                        case 'mat3': {
                            gl.uniformMatrix3fv(uniform.location, false, value)
                            break
                        }
                        case 'mat4': {
                            gl.uniformMatrix4fv(uniform.location, false, value)
                            break
                        }
                    }
                },
                get: () => uniforms2[name].value,
            })
        })

        Object.keys(this.data.uniforms).forEach((name) => {
            const uniform = this.data.uniforms[name]
            this.uniforms[name] = uniform.value
        })


        const texture = gl.createTexture()

        this.uniforms.hasTexture = 1

        const textureImage = new Image()
        textureImage.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAAb1BMVEUAAAD' +
            '///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////' +
            '8v0wLRAAAAJHRSTlMAC/goGvDhmwcExrVjWzrm29TRqqSKenRXVklANSIUE8mRkGpv+HOfAAABCElEQVQ4y4VT13LDMAwLrUHteO+R9f/fWMfO6dLaPeKVEECRxOULWsEGpS9nULDwia2Y+ALqUNbAWeg775zv+sA4' +
            '/FFRMxt8U2FZFCVWjR/YrH4/H9sarclSKdPMWKzb8VsEeHB3m0shkhVCyNzeXeAQ9Xl4opEieX2QCGnwGbj6GMyjw9t1K0fK9YZunPXeAGsfJtYjwzxaBnozGGorYz0ypK2HzQSYx1y8DgSRo2ewOiyh2QWOEk1Y9OrQ' +
            'V0a8TiBM1a8eMHWYnRMy7CZ4t1CmyRkhSUvP3gRXyHOCLBxNoC3IJv//ZrJ/kxxUHPUB+6jJZZHrpg6GOjnqaOmzp4NDR48OLxn/H27SRQ08S0ZJAAAAAElFTkSuQmCC'
        textureImage.onload = () => {
            gl.bindTexture(gl.TEXTURE_2D, texture)
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, textureImage)
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
        }

        gl.enable(gl.BLEND)
        gl.enable(gl.CULL_FACE)
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE)
        gl.disable(gl.DEPTH_TEST)

        window.addEventListener('resize', this.resize, false)

        this.resize()
        this.update()
    }

    resize() {
        const canvas = this.canvas
        const gl = this.gl

        const width = canvas.offsetWidth
        const height = canvas.offsetHeight
        canvas.width = width * devicePixelRatio
        canvas.height = height * devicePixelRatio

        gl.viewport(0, 0, width * devicePixelRatio, height * devicePixelRatio)
        this.uniforms.resolution = [width, height]

        const camera = {
            fov: 45,
            near: 1,
            far: 10000,
            z: 100,
        }

        const fovRad = camera.fov * (Math.PI / 180)
        const f = Math.tan(Math.PI * 0.5 - 0.5 * fovRad)
        const rangeInv = 1.0 / (camera.near - camera.far)
        const matrix = [f / (width / height), 0, 0, 0, 0, f, 0, 0, 0, 0, (camera.near + camera.far) * rangeInv, -1, 0, 0, camera.near * camera.far * rangeInv * 2, 0]
        matrix[14] += camera.z
        matrix[15] += camera.z
        this.uniforms.projection = matrix


        const position = []
        const color = []
        const newWidth = 400 * (width / height)
        const newHeight = 3
        const depth = 500
        const distance = 3
        for (let x = 0; x < newWidth; x += distance) {
            for (let z = 0; z < depth; z += distance) {
                position.push(-newWidth / 2 + x, -30, -depth / 2 + z)
                color.push(1, 1, 1, z / depth)
            }
        }
        this.uniforms.field = [newWidth, newHeight, depth]
        this.buffers.position = position
        this.buffers.color = color
        this.uniforms.size = (height / 400) * pointSize * devicePixelRatio
    }

    createShader(type: number, source: string) {
        const gl = this.gl
        const shader = gl.createShader(type)!
        gl.shaderSource(shader, source)
        gl.compileShader(shader)
        if (gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            return shader
        } else {
            gl.deleteShader(shader)
        }
    }

    update = () => {
        // @ts-ignore
        this.uniforms.time = performance.now() / 5000
        this.gl.drawArrays(this.gl.POINTS, 0, this.count)
        requestAnimationFrame(this.update)
    }
}