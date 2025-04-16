import Phaser from 'phaser';

class Level2Scene extends Phaser.Scene {
  constructor() {
    super({ key: 'Level2Scene' });

    this.photonSequence = [];
    this.secretKey = '';
    this.currentPhoton = 0;
    this.eavesdropChance = 0.2;
    this.imageSize = 100;

    this.filterHistory = [];
    this.resultHistory = [];

    this.selectedFilter = null;
  }

  preload() {
    this.loadAssets();
    this.load.audio('dialogPop', 'assets/sounds/dialog-pop.mp3');
  }

  loadAssets() {
    this.load.image('playerShip', 'assets/images/playerShip.png');
    this.load.image('lostShip', 'assets/images/lostShip.png');
    this.load.image('photon', 'assets/images/photon.png');
    this.load.image('filterRect', 'assets/images/filter_rectilinear.png');
    this.load.image('filterDiag', 'assets/images/filter_diagonal.png');
  }

  create() {
    this.dialogText = this.add.text(0, 140, '', {
      fontSize: '20px',
      fill: '#ffffff',
      wordWrap: { width: this.cameras.main.width - 40 }
    }).setOrigin(0.5, 0);

    this.dialogSound = this.sound.add('dialogPop');

    this.dialogueSequence = [
      { speaker: 'LostShip', text: 'Hey, Player! I’m lost in space. I need a secure channel to communicate.' },
      { speaker: 'PlayerShip', text: 'Understood, LostShip. Let’s use quantum key distribution to secure our link.' },
      { speaker: 'LostShip', text: 'Quantum what now?' },
      { speaker: 'PlayerShip', text: 'I’ll send photons using random angles. You’ll measure them with filters. If we match, we get secure bits!' },
      { speaker: 'LostShip', text: 'Sounds strange but exciting! Let’s begin.' },
      { speaker: 'PlayerShip', text: 'Photon sequence generated. Choose your filter to start receiving!' }
    ];

    this.updateDialogue = (text, speaker) => {
      let xPos, align;
      const margin = 40;
      const maxWidth = this.cameras.main.width * 0.6;

      if (speaker === 'LostShip') {
        xPos = margin;
        align = 'left';
      } else {
        xPos = this.cameras.main.width - maxWidth - margin;
        align = 'right';
      }

      this.dialogText.setPosition(xPos, 140);
      this.dialogText.setOrigin(0, 0);
      this.dialogText.setStyle({
        align: align,
        wordWrap: { width: maxWidth }
      });
      this.dialogText.setText('');

      let i = 0;
      const typingSpeed = 30;

      this.tweens.add({
        targets: this.dialogText,
        alpha: { from: 0, to: 1 },
        duration: 200,
        onComplete: () => {
          this.time.addEvent({
            delay: typingSpeed,
            repeat: text.length - 1,
            callback: () => {
              this.dialogText.setText(this.dialogText.text + text[i]);
              i++;
            }
          });
          if (this.dialogSound) {
            this.dialogSound.play();
          }
        }
      });
    };

    this.clearDialogue = () => {
      this.dialogText.setText('');
    };

    this.showFullConversation();

    this.add.text(this.cameras.main.width / 2, 50, 'Level 2: Quantum Key Distribution', {
      fontSize: '32px',
      fill: '#ffffff'
    }).setOrigin(0.5, 0);

    this.lostShip = this.add.image(150, this.cameras.main.height / 2, 'lostShip').setDisplaySize(500, 500);
    this.playerShip = this.add.image(this.cameras.main.width - 150, this.cameras.main.height / 2, 'playerShip').setDisplaySize(500, 500);
    this.filter = this.add.image(this.cameras.main.width / 2, this.cameras.main.height / 2, 'filterRect').setDisplaySize(this.imageSize, this.imageSize);

    this.generatePhotonSequence(10);

    const backButton = this.add.text(this.cameras.main.width / 2, this.cameras.main.height - 50, 'Back to Level 1', {
      fontSize: '24px',
      fill: '#f00',
      backgroundColor: '#000'
    })
      .setOrigin(0.5)
      .setInteractive()
      .on('pointerdown', () => this.scene.start('Level1Scene'))
      .on('pointerover', () => backButton.setStyle({ fill: '#ff0' }))
      .on('pointerout', () => backButton.setStyle({ fill: '#f00' }));

    this.createFilterButtons();
    this.createHistoryLists();
  }

  showFullConversation() {
    let delay = 0;
    const messageDisplayTime = 5000;

    for (let i = 0; i < this.dialogueSequence.length; i++) {
      const dialogue = this.dialogueSequence[i];

      this.time.delayedCall(delay, () => {
        this.updateDialogue(dialogue.text, dialogue.speaker);
      });

      this.time.delayedCall(delay + messageDisplayTime, () => {
        this.clearDialogue();
      });

      delay += messageDisplayTime + 300;
    }
  }

  generatePhotonSequence(count) {
    this.photonSequence = [];
    const angles = [0, 90, 45, 135];
    for (let i = 0; i < count; i++) {
      const randomAngle = Phaser.Math.RND.pick(angles);
      this.photonSequence.push(randomAngle);
    }
  }

