precision lowp float;
attribute float imgIndex;
varying float vImgIndex;
varying vec2 vUv;
uniform float uTime;
varying vec3 vColor;
void main() {
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);

    //获取顶点的角度
    float angle = atan(modelPosition.x, modelPosition.z);
    //获取顶点到中心的距离
    float distanceToCenter = length(modelPosition.xz);
    //根据顶点到中心的距离，设置旋转偏移的度数
    float angleOffset = 1.0 / distanceToCenter * uTime;
    //目前旋转的度数
    angle += angleOffset;
    modelPosition.x = cos(angle) * distanceToCenter;
    modelPosition.z = cos(angle) * distanceToCenter;

    vec4 viewPosition = viewMatrix * modelPosition;
    gl_Position = projectionMatrix * viewPosition;


    //1.设置点大小
    // gl_PointSize = 80.0;
    //根据viewPosition的z坐标决定是否远离摄像机
    gl_PointSize = 100.0 / -viewPosition.z;
    vImgIndex = imgIndex;
    vColor = color;
}