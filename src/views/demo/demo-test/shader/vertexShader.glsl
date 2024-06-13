precision lowp float;
uniform float uTime;
void main(){
    vec4 modelPosition = modelMatrix * vec4(position,1.0);

    modelPosition.x += uTime * 0.5;
    modelPosition.y += uTime * 0.5;
    modelPosition.z += uTime * 0.5;

    vec4 viewPosition = viewMatrix * modelPosition;

    gl_Position = projectionMatrix * viewPosition;

    gl_PointSize = 10.;
}