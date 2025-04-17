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
    this.lostShipFilterHistory = [];

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
      { speaker: 'LostShip', text: 'Photon sequence generated. Choose your filter to start receiving!' }
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

  getRandomFilter() {
    // Generate a random number between 0 and 1
    const randomNum = Math.random();

    // If randomNum < 0.5, choose 'rectilinear', else choose 'diagonal'
    if (randomNum < 0.5) {
      return 'rectilinear';
    } else {
      return 'diagonal';
    }
  }

  generatePhotonSequence(count) {
    this.photonSequence = [];
    const angles = [0, 90, 45, 135];
    for (let i = 0; i < count; i++) {
      const randomAngle = Phaser.Math.RND.pick(angles);
      this.photonSequence.push(randomAngle);
      const randomFilter = this.getRandomFilter();
      this.lostShipFilterHistory.push(randomFilter); // randomFilter could be 'rectilinear' or 'diagonal'
      // const lostShipfilterImage = this.add.image(this.lostShipFilterHistory.length * 60 + 100, 0, randomFilter === 'rectilinear' ? 'filterRect' : 'filterDiag').setDisplaySize(30, 30);
      // this.lostShipfilterHistoryContainer.add(lostShipfilterImage);
    }
  }

  createFilterButtons() {
    const centerX = this.cameras.main.width / 2;
    const buttonY = this.cameras.main.height / 2 + 120;
  
    // Common Button Style
    const buttonStyle = {
      fontSize: '22px',
      fontFamily: 'Arial',
      backgroundColor: '#333',
      color: '#ffffff',
      padding: { x: 20, y: 10 },
      align: 'center',
      fixedWidth: 150
    };
  
    // Hover and Default Colors
    const hoverColor = '#555';
    const defaultColor = '#333';
  
    // Create Rectilinear Button
    this.rectButton = this.add.text(0, 0, 'Rectilinear', buttonStyle)
      .setOrigin(0.5)
      .setPosition(centerX - 100, buttonY)
      .setInteractive({ useHandCursor: true })
      .on('pointerdown', () => this.selectFilter('rectilinear'))
      .on('pointerover', () => this.rectButton.setStyle({ backgroundColor: hoverColor }))
      .on('pointerout', () => this.rectButton.setStyle({ backgroundColor: defaultColor }));
  
    // Create Diagonal Button
    this.diagButton = this.add.text(0, 0, 'Diagonal', buttonStyle)
      .setOrigin(0.5)
      .setPosition(centerX + 100, buttonY)
      .setInteractive({ useHandCursor: true })
      .on('pointerdown', () => this.selectFilter('diagonal'))
      .on('pointerover', () => this.diagButton.setStyle({ backgroundColor: hoverColor }))
      .on('pointerout', () => this.diagButton.setStyle({ backgroundColor: defaultColor }));
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
    // Disable buttons while photon is transmitting
    // this.rectButton.disableInteractive();
    // this.diagButton.disableInteractive();

    // Hide the buttons while photon is transmitting
    this.rectButton.setVisible(false);
    this.diagButton.setVisible(false);

    const photonAngle = this.photonSequence[this.currentPhoton];
    const photon = this.add.image(150, this.cameras.main.height / 2, 'photon').setDisplaySize(this.imageSize / 2, this.imageSize / 2).setAngle(photonAngle);

    this.tweens.add({
      targets: photon,
      x: this.cameras.main.width - 150,
      duration: 3000,
      onComplete: () => {
        this.measurePhoton(this.selectedFilter, photonAngle);
        photon.destroy();
        // Re-enable buttons if there are more photons to measure
        if (this.currentPhoton < this.photonSequence.length) {
          // this.rectButton.setInteractive({ useHandCursor: true });
          // this.diagButton.setInteractive({ useHandCursor: true });

          this.rectButton.setVisible(true);
          this.diagButton.setVisible(true);
        }
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
      // this.finalizeKey();
      this.centerHistoryOnScreen();

    }
  }
  centerHistoryOnScreen() {
    const centerX = this.cameras.main.width / 2;
    const centerY = this.cameras.main.height / 2;

    // Calculate the height and width of the history container
    const containerWidth = this.historyContainer.getBounds().width;
    const containerHeight = this.historyContainer.getBounds().height;

    // Center the container both horizontally and vertically
    this.historyContainer.x = centerX - containerWidth / 2;
    this.historyContainer.y = centerY - containerHeight / 2;
  }
  createHistoryLists() {
    const listY = this.cameras.main.height / 2 + 270;

    // Create text elements
    const selectedFiltersText = this.add.text(0, 0, 'Selected Filters:', { fontSize: '22px', fill: '#ffffff' });
    const resultsText = this.add.text(0, 50, 'Results:', { fontSize: '22px', fill: '#ffffff' });
    const filtersText = this.add.text(0, 100, 'Filters:', { fontSize: '22px', fill: '#ffffff' });

    // Create containers for dynamic content
    this.filterHistoryContainer = this.add.container(200, 0);
    this.resultHistoryContainer = this.add.container(200, 50);
    this.lostShipfilterHistoryContainer = this.add.container(300, 100);

    // Group everything into one main container
    this.historyContainer = this.add.container(50, listY, [
      selectedFiltersText,
      resultsText,
      filtersText,
      this.filterHistoryContainer,
      this.resultHistoryContainer,
      this.lostShipfilterHistoryContainer
    ]);
  }

  updateHistoryList(filter, result) {
    const index = this.filterHistory.length; // Get current index BEFORE pushing

    const xPos = index * 60;

    const filterImage = this.add.image(xPos + 100, 0, filter === 'rectilinear' ? 'filterRect' : 'filterDiag').setDisplaySize(30, 30);
    this.filterHistoryContainer.add(filterImage);
    this.filterHistory.push(filter);

    const resultText = this.add.text(xPos + 100, 0, result, {
      fontSize: '22px',
      fill: result === '1' ? '#0f0' : '#f00'
    });
    this.resultHistoryContainer.add(resultText);
    this.resultHistory.push(result);

    const lostFilter = this.lostShipFilterHistory[this.currentPhoton];
    const lostFilterImage = this.add.image(xPos, 0, lostFilter === 'rectilinear' ? 'filterRect' : 'filterDiag')
      .setDisplaySize(30, 30);
    this.lostShipfilterHistoryContainer.add(lostFilterImage);
    if (this.currentPhoton === this.lostShipFilterHistory.length - 1) {
      // Remove the two buttons from the screen
      this.rectButton.destroy();
      this.diagButton.destroy();
      if (this.filter) {
        this.filter.destroy();
      }
    }
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
