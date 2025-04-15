import Phaser from 'phaser';

class Level1Scene extends Phaser.Scene {
  constructor() {
    super({ key: 'Level1Scene' });

    this.correctClicks = 0;
    this.requiredClicks = 3;
    this.shipParts = []; 
    this.shipPartIndexes = []; 

    this.possibleSpots = [];
    this.realShipIndex = null;
    this.fakeShipIndices = [];
    this.totalFakeShips = 3;

    this.instructionText = null;
  }

  preload() {
    this.load.image('planet', 'assets/images/planet.png');
    this.load.image('ship', 'assets/images/lostShip.png');
    this.load.image('shipPart', 'assets/images/ghost.png'); 
  }

  create() {
    this.addBackground();
    this.createCaption();
    this.createSideDialogue();
    this.createClickableSpots();
    this.setRandomShipParts();
    this.registerInput();
  }

  addBackground() {
    this.add.image(400, 300, 'planet'); // Keeps the planet visible
  }

  createCaption() {
    this.instructionText = this.add.text(80, 600,  // Adjusted Y position to be lower
      "🧪 The ship is in quantum superposition.\nScan to find the real ship before the decoys fool you!",
      {
        fontSize: '20px',
        fill: '#fff',
        fontStyle: 'italic',
        backgroundColor: 'rgba(30, 30, 60, 0.6)',
        padding: { x: 20, y: 10 },
        align: 'center',
        borderRadius: 8,
      }
    ).setDepth(5);
  }

  createSideDialogue() {
    const boxWidth = 300;
    const boxHeight = 230;
    const x = 100;
    const y = 100;

    this.add.rectangle(x + boxWidth / 2, y + boxHeight / 2, boxWidth, boxHeight, 0x1e1e2f, 0.8)
      .setStrokeStyle(2, 0x00ffff)
      .setDepth(30);

    this.add.text(x + 20, y + 20,
      "🧬 QUANTUM TIP:\n\nIn quantum mechanics, objects can exist in a *superposition* of states.\nThis means that the ship is not in just one place!\nInstead, it is in multiple places at once, existing in *probabilities*.\n\nClick on three tiles to reveal the parts and find the real ship!",
      {
        fontSize: '14px',
        fill: '#eeeeff',
        wordWrap: { width: boxWidth - 40 },
        fontStyle: 'italic',
      }
    ).setDepth(31);
  }

  showCaption(message) {
    this.instructionText.setText(`🧠 ${message}`);
  }

  setRandomShipParts() {
    const allIndices = Phaser.Utils.Array.NumberArray(0, this.possibleSpots.length - 1);
    Phaser.Utils.Array.Shuffle(allIndices);

    this.shipPartIndexes = allIndices.slice(0, this.requiredClicks); // Set the first 3 spots as ship parts
    this.fakeShipIndices = allIndices.slice(this.requiredClicks, this.totalFakeShips + this.requiredClicks); // Decoy positions

    this.shipParts = this.shipPartIndexes.map(index => this.add.image(
      this.possibleSpots[index].x,
      this.possibleSpots[index].y,
      'shipPart'
    ).setAlpha(0).setScale(0.1));
  }

  registerInput() {
    this.input.on('pointerdown', this.onPointerDown, this);
  }

  onPointerDown(pointer) {
    const clickedSpot = this.getClickedSpot(pointer);
    if (clickedSpot && !clickedSpot.getData('clicked')) {
      clickedSpot.setData('clicked', true);
      this.handleSpotClick(clickedSpot);
    }
  }

  getClickedSpot(pointer) {
    return this.possibleSpots.find(spot =>
      spot.getBounds().contains(pointer.x, pointer.y)
    ) || null;
  }

  handleSpotClick(spot) {
    const index = spot.getData('index');

    this.createScanPulse(spot.x, spot.y);

    if (this.shipPartIndexes.includes(index)) {
      this.correctClicks++;
      this.showHitEffect(spot, 0x00ff00); // green
      this.showCaption(`🎯 You've found a ship part! (${this.correctClicks} out of ${this.requiredClicks})`);

      this.revealShipPart(index); // Reveal the ship part on the tile clicked

      if (this.correctClicks >= this.requiredClicks) {
        this.assembleShip();
      }
    } else if (this.fakeShipIndices.includes(index)) {
      this.showHitEffect(spot, 0xff0033);
      spot.setFillStyle(0xff0033, 0.3);
      this.showCaption("💥 That was a decoy ship!");
    } else {
      this.showHitEffect(spot, 0xffff00); // yellow
      spot.setFillStyle(0xffff00, 0.3); // Keep it lit yellow
      this.showCaption("🌌 Empty space. Quantum state reset!");
    }
  }

