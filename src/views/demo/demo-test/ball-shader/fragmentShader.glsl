uniform vec3 uColor;
void main() {
    float str = 1.0 - distance(gl_PointCoord , vec2(0.5)) * 3.0;
    gl_FragColor = vec4(uColor,str);
}