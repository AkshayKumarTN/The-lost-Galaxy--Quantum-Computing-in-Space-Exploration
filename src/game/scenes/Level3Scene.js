import Phaser from 'phaser';

class Level3Scene extends Phaser.Scene {
  constructor() {
    super({ key: 'Level3Scene' });
    
    // 复用Level2的按钮样式
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
    
    // 量子偏振谜题参数
    this.targetAngle = 60; // 目标角度60度
    this.currentAngle = 0;
    this.matchThreshold = 15; // 允许误差±15度
  }

  preload() {
    // 完全复用Level2的素材
    this.load.image('playerShip', 'assets/images/playerShip.png');
    this.load.image('lostShip', 'assets/images/lostShip.png');
    this.load.image('filterRect', 'assets/images/filter_rectilinear.png');
  }

  create() {
    // 复用Level2的背景和飞船
    this.add.image(400, 300, 'space_bg');
    this.lostShip = this.add.image(150, 300, 'lostShip').setDisplaySize(500, 500);
    this.playerShip = this.add.image(650, 300, 'playerShip').setDisplaySize(500, 500);
    
    // 标题（修改为Level3）
    this.add.text(400, 50, 'Level 3: Quantum Polarization Puzzle', { 
      fontSize: '32px', 
      fill: '#ffffff' 
    }).setOrigin(0.5);

    // 使用filterRect作为偏振滤镜
    this.polarizer = this.add.image(400, 300, 'filterRect')
      .setDisplaySize(150, 150)
      .setInteractive()
      .setAngle(this.currentAngle);

    // 旋转控制按钮（复用Level2样式）
    this.add.text(300, 450, '← Rotate -15°', this.buttonStyle)
      .setInteractive()
      .on('pointerdown', () => this.rotatePolarizer(-15))
      .on('pointerover', (btn) => btn.setStyle({ backgroundColor: this.hoverColor }))
      .on('pointerout', (btn) => btn.setStyle({ backgroundColor: this.defaultColor }));

    this.add.text(500, 450, 'Rotate +15° →', this.buttonStyle)
      .setInteractive()
      .on('pointerdown', () => this.rotatePolarizer(15))
      .on('pointerover', (btn) => btn.setStyle({ backgroundColor: this.hoverColor }))
      .on('pointerout', (btn) => btn.setStyle({ backgroundColor: this.defaultColor }));

    // 验证按钮
    this.add.text(400, 520, 'CHECK MATCH', {
      ...this.buttonStyle,
      backgroundColor: '#1a237e'
    })
      .setInteractive()
      .on('pointerdown', this.checkMatch.bind(this));

    // 返回按钮（与Level2一致）
    this.add.text(400, 580, 'Back to Level 2', {
      fontSize: '24px',
      fill: '#f00',
      backgroundColor: '#000',
      padding: { x: 20, y: 10 }
    })
      .setInteractive()
      .on('pointerdown', () => this.scene.start('Level2Scene'));
  }

  rotatePolarizer(degrees) {
    this.currentAngle += degrees;
    this.polarizer.setAngle(this.currentAngle);
    
    // 实时颜色反馈
    const matchProgress = 1 - Math.min(
      Math.abs(this.currentAngle - this.targetAngle) / 180, 
      1
    );
    this.polarizer.setTint(
      Phaser.Display.Color.GetColor(
        255 * (1 - matchProgress),
        255 * matchProgress,
        0
      )
    );
  }

  checkMatch() {
    const angleDiff = Math.abs(this.currentAngle - this.targetAngle);
    const normalizedDiff = Math.min(angleDiff, 360 - angleDiff);
    
    if (normalizedDiff <= this.matchThreshold) {
      // 成功效果：复用Level2的闪光动画
      this.tweens.add({
        targets: [this.polarizer, this.lostShip],
        alpha: 0.5,
        yoyo: true,
        duration: 300,
        repeat: 3,
        onComplete: () => {
          this.add.text(400, 200, 'POLARIZATION MATCHED!\nQuantum Entanglement Achieved!', {
            fontSize: '28px',
            fill: '#0f0',
            align: 'center'
          }).setOrigin(0.5);
        }
      });
    } else {
      // 失败效果
      this.polarizer.setTint(0xff0000);
      this.time.delayedCall(500, () => {
        this.polarizer.clearTint();
      });
    }
  }
}

export default Level3Scene;