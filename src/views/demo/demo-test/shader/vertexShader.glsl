precision lowp float;

uniform float uTime;
attribute vec3 aToPosition;


void main() {
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);

    modelPosition.xyz += aToPosition * uTime;

    vec4 viewPosition = viewMatrix * modelPosition;

    gl_Position = projectionMatrix * viewPosition;

    gl_PointSize = 5.0;
}