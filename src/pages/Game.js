import { useEffect } from 'react';
import Phaser from 'phaser';

class MainScene extends Phaser.Scene {
  constructor() {
    super({ key: 'MainScene' });
  }

  preload() {
    // Load assets here
    this.load.image('logo', 'assets/images/phaser-logo.png');
  }

  create() {
    // Add logo
    const logo = this.add.image(400, 300, 'logo');
    logo.setScale(0.5);

    // Add text
    this.add.text(400, 500, 'Press Space to Continue', { 
      fontSize: '24px',
      fill: '#ffffff',
      fontFamily: 'Arial'
    }).setOrigin(0.5);

    // Add keyboard input
    this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
  }

  update() {
    if (this.spaceKey.isDown) {
      this.scene.start('MainScene');
    }
  }
}

const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  parent: 'game-container',
  scene: [MainScene],
  physics: {
    default: 'arcade',
    arcade: { gravity: { y: 0 } }
  }
};

export default function Game() {
  useEffect(() => {
    const game = new Phaser.Game(config);
    return () => game.destroy(true);
  }, []);

  return <div id="game-container" style={{ width: '100%', height: '100vh' }} />;
}