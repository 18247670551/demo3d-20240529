export const vertexShader = `
uniform float time;
uniform float size;
attribute vec3 toPositions;
attribute vec3 oldPositions;
attribute float toPositionsDuration;

void main() {
    vec3 dispatchPos = position;
    //顶点位置移动
    //当前时间在点的运行时间中占比
    float percent = time / toPositionsDuration;
    //vpercent = percent;
    if(percent <= 1.) {
        dispatchPos.x = oldPositions.x + percent * (toPositions.x - oldPositions.x);
        dispatchPos.y = oldPositions.y + percent * (toPositions.y - oldPositions.y);
        dispatchPos.z = oldPositions.z + percent * (toPositions.z - oldPositions.z);
    } else {
        dispatchPos = toPositions;
    }

    vec4 viewPosition = modelViewMatrix * vec4(dispatchPos, 1.0);
    gl_Position = projectionMatrix * viewPosition;
    gl_PointSize = size;

    //近大远小效果 值自己调节
    gl_PointSize *= (120. / -(modelViewMatrix * vec4(dispatchPos, 1.0)).z);
}
`

export const fragmentShader = `
void main() {
    gl_FragColor = vec4(vec3(0.1, 0.5, 0.4), 0.8);
}
`