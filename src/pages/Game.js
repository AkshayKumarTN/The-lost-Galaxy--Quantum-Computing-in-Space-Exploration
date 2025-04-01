import { useEffect } from 'react';
import Phaser from 'phaser';
import Level1Superposition from './Level1-superposition.js';

class MainScene extends Phaser.Scene {
  constructor() {
    super({ key: 'MainScene' });
  }

  preload() {
    this.load.image('startScreen', 'assets/images/start-screen.png');
  }

  create() {
    const { width, height } = this.scale;

    // Add the background image and center it
    const background = this.add.image(width / 2, height / 2, 'startScreen').setOrigin(0.5);

    // Scale the image to fit the screen while maintaining aspect ratio
    const scaleX = width / background.width;
    const scaleY = height / background.height;
    background.setScale(Math.min(scaleX, scaleY));

    // Add "Tap to Start" text at the bottom
    const startText = this.add.text(width / 2, height * 0.85, 'Tap to Start', {
      fontSize: '32px',
      fill: '#ffffff',
      fontFamily: 'Arial',
    }).setOrigin(0.5);

    // Blinking effect
    this.tweens.add({
      targets: startText,
      alpha: { from: 1, to: 0.3 },
      duration: 1000,
      yoyo: true,
      repeat: -1
    });

    // Click to transition to IntroScene
    this.input.on('pointerdown', () => {
      this.scene.start('IntroScene');
    });

    this.scale.on('resize', this.resizeGame, this);
  }

  resizeGame(gameSize) {
    if (this.cameras && this.cameras.main) {
      this.cameras.main.setSize(gameSize.width, gameSize.height);
    }
  }
}

// Intro Scene with Animated Dialogue
class IntroScene extends Phaser.Scene {
  constructor() {
    super({ key: 'IntroScene' });
  }

  preload() {
    this.load.image('astronaut', 'assets/images/astronaut.png');
  }

  create() {
    const { width, height } = this.scale;
    this.add.image(width / 2, height / 2, 'astronaut').setOrigin(0.5);

    const dialogue = [
      "Captain, we've received a distress signal...",
      "A lost ship is somewhere in this galaxy, trapped in quantum superposition!",
      "We must use our quantum scanners to determine its true location.",
      "Be careful—choosing the wrong position could trigger a paradox!",
      "Let's begin our mission!"
    ];

    let dialogueIndex = 0;
    const dialogueText = this.add.text(width / 2, height * 0.8, dialogue[dialogueIndex], {
      fontSize: '28px',
      fill: '#ffffff',
      fontFamily: 'Arial',
      wordWrap: { width: width * 0.8 },
      align: 'center'
    }).setOrigin(0.5);

    this.input.on('pointerdown', () => {
      dialogueIndex++;
      if (dialogueIndex < dialogue.length) {
        dialogueText.setText(dialogue[dialogueIndex]);
      } else {
        this.scene.start('Level1Superposition'); // Transition correctly
      }
    });
  }
}

const config = {
  type: Phaser.AUTO,
  width: window.innerWidth,
  height: window.innerHeight,
  parent: 'game-container',
  scene: [MainScene, IntroScene, Level1Superposition], // Include Level1Superposition
  scale: {
    mode: Phaser.Scale.FIT,
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