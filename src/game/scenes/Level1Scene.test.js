import 'jest-canvas-mock';

import Level1Scene from '../scenes/Level1Scene';

jest.mock('phaser3spectorjs', () => {});

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
        setDepth: jest.fn().mockReturnThis()

      })),
      image: jest.fn(() => ({
        setOrigin: jest.fn().mockReturnThis(),  
        setScale: jest.fn().mockReturnThis(), 
        setDisplaySize: jest.fn().mockReturnThis(),
        setAlpha: jest.fn().mockReturnThis(),
      })),
      circle: jest.fn(() => ({
        setInteractive: jest.fn().mockReturnThis(),
        on: jest.fn().mockReturnThis()
      })),
      rectangle: jest.fn(() => ({
        setStrokeStyle: jest.fn().mockReturnThis(),
        setDepth: jest.fn().mockReturnThis(),
        setFillStyle: jest.fn().mockReturnThis(),
      })),
      zone: jest.fn(() => ({
        setOrigin: jest.fn().mockReturnThis(),
        setInteractive: jest.fn().mockReturnThis(),
        setData: jest.fn().mockReturnThis(),
        on: jest.fn().mockReturnThis(),
      })),
    };
  
    scene = new Level1Scene();
    scene.add = mockAdd;
    scene.input = { on: jest.fn() };
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

});