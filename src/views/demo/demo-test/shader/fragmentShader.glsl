uniform vec3 targetColor;
uniform float height;
uniform float time;
varying vec3 modelPos;
float noise(vec3 p)
{
    vec3 i = floor(p);
    vec4 a = dot(i, vec3(1., 57., 21.)) + vec4(0., 57., 21., 78.);
    vec3 f = cos((p - i) * acos(-1.)) * (-.5) + .5;
    return mix(a.x, a.y, f.z);
}
void main() {
    vec3 n = vec3(noise(modelPos + time));
    vec3 c = mix(targetColor, n, 0.7);
    gl_FragColor = vec4(c, (1.0 - modelPos.z / height) * (1.0 - modelPos.z / height) * (1.0 - modelPos.z / height));
}