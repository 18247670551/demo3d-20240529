varying vec3 vPosition;

//太阳色构建
vec3 brightnessToColor(float b) {
    b *= 0.25;
    return (vec3(b, b * b, b * b * b * b) / 0.25);
}

void main() {

    float d = mix(0.3, 0., vPosition.z);
    d = pow(d, 3.);
    vec3 color = brightnessToColor(d);

    gl_FragColor = vec4(vec3(color), 1.);
}