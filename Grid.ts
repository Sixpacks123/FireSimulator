import { Cell, TerrainType, HumidityLevel } from './Cell';

export class Grid {
  size: number;
  cells: Cell[][];

  constructor(size: number, vegetationCoverage: number, humidity: HumidityLevel) {
    this.size = size;
    this.cells = this.generateGrid(size, vegetationCoverage, humidity);
  }

  private generateGrid(size: number, vegetationCoverage: number, humidity: HumidityLevel): Cell[][] {
    return Array.from({ length: size }, () =>
      Array.from({ length: size }, () => {
        const isVegetation = Math.random() < vegetationCoverage;
        return new Cell(isVegetation ? 'vegetation' : 'inert', humidity);
      })
    );
  }

  addRoad(): void {
    const midRow = Math.floor(this.size / 2);
    for (let col = 0; col < this.size; col++) {
      this.cells[midRow][col] = new Cell('inert', 'wet');
    }
  }

  igniteInitialCells(specificCell?: { x: number; y: number }): void {
    if (specificCell) {
      const { x, y } = specificCell;
      const cell = this.cells[x][y];
      if (cell.type === 'vegetation' && cell.state === 'intact') {
        cell.ignite();
      }
    } else {
      let ignited = 0;
      while (ignited < 1) {
        const x = 0; // Toujours sur la première ligne
        const y = Math.floor(Math.random() * this.size);
        const cell = this.cells[x][y];
        if (cell.type === 'vegetation' && cell.state === 'intact') {
          cell.ignite();
          ignited++;
        }
      }
    }
  }
}
