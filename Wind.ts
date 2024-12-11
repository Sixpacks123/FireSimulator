export type WindDirection = 'north' | 'east' | 'south' | 'west';

export class Wind {
  force: 0 | 1 | 2 | 3; // 0: nul, 3: très fort
  direction: WindDirection;

  constructor(force: number, direction: WindDirection) {
    this.force = Math.max(0, Math.min(3, force)) as 0 | 1 | 2 | 3;
    this.direction = direction;
  }
}
