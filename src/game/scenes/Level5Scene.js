import Phaser from 'phaser';

class Level5Scene extends Phaser.Scene {
  constructor() {
    super({ key: 'Level5Scene' });
    
    // 按钮样式配置
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

    // 按钮引用
    this.buttons = [];
  }

  preload() {
    // 加载素材（已移除音频加载）
    this.load.image('playerShip', 'assets/images/playerShip.png');
    this.load.image('lostShip', 'assets/images/lostShip.png');
    this.load.image('filterRect', 'assets/images/filter_rectilinear.png');
    this.load.image('space_bg', 'assets/images/space_bg.png');
  }

  create() {
    // 背景和飞船
    this.add.image(400, 300, 'space_bg');
    this.lostShip = this.add.image(150, 300, 'lostShip').setDisplaySize(500, 500);
    this.playerShip = this.add.image(650, 300, 'playerShip').setDisplaySize(500, 500);
    
    // 标题
    this.add.text(400, 50, 'Level 3: Quantum Polarization Puzzle', { 
      fontSize: '32px', 
      fill: '#ffffff' 
    }).setOrigin(0.5);

    // 偏振滤镜
    this.polarizer = this.add.image(400, 300, 'filterRect')
      .setDisplaySize(150, 150)
      .setInteractive()
      .setAngle(this.currentAngle);

    // 旋转控制按钮
    const rotateLeftBtn = this.createButton(
      300, 450, 
      '← Rotate -15°', 
      () => this.rotatePolarizer(-15)
    );

    const rotateRightBtn = this.createButton(
      500, 450, 
      'Rotate +15° →', 
      () => this.rotatePolarizer(15)
    );

    // 验证按钮（特殊样式）
    const checkBtn = this.add.text(400, 520, 'CHECK MATCH', {
      ...this.buttonStyle,
      backgroundColor: '#1a237e'
    })
      .setInteractive()
      .on('pointerdown', this.checkMatch.bind(this))
      .on('pointerover', () => {
        checkBtn.setStyle({ backgroundColor: this.hoverColor });
      })
      .on('pointerout', () => {
        checkBtn.setStyle({ backgroundColor: '#1a237e' });
      });
    this.buttons.push(checkBtn);

    // 返回按钮
    const backBtn = this.add.text(400, 580, 'Back to Level 2', {
      fontSize: '24px',
      fill: '#f00',
      backgroundColor: '#000',
      padding: { x: 20, y: 10 }
    })
      .setInteractive()
      .on('pointerdown', () => this.scene.start('Level2Scene'))
      .on('pointerover', () => {
        backBtn.setStyle({ fill: '#ff5555' });
      })
      .on('pointerout', () => {
        backBtn.setStyle({ fill: '#f00' });
      });
  }

  // 创建可复用按钮的方法
  createButton(x, y, text, onClick) {
    const btn = this.add.text(x, y, text, this.buttonStyle)
      .setInteractive()
      .on('pointerdown', onClick)
      .on('pointerover', () => {
        btn.setStyle({ backgroundColor: this.hoverColor });
      })
      .on('pointerout', () => {
        btn.setStyle({ backgroundColor: this.defaultColor });
      });
    
    this.buttons.push(btn);
    return btn;
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
    // 禁用所有按钮防止重复点击
    this.buttons.forEach(btn => {
      btn.disableInteractive();
      btn.setStyle({ fill: '#888' });
    });

    const angleDiff = Math.abs(this.currentAngle - this.targetAngle);
    const normalizedDiff = Math.min(angleDiff, 360 - angleDiff);
    
    if (normalizedDiff <= this.matchThreshold) {
      // 成功效果
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
          
          // 3秒后解锁按钮
          this.time.delayedCall(3000, () => {
            this.buttons.forEach(btn => {
              btn.setInteractive();
              btn.setStyle({ fill: '#ffffff' });
            });
          });
        }
      });
    } else {
      // 失败效果
      this.polarizer.setTint(0xff0000);
      this.time.delayedCall(500, () => {
        this.polarizer.clearTint();
        this.buttons.forEach(btn => {
          btn.setInteractive();
          btn.setStyle({ fill: '#ffffff' });
        });
      });
    }
  }
}

export default Level5Scene;