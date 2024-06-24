precision mediump float;
uniform float uTime;
varying vec2 vUv;

void main() {
    vUv = uv;
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    modelPosition.z = sin((modelPosition.x + uTime) * 10.0) * 0.05;
    modelPosition.z += sin((modelPosition.y + uTime) * 10.0) * 0.05;
    gl_Position = projectionMatrix * viewMatrix * modelPosition;
}