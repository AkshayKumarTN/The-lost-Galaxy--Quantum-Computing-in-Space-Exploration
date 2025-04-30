import Phaser from 'phaser';

class Level4Scene extends Phaser.Scene {
    constructor() {
        super({ key: 'Level4Scene' });

        this.keysCollected = 0;
        this.keyLocations = {
            2: { x: 250, y: 180 },
            3: { x: 600, y: 400 },
            5: { x: 150, y: 350 },
            7: { x: 700, y: 200 },
            8: { x: 400, y: 500 }
        };
        this.totalKeys = Object.keys(this.keyLocations).length;
        this.foundKeys = new Set();
        this.redKeyLocations = [
            { x: 300, y: 250 },
            { x: 550, y: 450 },
            { x: 650, y: 150 }
        ];
        this.alarmSound = null; // To hold the alarm sound instance
        this.isAlarmActive = false; // To track if the alarm is playing
    }


    preload() {
        this.load.image('nebulaBackground', 'assets/images/nebula_space.jpg');

        for (let i = 1; i <= 10; i++) {
            this.load.image(`room${i}-original`, `assets/original/${i}.jpg`);
            this.load.image(`room${i}-processed`, `assets/processed/${i}p.png`);
        }

        this.load.image('star_bg1', 'assets/nebula/vast_star_field1.jpg');
        this.load.image('star_bg2', 'assets/nebula/vast_star_field2.jpg');
        this.load.image('star_bg3', 'assets/nebula/vast_star_field3.jpg');
        this.load.image('key', 'assets/key.png');
        this.load.image('red_key', 'assets/red_key.png');
        this.load.audio('space_sound', 'assets/space_sound.mp3');
        this.load.audio('granted', 'assets/granted.mp3');
        this.load.audio('alarm', 'assets/alarm.mp3'); // Loading the alarm sound
        this.load.audio('start_up', 'assets/start_up.mp3'); // Loading the start_up sound
    }

    create() {
        const { width, height } = this.scale;

        const background = this.add.image(width / 2, height / 2, 'nebulaBackground').setOrigin(0.5);
        const scaleX = width / background.width;
        const scaleY = height / background.height;
        background.setScale(Math.min(scaleX, scaleY));

        this.cameras.main.setZoom(1);
        this.cameras.main.setBounds(0, 0, width * 2, height * 2);
        this.cameras.main.scrollX = width / 2;
        this.cameras.main.scrollY = height / 2;

        // Drag camera
        this.input.on('pointerdown', (pointer) => {
            this.startDrag(pointer);
        });

        this.setupGame();
        this.sound.add('space_sound').play({ loop: true }); // Loop space sound
        this.alarmSound = this.sound.add('alarm'); // Initialize the alarm sound
    }

    
  startDrag(pointer) {
    this.startX = pointer.x;
    this.startY = pointer.y;

    if (!this.dragListener) {
      this.dragListener = (pointer) => {
        if (pointer.isDown) {
          const deltaX = pointer.x - this.startX;
          const deltaY = pointer.y - this.startY;

          this.cameras.main.scrollX -= deltaX;
          this.cameras.main.scrollY -= deltaY;

          this.startX = pointer.x;
          this.startY = pointer.y;
        }
      };
      this.input.on('pointermove', this.dragListener);
    }

    this.input.once('pointerup', () => {
      if (this.dragListener) {
        this.input.off('pointermove', this.dragListener);
        this.dragListener = null;
      }
    });
  }

    setupGame() {
        this.background = this.add.image(0, 0, 'star_bg1')
            .setOrigin(0)
            .setScrollFactor(0)
            .setDepth(-1)
            .setDisplaySize(this.scale.width, this.scale.height);

        this.panoContainer = this.add.container(0, 0);
        this.currentRoom = 1;

        this.createUI();
        this.setupControls();
        this.setupRoom();
    }

    setupRoom() {
        this.panoContainer.removeAll();

        const nebulas = ['star_bg1', 'star_bg2', 'star_bg3'];
        this.background.setTexture(Phaser.Utils.Array.GetRandom(nebulas));

        const roomWidth = this.scale.width;
        const roomHeight = this.scale.height;

        // Add original and processed images side-by-side
        this.panoContainer.add(
            this.add.image(0, 0, `room${this.currentRoom}-original`)
                .setOrigin(0)
                .setDisplaySize(roomWidth, roomHeight)
        );
        this.panoContainer.add(
            this.add.image(roomWidth, 0, `room${this.currentRoom}-processed`)
                .setOrigin(0)
                .setDisplaySize(roomWidth, roomHeight)
        );

        // Add blue keys (normal keys)
        this.addKeyToRoom();
        // Add red keys (special keys)
        this.addRedKeysToRoom();

        this.cameras.main.setBounds(0, 0, roomWidth * 2, roomHeight)
            .centerOn(roomWidth, roomHeight / 2);
    }

