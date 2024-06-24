varying vec3 vPosition;
uniform float time;

void main() {
    float time = mod(time, 3.0); //time值对3取模，得到[0,3)范围内的值。
    //由于我们制作红绿灯时用了小技巧，让其z分量比较大，所以可以根据z的值判断是否为红绿灯面。然后在根据y值，判断为哪个灯。
    if (vPosition.z == 6.1 && vPosition.y > 8.0) {
        if (time < 1.0) {//时间为[0,1)红灯
           gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
        } else {
            gl_FragColor = vec4(0.2, 0.0, 0.0, 1.0);
        }
    } else if (vPosition.z == 6.1 && vPosition.y > -8.0) {//时间为[1,2)黄灯
        if (time >= 1.0 && time < 2.0) {
            gl_FragColor = vec4(1.0, 0.7, 0.0, 1.0);
        } else {
            gl_FragColor = vec4(0.2, 0.1, 0.0, 1.0);
        }
    } else if (vPosition.z == 6.1) {//时间为[2,3)绿灯
        if (time >= 2.0) {
            gl_FragColor = vec4(0.0, 1.0, 0.0, 1.0);
        } else {
            gl_FragColor = vec4(0.0, 0.2, 0.0, 1.0);
        }
    } else {//其余部分为灰色
        gl_FragColor = vec4(0.2, 0.2, 0.2, 1.0);
    }
}