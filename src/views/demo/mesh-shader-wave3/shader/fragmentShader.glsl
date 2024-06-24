varying float vElevation;
uniform vec3 uLowColor;
uniform vec3 uHighColor;
uniform float uOpacity;

void main() {
    float a = (vElevation + 1.0) / 2.0;
    // 混合颜色
    vec3 color = mix(uLowColor, uHighColor, a);
    gl_FragColor = vec4(color, uOpacity);
}