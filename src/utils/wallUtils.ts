// @ts-nocheck


import * as THREE from "three"

/**
 * 通过path构建墙体
 */
export function pathToWallGeometry(path: number[][], height: number) {
    let verticesByTwo: number[]
    // 1.处理路径数据, 根据顶点, 再生成一个xz同位置, 向y轴扩展height的顶点, 再将原数据分成每两个一组的二维数组
    verticesByTwo = path.reduce((arr, [x, y, z]) => arr.concat([[[x, y, z], [x, y + height, z]]]), [])




    // //例如 原路径为 path0, 高度为 100
    // const path0 = [
    //     [800, 0, -400],
    //     [100, 0, 0],
    //     [600, 0, 500],
    //     [0, 100, 0],
    //     [100, 100, 100],
    //     [-600, 0, 500],
    //     [-500, 0, -300],
    //     [800, 0, -400],
    // ]
    //
    // // 处理后变成, 即 点变成线
    // const path1 = [
    //     [[800, 0, -400], [800, 100, -400]],
    //     [[100, 0, 0], [100, 100, 0]],
    //     [[600, 0, 500], [600, 100, 500]],
    //     [[0, 100, 0], [0, 200, 0]],
    //     [[100, 100, 100], [100, 200, 100]],
    //     [[-600, 0, 500], [-600, 100, 500]],
    //     [[-500, 0, -300], [-500, 100, -300]],
    //     [[800, 0, -400], [800, 100, -400]],
    // ]
    //
    // console.log("verticesByTwo = ", verticesByTwo)





    // 2.解析需要渲染的四边形 每4个顶点为一组
    const verticesByFour = verticesByTwo.reduce((arr, item, i) => {
        if (i === verticesByTwo.length - 1) {
            return arr
        }
        return arr.concat([[item, verticesByTwo[i + 1]]])
    }, [])





    // // 处理后变成 即 线变成面
    // const path2 = [
    //     [[[800, 0, -400], [800, 100, -400]], [[100, 0, 0], [100, 100, 0]]],
    //     [[[100, 0, 0], [100, 100, 0]], [[600, 0, 500], [600, 100, 500]]],
    //     [[[600, 0, 500], [600, 100, 500]], [[0, 100, 0], [0, 200, 0]]],
    //     [[[0, 100, 0], [0, 200, 0]], [[100, 100, 100], [100, 200, 100]]],
    //     [[[100, 100, 100], [100, 200, 100]], [[-600, 0, 500], [-600, 100, 500]]],
    //     [[[-600, 0, 500], [-600, 100, 500]], [[-500, 0, -300], [-500, 100, -300]]],
    //     [[[-500, 0, -300], [-500, 100, -300]], [[800, 0, -400], [800, 100, -400]]],
    // ]
    //
    // console.log("verticesByFour = ", verticesByFour)






    // 3.将四边形面转换为需要渲染的三角形面
    const verticesByThree = verticesByFour.reduce((arr, item) => {
        const [[point1, point2], [point3, point4]] = item
        return arr.concat(
            ...point2,
            ...point1,
            ...point4,
            ...point1,
            ...point3,
            ...point4
        )
    }, [])






    // // 处理后变成, 即: 一个面拆分成两个三角形, 并得到6个顶点, 展平, 做为 BufferGeometry 的 attribute.position.array
    // const vs = [
    //     800, 100, -400,
    //     800, 0, -400,
    //     100, 100, 0,
    //     800, 0, -400,
    //     100, 0, 0,
    //     100, 100, 0,
    //     100, 100, 0,
    //     100, 0, 0,
    //     600, 100, 500,
    //     100, 0, 0, 600,
    //     0, 500, 600,
    //     //...
    // ]
    //
    // console.log("verticesByThree = ", verticesByThree)







    const geometry = new THREE.BufferGeometry()
    // 4. 设置position
    geometry.setAttribute("position", new THREE.BufferAttribute(new Float32Array(verticesByThree), 3))


    // 5. 设置uv 6个点为一个周期 [0, 1, 0, 0, 1, 1, 0, 0, 1, 0, 1, 1]
    // 5.1 以18个顶点为单位分组
    const pointsGroupBy18 = new Array(verticesByThree.length / 3 / 6)
        .fill(0)
        .map((item, i) => verticesByThree.slice(i * 3 * 6, (i + 1) * 3 * 6))

    // 5.2 按uv周期分组
    const pointsGroupBy63 = pointsGroupBy18.map((item, i) => {
        return new Array(item.length / 3)
            .fill(0)
            .map((it, i) => item.slice(i * 3, (i + 1) * 3))
    })

    // 5.3根据BoundingBox确定uv平铺范围
    geometry.computeBoundingBox()
    const {min, max} = geometry.boundingBox!
    const rangeX = max.x - min.x
    const uvs = [].concat(...pointsGroupBy63.map((item) => {
            const point0 = item[0]
            const point5 = item[5]
            const distance = new THREE.Vector3(...point0).distanceTo(new THREE.Vector3(...point5)) / (rangeX / 10)
            return [0, 1, 0, 0, distance, 1, 0, 0, distance, 0, distance, 1]
        })
    )
    geometry.setAttribute("uv", new THREE.BufferAttribute(new Float32Array(uvs), 2))

    // 更新法线
    // geometry.computeVertexNormals()
    return geometry
}