import Phaser from 'phaser';
/*REFACTORING: Removed uneccesary comments in script*/
class Level2Scene extends Phaser.Scene {
  constructor() {
    super({ key: 'Level2Scene' });

    this.photonSequence = [];
    this.secretKey = '';
    this.currentPhoton = 0;
    this.eavesdropChance = 0.2;   
    this.imageSize = 100;        

    // Lists to store filters and results
    this.filterHistory = [];
    this.resultHistory = [];

    this.selectedFilter = null;   // Store the selected filter before sending the photon
  }


LoadAssets() {
  this.load.image('playerShip', 'assets/images/playerShip.png');
  this.load.image('lostShip', 'assets/images/lostShip.png');
  this.load.image('photon', 'assets/images/photon.png');
  this.load.image('filterRect', 'assets/images/filter_rectilinear.png');
  this.load.image('filterDiag', 'assets/images/filter_diagonal.png');
}
  
//REFACTORING: Having load assets in a seperate function
  preload() {
    this.LoadAssets();
  }



  create() {
    // Background and Title
    this.add.text(this.cameras.main.width / 2, 50, 'Level 2: Quantum Key Distribution', {
      fontSize: '32px',
      fill: '#ffffff'
    }).setOrigin(0.5, 0);

    // Ships with uniform size
    this.lostShip = this.add.image(150, this.cameras.main.height / 2, 'lostShip')
      .setDisplaySize(500, 500);

    this.playerShip = this.add.image(this.cameras.main.width - 150, this.cameras.main.height / 2, 'playerShip')
      .setDisplaySize(500, 500);

    // Filter in the middle
    this.filter = this.add.image(this.cameras.main.width / 2, this.cameras.main.height / 2, 'filterRect')
      .setDisplaySize(this.imageSize, this.imageSize);

    // Generate random photon sequence
    this.generatePhotonSequence(10);  // 10 photons
    
    // Back button
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

    // Create filter selection buttons
    this.createFilterButtons();

    // Create history lists below the buttons
    this.createHistoryLists();
  }

  // Generate a random sequence of photons (0°, 90°, 45°, or 135°)
  generatePhotonSequence(count) {
    this.photonSequence = [];
    const angles = [0, 90, 45, 135];

    for (let i = 0; i < count; i++) {
      const randomAngle = Phaser.Math.RND.pick(angles);
      this.photonSequence.push(randomAngle);
    }
  }

  // Create filter selection buttons
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

  // Store the selected filter and send the photon
  selectFilter(filter) {
    this.selectedFilter = filter;

    // Change the filter image
    if (filter === 'rectilinear') {
      this.filter.setTexture('filterRect');
    } else {
      this.filter.setTexture('filterDiag');
    }

    // Send the photon
    this.displayPhoton();
  }

  // Display the photon animation after filter selection
  displayPhoton() {
    if (this.currentPhoton >= this.photonSequence.length) {
      this.finalizeKey();
      return;
    }

    const photonAngle = this.photonSequence[this.currentPhoton];

    const photon = this.add.image(150, this.cameras.main.height / 2, 'photon')
      .setDisplaySize(this.imageSize / 2, this.imageSize / 2)
      .setAngle(photonAngle);

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

  // Measure the photon with the selected filter
  measurePhoton(basis, photonAngle) {
    const isRect = (basis === 'rectilinear');
    
    const isCorrect = (isRect && (photonAngle === 0 || photonAngle === 90)) ||
                      (!isRect && (photonAngle === 45 || photonAngle === 135));

    const resultBit = isCorrect ? '1' : '0';
    this.secretKey += resultBit;

    // Update the history lists
    this.updateHistoryList(basis, resultBit);

    this.currentPhoton++;
    if (this.currentPhoton < this.photonSequence.length) {
      this.selectedFilter = null;  // Wait for next filter selection
    } else {
      this.finalizeKey();
    }
  }

  // Create history lists below the filter buttons
  createHistoryLists() {
    const listY = this.cameras.main.height / 2 + 270;  // Positioned below buttons

    // Text labels for the lists
    this.add.text(50, listY, 'Selected Filters:', { fontSize: '22px', fill: '#ffffff' });
    this.add.text(50, listY + 50, 'Results:', { fontSize: '22px', fill: '#ffffff' });

    this.filterHistoryContainer = this.add.container(200, listY);
    this.resultHistoryContainer = this.add.container(200, listY + 50);
  }

  // Update the history lists
  updateHistoryList(filter, result) {
    // Replace filter history with image of selected filter, scaled down
    const filterImage = this.add.image(this.filterHistory.length * 60+100, 0, filter === 'rectilinear' ? 'filterRect' : 'filterDiag')
      .setDisplaySize(30, 30);  // Smaller image size for history
    this.filterHistoryContainer.add(filterImage);
    this.filterHistory.push(filter);

    const resultText = this.add.text(this.resultHistory.length * 60+100, 0, result, {
      fontSize: '20px',
      fill: result === '1' ? '#0f0' : '#f00',
      backgroundColor: '#000',
      padding: { x: 10, y: 5 }
    });
    this.resultHistoryContainer.add(resultText);
    this.resultHistory.push(result);
  }

  // Finalize the secret key
  finalizeKey() {
    this.add.text(this.cameras.main.width / 2, 650, `Secret Key: ${this.secretKey}`, {
      fontSize: '28px',
      fill: '#0f0',
      backgroundColor: '#000'
    }).setOrigin(0.5);
  }
}

export default Level2Scene;
