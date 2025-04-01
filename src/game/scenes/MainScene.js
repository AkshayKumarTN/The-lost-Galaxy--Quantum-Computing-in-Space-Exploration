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

    // Click to start dialogue sequence
    this.input.once('pointerdown', () => {
      this.showIntroDialogue();
    });

    // Fullscreen toggle button
    const fullscreenButton = this.add.text(this.cameras.main.width - 150, 20, 'Fullscreen', {
      fontSize: '20px',
      fill: '#fff',
      backgroundColor: '#000'
    })
    .setOrigin(0.5, 0)
    .setInteractive()
    .on('pointerdown', () => {
      if (this.scale.isFullscreen) {
        this.scale.stopFullscreen();
      } else {
        this.scale.startFullscreen();
      }
    });
  }

  showIntroDialogue() {
    const { width, height } = this.scale;
    this.children.removeAll(); // Clear previous elements

    // Add astronaut image slightly smaller (90% of full screen)
    const astronaut = this.add.image(width / 2, height / 2, 'astronaut').setOrigin(0.5);

    // Scale astronaut to 90% instead of full screen
    const scaleX = (width / astronaut.width) * 0.85;
    const scaleY = (height / astronaut.height) * 0.7;
    astronaut.setScale(Math.max(scaleX, scaleY));

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

    // Function to advance dialogue
    const nextDialogue = () => {
      dialogueIndex++;
      if (dialogueIndex < dialogue.length) {
        dialogueText.setText(dialogue[dialogueIndex]);
      } else {
        this.input.off('pointerdown', nextDialogue); // Remove event listener
        this.scene.start('Level1Scene'); // Go to Level 1
      }
    };

    // Set input event to advance dialogue
    this.input.on('pointerdown', nextDialogue);
  }
}

export default MainScene;
