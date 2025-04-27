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
            8: { x: 400, y: 500 },
            9: { x: 550, y: 300 }
        };
        this.totalKeys = Object.keys(this.keyLocations).length; // ✅ calculate the total number of keys dynamically
        this.foundKeys = new Set();
    }

    preload() {
        for (let i = 1; i <= 10; i++) {
            this.load.image(`room${i}-original`, `assets/original/${i}.jpg`);
            this.load.image(`room${i}-processed`, `assets/processed/${i}p.png`);
        }

        this.load.image('star_bg1', 'assets/nebula/vast_star_field1.jpg');
        this.load.image('star_bg2', 'assets/nebula/vast_star_field2.jpg');
        this.load.image('star_bg3', 'assets/nebula/vast_star_field3.jpg');

        this.load.image('key', 'assets/key.png'); // ✅ Correct key image path
        this.load.video('end_video', 'assets/videos/end_video.mp4', 'loadeddata', false, true);
    }

    create() {
        this.setupGame();
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

        if (this.keyLocations[this.currentRoom] && !this.foundKeys.has(this.currentRoom)) {
            const key = this.add.image(
                this.keyLocations[this.currentRoom].x,
                this.keyLocations[this.currentRoom].y,
                'key'
            )
            .setInteractive()
            .setScale(0.3)
            .on('pointerdown', () => {
                this.collectKey(this.currentRoom, key);
            });

            this.tweens.add({
                targets: key,
                scale: 0.35,
                duration: 1000,
                yoyo: true,
                repeat: -1
            });
        }

        this.cameras.main.setBounds(0, 0, roomWidth * 2, roomHeight)
                         .centerOn(roomWidth, roomHeight / 2);
    }

    collectKey(roomNumber, keyObject) {
        if (this.foundKeys.has(roomNumber)) return;

        console.log(`Key collected from room: ${roomNumber}`); // ✅ debug info
        this.foundKeys.add(roomNumber);
        this.keysCollected++;

        this.tweens.add({
            targets: keyObject,
            alpha: 0,
            scale: 0,
            duration: 500,
            onComplete: () => {
                keyObject.destroy();
            }
        });

        this.updateKeyDisplay();

        if (this.keysCollected === this.totalKeys) {  // ✅ check against dynamically calculated total keys
            console.log('All keys collected! 🎉 Playing video...');
            this.time.delayedCall(500, () => this.playEndingVideo());
        }
    }

    playEndingVideo() {
        this.panoContainer.setVisible(false);
        this.background.setVisible(false);

        const video = this.add.video(this.scale.width / 2, this.scale.height / 2, 'end_video');
        video.setDisplaySize(this.scale.width, this.scale.height);
        video.play(false);

        video.on('complete', () => {
            video.destroy();
            this.panoContainer.setVisible(true);
            this.background.setVisible(true);
        });
    }

    createUI() {
        const arrowSize = 80;

        this.add.rectangle(
            this.scale.width - 60,
            this.scale.height / 2,
            arrowSize, arrowSize,
            0x00ff00, 0.5
        ).setInteractive()
         .setScrollFactor(0)
         .on('pointerdown', () => this.changeRoom(1));

        this.add.rectangle(
            60, this.scale.height / 2,
            arrowSize, arrowSize,
            0xff0000, 0.5
        ).setInteractive()
         .setScrollFactor(0)
         .on('pointerdown', () => this.changeRoom(-1));

        this.roomText = this.add.text(
            this.scale.width / 2, 30,
            `Room ${this.currentRoom}/10`,
            { fontSize: '24px', fill: '#fff', backgroundColor: '#000a' }
        ).setOrigin(0.5).setScrollFactor(0);

        this.keyDisplay = this.add.container(20, 20);
        this.updateKeyDisplay();
    }

    updateKeyDisplay() {
        this.keyDisplay.removeAll();

        this.keyDisplay.add(
            this.add.text(0, 0, 'Keys Found:', { fontSize: '18px', fill: '#ff0' })
        );

        for (let i = 1; i <= this.totalKeys; i++) {  // ✅ loop through the dynamically calculated total keys
            const icon = this.add.image(120 + (i * 40), 15, 'key')
                .setScale(0.2)
                .setAlpha(this.keysCollected >= i ? 1 : 0.3);
            this.keyDisplay.add(icon);
        }

        this.keyDisplay.add(
            this.add.text(0, 30, `${this.keysCollected}/${this.totalKeys} keys collected`,  // ✅ updated display
                { fontSize: '16px', fill: '#fff' })
        );
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
        if (this.currentRoom < 1) this.currentRoom = 10;
        if (this.currentRoom > 10) this.currentRoom = 1;
        this.roomText.setText(`Room ${this.currentRoom}/10`);
        this.setupRoom();
    }
}

export default Level4Scene;
