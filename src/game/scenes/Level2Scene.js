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
    // Common Button Style
    this.buttonStyle = {
      fontSize: '22px',
      fontFamily: 'Arial',
      backgroundColor: '#333',
      color: '#ffffff',
      padding: { x: 20, y: 10 },
      align: 'center',
      fixedWidth: 150
    };
    // Hover and Default Colors
    this.hoverColor = '#555';
    this.defaultColor = '#333';
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

      { speaker: 'LostShip', text: 'Transmission beep, weak but clear signal incoming.' },
      { speaker: 'LostShip', text: '[Lost Ship] : $..%$..%#%$...%$%..$%%...$%$%..' },
      { speaker: 'PlayerShip', text: '[Player Ship] : This is [Player Ship]. Who is this?' },
      { speaker: 'LostShip', text: '[Lost Ship] : This is [Lost Ship Name]. We’re stranded in deep space.' },
      { speaker: 'LostShip', text: '[Lost Ship] : We need to establish a secure communication link, and it’s urgent.' },
      { speaker: 'LostShip', text: '[Lost Ship] : Are you familiar with Quantum Key Distribution?' },
      { speaker: 'PlayerShip', text: '[Player Ship] : Quantum Key Distribution? ' },
      { speaker: 'PlayerShip', text: '[Player Ship] : I’ve heard of it, but I don’t fully understand how it works.' },
      { speaker: 'PlayerShip', text: '[Player Ship] : How can I help?' },
      { speaker: 'LostShip', text: '[Lost Ship] : Don’t worry! I’ll guide you through it.' },
      { speaker: 'LostShip', text: '[Lost Ship] : We’ll use the properties of quantum mechanics to securely share a key for encryption.' },
      { speaker: 'LostShip', text: '[Lost Ship] : I’ll generate photons in entangled pairs and send them to you.' },
      { speaker: 'LostShip', text: '[Lost Ship] : Your job is to choose a filter to measure each photon, and then we’ll compare our results.' },
      { speaker: 'PlayerShip', text: '[Player Ship] : I see...' },
      { speaker: 'PlayerShip', text: '[Player Ship] : So, I choose filters, and then we compare our results to form a shared key?' },
      { speaker: 'LostShip', text: '[Lost Ship] : Exactly!' },
      { speaker: 'LostShip', text: '[Lost Ship] : The key is shared only if our filter choices align correctly.' },
      { speaker: 'LostShip', text: '[Lost Ship] : If they don’t align, the measurement results will be random.' },
      { speaker: 'PlayerShip', text: '[Player Ship] : Got it.' },
      { speaker: 'LostShip', text: '[Lost Ship] : Ready?' },
      { speaker: 'PlayerShip', text: '[Player Ship] : Ready! Let’s get started.' },
      { speaker: 'LostShip', text: '[Lost Ship] : Alright, select a filter.' },

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
        duration: 300,
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
    // === ADD THESE MESSAGES ABOVE THE SHIPS ===
    this.lostShipMessage = this.add.text(this.lostShip.x, this.lostShip.y - 300, "Hi, I'm lost!", {
      fontSize: '24px',
      fill: '#ffff00',
      backgroundColor: '#000000',
      padding: { left: 10, right: 10, top: 5, bottom: 5 }
    }).setOrigin(0.5);

    this.playerShipMessage = this.add.text(this.playerShip.x, this.playerShip.y - 300, "Hi, I'm the player!", {
      fontSize: '24px',
      fill: '#00ffff',
      backgroundColor: '#000000',
      padding: { left: 10, right: 10, top: 5, bottom: 5 }
    }).setOrigin(0.5);

    // Optional: Fade out the messages after 4 seconds
    this.time.delayedCall(4000, () => {
      this.tweens.add({
        targets: [this.lostShipMessage, this.playerShipMessage],
        alpha: 0,
        duration: 1000,
        onComplete: () => {
          this.lostShipMessage.destroy();
          this.playerShipMessage.destroy();
        }
      });
    });

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
      this.lostShipFilterHistory.push(randomFilter);
    }
  }

  createFilterButtons() {
    const centerX = this.cameras.main.width / 2;
    const buttonY = this.cameras.main.height / 2 + 120;





    // Create Rectilinear Button
    this.rectButton = this.add.text(0, 0, 'Rectilinear', this.buttonStyle)
      .setOrigin(0.5)
      .setPosition(centerX - 100, buttonY)
      .setInteractive({ useHandCursor: true })
      .on('pointerdown', () => this.selectFilter('rectilinear'))
      .on('pointerover', () => this.rectButton.setStyle({ backgroundColor: this.hoverColor }))
      .on('pointerout', () => this.rectButton.setStyle({ backgroundColor: this.defaultColor }));

    // Create Diagonal Button
    this.diagButton = this.add.text(0, 0, 'Diagonal', this.buttonStyle)
      .setOrigin(0.5)
      .setPosition(centerX + 100, buttonY)
      .setInteractive({ useHandCursor: true })
      .on('pointerdown', () => this.selectFilter('diagonal'))
      .on('pointerover', () => this.diagButton.setStyle({ backgroundColor: this.hoverColor }))
      .on('pointerout', () => this.diagButton.setStyle({ backgroundColor: this.defaultColor }));
  }

  selectFilter(filter) {
    // { speaker: 'LostShip', text: '[Lost Ship] : Alright, I’ll send the first photon now. I’ve randomly chosen a 45-degree filter. Your turn to select a filter.' },
    this.time.delayedCall(0, () => {
      this.updateDialogue("[Lost Ship] : Alright, I’ll send the first photon now. I’ve randomly chosen a " + this.lostShipFilterHistory[this.currentPhoton] + "-degree filter.", 'LostShip');
    });

    this.time.delayedCall(5000, () => {
      this.clearDialogue();
    });
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
          this.time.delayedCall(7000, () => {
            this.clearDialogue();
          });
          this.time.delayedCall(8000, () => {
            this.updateDialogue("[Lost Ship] : Choose your next filter.", 'LostShip');
            this.rectButton.setVisible(true);
            this.diagButton.setVisible(true);
          });

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
      // { speaker: 'PlayerShip', text: '[Player Ship] : Got it! Send the next photon.' },
      this.time.delayedCall(3000, () => {
        this.clearDialogue();
        this.updateDialogue("[Player Ship] : Got it! Send the next photon.", 'PlayerShip');
      });
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
    this.generateButton.x = centerX - containerWidth / 2 + 100;  // slight right shift
    // Show checkbox list and title
    this.checkboxListText.setVisible(true);
    this.checkboxListContainer.setVisible(true);
  }
  createHistoryLists() {
    const listY = this.cameras.main.height / 2 + 270;

    // Create text elements
    const selectedFiltersText = this.add.text(0, 0, 'Selected Filters:', { fontSize: '22px', fill: '#ffffff' });
    const resultsText = this.add.text(0, 50, 'Results:', { fontSize: '22px', fill: '#ffffff' });
    const filtersText = this.add.text(0, 100, "Lost Ship's Filters:", { fontSize: '22px', fill: '#ffffff' });
    this.checkboxListText = this.add.text(0, 150, "Select Matching Filters:", { fontSize: '22px', fill: '#ffffff' });

    // Create containers for dynamic content
    this.filterHistoryContainer = this.add.container(250, 0);
    this.resultHistoryContainer = this.add.container(240, 50);
    this.lostShipfilterHistoryContainer = this.add.container(350, 100);
    this.checkboxListContainer = this.add.container(220, 150); // NEW container for checkboxes


    // Create Generate button
    this.generateButton = this.add.text(400 + 30, 250, 'Generate', this.buttonStyle)
      .setOrigin(0.5) // center align
      .setInteractive({ useHandCursor: true })
      .on('pointerdown', () => this.onGenerateButtonClicked())
      .on('pointerover', () => this.generateButton.setStyle({ backgroundColor: this.hoverColor }))
      .on('pointerout', () => this.generateButton.setStyle({ backgroundColor: this.defaultColor }));

    // Group everything into one main container
    this.historyContainer = this.add.container(50, listY, [
      selectedFiltersText,
      resultsText,
      filtersText,
      this.checkboxListText,
      this.filterHistoryContainer,
      this.resultHistoryContainer,
      this.lostShipfilterHistoryContainer,
      this.checkboxListContainer, // Add new checkbox container here
      this.generateButton
    ]);

    // Hide checkbox list and title initially
    this.checkboxListText.setVisible(false);
    this.checkboxListContainer.setVisible(false);
    this.generateButton.setVisible(false);

    // Initialize checkbox data
    this.checkBoxList = [];

    // Example filters (replace with your real dynamic filters)
    this.allFilters = ['c1', 'c2', 'c3', 'c4', 'c5', 'c6', 'c7', 'c8', 'c9', 'c10'];

    this.createCheckboxListHorizontal(this.allFilters, this.checkboxListContainer);
  }
  onGenerateButtonClicked() {
    // Call your finalizeKey() function here
    this.finalizeKey();
  }
  createCheckboxListHorizontal(filters, container) {


    filters.forEach((filter, index) => {
      const xPos = index * 60;

      const checkbox = this.add.text(xPos + 110, 0, '[ ]', { fontSize: '20px', fill: '#ffffff' })
        .setInteractive()
        .on('pointerdown', () => this.toggleCheckbox(checkbox, filter));

      container.add(checkbox);
      this.checkBoxList.push({ filter, checkbox, isChecked: false });
    });
  }

  toggleCheckbox(checkbox, filter) {
    const checkboxObject = this.checkBoxList.find(item => item.filter === filter);
    checkboxObject.isChecked = !checkboxObject.isChecked;

    if (checkboxObject.isChecked) {
      checkboxObject.checkbox.setText('[x]');
    } else {
      checkboxObject.checkbox.setText('[ ]');
    }
    
    const checkedList = this.checkBoxList.filter(item => item.isChecked === true);
    if (checkedList.length >= 2) {  // >= 2 selected to show the button
      this.generateButton.setVisible(true);
    } else {
      this.generateButton.setVisible(false);
    }
  }

  generateFilterMatch() {
    const selectedCheckboxes = this.checkBoxList.filter(item => item.isChecked);

    const matchingFilters = selectedCheckboxes.filter(item =>
      this.selectedFilters.includes(item.filter) &&
      this.lostShipFilters.includes(item.filter)
    );

    if (matchingFilters.length > 0) {
      alert('Matching filters: ' + matchingFilters.map(item => item.filter).join(', '));
    } else {
      alert('No matching filters found.');
    }
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
