uniform sampler2D uTexture;
uniform sampler2D uDepthTexture;
uniform vec2 uMouse;
varying vec2 vUv;
uniform float uTime;

void main() {
    vec4 color = texture2D(uTexture, vUv);
    vec4 depth = texture2D(uDepthTexture, vUv);
    float depthValue = depth.r;
    float x = vUv.x + (uMouse.x+sin(uTime))*0.01*depthValue;
    float y = vUv.y + (uMouse.y+cos(uTime))*0.01*depthValue;
    vec4 newColor = texture2D(uTexture, vec2(x, y));
    gl_FragColor = newColor;
}
