import Phaser from 'phaser';

class Level4Scene extends Phaser.Scene {
  constructor() {
    super({ key: 'Level4Scene' });
  }

  init(data) {
    // Receiving data from previous level
    this.hasSecureKey = data.hasSecureKey || false;
    this.isPuzzleSolved = false; // Initialize puzzle solution state
  }

  preload() {
    // Load assets
    this.load.image('floor', 'assets/images/floor_tile.png');
    this.load.image('player', 'assets/images/playerShip.png');
    this.load.image('doorLocked', 'assets/images/door_locked.png');
    this.load.image('doorOpen', 'assets/images/door_open.png');
    this.load.image('hazard', 'assets/images/hazard.png');
    this.load.image('security', 'assets/images/security.png');
    this.load.image('sign', 'assets/images/sign.png');
  }

  create() {
    // Randomize player starting position
    const startX = Phaser.Math.Between(100, this.cameras.main.width - 100);
    const startY = Phaser.Math.Between(100, this.cameras.main.height - 100);

    this.player = this.physics.add.sprite(startX, startY, 'player')
      .setDisplaySize(50, 50)
      .setCollideWorldBounds(true);

    // Controls
    this.cursors = this.input.keyboard.createCursorKeys();

    // Create interactable elements
    this.createDoors();
    this.createHazards();
    this.createSecuritySystems();
    this.createSigns();

    // Instructions
    this.add.text(20, 20, 'Explore the ship. Find and unlock the control room.', {
      fontSize: '20px',
      fill: '#fff'
    });
  }

  update() {
    const speed = 150;
    this.player.setVelocity(0);

    if (this.cursors.left.isDown) this.player.setVelocityX(-speed);
    else if (this.cursors.right.isDown) this.player.setVelocityX(speed);
    if (this.cursors.up.isDown) this.player.setVelocityY(-speed);
    else if (this.cursors.down.isDown) this.player.setVelocityY(speed);
  }

  createDoors() {
    // Locked door requiring a puzzle or key to unlock
    this.doorLocked = this.physics.add.staticImage(400, 200, 'doorLocked')
      .setDisplaySize(50, 50);
    
    // Open door placeholder
    this.doorOpen = this.physics.add.staticImage(600, 200, 'doorOpen')
      .setDisplaySize(50, 50)
      .setAlpha(0); // Initially invisible

    // Player overlap with locked door (requires secure key)
    this.physics.add.overlap(this.player, this.doorLocked, () => {
      if (this.hasSecureKey) {
        this.add.text(350, 170, 'Door locked. Solve puzzle to unlock...', { fontSize: '16px', fill: '#0f0' });
        this.initiateQuantumPuzzle();
      } else {
        this.add.text(350, 170, 'Door is locked. Need secure key.', { fontSize: '16px', fill: '#f00' });
      }
    });

    // Player overlap with open door
    this.physics.add.overlap(this.player, this.doorOpen, () => {
      if (this.isPuzzleSolved) {
        this.add.text(570, 170, 'Control room unlocked! Mission complete!', { fontSize: '16px', fill: '#0f0' });
      }
    });
  }

  createHazards() {
    // Hazard zone (example: radiation zone)
    this.hazard = this.physics.add.staticImage(500, 400, 'hazard')
      .setDisplaySize(50, 50);
    
    this.physics.add.collider(this.player, this.hazard, () => {
      this.add.text(450, 380, 'Hazardous area! Avoid!', { fontSize: '16px', fill: '#ff0' });
    });
  }

  createSecuritySystems() {
    // Security system (example: old laser trap)
    this.security = this.physics.add.staticImage(300, 300, 'security')
      .setDisplaySize(50, 50);
    
    this.physics.add.collider(this.player, this.security, () => {
      this.add.text(250, 270, 'Security breach detected! Disable it with the key!', { fontSize: '16px', fill: '#ff0' });
    });
  }

  createSigns() {
    // Sign indicating the control room
    this.sign = this.physics.add.staticImage(100, 500, 'sign')
      .setDisplaySize(50, 50);
    
    this.physics.add.overlap(this.player, this.sign, () => {
      this.add.text(80, 470, 'Sign: "Control Room →"', { fontSize: '16px', fill: '#0ff' });
    });
  }

  initiateQuantumPuzzle() {
    // Simulate quantum puzzle solving
    // In a real game, this would be an interactive puzzle (matching polarizations, calculations, etc.)
    this.time.delayedCall(2000, () => {
      // Simulate puzzle solution success after a short delay
      this.isPuzzleSolved = true;
      this.unlockDoor();
    });
  }

  unlockDoor() {
    // Transition to unlock door (fade and move to indicate the unlocking)
    this.tweens.add({
      targets: this.doorLocked,
      alpha: 0,
      duration: 500,
      onComplete: () => {
        // Replace locked door with open door
        this.doorLocked.destroy();
        this.doorOpen.setAlpha(1); // Make open door visible
      }
    });
  }
}

export default Level4Scene;
