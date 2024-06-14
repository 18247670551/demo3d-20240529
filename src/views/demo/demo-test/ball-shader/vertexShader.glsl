attribute vec3 aStep;
uniform float uTime;
uniform float uSize;

void main() {
    vec4 modelPosition = modelMatrix * vec4( position, 1.0 );

    // 设置点的 位置 aStep 就是 to 的 xyz  uTime 就是 [0,1];
    modelPosition.xyz += (aStep*uTime);

    gl_Position = projectionMatrix * viewMatrix * modelPosition;
    gl_PointSize = uSize;
}