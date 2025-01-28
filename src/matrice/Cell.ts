export enum CellState {
  Empty,
  Vegetation,
  Burning,
  BurnedHot,
  BurnedCold
}

export enum SoilMoisture {
  Wet = 0.1,
  Normal = 0.3,
  Dry = 0.6,
  VeryDry = 0.9
}

export class Cell {
  private state: CellState;
  private burnTimer: number;
  private moisture: SoilMoisture;

  constructor(state: CellState = CellState.Vegetation, moisture: SoilMoisture = SoilMoisture.Normal) {
    this.state = state;
    this.burnTimer = 0;
    this.moisture = moisture;
  }

  public setState(state: CellState): void {
    this.state = state;
    if (state === CellState.Burning) {
      this.burnTimer = 2; // Brûle pendant 2 itérations
    }
  }

  public getState(): CellState {
    return this.state;
  }

  public getMoisture(): SoilMoisture {
    return this.moisture;
  }

  public setMoisture(moisture: SoilMoisture): void {
    this.moisture = moisture;
  }

  public update(): void {
    if (this.state === CellState.Burning) {
      if (this.burnTimer > 0) {
        this.burnTimer--;
      }
      if (this.burnTimer === 0) {
        this.state = CellState.BurnedHot;
      }
    } else if (this.state === CellState.BurnedHot) {
      if (Math.random() < 0.4) {
        this.state = CellState.BurnedCold;
      }
    }
  }

  public canCatchFire(): boolean {
    return this.state === CellState.Vegetation;
  }

  public tryToCatchFire(): boolean {
    if (this.canCatchFire()) {
      if (Math.random() < this.moisture) {
        this.setState(CellState.Burning);
        return true;
      }
    }
    return false;
  }
}
