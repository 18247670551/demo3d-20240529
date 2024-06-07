
export const basicVertexShader = `
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
`


export const basicFragmentShader = `
precision lowp float;
varying vec4 vPosition;
varying vec4 gPosition;
void main() {
     vec4 redColor = vec4(1,0,0,1);
     vec4 yellowColor = vec4(1,1,0,1);
     //y轴混合颜色——黄红
     vec4 mixColor = mix(yellowColor,redColor,gPosition.y / 0.8);
     gl_FragColor = vec4(mixColor.xyz,1);

     //判断正面还是反面
     if(gl_FrontFacing){
        gl_FragColor = vec4(mixColor.xyz - (vPosition.y-20.0) / 60.0 - 0.1,1);
     }else{
        gl_FragColor = vec4(mixColor.xyz,1);
     }
}
`


export const fireworkVertexShader = `
precision lowp float;
attribute float aScale;
attribute vec3 aRandom;

uniform float uTime;
uniform float uSize;
void main(){
    vec4 modelPosition = modelMatrix * vec4(position,1.0);

    modelPosition.xyz += aRandom * uTime * 10.0;

    vec4 viewPosition = viewMatrix * modelPosition;

    gl_Position = projectionMatrix * viewPosition;

    gl_PointSize = uSize * aScale - (uTime * 10.0);
}
`


export const fireworkFragmentShader = `
precision lowp float;
uniform vec3 uColor;
void main(){
   float distanceToCenter = distance(gl_PointCoord,vec2(0.5));

   float strength = distanceToCenter * 2.0;

   strength = 1.0 - strength;

   strength = pow(strength,1.5);
   
   gl_FragColor = vec4(uColor,strength);
}
`

export const startpointVertexShader = `
precision lowp float;
attribute vec3 aStep;

uniform float uTime;
uniform float uSize;
void main(){
    vec4 modelPosition = modelMatrix * vec4(position,1.0);

    modelPosition.xyz += (aStep*uTime);

    vec4 viewPosition = viewMatrix * modelPosition;

    gl_Position = projectionMatrix * viewPosition;

    gl_PointSize = uSize;
}
`


export const startpointFragmentShader = `
precision lowp float;
uniform vec3 uColor;
void main(){
   float distanceToCenter = distance(gl_PointCoord,vec2(0.5));

   float strength = distanceToCenter * 2.0;

   strength = 1.0 - strength;

   strength = pow(strength,1.5);
   
   gl_FragColor = vec4(uColor,strength);
}
`