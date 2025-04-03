import { useEffect } from 'react';
import Phaser from 'phaser';

const quizData = [
    {
      question: "What is the primary purpose of Quantum Key Distribution (QKD)?",
      options: [
        "A) To increase internet speed",
        "B) To securely distribute encryption keys",
        "C) To create quantum computers",
        "D) To generate random numbers"
      ],
      answer: "B) To securely distribute encryption keys"
    },
    {
      question: "Which quantum principle is used in QKD to detect eavesdroppers?",
      options: [
        "A) Superposition",
        "B) Quantum Tunneling",
        "C) No-Cloning Theorem",
        "D) Quantum Entanglement"
      ],
      answer: "C) No-Cloning Theorem"
    }
];

const Level1Superposition = new Phaser.Class({
    Extends: Phaser.Scene,
  
    initialize: function() {
      Phaser.Scene.call(this, { key: 'Level1Superposition' });
    },
  
    preload: function() {
      this.load.image('space_bg', 'assets/images/space_bg.png');
      this.load.image('ship', 'assets/images/spaceship.png');
    },
  
    create: function() {
      const { width, height } = this.scale;
      this.background = this.add.image(width / 2, height / 2, 'space_bg').setOrigin(0.5, 0.5).setDisplaySize(width, height);
      this.stars = [];
      this.scannerActive = false;
      this.correctStar = null;
      
      this.scannerStatusText = this.add.text(width / 2, height - 30, 
        "Quantum Scanner: Disabled", 
        { fontSize: '20px', fill: '#ffff00' }
      ).setOrigin(0.5);

      this.showQuiz();
    },
  
    showQuiz: function() {
        let questionIndex = Phaser.Math.Between(0, quizData.length - 1);
        let questionData = quizData[questionIndex];
        const { width, height } = this.scale;

        this.questionText = this.add.text(width / 2, height / 3, questionData.question, { fontSize: '24px', fill: '#fff', align: 'center' }).setOrigin(0.5);

        this.optionTexts = questionData.options.map((option, index) => {
            let optionText = this.add.text(width / 2, height / 2 + index * 40, option, { fontSize: '18px', fill: '#0ff', align: 'center' })
                .setOrigin(0.5)
                .setInteractive()
                .on('pointerdown', () => this.checkAnswer(option, questionData.answer, optionText));
            return optionText;
        });
    },

    checkAnswer: function(selected, correct, selectedText) {
        this.clearQuiz();

        if (selected === correct) {
            this.scannerActive = true;
            this.scannerStatusText.setText("Quantum Scanner: Active").setFill('#00ff00');
        } else {
            this.scannerActive = false;
            this.scannerStatusText.setText("Quantum Scanner: Disabled").setFill('#ffff00');
            selectedText.setFill('#ff0000'); // Highlight incorrect answer in red
        }

        this.showStars();
    },

    clearQuiz: function() {
        this.questionText.destroy();
        this.optionTexts.forEach(text => text.destroy());
    },

    showStars: function() {
        const { width, height } = this.scale;
        this.stars.forEach(star => star.destroy());
        this.stars = [];

        this.correctStar = Phaser.Math.Between(0, 6);
        for (let i = 0; i < 7; i++) {
            let x = Phaser.Math.Between(width * 0.1, width * 0.9);
            let y = Phaser.Math.Between(height * 0.1, height * 0.9);

            let star = this.add.circle(x, y, 5, 0xffff00).setInteractive();
            star.starIndex = i;
            star.on('pointerdown', () => this.checkStar(star));
            this.stars.push(star);
        }
    },

    checkStar: function(selectedStar) {
        if (selectedStar.starIndex === this.correctStar) {
            this.showShip(selectedStar.x, selectedStar.y);
        }
    },

    showShip: function(x, y) {
        this.add.image(x, y, 'ship').setOrigin(0.5).setScale(0.5);
    }
});

export default Level1Superposition;