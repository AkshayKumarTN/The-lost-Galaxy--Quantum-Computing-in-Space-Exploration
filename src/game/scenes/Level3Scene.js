import Phaser from 'phaser';

const panoramaShader = `
precision mediump float;

uniform sampler2D uMainSampler;
uniform float uTime;
uniform vec2 uScroll;
varying vec2 outTexCoord;

void main() {
    vec2 uv = outTexCoord;
    uv.x = mod(uv.x + uScroll.x * uTime, 1.0);
    gl_FragColor = texture2D(uMainSampler, uv);
}
`;

class Level3Scene extends Phaser.Scene {
  constructor() {
    super({ key: 'Level3Scene' });
    this.scrollSpeed = { x: 0 };
    this.isDragging = false;
    this.lastDragPosition = { x: 0 };
  }

  preload() {
    this.load.image('panorama', 'assets/scifi_lab/panoramas/bg3.png');
  }

  create() {
    this.panorama = this.add.image(0, 0, 'panorama').setOrigin(0).setDisplaySize(this.scale.width, this.scale.height);

    const pipeline = this.renderer.addPipeline('PanoramaPipeline', new Phaser.Renderer.WebGL.Pipelines.PostFXPipeline({
      game: this.game,
      renderer: this.renderer,
      fragShader: panoramaShader,
      uniforms: ['uProjectionMatrix', 'uMainSampler', 'uTime', 'uScroll']
    }));

    this.pipeline = pipeline;
    this.pipeline.setFloat1('uTime', 0);
    this.pipeline.setFloat2('uScroll', 0, 0);

    this.panorama.setPostPipeline(this.pipeline);

    this.setupInput();
    this.setupBackButton();
  }

  setupInput() {
    this.input.on('pointerdown', (pointer) => {
      this.isDragging = true;
      this.lastDragPosition.x = pointer.x;
    });

    this.input.on('pointerup', () => {
      this.isDragging = false;
    });

    this.input.on('pointermove', (pointer) => {
      if (this.isDragging) {
        const deltaX = pointer.x - this.lastDragPosition.x;
        this.scrollSpeed.x = deltaX * 0.005;
        this.lastDragPosition.x = pointer.x;
      }
    });
  }

  setupBackButton() {
    this.add.text(30, 30, '← Back', {
      fontSize: '24px',
      fill: '#fff',
      backgroundColor: '#00000050',
      padding: { x: 10, y: 5 }
    })
    .setInteractive()
    .on('pointerdown', () => this.scene.start('MainScene'));
  }

  update(time) {
    if (!this.isDragging) {
      this.scrollSpeed.x *= 0.95;
      if (Math.abs(this.scrollSpeed.x) < 0.001) this.scrollSpeed.x = 0;
    }

    if (this.pipeline) {
      this.pipeline.setFloat1('uTime', time / 1000);
      this.pipeline.setFloat2('uScroll', this.scrollSpeed.x, 0);
    }
  }
}

export default Level3Scene;
