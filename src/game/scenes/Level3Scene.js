import Phaser from 'phaser';

class Level3Scene extends Phaser.Scene {
  constructor() {
    super({ key: 'Level3Scene' });
  }

  init(data) {
    // Receive the secret key status from previous level
    this.hasSecretKey = data.hasSecretKey || false;
  }

  preload() {
    // Load assets
    this.load.image('floor', 'assets/images/floor_tile.png');
    this.load.image('player', 'assets/images/playerShip.png');
    this.load.image('doorOpen', 'assets/images/door_open.png');
    this.load.image('doorLocked', 'assets/images/door_locked.png');
    this.load.image('hazard', 'assets/images/hazard.png');
    this.load.image('sign', 'assets/images/sign.png');
  }

  create() {
    // Create floor grid
    this.createMapLayout();

    // Add player
    this.player = this.physics.add.sprite(100, 100, 'player')
      .setDisplaySize(50, 50)
      .setCollideWorldBounds(true);

    // Controls
    this.cursors = this.input.keyboard.createCursorKeys();

    // Create interactable areas
    this.createDoors();
    this.createHazards();
    this.createSigns();

    // Instructions
    this.add.text(20, 20, 'Explore the ship. Find the control room.', {
      fontSize: '20px',
      fill: '#fff'
    });
  }

  update() {
    // Basic movement
    const speed = 150;
    this.player.setVelocity(0);

    if (this.cursors.left.isDown) this.player.setVelocityX(-speed);
    else if (this.cursors.right.isDown) this.player.setVelocityX(speed);
    if (this.cursors.up.isDown) this.player.setVelocityY(-speed);
    else if (this.cursors.down.isDown) this.player.setVelocityY(speed);
  }

  createMapLayout() {
    // Placeholder grid of tiles (floor only for now)
    for (let x = 0; x < this.cameras.main.width; x += 64) {
      for (let y = 0; y < this.cameras.main.height; y += 64) {
        this.add.image(x, y, 'floor').setOrigin(0).setDisplaySize(64, 64);
      }
    }
  }

  createDoors() {
    // Open door (initially hidden, will be revealed upon unlocking)
    this.doorOpen = this.physics.add.staticImage(300, 100, 'doorOpen')
      .setDisplaySize(50, 50)
      .setAlpha(0);  // Initially invisible

    // Locked door
    this.doorLocked = this.physics.add.staticImage(500, 100, 'doorLocked')
      .setDisplaySize(50, 50);

    // Overlap for open door
    this.physics.add.overlap(this.player, this.doorOpen, () => {
      this.add.text(250, 70, 'Door is open!', { fontSize: '16px', fill: '#0f0' });
    });

    // Overlap for locked door
    this.physics.add.overlap(this.player, this.doorLocked, () => {
      if (this.hasSecretKey) {
        this.add.text(450, 70, 'Used key. Door unlocking...', { fontSize: '16px', fill: '#0f0' });

        // Animate the locked door to unlock it
        this.unlockDoor();
      } else {
        this.add.text(450, 70, 'Door is locked. Need a key.', { fontSize: '16px', fill: '#f00' });
      }
    });
  }

  unlockDoor() {
    // Animation for unlocking the door: move out the locked door and fade in the open door
    this.tweens.add({
      targets: this.doorLocked,
      alpha: 0,
      duration: 500,
      onComplete: () => {
        // Replace the locked door with an open door sprite and fade it in
        this.doorLocked.destroy();
        this.doorOpen.setAlpha(1); // Make the door visible
      }
    });

    // You can add any additional animations like door opening here (e.g., scaling, sliding, etc.)
    this.tweens.add({
      targets: this.doorOpen,
      scaleX: 1.2,  // Scale up the door to show it's open
      scaleY: 1.2,
      duration: 300,
      yoyo: true,   // Make it shrink back to normal size
      repeat: 0
    });
  }

  createHazards() {
    this.hazard = this.physics.add.staticImage(400, 300, 'hazard')
      .setDisplaySize(50, 50);

    this.physics.add.collider(this.player, this.hazard, () => {
      this.add.text(350, 270, 'Hazardous area! Avoid!', { fontSize: '16px', fill: '#ff0' });
    });
  }

  createSigns() {
    this.sign = this.physics.add.staticImage(200, 400, 'sign')
      .setDisplaySize(50, 50);

    this.physics.add.overlap(this.player, this.sign, () => {
      this.add.text(180, 370, 'Sign: "Control Room →"', { fontSize: '16px', fill: '#0ff' });
    });
  }
}

export default Level3Scene;
