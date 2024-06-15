precision lowp float;

attribute vec3 aDistance;
uniform float uTime;
uniform float uSize;

void main() {
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);

    // 设置点的位置 aDistance 就是 to 的 xyz,  uTime范围 [0,1], 就是运动过程的百分比
    modelPosition.xyz += (aDistance * uTime);

    vec4 viewPosition = viewMatrix * modelPosition;

    gl_Position = projectionMatrix * viewPosition;

    gl_PointSize = uSize;
}