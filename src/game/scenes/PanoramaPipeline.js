import Phaser from 'phaser';

export default class PanoramaPipeline extends Phaser.Renderer.WebGL.Pipelines.PostFXPipeline {
  constructor(game) {
    super({
      game,
      name: 'PanoramaPipeline',
      fragShader: `
        precision mediump float;
        uniform sampler2D uMainSampler;
        varying vec2 outTexCoord;
        uniform float time;
        uniform float perspective;
        uniform float scrollX;

        void main() {
          vec2 uv = outTexCoord;

          // Wrap X based on scroll
          uv.x += scrollX;
          uv.x = fract(uv.x); 

          // Apply basic cylindrical projection
          float angle = (uv.x - 0.5) * 3.14159 * perspective;
          float depth = cos(angle);
          float xDistort = sin(angle);

          vec2 curvedUV = vec2(xDistort * 0.5 + 0.5, uv.y / depth);

          if (curvedUV.y > 1.0) discard;

          gl_FragColor = texture2D(uMainSampler, curvedUV);
        }
      `
    });

    this.scroll = { x: 0 };
    this.perspective = 0.5;
    this.time = 0;
  }

  onPreRender() {
    this.set1f('time', this.time);
    this.set1f('scrollX', this.scroll.x);
    this.set1f('perspective', this.perspective);
  }
}
