#define PI 3.14159265359

uniform mediump float uStartTime;
uniform mediump float time;
uniform mediump float uRange;
uniform mediump float uSpeed;

uniform vec3 uColor;
uniform vec3 uActive;
uniform vec3 uMin;
uniform vec3 uMax;

varying vec3 vColor;

float lerp(float x, float y, float t) {
    return (1.0 - t) * x + t * y;
}
void main() {
    if (uStartTime >= 0.99) {
        float iTime = mod(time * uSpeed - uStartTime, 1.0);
        float rangeY = lerp(uMin.y, uMax.y, iTime);
        if (rangeY < position.y && rangeY > position.y - uRange) {
            float index = 1.0 - sin((position.y - rangeY) / uRange * PI);
            float r = lerp(uActive.r, uColor.r, index);
            float g = lerp(uActive.g, uColor.g, index);
            float b = lerp(uActive.b, uColor.b, index);

            vColor = vec3(r, g, b);
        } else {
            vColor = uColor;
        }
    }
    vec3 vPosition = vec3(position.x, position.y, position.z * uStartTime);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(vPosition, 1.0);
}