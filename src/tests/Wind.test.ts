import { Wind, WindDirection, WindForce } from '../matrice/Wind';

describe('Wind', () => {
  let wind: Wind;

  beforeEach(() => {
    wind = new Wind();
  });

  test('devrait initialiser avec les valeurs par défaut', () => {
    expect(wind.getForce()).toBe(0);
    expect(wind.getDirection()).toBe(WindDirection.North);
  });

  test('devrait permettre de définir la force du vent', () => {
    wind.setForce(2);
    expect(wind.getForce()).toBe(2);
  });

  test('devrait limiter la force du vent entre 0 et 3', () => {
    wind.setForce(-1);
    expect(wind.getForce()).toBe(0);
    
    wind.setForce(5);
    expect(wind.getForce()).toBe(3);
  });

  test('devrait changer la direction du vent', () => {
    wind.setDirection(WindDirection.East);
    expect(wind.getDirection()).toBe(WindDirection.East);
    
    wind.setDirection(WindDirection.South);
    expect(wind.getDirection()).toBe(WindDirection.South);
  });

  test('devrait maintenir les valeurs correctes après plusieurs changements', () => {
    // Séquence de changements
    wind.setForce(2);
    wind.setDirection(WindDirection.East);
    expect(wind.getForce()).toBe(2);
    expect(wind.getDirection()).toBe(WindDirection.East);
    
    wind.setForce(1);
    wind.setDirection(WindDirection.West);
    expect(wind.getForce()).toBe(1);
    expect(wind.getDirection()).toBe(WindDirection.West);
  });
});
