attribute vec3 centers;
uniform float time;
void main() {
    float centery = sin(centers.x / 100.0 + time) * 40.0 + sin(centers.z / 100.0 + time) * 40.0;
    vec3 center = vec3(centers.x, 0, centers.z);
    vec3 target = position - center;
    vec3 newPosition = center + target * ((centery + 80.0) / 80.0);
    gl_Position = projectionMatrix * modelViewMatrix * vec4( newPosition.x, newPosition.y + centery, newPosition.z, 1.0 );
}