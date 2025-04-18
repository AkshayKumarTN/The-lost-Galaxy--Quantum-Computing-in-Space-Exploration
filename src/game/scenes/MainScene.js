import Phaser from 'phaser';

class MainScene extends Phaser.Scene {
  constructor() {
    super({ key: 'MainScene' });
  }

  preload() {
    this.load.image('startScreen', 'assets/images/start-screen.png');
    this.load.image('astronaut', 'assets/images/astronaut.png');
  }

  create() {
    const { width, height } = this.scale;
    const background = this.add.image(width / 2, height / 2, 'startScreen').setOrigin(0.5);
    const scale = Math.max(width / background.width, height / background.height);
    background.setScale(scale).setScrollFactor(0);

    // Fullscreen button positioning improvement
    const fullscreenText = this.add.text(width - 160, 30, 'Fullscreen', {
      fontSize: '24px',
      fill: '#ffffff',
      backgroundColor: '#00000050',
      padding: { x: 10, y: 5 }
    })
    .setOrigin(0.5)
    .setInteractive()
    .on('pointerdown', () => {
      this.scale.toggleFullscreen();
    });

    // Start text animation improvement
    const startText = this.add.text(width / 2, height * 0.85, 'Tap to Start', {
      fontSize: 'clamp(20px, 4vw, 32px)',
      fill: '#ffffff',
      fontFamily: 'Arial',
      stroke: '#000',
      strokeThickness: 2
    }).setOrigin(0.5);

    this.tweens.add({
      targets: startText,
      alpha: { from: 1, to: 0.3 },
      duration: 800,
      yoyo: true,
      repeat: -1
    });

    this.input.once('pointerdown', () => {
      this.showIntroDialogue();
    });
  }

  showIntroDialogue() {
    const { width, height } = this.scale;
    this.children.removeAll();

    const astronaut = this.add.image(width / 2, height / 2, 'astronaut').setOrigin(0.5);
    const scale = Math.min(
      (width * 0.8) / astronaut.width,
      (height * 0.6) / astronaut.height
    );
    astronaut.setScale(scale);

    const dialogue = [
      "Captain, we've received a distress signal...",
      "A lost ship is somewhere in this galaxy, trapped in quantum superposition!",
      "We must use our quantum scanners to determine its true location.",
      "Be careful—choosing the wrong position could trigger a paradox!",
      "Let's begin our mission!"
    ];

    let dialogueIndex = 0;
    const dialogueText = this.add.text(width / 2, height * 0.75, dialogue[dialogueIndex], {
      fontSize: 'clamp(18px, 3vw, 28px)',
      fill: '#ffffff',
      fontFamily: 'Arial',
      wordWrap: { width: width * 0.8 },
      align: 'center',
      lineSpacing: 10,
      backgroundColor: '#00000070'
    }).setOrigin(0.5, 0);

    const nextButton = this.add.text(width / 2, height * 0.9, 'Tap to Continue', {
      fontSize: 'clamp(16px, 2.5vw, 24px)',
      fill: '#ffff00',
      fontStyle: 'italic'
    }).setOrigin(0.5).setAlpha(0.8);

    const nextDialogue = () => {
      dialogueIndex++;
      if (dialogueIndex < dialogue.length) {
        dialogueText.setText(dialogue[dialogueIndex]);
        this.tweens.killTweensOf(nextButton);
        nextButton.setAlpha(0.8);
        this.tweens.add({
          targets: nextButton,
          alpha: 0.4,
          duration: 800,
          yoyo: true,
          repeat: -1
        });
      } else {
        this.input.off('pointerdown', nextDialogue);
        this.scene.start('Level3Scene');
      }
    };

    this.tweens.add({
      targets: nextButton,
      alpha: 0.4,
      duration: 800,
      yoyo: true,
      repeat: -1
    });

    this.input.on('pointerdown', nextDialogue);
  }
}

export default MainScene;