precision lowp float;
uniform float uTime;
attribute vec3 endPosition;
attribute float duration;

float random(vec2 st) {
    // 使用dot点乘将两个二维向量转换成一个随机数, 一个选择position的xy, 另一个随便写
    return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453);
}


float random2(float seed1, float seed2) {
    // sin(seed1)  //取[-1, 1]之间随机数
    // * seed2  //egg: seed2=43758.5453, 将上一步的随机数拉伸到[-43758.5453, 43758.5453]之间, 目的是增大随机性
    // fract()  //获取小数部分, 目的是将[-43758.5453, 43758.5453]重新压到[0, 1]之间
    float random = fract(sin(seed1) * seed2);
    return random;
}

void main() {
    vec3 calcPosition = position;
    float percent = uTime / duration;



    if (percent <= 1.) {
        calcPosition.x = endPosition.x * percent * 0.1;
        calcPosition.y = endPosition.y * percent * 0.1;
        calcPosition.z = endPosition.z * percent * 0.1;
    } else {
        calcPosition.x = 0.;
        calcPosition.y = 0.;
        calcPosition.z = 0.;
    }

    vec4 viewPosition = modelViewMatrix * vec4(calcPosition, 1.0);
    gl_Position = projectionMatrix * viewPosition;

    gl_PointSize = 2.;
}