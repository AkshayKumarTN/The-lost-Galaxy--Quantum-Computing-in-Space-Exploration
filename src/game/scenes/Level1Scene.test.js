import 'jest-canvas-mock';
import Phaser from 'phaser';
import Level1Scene from '../scenes/Level1Scene';

test('Jest is working', () => {
  expect(true).toBe(true);
});

test('Level1Scene initializes correctly', () => {
  const scene = new Level1Scene();
  expect(scene).toBeDefined();
});

describe('Level1Scene', () => {
  let scene;
  let mockAdd;

  beforeEach(() => {
    mockAdd = {
      text: jest.fn(() => ({
        setText: jest.fn().mockReturnThis(),
        setFill: jest.fn().mockReturnThis(),
        setOrigin: jest.fn().mockImplementation(() => ({
          setInteractive: jest.fn().mockImplementation(() => ({
            on: jest.fn().mockReturnThis(),
          })),
        })),

      })),
      image: jest.fn(() => ({
        setOrigin: jest.fn().mockReturnThis(),  
        setScale: jest.fn().mockReturnThis(), 
        setDisplaySize: jest.fn().mockReturnThis()
      })),
      circle: jest.fn(() => ({
        setInteractive: jest.fn().mockReturnThis(),
        on: jest.fn().mockReturnThis()
      })),
    };
  
    scene = new Level1Scene();
    scene.add = mockAdd;
    scene.scale = { width: 800, height: 600 };
    scene.tweens = { add: jest.fn() };
    scene.scannerStatusText = { setText: jest.fn().mockReturnThis(), setFill: jest.fn().mockReturnThis() };
  
    scene.create();
  });

  it('should initialize scene correctly', () => {
    expect(scene).toBeDefined();
    expect(mockAdd.text).toHaveBeenCalled();
    expect(mockAdd.image).toHaveBeenCalled();
  });

  it('should show quiz after clearing stars', () => {
    scene.showQuiz();
    expect(scene.questionText).toBeDefined();
    expect(mockAdd.text).toHaveBeenCalledWith(expect.any(Number), expect.any(Number), expect.any(String), expect.any(Object));
  });

  it('should display stars correctly', () => {
    scene.showStars();
    expect(mockAdd.circle).toHaveBeenCalled();
  });
  
  it('should reveal lost ship on correct star selection', () => {
    scene.revealLostShip({ x: 100, y: 100 });
    expect(scene.tweens.add).toHaveBeenCalled();
  });
 


});