    addKeyToRoom() {
        if (this.keyLocations[this.currentRoom] && !this.foundKeys.has(this.currentRoom)) {
            const location = this.keyLocations[this.currentRoom];
            const key = this.add.image(location.x, location.y, 'key')
                .setInteractive()
                .setScale(0.1) // Make the key smaller
                .on('pointerdown', () => this.collectKey(this.currentRoom, key));

            this.panoContainer.add(key);

            this.tweens.add({
                targets: key,
                y: key.y - 10,
                duration: 800,
                yoyo: true,
                repeat: -1,
                ease: 'Sine.easeInOut'
            });

            this.tweens.add({
                targets: key,
                angle: { from: -5, to: 5 },
                duration: 1000,
                yoyo: true,
                repeat: -1,
                ease: 'Sine.easeInOut'
            });
        }
    }

    addRedKeysToRoom() {
        this.redKeyLocations.forEach(location => {
            const redKey = this.add.image(location.x, location.y, 'red_key')
                .setInteractive()
                .setScale(0.2) // Same size as before for red keys
                .on('pointerdown', () => this.activateAlarm(redKey));

            this.panoContainer.add(redKey);

            this.tweens.add({
                targets: redKey,
                y: redKey.y - 10,
                duration: 800,
                yoyo: true,
                repeat: -1,
                ease: 'Sine.easeInOut'
            });

            this.tweens.add({
                targets: redKey,
                angle: { from: -5, to: 5 },
                duration: 1000,
                yoyo: true,
                repeat: -1,
                ease: 'Sine.easeInOut'
            });
        });
    }

    activateAlarm(redKey) {
        if (!this.isAlarmActive) {
            this.isAlarmActive = true;
            this.alarmSound.play({ loop: true }); // Start alarm sound when red key is clicked
        }

        // Optionally hide the red key once clicked
        this.tweens.add({
            targets: redKey,
            scale: 0,
            alpha: 0,
            duration: 600,
            ease: 'Power2',
            onComplete: () => redKey.destroy()
        });
    }

    collectKey(roomNumber, keyObject) {
        if (this.foundKeys.has(roomNumber)) return; // Prevent collecting keys twice

        this.foundKeys.add(roomNumber);
        this.keysCollected++;

        // Play the start-up sound when a key is collected
        this.sound.add('start_up').play();

        // Stop the alarm sound when a blue key is collected
        if (this.isAlarmActive) {
            this.isAlarmActive = false;
            this.alarmSound.stop(); // Stop the alarm sound
        }

        this.tweens.add({
            targets: keyObject,
            scale: 2,
            alpha: 0,
            duration: 600,
            ease: 'Power2',
            onComplete: () => keyObject.destroy()
        });

        // Check if all keys are collected
        if (this.keysCollected === this.totalKeys) {
            this.playGrantedSound(); // Play granted sound once all keys are found
            this.showAllKeysFoundMessage();
        }
    }

    playGrantedSound() {
        this.sound.add('granted').play(); // Play the "granted" sound
    }

    showAllKeysFoundMessage() {
        const message = this.add.text(
            this.scale.width / 2, this.scale.height / 2,
            'All keys were found!',
            { fontSize: '32px', fill: '#fff', backgroundColor: '#000a' }
        ).setOrigin(0.5).setScrollFactor(0);

        this.tweens.add({
            targets: message,
            alpha: 0,
            duration: 2000,
            delay: 1000,
            onComplete: () => message.destroy()
        });
    }

    createUI() {
        const arrowSize = 80;

        this.rightArrow = this.add.rectangle(
            this.scale.width - 60, this.scale.height / 2,
            arrowSize, arrowSize, 0x00ff00, 0.5
        ).setInteractive()
            .setScrollFactor(0)
            .on('pointerdown', () => this.changeRoom(1));

        this.leftArrow = this.add.rectangle(
            60, this.scale.height / 2,
            arrowSize, arrowSize, 0xff0000, 0.5
        ).setInteractive()
            .setScrollFactor(0)
            .on('pointerdown', () => this.changeRoom(-1));

        this.roomText = this.add.text(
            this.scale.width / 2, 30,
            `Room ${this.currentRoom}/10`,
            { fontSize: '24px', fill: '#fff', backgroundColor: '#000a' }
        ).setOrigin(0.5).setScrollFactor(0);
    }

    setupControls() {
        this.input.on('pointerdown', pointer => {
            this.dragStartX = pointer.x;
            this.isDragging = true;
        });

        this.input.on('pointerup', () => {
            this.isDragging = false;
        });

        this.input.on('pointermove', pointer => {
            if (this.isDragging) {
                const delta = pointer.x - this.dragStartX;
                this.cameras.main.scrollX -= delta * 1.5;
                this.dragStartX = pointer.x;
            }
        });
    }

    changeRoom(delta) {
        this.currentRoom += delta;
        if (this.currentRoom > 10) this.currentRoom = 1;
        if (this.currentRoom < 1) this.currentRoom = 10;

        this.roomText.setText(`Room ${this.currentRoom}/10`);
        this.setupRoom();
    }
}

export default Level4Scene;
