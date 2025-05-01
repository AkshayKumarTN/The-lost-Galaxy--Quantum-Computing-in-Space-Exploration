import Phaser from 'phaser';

export default class Level3Scene extends Phaser.Scene {
  constructor() {
    super({ key: 'Level3Scene' });
    this.doorUnlocked = false;
    this.secureKey = '';
  }

  preload() {
    this.load.image('spaceBackground', 'assets/Background/star-bg.jpg');
    this.load.image('lockedDoor', 'assets/images/locked_door.png');
    this.load.image('unlockedDoor', 'assets/images/unlocked_door.png');
    this.load.audio('unlockSuccess', 'assets/sounds/unlock_success.mp3');
  }

  create() {
    // Fetch the secret key from backend
    this.retrieveSecretKeyFromDatabase();
  
    // Center and scale background
    const bg = this.add.image(0, 0, 'spaceBackground').setOrigin(0.5);
    bg.setPosition(this.cameras.main.width / 2, this.cameras.main.height / 2);
    const scaleX = this.cameras.main.width / bg.width;
    const scaleY = this.cameras.main.height / bg.height;
    const scale = Math.max(scaleX, scaleY);
    bg.setScale(scale);
  
    // Door - Center and scale proportionally (optional)
    this.door = this.add.image(this.cameras.main.width / 2, this.cameras.main.height / 2, 'lockedDoor').setInteractive();
  
    // Optional: Scale door to fit a portion of screen (e.g., 30% width)
    const doorTargetWidth = this.cameras.main.width * 0.3;
    const doorScale = doorTargetWidth / this.door.width;
    this.door.setScale(doorScale);
  
    // Instruction text
    this.instructionText = this.add.text(this.cameras.main.width / 2, this.cameras.main.height - 100, 'Retrieving Key...', {
      fontSize: '24px',
      color: '#ffffff',
    }).setOrigin(0.5);
  
    // Result text
    this.resultText = this.add.text(this.cameras.main.width / 2, this.cameras.main.height - 50, '', {
      fontSize: '20px',
      color: '#00ff00',
    }).setOrigin(0.5);
  
    // Sound
    this.unlockSuccessSound = this.sound.add('unlockSuccess');
  
    // Door click event
    this.door.on('pointerdown', () => {
      if (!this.secureKey) {
        this.resultText.setColor('#ff0000');
        this.resultText.setText('Still retrieving key...');
        return;
      }
  
      if (!this.doorUnlocked) {
        this.attemptUnlock();
      }
    });
  }
  
  attemptUnlock() {
    this.unlockDoor();
  }

  unlockDoor() {
    this.doorUnlocked = true;
    this.door.setTexture('unlockedDoor');
    this.resultText.setText('Door Unlocked! Proceed.');
    this.unlockSuccessSound.play();

    // Move to the next scene after delay
    this.time.delayedCall(2000, () => {
      this.scene.start('Level4Scene');
    });
  }

  retrieveSecretKeyFromDatabase() {
    const apiUrl = 'http://localhost:5000/api/Level3Scene';

    fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(res => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then(data => {
        if (data.secretKey) {
          this.secureKey = data.secretKey;
          console.log('Retrieved secret key:', this.secureKey);
          this.instructionText.setText('Tap the door to unlock!');
        } else {
          console.error('Secret key missing from API response');
          this.instructionText.setText('Error: Key not received');
        }
      })
      .catch(error => {
        console.error('Error retrieving secret key:', error.message);
        this.instructionText.setText('Error retrieving key.');
      });
  }
}
