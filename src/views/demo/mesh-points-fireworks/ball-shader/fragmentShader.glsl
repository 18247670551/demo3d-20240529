precision lowp float;
uniform vec3 uColor;

void main() {
    // 默认片元着色器的点是正方形, 用计算每一个像素点到中心的距离产色渐变色的方式, 使点变成圆形
    float strength = 1.0 - distance(gl_PointCoord, vec2(0.5)) * 3.0;
    gl_FragColor = vec4(uColor, strength);
}