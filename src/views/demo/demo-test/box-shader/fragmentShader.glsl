uniform vec3 uColor;
void main() {
    gl_FragColor = vec4(uColor,1.0);
    //gl_FragColor = vec4(1.0,1.0,1.0,1.0);
}