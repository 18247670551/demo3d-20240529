varying vec2 vUv;
varying vec3 pos;

void main() {
    pos = position;
    vUv = uv;
    vec3 myPosition = position;
    // myPosition *= sin(position.y / 3.);
    // myPosition.x *= sin((uv.y) * 3.124);
    vec4 viewPosition = modelViewMatrix * vec4(myPosition, 1.0);
    gl_Position = projectionMatrix * viewPosition;
}