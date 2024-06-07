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
