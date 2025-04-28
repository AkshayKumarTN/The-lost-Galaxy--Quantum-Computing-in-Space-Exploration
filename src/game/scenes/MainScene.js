import Phaser from 'phaser';

class MainScene extends Phaser.Scene {
  constructor() {
    super({ key: 'MainScene' });
  }

  preload() {
    this.load.image('nebulaBackground', 'assets/images/nebula_space.jpg');
    this.load.image('astronaut', 'assets/images/astronaut.png');
  }

  create() {
    const { width, height } = this.scale;

    const background = this.add.image(width / 2, height / 2, 'nebulaBackground').setOrigin(0.5);
    const scaleX = width / background.width;
    const scaleY = height / background.height;
    background.setScale(Math.min(scaleX, scaleY));

    this.cameras.main.setZoom(1);
    this.cameras.main.setBounds(0, 0, width * 2, height * 2);
    this.cameras.main.scrollX = width / 2;
    this.cameras.main.scrollY = height / 2;

    // Drag camera
    this.input.on('pointerdown', (pointer) => {
      this.startDrag(pointer);
    });

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
      repeat: -1,
    });

    this.input.once('pointerdown', () => {
      this.showIntroDialogue();
    });

    this.add.text(this.cameras.main.width - 150, 20, 'Fullscreen', {
      fontSize: '20px',
      fill: '#fff',
      backgroundColor: '#000',
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

  startDrag(pointer) {
    this.startX = pointer.x;
    this.startY = pointer.y;

    if (!this.dragListener) {
      this.dragListener = (pointer) => {
        if (pointer.isDown) {
          const deltaX = pointer.x - this.startX;
          const deltaY = pointer.y - this.startY;

          this.cameras.main.scrollX -= deltaX;
          this.cameras.main.scrollY -= deltaY;

          this.startX = pointer.x;
          this.startY = pointer.y;
        }
      };
      this.input.on('pointermove', this.dragListener);
    }

    this.input.once('pointerup', () => {
      if (this.dragListener) {
        this.input.off('pointermove', this.dragListener);
        this.dragListener = null;
      }
    });
  }

  showIntroDialogue() {
    const { width, height } = this.scale;
    this.children.removeAll();

    const astronaut = this.add.image(width / 2, height / 2, 'astronaut').setOrigin(0.5);
    const scaleX = (width / astronaut.width) * 0.85;
    const scaleY = (height / astronaut.height) * 0.7;
    astronaut.setScale(Math.min(scaleX, scaleY));

    const dialogue = [
      "Captain, we've received a distress signal...",
      "A lost ship is somewhere in this galaxy, trapped in quantum superposition!",
      "We must use our quantum scanners to determine its true location.",
      "Be careful—choosing the wrong position could trigger a paradox!",
      "Let's begin our mission!",
    ];

    let dialogueIndex = 0;
    const dialogueText = this.add.text(width / 2, height * 0.8, dialogue[dialogueIndex], {
      fontSize: '28px',
      fill: '#ffffff',
      fontFamily: 'Arial',
      wordWrap: { width: width * 0.8 },
      align: 'center',
    }).setOrigin(0.5);

    const nextDialogue = () => {
      dialogueIndex++;
      if (dialogueIndex < dialogue.length) {
        dialogueText.setText(dialogue[dialogueIndex]);
      } else {
        this.input.off('pointerdown', nextDialogue);

        this.tweens.add({
          targets: dialogueText,
          alpha: 0,
          duration: 500,
          onComplete: () => {
            this.scene.start('Level4Scene'); // Change scene to Level 4
          },
        });
      }
    };

    this.input.on('pointerdown', nextDialogue);
  }
}

export default MainScene;
