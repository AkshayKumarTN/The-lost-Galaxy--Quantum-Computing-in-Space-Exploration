import { useEffect } from 'react';
import Phaser from 'phaser';


const Level1Superposition = new Phaser.Class({
    Extends: Phaser.Scene,
  
    initialize: function() {
      Phaser.Scene.call(this, { key: 'Level1Superposition' });
      this.locations = []; // Locations on the map
      this.probabilities = []; // Probabilities for each location
      this.selectedLocation = null;
    },
  
    preload: function() {
      // Load assets (sprites, images, etc.)
      this.load.image('space_bg', 'assets/images/space_bg.png');
      this.load.image('scanner_tool', 'assets/images/scanner_tool.png');
      this.load.image('location_marker', 'assets/images/location_marker.png');
      this.load.image('paradox_icon', 'assets/images/paradox_icon.png');
      this.load.audio('quantum_sound', 'assets/images/quantum_sound.mp3');
    },
  
    create: function() {
      // Create background
      this.add.image(400, 300, 'space_bg');
  
      // Initialize locations and probabilities
      this.createLocations();
  
      // Display locations as markers on the map
      this.displayLocations();
  
      // Add scanner tool for probability adjustments
      this.createScannerTool();
  
      // Handle location selection logic
      this.input.on('pointerdown', this.handleLocationSelection, this);
  
      // Set up the player's feedback and progression system
      this.setupFeedback();
    },
  
    createLocations: function() {
      // Define multiple possible locations and their probabilities
      this.locations = [
        { x: 200, y: 150, probability: 0.3 },
        { x: 600, y: 200, probability: 0.5 },
        { x: 400, y: 500, probability: 0.2 }
      ];
  
      this.probabilities = [0.3, 0.5, 0.2];
    },
  
    displayLocations: function() {
      // Display each location on the map with its probability score
      for (let i = 0; i < this.locations.length; i++) {
        let location = this.locations[i];
        this.add.image(location.x, location.y, 'location_marker').setInteractive();
  
        // Display probability score as text
        this.add.text(location.x - 30, location.y - 20, `P: ${location.probability.toFixed(2)}`, { font: '16px Arial', fill: '#ffffff' });
      }
    },
  
    createScannerTool: function() {
      // Create a tool (quantum scanner) for adjusting probabilities
      let scanner = this.add.image(700, 100, 'scanner_tool').setInteractive();
  
      scanner.on('pointerdown', () => {
        this.adjustProbabilities();
      });
    },
  
    adjustProbabilities: function() {
      // Simulate adjusting the probabilities with some algorithm
      for (let i = 0; i < this.probabilities.length; i++) {
        this.probabilities[i] = Phaser.Math.FloatBetween(0, 1);
      }
  
      // Update displayed probabilities
      this.scene.restart();
    },
  
    handleLocationSelection: function(pointer) {
      // Check if the player clicked a location
      for (let i = 0; i < this.locations.length; i++) {
        let location = this.locations[i];
        let marker = this.children.getByName('location_marker');
  
        if (Phaser.Geom.Rectangle.Contains(marker.getBounds(), pointer.x, pointer.y)) {
          this.selectedLocation = location;
  
          // Collapse the quantum state and determine if the selection was correct
          this.collapseQuantumState();
          break;
        }
      }
    },
  
    collapseQuantumState: function() {
      // Simulate the collapse of the quantum state
      let chosenProbability = this.selectedLocation.probability;
  
      // Simulate the ship's actual location based on probabilities
      let actualLocation = Math.random() < 0.5 ? this.selectedLocation : null;
  
      if (actualLocation) {
        this.findShip();
      } else {
        this.triggerParadox();
      }
    },
  
    findShip: function() {
      // Show feedback for finding the ship
      this.add.text(300, 400, 'You found the ship! Proceeding with the mission...', { font: '24px Arial', fill: '#00ff00' });
      this.time.delayedCall(2000, () => {
        this.scene.start('NextLevel');  // Transition to next level
      });
    },
  
    triggerParadox: function() {
      // Handle the paradox scenario
      this.add.image(400, 300, 'paradox_icon').setOrigin(0.5);
  
      // Show paradox puzzle
      this.add.text(300, 400, 'Quantum Paradox Detected! Solve the puzzle to resolve the timeline.', { font: '24px Arial', fill: '#ff0000' });
      this.createPuzzle();
    },
  
    createPuzzle: function() {
      // Create a simple puzzle for resolving the paradox
      let puzzleText = this.add.text(300, 500, 'Solve the quantum puzzle (e.g., math or logic)', { font: '20px Arial', fill: '#ffffff' });
      
      // Puzzle logic here (e.g., click the correct answer)
      this.input.on('pointerdown', () => {
        // Handle puzzle interaction logic here
        this.resolvePuzzle(true);  // For now, assume the player solves it
      });
    },
  
    resolvePuzzle: function(solved) {
      if (solved) {
        this.add.text(300, 550, 'Quantum Paradox Resolved! Returning to the game...', { font: '20px Arial', fill: '#00ff00' });
        this.time.delayedCall(2000, () => {
          this.scene.restart();  // Retry or continue
        });
      } else {
        this.add.text(300, 550, 'Incorrect. Try again!', { font: '20px Arial', fill: '#ff0000' });
      }
    },
  
    setupFeedback: function() {
      // Provide visual and audio feedback for player actions
      this.sound.add('quantum_sound').play();
    },
  });
  
  // Export for use in the game engine
  export default Level1Superposition;