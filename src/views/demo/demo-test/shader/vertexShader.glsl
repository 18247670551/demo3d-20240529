varying vec3 modelPos;
void main() {
    modelPos = position;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}