precision lowp float;

uniform sampler2D uTexture;

varying vec2 vUv;
varying float deep;

void main () {
    // gl_FragColor = vec4(vUv, 0.0, 1.0);

    // float shadow = deep + 0.05 * 10.0;
    // gl_FragColor = vec4(shadow, 0.0, 0.0, 1.0);

    vec4 textureColor = texture2D(uTexture, vUv);
    textureColor.rbg *= deep + 0.05 * 8.0;
    gl_FragColor = textureColor;
}