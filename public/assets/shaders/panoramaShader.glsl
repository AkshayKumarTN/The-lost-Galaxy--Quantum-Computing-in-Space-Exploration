precision mediump float;

uniform sampler2D uTexture;
uniform vec2 uDirection;
uniform float uPerspective;

varying vec2 outTexCoord;

void main() {
    vec2 uv = outTexCoord;
    
    // Base scrolling
    uv = mod(uv + uDirection * 0.01, 1.0);
    
    // Perspective distortion
    uv.x = (uv.x - 0.5) * (1.0 + uPerspective) + 0.5;
    
    gl_FragColor = texture2D(uTexture, uv);
}