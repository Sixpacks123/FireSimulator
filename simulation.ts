import { Grid } from './Grid';
import { Cell } from './Cell';
import { Wind, WindDirection } from './Wind';

export const SPARK_PROBABILITIES = {
  0: [ // Vent nul
    [0, 0.01, 0.01, 0.01, 0],
    [0.01, 0.2, 0.3, 0.2, 0.01],
    [0.01, 0.3, 0, 0.3, 0.01],
    [0.01, 0.2, 0.3, 0.2, 0.01],
    [0, 0.01, 0.01, 0.01, 0],
  ],
  1: [ // Vent faible
    [0.1, 0.2, 0.1],
    [0.3, 0, 0.3],
    [0.3, 0.4, 0.3],
    [0.02, 0.05, 0.02],
  ],
  2: [ // Vent fort
    [0.05, 0.1, 0.05],
    [0.25, 0, 0.25],
    [0.4, 0.5, 0.4],
    [0.05, 0.1, 0.05],
    [0, 0.01, 0],
  ],
  3: [ // Vent très fort
    [0.005, 0.01, 0.005],
    [0.1, 0, 0.1],
    [0.5, 0.7, 0.5],
    [0.2, 0.3, 0.2],
    [0.01, 0.05, 0.01],
  ],
};

export class Simulation {
  grid: Grid;
  wind: Wind;

  constructor(
    size: number,
    terrainType: 'continuous' | 'sparse' | 'scattered' | 'very_sparse',
    humidity: 'wet' | 'normal' | 'dry' | 'very_dry',
    windForce: number,
    windDirection: WindDirection = 'north',
    initialFireCell?: { x: number; y: number } // Cellule spécifique optionnelle
  ) {
    const coverage = this.getCoverage(terrainType);
    this.grid = new Grid(size, coverage, humidity);
    this.wind = new Wind(windForce, windDirection);
    this.grid.igniteInitialCells(initialFireCell); // Passe la cellule spécifique ou allume aléatoirement
  }
  
  private getCoverage(terrainType: 'continuous' | 'sparse' | 'scattered' | 'very_sparse'): number {
    switch (terrainType) {
      case 'continuous': return 1;
      case 'sparse': return 0.95;
      case 'scattered': return 0.8;
      case 'very_sparse': return 0.5;
    }
  }

  /**
   * Renvoie les voisins d'une cellule, triés par la direction et la force du vent.
   */
  private getNeighborsWithWind(x: number, y: number): { nx: number; ny: number; probability: number }[] {
    const probabilities = SPARK_PROBABILITIES[this.wind.force];
    const offset = Math.floor(probabilities.length / 2);

    const neighbors: { nx: number; ny: number; probability: number }[] = [];

    for (let dx = -offset; dx <= offset; dx++) {
      for (let dy = -offset; dy <= offset; dy++) {
        const nx = x + dx;
        const ny = y + dy;

        if (nx >= 0 && nx < this.grid.size && ny >= 0 && ny < this.grid.size) {
          const probability = probabilities[dx + offset][dy + offset];
          if (probability > 0) {
            neighbors.push({ nx, ny, probability });
          }
        }
      }
    }

    // Trie les voisins en fonction de la direction du vent (nord favorisé)
    return neighbors.sort((a, b) => b.probability - a.probability);
  }

  /**
   * Propagation des étincelles depuis une cellule brûlée.
   */
/**
 * Propagation des étincelles depuis une cellule brûlée.
 */
propagateSparks(x: number, y: number): void {
    const probabilities = SPARK_PROBABILITIES[this.wind.force];
    const offset = Math.floor(probabilities.length / 2);
  
    for (let dx = -offset; dx <= offset; dx++) {
      for (let dy = -offset; dy <= offset; dy++) {
        const nx = x + dx;
        const ny = y + dy;
  
        if (nx >= 0 && nx < this.grid.size && ny >= 0 && ny < this.grid.size) {
          const cell = this.grid.cells[nx][ny];
          const baseProbability = probabilities[dx + offset][dy + offset];
          const adjustedProbability = baseProbability * (1 + this.wind.force * 0.005); // Ajustement avec la force du vent
  
          if (
            cell.type === 'vegetation' &&
            cell.state === 'intact' &&
            Math.random() < adjustedProbability
          ) {
            cell.ignite();
          }
        }
      }
    }
  }
  

  /**
   * Effectue une étape de la simulation.
   */
  step(): boolean {
    let fireStillBurning = false;

    this.grid.cells.forEach((row, x) => {
      row.forEach((cell, y) => {
        if (cell.state === 'burning') {
          this.propagateSparks(x, y); // Propage des étincelles
        }

        cell.updateState();

        if (cell.state === 'burning') {
          fireStillBurning = true;
        }
      });
    });

    return fireStillBurning;
  }

  /**
   * Renvoie les statistiques actuelles de la grille.
   */
  getStatistics(): { burned: number; burning: number; intact: number; inert: number } {
    const stats = { burned: 0, burning: 0, intact: 0, inert: 0 };

    this.grid.cells.forEach(row => {
      row.forEach(cell => {
        switch (cell.state) {
          case 'burning': stats.burning++; break;
          case 'burned_hot':
          case 'burned_cold': stats.burned++; break;
          case 'intact': stats.intact++; break;
          case 'inert': stats.inert++; break;
        }
      });
    });

    return stats;
  }
}
