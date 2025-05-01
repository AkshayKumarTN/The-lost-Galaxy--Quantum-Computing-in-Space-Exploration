import Phaser from 'phaser';

class Level5Scene extends Phaser.Scene {
  constructor() {
    super({ key: 'Level5Scene' });

    // Button style
    this.buttonStyle = {
      fontSize: '22px',
      fontFamily: 'Arial',
      backgroundColor: '#333',
      color: '#ffffff',
      padding: { x: 20, y: 10 },
      align: 'center',
      fixedWidth: 150
    };
    this.hoverColor = '#555';
    this.defaultColor = '#333';

    // Puzzle parameters
    this.targetAngle = Phaser.Math.Between(0, 180);
    this.currentAngle = 0;
    this.matchThreshold = 10;

    // Door state
    this.doorLocked = true;
    this.doorOpening = false;
  }

  preload() {
    this.load.image('quantumDoor', 'assets/images/quantum_door.png');
    this.load.image('polarizer', 'assets/images/polarizer.png');
    this.load.image('labBg', 'assets/images/quantum_lab.png');
    this.load.image('lightBeam', 'assets/images/light_beam.png');
  }

  create() {
    // --- 背景 ---
    this.add.image(400, 300, 'labBg').setDepth(0);
  
    // --- 光束 ---
    this.lightBeam = this.add.image(400, 300, 'lightBeam')
      .setDisplaySize(80, 600)
      .setAlpha(0.1) // 起始很淡
      .setBlendMode(Phaser.BlendModes.ADD)
      .setDepth(1);
  
    // --- 門 ---
    this.door = this.add.image(400, 300, 'quantumDoor')
      .setDisplaySize(250, 400)
      .setDepth(2);
  
    // --- 標題 ---
    this.add.text(400, 30, 'Quantum Security Door', {
      fontSize: '32px',
      fill: '#00ffff',
      fontFamily: 'Courier',
      backgroundColor: '#000033'
    }).setOrigin(0.5).setDepth(3);
  
    // --- 說明文字 ---
    this.add.text(400, 80, 'Align the quantum polarizer to match the door\'s\nentanglement frequency', {
      fontSize: '18px',
      fill: '#ffffff',
      align: 'center'
    }).setOrigin(0.5).setDepth(3);
  
    // --- 目前角度顯示 ---
    this.angleText = this.add.text(400, 130, `Current Angle: ${this.currentAngle}°`, {
      fontSize: '24px',
      fill: '#ffff00'
    }).setOrigin(0.5).setDepth(3);
  
    // --- Polarizer ---
    this.polarizer = this.add.image(400, 250, 'polarizer')
      .setDisplaySize(120, 120)
      .setInteractive()
      .setAngle(this.currentAngle)
      .setDepth(4);
  
    // --- 控制按鈕 ---
    this.createButton(220, 400, 'Fine -5°', () => this.rotatePolarizer(-5));
    this.createButton(580, 400, 'Fine +5°', () => this.rotatePolarizer(5));
    this.createButton(220, 460, 'Coarse -15°', () => this.rotatePolarizer(-15));
    this.createButton(580, 460, 'Coarse +15°', () => this.rotatePolarizer(15));
  
    // --- 嘗試開門 ---
    this.openButton = this.add.text(400, 520, 'ATTEMPT OPENING', {
      ...this.buttonStyle,
      backgroundColor: '#1a237e',
      fixedWidth: 250
    })
      .setInteractive()
      .on('pointerdown', this.attemptDoorOpen.bind(this))
      .on('pointerover', () => {
        if (this.hoverColor) {
          this.openButton.setStyle({ backgroundColor: this.hoverColor });
        }
      })
      .on('pointerout', () => {
        this.openButton.setStyle({ backgroundColor: '#1a237e' });
      })
      .setOrigin(0.5)
      .setDepth(3);
  
    // --- 提示文字 ---
    this.feedbackText = this.add.text(400, 580, '', {
      fontSize: '24px',
      fill: '#ffffff',
      align: 'center'
    }).setOrigin(0.5).setDepth(3);
  }
  

  createButton(x, y, text, onClick) {
    const btn = this.add.text(x, y, text, this.buttonStyle)
      .setInteractive()
      .on('pointerdown', onClick)
      .on('pointerover', () => {
        if (this.hoverColor) {
          btn.setStyle({ backgroundColor: this.hoverColor });
        }
      })
      .on('pointerout', () => {
        if (this.defaultColor) {
          btn.setStyle({ backgroundColor: this.defaultColor });
        }
      });
    btn.setOrigin(0.5);
    return btn;
  }

  rotatePolarizer(degrees) {
    if (this.doorOpening) return;

    this.currentAngle = (this.currentAngle + degrees) % 360;
    if (this.currentAngle < 0) this.currentAngle += 360;

    this.polarizer.setAngle(this.currentAngle);
    this.angleText.setText(`Current Angle: ${this.currentAngle}°`);

    const angleDiff = Math.min(
      Math.abs(this.currentAngle - this.targetAngle),
      Math.abs(this.currentAngle - (this.targetAngle + 360)),
      Math.abs(this.currentAngle - (this.targetAngle - 360))
    );

    const progress = 1 - Phaser.Math.Clamp(angleDiff / 180, 0, 1);
    this.polarizer.setTint(
      Phaser.Display.Color.GetColor(
        255 * (1 - progress),
        255 * progress,
        100 * progress
      )
    );
  }

  attemptDoorOpen() {
    if (this.doorOpening) return;

    const angleDiff = Math.min(
      Math.abs(this.currentAngle - this.targetAngle),
      Math.abs(this.currentAngle - (this.targetAngle + 360)),
      Math.abs(this.currentAngle - (this.targetAngle - 360))
    );

    if (angleDiff <= this.matchThreshold) {
      this.doorOpening = true;
      this.feedbackText.setText('QUANTUM MATCH! DOOR UNLOCKING...').setColor('#00ff00');

      this.lightBeam.setAlpha(0.8);
      this.tweens.add({
        targets: this.lightBeam,
        alpha: 0.3,
        yoyo: true,
        duration: 300,
        repeat: 3
      });

      this.tweens.add({
        targets: this.door,
        x: 700,
        alpha: 0.5,
        duration: 2000,
        ease: 'Power2',
        onComplete: () => {
          this.feedbackText.setText('ACCESS GRANTED');
        }
      });
    } else {
      this.feedbackText.setText('POLARIZATION MISMATCH!').setColor('#ff0000');

      this.tweens.add({
        targets: [this.polarizer, this.door],
        x: '+=10',
        yoyo: true,
        repeat: 5,
        duration: 50,
        onComplete: () => {
          this.feedbackText.setText('');
        }
      });

      this.cameras.main.flash(200, 255, 0, 0);
    }
  }
}

export default Level5Scene;
