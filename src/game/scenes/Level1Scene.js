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
  },
  {
    question: "What does the 'No-Cloning Theorem' state?",
    options: [
      "A) Quantum information can be copied",
      "B) Quantum information cannot be perfectly copied",
      "C) Quantum states can be teleported",
      "D) Quantum states can be measured without disturbance"
    ],
    answer: "B) Quantum information cannot be perfectly copied"
  },
  {
    question: "Which quantum phenomenon allows a particle to exist in multiple states simultaneously?",
    options: [
      "A) Superposition",
      "B) Quantum Tunneling",
      "C) No-Cloning Theorem",
      "D) Decoherence"
    ],
    answer: "A) Superposition"
  },
  {
    question: "What is the main advantage of QKD over classical key distribution?",
    options: [
      "A) It is faster",
      "B) It is unbreakable under quantum mechanics",
      "C) It requires no physical transmission medium",
      "D) It does not require encryption"
    ],
    answer: "B) It is unbreakable under quantum mechanics"
  },
  {
    question: "What is the role of entanglement in quantum cryptography?",
    options: [
      "A) It allows instantaneous communication",
      "B) It enables secure key exchange by ensuring correlated results",
      "C) It speeds up classical encryption",
      "D) It is used for error correction"
    ],
    answer: "B) It enables secure key exchange by ensuring correlated results"
  },
  {
    question: "Which protocol is commonly used for Quantum Key Distribution (QKD)?",
    options: [
      "A) RSA",
      "B) BB84",
      "C) AES",
      "D) SHA-256"
    ],
    answer: "B) BB84"
  },
  {
    question: "What happens if an eavesdropper tries to intercept a QKD transmission?",
    options: [
      "A) The key transmission speeds up",
      "B) The key remains unchanged",
      "C) The quantum state is disturbed, alerting the users",
      "D) The key is securely stored"
    ],
    answer: "C) The quantum state is disturbed, alerting the users"
  },
  {
    question: "Which scientist is credited with introducing the BB84 protocol?",
    options: [
      "A) Richard Feynman",
      "B) Charles Bennett and Gilles Brassard",
      "C) Albert Einstein",
      "D) John Bell"
    ],
    answer: "B) Charles Bennett and Gilles Brassard"
  },
  {
    question: "What physical property of photons does BB84 use for encoding information?",
    options: [
      "A) Mass",
      "B) Spin",
      "C) Polarization",
      "D) Charge"
    ],
    answer: "C) Polarization"
  },
  {
    question: "Which quantum concept ensures the secrecy of QKD?",
    options: [
      "A) Quantum Entanglement",
      "B) Heisenberg Uncertainty Principle",
      "C) Quantum Supremacy",
      "D) Quantum Parallelism"
    ],
    answer: "B) Heisenberg Uncertainty Principle"
  },
  {
    question: "What is the primary goal of post-quantum cryptography?",
    options: [
      "A) To create faster encryption methods",
      "B) To secure data against quantum computers",
      "C) To replace all classical cryptographic methods",
      "D) To improve cloud computing security"
    ],
    answer: "B) To secure data against quantum computers"
  },
  {
    question: "Which of the following is a quantum-safe cryptographic algorithm?",
    options: [
      "A) RSA",
      "B) ECC",
      "C) Lattice-based cryptography",
      "D) MD5"
    ],
    answer: "C) Lattice-based cryptography"
  },
  {
    question: "What type of attack can a quantum computer perform efficiently on RSA encryption?",
    options: [
      "A) Brute force attack",
      "B) Shor's algorithm-based factoring",
      "C) Man-in-the-middle attack",
      "D) Side-channel attack"
    ],
    answer: "B) Shor's algorithm-based factoring"
  },
  {
    question: "Which quantum algorithm provides an exponential speedup for searching?",
    options: [
      "A) Shor's Algorithm",
      "B) Grover's Algorithm",
      "C) RSA Algorithm",
      "D) Simon's Algorithm"
    ],
    answer: "B) Grover's Algorithm"
  },
  {
    question: "What is quantum decoherence?",
    options: [
      "A) The process of measuring a quantum state",
      "B) The loss of quantum information due to interaction with the environment",
      "C) The act of quantum entanglement",
      "D) The process of quantum teleportation"
    ],
    answer: "B) The loss of quantum information due to interaction with the environment"
  },
  {
    question: "What is a qubit?",
    options: [
      "A) A classical bit in a quantum system",
      "B) A basic unit of quantum information",
      "C) A quantum error correction technique",
      "D) A noise source in quantum computing"
    ],
    answer: "B) A basic unit of quantum information"
  },
  {
    question: "Which material is often used for superconducting quantum computers?",
    options: [
      "A) Silicon",
      "B) Niobium",
      "C) Gold",
      "D) Iron"
    ],
    answer: "B) Niobium"
  },
  {
    question: "What is quantum supremacy?",
    options: [
      "A) The moment when a quantum computer outperforms classical computers in a specific task",
      "B) The point where all classical encryption becomes obsolete",
      "C) The theory that quantum computers can solve all problems",
      "D) A stage of quantum computer cooling"
    ],
    answer: "A) The moment when a quantum computer outperforms classical computers in a specific task"
  },
  {
    question: "Which of the following is a major challenge in building practical quantum computers?",
    options: [
      "A) Lack of classical computing power",
      "B) Quantum decoherence",
      "C) High energy consumption",
      "D) Limited internet access"
    ],
    answer: "B) Quantum decoherence"
  },
  {
    question: "What is quantum entanglement?",
    options: [
      "A) A process where quantum states become independent",
      "B) A phenomenon where two quantum particles share a linked state regardless of distance",
      "C) A method of increasing computation speed",
      "D) A classical encryption method"
    ],
    answer: "B) A phenomenon where two quantum particles share a linked state regardless of distance"
  }
];
class Level1Scene extends Phaser.Scene {
  constructor() {
    super({ key: 'Level1Scene' });
    this.stars = [];
    this.probabilityTexts = [];
    this.scannerActive = false;
    this.correctStar = null;
  }

