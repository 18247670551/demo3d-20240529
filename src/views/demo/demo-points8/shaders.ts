// 编辑 Shader 的时候使用, fragmentShader.glsl glsl文件编辑, ide有插件支持, 但是 ts 引入 glsl 文件会报错, 需要复制出来以字符串形式引入

export const vertexShader = `
uniform float time;
uniform float size;
attribute vec3 toPosition;
attribute vec3 oldPosition;
attribute float toPositionDuration;

void main() {
    vec3 calcPosition = position;
    float percent = time / toPositionDuration;
    if(percent <= 1.) {
        calcPosition.x = oldPosition.x + percent * (toPosition.x - oldPosition.x);
        calcPosition.y = oldPosition.y + percent * (toPosition.y - oldPosition.y);
        calcPosition.z = oldPosition.z + percent * (toPosition.z - oldPosition.z);
    } else {
        calcPosition = toPosition;
    }

    vec4 viewPosition = modelViewMatrix * vec4(calcPosition, 1.0);
    gl_Position = projectionMatrix * viewPosition;
    gl_PointSize = size;

    //近大远小效果
    gl_PointSize *= (120. / -(modelViewMatrix * vec4(calcPosition, 1.0)).z);
}
`

export const fragmentShader = `
uniform vec4 color;

void main() {
    //gl_FragColor = vec4(vec3(.1, .5, .4), 1);
    gl_FragColor = color;
}
`