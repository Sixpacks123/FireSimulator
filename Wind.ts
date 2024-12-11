export type WindDirection = 'north' | 'east' | 'south' | 'west';

export class Wind {
  force: 0 | 1 | 2 | 3; // Force du vent limitée aux valeurs acceptées
  direction: WindDirection;

  constructor(force: number, direction: WindDirection) {
    if (![0, 1, 2, 3].includes(force)) {
        throw new Error('Invalid wind force. Must be 0, 1, 2, or 3.');
      }
      this.force = force as 0 | 1 | 2 | 3;
    this.direction = direction;
  }

  /**
   * Retourne un poids de probabilité pour chaque voisin en fonction du vent.
   */
  getDirectionWeights(): { [key: string]: number } {
    switch (this.direction) {
      case 'north':
        return { north: 1.0 + this.force * 0.2, east: 0.5, south: 0.3, west: 0.5 };
      case 'east':
        return { north: 0.5, east: 1.0 + this.force * 0.2, south: 0.5, west: 0.3 };
      case 'south':
        return { north: 0.3, east: 0.5, south: 1.0 + this.force * 0.2, west: 0.5 };
      case 'west':
        return { north: 0.5, east: 0.3, south: 0.5, west: 1.0 + this.force * 0.2 };
    }
  }
}