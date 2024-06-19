uniform vec3 targetColor;
uniform float height;
varying vec3 vPosition;

void main() {
    gl_FragColor = vec4(targetColor.xyz, (1.0 - vPosition.y / height) * (1.0 - vPosition.y / height));
}