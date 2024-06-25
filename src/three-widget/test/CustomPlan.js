import * as THREE from "three";
import { BufferGeometry, Color, Float32BufferAttribute, MeshBasicMaterial } from "three";
import { getTextureLoader } from "@/three-widget/loader/ThreeLoader";
function test() {
    const pointsPositions = [
        [
            [5, 1, 4],
            [4, 1, 4],
            [5, 1, 4],
            [15, 1, 4],
            [5, 7, 1],
            [7, 2, 4],
            [5, 11, 4],
        ],
        [
            [5, 17, 1],
            [7, 2, 4],
            [5, 11, 4],
            [5, 1, 4],
            [4, 1, 4],
            [5, 1, 14],
            [5, 1, 4],
        ],
        [
            [5, 1, 4],
            [5, 1, 4],
            [5, 7, 1],
            [7, 12, 4],
            [15, 1, 4],
            [4, 1, 4],
            [5, 1, 14],
        ],
        [
            [5, 1, 4],
            [5, 7, 1],
            [17, 2, 4],
            [5, 1, 4],
            [4, 1, 14],
            [15, 1, 4],
            [5, 1, 14],
        ],
        [
            [5, 7, 1],
            [5, 1, 4],
            [4, 1, 4],
            [5, 1, 4],
            [5, 1, 4],
            [7, 2, 4],
            [5, 1, 4],
        ],
        [
            [5, 1, 4],
            [5, 7, 1],
            [7, 2, 4],
            [5, 1, 4],
            [5, 1, 4],
            [4, 1, 4],
            [5, 1, 4],
        ],
    ];
    const plan = new CustomPlan(pointsPositions, {
        material: new THREE.MeshLambertMaterial({ map: getTextureLoader().load("/demo/scene-ming/dry/fanLeaf_blue.png") })
    });
    console.log("plan = ", plan);
}
/**
 * 使用一个三维矩阵生成不规则的面（类似geometry.json的多边形,模型单个面网格）
 * [
 *     [
 *         [x, y, z],
 *         [x, y, z],
 *         [x, y, z],
 *         ...
 *     ]
 * ]
 */
export default class CustomPlan extends THREE.Mesh {
    //private options: Required<CustomPlanOptions>
    constructor(points, options) {
        const defaultOptions = {
            material: new MeshBasicMaterial({ color: "#ff0000" }),
            color: "#00ffff",
            hue: 1,
            maxHsl: 1,
            minHsl: 0,
            useHeightColor: false
        };
        const finalOptions = Object.assign({}, defaultOptions, options);
        let max = 0;
        let min = 99999999;
        const vecs = points.flat();
        for (let i = 0; i < vecs.length; i++) {
            if (vecs[i] && vecs[i][2]) {
                let z = vecs[i][2];
                if (max < z)
                    max = z;
                if (min > z)
                    min = z;
            }
        }
        const vertices = []; //顶点
        const uvs = []; //uv
        const normals = []; //法向量
        const colors = [];
        let indexNum = 0;
        const indices = [];
        const indexArray = [];
        let last_i = 0;
        let last_j = 0;
        let count = 0;
        let length = points.length;
        const color = new Color();
        for (let i = 0; i < length; i++) {
            let row = points[i];
            let len = row.length;
            for (let j = 0; j < len; j++) {
                let p = points[i][j];
                if (!p)
                    continue;
                vertices.push(...p);
                let hue = CustomPlan.getHue(max, min, finalOptions.maxHsl, finalOptions.minHsl, p[2]);
                color.setHSL(hue, 1, .5);
                colors.push(color.r, color.g, color.b);
                // uv
                let u = i / (length - 1);
                let v = j / (len - 1);
                uvs.push(v, u);
                indexArray[count + j] = indexNum++; //存储已存在的index序号
                // index （顶点顺序）
                if (i > 0 && j > 0) {
                    let indexs = CustomPlan.getIndexs(last_i, last_j, count, i, j);
                    let arr = indexs.map(n => indexArray[n]); //获取矩阵对应位置的index序号
                    indices.push(...arr);
                }
            }
            last_i = i;
            last_j = len;
            count += len;
        }
        const geometry = new BufferGeometry();
        geometry.setIndex(indices);
        geometry.setAttribute('position', new Float32BufferAttribute(vertices, 3));
        geometry.setAttribute('normal', new Float32BufferAttribute(normals, 3));
        geometry.setAttribute('uv', new Float32BufferAttribute(uvs, 2));
        geometry.setAttribute('color', new Float32BufferAttribute(colors, 3));
        geometry.attributes.position.needsUpdate = true;
        geometry.attributes.normal.needsUpdate = true;
        geometry.attributes.uv.needsUpdate = true;
        geometry.attributes.color.needsUpdate = true;
        super(geometry, finalOptions.material);
    }
    // 分配三角形面顶点
    static getIndexs(last_i, last_j, count, i, j) {
        let last_count = count - last_j;
        let a = last_count + j - 1;
        let b = last_count + j;
        let c = count + j - 1;
        let d = count + j;
        return [a, b, d, a, d, c];
    }
    // 生成顶点颜色
    static getHue(max, min, maxHsl, minHsl, h) {
        let hue = (h - min) / (max - min);
        hue = hue * (maxHsl - minHsl) + minHsl;
        return hue;
    }
}
//# sourceMappingURL=CustomPlan.js.map