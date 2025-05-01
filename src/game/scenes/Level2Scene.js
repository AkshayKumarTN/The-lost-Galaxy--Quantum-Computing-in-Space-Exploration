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

    this.createBackButton();

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
    this.generateButton.x = centerX - containerWidth / 2 - 100;  // slight right shift
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


    // Loop through the selected checkboxes
    let newSecretKey = '';
    let mismatchFound = false; // Track if a mismatch happens

    // Loop through the selected checkboxes
    this.checkBoxList.forEach((checkboxItem, index) => {
      if (checkboxItem.isChecked) {
        // Check corresponding filterHistory and lostShipFilterHistory
        const filterChild = this.filterHistoryContainer.getAt(index);
        const lostFilterChild = this.lostShipfilterHistoryContainer.getAt(index);

        // Check if both exist and match (you might compare texture keys if they are images)
        if (filterChild && lostFilterChild && filterChild.texture.key === lostFilterChild.texture.key) {
          const resultChild = this.resultHistoryContainer.getAt(index);
          if (resultChild && resultChild.text) {
            newSecretKey += resultChild.text; // Append result to secret key
          }
        }
        else {
          mismatchFound = true; // Set mismatch flag
        }
      }
    });

    if (mismatchFound) {
      // Clear all checkboxes
      this.checkBoxList.forEach(checkboxItem => {
        checkboxItem.isChecked = false;
        if (checkboxItem.checkbox) {
          checkboxItem.checkbox.setText('[ ]');
        }
      });

      this.updateDialogue("Filters don't match. Please try again.", 'LostShip');

      return; // Exit early
    }

    // Update the secretKey
    this.secretKey = newSecretKey;


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

    this.createNextLevelButton();

    this.storeSecretKeyInDatabase(this.secretKey);

    // 在Level2Scene的finalizeKey()方法末尾添加：
    this.time.delayedCall(2000, () => {
    this.add.text(400, 400, 'Click to proceed to Level 5', { fontSize: '24px', fill: '#0f0' })
    .setInteractive()
    .on('pointerdown', () => this.scene.start('Level5Scene'));
    });
  }

  storeSecretKeyInDatabase(secretKey) {
    const apiUrl = 'http://localhost:5000/api/storeProgress';

    fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ level: 2, secretKey: secretKey })
    })
      .then(res => res.json())
      .then(data => {
        console.log('Progress saved:', data);
      })
      .catch(error => {
        console.error('Error storing secret key:', error);
      });
  }

  createNextLevelButton() {
    const centerX = this.cameras.main.width / 2;
    const backButtonY = this.cameras.main.height - 50; // Y position of the Back button

    // Create a background rectangle for solid button feel
    const buttonWidth = 200;
    const buttonHeight = 50;
    const buttonY = backButtonY - 100;

    // Green background rectangle
    const nextLevelBackground = this.add.rectangle(centerX, buttonY + buttonHeight / 2, buttonWidth, buttonHeight, 0x00aa00)
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true });

    // Text on top of the rectangle
    const nextLevelButton = this.add.text(centerX, buttonY + buttonHeight / 2, 'Next Level', {
      fontSize: '20px',
      color: '#ffffff', // White text
      fontFamily: 'Arial',
      fontStyle: 'bold'
    })
      .setOrigin(0.5).setInteractive({ useHandCursor: true });

    // Group them together for interaction
    nextLevelBackground.on('pointerover', () => {
      nextLevelBackground.setFillStyle(0x00ff00); // Lighter green on hover
    });

    nextLevelBackground.on('pointerout', () => {
      nextLevelBackground.setFillStyle(0x00aa00); // Original green
    });

    nextLevelBackground.on('pointerdown', () => {
      this.scene.start('Level3Scene'); // Load the next level
    });

    nextLevelButton.on('pointerdown', () => {
      this.scene.start('Level3Scene');
    });

    nextLevelButton.on('pointerover', () => {
      nextLevelBackground.setFillStyle(0x00ff00);
    });

    nextLevelButton.on('pointerout', () => {
      nextLevelBackground.setFillStyle(0x00aa00);
    });
  }
  createBackButton() {
    const centerX = this.cameras.main.width / 2;
    const backButtonY = this.cameras.main.height - 50;
  
    const buttonWidth = 250;
    const buttonHeight = 50;
  
    // Create background rectangle
    const backButtonBackground = this.add.rectangle(centerX, backButtonY, buttonWidth, buttonHeight, 0x0C8CFE)
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true }); // Cursor pointer
  
    // Create button text
    const backButton = this.add.text(centerX, backButtonY, 'Back to Level 1', {
      fontSize: '22px',
      color: '#ffffff',
      fontFamily: 'Arial',
      fontStyle: 'bold'
    })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true });
  
    // Hover and click effects
    backButtonBackground.on('pointerover', () => {
      backButtonBackground.setFillStyle(0x47A8FF); // Light blue on hover
    });
  
    backButtonBackground.on('pointerout', () => {
      backButtonBackground.setFillStyle(0x0C8CFE); // Strong blue normal
    });
  
    backButtonBackground.on('pointerdown', () => {
      this.scene.start('Level1Scene');
    });
  
    backButton.on('pointerover', () => {
      backButtonBackground.setFillStyle(0x47A8FF);
    });
  
    backButton.on('pointerout', () => {
      backButtonBackground.setFillStyle(0x0C8CFE);
    });
  
    backButton.on('pointerdown', () => {
      this.scene.start('Level1Scene');
    });
  }
  
  

  // createNextLevelButton() {
  //   const centerX = this.cameras.main.width / 2;
  //   const backButtonY = this.cameras.main.height - 50; // Since you placed Back button here

  //   const nextLevelButton = this.add.text(centerX, backButtonY - 70, 'Next Level', {
  //     fontSize: '24px',
  //     fill: '#0f0', // Green color for Next Level
  //     backgroundColor: '#000'
  //   })
  //     .setOrigin(0.5)
  //     .setInteractive()
  //     .on('pointerdown', () => this.scene.start('Level1Scene')) // 👉 Your next scene here
  //     // .on('pointerdown', () => alert('Next Level loading...')) // 👉 Alert on click
  //     .on('pointerover', () => nextLevelButton.setStyle({ fill: '#0ff' })) // Hover effect
  //     .on('pointerout', () => nextLevelButton.setStyle({ fill: '#0f0' })); // Back to green
  // }


}

export default Level2Scene;
