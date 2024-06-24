precision lowp float;
uniform sampler2D uTexture;
varying vec2 vUv;
varying float deep;

void main() {
    vec4 textureColor = texture2D(uTexture, vUv);
    textureColor.rbg *= deep + 0.05 * 8.0;
    gl_FragColor = textureColor;
}