uniform vec3 u_color;

uniform float time;
uniform float u_height;

varying float v_opacity;

void main() {

    vec3 vPosition = position * mod(time, 1.0);

    v_opacity = mix(1.0, 0.0, position.y / u_height);

    gl_Position = projectionMatrix * modelViewMatrix * vec4(vPosition, 1.0);
}