precision mediump float;

float distanceTo(vec2 src, vec2 dst) {
    float dx = src.x - dst.x;
    float dy = src.y - dst.y;
    float dv = dx * dx + dy * dy;
    return sqrt(dv);
}

float lerp(float x, float y, float t) {
    return (1.0 - t) * x + t * y;
}

uniform float time;
uniform float uOpacity;
uniform float uStartTime;

varying vec3 vColor;

void main() {

    gl_FragColor = vec4(vColor, uOpacity * uStartTime);
}