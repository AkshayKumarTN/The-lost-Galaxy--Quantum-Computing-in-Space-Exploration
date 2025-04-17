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

  it('should assign correct number of ship parts and decoys', () => {
    // Mock possibleSpots so setRandomShipParts has something to work with
    scene.possibleSpots = new Array(20).fill(null).map((_, i) => ({ x: 0, y: 0, index: i }));
    
    scene.setRandomShipParts();
  
    expect(scene.shipPartIndexes.length).toBe(scene.requiredClicks);
    expect(scene.fakeShipIndices.length).toBe(scene.totalFakeShips);
  });

  it('should handle correct spot click and increase correctClicks', () => {
    scene.correctClicks = 0;
    scene.possibleSpots = [{ x: 0, y: 0, getData: () => 0 }];
    scene.shipPartIndexes = [0];
    scene.fakeShipIndices = [];
  
    const mockSpot = {
      x: 0,
      y: 0,
      getData: (key) => (key === 'index' ? 0 : false),
      setFillStyle: jest.fn(),
    };
  
    jest.spyOn(scene, 'createScanPulse').mockImplementation(() => {});
    jest.spyOn(scene, 'showHitEffect').mockImplementation(() => {});
    jest.spyOn(scene, 'showCaption').mockImplementation(() => {});
    jest.spyOn(scene, 'revealShipPart').mockImplementation(() => {});
    jest.spyOn(scene, 'assembleShip').mockImplementation(() => {});
  
    scene.handleSpotClick(mockSpot);
  
    expect(scene.correctClicks).toBe(1);
    expect(scene.revealShipPart).toHaveBeenCalledWith(0);
  });


  it('should handle empty space click and trigger reset effect', () => {
    scene.possibleSpots = [{ x: 0, y: 0, getData: () => 5 }];
    scene.shipPartIndexes = [0, 1, 2];
    scene.fakeShipIndices = [3, 4];
  
    const mockSpot = {
      x: 0,
      y: 0,
      getData: (key) => (key === 'index' ? 5 : false),
      setFillStyle: jest.fn(),
    };
  
    jest.spyOn(scene, 'createScanPulse').mockImplementation(() => {});
    jest.spyOn(scene, 'showHitEffect').mockImplementation(() => {});
    jest.spyOn(scene, 'showCaption').mockImplementation(() => {});
  
    scene.handleSpotClick(mockSpot);
  
    expect(scene.showCaption).toHaveBeenCalledWith(expect.stringContaining("Quantum state reset"));
  });

  it('should reset clicks and tile styles on resetProgress', () => {
    scene.correctClicks = 2;
  
    const mockSpot = {
      setData: jest.fn(),
      setFillStyle: jest.fn()
    };
  
    scene.possibleSpots = [mockSpot, mockSpot, mockSpot];
    scene.cameras = { main: { shake: jest.fn() } };
  
    scene.resetProgress();
  
    expect(scene.correctClicks).toBe(0);
    expect(mockSpot.setData).toHaveBeenCalledWith('clicked', false);
    expect(mockSpot.setFillStyle).toHaveBeenCalledWith(0x000044, 0.2);
  });

  it('should reveal the correct ship part', () => {
    const mockPart = { setAlpha: jest.fn() };
    scene.shipParts = [mockPart];
    scene.shipPartIndexes = [2];
  
    scene.revealShipPart(2);
  
    expect(mockPart.setAlpha).toHaveBeenCalledWith(1);
  });
  


});