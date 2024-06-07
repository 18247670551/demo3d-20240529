precision lowp float;
varying vec4 vPosition;
varying vec4 gPosition;
void main() {
    //模型位置
    vec4 modelPosition = modelMatrix * vec4(position, 1);
    vPosition = modelPosition;
    //当前坐标
    gPosition=vec4(position, 1);
    gl_Position = projectionMatrix * viewMatrix * modelPosition;
}