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
    },
  
    create: function() {
      const { width, height } = this.scale;

      // Add background and scale it correctly
      this.background = this.add.image(width / 2, height / 2, 'space_bg').setOrigin(0.5, 0.5);
      this.background.setDisplaySize(width, height); // Ensures it fills the canvas

      // Define bounds to keep stars inside the background
      this.bgBounds = {
        xMin: width * 0.1, 
        xMax: width * 0.9, 
        yMin: height * 0.1, 
        yMax: height * 0.9
      };

      this.showQuiz();
    },

    showQuiz: function() {
        let questionIndex = Phaser.Math.Between(0, quizData.length - 1);
        let questionData = quizData[questionIndex];

        const { width, height } = this.scale;

        this.questionText = this.add.text(width / 2, height / 3, questionData.question, { 
            fontSize: '24px', 
            fill: '#fff',
            align: 'center'
        }).setOrigin(0.5);

        this.optionTexts = questionData.options.map((option, index) => {
            return this.add.text(width / 2, height / 2 + index * 40, option, { 
                fontSize: '18px', 
                fill: '#0ff',
                align: 'center'
            })
            .setOrigin(0.5)
            .setInteractive()
            .on('pointerdown', () => this.checkAnswer(option, questionData.answer));
        });
    },

    checkAnswer: function(selected, correct) {
        if (selected === correct) {
            this.clearQuiz();
            this.showStars();
        } else {
            const { width, height } = this.scale;
            this.add.text(width / 2, height * 0.75, "Incorrect! Try again.", { 
                fontSize: '20px', 
                fill: '#ff0000',
                align: 'center'
            }).setOrigin(0.5);
        }
    },

    clearQuiz: function() {
        this.questionText.destroy();
        this.optionTexts.forEach(text => text.destroy());
    },

    showStars: function() {
        const { xMin, xMax, yMin, yMax } = this.bgBounds;

        // Generate 7-10 stars inside the background area
        for (let i = 0; i < Phaser.Math.Between(7, 10); i++) {
            let x = Phaser.Math.Between(xMin, xMax);
            let y = Phaser.Math.Between(yMin, yMax);
            this.add.circle(x, y, 5, 0xffff00);

            let probabilityScore = (Math.random() * 100).toFixed(2);
            this.add.text(x - 10, y + 20, `Score: ${probabilityScore}%`, { fontSize: '14px', fill: '#fff' });
        }
    }
});

export default Level1Superposition;