export enum WindDirection {
  North = 0,
  East = 90,
  South = 180,
  West = 270
}

export type WindForce = 0 | 1 | 2 | 3;

export class Wind {
  private force: WindForce;
  private direction: WindDirection;

  constructor(initialForce: WindForce = 0, initialDirection: WindDirection = WindDirection.North) {
    this.force = initialForce;
    this.direction = initialDirection;
  }

  public setForce(force: number): void {
    if (force >= 0 && force <= 3) {
      this.force = force as WindForce;
    }
  }

  public setDirection(direction: WindDirection): void {
    this.direction = direction;
  }

  public getForce(): WindForce {
    return this.force;
  }

  public getDirection(): WindDirection {
    return this.direction;
  }
}
