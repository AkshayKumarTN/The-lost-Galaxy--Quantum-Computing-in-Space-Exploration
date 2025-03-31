import { useEffect } from 'react';
import Phaser from 'phaser';

class MainScene extends Phaser.Scene {
  constructor() {
    super({ key: 'MainScene' });
  }

  preload() {
    this.load.image('startScreen', '/assets/images/start-screen.png');
  }

  create() {
    const { width, height } = this.scale;

    // Add the background image and center it
    const background = this.add.image(width / 2, height / 2, 'startScreen');
    background.setOrigin(0.5, 0.5);

    // Ensure the entire image fits inside the screen while maintaining aspect ratio
    const scaleX = width / background.width;
    const scaleY = height / background.height;
    const scale = Math.min(scaleX, scaleY); // Use the smaller scale to fit completely
    background.setScale(scale);

    // Add "Tap to Start" text at the bottom
    const startText = this.add.text(width / 2, height * 0.85, 'Tap to Start', {
      fontSize: '32px',
      fill: '#ffffff',
      fontFamily: 'Arial',
    }).setOrigin(0.5);

    this.tweens.add({
      targets: startText,
      alpha: { from: 1, to: 0.3 },
      duration: 1000,
      yoyo: true,
      repeat: -1
    });

    // Pointer input for scene transition
    this.input.on('pointerdown', () => {
      this.scene.start('GameScene');
    });

    // Handle resizing
    this.scale.on('resize', this.resizeGame, this);
  }

  resizeGame(gameSize) {
    const { width, height } = gameSize;
    this.cameras.main.setSize(width, height);

    const background = this.children.getByName('background');
    if (background) {
      background.setPosition(width / 2, height / 2);
      const scaleX = width / background.width;
      const scaleY = height / background.height;
      background.setScale(Math.min(scaleX, scaleY)); // Fit without cropping
    }

    const startText = this.children.getByName('startText');
    if (startText) {
      startText.setPosition(width / 2, height * 0.85);
    }
  }
}

const config = {
  type: Phaser.AUTO,
  width: window.innerWidth,
  height: window.innerHeight,
  parent: 'game-container',
  scene: [MainScene],
  physics: {
    default: 'arcade',
    arcade: { gravity: { y: 0 } }
  },
  scale: {
    mode: Phaser.Scale.FIT, // Ensure the entire image fits inside the screen
    autoCenter: Phaser.Scale.CENTER_BOTH
  }
};

export default function Game() {
  useEffect(() => {
    const game = new Phaser.Game(config);
    return () => game.destroy(true);
  }, []);

  return <div id="game-container" style={{ width: '100%', height: '100vh' }} />;
}