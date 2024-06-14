uniform vec3 uColor;
void main() {
    float distanceTo = distance(gl_PointCoord , vec2(0.5));
    float str = distanceTo * 2.0;
    str = 1.0 - str;
    str = pow(str,1.5);
    gl_FragColor = vec4(uColor,str);
}