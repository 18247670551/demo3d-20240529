precision lowp float;
uniform float uTime;
attribute vec3 endPosition;
attribute float duration;

void main() {
    vec3 calcPosition = position;
    float percent = uTime / duration;
    if (percent <= 1.) {
        calcPosition.x = endPosition.x * percent * 0.1;
        calcPosition.y = endPosition.y * percent * 0.1;
        calcPosition.z = endPosition.z * percent * 0.1;
    } else {
        calcPosition.x = 0.;
        calcPosition.y = 0.;
        calcPosition.z = 0.;
    }

    vec4 viewPosition = modelViewMatrix * vec4(calcPosition, 1.0);
    gl_Position = projectionMatrix * viewPosition;

    gl_PointSize = 2.;
}