  preload() {
    this.load.image('space_bg', 'assets/images/space_bg.png');
    this.load.image('lostShip', 'assets/images/lostShip.png');
  }

  create() {
    const { width, height } = this.scale;

    this.add.image(width / 2, height / 2, 'space_bg').setOrigin(0.5, 0.5).setDisplaySize(width, height);

    this.add.text(width / 2, 50, 'Level 1: Superposition Navigation – Finding the Lost Ship', {
      fontSize: '32px',
      fill: '#ffffff'
    }).setOrigin(0.5, 0);

    this.scannerStatusText = this.add.text(width / 2, height - 30, "Quantum Scanner: Disabled", {
      fontSize: '20px',
      fill: '#ffff00'
    }).setOrigin(0.5);

    this.showQuiz();
  }

  showQuiz() {
    this.clearStars();

    let questionIndex = Phaser.Math.Between(0, quizData.length - 1);
    let questionData = quizData[questionIndex];
    const { width, height } = this.scale;

    this.questionText = this.add.text(width / 2, height / 3, questionData.question, {
      fontSize: '24px',
      fill: '#fff',
      align: 'center'
    }).setOrigin(0.5);

    this.optionTexts = questionData.options.map((option, index) => {
      let optionText = this.add.text(width / 2, height / 2 + index * 40, option, {
        fontSize: '18px',
        fill: '#0ff',
        align: 'center'
      }).setOrigin(0.5).setInteractive().on('pointerdown', () => this.checkAnswer(option, questionData.answer, optionText));
      return optionText;
    });
  }

  checkAnswer(selected, correct, selectedText) {
    if (selected === correct) {
      this.scannerActive = true;
      this.scannerStatusText.setText("Quantum Scanner: Active").setFill('#00ff00');
    } else {
      this.scannerActive = false;
      this.scannerStatusText.setText("Quantum Scanner: Disabled").setFill('#ffff00');
      selectedText.setFill('#ff0000'); // Highlight incorrect answer in red
    }
    this.clearQuiz();
    this.showStars();
  }

  clearQuiz() {
    this.questionText.destroy();
    this.optionTexts.forEach(text => text.destroy());
  }

  showStars() {
    this.clearStars(); // Ensure previous stars and probabilities are removed

    const { width, height } = this.scale;
    const xMin = width * 0.1, xMax = width * 0.9, yMin = height * 0.1, yMax = height * 0.9;
    
    this.stars = [];
    this.probabilityTexts = [];

    let numStars = Phaser.Math.Between(7, 10);
    let correctIndex = Phaser.Math.Between(0, numStars - 1);

    for (let i = 0; i < numStars; i++) {
      let x = Phaser.Math.Between(xMin, xMax);
      let y = Phaser.Math.Between(yMin, yMax);
      let star = this.add.circle(x, y, 5, 0xffff00).setInteractive();
      
      star.correct = (i === correctIndex);
      this.stars.push(star);

      if (this.scannerActive) {
        let probabilityScore = Phaser.Math.Between(50, 100).toFixed(2); // Higher probability for correct star
        if (star.correct) probabilityScore = "99.9";
        let probText = this.add.text(x - 10, y + 20, `Score: ${probabilityScore}%`, { fontSize: '14px', fill: '#fff' });
        this.probabilityTexts.push(probText);
      }

      star.on('pointerdown', () => this.checkStar(star));
    }
  }

  checkStar(selectedStar) {
    if (selectedStar.correct) {
      this.revealLostShip(selectedStar);
    } else {
      this.clearStars();
      this.showQuiz();
    }
  }

  revealLostShip(star) {
    let lostShip = this.add.image(star.x, star.y, 'lostShip').setOrigin(0.5, 0.5).setScale(0);
    
    this.tweens.add({
      targets: lostShip,
      scale: 1.5,
      duration: 2000,
      ease: 'Linear',
      onComplete: () => {
        // Send game result to the backend after clearing the level
        fetch('http://localhost:3000/api/gameResult', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            email: 'remese@gmail.com', // ⚡ Replace with the actual logged-in user's email
            level: 1,
            score: 800, // ⚡ Replace with the actual game score
            time: 120   // ⚡ Record the time spent in the game
          })
        })
        .then(res => res.json())
        .then(data => {
          console.log('Successfully saved game result:', data);
          this.scene.start('Level2Scene');
        })
        .catch(err => {
          console.error('Failed to save game result:', err);
          this.scene.start('Level2Scene');
        });
      }
    });
  }
  

  clearStars() {
    this.stars.forEach(star => star.destroy());
    this.probabilityTexts.forEach(text => text.destroy());
    this.stars = [];
    this.probabilityTexts = [];
  }
}

export default Level1Scene;