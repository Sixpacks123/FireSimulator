import { Cell, CellState, SoilMoisture } from './Cell';
import { Wind, WindDirection } from './Wind';
import { getSparkMatrix } from './spark';

export enum TerrainType {
  Continuous = 1.0,
  SlightlySpaced = 0.95,
  Spaced = 0.8,
  Scattered = 0.5
}

export class Grid {
  private cells: Cell[][];
  private width: number;
  private height: number;
  private wind: Wind;

  constructor(width: number, height: number, terrainType: TerrainType) {
    this.width = width;
    this.height = height;
    this.wind = new Wind();
    this.cells = Array(height).fill(null).map(() => 
      Array(width).fill(null).map(() => {
        if (Math.random() < terrainType) {
          return new Cell(CellState.Vegetation);
        }
        return new Cell(CellState.Empty);
      })
    );
  }

  public initializeFireSpots(spots: [number, number][]): void {
    spots.forEach(([x, y]) => {
      if (this.isValidPosition(x, y)) {
        this.cells[y][x].setState(CellState.Burning);
      }
    });
  }

  private isValidPosition(x: number, y: number): boolean {
    return x >= 0 && x < this.width && y >= 0 && y < this.height;
  }

  public setMoisture(moisture: SoilMoisture): void {
    this.cells.forEach(row => 
      row.forEach(cell => cell.setMoisture(moisture))
    );
  }

  public setRoadCell(x: number, y: number): void {
    if (this.isValidPosition(x, y)) {
      this.cells[y][x] = new Cell(CellState.Empty);
    }
  }

  public clearRoads(): void {
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        if (this.cells[y][x].getState() === CellState.Empty) {
          this.cells[y][x] = new Cell(CellState.Vegetation);
        }
      }
    }
  }

  public update(): void {
    // First update all cells
    this.cells.forEach(row => row.forEach(cell => cell.update()));

    // Then handle fire propagation
    const sparkMatrix = getSparkMatrix(this.wind.getForce(), this.wind.getDirection());
    const matrixCenter = Math.floor(sparkMatrix.length / 2);

    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        const cell = this.cells[y][x];
        if (cell.getState() === CellState.Burning || cell.getState() === CellState.BurnedHot) {
          this.propagateFire(x, y, sparkMatrix, matrixCenter);
        }
      }
    }
  }

  private propagateFire(x: number, y: number, sparkMatrix: number[][], center: number): void {
    for (let dy = 0; dy < sparkMatrix.length; dy++) {
      for (let dx = 0; dx < sparkMatrix[0].length; dx++) {
        const targetX = x + (dx - center);
        const targetY = y + (dy - center);
        
        if (this.isValidPosition(targetX, targetY)) {
          const probability = sparkMatrix[dy][dx];
          if (Math.random() < probability * (1 + this.wind.getForce())) {
            this.cells[targetY][targetX].tryToCatchFire();
          }
        }
      }
    }
  }

  public getState(): { cells: CellState[][], stats: SimulationStats } {
    const cellStates = this.cells.map(row => 
      row.map(cell => cell.getState())
    );

    return {
      cells: cellStates,
      stats: this.calculateStats()
    };
  }

  private calculateStats(): SimulationStats {
    let burning = 0, vegetation = 0, burned = 0, empty = 0;
    this.cells.forEach(row => 
      row.forEach(cell => {
        switch (cell.getState()) {
          case CellState.Burning: burning++; break;
          case CellState.Vegetation: vegetation++; break;
          case CellState.BurnedCold:
          case CellState.BurnedHot: burned++; break;
          case CellState.Empty: empty++; break;
        }
      })
    );

    const total = this.width * this.height;
    return {
      burning: (burning / total) * 100,
      vegetation: (vegetation / total) * 100,
      burned: (burned / total) * 100,
      empty: (empty / total) * 100
    };
  }

  public getWind(): Wind {
    return this.wind;
  }
}

export interface SimulationStats {
  burning: number;
  vegetation: number;
  burned: number;
  empty: number;
}