  createFilterButtons() {
    const buttonY = this.cameras.main.height / 2 + 120;

    const rectButton = this.add.text(this.cameras.main.width / 2 - 100, buttonY, 'Rectilinear', {
      fontSize: '22px',
      fill: '#0f0',
      backgroundColor: '#000',
      padding: { x: 10, y: 5 }
    })
      .setInteractive()
      .on('pointerdown', () => this.selectFilter('rectilinear'))
      .on('pointerover', () => rectButton.setStyle({ fill: '#ff0' }))
      .on('pointerout', () => rectButton.setStyle({ fill: '#0f0' }));

    const diagButton = this.add.text(this.cameras.main.width / 2 + 100, buttonY, 'Diagonal', {
      fontSize: '22px',
      fill: '#00f',
      backgroundColor: '#000',
      padding: { x: 10, y: 5 }
    })
      .setInteractive()
      .on('pointerdown', () => this.selectFilter('diagonal'))
      .on('pointerover', () => diagButton.setStyle({ fill: '#ff0' }))
      .on('pointerout', () => diagButton.setStyle({ fill: '#00f' }));
  }

  selectFilter(filter) {
    this.selectedFilter = filter;
    this.filter.setTexture(filter === 'rectilinear' ? 'filterRect' : 'filterDiag');
    this.displayPhoton();
  }

  displayPhoton() {
    if (this.currentPhoton >= this.photonSequence.length) {
      this.finalizeKey();
      return;
    }

    const photonAngle = this.photonSequence[this.currentPhoton];
    const photon = this.add.image(150, this.cameras.main.height / 2, 'photon').setDisplaySize(this.imageSize / 2, this.imageSize / 2).setAngle(photonAngle);

    this.tweens.add({
      targets: photon,
      x: this.cameras.main.width - 150,
      duration: 3000,
      onComplete: () => {
        this.measurePhoton(this.selectedFilter, photonAngle);
        photon.destroy();
      }
    });
  }

  measurePhoton(basis, photonAngle) {
    const isRect = (basis === 'rectilinear');
    const isCorrect = (isRect && (photonAngle === 0 || photonAngle === 90)) || (!isRect && (photonAngle === 45 || photonAngle === 135));
    const resultBit = isCorrect ? '1' : '0';
    this.secretKey += resultBit;
    this.updateHistoryList(basis, resultBit);

    this.currentPhoton++;
    if (this.currentPhoton < this.photonSequence.length) {
      this.selectedFilter = null;
    } else {
      this.finalizeKey();
    }
  }

  createHistoryLists() {
    const listY = this.cameras.main.height / 2 + 270;
    this.add.text(50, listY, 'Selected Filters:', { fontSize: '22px', fill: '#ffffff' });
    this.add.text(50, listY + 50, 'Results:', { fontSize: '22px', fill: '#ffffff' });
    this.filterHistoryContainer = this.add.container(200, listY);
    this.resultHistoryContainer = this.add.container(200, listY + 50);
  }

  updateHistoryList(filter, result) {
    const filterImage = this.add.image(this.filterHistory.length * 60 + 100, 0, filter === 'rectilinear' ? 'filterRect' : 'filterDiag').setDisplaySize(30, 30);
    this.filterHistoryContainer.add(filterImage);
    this.filterHistory.push(filter);

    const resultText = this.add.text(this.resultHistory.length * 60 + 100, 0, result, {
      fontSize: '22px',
      fill: result === '1' ? '#0f0' : '#f00'
    });
    this.resultHistoryContainer.add(resultText);
    this.resultHistory.push(result);
  }

  finalizeKey() {
    const keyBoxWidth = 700;
    const keyBoxHeight = 160;
    const keyBoxX = this.cameras.main.width / 2;
    const keyBoxY = 670;

    this.add.rectangle(keyBoxX, keyBoxY, keyBoxWidth, keyBoxHeight, 0x000000, 0.85)
      .setStrokeStyle(2, 0x00ff00)
      .setOrigin(0.5);

    const keyText = this.add.text(keyBoxX - keyBoxWidth / 2 + 20, keyBoxY - keyBoxHeight / 2 + 20, `Secret Key: ${this.secretKey}`, {
      fontSize: '18px',
      fill: '#00ff00',
      wordWrap: { width: keyBoxWidth - 40, useAdvancedWrap: true },
      fontFamily: 'monospace'
    });

    keyText.setDepth(10);

    this.updateDialogue("Photon transmission complete. Secret key generated and stored in the database.", true);

    this.storeSecretKeyInDatabase(this.secretKey);
  }

  storeSecretKeyInDatabase(secretKey) {
    const apiUrl = 'http://localhost:3000/api/storeProgress';

    fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ level: 2, key: secretKey })
    })
      .then(res => res.json())
      .then(data => {
        console.log('Progress saved:', data);
      })
      .catch(error => {
        console.error('Error storing secret key:', error);
      });
  }
}

export default Level2Scene;
