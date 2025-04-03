import Level1Scene from '../scenes/Level1Scene';

describe('Level1Scene', () => {
  let scene;
  let mockAdd;
  let mockScale;

  beforeEach(() => {
    // Mock Phaser's scene methods
    scene = new Level1Scene();
    mockAdd = jest.fn(() => ({
      setOrigin: jest.fn().mockReturnThis(),
      setDisplaySize: jest.fn().mockReturnThis(),
      setInteractive: jest.fn().mockReturnThis(),
      destroy: jest.fn(),
      setText: jest.fn(),
      setFill: jest.fn(),
    }));
    mockScale = { width: 800, height: 600 };

    scene.add = {
      image: mockAdd,
      text: mockAdd,
      circle: mockAdd
    };
    scene.scale = mockScale;
    scene.tweens = { add: jest.fn() };
  });

  test('should initialize scene correctly', () => {
    scene.create();
    
    expect(mockAdd).toHaveBeenCalled(); // Checks that Phaser's `add` was called
    expect(scene.scannerActive).toBe(false);
  });

  test('should show quiz after clearing stars', () => {
    scene.clearStars = jest.fn();
    scene.showQuiz();

    expect(scene.clearStars).toHaveBeenCalled();
    expect(mockAdd).toHaveBeenCalledTimes(5); // One for question, four for answers
  });

  test('should clear quiz on correct or incorrect answer', () => {
    scene.clearQuiz();
    expect(mockAdd().destroy).toHaveBeenCalled(); // Ensure all text elements are destroyed
  });

  test('should activate quantum scanner on correct answer', () => {
    scene.scannerActive = false;
    scene.checkAnswer("B) To securely distribute encryption keys", "B) To securely distribute encryption keys");

    expect(scene.scannerActive).toBe(true);
    expect(mockAdd().setText).toHaveBeenCalledWith("Quantum Scanner: Active");
  });

  test('should deactivate quantum scanner on incorrect answer', () => {
    scene.scannerActive = true;
    scene.checkAnswer("A) To increase internet speed", "B) To securely distribute encryption keys");

    expect(scene.scannerActive).toBe(false);
    expect(mockAdd().setText).toHaveBeenCalledWith("Quantum Scanner: Disabled");
  });

  test('should display stars correctly', () => {
    scene.scannerActive = true;
    scene.showStars();

    expect(scene.stars.length).toBeGreaterThan(0);
    expect(mockAdd).toHaveBeenCalled();
  });

  test('should show lost ship animation on correct star selection', () => {
    const mockStar = { x: 100, y: 200, correct: true };
    scene.revealLostShip(mockStar);

    expect(scene.tweens.add).toHaveBeenCalled();
  });

  test('should reset and show quiz when selecting incorrect star', () => {
    scene.showQuiz = jest.fn();
    scene.clearStars = jest.fn();
    const mockStar = { correct: false };

    scene.checkStar(mockStar);
    
    expect(scene.clearStars).toHaveBeenCalled();
    expect(scene.showQuiz).toHaveBeenCalled();
  });
});