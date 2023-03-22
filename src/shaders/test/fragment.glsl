precision mediump float;

varying float vRandom;
varying vec2 vUv;
varying float vElevation;

uniform vec3 uColor;
uniform sampler2D uTextures;

void main() {
    // gl_FragColor = vec4(0.5, vRandom, 1.0, 1.0);
    vec4 textureColor = texture2D(uTextures, vUv);
    textureColor.rgb += vElevation;
    gl_FragColor = textureColor;

    // gl_FragColor = vec4(vUv, 1.0, 1.0);
}