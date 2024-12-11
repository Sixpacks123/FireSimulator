export type TerrainType = 'vegetation' | 'inert';
export type HumidityLevel = 'wet' | 'normal' | 'dry' | 'very_dry';
export type VegetationState = 'intact' | 'burning' | 'burned_hot' | 'burned_cold';
export type InertState = 'inert';
export type CellState = VegetationState | InertState;

export class Cell {
  type: TerrainType;
  humidity: HumidityLevel;
  state: CellState;
  burnIterations: number;

  constructor(type: TerrainType, humidity: HumidityLevel) {
    this.type = type;
    this.humidity = humidity;
    this.state = type === 'vegetation' ? 'intact' : 'inert';
    this.burnIterations = 0;
  }

  getIgnitionProbability(): number {
    if (this.type !== 'vegetation' || this.state !== 'intact') return 0;
    switch (this.humidity) {
      case 'wet': return 0.1;
      case 'normal': return 0.3;
      case 'dry': return 0.6;
      case 'very_dry': return 0.9;
    }
  }

  ignite(): void {
    if (this.type === 'vegetation' && this.state === 'intact') {
      this.state = 'burning';
    }
  }

  updateState(): void {
    if (this.type === 'vegetation') {
      if (this.state === 'burning') {
        this.burnIterations++;
        if (this.burnIterations >= 2) {
          this.state = 'burned_hot';
        }
      } else if (this.state === 'burned_hot') {
        this.state = Math.random() < 0.4 ? 'burned_cold' : 'burned_hot';
      }
    }
  }
}
