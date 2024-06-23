varying vec3 vPosition;
uniform float time;

void main() {
    vPosition = position;
    gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}