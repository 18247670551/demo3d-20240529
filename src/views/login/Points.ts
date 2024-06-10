const pointSize = 1.5
const texture = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAAb1BMVEUAAAD///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////8v0wLRAAAAJHRSTlMAC/goGvDhmwcExrVjWzrm29TRqqSKenRXVklANSIUE8mRkGpv+HOfAAABCElEQVQ4y4VT13LDMAwLrUHteO+R9f/fWMfO6dLaPeKVEECRxOULWsEGpS9nULDwia2Y+ALqUNbAWeg775zv+sA4/FFRMxt8U2FZFCVWjR/YrH4/H9sarclSKdPMWKzb8VsEeHB3m0shkhVCyNzeXeAQ9Xl4opEieX2QCGnwGbj6GMyjw9t1K0fK9YZunPXeAGsfJtYjwzxaBnozGGorYz0ypK2HzQSYx1y8DgSRo2ewOiyh2QWOEk1Y9OrQV0a8TiBM1a8eMHWYnRMy7CZ4t1CmyRkhSUvP3gRXyHOCLBxNoC3IJv//ZrJ/kxxUHPUB+6jJZZHrpg6GOjnqaOmzp4NDR48OLxn/H27SRQ08S0ZJAAAAAElFTkSuQmCC'
const vertexShader =
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
    gl_Position = u_projection * vec4(pos.xyz, a_position.w);
    gl_PointSize = (u_size / gl_Position.w) * 100.0;
    v_color = a_color;
}
}
`
const fragmentShader =
`
precision highp float;
uniform sampler2D u_texture;
varying vec4 v_color;
void main() {
    gl_FragColor = v_color * texture2D(u_texture, gl_PointCoord);
}
`

export default class ShaderProgram {


    private options = {
        antialias: false,
        depthTest: false,
        mousemove: false,
        autosize: true,
        side: 'front',
    }

    private uniforms =
        {
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
    private buffers = {
        position: {
            size: 3,
            data: [],
        },
        color: {
            size: 4,
            data: [],
        },
    }

    private camera = {
        fov: 60,
        near: 1,
        far: 10000,
        aspect: 1,
        z: 100,
        perspective: true,
    }

    private dom : HTMLDivElement
    private canvas : HTMLCanvasElement
    private count = 0
    private gl:any


    constructor(dom: HTMLDivElement) {

        this.dom = dom

        this.canvas = document.createElement('canvas')
        const gl = this.canvas.getContext('webgl', {antialias: this.options.antialias})
        this.gl = gl
        dom.appendChild(this.canvas)
        this.createProgram(vertexShader, fragmentShader)
        this.createBuffers(this.buffers)
        this.createUniforms(this.uniforms)
        this.updateUniforms()
        this.createTexture(texture)
        gl.enable(gl.BLEND)
        gl.enable(gl.CULL_FACE)
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE)
        //gl[options.depthTest ? 'enable' : 'disable'](gl.DEPTH_TEST)

        window.addEventListener('resize', () => {
            const canvas = this.canvas
            const gl = this.gl
            const width = this.dom.clientWidth
            const height = this.dom.clientHeight
            const aspect = width / height
            const dpi = devicePixelRatio
            canvas.width = width * dpi
            canvas.height = height * dpi
            canvas.style.width = 100 + '%'
            canvas.style.height = 100 + '%'
            gl.viewport(0, 0, width * dpi, height * dpi)
            this.uniforms.resolution = [width, height]
            this.uniforms.projection = this.setProjection(aspect)
            const position = [], color = []
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
            this.uniforms.size = (height / 400) * pointSize * dpi
        }, false)

        this.update = this.update.bind(this)
        this.time = {
            start: performance.now(),
            old: performance.now(),
        }
        this.update()
    }

    setProjection(aspect: number) {
        const camera = this.camera
            camera.aspect = aspect
            const fovRad = camera.fov * (Math.PI / 180)
            const f = Math.tan(Math.PI * 0.5 - 0.5 * fovRad)
            const rangeInv = 1.0 / (camera.near - camera.far)
            const matrix = [f / camera.aspect, 0, 0, 0, 0, f, 0, 0, 0, 0, (camera.near + camera.far) * rangeInv, -1, 0, 0, camera.near * camera.far * rangeInv * 2, 0]
            matrix[14] += camera.z
            matrix[15] += camera.z
            return matrix
    }



    createProgram(vertex, fragment) {
        const gl = this.gl
        const vertexShader = this.createShader(gl.VERTEX_SHADER, vertex)
        const fragmentShader = this.createShader(gl.FRAGMENT_SHADER, fragment)
        const program = gl.createProgram()
        gl.attachShader(program, vertexShader)
        gl.attachShader(program, fragmentShader)
        gl.linkProgram(program)
        if (gl.getProgramParameter(program, gl.LINK_STATUS)) {
            gl.useProgram(program)
            this.program = program
        } else {
            gl.deleteProgram(program)
        }
    }

    createUniforms(data) {
        const gl = this.gl
        const uniforms = (this.data.uniforms = data)
        const values = (this.uniforms = {})
        Object.keys(uniforms).forEach((name) => {
            const uniform = uniforms[name]
            uniform.location = gl.getUniformLocation(this.program, 'u_' + name)
            Object.defineProperty(values, name, {
                set: (value) => {
                    uniforms[name].value = value
                    this.setUniform(name, value)
                },
                get: () => uniforms[name].value,
            })
        })
    }

    setUniform(name: string, value: []) {
        const gl = this.gl
        const uniform = this.uniforms[name]
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
    }

    updateUniforms() {
        const uniforms = this.uniforms
        Object.keys(uniforms).forEach((name) => {
            const uniform = uniforms[name]
            this.uniforms[name] = uniform.value
        })
    }

    createBuffers(data) {
        const buffers = (this.data.buffers = data)
        const values = (this.buffers = {})
        Object.keys(buffers).forEach((name) => {
            const buffer = buffers[name]
            buffer.buffer = this.createBuffer('a_' + name, buffer.size)
            Object.defineProperty(values, name, {
                set: (data) => {
                    buffers[name].data = data
                    this.setBuffer(name, data)
                    if (name === 'position') this.count = buffers.position.data.length / 3
                },
                get: () => buffers[name].data,
            })
        })
    }

    createBuffer(name, size) {
        const gl = this.gl
        const program = this.program
        const index = gl.getAttribLocation(program, name)
        const buffer = gl.createBuffer()
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
        gl.enableVertexAttribArray(index)
        gl.vertexAttribPointer(index, size, gl.FLOAT, false, 0, 0)
        return buffer
    }

    setBuffer(name, data) {
        const gl = this.gl
        const buffers = this.data.buffers
        if (name == null && !gl.bindBuffer(gl.ARRAY_BUFFER, null)) return
        gl.bindBuffer(gl.ARRAY_BUFFER, buffers[name].buffer)
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW)
    }

    createTexture(src) {
        const gl = this.gl
        const texture = gl.createTexture()
        gl.bindTexture(gl.TEXTURE_2D, texture)
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([0, 0, 0, 0]))
        this.texture = texture
        if (src) {
            this.uniforms.hasTexture = 1
            this.loadTexture(src)
        }
    }

    loadTexture(src) {
        const gl = this.gl
        const texture = this.texture
        const textureImage = new Image()
        textureImage.onload = () => {
            gl.bindTexture(gl.TEXTURE_2D, texture)
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, textureImage)
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
        }
        textureImage.src = src
    }

    update() {
        const gl = this.gl
        const now = performance.now()
        const elapsed = (now - this.time.start) / 5000
        this.time.old = now
        this.uniforms.time = elapsed
        if (this.count > 0) {
            gl.drawArrays(gl.POINTS, 0, this.count)
        }
        requestAnimationFrame(this.update)
    }
}