import Phaser from 'phaser';
import PanoramaPipeline from './PanoramaPipeline';

class Level3Scene extends Phaser.Scene {
  constructor() {
    super({ key: 'Level3Scene' });
    this.scrollSpeed = { x: 0 };
    this.isDragging = false;
    this.lastDragPosition = { x: 0 };
    this.uPerspective = 0.5;
  }

  preload() {
    this.load.image('panorama', 'assets/scifi_lab/panoramas/bg3.png');
  }

  create() {
    this.panorama = this.add.image(0, 0, 'panorama')
      .setOrigin(0)
      .setDisplaySize(this.scale.width, this.scale.height);
  
    // Register the custom pipeline
    this.renderer.pipelines.add('PanoramaPipeline', new PanoramaPipeline(this.game));
  
    // Apply the pipeline
    this.panorama.setPostPipeline('PanoramaPipeline');
  
    // Make sure the pipeline is set before accessing its properties
    this.pipeline = this.panorama.postPipelines[0];
    if (!this.pipeline) {
      console.error('Pipeline not initialized properly');
      return;  // Exit if pipeline is not initialized
    }
  
    // Try to get the slider from the DOM
    const perspectiveSlider = document.getElementById('perspectiveSlider');
    if (perspectiveSlider) {
      this.pipeline.perspective = parseFloat(perspectiveSlider.value); // sync initial
      perspectiveSlider.addEventListener('input', (event) => {
        this.uPerspective = parseFloat(event.target.value);
        if (this.pipeline) {
          this.pipeline.perspective = this.uPerspective;
        }
      });
    } else {
      console.warn('Slider not found in DOM: #perspectiveSlider');
    }
  
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
      this.pipeline.scroll.x = this.scrollSpeed.x;
      this.pipeline.time = time / 1000;
    }
  }
}

export default Level3Scene;
