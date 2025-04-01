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

class Level1Scene extends Phaser.Scene {
  constructor() {
    super({ key: 'Level1Scene' });
    this.incorrectText = null;  // Keep track of the incorrect text element
  }

  preload() {
    this.load.image('space_bg', 'assets/images/space_bg.png'); // Background image
  }

  create() {
    const { width, height } = this.scale;
    
    // Add background and scale it correctly
    this.background = this.add.image(width / 2, height / 2, 'space_bg').setOrigin(0.5, 0.5);
    this.background.setDisplaySize(width, height); // Ensures it fills the canvas

    this.backgroundBounds = {
      xMin: width * 0.1,
      xMax: width * 0.9,
      yMin: height * 0.1,
      yMax: height * 0.9
    };

    this.add.text(width / 2, 50, 'Level 1: Superposition Navigation – Finding the Lost Ship', {
      fontSize: '32px',
      fill: '#ffffff'
    })
    .setOrigin(0.5, 0);  // Center horizontally, top-aligned vertically
    
    // Navigation button
    const nextButton = this.add.text(width / 2, height - 100, 'Next Level', {
      fontSize: '24px',
      fill: '#0f0',
      backgroundColor: ''
    })
    .setOrigin(0.5)
    .setInteractive()
    .on('pointerdown', () => this.scene.start('Level2Scene'));

    // Show quiz
    this.showQuiz();
  }

  showQuiz() {
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
  }

  checkAnswer(selected, correct) {
    if (this.incorrectText) {
      this.incorrectText.destroy();  // Remove incorrect text if it exists
    }

    if (selected === correct) {
      this.clearQuiz();
      this.showStars();
    } else {
      const { width, height } = this.scale;
      this.incorrectText = this.add.text(width / 2, height * 0.75, "Incorrect! Try again.", {
        fontSize: '20px',
        fill: '#ff0000',
        align: 'center'
      }).setOrigin(0.5);
    }
  }

  clearQuiz() {
    this.questionText.destroy();
    this.optionTexts.forEach(text => text.destroy());
  }

  showStars() {
    const { xMin, xMax, yMin, yMax } = this.backgroundBounds;

    // Generate 7-10 stars inside the background area
    for (let i = 0; i < Phaser.Math.Between(7, 10); i++) {
      let x = Phaser.Math.Between(xMin, xMax);
      let y = Phaser.Math.Between(yMin, yMax);
      this.add.circle(x, y, 5, 0xffff00);

      let probabilityScore = (Math.random() * 100).toFixed(2);
      this.add.text(x - 10, y + 20, `Score: ${probabilityScore}%`, { fontSize: '14px', fill: '#fff' });
    }
  }
}

export default Level1Scene;
