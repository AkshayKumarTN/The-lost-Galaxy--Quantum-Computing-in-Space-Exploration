import { useEffect } from 'react';
import Phaser from 'phaser';
import MainScene from '../game/scenes/MainScene';
import Level1Scene from '../game/scenes/Level1Scene';
import Level2Scene from '../game/scenes/Level2Scene';

const config = {
  type: Phaser.AUTO,
  width: window.innerWidth, //800
  height: window.innerHeight, //600,
  parent: 'game-container',
  scene: [MainScene, Level1Scene, Level2Scene],  // Include all scenes
  physics: {
    default: 'arcade',
    arcade: { gravity: { y: 0 } }
  },
  scale: {
    mode: Phaser.Scale.RESIZE,  // Adjusts to window size
    autoCenter: Phaser.Scale.CENTER_BOTH
  }
};

export default function Game() {
  useEffect(() => {
    const game = new Phaser.Game(config);

    // Resize the game when the window resizes
    const handleResize = () => {
      game.scale.resize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      game.destroy(true);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return <div id="game-container" style={{ width: '100vw', height: '100vh' }} />;
}

