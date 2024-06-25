import * as THREE from "three";
import * as BufferGeometryUtils from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { getTextureLoader } from "@/three-widget/loader/ThreeLoader";
import ring3Pic from "/public/demo/mesh-animation-point-tag/ring3.png";
import gradient_round_outside_to_innerPic from "/public/demo/mesh-animation-point-tag/gradient_round_outside_to_inner.png";
const defaultOptions = {
    radius: 4,
    height: 20,
    color: '#EEEE00',
    ringTexture: getTextureLoader().load(ring3Pic),
    tagTexture: getTextureLoader().load(gradient_round_outside_to_innerPic),
};
export default class PointTag extends THREE.Group {
    tag;
    ring;
    constructor(options) {
        super();
        const finalOptions = Object.assign({}, defaultOptions, options);
        const { radius, height, color, ringTexture, tagTexture } = finalOptions;
        // 顶部圆椎高占比 1/3
        const topConeHeight = height / 3;
        // 底部圆椎高占比 2/3
        const bottomConeHeight = height / 3 * 2;
        // 底部圆椎Y轴提升距离是自身高度的一半
        const bottomConeHeightTranslateY = bottomConeHeight / 2;
        // 顶部圆椎Y轴提升距离是自身高度的一半 + 底部圆椎体高度
        const topConeHeightTranslateY = topConeHeight / 2 + bottomConeHeight;
        // 顶部圆椎
        const topConeGeometry = new THREE.ConeGeometry(radius, topConeHeight, 4);
        topConeGeometry.translate(0, topConeHeightTranslateY, 0);
        // 底部圆椎
        const bottomConeGeometry = new THREE.ConeGeometry(radius, bottomConeHeight, 4);
        bottomConeGeometry.rotateX(Math.PI);
        bottomConeGeometry.translate(0, bottomConeHeightTranslateY, 0);
        // 合并 顶部圆椎 底部圆椎
        const mergedGeometry = BufferGeometryUtils.mergeGeometries([
            topConeGeometry.toNonIndexed(), // 转换为非索引格式
            bottomConeGeometry.toNonIndexed()
        ]);
        const material = new THREE.MeshBasicMaterial({
            color,
            map: tagTexture,
            transparent: true,
        });
        const tag = new THREE.Mesh(mergedGeometry, material);
        this.add(tag);
        this.tag = tag;
        // 动画光晕平面
        const ringGeo = new THREE.PlaneGeometry(height / 2, height / 2);
        // Y轴提升距离是底部圆椎体高度
        ringGeo.rotateX(-Math.PI / 2);
        ringGeo.translate(0, bottomConeHeight, 0);
        const ringMat = new THREE.MeshBasicMaterial({
            map: ringTexture,
            side: THREE.DoubleSide,
            color,
            transparent: true,
            depthTest: false,
        });
        const ring = new THREE.Mesh(ringGeo, ringMat);
        this.add(ring);
        this.ring = ring;
    }
    update() {
        this.tag.rotation.y += 0.01;
        let scale = this.ring.scale.x;
        // 光圈放大范围，从1倍放大到6倍
        const range = 6;
        scale += 0.02;
        // 光圈透明度
        let opacity;
        if (scale < range * 0.3) {
            // 光圈的透明度从0.0逐渐过渡到1.0，逐渐显示
            opacity = (scale - 1) / (range * 0.3 - 1);
        }
        else if (scale > range * 0.3 && scale <= range) {
            // 光圈的透明度从1.0逐渐过渡到0.0，逐渐消失
            opacity = 1 - (scale - range * 0.3) / (range - range * 0.3);
        }
        else {
            // 重置缩放值
            scale = 1.0;
        }
        this.ring.scale.set(scale, 1, scale);
        // @ts-ignore
        this.ring.material.opacity = opacity;
    }
}
//# sourceMappingURL=PointTag.js.map