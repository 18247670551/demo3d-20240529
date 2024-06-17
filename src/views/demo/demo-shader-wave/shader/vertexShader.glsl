precision lowp float;
attribute vec3 position;
attribute vec2 uv;

// 因为用的是 THREE.RawShaderMaterial 原始着色器, 并非 THREE.ShaderMaterial, 原始着色器需要显示声明这三个矩阵
uniform mat4 modelMatrix;
uniform mat4 viewMatrix;
uniform mat4 projectionMatrix;

uniform float uTime;

varying vec2 vUv;
varying float deep;

void main () {
    vUv = uv;
    vec4 modelPostion = modelMatrix * vec4(position, 1.0);

    modelPostion.z += sin((position.x + uTime) * 10.0) * 0.05;

    deep = modelPostion.z;

    gl_Position = projectionMatrix * viewMatrix * modelPostion;
}