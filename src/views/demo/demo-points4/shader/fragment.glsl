precision lowp float;
varying vec2 vUv;
//5.纹理
uniform sampler2D uTexture;
uniform sampler2D uTexture1;
uniform sampler2D uTexture2;

varying float vImgIndex;
varying vec3 vColor;

void main(){
   //2.vUv不能用，用gl_PointCoord
   // gl_FragColor = vec4(gl_PointCoord,0.0,1.0);

   //3.渐变圆
   // float strength = distance(gl_PointCoord,vec2(0.5));
   // strength *= 2.0;
   // strength = 1.0 - strength;
   // gl_FragColor = vec4(strength);

   //4.圆形点
   // float strength = 1.0 - distance(gl_PointCoord,vec2(0.5));
   // strength = step(0.5,strength);
   // gl_FragColor = vec4(strength);

   //5.根据纹理设置图案
   // vec4 textureColor = texture2D(uTexture,gl_PointCoord);
   // gl_FragColor = vec4(textureColor);

   //6.根据点的位置设置渐变
   // vec4 textureColor = texture2D(uTexture,gl_PointCoord);
   // gl_FragColor = vec4(gl_PointCoord,1.0,textureColor.r);

   //7.根据index判断使用哪个texture
   vec4 textureColor;
   if(vImgIndex==0.0){
      textureColor = texture2D(uTexture,gl_PointCoord);
   }else if(vImgIndex==1.0){
      textureColor = texture2D(uTexture1,gl_PointCoord);
   }else{
      textureColor = texture2D(uTexture2,gl_PointCoord);
   }
   gl_FragColor = vec4(vColor,textureColor.r);
}