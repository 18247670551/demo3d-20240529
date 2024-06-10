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