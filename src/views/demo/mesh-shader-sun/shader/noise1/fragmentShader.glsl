uniform float uTime;
varying vec2 vUv;
uniform samplerCube uPerlin;
varying vec3 vPosition;
varying vec3 vNormal;
varying vec3 vLayer0;
varying vec3 vLayer1;
varying vec3 vLayer2;
varying vec3 eyeVector;
const float PI = 3.14159265359;


vec3 brightnessToColor(float b) {
    b *= 0.25;
    return (vec3(b, b * b, b * b * b * b) / 0.25) * 0.7;
}

//将各个图层的纹理叠加整合
float sun() {
    float sum = 0.0;
    sum += textureCube(uPerlin, vLayer0).r;
    sum += textureCube(uPerlin, vLayer1).r;
    sum += textureCube(uPerlin, vLayer2).r;
    sum *= 0.40;
    return sum;
}

//菲涅耳计算
float Fresnel(vec3 eyeVector, vec3 worldNormal) {
    return pow(1.3 + dot(eyeVector, worldNormal), 4.0);
}


void main()

{
    //获取纹理
    float brightness = sun();
    //增加对比度
    brightness = brightness * 4.0 + 1.0;
    //菲涅耳计算模拟反射和折射的光照
    float fres = Fresnel(eyeVector, vNormal);
    brightness += fres;
    //获取太阳的颜色
    vec3 color = brightnessToColor(brightness);
    gl_FragColor = vec4(color, 1.0);

}