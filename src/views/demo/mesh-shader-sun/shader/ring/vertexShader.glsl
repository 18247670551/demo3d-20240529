uniform float uTime;
varying vec3 vPosition;

mat2 rotate(float a){
    float s = sin(a);
    float c = cos(a);
    return mat2(c,-s,s,c);
}

void main() {
    vPosition = position;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}