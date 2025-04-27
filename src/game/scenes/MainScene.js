import Phaser from 'phaser';

class MainScene extends Phaser.Scene {
  constructor() {
    super({ key: 'MainScene' });
  }

  preload() {
    // Load the nebula background
    this.load.image('nebulaBackground', 'assets/images/nebula_space.jpg'); 
    this.load.image('astronaut', 'assets/images/astronaut.png');
  }

  create() {
    const { width, height } = this.scale;

    // Add nebula background and center it
    const background = this.add.image(width / 2, height / 2, 'nebulaBackground').setOrigin(0.5);

    // Scale the background to fit the screen, but maintain aspect ratio
    const scaleX = width / background.width;
    const scaleY = height / background.height;
    background.setScale(Math.min(scaleX, scaleY));

    // Set camera zoom to fit the entire scene (no zoom-in)
    this.cameras.main.setZoom(1);  // Default zoom level (1 is 100%)

    // Allow the camera to scroll freely in all directions (up/down/left/right)
    this.cameras.main.setBounds(0, 0, width * 2, height * 2);  // Expand bounds for free movement
    this.cameras.main.scrollX = width / 2;  // Start camera at the center
    this.cameras.main.scrollY = height / 2;

    // Enable drag input for the camera to allow movement
    this.input.on('pointerdown', (pointer) => {
      this.startDrag(pointer);
    });

    // "Tap to Start" text at the bottom
    const startText = this.add.text(width / 2, height * 0.85, 'Tap to Start', {
      fontSize: '32px',
      fill: '#ffffff',
      fontFamily: 'Arial',
    }).setOrigin(0.5);

    // Blinking effect for "Tap to Start"
    this.tweens.add({
      targets: startText,
      alpha: { from: 1, to: 0.3 },
      duration: 1000,
      yoyo: true,
      repeat: -1
    });

    // Click to start the dialogue sequence
    this.input.once('pointerdown', () => {
      this.showIntroDialogue();
    });

    // Fullscreen toggle button
    this.add.text(this.cameras.main.width - 150, 20, 'Fullscreen', {
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

  startDrag(pointer) {
    // Store the starting position of the pointer for dragging
    this.startX = pointer.x;
    this.startY = pointer.y;

    // Start dragging (update camera position based on pointer movement)
    this.input.on('pointermove', (pointer) => {
      if (pointer.isDown) {
        const deltaX = pointer.x - this.startX;
        const deltaY = pointer.y - this.startY;
        
        // Update camera position
        this.cameras.main.scrollX -= deltaX;
        this.cameras.main.scrollY -= deltaY;

        // Update starting position for next drag movement
        this.startX = pointer.x;
        this.startY = pointer.y;
      }
    });

    // Stop dragging when pointer is released
    this.input.on('pointerup', () => {
      this.input.off('pointermove');
    });
  }

  showIntroDialogue() {
    const { width, height } = this.scale;
    this.children.removeAll(); // Clear previous elements

    // Add astronaut image slightly smaller (90% of full screen)
    const astronaut = this.add.image(width / 2, height / 2, 'astronaut').setOrigin(0.5);

    // Scale astronaut to fit within screen
    const scaleX = (width / astronaut.width) * 0.85;
    const scaleY = (height / astronaut.height) * 0.7;
    astronaut.setScale(Math.min(scaleX, scaleY)); // Use Math.min for maintaining aspect ratio

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
        // Fade-out effect before starting Level 3
        this.tweens.add({
          targets: dialogueText,
          alpha: 0,
          duration: 500,
          onComplete: () => {
            this.scene.start('Level4Scene'); // Start Level 3 scene after fading out
          }
        });
      }
    };

    // Set input event to advance dialogue
    this.input.on('pointerdown', nextDialogue);
  }
}

export default MainScene;
