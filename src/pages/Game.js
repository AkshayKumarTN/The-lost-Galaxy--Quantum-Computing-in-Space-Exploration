import { useEffect } from 'react';
import Phaser from 'phaser';
import MainScene from '../game/scenes/MainScene';
import Level1Scene from '../game/scenes/Level1Scene';
import Level2Scene from '../game/scenes/Level2Scene';
import Level3Scene from '../game/scenes/Level3Scene';

const Game = () => {
  useEffect(() => {
    let game;
    const handleResize = () => {
      if (game && !game.destroyed) {
        game.scale.resize(window.innerWidth, window.innerHeight);
      }
    };

    const config = {
      type: Phaser.AUTO,
      width: window.innerWidth,
      height: window.innerHeight,
      parent: 'game-container',
      scene: [MainScene, Level1Scene, Level2Scene, Level3Scene],
      physics: {
        default: 'arcade',
        arcade: { 
          gravity: { y: 0 },
          debug: false
        }
      },
      scale: {
        mode: Phaser.Scale.RESIZE,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        min: {
          width: 800,
          height: 600
        }
      },
      dom: {
        createContainer: true
      }
    };

    game = new Phaser.Game(config);
    window.addEventListener('resize', handleResize);

    return () => {
      if (game && !game.destroyed) {
        game.destroy(true);
      }
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div 
      id="game-container" 
      style={{ 
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
        position: 'fixed',
        top: 0,
        left: 0
      }} 
    />
  );
};

export default Game;