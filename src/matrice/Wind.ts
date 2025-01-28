export enum WindDirection {
  North = 0,
  East = 90,
  South = 180,
  West = 270
}

export class Wind {
  private force: number;
  private direction: WindDirection;

  constructor(initialForce: number = 0, initialDirection: WindDirection = WindDirection.North) {
    this.force = initialForce;
    this.direction = initialDirection;
  }

  public setForce(force: number): void {
    if (force >= 0 && force <= 3) {
      this.force = force;
    }
  }

  public setDirection(direction: WindDirection): void {
    this.direction = direction;
  }

  public getForce(): number {
    return this.force;
  }

  public getDirection(): WindDirection {
    return this.direction;
  }
}
