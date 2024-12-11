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
      if (x >= 0 && x < this.size && y >= 0 && y < this.size) {
        const cell = this.cells[x][y];
        if (cell.type === 'vegetation' && cell.state === 'intact') {
          cell.ignite();
          console.log(`La cellule (${x}, ${y}) a été allumée.`);
        } else {
          console.warn(`La cellule (${x}, ${y}) ne peut pas prendre feu (non inflammable ou déjà en feu).`);
        }
      } else {
        console.warn(`Coordonnées (${x}, ${y}) hors de la grille.`);
      }
    } else {
      // Mode aléatoire
      let ignited = 0;
      while (ignited < 1) { // Allume une seule case aléatoire
        const x = Math.floor(Math.random() * this.size);
        const y = Math.floor(Math.random() * this.size);
        const cell = this.cells[x][y];
        if (cell.type === 'vegetation' && cell.state === 'intact') {
          cell.ignite();
          console.log(`La cellule (${x}, ${y}) a été allumée (aléatoire).`);
          ignited++;
        }
      }
    }
  }
  
}