  showHitEffect(spot, color) {
    const highlight = this.add.rectangle(spot.x, spot.y, 70, 70, color, 0.4).setDepth(2);
    this.tweens.add({
      targets: highlight,
      alpha: 0,
      duration: 1000,
      onComplete: () => highlight.destroy(),
    });

    spot.setFillStyle(color, 0.4);
  }

  createScanPulse(x, y) {
    const pulse = this.add.circle(x, y, 10, 0xffffff, 0.5).setDepth(1);
    this.tweens.add({
      targets: pulse,
      radius: 35,
      alpha: 0,
      duration: 300,
      ease: 'Cubic.easeOut',
      onComplete: () => pulse.destroy(),
    });
  }

  resetProgress() {
    this.correctClicks = 0;
    this.cameras.main.shake(200);

    this.possibleSpots.forEach(spot => {
      spot.setData('clicked', false);
      spot.setFillStyle(0x000044, 0.2);
    });
  }

  revealShipPart(index) {
    this.shipParts[this.shipPartIndexes.indexOf(index)].setAlpha(1);
  }

  assembleShip() {
    this.showCaption("🚀 You've found all the ship parts!\nNow the ship will be revealed!");

    // Reveal the ship after the parts are found
    const spot = this.possibleSpots[this.shipPartIndexes[0]]; // Start with the first spot
    const glow = this.add.circle(spot.x, spot.y, 50, 0xffff00, 0.5).setDepth(2);
    this.tweens.add({
      targets: glow,
      scale: 2,
      alpha: 0,
      duration: 1000,
      onComplete: () => glow.destroy(),
    });

    this.shipSprite = this.add.image(spot.x, spot.y, 'ship').setAlpha(0).setScale(0.05);
    this.tweens.add({
      targets: this.shipSprite,
      alpha: 1,
      duration: 800,
      ease: 'Sine.easeInOut',
      onComplete: () => {
        this.tweens.add({
          targets: this.shipSprite,
          scale: 2,  
          duration: 600,
          ease: 'Cubic.easeOut',
          onComplete: () => {
            this.scene.start('Level2Scene');
          }
        });
      }
    });
  }

  createClickableSpots() {
    const positions = this.getSpotPositions();
    const letters = 'ABCDEFGHIJ';

    positions.forEach((pos, index) => {
      const zone = this.add.zone(pos.x, pos.y, 70, 70)
        .setOrigin(0.5)
        .setInteractive()
        .setData('index', index)
        .setData('clicked', false);

      this.possibleSpots.push(zone);

      const rect = this.add.rectangle(pos.x, pos.y, 70, 70)
        .setStrokeStyle(1, 0x00ffff)
        .setFillStyle(0x000044, 0.2)
        .setDepth(0);

      // Grid Labels
      if (index < 10) {
        this.add.text(pos.x - 30, pos.y - 50, letters[index], {
          fontSize: '12px',
          fill: '#aaa',
        });
      }
      if (index % 10 === 0) {
        this.add.text(pos.x - 60, pos.y - 10, String(index / 10 + 1), {
          fontSize: '12px',
          fill: '#aaa',
        });
      }

      zone.setFillStyle = rect.setFillStyle.bind(rect);

      zone.on('pointerover', () => rect.setStrokeStyle(2, 0xffff00));
      zone.on('pointerout', () => rect.setStrokeStyle(1, 0x00ffff));
    });
  }

  getSpotPositions() {
    const positions = [];
    const startX = 1000; 
    const startY = 100;
  
    for (let x = 0; x < 10; x++) {
      for (let y = 0; y < 10; y++) {
        positions.push({ x: startX + x * 70, y: startY + y * 70 });
      }
    }
    return positions;
  }
}

export default Level1Scene;