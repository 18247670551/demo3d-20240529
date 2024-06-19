

import { BufferGeometry, Color, DoubleSide, Float32BufferAttribute, Mesh, MeshBasicMaterial } from "three";

export default function createAnyFaceByMatrix3d(points, cof) {

    const config = {
        // material
        color: "#00ffff",
        hue: 1,
        maxHsl: 1, minHsl: 0,
        useHeightColor: false
    }
    Object.assign(config, cof)

    const material =
        config.material ? config.material :
            new MeshBasicMaterial({
                side: DoubleSide,
                vertexColors: config.useHeightColor,
                color: config.color,
                // transparent: true,
                // opacity: .5
                // wireframe: true
            })

    let vecs = points.flat()
    let max = 0, min = 99999999
    for (let i = 0; i < vecs.length; i++) {
        if (vecs[i] && vecs[i][2]) {
            let z = vecs[i][2]
            if (max < z) max = z
            if (min > z) min = z
        }

    }


    const vertices = []
    const uvs = []
    const normals = []//按需添加，建议不加
    const colors = []

    let indexNum = 0
    const indices = []
    const indexArray = []
    let last_i = 0
    let last_j = 0
    let count = 0
    let length = points.length
    // let length = 2
    const color = new Color()

    for (let i = 0; i < length; i++) {
        let row = points[i]
        let len = row.length
        // let len = 2
        for (let j = 0; j < len; j++) {
            let p = points[i][j]
            if (!p) continue
            vertices.push(...p)
            let hue = getHue(max, min, config.maxHsl, config.minHsl, p[2],)
            color.setHSL(hue, 1, .5)
            colors.push(color.r, color.g, color.b)
            // uv
            let u = i / (length - 1)
            let v = j / (len - 1)
            uvs.push(v, u)



            indexArray[count + j] = indexNum++//存储已存在的index序号
            // index （顶点顺序）

            if (i > 0 && j > 0) {
                let indexs = getIndexs(last_i, last_j, count, i, j)
                let arr = indexs.map(n => indexArray[n])//获取矩阵对应位置的index序号
                indices.push(
                    ...arr
                )

            }
        }
        last_i = i
        last_j = len
        count += len
    }

    const geometry = new BufferGeometry()
    geometry.setIndex(indices);
    geometry.setAttribute('position', new Float32BufferAttribute(vertices, 3));
    // geometry.setAttribute('normal', new Float32BufferAttribute(normals, 3));
    geometry.setAttribute('color', new Float32BufferAttribute(colors, 3));
    // geometry.setAttribute('uv', new Float32BufferAttribute(uvs, 2));
    const mesh = new Mesh(geometry, material)
    return mesh
}

// 分配面顶点
function getIndexs(last_i, last_j, count, i, j) {

    let last_count = count - last_j
    let a = last_count + j - 1
    let b = last_count + j
    let c = count + j - 1
    let d = count + j

    const indexs = [
        a, b, d, a, d, c
    ]

    return indexs
}
// 生成顶点颜色，按需修改
function getHue(max, min, maxHsl, minHsl, h,) {
    let hue = (h - min) / (max - min)
    hue = hue * (maxHsl - minHsl) + minHsl
    return hue
}
