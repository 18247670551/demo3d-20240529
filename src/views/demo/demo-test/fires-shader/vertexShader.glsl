attribute float aScale;
attribute vec3 aRandom;
uniform float uTime;

uniform float uSize;
void main() {
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    modelPosition.xyz += aRandom*uTime;
    gl_Position = projectionMatrix * (viewMatrix * modelPosition);
    gl_PointSize = (uSize*aScale)-uTime*20.0;
}